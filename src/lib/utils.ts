import {
  InternalSearchable,
  NavigationGroup,
  NavigationGroupItem,
  NavigationNode,
  NavigationRouteItem,
} from '@/types/navigation';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export class NavigationManager {
  private readonly groups: NavigationGroup[];
  private readonly pathIndex: ReadonlyMap<string, NavigationGroupItem>;
  private readonly searchableItems: ReadonlyArray<InternalSearchable>;
  private readonly collator: Intl.Collator;

  constructor(navigationGroups: NavigationGroup[]) {
    this.collator = new Intl.Collator(undefined, {
      sensitivity: 'base',
      numeric: true,
    });

    const pathIndexMap = new Map<string, NavigationGroupItem>();
    const searchableList: InternalSearchable[] = [];

    this.groups = this.processLevel(navigationGroups, pathIndexMap, searchableList);

    searchableList.sort((a, b) => this.collator.compare(a.label, b.label));

    this.pathIndex = pathIndexMap;
    this.searchableItems = Object.freeze(searchableList);
  }

  private processLevel<T extends NavigationNode>(
    items: T[],
    pathIndexMap: Map<string, NavigationGroupItem>,
    searchableList: InternalSearchable[]
  ): T[] {
    const sorted = this.sortItems([...items]);

    for (const item of sorted) {
      this.processItem(item, pathIndexMap, searchableList);

      if (item.items?.length) {
        item.items = this.processLevel(item.items, pathIndexMap, searchableList);
      }
    }

    return sorted;
  }

  private sortItems<T extends NavigationNode>(items: T[]): T[] {
    return items.sort((a, b) => {
      if (a.todo && !b.todo) return 1;
      if (!a.todo && b.todo) return -1;

      return this.collator.compare(a.label, b.label);
    });
  }

  private processItem(
    item: NavigationGroupItem,
    pathIndexMap: Map<string, NavigationGroupItem>,
    searchableList: InternalSearchable[]
  ): void {
    const routeItem = item as NavigationRouteItem;

    if (!this.isValidRouteItem(routeItem)) {
      return;
    }

    const navItem = this.createNavigationItem(routeItem);
    pathIndexMap.set(routeItem.path, navItem);

    const searchableItem = this.createSearchableItem(routeItem);
    searchableList.push(searchableItem);
  }

  private isValidRouteItem(item: NavigationGroupItem): item is NavigationRouteItem {
    const routeItem = item as NavigationRouteItem;
    return Boolean(routeItem.path && !routeItem.todo);
  }

  private createNavigationItem(routeItem: NavigationRouteItem): NavigationGroupItem {
    return {
      label: routeItem.label,
      path: routeItem.path,
      fullName: routeItem.fullName ?? routeItem.label,
      tags: routeItem.tags ?? [],
      summary: routeItem.summary ?? '',
      todo: routeItem.todo ?? false,
      sourceUrl: routeItem.sourceUrl ?? '',
    };
  }

  private createSearchableItem(routeItem: NavigationRouteItem): InternalSearchable {
    const label = routeItem.label;
    const fullName = routeItem.fullName ?? label;
    const tags = routeItem.tags ?? [];

    return {
      ...routeItem,
      label,
      fullName,
      tags,
      searchBlob: this.buildSearchBlob(fullName, label, tags),
    };
  }

  private buildSearchBlob(fullName: string, label: string, tags: string[]): string {
    return `${fullName}|${label}|${tags.join('|')}`.toLowerCase();
  }

  public getGroups(): NavigationGroup[] {
    return this.groups;
  }

  public getSearchableItems(): ReadonlyArray<NavigationRouteItem> {
    return this.searchableItems;
  }

  public getItemByPath(path: string): NavigationGroupItem | undefined {
    return this.pathIndex.get(path);
  }

  public fuzzySearch(query: string): NavigationRouteItem[] {
    if (!query?.trim()) {
      return [];
    }

    const normalizedQuery = query.toLowerCase().trim();

    return this.searchableItems.filter((item) => item.searchBlob.includes(normalizedQuery));
  }

  public getGroupFlatRouteItems(nodes: NavigationGroupItem[] = this.groups) {
    const result: NavigationGroup[] = [];

    for (const node of nodes) {
      if ('items' in node && node.items?.length) {
        const directRoutes = node.items.filter((item): item is NavigationRouteItem =>
          this.isValidRouteItem(item)
        );

        const nestedGroups = node.items.filter(
          (item): item is NavigationGroup => !this.isValidRouteItem(item) && 'items' in item
        );

        if (directRoutes.length) {
          result.push({
            ...node,
            items: directRoutes,
          } as NavigationGroup);
        }

        if (nestedGroups.length) {
          const flattenedNested = this.getGroupFlatRouteItems(nestedGroups);
          result.push(...flattenedNested);
        }
      }
    }

    return result as (Omit<NavigationGroup, 'items'> & {
      items: NavigationRouteItem[];
    })[];
  }
}
