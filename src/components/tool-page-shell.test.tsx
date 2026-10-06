import { render, screen } from '@testing-library/react';
import { NAVIGATION } from '@/lib/navigation';
import { useToolPageContext } from './tool-page-title-context';
import { ToolPageShell } from './tool-page-shell';
import type { ToolPageRouteMetadata } from './tool-page-shell';
import { beforeEach, describe, expect, test, vi } from 'vitest';

const { currentPath } = vi.hoisted(() => ({ currentPath: { value: '/color-tools/color-picker' } }));

vi.mock('next/navigation', () => ({
  usePathname: () => currentPath.value,
}));

const routeMetadata: ToolPageRouteMetadata[] = [
  '/color-tools/color-picker',
  '/color-tools/gradient-editor',
].map((path) => {
  const item = NAVIGATION.getSearchableItems().find((route) => route.path === path);
  if (!item) throw new Error(`Missing navigation route: ${path}`);

  return {
    path,
    title: item.pageTitle || item.fullName || item.label,
    description: item.summary,
    breadcrumbs: NAVIGATION.getBreadcrumbsByPath(path),
  };
});

const ContextProbe = () => {
  const context = useToolPageContext();

  return <div data-testid="tool-page-context-title">{context?.title}</div>;
};

const footer = <footer data-testid="footer" />;

describe('<ToolPageShell />', () => {
  beforeEach(() => {
    currentPath.value = '/color-tools/color-picker';
  });

  test('updates route metadata during client-side navigation without remounting the shell', () => {
    const { rerender } = render(
      <ToolPageShell routeMetadata={routeMetadata} footer={footer}>
        <ContextProbe />
        <div data-testid="tool-content" />
      </ToolPageShell>
    );

    expect(screen.getByTestId('code-split-view-label')).toHaveTextContent('Color Picker');
    expect(screen.getByTestId('tool-page-header-description')).toHaveTextContent(
      routeMetadata[0].description ?? ''
    );
    expect(screen.getByTestId('tool-page-breadcrumb-link-home')).toHaveAttribute('href', '/');
    expect(screen.getByTestId('tool-page-context-title')).toHaveTextContent('Color Picker');

    currentPath.value = '/color-tools/gradient-editor';
    rerender(
      <ToolPageShell routeMetadata={routeMetadata} footer={footer}>
        <ContextProbe />
        <div data-testid="tool-content" />
      </ToolPageShell>
    );

    expect(screen.getByTestId('code-split-view-label')).toHaveTextContent('Color Gradient Editor');
    expect(screen.getByTestId('tool-page-header-description')).toHaveTextContent(
      routeMetadata[1].description ?? ''
    );
    expect(screen.getByTestId('tool-page-context-title')).toHaveTextContent(
      'Color Gradient Editor'
    );
    expect(screen.getByTestId('tool-page-breadcrumb-current')).toHaveTextContent('Gradient Editor');
    expect(screen.getByTestId('tool-page-breadcrumb-link-color-tools')).toHaveAttribute(
      'href',
      '/color-tools'
    );
  });

  test('scrolls the shared header with tool content and does not nest containers', () => {
    render(
      <ToolPageShell routeMetadata={routeMetadata} footer={footer}>
        <div data-testid="tool-content" />
      </ToolPageShell>
    );

    const scrollArea = screen.getByTestId('tool-page-scroll-area');
    expect(scrollArea).toContainElement(screen.getByTestId('code-split-view-label'));
    expect(scrollArea).toContainElement(screen.getByTestId('tool-content'));
    expect(screen.getAllByTestId('tool-page-container')).toHaveLength(1);
    expect(screen.getByTestId('tool-page-container')).toHaveClass('tool-page-container');
    expect(scrollArea).toContainElement(screen.getByTestId('footer'));
    expect(
      screen.getByTestId('tool-content').compareDocumentPosition(screen.getByTestId('footer')) &
        Node.DOCUMENT_POSITION_FOLLOWING
    ).toBeTruthy();
  });

  test('renders unknown-path breadcrumbs as text only', () => {
    currentPath.value = '/unknown-tools/gradient-editor';
    const fallbackBreadcrumbs = NAVIGATION.getBreadcrumbsByPath(currentPath.value);

    render(
      <ToolPageShell
        routeMetadata={routeMetadata}
        footer={footer}
        fallbackBreadcrumbs={fallbackBreadcrumbs}
      >
        <div data-testid="tool-content" />
      </ToolPageShell>
    );

    expect(screen.getByTestId('tool-page-breadcrumb')).toBeInTheDocument();
    expect(screen.getByTestId('tool-page-breadcrumb-current')).toHaveTextContent('Gradient Editor');
    expect(screen.queryByTestId('tool-page-breadcrumb-link-home')).not.toBeInTheDocument();
    expect(screen.getByTestId('tool-page-scroll-area')).toContainElement(
      screen.getByTestId('footer')
    );
  });

  test('omits the tool header and shared container on navigation-group routes', () => {
    currentPath.value = '/convert';
    render(
      <ToolPageShell routeMetadata={routeMetadata} footer={footer}>
        <div data-testid="tool-content" />
      </ToolPageShell>
    );

    expect(screen.queryByTestId('code-split-view-label')).not.toBeInTheDocument();
    expect(screen.queryByTestId('tool-page-container')).not.toBeInTheDocument();
    expect(screen.getByTestId('tool-content')).toBeInTheDocument();
    expect(screen.getByTestId('tool-page-scroll-area')).toContainElement(
      screen.getByTestId('footer')
    );
  });
});
