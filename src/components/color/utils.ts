import { GradientStop, GradientValue } from '@/types/gradient';
import { IColor } from 'react-color-palette';

export type IColorHsv = IColor['hsv'];
export type IColorRgb = IColor['rgb'];
export type ColorMode = 'rgb' | 'hex' | 'hsv';

export function stringToHexColor(colorString: string): string | null {
  if (typeof colorString !== 'string' || !colorString.trim()) {
    return null;
  }

  let hex = colorString.trim().toUpperCase();

  if (hex.startsWith('#')) {
    hex = hex.slice(1);
  }
  const hexRegex = /^([0-9A-F]{3}|[0-9A-F]{6}|[0-9A-F]{8})$/;

  if (hexRegex.test(hex)) {
    return `#${hex}`;
  } else {
    return null;
  }
}

export function stringToHsvColor(hsvString: string): IColorHsv | null {
  try {
    if (!hsvString || typeof hsvString !== 'string') {
      throw new TypeError('Not a valid input');
    }

    const lowerCaseString = hsvString.toLowerCase().trim();

    const regex =
      /^(hsv|hsva)\(\s*([\d.]+)\s*,\s*([\d.]+%?)\s*,\s*([\d.]+%?)(?:\s*,\s*([\d.]+))?\s*\)$/i;

    const match = lowerCaseString.match(regex);

    if (!match) {
      throw new Error('No match found');
    }

    const [, funcName, hStr, sStr, vStr, aStr] = match;

    const h = parseFloat(hStr);
    const s = parseFloat(sStr.replace('%', ''));
    const v = parseFloat(vStr.replace('%', ''));

    let a = 1;
    if (funcName === 'hsva' && aStr !== undefined) {
      a = parseFloat(aStr);
    }

    if (isNaN(h) || isNaN(s) || isNaN(v) || isNaN(a)) {
      throw new Error('Could not parse values');
    }

    const colorHsv: IColor['hsv'] = {
      h: Math.min(360, Math.max(0, h)),

      s: Math.min(100, Math.max(0, s)),

      v: Math.min(100, Math.max(0, v)),

      a: Math.min(1, Math.max(0, a)),
    };

    return colorHsv;
  } catch {
    return null;
  }
}

export function colorToHsvString(color: IColorHsv): string {
  return `hsv(${[color.h.toFixed(2), color.s.toFixed(2), color.v.toFixed(2), color.a.toFixed(2)].map(Number).join(', ')})`;
}

export function colorToRgbString(color: IColorRgb): string {
  if (color.a !== 1)
    return `rgba(${[color.r.toFixed(2), color.g.toFixed(2), color.b.toFixed(2), color.a.toFixed(2)].map(Number).join(', ')})`;

  return `rgb(${[color.r.toFixed(2), color.g.toFixed(2), color.b.toFixed(2)].map(Number).join(', ')})`;
}

export function stringToRgbColor(colorString: string): IColor['rgb'] | null {
  try {
    if (!colorString || typeof colorString !== 'string') {
      throw new TypeError('Not a valid input');
    }

    const regex =
      /^(rgb|rgba)\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)\s*(?:,\s*([\d.]+)\s*)?\)$/i;

    const match = colorString.trim().toLowerCase().match(regex);

    if (!match) {
      throw new Error('No match found');
    }

    const r = parseFloat(match[2]);
    const g = parseFloat(match[3]);
    const b = parseFloat(match[4]);

    const a = match[5] ? parseFloat(match[5]) : 1.0;

    if (r > 255 || g > 255 || b > 255 || r < 0 || g < 0 || b < 0) {
      throw new Error('Invalid color values');
    }

    if (a > 1.0 || a < 0.0) {
      throw new Error('Invalid alpha value');
    }

    return { r, g, b, a };
  } catch {
    return null;
  }
}

export function colorToString(color: IColor, colorMode: ColorMode): string {
  if (colorMode === 'rgb') return colorToRgbString(color.rgb);

  if (colorMode === 'hsv') return colorToHsvString(color.hsv);

  return color.hex;
}

export function sortStops(a: GradientStop, b: GradientStop): number {
  if (a.offset < b.offset) return -1;
  if (a.offset > b.offset) return 1;
  return 0;
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

  if (!value.type) {
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
