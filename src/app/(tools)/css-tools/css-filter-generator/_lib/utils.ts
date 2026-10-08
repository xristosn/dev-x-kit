export const FILTER_TYPES = [
  'blur',
  'brightness',
  'contrast',
  'drop-shadow',
  'grayscale',
  'hue-rotate',
  'invert',
  'opacity',
  'saturate',
  'sepia',
  'url',
] as const;

export type FilterType = (typeof FILTER_TYPES)[number];
export const MAX_FILTERS = 20;

export type FilterEntry = {
  id: string;
  type: FilterType;
  value?: string;
  unit?: string;
  x?: string;
  xUnit?: string;
  y?: string;
  yUnit?: string;
  blur?: string;
  blurUnit?: string;
  color?: string;
};

export type FilterValue = { filters: FilterEntry[] };

export const DEFAULT_FILTER_VALUE: FilterValue = { filters: [] };

const DEFAULTS: Record<FilterType, Omit<FilterEntry, 'id' | 'type'>> = {
  blur: { value: '4', unit: 'px' },
  brightness: { value: '120', unit: '%' },
  contrast: { value: '120', unit: '%' },
  'drop-shadow': {
    x: '2',
    xUnit: 'px',
    y: '4',
    yUnit: 'px',
    blur: '6',
    blurUnit: 'px',
    color: '#00000080',
  },
  grayscale: { value: '100', unit: '%' },
  'hue-rotate': { value: '90', unit: 'deg' },
  invert: { value: '100', unit: '%' },
  opacity: { value: '50', unit: '%' },
  saturate: { value: '150', unit: '%' },
  sepia: { value: '100', unit: '%' },
  url: { value: '#filter' },
};

export const FILTER_LENGTH_UNITS = [
  'cap',
  'ch',
  'cm',
  'cqb',
  'cqh',
  'cqi',
  'cqmax',
  'cqmin',
  'cqw',
  'dvb',
  'dvh',
  'dvi',
  'dvmax',
  'dvmin',
  'dvw',
  'em',
  'ex',
  'ic',
  'in',
  'lh',
  'lvb',
  'lvh',
  'lvi',
  'lvmax',
  'lvmin',
  'lvw',
  'mm',
  'pc',
  'pt',
  'px',
  'rem',
  'rlh',
  'svb',
  'svh',
  'svi',
  'svmax',
  'svmin',
  'svw',
  'vb',
  'vh',
  'vi',
  'vmax',
  'vmin',
  'vw',
] as const;
export const FILTER_ANGLE_UNITS = ['deg', 'grad', 'rad', 'turn'] as const;

export const FILTER_PRESETS: { id: string; label: string; filters: FilterEntry[] }[] = [
  {
    id: 'subtle',
    label: 'Subtle',
    filters: [
      { id: 'subtle-brightness', type: 'brightness', value: '105', unit: '%' },
      { id: 'subtle-contrast', type: 'contrast', value: '102', unit: '%' },
    ],
  },
  {
    id: 'warm',
    label: 'Warm',
    filters: [
      { id: 'warm-sepia', type: 'sepia', value: '25', unit: '%' },
      { id: 'warm-saturate', type: 'saturate', value: '115', unit: '%' },
    ],
  },
  {
    id: 'cool',
    label: 'Cool',
    filters: [
      { id: 'cool-hue', type: 'hue-rotate', value: '175', unit: 'deg' },
      { id: 'cool-saturate', type: 'saturate', value: '110', unit: '%' },
    ],
  },
  {
    id: 'vintage',
    label: 'Vintage',
    filters: [
      { id: 'vintage-sepia', type: 'sepia', value: '45', unit: '%' },
      { id: 'vintage-contrast', type: 'contrast', value: '90', unit: '%' },
      { id: 'vintage-saturate', type: 'saturate', value: '80', unit: '%' },
    ],
  },
  {
    id: 'vivid',
    label: 'Vivid',
    filters: [
      { id: 'vivid-saturate', type: 'saturate', value: '175', unit: '%' },
      { id: 'vivid-contrast', type: 'contrast', value: '110', unit: '%' },
    ],
  },
  {
    id: 'dramatic',
    label: 'Dramatic',
    filters: [
      { id: 'dramatic-contrast', type: 'contrast', value: '145', unit: '%' },
      { id: 'dramatic-saturate', type: 'saturate', value: '75', unit: '%' },
    ],
  },
  {
    id: 'grayscale',
    label: 'Grayscale',
    filters: [{ id: 'grayscale-filter', type: 'grayscale', value: '100', unit: '%' }],
  },
  {
    id: 'soft-focus',
    label: 'Soft focus',
    filters: [
      { id: 'soft-focus-blur', type: 'blur', value: '1.5', unit: 'px' },
      { id: 'soft-focus-brightness', type: 'brightness', value: '108', unit: '%' },
    ],
  },
];

