export interface NavigationNode {
  label: string;
  items?: NavigationGroupItem[];
  todo?: boolean;
  tags?: string[];
}

export interface NavigationGroup extends NavigationNode {
  fullName?: string;
  icon?: React.ReactNode;
  sourceUrl?: string;
  summary?: string;
}

export type NavigationGroupItem = NavigationGroup | NavigationRouteItem;

export interface NavigationRouteItem extends Omit<NavigationGroup, 'items'> {
  path: string;
}

export type InternalSearchable = NavigationRouteItem & { searchBlob: string };
