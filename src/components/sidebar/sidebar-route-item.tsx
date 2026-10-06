import { cn } from '@/lib/utils';

import Link from 'next/link';
import { Button } from '../ui/button';
import { testIdSegment } from './sidebar-group-item.utils';

type SidebarRouteItemProps = {
  label: string;
  path: string;
  icon: React.ReactNode;
  isActive: boolean;
};

export const SidebarRouteItem: React.FC<SidebarRouteItemProps> = ({
  label,
  path,
  icon,
  isActive,
}) => (
  <Button
    data-testid={`sidebar-route-item-${testIdSegment(path || label)}`}
    variant={isActive ? 'default' : 'link'}
    size="sm"
    className={cn(
      'w-full justify-start border-none p-4 text-sidebar-foreground',
      isActive && 'bg-sidebar-foreground/10 hover:bg-sidebar-foreground/15 rounded-sm'
    )}
    nativeButton={false}
    render={
      <Link href={path} transitionTypes={['nav-forward']}>
        {icon}
        {label}
      </Link>
    }
  />
);
