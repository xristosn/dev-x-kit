import Color from 'colorjs.io';
import { GradientStop, GradientValue } from '@/types/gradient';

export type ColorValue = string;
export type IColorHsv = { h: number; s: number; v: number; a: number };
export type IColorRgb = { r: number; g: number; b: number; a: number };
export type ColorMode = 'rgb' | 'hex' | 'hsv' | 'oklch' | 'oklab';

export function parseColor(value: string): Color | null {
  return typeof value === 'string' && value.trim() ? Color.try(value.trim()) : null;
}

export function isValidColor(value: string): boolean {
  return parseColor(value) !== null;
}

export function colorToCss(value: string, space?: 'oklch' | 'oklab'): string {
  const color = parseColor(value);
  if (!color) return value;
  if (!space) return value.trim();

  return color.to(space).toString({ format: space, inGamut: false });
}

export function getColorChannels(value: string, space: 'srgb' | 'hsv' | 'oklch' | 'oklab') {
  const color = parseColor(value);
  if (!color) return null;

  const converted = color.to(space);
  return { coords: converted.coords, alpha: converted.alpha };
}

export function colorFromChannels(
  space: 'srgb' | 'hsv' | 'oklch' | 'oklab',
  coords: [number, number, number],
  alpha: number
): string {
  const color = new Color(space, coords, alpha);
  return space === 'hsv'
    ? color.to('srgb').toString({ format: 'rgb', inGamut: true })
    : color.toString({ format: space, inGamut: false });
}

export function stringToHexColor(colorString: string): string | null {
  if (typeof colorString !== 'string' || !colorString.trim()) return null;

  const hex = colorString.trim().replace(/^#/, '').toUpperCase();
  return /^(?:[0-9A-F]{3}|[0-9A-F]{6}|[0-9A-F]{8})$/.test(hex) ? `#${hex}` : null;
}

export function stringToHsvColor(hsvString: string): IColorHsv | null {
  if (typeof hsvString !== 'string') return null;

  const match = hsvString
    .trim()
    .match(
      /^(?:hsv|hsva)\(\s*([\d.]+)\s*,\s*([\d.]+%?)\s*,\s*([\d.]+%?)(?:\s*,\s*([\d.]+))?\s*\)$/i
    );
  if (!match) return null;

  const values = match.slice(1).map((part) => Number(part?.replace('%', '') ?? 1));
  const [h, s, v, a = 1] = values;
  if (![h, s, v, a].every(Number.isFinite)) return null;

  return {
    h: Math.min(360, Math.max(0, h)),
    s: Math.min(100, Math.max(0, s)),
    v: Math.min(100, Math.max(0, v)),
    a: Math.min(1, Math.max(0, a)),
  };
}

export function colorToHsvString(color: IColorHsv): string {
  return `hsv(${[color.h, color.s, color.v, color.a]
    .map((value) => Number((value ?? 0).toFixed(2)))
    .join(', ')})`;
}

export function colorToRgbString(color: IColorRgb): string {
  const channels = [color.r, color.g, color.b].map((value) => Number(value.toFixed(2)));
  return color.a === 1
    ? `rgb(${channels.join(', ')})`
    : `rgba(${[...channels, Number(color.a.toFixed(2))].join(', ')})`;
}

export function stringToRgbColor(colorString: string): IColorRgb | null {
  if (typeof colorString !== 'string') return null;
  const match = colorString
    .trim()
    .match(/^(rgb|rgba)\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)\s*(?:,\s*([\d.]+)\s*)?\)$/i);
  if (!match) return null;

  const r = Number(match[2]);
  const g = Number(match[3]);
  const b = Number(match[4]);
  const a = match[5] === undefined ? 1 : Number(match[5]);
  if (![r, g, b, a].every(Number.isFinite)) return null;
  if ([r, g, b].some((channel) => channel < 0 || channel > 255) || a < 0 || a > 1) return null;

  return { r, g, b, a };
}

