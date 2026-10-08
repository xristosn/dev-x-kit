'use client';

import { CircularSlider } from '@/components/circular-slider';
import { ClientOnly } from '@/components/client-only';
import { HexInput } from '@/components/color/hex-input';
import { HSVInput } from '@/components/color/hsv-input';
import { OkColorInput } from '@/components/color/ok-color-input';
import { RGBInput } from '@/components/color/rgb-input';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { GRADIENT_PRESETS } from '@/lib/constants';
import { cn } from '@/lib/utils';
import { GradientStop, GradientValue } from '@/types/gradient';
import { Delete } from 'lucide-react';
import { useState } from 'react';
import { ColorPicker, ColorService } from 'react-color-palette';
import 'react-color-palette/css';
import { v4 as uuid } from 'uuid';
import { CodeDisplay, CodeDisplayPreset } from '../code-display';
import { Label } from '../ui/label';
import { GradientPreview } from './gradient-preview';
import { GradientSlider } from './gradient-slider';
import { CssGradientImageFormat, cssGradientToImage, getGradientColor, sortStops } from './utils';

export type GradientEditorProps = {
  value: GradientValue;
  setValue: React.Dispatch<React.SetStateAction<GradientValue>>;
  output?: boolean;
};

export const GradientEditor: React.FC<GradientEditorProps> = ({
  value,
  setValue,
  output = true,
}) => {
  const [currentStopId, setCurrentStopId] = useState(value.colorStops[0].id);
  const [width, setWidth] = useState(300);
  const [height, setHeight] = useState(150);

  const currentStop = value.colorStops.find((s) => s.id === currentStopId) || value.colorStops[0];

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
      <div data-testid="gradient-editor-preview">
        <GradientPreview
          value={value}
          className="min-h-20 md:min-h-40 lg:min-h-60 h-1/3 shadow-sm"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 bg-card shadow-sm rounded-xl p-4">
        <div className="flex flex-col gap-2">
          <h4 className="text-lg">Slider:</h4>

          <div data-testid="gradient-editor-slider">
            <ClientOnly>
              <GradientSlider
                value={value}
                setValue={setValue}
                setCurrentStopId={setCurrentStopId}
              />
            </ClientOnly>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <h4 className="text-lg">Presets:</h4>

          <div data-testid="gradient-editor-presets" className="flex flex-wrap gap-4">
            {GRADIENT_PRESETS.map((preset, idx) => (
              <GradientPreview
                key={idx}
                data-testid={`gradient-editor-preset-${idx}`}
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
                data-testid="gradient-editor-type-linear"
                variant={value.type ? 'outline' : 'default'}
                className="rounded-r-none border"
                onClick={() => setValue((v) => ({ ...v, type: 'linear' }))}
              >
                Linear
              </Button>

              <Button
                data-testid="gradient-editor-type-radial"
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
            <div
              data-testid="gradient-editor-stops"
              className="flex flex-col gap-4 max-h-44 overflow-auto -m-2 p-2"
            >
              {value.colorStops.map((stop) => (
                <div
                  data-testid={`gradient-editor-stop-${stop.id}`}
                  key={stop.id}
                  className="flex gap-2"
                  onClick={() => setCurrentStopId(stop.id)}
                  onFocus={() => setCurrentStopId(stop.id)}
                  onChange={() => setCurrentStopId(stop.id)}
                >
                  <div
                    data-testid="gradient-editor-stop-swatch"
                    className={cn(
                      'size-8 min-w-8 rounded-sm border-2 border-background outline-2',
                      stop.id === currentStopId ? 'outline-foreground' : 'cursor-pointer'
                    )}
                    style={{ backgroundColor: stop.color }}
                  />

                  <div data-testid="gradient-editor-stop-hex-input">
                    <HexInput
                      noLabel
                      value={stop.color}
                      setValue={(color) => onStopChange('color', color)}
                    />
                  </div>

                  <Input
                    data-testid="gradient-editor-stop-offset"
                    type={stop.id === currentStopId ? 'number' : 'text'}
                    min={0}
                    max={100}
                    step={1}
                    value={stop.offset}
                    onChange={(e) => onStopChange('offset', Math.min(100, Number(e.target.value)))}
                  />

                  <Button
                    data-testid="gradient-editor-stop-delete"
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

            <Button
              data-testid="gradient-editor-add-stop"
              variant="outline"
              size="sm"
              onClick={addStop}
            >
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
            height={386}
          />
        </ClientOnly>

        <div className="flex flex-col gap-8">
          <HexInput value={currentStop.color} setValue={(color) => onStopChange('color', color)} />

          <RGBInput value={currentStop.color} setValue={(color) => onStopChange('color', color)} />

          <HSVInput value={currentStop.color} setValue={(color) => onStopChange('color', color)} />

          <OkColorInput
            value={currentStop.color}
            setValue={(color) => onStopChange('color', color)}
            space="oklch"
          />

          <OkColorInput
            value={currentStop.color}
            setValue={(color) => onStopChange('color', color)}
            space="oklab"
          />
        </div>
      </div>

      {output && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <CodeDisplay
            code={`const styles = ${JSON.stringify(
              {
                background: value.colorStops[0].color,
                backgroundImage: getGradientColor(value),
              },
              null,
              2
            )};`}
            outputs={[
              CodeDisplayPreset.JssToCss,
              CodeDisplayPreset.JssToTailwindV3,
              CodeDisplayPreset.Jss,
            ]}
            codeWrapperClassName="h-30"
          />

          <div className="bg-card shadow-sm rounded-xl p-4">
            <div className="flex flex-col gap-2">
              <h4 className="text-lg">Extract:</h4>

              <div className="flex gap-4">
                <div className="grid w-full items-center gap-2">
                  <Label htmlFor="gradient-width">Width (px)</Label>
                  <Input
                    data-testid="gradient-editor-width"
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
                    data-testid="gradient-editor-height"
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
                <Button
                  data-testid="gradient-editor-download-png"
                  variant="outline"
                  className="flex-1"
                  onClick={() => onDownloadImage('png')}
                >
                  to .png
                </Button>
                <Button
                  data-testid="gradient-editor-download-jpeg"
                  variant="outline"
                  className="flex-1"
                  onClick={() => onDownloadImage('jpeg')}
                >
                  to .jpeg
                </Button>
                <Button
                  data-testid="gradient-editor-download-webp"
                  variant="outline"
                  className="flex-1"
                  onClick={() => onDownloadImage('webp')}
                >
                  to .webp
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
