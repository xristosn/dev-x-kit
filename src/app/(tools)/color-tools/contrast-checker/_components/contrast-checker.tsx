'use client';

import { ClientOnly } from '@/components/client-only';
import { ColorPopover } from '@/components/color/color-popover';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import Color from 'colorjs.io';
import { Star } from 'lucide-react';
import { useEffect, useState } from 'react';

export const ContastChecker: React.FC = () => {
  const [textColor, setTextColor] = useState('#fff');
  const [bgColor, setBgColor] = useState('#000');
  const [readability, setReadability] = useState(
    new Color('#fff').contrastWCAG21(new Color('#000'))
  );

  const rating = getReadabilityRating(readability);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setReadability(new Color(textColor).contrastWCAG21(new Color(bgColor)));
  }, [textColor, bgColor]);

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
              <p data-testid="contrast-rating" className="text-lg text-center">
                {rating.label}
              </p>

              <div className="flex gap-1">
                {Array.from({ length: 5 }).map((_, idx) => (
                  <Star key={idx} className={cn(rating.value >= idx + 1 && 'fill-foreground')} />
                ))}
              </div>
            </div>

            <h4 data-testid="contrast-ratio" className="text-5xl">
              {Number(readability.toFixed(2))}
            </h4>
          </div>
        </div>

        <div className="flex flex-col gap-4 bg-card p-4 rounded-xl shadow-sm h-full">
          <h3 className="text-lg">Preview</h3>

          <ClientOnly fallback={<Skeleton className="h-44" />}>
            <div
              className="p-4 shadow-xs min-h-30 h-full flex flex-col gap-2 rounded-xl"
              style={{ backgroundColor: bgColor }}
            >
              {['text-xs', 'text-sm', 'text-md', 'text-lg', 'text-xl'].map((fontSize) => (
                <p key={fontSize} className={fontSize} style={{ color: textColor }}>
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
