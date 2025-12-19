'use client';

import { ClientOnly } from '@/components/client-only';
import { ColorPopover } from '@/components/color/color-popover';
import { cn } from '@/lib/utils';
import { Star } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useColor } from 'react-color-palette';
import 'react-color-palette/css';
import tinycolor from 'tinycolor2';

export const ContastChecker: React.FC = () => {
  const [textColor, setTextColor] = useColor('#fff');
  const [bgColor, setBgColor] = useColor('#000');
  const [readability, setReadability] = useState(tinycolor.readability('#fff', '#000'));

  const rating = getReadabilityRating(readability);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setReadability(tinycolor.readability(textColor.hex, bgColor.hex));
  }, [textColor.hex, bgColor.hex]);

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex flex-col gap-4 bg-card p-4 rounded-xl shadow-sm h-full">
          <h3 className="text-lg">Contrast</h3>

          <div
            className={cn(
              'flex gap-4 p-4 rounded-sm justify-between items-center h-full',
              rating.color
            )}
          >
            <div className="flex flex-col gap-2">
              <p className="text-lg text-center">{rating.label}</p>

              <div className="flex gap-1">
                {Array.from({ length: 5 }).map((_, idx) => (
                  <Star
                    key={idx}
                    className={cn(rating.value >= idx + 1 && 'fill-accent-foreground')}
                  />
                ))}
              </div>
            </div>

            <h4 className="text-5xl">{Number(readability.toFixed(2))}</h4>
          </div>
        </div>

        <div className="flex flex-col gap-4 bg-card p-4 rounded-xl shadow-sm h-full">
          <h3 className="text-lg">Preview</h3>

          <ClientOnly>
            <div
              className="p-4 shadow-xs min-h-30 h-full flex flex-col gap-2 rounded-xl"
              style={{ backgroundColor: bgColor.hex }}
            >
              {['text-xs', 'text-sm', 'text-md', 'text-lg', 'text-xl'].map((fontSize) => (
                <p key={fontSize} className={fontSize} style={{ color: textColor.hex }}>
                  Lorem ipsum
                </p>
              ))}
            </div>
          </ClientOnly>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-card p-4 rounded-xl shadow-sm">
        <ColorPopover value={textColor} setValue={setTextColor} label="Text Color" />
        <ColorPopover value={bgColor} setValue={setBgColor} label="Background Color" />
      </div>
    </>
  );
};

function getReadabilityRating(ratio: number) {
  if (ratio >= 10) return { label: 'Excellent', value: 5, color: 'bg-green-700/30' };

  if (ratio >= 7) return { label: 'Very Good', value: 4, color: 'bg-green-900/30' };

  if (ratio >= 4.5) return { label: 'Good', value: 3, color: 'bg-yellow-900/30' };

  if (ratio >= 3) return { label: 'Poor', value: 2, color: 'bg-red-900/30' };

  return { label: 'Very Poor', value: 1, color: 'bg-red-700/30' };
}
