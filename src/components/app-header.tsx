'use client';

import { cn } from '@/lib/utils';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BsGithub } from 'react-icons/bs';
import { ClientOnly } from './client-only';
import { Container } from './container';
import { SearchDialog } from './search-dialog';
import { UserStoragePrefsDialog } from './storage-prefs-dialog';
import { ThemeModeToggle } from './theme-mode-toggle';
import { Button } from './ui/button';
import { SidebarTrigger } from './ui/sidebar';

export const AppHeader: React.FC = () => {
  const pathname = usePathname();
  const isToolsPage =
    pathname !== '/' && pathname !== '/privacy-policy' && pathname !== '/terms-of-use';

  return (
    <header
      data-testid="app-header"
      className={cn('border-b h-(--app-header) transition-colors', isToolsPage && 'bg-sidebar')}
    >
      <Container
        className={cn(
          'sm:py-3 flex flex-row gap-8 justify-between items-center w-full transition-all',
          isToolsPage && 'max-w-full sm:max-w-full md:max-w-full lg:max-w-full xl:max-w-full'
        )}
      >
        <div className="flex gap-4 items-center sm:w-1/3">
          {isToolsPage && (
            <SidebarTrigger
              data-testid="app-header-sidebar-trigger"
              variant="ghost"
              className="size-9"
            />
          )}

          <Link href="/" className="flex gap-4">
            <Image
              src="/favicon2.png"
              alt="Dev X Kit"
              width={32}
              height={32}
              className="object-contain"
            />
            <p className="hidden sm:block text-xl sm:text-2xl font-light">Dev X Kit</p>
          </Link>
        </div>

        <div className="flex sm:w-2/3 max-w-sm justify-end gap-2">
          <SearchDialog size="lg" />

          <ThemeModeToggle />

          {isToolsPage && (
            <ClientOnly>
              <UserStoragePrefsDialog />
            </ClientOnly>
          )}

          <Button
            nativeButton={false}
            render={
              <a href="https://github.com/xristosn/dev-x-kit" target="_blank">
                <BsGithub />
                <span className="sr-only">Github</span>
              </a>
            }
            variant="outline"
            size="icon"
          />
        </div>
      </Container>
    </header>
  );
};
