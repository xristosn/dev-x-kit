import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import type { NavigationGroupItem } from '@/types/navigation';
import { SidebarGroupEntry } from './sidebar-group-entry';

describe('<SidebarGroupEntry />', () => {
  it('starts expanded when active and renders children at the next level', () => {
    const child: NavigationGroupItem = { label: 'Child', path: '/child' };
    const renderItem = vi.fn((item: NavigationGroupItem, level: number) => (
      <span data-testid={`sidebar-child-level-${level}`}>{item.label}</span>
    ));

    render(
      <SidebarGroupEntry
        label="Converters"
        level={1}
        items={[child]}
        isActive
        renderItem={renderItem}
      />
    );

    expect(screen.getByTestId('sidebar-group-content-converters')).toBeInTheDocument();
    expect(screen.getByTestId('sidebar-child-level-2')).toHaveTextContent('Child');
    expect(renderItem).toHaveBeenCalledWith(child, 2);
  });

  it('opens and closes when its trigger is clicked', async () => {
    const user = userEvent.setup();
    const child: NavigationGroupItem = { label: 'Child', path: '/child' };

    render(
      <SidebarGroupEntry
        label="Converters"
        level={1}
        items={[child]}
        isActive={false}
        renderItem={() => <span data-testid="sidebar-group-child" />}
      />
    );

    expect(screen.queryByTestId('sidebar-group-child')).not.toBeInTheDocument();

    await user.click(screen.getByTestId('sidebar-group-trigger-converters'));
    expect(screen.getByTestId('sidebar-group-child')).toBeInTheDocument();

    await user.click(screen.getByTestId('sidebar-group-trigger-converters'));
    expect(screen.queryByTestId('sidebar-group-child')).not.toBeInTheDocument();
  });
});
