import { SidebarContent, SidebarHeader } from '@/components/ui/sidebar';
import { NAVIGATION } from '@/lib/navigation';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import Link from 'next/link';
import { SidebarGroupItem } from './sidebar-group-item';
import { SidebarShell } from './sidebar-shell';

const animationDelayClasses = [
  'animate-[ping_1s_ease-in-out_forwards_reverse]',
  'animate-[ping_1s_50ms_ease-in-out_forwards_reverse]',
  'animate-[ping_1s_100ms_ease-in-out_forwards_reverse]',
  '',
  'animate-[ping_1s_300ms_ease-in-out_forwards_reverse]',
  '',
  'animate-[ping_1s_100ms_ease-in-out_forwards_reverse]',
  'animate-[ping_1s_50ms_ease-in-out_forwards_reverse]',
  'animate-[ping_1s_ease-in-out_forwards_reverse]',
];

export function AppSidebar() {
  return (
    <SidebarShell>
      <SidebarHeader className="shrink-0 text-center text-lg border-b h-13 md:hidden">
        <Link href="/" className="flex gap-4 items-center justify-center min-h-7">
          <Image
            src="/favicon.png"
            alt=""
            className="size-8 object-contain"
            width={32}
            height={32}
          />

          <p className="font-light group-data-[collapsible=icon]:hidden opacity-0 animate-[opacity_ease_250ms_350ms_forwards]">
            {'Dev X Kit'.split('').map((l, idx) => (
              <span key={idx} className={cn('inline-flex', animationDelayClasses[idx])}>
                {l === ' ' ? <span className="w-1.5" /> : l}
              </span>
            ))}
          </p>
        </Link>
      </SidebarHeader>

      <SidebarContent data-testid="app-sidebar-content" className="px-2">
        {NAVIGATION.getGroups().map((group) => (
          <SidebarGroupItem key={group.label} {...group} />
        ))}
      </SidebarContent>
    </SidebarShell>
  );
}
