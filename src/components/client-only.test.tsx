import { describe, expect, test } from 'vitest';
import { render } from '@testing-library/react';
import { renderToString } from 'react-dom/server';
import { createElement } from 'react';
import { ClientOnly } from './client-only';

describe('<ClientOnly />', () => {
  test('renders children after mount when fallback is omitted', () => {
    const { getByTestId } = render(
      <ClientOnly>
        <span data-testid="client-child">hello</span>
      </ClientOnly>
    );
    expect(getByTestId('client-child')).toHaveTextContent('hello');
  });

  test('accepts fallback prop and mounts to children', () => {
    // Fallback is shown on first SSR/render, then replaced by children
    // after useEffect. render flushes synchronously, so only children visible.
    const { getByTestId, queryByTestId } = render(
      <ClientOnly fallback={<span data-testid="client-fallback">loading</span>}>
        <span data-testid="client-child">hello</span>
      </ClientOnly>
    );
    expect(getByTestId('client-child')).toBeInTheDocument();
    expect(queryByTestId('client-fallback')).not.toBeInTheDocument();
  });

  test('falls back to fallback on server / first render (renderToString)', () => {
    const html = renderToString(
      createElement(
        ClientOnly,
        { fallback: createElement('span', { 'data-testid': 'fb' }, 'fb') },
        createElement('span', { 'data-testid': 'ch' }, 'ch')
      )
    );
    expect(html).toContain('fb');
    expect(html).not.toContain('ch');
  });
});
