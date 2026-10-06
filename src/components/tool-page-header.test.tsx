import { render, screen } from '@testing-library/react';
import { describe, expect, test } from 'vitest';
import { ToolPageHeader } from './tool-page-header';

describe('<ToolPageHeader />', () => {
  test('renders linked breadcrumbs before the title and description', () => {
    render(
      <ToolPageHeader
        title="Convert SCSS to Javascript"
        description="Translate SCSS into JavaScript."
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Convert', href: '/convert' },
          { label: 'SCSS', href: '/convert/scss' },
          { label: 'to Javascript' },
        ]}
      />
    );

    expect(screen.getByTestId('tool-page-breadcrumb-link-home')).toHaveAttribute('href', '/');
    expect(screen.getByTestId('tool-page-breadcrumb-link-convert')).toHaveAttribute(
      'href',
      '/convert'
    );
    expect(screen.getByTestId('tool-page-breadcrumb-link-scss')).toHaveAttribute(
      'href',
      '/convert/scss'
    );
    expect(screen.getByTestId('tool-page-breadcrumb-current')).toHaveTextContent('to Javascript');
    expect(screen.getByTestId('tool-page-breadcrumb-current')).toHaveAttribute(
      'aria-current',
      'page'
    );
    expect(screen.getByTestId('code-split-view-label')).toHaveTextContent(
      'Convert SCSS to Javascript'
    );
    expect(screen.getByTestId('tool-page-header-description')).toHaveTextContent(
      'Translate SCSS into JavaScript.'
    );
  });

  test('does not render a CTA row beneath the description', () => {
    render(
      <ToolPageHeader title="Page title" description="Supporting information." breadcrumbs={[]} />
    );

    expect(screen.queryByTestId('tool-page-header-actions')).not.toBeInTheDocument();
  });
});