const VALUE_UNITS = ['%', '', 'custom'] as const;
const LENGTH_UNITS = [...FILTER_LENGTH_UNITS, 'custom'] as const;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function getString(value: unknown, fallback: string): string {
  return typeof value === 'string' ? value : fallback;
}

function getUnit(value: unknown, fallback: string, allowed: readonly string[]): string {
  return typeof value === 'string' && allowed.includes(value) ? value : fallback;
}

function normalizeEntry(entry: unknown): FilterEntry | null {
  if (!isRecord(entry) || typeof entry.id !== 'string') return null;
  if (!FILTER_TYPES.includes(entry.type as FilterType)) return null;

  const type = entry.type as FilterType;
  const defaults = DEFAULTS[type];
  const normalized: FilterEntry = { id: entry.id, type };

  if (type === 'drop-shadow') {
    normalized.x = getString(entry.x, defaults.x ?? '0');
    normalized.xUnit = getUnit(entry.xUnit, defaults.xUnit ?? 'px', LENGTH_UNITS);
    normalized.y = getString(entry.y, defaults.y ?? '0');
    normalized.yUnit = getUnit(entry.yUnit, defaults.yUnit ?? 'px', LENGTH_UNITS);
    normalized.blur = getString(entry.blur, defaults.blur ?? '0');
    normalized.blurUnit = getUnit(entry.blurUnit, defaults.blurUnit ?? 'px', LENGTH_UNITS);
    normalized.color = getString(entry.color, defaults.color ?? '#00000080');
    return normalized;
  }

  normalized.value = getString(entry.value, defaults.value ?? '');
  if (type !== 'url') {
    const allowed =
      type === 'blur'
        ? LENGTH_UNITS
        : type === 'hue-rotate'
          ? [...FILTER_ANGLE_UNITS, 'custom']
          : VALUE_UNITS;
    normalized.unit = getUnit(entry.unit, defaults.unit ?? '', allowed);
  }
  return normalized;
}

export function createFilterEntry(type: FilterType, id: string): FilterEntry {
  return { id, type, ...DEFAULTS[type] };
}

export function normalizeFilterValue(value: unknown): FilterValue {
  if (!isRecord(value) || !Array.isArray(value.filters)) return DEFAULT_FILTER_VALUE;

  const filters = value.filters
    .slice(0, MAX_FILTERS)
    .map(normalizeEntry)
    .filter((entry): entry is FilterEntry => entry !== null);
  return { filters };
}

function formatAmount(value: string | undefined, unit: string | undefined, fallback: string) {
  const amount = value ?? fallback;
  return unit === 'custom' ? amount : `${amount}${unit ?? ''}`;
}

function serializeEntry(entry: FilterEntry): string {
  if (entry.type === 'drop-shadow') {
    const parts = [
      formatAmount(entry.x, entry.xUnit, '0px'),
      formatAmount(entry.y, entry.yUnit, '0px'),
    ];
    if (entry.blur) parts.push(formatAmount(entry.blur, entry.blurUnit, '0px'));
    if (entry.color) parts.push(entry.color);
    return `drop-shadow(${parts.join(' ')})`;
  }

  if (entry.type === 'url') return `url(${entry.value || '#filter'})`;
  return `${entry.type}(${formatAmount(entry.value, entry.unit, '')})`;
}

export function serializeFilterValue(value: FilterValue): string {
  if (value.filters.length === 0) return 'none';
  return value.filters.map(serializeEntry).join(' ');
}

export function getFilterStyles(value: FilterValue): { filter: string } {
  return { filter: serializeFilterValue(value) };
}

export function getFilterCode(value: FilterValue): string {
  return JSON.stringify(getFilterStyles(value), null, 2);
}

export function getTailwindFilterClass(value: FilterValue): string {
  const filterValue = serializeFilterValue(value).replaceAll(' ', '_');
  return `[filter:${filterValue}]`;
}
