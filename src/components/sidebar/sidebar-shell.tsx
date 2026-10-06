'use client';

import type { ReactNode } from 'react';
import { Sidebar, useSidebar } from '@/components/ui/sidebar';
import { Sheet, SheetContent, SheetDescription, SheetTitle } from '@/components/ui/sheet';

export function SidebarShell({ children }: { children: ReactNode }) {
  const { isMobile, state, openMobile, setOpenMobile } = useSidebar();

  if (isMobile) {
    return (
      <Sheet open={openMobile} onOpenChange={setOpenMobile}>
        <SheetContent
          side="left"
          className="bg-sidebar p-0 text-sidebar-foreground data-[side=left]:h-dvh data-[side=left]:w-full data-[side=left]:sm:max-w-none *:data-[slot=sheet-close]:top-2.5"
        >
          <SheetTitle className="sr-only">Tools</SheetTitle>
          <SheetDescription className="sr-only">Browse developer tools.</SheetDescription>
          <div
            className="flex min-h-0 flex-1 flex-col"
            onClickCapture={(event) => {
              if (
                event.button === 0 &&
                !event.metaKey &&
                !event.ctrlKey &&
                !event.shiftKey &&
                !event.altKey &&
                event.target instanceof Element &&
                event.target.closest('a[href]')
              ) {
                setOpenMobile(false);
              }
            }}
          >
            {children}
          </div>
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <Sidebar
      data-testid="app-sidebar"
      data-state={state}
      className="absolute h-full"
      collapsible="offcanvas"
    >
      {children}
    </Sidebar>
  );
}
