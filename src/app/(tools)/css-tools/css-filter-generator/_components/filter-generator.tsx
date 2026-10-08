'use client';

import { ClientOnly } from '@/components/client-only';
import { Skeleton } from '@/components/ui/skeleton';
import { useWebStorage } from '@/hooks/use-web-storage';
import { useState } from 'react';
import {
  createFilterEntry,
  DEFAULT_FILTER_VALUE,
  MAX_FILTERS,
  normalizeFilterValue,
  serializeFilterValue,
  type FilterEntry,
  type FilterType,
  type FilterValue,
} from '../_lib/utils';
import { FilterPreview } from './filter-preview';
import { FilterSettings } from './filter-settings';

function FilterGeneratorContent() {
  const [storedValue, setValue, resetValue] = useWebStorage(
    'css-filter-generator',
    'infer',
    DEFAULT_FILTER_VALUE
  );
  const value = normalizeFilterValue(storedValue);
  const [newFilterType, setNewFilterType] = useState<FilterType>('blur');
  const filter = serializeFilterValue(value);

  const update = (nextValue: FilterValue) => setValue(normalizeFilterValue(nextValue));

  const addFilter = () => {
    if (value.filters.length >= MAX_FILTERS) return;
    const id = `filter-${globalThis.crypto.randomUUID()}`;
    update({ filters: [...value.filters, createFilterEntry(newFilterType, id)] });
  };

  const applyPreset = (filters: FilterEntry[]) => {
    update({
      filters: filters.map((entry) => ({
        ...entry,
        id: `filter-${globalThis.crypto.randomUUID()}`,
      })),
    });
  };

  const updateFilter = (id: string, changes: Partial<FilterEntry>) => {
    update({
      filters: value.filters.map((entry) => (entry.id === id ? { ...entry, ...changes } : entry)),
    });
  };

  const removeFilter = (id: string) => {
    update({ filters: value.filters.filter((entry) => entry.id !== id) });
  };

  const moveFilter = (id: string, direction: -1 | 1) => {
    const index = value.filters.findIndex((entry) => entry.id === id);
    const target = index + direction;
    if (index < 0 || target < 0 || target >= value.filters.length) return;
    const filters = [...value.filters];
    [filters[index], filters[target]] = [filters[target], filters[index]];
    update({ filters });
  };

  return (
    <div className="grid min-w-0 items-start gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(21rem,30rem)]">
      <FilterSettings
        filters={value.filters}
        newFilterType={newFilterType}
        onNewFilterTypeChange={setNewFilterType}
        onReset={resetValue}
        onApplyPreset={applyPreset}
        onAddFilter={addFilter}
        onUpdateFilter={updateFilter}
        onRemoveFilter={removeFilter}
        onMoveFilter={moveFilter}
      />
      <ClientOnly
        fallback={
          <Skeleton
            data-testid="filter-preview-fallback"
            className="aspect-4/3 w-full rounded-2xl"
          />
        }
      >
        <FilterPreview value={value} filter={filter} />
      </ClientOnly>
    </div>
  );
}

export function FilterGenerator() {
  return (
    <ClientOnly
      fallback={
        <div className="grid min-w-0 items-start gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(21rem,30rem)]">
          <section
            data-testid="filter-settings-fallback"
            className="flex min-w-0 flex-col gap-6 rounded-2xl border bg-card p-5 sm:p-6"
          >
            <div className="flex items-center justify-between gap-4 border-b pb-4">
              <div className="flex-1 space-y-2">
                <Skeleton className="h-6 w-36" />
                <Skeleton className="h-4 w-56 max-w-full" />
              </div>
              <Skeleton className="h-9 w-16" />
            </div>
            <Skeleton className="h-4 w-16" />
            <div className="flex flex-wrap gap-2">
              <Skeleton className="h-8 w-20" />
              <Skeleton className="h-8 w-24" />
              <Skeleton className="h-8 w-20" />
            </div>
            <Skeleton className="h-4 w-36" />
            <div className="flex gap-2">
              <Skeleton className="h-10 flex-1" />
              <Skeleton className="h-10 w-16" />
            </div>
            <Skeleton className="h-24 w-full rounded-xl" />
            <Skeleton className="h-4 w-full max-w-md" />
          </section>
          <div className="flex min-w-0 flex-col gap-6">
            <section
              data-testid="filter-preview-fallback"
              className="flex flex-col gap-4 rounded-2xl border bg-card p-5 sm:p-6"
            >
              <div className="space-y-2">
                <Skeleton className="h-6 w-28" />
                <Skeleton className="h-4 w-48 max-w-full" />
              </div>
              <Skeleton className="aspect-4/3 w-full rounded-xl" />
              <Skeleton className="h-4 w-full" />
            </section>
            <Skeleton data-testid="filter-code-fallback" className="min-h-48 w-full rounded-2xl" />
          </div>
        </div>
      }
    >
      <FilterGeneratorContent />
    </ClientOnly>
  );
}
