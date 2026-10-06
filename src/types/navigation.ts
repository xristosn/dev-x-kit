export type ToolCategory = 'Data Converters' | 'Code Converters' | 'CSS' | 'Colors' | 'Utilities';

export type NavigationNode = {
  label: string;
  path?: string;
  items?: NavigationGroupItem[];
  todo?: boolean;
  tags?: string[];
  categories?: ToolCategory[];
};

export type NavigationGroup = NavigationNode & {
  fullName?: string;
  pageTitle?: string;
  icon?: React.ReactNode;
  sourceUrl?: string;
  summary?: string;
  serverAction?: boolean;
};

export type NavigationGroupItem = NavigationGroup | NavigationRouteItem;

export type NavigationRouteItem = Omit<NavigationGroup, 'items'> & {
  path: string;
  categories?: ToolCategory[];
};

export type NavigationBreadcrumbItem = {
  label: string;
  href?: string;
};

export type InternalSearchable = NavigationRouteItem & { searchBlob: string };
