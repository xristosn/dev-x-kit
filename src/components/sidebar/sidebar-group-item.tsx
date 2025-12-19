'use client';

import { ChevronDown } from 'lucide-react';

import { NavigationGroup, NavigationGroupItem, NavigationRouteItem } from '@/types/navigation';

import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '../ui/collapsible';
import { SidebarGroup, SidebarGroupContent, SidebarGroupLabel } from '../ui/sidebar';
import { Button } from '../ui/button';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

export interface SidebarGroupItemProps extends NavigationGroup, NavigationRouteItem {
  level?: number;
}

const groupClassnames = [
  'group/collapsible',
  'group/collapsible1',
  'group/collapsible2',
  'group/collapsible3',
  'group/collapsible4',
  'group/collapsible5',
  'group/collapsible6',
  'group/collapsible7',
  'group/collapsible8',
  'group/collapsible9',
  'group/collapsible10',
  'group/collapsible11',
  'group/collapsible12',
  'group/collapsible13',
  'group/collapsible14',
  'group/collapsible15',
  'group/collapsible16',
  'group/collapsible17',
  'group/collapsible18',
  'group/collapsible19',
  'group/collapsible20',
];

const iconClassnames = [
  'group-data-[state=open]/collapsible:rotate-180',
  'group-data-[state=open]/collapsible1:rotate-180',
  'group-data-[state=open]/collapsible2:rotate-180',
  'group-data-[state=open]/collapsible3:rotate-180',
  'group-data-[state=open]/collapsible4:rotate-180',
  'group-data-[state=open]/collapsible5:rotate-180',
  'group-data-[state=open]/collapsible6:rotate-180',
  'group-data-[state=open]/collapsible7:rotate-180',
  'group-data-[state=open]/collapsible8:rotate-180',
  'group-data-[state=open]/collapsible9:rotate-180',
  'group-data-[state=open]/collapsible10:rotate-180',
  'group-data-[state=open]/collapsible11:rotate-180',
  'group-data-[state=open]/collapsible12:rotate-180',
  'group-data-[state=open]/collapsible13:rotate-180',
  'group-data-[state=open]/collapsible14:rotate-180',
  'group-data-[state=open]/collapsible15:rotate-180',
  'group-data-[state=open]/collapsible16:rotate-180',
  'group-data-[state=open]/collapsible17:rotate-180',
  'group-data-[state=open]/collapsible18:rotate-180',
  'group-data-[state=open]/collapsible19:rotate-180',
  'group-data-[state=open]/collapsible20:rotate-180',
];

export const SidebarGroupItem: React.FC<SidebarGroupItemProps> = ({
  label,
  items,
  path,
  level = 1,
  todo,
  icon = null,
}) => {
  const currentPath = usePathname();

  const isSelfActive = path === currentPath;
  const isActive = isSelfActive || isDescendantActive({ items, path, label }, currentPath);

  if (items?.length)
    return (
      <Collapsible
        defaultOpen={isActive}
        key={path || label}
        className={`${groupClassnames[level]} group-data-[collapsible=icon]:hidden`}
      >
        <SidebarGroup className={cn(level === 1 && isActive && 'border-y bg-muted/50')}>
          <SidebarGroupLabel asChild>
            <CollapsibleTrigger className="w-full">
              {icon}

              <span className={cn('text-sm', isActive && 'text-foreground', icon && 'ml-2')}>
                {label}
              </span>

              <ChevronDown className={cn(`ml-auto transition-transform`, iconClassnames[level])} />
            </CollapsibleTrigger>
          </SidebarGroupLabel>

          <CollapsibleContent>
            <SidebarGroupContent
              className="flex flex-col"
              style={{ paddingLeft: `calc(var(--spacing) * ${level + 1})` }}
            >
              {items?.map((item) => (
                <SidebarGroupItem
                  key={(item as NavigationRouteItem).path || item.label}
                  path={(item as NavigationRouteItem).path || ''}
                  {...item}
                  level={level + 1}
                />
              ))}
            </SidebarGroupContent>
          </CollapsibleContent>
        </SidebarGroup>
      </Collapsible>
    );

  if (todo) {
    return (
      <Button
        variant="link"
        size="sm"
        className="w-full justify-start text-muted-foreground cursor-default select-none hover:no-underline"
      >
        {icon}

        {label}

        <sup className="text-[.65rem] py-2 px-1 rounded-xl bg-accent/50 text-accent-foreground">
          Todo
        </sup>
      </Button>
    );
  }

  return (
    <Button
      asChild
      variant="link"
      size="sm"
      className={cn(isActive && 'underline', 'w-full justify-start')}
    >
      <Link href={path as string}>
        {icon}
        {label}
      </Link>
    </Button>
  );
};

function isDescendantActive(item: NavigationGroupItem, currentPath: string): boolean {
  const routeItem = item as NavigationRouteItem;
  if (routeItem.path && currentPath.startsWith(routeItem.path)) {
    return true;
  }

  const displayItem = item as NavigationGroup;
  if (displayItem.items) {
    return displayItem.items.some((subItem) => isDescendantActive(subItem, currentPath));
  }

  return false;
}