export function colorToString(color: ColorValue, colorMode: ColorMode): string {
  const parsed = parseColor(color);
  if (!parsed) return color;

  if (colorMode === 'hex') {
    return parsed.to('srgb').toString({ format: 'hex', inGamut: true, collapse: false });
  }
  if (colorMode === 'rgb') {
    const { coords, alpha } = parsed.to('srgb');
    return colorToRgbString({
      r: coords[0]! * 255,
      g: coords[1]! * 255,
      b: coords[2]! * 255,
      a: alpha,
    });
  }
  if (colorMode === 'hsv') {
    const { coords, alpha } = parsed.to('hsv');
    return colorToHsvString({ h: coords[0]!, s: coords[1]!, v: coords[2]!, a: alpha });
  }

  return parsed.to(colorMode).toString({ format: colorMode, inGamut: false });
}

export function sortStops(a: GradientStop, b: GradientStop): number {
  if (a.offset < b.offset) return -1;
  if (a.offset > b.offset) return 1;
  return 0;
}

type GradientStopDragPosition = {
  clientX: number;
  left: number;
  width: number;
  min: number;
  max: number;
  step: number;
};

export function moveGradientStop(
  colorStops: readonly GradientStop[],
  draggingIndex: number,
  { clientX, left, width, min, max, step }: GradientStopDragPosition
): GradientStop[] {
  const percent = Math.max(0, Math.min(100, ((clientX - left) / width) * 100));
  const rawValue = (percent / 100) * (max - min) + min;
  const newValue = Math.round(rawValue / step) * step;
  const clampedValue = Math.max(min, Math.min(max, newValue));

  return colorStops
    .map((stop, index) => ({
      ...stop,
      offset: index === draggingIndex ? clampedValue : stop.offset,
    }))
    .sort(sortStops);
}

export function getGradientColor(value: GradientValue): string {
  if (value.colorStops.length === 1) return value.colorStops[0].color;

  const type = value.type === 'radial' ? 'radial-gradient' : 'linear-gradient';
  const angl = value.type === 'radial' ? 'circle' : `${value.rotation}deg`;
  const css = value.colorStops.map((stop) => `${stop.color} ${stop.offset}%`).join(', ');

  return `${type}(${angl}, ${css})`;
}

export type CssGradientImageFormat = 'png' | 'jpeg' | 'webp';

export function cssGradientToImage(
  value: GradientValue,
  width: number,
  height: number,
  format: CssGradientImageFormat
): string {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    throw new Error('Could not get 2D rendering context from canvas.');
  }

  let canvasGradient: CanvasGradient;

  if (value.type !== 'radial') {
    const angle = value.rotation;

    const radian = ((angle - 90) * Math.PI) / 180;

    const d = Math.abs(width * Math.sin(radian)) + Math.abs(height * Math.cos(radian));
    const cx = width / 2;
    const cy = height / 2;

    const x0 = cx - (Math.cos(radian) * d) / 2;
    const y0 = cy - (Math.sin(radian) * d) / 2;
    const x1 = cx + (Math.cos(radian) * d) / 2;
    const y1 = cy + (Math.sin(radian) * d) / 2;

    canvasGradient = ctx.createLinearGradient(x0, y0, x1, y1);
  } else {
    const x_center = width / 2;
    const y_center = height / 2;
    const actual_radius = Math.min(width, height) / 2;

    canvasGradient = ctx.createRadialGradient(
      x_center,
      y_center,
      0,
      x_center,
      y_center,
      actual_radius
    );
  }

  value.colorStops.forEach((stop) => {
    const cssColor = stop.color;
    const offset = stop.offset / 100;

    canvasGradient.addColorStop(Math.max(0, Math.min(1, offset)), cssColor);
  });

  ctx.fillStyle = canvasGradient;
  ctx.fillRect(0, 0, width, height);

  return canvas.toDataURL(`image/${format}`);
}
