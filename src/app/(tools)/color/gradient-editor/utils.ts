import { GradientStop, GradientValue } from '@/types/gradient';

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

export function getGradientCss(value: GradientValue): string {
  return [
    `background: ${value.colorStops[0].color}`,
    `background-image: ${getGradientColor(value)}`,
  ].join(';\n');
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
