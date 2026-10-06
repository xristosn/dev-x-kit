'use client';

import { NavigationGroupItem } from '@/types/navigation';

import { usePathname } from 'next/navigation';
import { SidebarGroupEntry } from './sidebar-group-entry';
import { SidebarRouteItem } from './sidebar-route-item';
import { SidebarTodoItem } from './sidebar-todo-item';
import { isDescendantActive } from './sidebar-group-item.utils';

export type SidebarGroupItemProps = NavigationGroupItem & { level?: number };

export const SidebarGroupItem: React.FC<SidebarGroupItemProps> = (props) => {
  const { label, level = 1, todo, icon = null } = props;
  const items = 'items' in props ? props.items : undefined;
  const path = 'path' in props ? props.path : undefined;
  const currentPath = usePathname();
  const isActive = path === currentPath || isDescendantActive(props, currentPath);

  if (items?.length) {
    return (
      <SidebarGroupEntry
        label={label}
        level={level}
        path={path}
        items={items}
        isActive={isActive}
        renderItem={renderSidebarChild}
      />
    );
  }

  if (todo) return <SidebarTodoItem label={label} icon={icon} />;
  if (!path) return null;

  return <SidebarRouteItem label={label} path={path} icon={icon} isActive={isActive} />;
};

function renderSidebarChild(item: NavigationGroupItem, level: number) {
  return <SidebarGroupItem key={'path' in item ? item.path : item.label} {...item} level={level} />;
}
