import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { AppSidebar } from './sidebar';

vi.mock('next/navigation', () => ({
  usePathname: () => '/json-to-yaml',
}));

function setup(width: number) {
  vi.spyOn(window, 'innerWidth', 'get').mockReturnValue(width);
  const user = userEvent.setup();

  render(
    <SidebarProvider>
      <SidebarTrigger data-testid="sidebar-trigger" />
      <AppSidebar />
    </SidebarProvider>
  );

  return { user, trigger: screen.getByTestId('sidebar-trigger') };
}

describe('<AppSidebar />', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('collapses and reopens the desktop sidebar from the trigger', async () => {
    const { user, trigger } = setup(1024);
    const sidebar = screen.getByTestId('app-sidebar');

    expect(sidebar).toHaveAttribute('data-state', 'expanded');

    await user.click(trigger);
    expect(sidebar).toHaveAttribute('data-state', 'collapsed');

    await user.click(trigger);
    expect(sidebar).toHaveAttribute('data-state', 'expanded');
  });

  it('starts closed on mobile, opens from the trigger, and can close and reopen', async () => {
    const { user, trigger } = setup(390);

    expect(screen.queryByTestId('app-sidebar-content')).not.toBeInTheDocument();

    await user.click(trigger);
    expect(await screen.findByTestId('app-sidebar-content')).toBeVisible();

    await user.keyboard('{Escape}');
    await waitFor(() => {
      expect(screen.queryByTestId('app-sidebar-content')).not.toBeInTheDocument();
    });

    await user.click(trigger);
    expect(await screen.findByTestId('app-sidebar-content')).toBeVisible();
  });
});
