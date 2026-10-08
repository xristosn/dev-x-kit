'use client';

import { InputWrapper } from '@/components/input-wrapper';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  FILTER_ANGLE_UNITS,
  FILTER_LENGTH_UNITS,
  type FilterEntry,
  type FilterType,
} from '../_lib/utils';

const LENGTH_UNITS = [...FILTER_LENGTH_UNITS, 'custom'];
const AMOUNT_UNITS = ['%', '', 'custom'];
const ANGLE_UNITS = [...FILTER_ANGLE_UNITS, 'custom'];

export const FILTER_LABELS: Record<FilterType, string> = {
  blur: 'Blur',
  brightness: 'Brightness',
  contrast: 'Contrast',
  'drop-shadow': 'Drop shadow',
  grayscale: 'Grayscale',
  'hue-rotate': 'Hue rotate',
  invert: 'Invert',
  opacity: 'Opacity',
  saturate: 'Saturate',
  sepia: 'Sepia',
  url: 'SVG filter URL',
};

type ValueInputProps = {
  label: string;
  value: string;
  unit?: string;
  units?: string[];
  testId: string;
  onValueChange: (value: string) => void;
  onUnitChange?: (value: string) => void;
};

function ValueInput({
  label,
  value,
  unit,
  units,
  testId,
  onValueChange,
  onUnitChange,
}: ValueInputProps) {
  return (
    <InputWrapper label={label} id={testId} className="min-w-0">
      <div className="flex gap-2">
        <Input
          id={testId}
          data-testid={testId}
          value={value}
          onChange={(event) => onValueChange(event.target.value)}
          className="min-w-0"
        />
        {units && onUnitChange && (
          <select
            aria-label={`${label} unit`}
            data-testid={`${testId}-unit`}
            className="h-9 rounded-md border border-input bg-background px-2 text-sm"
            value={unit}
            onChange={(event) => onUnitChange(event.target.value)}
          >
            {units.map((option) => (
              <option key={option || 'number'} value={option}>
                {option === 'custom' ? 'CSS expression' : option || 'number'}
              </option>
            ))}
          </select>
        )}
      </div>
    </InputWrapper>
  );
}

type FilterEntryEditorProps = {
  entry: FilterEntry;
  index: number;
  count: number;
  onChange: (changes: Partial<FilterEntry>) => void;
  onRemove: () => void;
  onMove: (direction: -1 | 1) => void;
};

export function FilterEntryEditor({
  entry,
  index,
  count,
  onChange,
  onRemove,
  onMove,
}: FilterEntryEditorProps) {
  const input = (key: keyof FilterEntry, label: string, units?: string[]) => (
    <ValueInput
      label={label}
      value={String(entry[key] ?? '')}
      unit={entry.unit}
      units={units}
      testId={`filter-${index}-${key}`}
      onValueChange={(value) => onChange({ [key]: value })}
      onUnitChange={units ? (unit) => onChange({ unit }) : undefined}
    />
  );

  return (
    <article
      data-testid={`filter-entry-${index}`}
      className="flex flex-col gap-4 rounded-xl border bg-background p-4"
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h3 className="font-medium">
          {index + 1}. {FILTER_LABELS[entry.type]}
        </h3>
        <div className="flex items-center gap-2">
          <Button
            data-testid={`filter-move-up-${index}`}
            type="button"
            variant="outline"
            size="sm"
            disabled={index === 0}
            aria-label={`Move ${FILTER_LABELS[entry.type]} up`}
            onClick={() => onMove(-1)}
          >
            ↑
          </Button>
          <Button
            data-testid={`filter-move-down-${index}`}
            type="button"
            variant="outline"
            size="sm"
            disabled={index === count - 1}
            aria-label={`Move ${FILTER_LABELS[entry.type]} down`}
            onClick={() => onMove(1)}
          >
            ↓
          </Button>
          <Button
            data-testid={`filter-remove-${index}`}
            type="button"
            variant="ghost"
            size="sm"
            aria-label={`Remove ${FILTER_LABELS[entry.type]}`}
            onClick={onRemove}
          >
            Remove
          </Button>
        </div>
      </div>

      {entry.type === 'drop-shadow' ? (
        <div className="grid gap-4 sm:grid-cols-2">
          <ValueInput
            label="Horizontal offset"
            value={entry.x ?? '0'}
            unit={entry.xUnit}
            units={LENGTH_UNITS}
            testId={`filter-${entry.id}-x`}
            onValueChange={(x) => onChange({ x })}
            onUnitChange={(xUnit) => onChange({ xUnit })}
          />
          <ValueInput
            label="Vertical offset"
            value={entry.y ?? '0'}
            unit={entry.yUnit}
            units={LENGTH_UNITS}
            testId={`filter-${entry.id}-y`}
            onValueChange={(y) => onChange({ y })}
            onUnitChange={(yUnit) => onChange({ yUnit })}
          />
          <ValueInput
            label="Blur radius (optional)"
            value={entry.blur ?? ''}
            unit={entry.blurUnit}
            units={LENGTH_UNITS}
            testId={`filter-${entry.id}-blur`}
            onValueChange={(blur) => onChange({ blur })}
            onUnitChange={(blurUnit) => onChange({ blurUnit })}
          />
          <InputWrapper label="Color (optional)" id={`filter-${entry.id}-color`}>
            <Input
              id={`filter-${entry.id}-color`}
              data-testid={`filter-${entry.id}-color`}
              value={entry.color ?? ''}
              onChange={(event) => onChange({ color: event.target.value })}
            />
          </InputWrapper>
        </div>
      ) : entry.type === 'url' ? (
        <InputWrapper
          label="SVG filter reference"
          id={`filter-${entry.id}-value`}
          helperText="Enter a fragment such as #my-filter or a URL."
        >
          <Input
            id={`filter-${entry.id}-value`}
            data-testid={`filter-${entry.id}-value`}
            value={entry.value ?? ''}
            placeholder="#filter-id"
            onChange={(event) => onChange({ value: event.target.value })}
          />
        </InputWrapper>
      ) : (
        <div className="max-w-sm">
          {input(
            'value',
            entry.type === 'blur'
              ? 'Blur amount'
              : entry.type === 'hue-rotate'
                ? 'Angle'
                : 'Amount',
            entry.type === 'blur'
              ? LENGTH_UNITS
              : entry.type === 'hue-rotate'
                ? ANGLE_UNITS
                : AMOUNT_UNITS
          )}
        </div>
      )}
    </article>
  );
}
