import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { SidebarRouteItem } from './sidebar-route-item';

describe('<SidebarRouteItem />', () => {
  it('renders a link with the route destination and supplied icon', () => {
    render(
      <SidebarRouteItem
        label="JSON to YAML"
        path="/json-to-yaml"
        icon={<span data-testid="sidebar-route-icon" />}
        isActive={false}
      />
    );

    const route = screen.getByTestId('sidebar-route-item-json-to-yaml');
    expect(route).toHaveAttribute('href', '/json-to-yaml');
    expect(route).toHaveTextContent('JSON to YAML');
    expect(screen.getByTestId('sidebar-route-icon')).toBeInTheDocument();
  });

  it('uses the path to identify the active route item', () => {
    render(<SidebarRouteItem label="JSON to YAML" path="/json-to-yaml" icon={null} isActive />);

    expect(screen.getByTestId('sidebar-route-item-json-to-yaml')).toHaveAttribute(
      'href',
      '/json-to-yaml'
    );
  });
});
