import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { toast } from 'sonner';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { URLParser } from './url-parser';

vi.mock('sonner', () => ({
  toast: {
    dismiss: vi.fn(),
    error: vi.fn(),
  },
}));

describe('<URLParser />', () => {
  beforeEach(() => {
    window.localStorage.clear();
    window.sessionStorage.clear();
  });

  it('shows the default URL parts and decoded query parameters', async () => {
    render(<URLParser />);

    await waitFor(() => {
      expect(screen.getByTestId('url-protocol')).toHaveValue('https');
    });

    expect(screen.getByTestId('url-input')).toHaveValue(
      'https://duckduckgo.com/404-page-not-found?q=This+is+a+random+url&foo=with+random+query+params'
    );
    expect(screen.getByTestId('url-host')).toHaveValue('duckduckgo.com');
    expect(screen.getByTestId('url-hostname')).toHaveValue('duckduckgo.com');
    expect(screen.getByTestId('url-port')).toHaveValue('');
    expect(screen.getByTestId('url-pathname')).toHaveValue('/404-page-not-found');
    expect(screen.getByTestId('url-hash')).toHaveValue('');
    expect(screen.getByTestId('url-query')).toHaveValue(
      '?q=This+is+a+random+url&foo=with+random+query+params'
    );
    expect(screen.getByTestId('url-query-q')).toHaveValue('This is a random url');
    expect(screen.getByTestId('url-query-foo')).toHaveValue('with random query params');
  });

  it('updates the URL details when the input changes', async () => {
    const user = userEvent.setup();
    render(<URLParser />);
    const input = screen.getByTestId('url-input');

    await user.clear(input);
    await user.type(
      input,
      '  http://api.example.test:8080/v1/items?name=Jane+Doe&active=true#details  '
    );

    await waitFor(() => {
      expect(screen.getByTestId('url-protocol')).toHaveValue('http');
    });

    expect(screen.getByTestId('url-host')).toHaveValue('api.example.test:8080');
    expect(screen.getByTestId('url-hostname')).toHaveValue('api.example.test');
    expect(screen.getByTestId('url-port')).toHaveValue('8080');
    expect(screen.getByTestId('url-pathname')).toHaveValue('/v1/items');
    expect(screen.getByTestId('url-hash')).toHaveValue('#details');
    expect(screen.getByTestId('url-query')).toHaveValue('?name=Jane+Doe&active=true');
    expect(screen.getByTestId('url-query-name')).toHaveValue('Jane Doe');
    expect(screen.getByTestId('url-query-active')).toHaveValue('true');
    expect(screen.queryByTestId('url-query-q')).not.toBeInTheDocument();
    expect(screen.queryByTestId('url-query-foo')).not.toBeInTheDocument();
  });

  it('reports an invalid URL and keeps the last parsed details', async () => {
    const user = userEvent.setup();
    render(<URLParser />);
    const input = screen.getByTestId('url-input');

    await waitFor(() => {
      expect(screen.getByTestId('url-host')).toHaveValue('duckduckgo.com');
    });
    await user.clear(input);
    await user.type(input, 'not a valid URL');

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(
        'Failed to parse URL',
        expect.objectContaining({ dismissible: false, duration: Infinity })
      );
    });

    expect(screen.getByTestId('url-host')).toHaveValue('duckduckgo.com');
    expect(screen.getByTestId('url-query-q')).toHaveValue('This is a random url');
  });

  it('skips parsing blank input and keeps the last parsed details', async () => {
    const user = userEvent.setup();
    render(<URLParser />);
    const input = screen.getByTestId('url-input');

    await waitFor(() => {
      expect(screen.getByTestId('url-host')).toHaveValue('duckduckgo.com');
    });
    await user.clear(input);

    expect(screen.getByTestId('url-host')).toHaveValue('duckduckgo.com');
    expect(screen.getByTestId('url-query-q')).toHaveValue('This is a random url');
    expect(toast.error).not.toHaveBeenCalled();
  });
});
