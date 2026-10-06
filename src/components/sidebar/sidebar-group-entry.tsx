'use client';

import { ChevronDown } from 'lucide-react';
import { useState } from 'react';

import { NavigationGroupItem } from '@/types/navigation';

import { cn } from '@/lib/utils';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '../ui/collapsible';
import { SidebarGroup, SidebarGroupContent, SidebarGroupLabel } from '../ui/sidebar';
import { testIdSegment } from './sidebar-group-item.utils';

type SidebarGroupEntryProps = {
  label: string;
  level: number;
  path?: string;
  items: NavigationGroupItem[];
  isActive: boolean;
  renderItem: (item: NavigationGroupItem, level: number) => React.ReactNode;
};

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

export const SidebarGroupEntry: React.FC<SidebarGroupEntryProps> = ({
  label,
  level,
  path,
  items,
  isActive,
  renderItem,
}) => {
  const [open, setOpen] = useState(isActive);

  return (
    <Collapsible
      open={open}
      onOpenChange={setOpen}
      key={path || label}
      className={`${groupClassnames[level]} group-data-[collapsible=icon]:hidden w-full`}
    >
      <SidebarGroup className={cn('border-0 py-2 px-0 w-full', level > 1 && 'pl-2')}>
        <SidebarGroupLabel
          render={
            <CollapsibleTrigger
              data-testid={`sidebar-group-trigger-${testIdSegment(path || label)}`}
              className="w-full"
            >
              <span className={cn('text-sm', isActive && 'text-foreground')}>{label}</span>

              <ChevronDown className={cn(`ml-auto transition-transform`, iconClassnames[level])} />
            </CollapsibleTrigger>
          }
        />

        <CollapsibleContent data-testid={`sidebar-group-content-${testIdSegment(path || label)}`}>
          <SidebarGroupContent className="flex flex-col items-start">
            {items.map((item) => renderItem(item, level + 1))}
          </SidebarGroupContent>
        </CollapsibleContent>
      </SidebarGroup>
    </Collapsible>
  );
};
