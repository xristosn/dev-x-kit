import tinyColor, { Instance as TinyColorInstance } from 'tinycolor2';
import { COLOR_COMBINATION } from './constants';

export function getShadeColors(
  color: string,
  colorFunction: keyof TinyColorInstance
): Array<[string, string]> {
  let shades: (number | TinyColorInstance)[] = [2, 4, 8, 16, 20];

  if (COLOR_COMBINATION.includes(colorFunction)) {
    shades = (
      tinyColor(color)[colorFunction] as () => TinyColorInstance[]
    )() as TinyColorInstance[];
  }

  if (colorFunction === 'spin') {
    shades = [-200, -100, 0, 100, 200];
  }

  return shades.map((shade) => {
    const shadeColor =
      typeof shade === 'number'
        ? ((tinyColor(color)[colorFunction] as (shade: number) => TinyColorInstance)(
            shade
          ) as TinyColorInstance)
        : shade;
    return [shadeColor.toHexString(), shadeColor.isLight() ? '#000' : '#fff'];
  });
}
