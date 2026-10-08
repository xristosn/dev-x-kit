import Color from 'colorjs.io';
import { COLOR_COMBINATION, type ColorOperation } from './constants';

const SHADE_STEPS = [2, 4, 8, 16, 20];
const HSL_OPERATIONS = new Set<ColorOperation>([
  'lighten',
  'darken',
  'desaturate',
  'saturate',
  'spin',
]);

function toHex(color: Color): string {
  const opaque = color.clone();
  opaque.alpha = 1;
  return opaque.to('srgb').toString({ format: 'hex', collapse: false, inGamut: true });
}

function isLight(color: Color): boolean {
  const [r, g, b] = color.to('srgb').coords.map((channel) => (channel ?? 0) * 255);
  return (r * 299 + g * 587 + b * 114) / 1000 > 128;
}

function withHsl(color: Color, operation: ColorOperation, amount: number): Color {
  const hsl = color.to('hsl');
  const [hue, saturation, lightness] = hsl.coords;

  switch (operation) {
    case 'lighten':
      hsl.coords[2] = Math.min(100, (lightness ?? 0) + amount);
      break;
    case 'darken':
      hsl.coords[2] = Math.max(0, (lightness ?? 0) - amount);
      break;
    case 'desaturate':
      hsl.coords[1] = Math.max(0, (saturation ?? 0) - amount);
      break;
    case 'saturate':
      hsl.coords[1] = Math.min(100, (saturation ?? 0) + amount);
      break;
    case 'spin':
      hsl.coords[0] = ((hue ?? 0) + amount + 360) % 360;
      break;
    default:
      break;
  }

  return hsl;
}

function withHue(color: Color, hueOffset: number): Color {
  const hsl = color.to('hsl');
  hsl.coords[0] = ((((hsl.coords[0] ?? 0) + hueOffset) % 360) + 360) % 360;
  return hsl;
}

function getCombinationColors(color: Color, operation: ColorOperation): Color[] {
  switch (operation) {
    case 'analogous':
      return [0, -24, -12, 0, 12, 24].map((offset) => withHue(color, offset));
    case 'monochromatic': {
      const hsv = color.to('hsv');
      const hue = hsv.coords[0] ?? 0;
      const saturation = hsv.coords[1] ?? 0;
      const value = hsv.coords[2] ?? 0;
      return [0, 1, 2, 3, 4, 5].map(
        (step) => new Color('hsv', [hue, saturation, (value + (step * 100) / 6) % 100], color.alpha)
      );
    }
    case 'splitcomplement':
      return [0, 72, 216].map((offset) => withHue(color, offset));
    case 'triad':
      return [0, 120, 240].map((offset) => withHue(color, offset));
    case 'tetrad':
      return [0, 90, 180, 270].map((offset) => withHue(color, offset));
    case 'complement':
      return [0, 180].map((offset) => withHue(color, offset));
    default:
      return [color];
  }
}

function applyOperation(color: Color, operation: ColorOperation, amount: number): Color {
  if (HSL_OPERATIONS.has(operation)) return withHsl(color, operation, amount);

  if (operation === 'brighten') {
    const rgb = color.to('srgb');
    const offset = Math.round((255 * amount) / 100) / 255;
    rgb.coords = rgb.coords.map((channel) => Math.min(1, (channel ?? 0) + offset)) as [
      number,
      number,
      number,
    ];
    return rgb;
  }

  return color;
}

export function getShadeColors(
  color: string,
  colorFunction: ColorOperation
): Array<[string, string]> {
  const baseColor = new Color(color);
  let shades: Color[];

  if (COLOR_COMBINATION.includes(colorFunction)) {
    shades = getCombinationColors(baseColor, colorFunction);
  } else if (colorFunction === 'spin') {
    shades = [-200, -100, 0, 100, 200].map((amount) =>
      applyOperation(baseColor, colorFunction, amount)
    );
  } else {
    shades = SHADE_STEPS.map((amount) => applyOperation(baseColor, colorFunction, amount));
  }

  return shades.map((shade) => {
    const shadeColor = toHex(shade);
    return [shadeColor, isLight(shade) ? '#000' : '#fff'];
  });
}
