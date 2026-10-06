import { NavigationGroupItem } from '@/types/navigation';

export const testIdSegment = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

export function isDescendantActive(item: NavigationGroupItem, currentPath: string): boolean {
  if ('path' in item && item.path && currentPath.startsWith(item.path)) {
    return true;
  }

  if ('items' in item && item.items) {
    return item.items.some((subItem) => isDescendantActive(subItem, currentPath));
  }

  return false;
}
