'use client';

import { ExternalLink } from 'lucide-react';
import { Button } from './ui/button';
import { SidebarTrigger } from './ui/sidebar';
import { ThemeModeToggle } from './theme-mode-toggle';
import { usePathname } from 'next/navigation';
import { NAVIGATION } from '@/lib/navigation';
import { useIsMobile } from '@/hooks/use-mobile';

export const Header: React.FC = () => {
  const isMobile = useIsMobile();
  const pathname = usePathname();
  const navigationItem = NAVIGATION.getItemByPath(pathname);

  if (!navigationItem) return null;

  return (
    <>
      <div className="bg-sidebar border-b w-full p-1 px-2 md:p-2 flex gap-2 items-center justify-between h-(--header-height) fixed top-0 left-0 md:static z-50">
        <SidebarTrigger variant="outline" className="size-9" />

        <div className="flex gap-2 min-w-0">
          <h1 className="text-xl md:text-2xl font-light text-card-foreground whitespace-nowrap overflow-hidden text-ellipsis">
            {navigationItem.fullName || navigationItem.label}
          </h1>

          {navigationItem.sourceUrl && (
            <Button asChild size="icon-sm" variant="ghost" className="size-6 ml-auto">
              <a href={navigationItem.sourceUrl} target="_blank" rel="noopener noreferrer">
                <ExternalLink />
              </a>
            </Button>
          )}
        </div>

        <ThemeModeToggle />
      </div>

      {isMobile && <div className="h-(--header-height)" />}
    </>
  );
};
