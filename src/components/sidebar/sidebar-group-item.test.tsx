import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { SidebarGroupItem } from './sidebar-group-item';

const { usePathname } = vi.hoisted(() => ({ usePathname: vi.fn() }));

vi.mock('next/navigation', () => ({ usePathname }));

describe('<SidebarGroupItem />', () => {
  beforeEach(() => {
    usePathname.mockReturnValue('/outside');
  });

  it('renders todo items instead of route links when both are provided', () => {
    render(<SidebarGroupItem label="Coming soon" path="/coming-soon" todo />);

    expect(screen.getByTestId('sidebar-todo-item-coming-soon')).toBeInTheDocument();
    expect(screen.queryByTestId('sidebar-route-item-coming-soon')).not.toBeInTheDocument();
  });

  it('renders nothing for a pathless leaf item', () => {
    const { container } = render(<SidebarGroupItem label="Pathless" />);

    expect(container).toBeEmptyDOMElement();
  });

  it('starts expanded when the group route matches the current path', () => {
    usePathname.mockReturnValue('/converters');
    render(
      <SidebarGroupItem
        label="Converters"
        path="/converters"
        items={[{ label: 'JSON to YAML', path: '/json-to-yaml' }]}
      />
    );

    expect(screen.getByTestId('sidebar-group-content-converters')).toBeInTheDocument();
  });

  it('expands nested groups when a descendant route matches', () => {
    usePathname.mockReturnValue('/converters/json-to-yaml');
    render(
      <SidebarGroupItem
        label="Converters"
        path="/converters"
        items={[
          {
            label: 'Data formats',
            items: [{ label: 'JSON to YAML', path: '/converters/json-to-yaml' }],
          },
        ]}
      />
    );

    expect(screen.getByTestId('sidebar-group-content-converters')).toBeInTheDocument();
    expect(screen.getByTestId('sidebar-group-content-data-formats')).toBeInTheDocument();
    expect(screen.getByTestId('sidebar-route-item-converters-json-to-yaml')).toHaveAttribute(
      'href',
      '/converters/json-to-yaml'
    );
  });
});
