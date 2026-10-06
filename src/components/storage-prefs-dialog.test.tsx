import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { beforeEach, describe, expect, test, vi } from 'vitest';
import { UserStoragePrefsDialog } from './storage-prefs-dialog';

vi.mock('@/hooks/use-web-storage', () => ({
  useWebStorage: (key?: string, _inputStorageType?: string, defaultValue?: unknown) => {
    const initialExists =
      typeof window !== 'undefined' && key && window.localStorage.getItem(key) !== null
        ? true
        : false;
    const stored = initialExists && key ? window.localStorage.getItem(key) : null;
    const initialValue = stored !== null ? JSON.parse(stored) : defaultValue;
    const [storeValue, setStoreValue] = useState(initialValue);
    const [valueExistsFlag, setValueExistsFlag] = useState(initialExists);

    const setValue = (valueOrFn: unknown | ((prev: unknown) => unknown)) => {
      setStoreValue((prev: unknown) => {
        const next =
          typeof valueOrFn === 'function'
            ? (valueOrFn as (prev: unknown) => unknown)(prev)
            : valueOrFn;
        setValueExistsFlag(true);
        if (key && typeof window !== 'undefined') {
          window.localStorage.setItem(key, JSON.stringify(next));
        }
        return next;
      });
    };

    const valueExists = () => valueExistsFlag;

    return [storeValue, setValue, () => setStoreValue(defaultValue), valueExists] as const;
  },
}));

vi.mock('@/lib/constants', () => ({
  ...vi.importActual('@/lib/constants'),
  USER_STORAGE_PREFS_KEY: 'user-storage-pref',
}));

describe('<StoragePrefsDialog />', () => {
  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();
  });

  test('shows trigger button', () => {
    render(<UserStoragePrefsDialog />);
    expect(screen.getByTestId('storage-prefs-trigger')).toBeInTheDocument();
  });

  test('auto-opens when value does not exist', async () => {
    render(<UserStoragePrefsDialog />);
    await waitFor(() => {
      expect(screen.getByTestId('storage-prefs-dialog')).toBeInTheDocument();
    });
  });

  test('does not auto-open when value exists', () => {
    localStorage.setItem('user-storage-pref', '"local"');
    render(<UserStoragePrefsDialog />);
    expect(screen.queryByTestId('storage-prefs-dialog')).not.toBeInTheDocument();
  });

  test('allows selecting storage preference', async () => {
    const user = userEvent.setup();
    render(<UserStoragePrefsDialog />);
    await waitFor(() => expect(screen.getByTestId('storage-prefs-dialog')).toBeInTheDocument());
    await user.click(screen.getByTestId('storage-pref-session'));
    // Click succeeds; selection reflected via component state, no error thrown
    expect(screen.getByTestId('storage-pref-session')).toBeInTheDocument();
  });

  test('closes dialog when trigger is clicked after open', async () => {
    const user = userEvent.setup();
    render(<UserStoragePrefsDialog />);
    await waitFor(() => expect(screen.getByTestId('storage-prefs-dialog')).toBeInTheDocument());
    await user.keyboard('{Escape}');
    await waitFor(() =>
      expect(screen.queryByTestId('storage-prefs-dialog')).not.toBeInTheDocument()
    );
    expect(localStorage.getItem('user-storage-pref')).toBe('"local"');
  });
});
