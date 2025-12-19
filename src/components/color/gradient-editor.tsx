'use client';

import { CircularSlider } from '@/components/circular-slider';
import { ClientOnly } from '@/components/client-only';
import { HexInput } from '@/components/color/hex-input';
import { HSVInput } from '@/components/color/hsv-input';
import { RGBInput } from '@/components/color/rgb-input';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { GradientStop, GradientValue } from '@/types/gradient';
import { Copy, CopyCheck, Delete } from 'lucide-react';
import { useState } from 'react';
import { ColorService, ColorPicker } from 'react-color-palette';
import 'react-color-palette/css';
import { v4 as uuid } from 'uuid';
import { GradientPreview } from './gradient-preview';
import { GradientSlider } from './gradient-slider';
import { CssGradientImageFormat, cssGradientToImage, getGradientCss, sortStops } from './utils';
import { CopyButton } from '@/components/copy-button';
import { Label } from '@radix-ui/react-label';
import { GRADIENT_PRESETS } from '@/lib/constants';

export interface GradientEditorProps {
  value: GradientValue;
  setValue: React.Dispatch<React.SetStateAction<GradientValue>>;
  output?: boolean;
}

export const GradientEditor: React.FC<GradientEditorProps> = ({
  value,
  setValue,
  output = true,
}) => {
  const [currentStopId, setCurrentStopId] = useState(value.colorStops[0].id);
  const [width, setWidth] = useState(300);
  const [height, setHeight] = useState(150);

  const currentStop = value.colorStops.find((s) => s.id === currentStopId) || value.colorStops[0];
  const css = getGradientCss(value);

  const onStopChange = <StopProp extends keyof GradientStop>(
    prop: StopProp,
    value: GradientStop[StopProp]
  ) => {
    setValue((p) => ({
      ...p,
      colorStops: p.colorStops
        .map((s) => (s.id === currentStopId ? { ...s, [prop]: value } : s))
        .sort(sortStops),
    }));
  };

  const removeStop = (stopKey: string) => {
    if (stopKey === currentStopId) {
      const idx = value.colorStops.findIndex((s) => s.id === stopKey);

      if (value.colorStops[idx - 1]) setCurrentStopId(value.colorStops[idx - 1].id);
      else setCurrentStopId(value.colorStops[idx + 1].id);
    }

    setValue((v) => ({
      ...v,
      colorStops: v.colorStops.filter((item) => stopKey !== item.id).sort(sortStops),
    }));
  };

  const addStop = () => {
    setValue((v) => ({
      ...v,
      colorStops: [...v.colorStops, { id: uuid(), color: '#ffffff', offset: 50 }].sort(sortStops),
    }));
  };

  const onDownloadImage = (type: CssGradientImageFormat) => {
    const dataUri = cssGradientToImage(value, width, height, type);

    const link = document.createElement('a');
    link.href = dataUri;
    link.download = `gradient_${width}x${height}`;
    link.style.display = 'none';

    document.body.appendChild(link);

    link.click();

    link.remove();
  };

  return (
    <>
      <GradientPreview value={value} className="min-h-20 md:min-h-40 lg:min-h-60 h-1/3 shadow-sm" />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 bg-card shadow-sm rounded-xl p-4">
        <div className="flex flex-col gap-2">
          <h4 className="text-lg">Slider:</h4>

          <ClientOnly>
            <GradientSlider value={value} setValue={setValue} setCurrentStopId={setCurrentStopId} />
          </ClientOnly>
        </div>

        <div className="flex flex-col gap-2">
          <h4 className="text-lg">Presets:</h4>

          <div className="flex flex-wrap gap-4">
            {GRADIENT_PRESETS.map((preset, idx) => (
              <GradientPreview
                key={idx}
                value={preset}
                className="size-8 rounded-md cursor-pointer"
                tabIndex={0}
                onClick={() => {
                  setValue(preset);
                  setCurrentStopId(preset.colorStops[0].id);
                }}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 bg-card shadow-sm rounded-xl p-4">
        <div className="flex flex-col gap-4">
          <h4 className="text-lg">Setup:</h4>

          <div className="flex items-center justify-center">
            <ClientOnly>
              <Button
                variant={value.type ? 'outline' : 'default'}
                className="rounded-r-none border"
                onClick={() => setValue((v) => ({ ...v, type: 'linear' }))}
              >
                Linear
              </Button>

              <Button
                variant={value.type ? 'default' : 'outline'}
                className="rounded-l-none"
                onClick={() => setValue((v) => ({ ...v, type: 'radial' }))}
              >
                Radial
              </Button>
            </ClientOnly>
          </div>

          <div className="flex items-center justify-center">
            <ClientOnly>
              <CircularSlider
                value={value.rotation}
                onChange={(v) => setValue((p) => ({ ...p, rotation: v }))}
                min={0}
                max={360}
                size={120}
                disabled={value.type === 'radial'}
              />
            </ClientOnly>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <h4 className="text-lg">Stops:</h4>

          <ClientOnly>
            <div className="flex flex-col gap-4 max-h-44 overflow-auto -m-2 p-2">
              {value.colorStops.map((stop) => (
                <div
                  key={stop.id}
                  className="flex gap-2"
                  onClick={() => setCurrentStopId(stop.id)}
                  onFocus={() => setCurrentStopId(stop.id)}
                  onChange={() => setCurrentStopId(stop.id)}
                >
                  <div
                    className={cn(
                      'size-8 min-w-8 rounded-sm border-2 border-background outline-2',
                      stop.id === currentStopId ? 'outline-foreground' : 'cursor-pointer'
                    )}
                    style={{ backgroundColor: stop.color }}
                  />

                  <HexInput
                    noLabel
                    value={ColorService.convert('hex', stop.color)}
                    setValue={(c) => onStopChange('color', c.hex)}
                  />

                  <Input
                    type={stop.id === currentStopId ? 'number' : 'text'}
                    min={0}
                    max={100}
                    step={1}
                    value={stop.offset}
                    onChange={(e) => onStopChange('offset', Math.min(100, Number(e.target.value)))}
                  />

                  <Button
                    size="icon"
                    variant="outline"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeStop(stop.id);
                    }}
                    disabled={value.colorStops.length === 1}
                  >
                    <Delete />
                  </Button>
                </div>
              ))}
            </div>

            <Button variant="outline" size="sm" onClick={addStop}>
              Add stop
            </Button>
          </ClientOnly>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 bg-card shadow-sm rounded-xl p-4">
        <ClientOnly>
          <ColorPicker
            color={ColorService.convert('hex', currentStop.color)}
            onChange={(c) => onStopChange('color', c.hex)}
            hideInput
          />
        </ClientOnly>

        <div className="flex flex-col gap-8">
          <HexInput
            value={ColorService.convert('hex', currentStop.color)}
            setValue={(c) => onStopChange('color', c.hex)}
          />

          <RGBInput
            value={ColorService.convert('hex', currentStop.color)}
            setValue={(c) => onStopChange('color', c.hex)}
          />

          <HSVInput
            value={ColorService.convert('hex', currentStop.color)}
            setValue={(c) => onStopChange('color', c.hex)}
          />
        </div>
      </div>

      {output && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 bg-card shadow-sm rounded-xl p-4">
          <div className="flex flex-col gap-2">
            <h4 className="text-lg">CSS:</h4>

            <ClientOnly>
              <code className="p-2 pr-8 whitespace-pre-wrap relative bg-muted rounded-md h-full">
                {css}

                <CopyButton
                  value={css}
                  variant="outline"
                  size="icon-sm"
                  className="absolute top-2 right-2"
                  copiedProps={{ children: <CopyCheck /> }}
                >
                  <Copy />
                </CopyButton>
              </code>
            </ClientOnly>
          </div>

          <div className="flex flex-col gap-2">
            <h4 className="text-lg">Extract:</h4>

            <div className="flex gap-4">
              <div className="grid w-full items-center gap-2">
                <Label htmlFor="gradient-width">Width (px)</Label>
                <Input
                  id="gradient-width"
                  type="number"
                  min={1}
                  max={4000}
                  value={width.toString()}
                  onChange={(e) => setWidth(Number(e.target.value))}
                />
              </div>

              <div className="grid w-full items-center gap-2">
                <Label htmlFor="gradient-height">Height (px)</Label>
                <Input
                  id="gradient-height"
                  type="number"
                  min={1}
                  max={4000}
                  value={height.toString()}
                  onChange={(e) => setHeight(Number(e.target.value))}
                />
              </div>
            </div>

            <div className="flex gap-2 w-full items-stretch justify-stretch">
              <Button variant="outline" className="flex-1" onClick={() => onDownloadImage('png')}>
                to .png
              </Button>
              <Button variant="outline" className="flex-1" onClick={() => onDownloadImage('jpeg')}>
                to .jpeg
              </Button>
              <Button variant="outline" className="flex-1" onClick={() => onDownloadImage('webp')}>
                to .webp
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
