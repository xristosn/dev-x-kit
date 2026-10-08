export type TextGradientType = 'linear' | 'radial';
export type TextGradientDirection =
  | 'custom'
  | 'to top'
  | 'to top right'
  | 'to right'
  | 'to bottom right'
  | 'to bottom'
  | 'to bottom left'
  | 'to left'
  | 'to top left';
export type TextGradientPosition =
  | 'center'
  | 'top'
  | 'top-right'
  | 'right'
  | 'bottom-right'
  | 'bottom'
  | 'bottom-left'
  | 'left'
  | 'top-left';
export type RadialGradientShape = 'circle' | 'ellipse';
export type RadialGradientSize =
  'closest-side' | 'farthest-side' | 'closest-corner' | 'farthest-corner';

export type TextGradientStop = {
  id: string;
  color: string;
  offset: number;
};

export type TextGradientValue = {
  type: TextGradientType;
  direction: TextGradientDirection;
  angle: number;
  position: TextGradientPosition;
  shape: RadialGradientShape;
  size: RadialGradientSize;
  stops: TextGradientStop[];
};

export const LINEAR_DIRECTIONS: {
  value: Exclude<TextGradientDirection, 'custom'>;
  label: string;
  cssValue: string;
}[] = [
  { value: 'to top', label: 'Top', cssValue: 'to top' },
  { value: 'to top right', label: 'Top right', cssValue: 'to top right' },
  { value: 'to right', label: 'Right', cssValue: 'to right' },
  { value: 'to bottom right', label: 'Bottom right', cssValue: 'to bottom right' },
  { value: 'to bottom', label: 'Bottom', cssValue: 'to bottom' },
  { value: 'to bottom left', label: 'Bottom left', cssValue: 'to bottom left' },
  { value: 'to left', label: 'Left', cssValue: 'to left' },
  { value: 'to top left', label: 'Top left', cssValue: 'to top left' },
];

export const GRADIENT_POSITIONS: {
  value: TextGradientPosition;
  label: string;
  cssValue: string;
}[] = [
  { value: 'center', label: 'Center', cssValue: 'center' },
  { value: 'top', label: 'Top', cssValue: 'top' },
  { value: 'top-right', label: 'Top right', cssValue: 'top right' },
  { value: 'right', label: 'Right', cssValue: 'right' },
  { value: 'bottom-right', label: 'Bottom right', cssValue: 'bottom right' },
  { value: 'bottom', label: 'Bottom', cssValue: 'bottom' },
  { value: 'bottom-left', label: 'Bottom left', cssValue: 'bottom left' },
  { value: 'left', label: 'Left', cssValue: 'left' },
  { value: 'top-left', label: 'Top left', cssValue: 'top left' },
];

export const RADIAL_SHAPES: { value: RadialGradientShape; label: string }[] = [
  { value: 'circle', label: 'Circle' },
  { value: 'ellipse', label: 'Ellipse' },
];

export const RADIAL_SIZES: { value: RadialGradientSize; label: string }[] = [
  { value: 'closest-side', label: 'Closest side' },
  { value: 'farthest-side', label: 'Farthest side' },
  { value: 'closest-corner', label: 'Closest corner (circle)' },
  { value: 'farthest-corner', label: 'Farthest corner (circle)' },
];

export const DEFAULT_TEXT_GRADIENT_VALUE: TextGradientValue = {
  type: 'linear',
  direction: 'to right',
  angle: 90,
  position: 'center',
  shape: 'circle',
  size: 'farthest-corner',
  stops: [
    { id: 'start', color: '#7c3aed', offset: 0 },
    { id: 'end', color: '#ec4899', offset: 100 },
  ],
};

