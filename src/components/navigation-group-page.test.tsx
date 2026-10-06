import { render, screen } from '@testing-library/react';
import { describe, expect, test } from 'vitest';
import type { NavigationGroup } from '@/types/navigation';
import { NAVIGATION } from '@/lib/navigation';
import { NavigationGroupPage } from './navigation-group-page';

describe('<NavigationGroupPage />', () => {
  test('renders linked child groups and their route summaries', () => {
    const group: NavigationGroup = {
      label: 'Convert',
      fullName: 'Convert Tools',
      path: '/convert',
      items: [
        {
          label: 'SCSS',
          fullName: 'Convert SCSS',
          path: '/convert/scss',
          items: [{ label: 'to CSS', path: '/convert/scss/css' }],
        },
        {
          label: 'Unavailable group',
          items: [{ label: 'nested tool', path: '/convert/nested' }],
        },
      ],
    };

    render(<NavigationGroupPage group={group} description="Choose a format." />);

    expect(screen.getByTestId('navigation-group-page-title')).toHaveTextContent('Convert Tools');
    expect(screen.getByTestId('navigation-group-page-description')).toHaveTextContent(
      'Choose a format.'
    );
    expect(screen.getByTestId('navigation-group-page-item-scss')).toHaveAttribute(
      'href',
      '/convert/scss'
    );
    expect(screen.queryByTestId('navigation-group-page-item-summary-scss')).not.toBeInTheDocument();
    expect(
      screen.queryByTestId('navigation-group-page-item-unavailable-group')
    ).not.toBeInTheDocument();
    expect(screen.queryByTestId('navigation-group-page-item-nested-tool')).not.toBeInTheDocument();
  });

  test.each([
    {
      path: '/color-tools',
      title: 'Color Tools',
      slug: 'color-picker',
      href: '/color-tools/color-picker',
    },
    {
      path: '/css-tools',
      title: 'CSS Tools',
      slug: 'css-triangle',
      href: '/css-tools/css-triangle',
    },
    {
      path: '/image-tools',
      title: 'Image Tools',
      slug: 'placeholder-image-generator',
      href: '/image-tools/placeholder-image-generator',
    },
    {
      path: '/other-tools',
      title: 'Other Tools',
      slug: 'markdown-editor',
      href: '/other-tools/markdown-editor',
    },
    {
      path: '/convert',
      title: 'Convert',
      slug: 'html',
      href: '/convert/html',
    },
    {
      path: '/convert/html',
      title: 'Convert HTML',
      slug: 'to-jsx',
      href: '/convert/html/jsx',
    },
  ])('renders the $title landing page with a linked item', ({ path, title, slug, href }) => {
    const group = NAVIGATION.getGroupByPath(path);

    expect(group).toBeDefined();
    render(
      <NavigationGroupPage
        group={group!}
        description="Browse tools."
        breadcrumbs={NAVIGATION.getBreadcrumbsByPath(path)}
      />
    );

    expect(screen.getByTestId('navigation-group-page-title')).toHaveTextContent(title);
    expect(screen.getByTestId(`navigation-group-page-item-${slug}`)).toHaveAttribute('href', href);
    expect(screen.getByTestId('navigation-group-page-breadcrumb-link-home')).toHaveAttribute(
      'href',
      '/'
    );
    expect(screen.getByTestId('navigation-group-page-breadcrumb-current')).toHaveTextContent(
      group!.label
    );
  });

  test('renders linked tools and their summaries on a format page', () => {
    const group: NavigationGroup = {
      label: 'SCSS',
      fullName: 'Convert SCSS',
      path: '/convert/scss',
      items: [
        {
          label: 'to Javascript',
          fullName: 'Convert SCSS to Javascript',
          path: '/convert/scss/js',
          summary: 'Convert SCSS into JavaScript.',
        },
      ],
    };

    render(<NavigationGroupPage group={group} description="Available SCSS conversions." />);

    expect(screen.getByTestId('navigation-group-page-item-to-javascript')).toHaveAttribute(
      'href',
      '/convert/scss/js'
    );
    expect(
      screen.getByTestId('navigation-group-page-item-summary-to-javascript')
    ).toHaveTextContent('Convert SCSS into JavaScript.');
  });
});
