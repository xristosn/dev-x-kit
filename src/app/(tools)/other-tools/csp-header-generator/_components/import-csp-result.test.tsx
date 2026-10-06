import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import { parseCspHeader } from '../_lib/utils';
import { ImportCspResult } from './import-csp-result';

afterEach(cleanup);

describe('<ImportCspResult />', () => {
  it('renders nothing without a parse result', () => {
    render(<ImportCspResult result={null} />);

    expect(screen.queryByTestId('import-result')).not.toBeInTheDocument();
  });

  it('shows the enabled directive count and warnings for a successful parse', () => {
    const result = parseCspHeader("default-src 'self'; bogus-directive foo");
    render(<ImportCspResult result={result} />);

    expect(screen.getByTestId('import-result')).toBeInTheDocument();
    expect(screen.getByTestId('import-directive-count')).toHaveTextContent('1 directive found');
    expect(screen.getByTestId('import-warnings')).toBeInTheDocument();
  });

  it('uses a plural count when multiple directives are enabled', () => {
    const result = parseCspHeader("default-src 'self'; img-src 'self'");
    render(<ImportCspResult result={result} />);

    expect(screen.getByTestId('import-directive-count')).toHaveTextContent('2 directives found');
  });

  it('shows the parse error message when parsing fails', () => {
    const result = parseCspHeader('invalid-directive foo');
    render(<ImportCspResult result={result} />);

    expect(screen.getByTestId('import-result')).toBeInTheDocument();
    expect(screen.getByTestId('import-error-message')).toBeInTheDocument();
    expect(screen.queryByTestId('import-directive-count')).not.toBeInTheDocument();
  });
});
