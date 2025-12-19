import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader } from '@/components/ui/sidebar';
import { Button } from '../ui/button';
import Link from 'next/link';
import { BsGithub } from 'react-icons/bs';
import { SidebarGroupItem } from './sidebar-group-item';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { SearchDialog } from '../search-dialog';
import { NAVIGATION } from '@/lib/navigation';
import { UserStoragePrefsDialog } from '../storage-prefs-dialog';
import { ClientOnly } from '../client-only';

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
    <Sidebar collapsible="icon">
      <SidebarHeader className="text-center text-lg border-b h-13">
        <Link href="/" className="flex gap-4 items-center justify-center min-h-7">
          <Image
            src="/favicon.png"
            alt=""
            className="size-8 object-contain"
            width={32}
            height={32}
          />

          <p className="font-bold group-data-[collapsible=icon]:hidden opacity-0 animate-[opacity_ease_250ms_350ms_forwards]">
            {'Dev X Kit'.split('').map((l, idx) => (
              <span key={idx} className={cn('inline-flex', animationDelayClasses[idx])}>
                {l === ' ' ? <span className="w-1.5" /> : l}
              </span>
            ))}
          </p>
        </Link>
      </SidebarHeader>

      <SidebarContent className="pt-2">
        <div className="px-1.5">
          <SearchDialog />
        </div>

        {NAVIGATION.getGroups().map((group) => (
          <SidebarGroupItem key={group.label} path="" {...group} />
        ))}
      </SidebarContent>

      <SidebarFooter>
        <div className="flex flex-wrap justify-center gap-2">
          <Button asChild variant="outline" size="icon">
            <a href="https://github.com/xristosn/dev-x-kit" target="_blank">
              <BsGithub />
            </a>
          </Button>

          <ClientOnly>
            <UserStoragePrefsDialog />
          </ClientOnly>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
