import { USER_STORAGE_PREFS_KEY } from '@/lib/constants';
import { act, renderHook, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it } from 'vitest';
import { useWebStorage } from './use-web-storage';

describe('useWebStorage()', () => {
  beforeEach(() => {
    window.localStorage.clear();
    window.sessionStorage.clear();
  });

  describe('initialization', () => {
    it('defaults to local storage when inputStorageType is infer and no preference is set', () => {
      window.localStorage.setItem('infer-local-key', '"local-value"');
      window.sessionStorage.setItem('infer-local-key', '"session-value"');
      const { result } = renderHook(() => useWebStorage('infer-local-key', 'infer', 'default'));

      expect(result.current[0]).toBe('local-value');

      act(() => result.current[1]('local-update'));

      expect(result.current[0]).toBe('local-update');
      expect(window.localStorage.getItem('infer-local-key')).toBe('"local-update"');
      expect(window.sessionStorage.getItem('infer-local-key')).toBeNull();
    });

    it('reads and writes the user preferred storage type for infer', () => {
      window.localStorage.setItem(USER_STORAGE_PREFS_KEY, '"session"');
      window.localStorage.setItem('infer-session-key', '"local-value"');
      window.sessionStorage.setItem('infer-session-key', '"session-value"');
      const { result } = renderHook(() => useWebStorage('infer-session-key', 'infer', 'default'));

      expect(result.current[0]).toBe('session-value');

      act(() => result.current[1]('session-update'));

      expect(result.current[0]).toBe('session-update');
      expect(window.sessionStorage.getItem('infer-session-key')).toBe('"session-update"');
      expect(window.localStorage.getItem('infer-session-key')).toBeNull();
    });

    it('reads an existing localStorage value', () => {
      window.localStorage.setItem('existing-key', '"stored"');
      const { result } = renderHook(() => useWebStorage('existing-key', 'local', 'default'));
      expect(result.current[0]).toBe('stored');
    });

    it('reads an existing sessionStorage value', () => {
      window.sessionStorage.setItem('sess-key', '{"num":42}');
      const { result } = renderHook(() => useWebStorage('sess-key', 'session', 0));
      expect(result.current[0]).toEqual({ num: 42 });
    });

    it('uses memory storage and ignores window storage', () => {
      window.localStorage.setItem('mem-key', '"ignored"');
      const { result } = renderHook(() => useWebStorage('mem-key', 'memory', 'mem'));
      expect(result.current[0]).toBe('mem');
      expect(window.localStorage.getItem('mem-key')).toBeNull();
    });

    it('returns defaultValue when storage is empty', () => {
      const { result } = renderHook(() => useWebStorage('empty', 'local', [1, 2]));
      expect(result.current[0]).toEqual([1, 2]);
    });

    it('handles malformed JSON gracefully by returning defaultValue', () => {
      window.localStorage.setItem('bad-json', '{invalid');
      const { result } = renderHook(() => useWebStorage('bad-json', 'local', 'fallback'));
      expect(result.current[0]).toBe('fallback');
    });
  });

  describe('setValue', () => {
    it('writes a new value to the correct storage', () => {
      const { result } = renderHook(() => useWebStorage('key', 'local', 'init'));
      act(() => result.current[1]('updated'));
      expect(result.current[0]).toBe('updated');
      expect(window.localStorage.getItem('key')).toBe('"updated"');
    });

    it('writes to sessionStorage when inputStorageType is session', () => {
      const { result } = renderHook(() => useWebStorage('skey', 'session', 'init'));
      act(() => result.current[1]('sess-updated'));
      expect(window.sessionStorage.getItem('skey')).toBe('"sess-updated"');
      expect(window.localStorage.getItem('skey')).toBeNull();
    });

    it('accepts a function updater', () => {
      const { result } = renderHook(() => useWebStorage('fn-key', 'local', 10));
      act(() => result.current[1]((prev: number) => prev + 5));
      expect(result.current[0]).toBe(15);
      expect(window.localStorage.getItem('fn-key')).toBe('15');
    });

    it('removes the item when value equals default and retainValueIfDefault is false', () => {
      const { result } = renderHook(() => useWebStorage('rem-key', 'local', 'default'));
      act(() => result.current[1]('different'));
      act(() => result.current[1]('default'));
      expect(result.current[0]).toBe('default');
      expect(window.localStorage.getItem('rem-key')).toBeNull();
    });

    it('retains the item when value equals default and retainValueIfDefault is true', () => {
      const { result } = renderHook(() => useWebStorage('ret-key', 'local', 'default', true));
      act(() => result.current[1]('default'));
      expect(window.localStorage.getItem('ret-key')).toBe('"default"');
    });

    it('clears the opposite storage type', () => {
      window.localStorage.setItem('dual', '"local-val"');
      window.sessionStorage.setItem('dual', '"session-val"');
      const { result } = renderHook(() => useWebStorage('dual', 'local', 'init'));
      act(() => result.current[1]('new'));
      expect(window.localStorage.getItem('dual')).toBe('"new"');
      expect(window.sessionStorage.getItem('dual')).toBeNull();
    });

    it('does not write to storage for memory type', () => {
      const { result } = renderHook(() => useWebStorage('mem', 'memory', 'init'));
      act(() => result.current[1]('changed'));
      expect(window.localStorage.getItem('mem')).toBeNull();
      expect(window.sessionStorage.getItem('mem')).toBeNull();
    });
  });

  describe('resetValue', () => {
    it('sets state to default and removes from storage', () => {
      window.localStorage.setItem('reset-key', '"value"');
      const { result } = renderHook(() => useWebStorage('reset-key', 'local', 'default'));
      act(() => result.current[2]());
      expect(result.current[0]).toBe('default');
      expect(window.localStorage.getItem('reset-key')).toBeNull();
    });

    it('retains storage item on reset when retainValueIfDefault is true', () => {
      window.localStorage.setItem('reset-ret', '"value"');
      const { result } = renderHook(() => useWebStorage('reset-ret', 'local', 'default', true));
      act(() => result.current[2]());
      expect(window.localStorage.getItem('reset-ret')).not.toBeNull();
    });
  });

  describe('valueExists', () => {
    it('returns false when no item exists', () => {
      const { result } = renderHook(() => useWebStorage('missing', 'local', 'default'));
      expect(result.current[3]()).toBe(false);
    });

    it('returns true when an item exists', () => {
      window.localStorage.setItem('exists', '"yes"');
      const { result } = renderHook(() => useWebStorage('exists', 'local', 'default'));
      expect(result.current[3]()).toBe(true);
    });

    it('always returns false for memory storage', () => {
      const { result } = renderHook(() => useWebStorage('mem-check', 'memory', 'default'));
      expect(result.current[3]()).toBe(false);
    });
  });

  describe('cross-tab synchronization', () => {
    it('updates value when a storage event fires for the same key', async () => {
      const { result } = renderHook(() => useWebStorage('sync-key', 'local', 'old'));
      window.localStorage.setItem('sync-key', '"new"');
      act(() => {
        const event = new Event('storage', { bubbles: true });
        Object.defineProperty(event, 'key', { value: 'sync-key', enumerable: true });
        Object.defineProperty(event, 'newValue', { value: '"new"', enumerable: true });
        window.dispatchEvent(event);
      });
      await waitFor(() => {
        expect(result.current[0]).toBe('new');
      });
    });

    it('migrates the current value and subsequent writes when the storage preference changes', () => {
      window.localStorage.setItem(USER_STORAGE_PREFS_KEY, '"local"');
      window.localStorage.setItem('pref-key', '"local-value"');
      window.sessionStorage.setItem('pref-key', '"session-value"');
      const { result } = renderHook(() => useWebStorage('pref-key', 'infer', 'default'));

      expect(result.current[0]).toBe('local-value');
      expect(window.localStorage.getItem('pref-key')).toBe('"local-value"');
      expect(window.sessionStorage.getItem('pref-key')).toBeNull();

      act(() => {
        window.localStorage.setItem(USER_STORAGE_PREFS_KEY, '"session"');
        window.dispatchEvent(
          new StorageEvent('storage', {
            key: USER_STORAGE_PREFS_KEY,
            newValue: '"session"',
            oldValue: '"local"',
            storageArea: window.localStorage,
          })
        );
      });

      expect(result.current[0]).toBe('local-value');
      expect(window.sessionStorage.getItem('pref-key')).toBe('"local-value"');
      expect(window.localStorage.getItem('pref-key')).toBeNull();

      act(() => result.current[1]('after-preference-change'));

      expect(result.current[0]).toBe('after-preference-change');
      expect(window.sessionStorage.getItem('pref-key')).toBe('"after-preference-change"');
      expect(window.localStorage.getItem('pref-key')).toBeNull();
    });

    it('ignores storage events for other keys', () => {
      const { result } = renderHook(() => useWebStorage('my-key', 'local', 'value'));
      act(() => {
        window.dispatchEvent(new StorageEvent('storage', { key: 'other-key', newValue: '"x"' }));
      });
      expect(result.current[0]).toBe('value');
    });
  });

  describe('custom event synchronization', () => {
    it('updates the mounted hook when the web-storage-update event is fired', () => {
      window.localStorage.setItem('event-key', '"initial-value"');
      const { result } = renderHook(() => useWebStorage('event-key', 'local', 'default'));
      expect(result.current[0]).toBe('initial-value');

      window.localStorage.setItem('event-key', '"event-update"');
      expect(result.current[0]).toBe('initial-value');

      act(() => {
        window.dispatchEvent(
          new CustomEvent('web-storage-update', { detail: { key: 'event-key' } })
        );
      });

      expect(result.current[0]).toBe('event-update');
      expect(window.localStorage.getItem('event-key')).toBe('"event-update"');
    });
  });

  describe('key change behavior', () => {
    it('switches to the new key value from storage after rerendering', () => {
      window.localStorage.setItem('old-key', '"old-value"');
      window.localStorage.setItem('new-key', '"new-value"');
      const { result, rerender } = renderHook(({ key }) => useWebStorage(key, 'local', 'default'), {
        initialProps: { key: 'old-key' },
      });
      expect(result.current[0]).toBe('old-value');

      rerender({ key: 'new-key' });

      expect(result.current[0]).toBe('new-value');
      expect(window.localStorage.getItem('old-key')).toBe('"old-value"');
      expect(window.localStorage.getItem('new-key')).toBe('"new-value"');

      act(() => result.current[1]('new-key-update'));

      expect(result.current[0]).toBe('new-key-update');
      expect(window.localStorage.getItem('new-key')).toBe('"new-key-update"');
      expect(window.localStorage.getItem('old-key')).toBe('"old-value"');
    });

    it('uses the default when rerendering with a key that has no stored value', () => {
      window.localStorage.setItem('old-key', '"old-value"');
      const { result, rerender } = renderHook(({ key }) => useWebStorage(key, 'local', 'default'), {
        initialProps: { key: 'old-key' },
      });
      expect(result.current[0]).toBe('old-value');

      rerender({ key: 'missing-key' });

      expect(result.current[0]).toBe('default');
      expect(window.localStorage.getItem('missing-key')).toBeNull();
      expect(window.localStorage.getItem('old-key')).toBe('"old-value"');

      act(() => result.current[1]('missing-key-update'));

      expect(result.current[0]).toBe('missing-key-update');
      expect(window.localStorage.getItem('missing-key')).toBe('"missing-key-update"');
      expect(window.localStorage.getItem('old-key')).toBe('"old-value"');
    });

    it('reads the preference key without migrating its storage when the key changes', () => {
      window.localStorage.setItem('old-key', '"old-value"');
      window.localStorage.setItem(USER_STORAGE_PREFS_KEY, '"session"');
      window.sessionStorage.setItem(USER_STORAGE_PREFS_KEY, '"preserve-session-entry"');
      const { result, rerender } = renderHook(({ key }) => useWebStorage(key, 'local', 'default'), {
        initialProps: { key: 'old-key' },
      });
      expect(result.current[0]).toBe('old-value');

      rerender({ key: USER_STORAGE_PREFS_KEY });

      expect(result.current[0]).toBe('session');
      expect(window.localStorage.getItem(USER_STORAGE_PREFS_KEY)).toBe('"session"');
      expect(window.sessionStorage.getItem(USER_STORAGE_PREFS_KEY)).toBe(
        '"preserve-session-entry"'
      );
      expect(window.localStorage.getItem('old-key')).toBe('"old-value"');
    });

    it('returns undefined for a missing new key when no default is provided', () => {
      window.localStorage.setItem('old-key', '"old-value"');
      const { result, rerender } = renderHook(({ key }) => useWebStorage<string>(key, 'local'), {
        initialProps: { key: 'old-key' },
      });
      expect(result.current[0]).toBe('old-value');

      rerender({ key: 'missing-key' });

      expect(result.current[0]).toBeUndefined();
      expect(window.localStorage.getItem('missing-key')).toBeNull();
      expect(window.localStorage.getItem('old-key')).toBe('"old-value"');
    });
  });
});
