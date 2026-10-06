import { render, screen } from '@testing-library/react';
import { describe, expect, test } from 'vitest';
import { ToolCard } from './tool-card';

describe('<ToolCard />', () => {
  test('renders the full name, summary, custom icon, and link target', () => {
    render(
      <ToolCard
        item={{
          path: '/json',
          label: 'JSON',
          fullName: 'JSON Formatter',
          summary: 'Format JSON data.',
          icon: <span data-testid="custom-tool-icon" />,
        }}
        data-testid="tool-card-link"
        titleTestId="tool-card-title"
        summaryTestId="tool-card-summary"
        iconTestId="tool-card-icon"
      />
    );

    expect(screen.getByTestId('tool-card-link')).toHaveAttribute('href', '/json');
    expect(screen.getByTestId('tool-card-title')).toHaveTextContent('JSON Formatter');
    expect(screen.getByTestId('tool-card-summary')).toHaveTextContent('Format JSON data.');
    expect(screen.getByTestId('tool-card-icon')).toContainElement(
      screen.getByTestId('custom-tool-icon')
    );
  });

  test('falls back to the label and code icon', () => {
    render(
      <ToolCard
        item={{ path: '/custom', label: 'Custom tool' }}
        titleTestId="tool-card-title"
        iconTestId="tool-card-icon"
      />
    );

    expect(screen.getByTestId('tool-card-title')).toHaveTextContent('Custom tool');
    expect(screen.getByTestId('tool-card-icon').firstElementChild?.tagName).toBe('svg');
  });

  test('omits the summary when it is not provided', () => {
    render(
      <ToolCard
        item={{ path: '/custom', label: 'Custom tool' }}
        summaryTestId="tool-card-summary"
      />
    );

    expect(screen.queryByTestId('tool-card-summary')).not.toBeInTheDocument();
  });
});
