import { describe, expect, test } from 'vitest';
import { render, screen } from '@testing-library/react';
import { RiskBadge } from './risk-badge';

describe('<RiskBadge />', () => {
  test('renders for unsafe-inline', () => {
    render(<RiskBadge source="unsafe-inline" />);
    expect(screen.getByTestId('risk-badge')).toHaveTextContent('unsafe-inline');
  });

  test('renders for unsafe-eval', () => {
    render(<RiskBadge source="unsafe-eval" />);
    expect(screen.getByTestId('risk-badge')).toHaveTextContent('unsafe-eval');
  });

  test('renders nothing for safe sources', () => {
    const { container } = render(<RiskBadge source="https://example.com" />);
    expect(container).toBeEmptyDOMElement();
  });

  test('renders nothing for safe CSP directives', () => {
    const safeSources = ["'self'", 'data:', 'blob:'];
    for (const source of safeSources) {
      const { container } = render(<RiskBadge source={source} />);
      expect(container).toBeEmptyDOMElement();
    }
  });
});
