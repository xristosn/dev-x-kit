import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { SidebarProvider } from './ui/sidebar';
import { AppHeader } from './app-header';

const { usePathname } = vi.hoisted(() => ({ usePathname: vi.fn() }));

vi.mock('next/navigation', () => ({ usePathname }));
vi.mock('./search-dialog', () => ({
  SearchDialog: () => <div data-testid="header-search" />,
}));
vi.mock('./theme-mode-toggle', () => ({
  ThemeModeToggle: () => <div data-testid="header-theme-toggle" />,
}));
vi.mock('./storage-prefs-dialog', () => ({
  UserStoragePrefsDialog: () => <div data-testid="header-storage-prefs" />,
}));

function renderHeader(pathname: string) {
  usePathname.mockReturnValue(pathname);
  return render(
    <SidebarProvider>
      <AppHeader />
    </SidebarProvider>
  );
}

describe('<AppHeader />', () => {
  it.each(['/', '/privacy-policy', '/terms-of-use'])(
    'renders the non-tool header for %s',
    (pathname) => {
      renderHeader(pathname);

      expect(screen.getByTestId('app-header')).toBeInTheDocument();
      expect(screen.getByTestId('header-search')).toBeInTheDocument();
      expect(screen.getByTestId('header-theme-toggle')).toBeInTheDocument();
      expect(screen.queryByTestId('app-header-sidebar-trigger')).not.toBeInTheDocument();
      expect(screen.queryByTestId('header-storage-prefs')).not.toBeInTheDocument();
    }
  );

  it('shows the sidebar trigger and storage preferences on tool pages', async () => {
    renderHeader('/json-to-yaml');

    expect(screen.getByTestId('app-header-sidebar-trigger')).toBeInTheDocument();
    expect(await screen.findByTestId('header-storage-prefs')).toBeInTheDocument();
  });
});