export const TEXT_GRADIENT_PRESETS: { id: string; label: string; value: TextGradientValue }[] = [
  { id: 'violet-pink', label: 'Violet pink', value: DEFAULT_TEXT_GRADIENT_VALUE },
  {
    id: 'sunset',
    label: 'Sunset',
    value: {
      ...DEFAULT_TEXT_GRADIENT_VALUE,
      direction: 'to bottom right',
      stops: [
        { id: 'sunset-start', color: '#f97316', offset: 0 },
        { id: 'sunset-middle', color: '#ec4899', offset: 52 },
        { id: 'sunset-end', color: '#8b5cf6', offset: 100 },
      ],
    },
  },
  {
    id: 'ocean',
    label: 'Ocean',
    value: {
      ...DEFAULT_TEXT_GRADIENT_VALUE,
      direction: 'to bottom',
      stops: [
        { id: 'ocean-start', color: '#06b6d4', offset: 0 },
        { id: 'ocean-end', color: '#2563eb', offset: 100 },
      ],
    },
  },
  {
    id: 'aurora',
    label: 'Aurora',
    value: {
      ...DEFAULT_TEXT_GRADIENT_VALUE,
      direction: 'to top right',
      stops: [
        { id: 'aurora-start', color: '#14b8a6', offset: 0 },
        { id: 'aurora-middle', color: '#6366f1', offset: 50 },
        { id: 'aurora-end', color: '#d946ef', offset: 100 },
      ],
    },
  },
  {
    id: 'radial-glow',
    label: 'Radial glow',
    value: {
      ...DEFAULT_TEXT_GRADIENT_VALUE,
      type: 'radial',
      position: 'top-left',
      shape: 'circle',
      size: 'farthest-corner',
      stops: [
        { id: 'glow-start', color: '#fde047', offset: 0 },
        { id: 'glow-middle', color: '#f97316', offset: 42 },
        { id: 'glow-end', color: '#7c2d12', offset: 100 },
      ],
    },
  },
  {
    id: 'golden-hour',
    label: 'Golden hour',
    value: {
      ...DEFAULT_TEXT_GRADIENT_VALUE,
      direction: 'to bottom right',
      stops: [
        { id: 'golden-start', color: '#facc15', offset: 0 },
        { id: 'golden-middle', color: '#fb923c', offset: 50 },
        { id: 'golden-end', color: '#e11d48', offset: 100 },
      ],
    },
  },
  {
    id: 'mint',
    label: 'Mint',
    value: {
      ...DEFAULT_TEXT_GRADIENT_VALUE,
      direction: 'to bottom right',
      stops: [
        { id: 'mint-start', color: '#a3e635', offset: 0 },
        { id: 'mint-middle', color: '#2dd4bf', offset: 52 },
        { id: 'mint-end', color: '#0f766e', offset: 100 },
      ],
    },
  },
  {
    id: 'berry',
    label: 'Berry',
    value: {
      ...DEFAULT_TEXT_GRADIENT_VALUE,
      direction: 'to right',
      stops: [
        { id: 'berry-start', color: '#f43f5e', offset: 0 },
        { id: 'berry-middle', color: '#d946ef', offset: 52 },
        { id: 'berry-end', color: '#7c3aed', offset: 100 },
      ],
    },
  },
  {
    id: 'sky',
    label: 'Sky',
    value: {
      ...DEFAULT_TEXT_GRADIENT_VALUE,
      direction: 'to top right',
      stops: [
        { id: 'sky-start', color: '#38bdf8', offset: 0 },
        { id: 'sky-middle', color: '#3b82f6', offset: 52 },
        { id: 'sky-end', color: '#4338ca', offset: 100 },
      ],
    },
  },
  {
    id: 'citrus',
    label: 'Citrus',
    value: {
      ...DEFAULT_TEXT_GRADIENT_VALUE,
      direction: 'to right',
      stops: [
        { id: 'citrus-start', color: '#facc15', offset: 0 },
        { id: 'citrus-middle', color: '#84cc16', offset: 52 },
        { id: 'citrus-end', color: '#16a34a', offset: 100 },
      ],
    },
  },
  {
    id: 'lavender-glow',
    label: 'Lavender glow',
    value: {
      ...DEFAULT_TEXT_GRADIENT_VALUE,
      type: 'radial',
      position: 'center',
      stops: [
        { id: 'lavender-start', color: '#e9d5ff', offset: 0 },
        { id: 'lavender-middle', color: '#a78bfa', offset: 48 },
        { id: 'lavender-end', color: '#4c1d95', offset: 100 },
      ],
    },
  },
];

