'use client';

import { ClientOnly } from '@/components/client-only';
import { HexInput } from '@/components/color/hex-input';
import { HSVInput } from '@/components/color/hsv-input';
import { RGBInput } from '@/components/color/rgb-input';
import { CopyButton } from '@/components/copy-button';
import { Skeleton } from '@/components/ui/skeleton';
import { useWebStorage } from '@/hooks/use-web-storage';
import { ColorService, ColorPicker as ReactColorPicker } from 'react-color-palette';
import 'react-color-palette/css';
import tinyColor, { Instance as TinyColorInstance } from 'tinycolor2';

const COLOR_COMBINATION: (keyof TinyColorInstance)[] = [
  'analogous',
  'monochromatic',
  'splitcomplement',
  'triad',
  'tetrad',
  'complement',
];

const SHADES: Array<{ label: string; colorInstance: keyof TinyColorInstance }> = [
  {
    label: 'Lighter',
    colorInstance: 'lighten',
  },
  {
    label: 'Darker',
    colorInstance: 'darken',
  },
  {
    label: 'Brighter',
    colorInstance: 'brighten',
  },
  {
    label: 'Desaturated',
    colorInstance: 'desaturate',
  },
  {
    label: 'Saturated',
    colorInstance: 'saturate',
  },
  {
    label: 'Spinned',
    colorInstance: 'spin',
  },
  {
    label: 'Analogous',
    colorInstance: 'analogous',
  },
  {
    label: 'Monochromatic',
    colorInstance: 'monochromatic',
  },
  {
    label: 'Triad',
    colorInstance: 'triad',
  },
  {
    label: 'Tetrad',
    colorInstance: 'tetrad',
  },
];

export const ColorPicker: React.FC = () => {
  const [color, setColor] = useWebStorage(
    'color-picker',
    'infer',
    ColorService.convert('hex', '#2d2bb6')
  );

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 2xl:grid-cols-3 gap-4">
      <div className="flex flex-col gap-4 bg-card p-4 shadow-sm rounded-xl">
        <h1 className="text-xl">Color Picker</h1>

        <ClientOnly fallback={<Skeleton className="w-full h-68" />}>
          <ReactColorPicker color={color} onChange={setColor} hideInput />
        </ClientOnly>
      </div>

      <div className="flex flex-col gap-6 bg-card p-4 shadow-sm rounded-xl">
        <h2 className="text-xl">Colors</h2>

        <HexInput value={color} setValue={setColor} />
        <RGBInput value={color} setValue={setColor} />
        <HSVInput value={color} setValue={setColor} />
      </div>

      {SHADES.map((shade) => (
        <div
          key={shade.colorInstance}
          className="flex flex-col gap-4 bg-card p-4 shadow-sm rounded-xl"
        >
          <h2 className="text-xl">{shade.label}</h2>

          <ClientOnly
            fallback={Array.from({ length: 5 }).map((_, idx) => (
              <Skeleton key={idx} className="w-full h-8" />
            ))}
          >
            {getShadeColors(color.hex, shade.colorInstance).map(([bg, fg], idx) => (
              <CopyButton
                key={idx}
                size="sm"
                style={{ backgroundColor: bg, color: fg }}
                className="rounded-lg hover:opacity-70 overflow-hidden group"
                value={bg}
                copiedProps={{ children: 'Copied!' }}
              >
                {bg}
              </CopyButton>
            ))}
          </ClientOnly>
        </div>
      ))}
    </div>
  );
};

function getShadeColors(
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
