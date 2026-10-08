import { describe, expect, it } from 'vitest';
import {
  DEFAULT_FILTER_VALUE,
  FILTER_PRESETS,
  MAX_FILTERS,
  getFilterStyles,
  normalizeFilterValue,
  serializeFilterValue,
  type FilterEntry,
} from './utils';

describe('serializeFilterValue', () => {
  it('serializes every filter function with its arguments', () => {
    const filters: FilterEntry[] = [
      { id: 'blur', type: 'blur', value: '4', unit: 'px' },
      { id: 'brightness', type: 'brightness', value: '120', unit: '%' },
      { id: 'contrast', type: 'contrast', value: '90', unit: '%' },
      {
        id: 'drop-shadow',
        type: 'drop-shadow',
        x: '2',
        xUnit: 'px',
        y: '4',
        yUnit: 'px',
        blur: '6',
        blurUnit: 'px',
        color: '#123456',
      },
      { id: 'grayscale', type: 'grayscale', value: '50', unit: '%' },
      { id: 'hue-rotate', type: 'hue-rotate', value: '90', unit: 'deg' },
      { id: 'invert', type: 'invert', value: '25', unit: '%' },
      { id: 'opacity', type: 'opacity', value: '80', unit: '%' },
      { id: 'saturate', type: 'saturate', value: '150', unit: '%' },
      { id: 'sepia', type: 'sepia', value: '10', unit: '%' },
      { id: 'url', type: 'url', value: '#my-filter' },
    ];

    expect(serializeFilterValue({ filters })).toBe(
      'blur(4px) brightness(120%) contrast(90%) drop-shadow(2px 4px 6px #123456) grayscale(50%) hue-rotate(90deg) invert(25%) opacity(80%) saturate(150%) sepia(10%) url(#my-filter)'
    );
  });

  it('preserves filter order and duplicate functions', () => {
    const value = {
      filters: [
        { id: 'first', type: 'contrast' as const, value: '130', unit: '%' },
        { id: 'second', type: 'blur' as const, value: '2', unit: 'px' },
        { id: 'third', type: 'contrast' as const, value: '80', unit: '%' },
      ],
    };

    expect(serializeFilterValue(value)).toBe('contrast(130%) blur(2px) contrast(80%)');
  });

  it('omits optional drop-shadow blur and color values', () => {
    expect(
      serializeFilterValue({
        filters: [{ id: 'shadow', type: 'drop-shadow', x: '-2', xUnit: 'px', y: '3', yUnit: 'em' }],
      })
    ).toBe('drop-shadow(-2px 3em)');
  });

  it('preserves raw CSS math expressions without appending a unit', () => {
    expect(
      serializeFilterValue({
        filters: [
          { id: 'blur', type: 'blur', value: 'calc(1rem + 2px)', unit: 'custom' },
          { id: 'rotate', type: 'hue-rotate', value: 'calc(0.25turn)', unit: 'custom' },
        ],
      })
    ).toBe('blur(calc(1rem + 2px)) hue-rotate(calc(0.25turn))');
  });

  it('returns none when the function chain is empty', () => {
    expect(serializeFilterValue(DEFAULT_FILTER_VALUE)).toBe('none');
  });
});

describe('normalizeFilterValue', () => {
  it('falls back to an empty chain for malformed or legacy keyword data', () => {
    expect(normalizeFilterValue({ filters: [{ type: 'unsupported' }] })).toEqual(
      DEFAULT_FILTER_VALUE
    );
    expect(normalizeFilterValue({ mode: 'keyword', keyword: 'revert-layer' })).toEqual(
      DEFAULT_FILTER_VALUE
    );
  });

  it('normalizes malformed entries and preserves valid order', () => {
    expect(
      normalizeFilterValue({
        filters: [
          { id: 'a', type: 'blur', value: '6.5', unit: 'rem' },
          { id: 'bad', type: 'wrong', value: '9' },
          { id: 'b', type: 'hue-rotate', value: '180', unit: 'turn' },
        ],
      })
    ).toEqual({
      filters: [
        { id: 'a', type: 'blur', value: '6.5', unit: 'rem' },
        { id: 'b', type: 'hue-rotate', value: '180', unit: 'turn' },
      ],
    });
  });

  it('preserves legacy function-chain storage in the chain-only model', () => {
    expect(
      normalizeFilterValue({
        mode: 'functions',
        filters: [{ id: 'a', type: 'blur', value: '6', unit: 'px' }],
      })
    ).toEqual({ filters: [{ id: 'a', type: 'blur', value: '6', unit: 'px' }] });
  });

  it('caps oversized persisted chains at the maximum', () => {
    const filters = Array.from({ length: MAX_FILTERS + 5 }, (_, index) => ({
      id: `filter-${index}`,
      type: 'blur',
      value: '2',
      unit: 'px',
    }));

    expect(normalizeFilterValue({ filters }).filters).toHaveLength(MAX_FILTERS);
  });

  it('preserves CSS expressions and valid units while correcting incompatible units', () => {
    expect(
      normalizeFilterValue({
        filters: [
          { id: 'blur', type: 'blur', value: 'calc(1rem + 2px)', unit: 'custom' },
          { id: 'brightness', type: 'brightness', value: '120', unit: 'px' },
          { id: 'hue', type: 'hue-rotate', value: '100', unit: 'grad' },
        ],
      })
    ).toEqual({
      filters: [
        { id: 'blur', type: 'blur', value: 'calc(1rem + 2px)', unit: 'custom' },
        { id: 'brightness', type: 'brightness', value: '120', unit: '%' },
        { id: 'hue', type: 'hue-rotate', value: '100', unit: 'grad' },
      ],
    });
  });
});

describe('filter presets', () => {
  it('provides at least five named filter chains', () => {
    expect(FILTER_PRESETS.length).toBeGreaterThanOrEqual(5);
    expect(FILTER_PRESETS.every((preset) => preset.filters.length > 0)).toBe(true);
  });
});

describe('getFilterStyles', () => {
  it('returns the current filter as a React style object', () => {
    expect(
      getFilterStyles({ filters: [{ id: 'gray', type: 'grayscale', value: '100', unit: '%' }] })
    ).toEqual({ filter: 'grayscale(100%)' });
  });
});