const validColors = /^#(?:[\da-f]{3}|[\da-f]{6}|[\da-f]{8})$/i;
const validDirections = new Set<string>(['custom', ...LINEAR_DIRECTIONS.map(({ value }) => value)]);
const validPositions = new Set<string>(GRADIENT_POSITIONS.map(({ value }) => value));
const validSizes = new Set<string>(RADIAL_SIZES.map(({ value }) => value));

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

export function normalizeTextGradientValue(value: unknown): TextGradientValue {
  const candidate = typeof value === 'object' && value !== null ? value : {};
  const input = candidate as Partial<TextGradientValue>;
  const rawStops = Array.isArray(input.stops) ? input.stops.slice(0, 8) : [];
  const stops = rawStops.map((stop, index) => {
    const item =
      typeof stop === 'object' && stop !== null ? (stop as Partial<TextGradientStop>) : {};
    const rawOffset = Number(item.offset);

    return {
      id: typeof item.id === 'string' ? item.id : `stop-${index}`,
      color:
        typeof item.color === 'string' && validColors.test(item.color)
          ? item.color
          : DEFAULT_TEXT_GRADIENT_VALUE.stops[Math.min(index, 1)].color,
      offset: Number.isFinite(rawOffset) ? clamp(rawOffset, 0, 100) : index === 0 ? 0 : 100,
    };
  });

  return {
    type: input.type === 'radial' ? 'radial' : 'linear',
    direction:
      typeof input.direction === 'string' && validDirections.has(input.direction)
        ? (input.direction as TextGradientDirection)
        : DEFAULT_TEXT_GRADIENT_VALUE.direction,
    angle: Number.isFinite(input.angle)
      ? clamp(input.angle as number, 0, 360)
      : DEFAULT_TEXT_GRADIENT_VALUE.angle,
    position:
      typeof input.position === 'string' && validPositions.has(input.position)
        ? (input.position as TextGradientPosition)
        : DEFAULT_TEXT_GRADIENT_VALUE.position,
    shape: input.shape === 'ellipse' ? 'ellipse' : 'circle',
    size:
      typeof input.size === 'string' && validSizes.has(input.size)
        ? (input.size as RadialGradientSize)
        : DEFAULT_TEXT_GRADIENT_VALUE.size,
    stops: stops.length >= 2 ? stops : DEFAULT_TEXT_GRADIENT_VALUE.stops,
  };
}

export function buildTextGradient(value: TextGradientValue): string {
  const stops = value.stops
    .map((stop, index) => ({
      color: validColors.test(stop.color)
        ? stop.color
        : DEFAULT_TEXT_GRADIENT_VALUE.stops[index % 2].color,
      offset: Number.isFinite(stop.offset) ? clamp(stop.offset, 0, 100) : 0,
      index,
    }))
    .sort((a, b) => a.offset - b.offset || a.index - b.index)
    .map(({ color, offset }) => `${color} ${offset}%`)
    .join(', ');

  if (value.type === 'radial') {
    const shape =
      value.shape === 'ellipse' && value.size.endsWith('corner') ? 'circle' : value.shape;
    const position = GRADIENT_POSITIONS.find(
      ({ value: positionValue }) => positionValue === value.position
    );
    return `radial-gradient(${shape} ${value.size} at ${position?.cssValue ?? 'center'}, ${stops})`;
  }

  const direction =
    value.direction === 'custom'
      ? `${((value.angle % 360) + 360) % 360}deg`
      : (LINEAR_DIRECTIONS.find(({ value: directionValue }) => directionValue === value.direction)
          ?.cssValue ?? 'to right');

  return `linear-gradient(${direction}, ${stops})`;
}

export function getTextGradientStyles(value: TextGradientValue): React.CSSProperties {
  return {
    backgroundImage: buildTextGradient(value),
    backgroundClip: 'text',
    WebkitBackgroundClip: 'text',
    color: 'transparent',
    WebkitTextFillColor: 'transparent',
  };
}
