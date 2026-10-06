import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useCspGenerator } from './use-csp-generator';
import type { HashEntry, DirectiveConfig } from '../_lib/types';
import { SERVICE_PRESETS } from '../_lib/constants';
import { DEFAULT_STORE_VALUE } from '../_lib/utils';

describe('useCspGenerator', () => {
  beforeEach(() => {
    window.localStorage.clear();
    window.sessionStorage.clear();
  });

  describe('returned state', () => {
    it('returns the default StoreValue when storage is empty', () => {
      const { result } = renderHook(() => useCspGenerator());

      expect(result.current.value).toEqual(DEFAULT_STORE_VALUE);
    });

    it('exposes state updates after act and retains them across rerenders', () => {
      const { result, rerender } = renderHook(() => useCspGenerator());
      const initialValue = result.current.value;

      act(() => {
        result.current.toggleDirective('script-src');
        result.current.addSource('script-src', 'https://cdn.example.com');
      });

      expect(result.current.value).not.toBe(initialValue);
      expect(result.current.value.directives.find((d) => d.name === 'script-src')).toEqual({
        ...DEFAULT_STORE_VALUE.directives.find((d) => d.name === 'script-src'),
        enabled: true,
        sources: ['https://cdn.example.com'],
      });

      const updatedValue = result.current.value;
      rerender();

      expect(result.current.value).toEqual(updatedValue);
    });
  });

  describe('toggleDirective', () => {
    it('toggles a directive from disabled to enabled', () => {
      const { result } = renderHook(() => useCspGenerator());

      act(() => {
        result.current.toggleDirective('script-src');
      });

      const scriptSrc = result.current.value.directives.find((d) => d.name === 'script-src');
      expect(scriptSrc?.enabled).toBe(true);
    });

    it('toggles a directive from enabled to disabled', () => {
      const { result } = renderHook(() => useCspGenerator());

      act(() => {
        result.current.toggleDirective('default-src');
      });

      const defaultSrc = result.current.value.directives.find((d) => d.name === 'default-src');
      expect(defaultSrc?.enabled).toBe(false);
    });

    it('does not affect other directives when toggling', () => {
      const { result } = renderHook(() => useCspGenerator());

      act(() => {
        result.current.toggleDirective('script-src');
      });

      const defaultSrc = result.current.value.directives.find((d) => d.name === 'default-src');
      const imgSrc = result.current.value.directives.find((d) => d.name === 'img-src');
      expect(defaultSrc?.enabled).toBe(true);
      expect(imgSrc?.enabled).toBe(false);
    });
  });

  describe('addSource', () => {
    it('appends a source to a directive', () => {
      const { result } = renderHook(() => useCspGenerator());

      act(() => {
        result.current.addSource('default-src', 'https://cdn.example.com');
      });

      const defaultSrc = result.current.value.directives.find((d) => d.name === 'default-src');
      expect(defaultSrc?.sources).toEqual(["'self'", 'https://cdn.example.com']);
    });

    it('does not change directive enabled state when adding a source', () => {
      const { result } = renderHook(() => useCspGenerator());

      act(() => {
        result.current.addSource('script-src', 'https://cdn.example.com');
      });

      const scriptSrc = result.current.value.directives.find((d) => d.name === 'script-src');
      expect(scriptSrc?.enabled).toBe(false);
    });

    it('does not affect other directives', () => {
      const { result } = renderHook(() => useCspGenerator());

      act(() => {
        result.current.addSource('default-src', 'https://cdn.example.com');
      });

      const imgSrc = result.current.value.directives.find((d) => d.name === 'img-src');
      expect(imgSrc?.sources).toEqual([]);
    });
  });

  describe('removeSource', () => {
    it('removes a source from a directive', () => {
      const { result } = renderHook(() => useCspGenerator());

      act(() => {
        result.current.addSource('default-src', 'https://cdn.example.com');
      });
      act(() => {
        result.current.removeSource('default-src', 'https://cdn.example.com');
      });

      const defaultSrc = result.current.value.directives.find((d) => d.name === 'default-src');
      expect(defaultSrc?.sources).toEqual(["'self'"]);
    });

    it('does nothing when source does not exist', () => {
      const { result } = renderHook(() => useCspGenerator());

      act(() => {
        result.current.removeSource('default-src', 'https://nonexistent.com');
      });

      const defaultSrc = result.current.value.directives.find((d) => d.name === 'default-src');
      expect(defaultSrc?.sources).toEqual(["'self'"]);
    });
  });

  describe('moveDirective', () => {
    it('moves a directive up one position', () => {
      const { result } = renderHook(() => useCspGenerator());

      act(() => {
        result.current.moveDirective('script-src', 'up');
      });

      expect(result.current.value.directives[0].name).toBe('script-src');
      expect(result.current.value.directives[1].name).toBe('default-src');
    });

    it('moves a directive down one position', () => {
      const { result } = renderHook(() => useCspGenerator());

      act(() => {
        result.current.moveDirective('default-src', 'down');
      });

      expect(result.current.value.directives[0].name).toBe('script-src');
      expect(result.current.value.directives[1].name).toBe('default-src');
    });

    it('does not move past the start', () => {
      const { result } = renderHook(() => useCspGenerator());

      act(() => {
        result.current.moveDirective('default-src', 'up');
      });

      expect(result.current.value.directives[0].name).toBe('default-src');
    });

    it('does not move past the end', () => {
      const { result } = renderHook(() => useCspGenerator());

      act(() => {
        result.current.moveDirective('require-trusted-types-for', 'down');
      });

      const last = result.current.value.directives.at(-1);
      expect(last?.name).toBe('require-trusted-types-for');
    });

    it('preserves directive properties when moving', () => {
      const { result } = renderHook(() => useCspGenerator());

      act(() => {
        result.current.moveDirective('script-src', 'up');
      });

      const scriptSrc = result.current.value.directives.find((d) => d.name === 'script-src');
      expect(scriptSrc?.enabled).toBe(false);
      expect(scriptSrc?.sources).toEqual([]);
    });
  });

  describe('applyPreset', () => {
    it('adds preset sources to matching directives', () => {
      const { result } = renderHook(() => useCspGenerator());
      const googleFontsPreset = SERVICE_PRESETS.find((p) => p.id === 'google-fonts');

      expect(googleFontsPreset).toBeDefined();
      if (!googleFontsPreset) return;

      act(() => {
        result.current.applyPreset(googleFontsPreset);
      });

      const styleSrc = result.current.value.directives.find((d) => d.name === 'style-src');
      expect(styleSrc?.enabled).toBe(true);
      expect(styleSrc?.sources).toContain('https://fonts.googleapis.com');

      const fontSrc = result.current.value.directives.find((d) => d.name === 'font-src');
      expect(fontSrc?.enabled).toBe(true);
      expect(fontSrc?.sources).toContain('https://fonts.gstatic.com');
    });

    it('adds the preset id to appliedPresets', () => {
      const { result } = renderHook(() => useCspGenerator());
      const googleFontsPreset = SERVICE_PRESETS.find((p) => p.id === 'google-fonts');

      expect(googleFontsPreset).toBeDefined();
      if (!googleFontsPreset) return;

      act(() => {
        result.current.applyPreset(googleFontsPreset);
      });

      expect(result.current.value.appliedPresets).toContain('google-fonts');
    });

    it('merges preset sources with existing sources', () => {
      const { result } = renderHook(() => useCspGenerator());
      const googleFontsPreset = SERVICE_PRESETS.find((p) => p.id === 'google-fonts');

      expect(googleFontsPreset).toBeDefined();
      if (!googleFontsPreset) return;

      act(() => {
        result.current.addSource('style-src', 'https://example.com');
      });
      act(() => {
        result.current.applyPreset(googleFontsPreset);
      });

      const styleSrc = result.current.value.directives.find((d) => d.name === 'style-src');
      expect(styleSrc?.sources).toContain('https://example.com');
      expect(styleSrc?.sources).toContain('https://fonts.googleapis.com');
    });

    it('deduplicates merged sources', () => {
      const { result } = renderHook(() => useCspGenerator());
      const googleFontsPreset = SERVICE_PRESETS.find((p) => p.id === 'google-fonts');

      expect(googleFontsPreset).toBeDefined();
      if (!googleFontsPreset) return;

      act(() => {
        result.current.addSource('style-src', "'self'");
      });
      act(() => {
        result.current.applyPreset(googleFontsPreset);
      });

      const styleSrc = result.current.value.directives.find((d) => d.name === 'style-src');
      const selfCount = styleSrc?.sources.filter((s) => s === "'self'").length ?? 0;
      expect(selfCount).toBe(1);
    });

    it('removes preset sources while preserving unrelated sources when toggling off', () => {
      const { result } = renderHook(() => useCspGenerator());
      const googleFontsPreset = SERVICE_PRESETS.find((p) => p.id === 'google-fonts');

      expect(googleFontsPreset).toBeDefined();
      if (!googleFontsPreset) return;

      act(() => {
        result.current.addSource('style-src', 'https://custom.example.com');
        result.current.addSource('default-src', 'https://cdn.example.com');
        result.current.applyPreset(googleFontsPreset);
      });

      expect(result.current.value.appliedPresets).toEqual(['google-fonts']);
      expect(result.current.value.directives.find((d) => d.name === 'style-src')?.sources).toEqual([
        'https://custom.example.com',
        "'self'",
        'https://fonts.googleapis.com',
      ]);
      expect(result.current.value.directives.find((d) => d.name === 'font-src')?.sources).toEqual([
        "'self'",
        'https://fonts.gstatic.com',
      ]);

      act(() => {
        result.current.applyPreset(googleFontsPreset);
      });

      expect(result.current.value.appliedPresets).toEqual([]);
      const styleSrc = result.current.value.directives.find((d) => d.name === 'style-src');
      expect(styleSrc?.sources).toEqual(['https://custom.example.com']);
      expect(styleSrc?.enabled).toBe(true);
      const fontSrc = result.current.value.directives.find((d) => d.name === 'font-src');
      expect(fontSrc?.sources).toEqual([]);
      expect(fontSrc?.enabled).toBe(false);
      const defaultSrc = result.current.value.directives.find((d) => d.name === 'default-src');
      expect(defaultSrc?.sources).toEqual(["'self'", 'https://cdn.example.com']);
      expect(defaultSrc?.enabled).toBe(true);
    });

    it('does not affect directives not in the preset', () => {
      const { result } = renderHook(() => useCspGenerator());
      const googleFontsPreset = SERVICE_PRESETS.find((p) => p.id === 'google-fonts');

      expect(googleFontsPreset).toBeDefined();
      if (!googleFontsPreset) return;

      act(() => {
        result.current.applyPreset(googleFontsPreset);
      });

      const scriptSrc = result.current.value.directives.find((d) => d.name === 'script-src');
      expect(scriptSrc?.enabled).toBe(false);
      expect(scriptSrc?.sources).toEqual([]);
    });
  });

  describe('addHash', () => {
    it('adds a hash entry to the hashes array', () => {
      const { result } = renderHook(() => useCspGenerator());
      const hashEntry: HashEntry = {
        id: 'abc123',
        type: 'script',
        hash: 'sha256-abc123',
        label: 'test script',
      };

      act(() => {
        result.current.addHash(hashEntry);
      });

      expect(result.current.value.hashes).toHaveLength(1);
      expect(result.current.value.hashes[0]).toEqual(hashEntry);
    });

    it('appends to existing hashes', () => {
      const { result } = renderHook(() => useCspGenerator());

      act(() => {
        result.current.addHash({
          id: 'existing',
          type: 'style',
          hash: 'sha256-existing',
          label: 'old',
        });
      });
      act(() => {
        result.current.addHash({ id: 'new123', type: 'script', hash: 'sha256-new', label: 'new' });
      });

      expect(result.current.value.hashes).toHaveLength(2);
      expect(result.current.value.hashes[1]).toEqual({
        id: 'new123',
        type: 'script',
        hash: 'sha256-new',
        label: 'new',
      });
    });
  });

  describe('removeHash', () => {
    it('removes a hash by id', () => {
      const { result } = renderHook(() => useCspGenerator());

      act(() => {
        result.current.addHash({ id: 'hash1', type: 'script', hash: 'sha256-abc', label: 'first' });
      });
      act(() => {
        result.current.addHash({ id: 'hash2', type: 'style', hash: 'sha256-def', label: 'second' });
      });
      act(() => {
        result.current.removeHash('hash1');
      });

      expect(result.current.value.hashes).toHaveLength(1);
      expect(result.current.value.hashes[0].id).toBe('hash2');
    });

    it('does nothing when hash id does not exist', () => {
      const { result } = renderHook(() => useCspGenerator());

      act(() => {
        result.current.removeHash('nonexistent');
      });

      expect(result.current.value.hashes).toHaveLength(0);
    });
  });

  describe('importDirectives', () => {
    it('replaces all directives', () => {
      const { result } = renderHook(() => useCspGenerator());
      const newDirectives: DirectiveConfig[] = [
        {
          name: 'default-src',
          label: 'default-src',
          description: '',
          enabled: true,
          sources: ["'self'", 'https://cdn.com'],
        },
      ];

      act(() => {
        result.current.importDirectives(newDirectives);
      });

      expect(result.current.value.directives).toEqual(newDirectives);
    });

    it('clears appliedPresets when importing', () => {
      const { result } = renderHook(() => useCspGenerator());
      const googleFontsPreset = SERVICE_PRESETS.find((p) => p.id === 'google-fonts');

      expect(googleFontsPreset).toBeDefined();
      if (!googleFontsPreset) return;

      act(() => {
        result.current.applyPreset(googleFontsPreset);
      });
      expect(result.current.value.appliedPresets).toContain('google-fonts');

      act(() => {
        result.current.importDirectives(DEFAULT_STORE_VALUE.directives);
      });

      expect(result.current.value.appliedPresets).toEqual([]);
    });

    it('preserves hashes when importing directives', () => {
      const { result } = renderHook(() => useCspGenerator());

      act(() => {
        result.current.addHash({ id: 'hash1', type: 'script', hash: 'sha256-abc', label: 'test' });
      });
      act(() => {
        result.current.importDirectives(DEFAULT_STORE_VALUE.directives);
      });

      expect(result.current.value.hashes).toHaveLength(1);
      expect(result.current.value.appliedPresets).toEqual([]);
    });
  });

  describe('reset', () => {
    it('resets all state to defaults', () => {
      const { result } = renderHook(() => useCspGenerator());
      const googleFontsPreset = SERVICE_PRESETS.find((p) => p.id === 'google-fonts');

      expect(googleFontsPreset).toBeDefined();
      if (!googleFontsPreset) return;

      act(() => {
        result.current.applyPreset(googleFontsPreset);
      });
      expect(result.current.value.appliedPresets).toEqual(['google-fonts']);

      act(() => {
        result.current.toggleDirective('default-src');
      });
      act(() => {
        result.current.addSource('default-src', 'https://custom.com');
      });
      act(() => {
        result.current.addHash({ id: 'hash1', type: 'script', hash: 'sha256-abc', label: 'test' });
      });
      expect(result.current.value.directives.find((d) => d.name === 'default-src')?.enabled).toBe(
        false
      );
      expect(
        result.current.value.directives.find((d) => d.name === 'default-src')?.sources
      ).toEqual(["'self'", 'https://custom.com']);
      expect(result.current.value.hashes).toHaveLength(1);

      act(() => {
        result.current.reset();
      });

      expect(result.current.value).toEqual(DEFAULT_STORE_VALUE);
    });
  });

  describe('integration', () => {
    it('handles a realistic workflow', () => {
      const { result } = renderHook(() => useCspGenerator());
      const googleFontsPreset = SERVICE_PRESETS.find((p) => p.id === 'google-fonts');

      expect(googleFontsPreset).toBeDefined();
      if (!googleFontsPreset) return;

      // Apply preset
      act(() => {
        result.current.applyPreset(googleFontsPreset);
      });
      expect(result.current.value.appliedPresets).toContain('google-fonts');
      expect(result.current.value.directives.find((d) => d.name === 'style-src')?.enabled).toBe(
        true
      );

      // Add a custom source
      act(() => {
        result.current.addSource('font-src', 'https://my-cdn.com');
      });
      const fontSrc = result.current.value.directives.find((d) => d.name === 'font-src');
      expect(fontSrc?.sources).toContain('https://my-cdn.com');

      // Toggle off the preset
      act(() => {
        result.current.applyPreset(googleFontsPreset);
      });
      expect(result.current.value.appliedPresets).toEqual([]);
      expect(result.current.value.directives.find((d) => d.name === 'font-src')?.sources).toEqual([
        'https://my-cdn.com',
      ]);
      expect(result.current.value.directives.find((d) => d.name === 'font-src')?.enabled).toBe(
        true
      );
      expect(result.current.value.directives.find((d) => d.name === 'style-src')?.sources).toEqual(
        []
      );
      expect(result.current.value.directives.find((d) => d.name === 'style-src')?.enabled).toBe(
        false
      );

      // Add and remove a hash
      act(() => {
        result.current.addHash({ id: 'h1', type: 'script', hash: 'sha256-test', label: 'main.js' });
      });
      expect(result.current.value.hashes).toHaveLength(1);

      act(() => {
        result.current.removeHash('h1');
      });
      expect(result.current.value.hashes).toHaveLength(0);
    });
  });
});
