import { IColor } from 'react-color-palette';

export const DIRECTIONS = [
  'Up Left',
  'Up',
  'Up Right',
  'Left',
  'Right',
  'Down Left',
  'Down',
  'Down Right',
] as const;

export type Direction = (typeof DIRECTIONS)[keyof typeof DIRECTIONS];

export const COLOR_MODES = ['hex', 'rgb', 'hsv'] as const;

export function getTriangleStyle(
  direction: Direction,
  width: number,
  height: number,
  color: IColor
) {
  const w = `${width}px`;
  const h = `${height}px`;
  const w2 = `${width / 2}px`;
  const h2 = `${height / 2}px`;
  const T = 'transparent';
  const C = color.hex;

  const styles = {
    'Up Left': {
      borderWidth: `${h} ${w} 0 0`,
      borderColor: `${C} ${T} ${T} ${T}`,
    },
    'Up Right': {
      borderWidth: `0 ${w} ${h} 0`,
      borderColor: `${T} ${C} ${T} ${T}`,
    },
    Left: {
      borderWidth: `${h2} ${w} ${h2} 0`,
      borderColor: `${T} ${C} ${T} ${T}`,
    },
    Right: {
      borderWidth: `${h2} 0 ${h2} ${w}`,
      borderColor: `${T} ${T} ${T} ${C}`,
    },
    'Down Left': {
      borderWidth: `${h} 0 0 ${w}`,
      borderColor: `${T} ${T} ${T} ${C}`,
    },
    Down: {
      borderWidth: `${h} ${w2} 0 ${w2}`,
      borderColor: `${C} ${T} ${T} ${T}`,
    },
    'Down Right': {
      borderWidth: `0 0 ${h} ${w}`,
      borderColor: `${T} ${T} ${C} ${T}`,
    },
    Up: {
      borderWidth: `0 ${w2} ${h} ${w2}`,
      borderColor: `${T} ${T} ${C} ${T}`,
    },
  };

  return {
    width: '0',
    height: '0',
    borderStyle: 'solid',
    ...(styles[direction as keyof typeof styles] || styles['Up']),
  };
}

export function getTriangleCss(...args: Parameters<typeof getTriangleStyle>) {
  const styles = getTriangleStyle(...args);

  return (
    Object.entries(styles)
      .reduce((prev, [key, val]) => [...prev, `${key}: ${val}`], [] as string[])
      .join(';\n') + ';'
  );
}
