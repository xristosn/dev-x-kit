import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Link from 'next/link';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { SidebarShell } from './sidebar-shell';

function setup(width: number) {
  vi.spyOn(window, 'innerWidth', 'get').mockReturnValue(width);
  const user = userEvent.setup();

  render(
    <SidebarProvider>
      <SidebarTrigger data-testid="sidebar-trigger" />
      <SidebarShell>
        <div data-testid="sidebar-content">
          <Link href="/next-tool" data-testid="sidebar-route" onClick={(e) => e.preventDefault()}>
            <span data-testid="sidebar-route-label">Next tool</span>
          </Link>
          <button data-testid="sidebar-category">Category</button>
        </div>
      </SidebarShell>
    </SidebarProvider>
  );

  return { user, trigger: screen.getByTestId('sidebar-trigger') };
}

describe('<SidebarShell />', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('closes the mobile panel when a nested route label is clicked', async () => {
    const { user, trigger } = setup(390);
    await user.click(trigger);

    await user.click(await screen.findByTestId('sidebar-route-label'));

    await waitFor(() => {
      expect(screen.queryByTestId('sidebar-content')).not.toBeInTheDocument();
    });
    await user.click(trigger);
    expect(await screen.findByTestId('sidebar-content')).toBeVisible();
  });

  it('does not close the mobile panel when a category is clicked', async () => {
    const { user, trigger } = setup(390);
    await user.click(trigger);

    await user.click(await screen.findByTestId('sidebar-category'));

    expect(screen.getByTestId('sidebar-content')).toBeVisible();
  });

  it('keeps the mobile panel open for a modified link click', async () => {
    const { user, trigger } = setup(390);
    await user.click(trigger);

    await user.keyboard('{Control>}');
    await user.click(await screen.findByTestId('sidebar-route'));
    await user.keyboard('{/Control}');

    expect(screen.getByTestId('sidebar-content')).toBeVisible();
  });

  it('keeps the desktop sidebar expanded when a route is clicked', async () => {
    const { user } = setup(1024);

    await user.click(screen.getByTestId('sidebar-route'));

    expect(screen.getByTestId('app-sidebar')).toHaveAttribute('data-state', 'expanded');
  });
});
