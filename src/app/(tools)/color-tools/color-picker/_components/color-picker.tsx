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
import { SHADES } from '../_lib/constants';
import { getShadeColors } from '../_lib/utils';

export const ColorPicker: React.FC = () => {
  const [color, setColor] = useWebStorage(
    'color-picker',
    'infer',
    ColorService.convert('hex', '#2d2bb6')
  );

  return (
    <>
      <div className="flex gap-4 flex-col md:flex-row bg-card shadow-md rounded-xl w-full">
        <div className="flex flex-col gap-4 bg-card p-4 shadow-md rounded-xl md:w-1/2">
          <h2 className="text-xl" data-testid="color-picker-section-title">
            Color Picker
          </h2>

          <ClientOnly fallback={<Skeleton className="w-full h-68" />}>
            <ReactColorPicker color={color} onChange={setColor} hideInput />
          </ClientOnly>
        </div>

        <div className="flex flex-col gap-6 bg-card p-4 shadow-md rounded-xl md:w-1/2">
          <h2 className="text-xl">Colors</h2>

          <HexInput value={color} setValue={setColor} />
          <RGBInput value={color} setValue={setColor} />
          <HSVInput value={color} setValue={setColor} />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 2xl:grid-cols-3 gap-4">
        {SHADES.map((shade) => (
          <div
            key={shade.colorInstance}
            className="flex flex-col gap-4 bg-card p-4 shadow-sm rounded-xl"
          >
            <h2 className="text-xl">{shade.label}</h2>

            <ClientOnly
              fallback={Array.from({ length: 5 }).map((_, idx) => (
                <Skeleton key={idx} className="w-full h-2" />
              ))}
            >
              {getShadeColors(color.hex, shade.colorInstance).map(([bg, fg], idx) => (
                <CopyButton
                  key={idx}
                  size="sm"
                  style={{ backgroundColor: bg, color: fg }}
                  className="rounded-lg hover:opacity-70 overflow-hidden group"
                  value={bg}
                  data-testid="color-picker-shade-copy-button"
                  copiedProps={{ children: 'Copied!' }}
                >
                  {bg}
                </CopyButton>
              ))}
            </ClientOnly>
          </div>
        ))}
      </div>
    </>
  );
};
