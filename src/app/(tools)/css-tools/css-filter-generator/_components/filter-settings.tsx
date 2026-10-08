'use client';

import { InputWrapper } from '@/components/input-wrapper';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  FILTER_PRESETS,
  FILTER_TYPES,
  MAX_FILTERS,
  type FilterEntry,
  type FilterType,
} from '../_lib/utils';
import { FilterEntryEditor, FILTER_LABELS } from './filter-entry-editor';

type FilterSettingsProps = {
  filters: FilterEntry[];
  newFilterType: FilterType;
  onNewFilterTypeChange: (type: FilterType) => void;
  onReset: () => void;
  onApplyPreset: (filters: FilterEntry[]) => void;
  onAddFilter: () => void;
  onUpdateFilter: (id: string, changes: Partial<FilterEntry>) => void;
  onRemoveFilter: (id: string) => void;
  onMoveFilter: (id: string, direction: -1 | 1) => void;
};

export function FilterSettings({
  filters,
  newFilterType,
  onNewFilterTypeChange,
  onReset,
  onApplyPreset,
  onAddFilter,
  onUpdateFilter,
  onRemoveFilter,
  onMoveFilter,
}: FilterSettingsProps) {
  return (
    <section className="flex min-w-0 flex-col gap-6 rounded-2xl border bg-card p-5 sm:p-6">
      <div className="flex items-center justify-between gap-4 border-b pb-4">
        <div>
          <h2 className="text-lg font-semibold tracking-tight">Filter settings</h2>
          <p className="mt-1 text-sm text-muted-foreground">Build a CSS filter chain in order</p>
        </div>
        <Button
          data-testid="filter-reset"
          type="button"
          size="sm"
          variant="secondary"
          onClick={onReset}
        >
          Reset
        </Button>
      </div>

      <InputWrapper label="Presets">
        <div className="flex flex-wrap gap-2">
          {FILTER_PRESETS.map((preset) => (
            <Button
              key={preset.id}
              data-testid={`filter-preset-${preset.id}`}
              type="button"
              variant="outline"
              size="sm"
              onClick={() => onApplyPreset(preset.filters)}
            >
              {preset.label}
            </Button>
          ))}
        </div>
      </InputWrapper>

      <InputWrapper label="Add filter function">
        <div className="flex gap-2">
          <Select
            data-testid="filter-type-select"
            value={newFilterType}
            onValueChange={(type) => onNewFilterTypeChange(type as FilterType)}
          >
            <SelectTrigger data-testid="filter-type-select-trigger">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {FILTER_TYPES.map((type) => (
                <SelectItem data-testid={`filter-type-option-${type}`} key={type} value={type}>
                  {FILTER_LABELS[type]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            data-testid="filter-add"
            type="button"
            disabled={filters.length >= MAX_FILTERS}
            onClick={onAddFilter}
          >
            Add
          </Button>
        </div>
        <p data-testid="filter-count" className="mt-2 text-xs text-muted-foreground">
          {filters.length} / {MAX_FILTERS} filters
        </p>
      </InputWrapper>

      <div
        data-testid="filter-list-scroll"
        className="max-h-[32rem] overflow-y-auto overscroll-contain"
      >
        <div className="flex flex-col gap-3 pr-1">
          {filters.length === 0 ? (
            <p
              data-testid="filter-empty-state"
              className="rounded-xl border border-dashed px-4 py-8 text-center text-sm text-muted-foreground"
            >
              Add a filter function to start building your chain. The initial value is none.
            </p>
          ) : (
            filters.map((entry, index) => (
              <FilterEntryEditor
                key={entry.id}
                entry={entry}
                index={index}
                count={filters.length}
                onChange={(changes) => onUpdateFilter(entry.id, changes)}
                onRemove={() => onRemoveFilter(entry.id)}
                onMove={(direction) => onMoveFilter(entry.id, direction)}
              />
            ))
          )}
        </div>
      </div>
      <p className="text-sm text-muted-foreground">
        Filters are applied from left to right. Reordering a chain can change its visual result.
      </p>
    </section>
  );
}
