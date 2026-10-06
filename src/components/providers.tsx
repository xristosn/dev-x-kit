'use client';

import { ThemeProvider } from '@/components/theme-provider';
import { SidebarProvider } from '@/components/ui/sidebar';
import { Toaster } from '@/components/ui/sonner';
import type { CSSProperties, ReactNode } from 'react';

type ProvidersProps = {
  children: ReactNode;
};

export function Providers({ children }: ProvidersProps) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      <SidebarProvider
        className="relative w-full"
        style={{ '--sidebar-width': 'var(--app-sidebar-width)' } as CSSProperties}
      >
        {children}
        <Toaster position="bottom-right" />
      </SidebarProvider>
    </ThemeProvider>
  );
}
