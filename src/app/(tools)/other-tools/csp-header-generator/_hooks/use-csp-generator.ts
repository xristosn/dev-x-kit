'use client';

import { useCallback } from 'react';
import { useWebStorage } from '@/hooks/use-web-storage';
import type { DirectiveName, ServicePreset, HashEntry, StoreValue } from '../_lib/types';
import { DEFAULT_STORE_VALUE } from '../_lib/utils';

export function useCspGenerator() {
  const [value, setValue, reset] = useWebStorage<StoreValue>(
    'csp-generator',
    'local',
    DEFAULT_STORE_VALUE
  );

  const toggleDirective = useCallback(
    (name: DirectiveName) => {
      setValue((prev) => ({
        ...prev,
        directives: prev.directives.map((d) =>
          d.name === name ? { ...d, enabled: !d.enabled } : d
        ),
      }));
    },
    [setValue]
  );

  const addSource = useCallback(
    (name: DirectiveName, source: string) => {
      setValue((prev) => ({
        ...prev,
        directives: prev.directives.map((d) =>
          d.name === name ? { ...d, sources: [...d.sources, source] } : d
        ),
      }));
    },
    [setValue]
  );

  const removeSource = useCallback(
    (name: DirectiveName, source: string) => {
      setValue((prev) => ({
        ...prev,
        directives: prev.directives.map((d) =>
          d.name === name ? { ...d, sources: d.sources.filter((s) => s !== source) } : d
        ),
      }));
    },
    [setValue]
  );

  const moveDirective = useCallback(
    (name: DirectiveName, direction: 'up' | 'down') => {
      setValue((prev) => {
        const idx = prev.directives.findIndex((d) => d.name === name);
        if (idx === -1) return prev;
        const newIdx = direction === 'up' ? idx - 1 : idx + 1;
        if (newIdx < 0 || newIdx >= prev.directives.length) return prev;
        const newDirectives = [...prev.directives];
        [newDirectives[idx], newDirectives[newIdx]] = [newDirectives[newIdx], newDirectives[idx]];
        return { ...prev, directives: newDirectives };
      });
    },
    [setValue]
  );

  const applyPreset = useCallback(
    (preset: ServicePreset) => {
      setValue((prev) => {
        if (prev.appliedPresets.includes(preset.id)) {
          const newDirectives = prev.directives.map((d) => {
            const presetSourcesForDirective = preset.directives[d.name as DirectiveName];
            if (presetSourcesForDirective) {
              const sources = d.sources.filter((s) => !presetSourcesForDirective.includes(s));
              return {
                ...d,
                enabled: sources.length > 0,
                sources,
              };
            }
            return d;
          });
          return {
            ...prev,
            directives: newDirectives,
            appliedPresets: prev.appliedPresets.filter((id) => id !== preset.id),
          };
        }

        const newDirectives = prev.directives.map((d) => {
          const presetSources = preset.directives[d.name];
          if (presetSources) {
            const existing = new Set(d.sources);
            const merged = [...new Set([...existing, ...presetSources])];
            return { ...d, enabled: true, sources: merged };
          }
          return d;
        });

        return {
          ...prev,
          directives: newDirectives,
          appliedPresets: [...prev.appliedPresets, preset.id],
        };
      });
    },
    [setValue]
  );

  const addHash = useCallback(
    (entry: HashEntry) => {
      setValue((prev) => ({
        ...prev,
        hashes: [...prev.hashes, entry],
      }));
    },
    [setValue]
  );

  const removeHash = useCallback(
    (id: string) => {
      setValue((prev) => ({
        ...prev,
        hashes: prev.hashes.filter((h) => h.id !== id),
      }));
    },
    [setValue]
  );

  const importDirectives = useCallback(
    (directives: StoreValue['directives']) => {
      setValue((prev) => ({
        ...prev,
        directives,
        appliedPresets: [],
      }));
    },
    [setValue]
  );

  return {
    value,
    toggleDirective,
    addSource,
    removeSource,
    moveDirective,
    applyPreset,
    addHash,
    removeHash,
    importDirectives,
    reset,
  };
}
