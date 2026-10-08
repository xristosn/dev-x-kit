'use client';

import { ClientOnly } from '@/components/client-only';
import { CodeDisplay, CodeDisplayPreset } from '@/components/code-display';
import { ColorPopover } from '@/components/color/color-popover';
import { InputWrapper } from '@/components/input-wrapper';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { useWebStorage } from '@/hooks/use-web-storage';
import { useState } from 'react';
import {
  DEFAULT_TEXT_GRADIENT_VALUE,
  GRADIENT_POSITIONS,
  LINEAR_DIRECTIONS,
  RADIAL_SHAPES,
  RADIAL_SIZES,
  TEXT_GRADIENT_PRESETS,
  getTextGradientStyles,
  normalizeTextGradientValue,
  type RadialGradientShape,
  type TextGradientDirection,
  type TextGradientPosition,
  type TextGradientType,
  type TextGradientValue,
} from '../_lib/utils';

const MAX_STOPS = 8;

export function TextGradientGenerator() {
  const [storedValue, setValue, resetValue] = useWebStorage(
    'css-text-gradient-generator',
    'infer',
    DEFAULT_TEXT_GRADIENT_VALUE
  );
  const value = normalizeTextGradientValue(storedValue);
  const [previewText, setPreviewText] = useState('Gradient Text');
  const styles = getTextGradientStyles(value);

  const update = (nextValue: TextGradientValue) => setValue(normalizeTextGradientValue(nextValue));

  const changeStop = (id: string, changes: Partial<TextGradientValue['stops'][number]>) => {
    update({
      ...value,
      stops: value.stops.map((stop) => (stop.id === id ? { ...stop, ...changes } : stop)),
    });
  };

  const addStop = () => {
    if (value.stops.length >= MAX_STOPS) return;

    update({
      ...value,
      stops: [
        ...value.stops,
        {
          id: `stop-${value.stops.length}-${value.stops.map((stop) => stop.id).join('-')}`,
          color: '#ffffff',
          offset: 50,
        },
      ],
    });
  };

  const removeStop = (id: string) => {
    if (value.stops.length <= 2) return;
    update({ ...value, stops: value.stops.filter((stop) => stop.id !== id) });
  };

  const applyPreset = (presetValue: TextGradientValue) => {
    update(presetValue);
  };

  const setType = (type: TextGradientType) => update({ ...value, type });

  return (
    <div className="flex flex-col gap-8">
      <div className="grid min-w-0 items-start gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(21rem,30rem)]">
        <ClientOnly
          fallback={
            <div className="flex min-w-0 flex-col gap-6">
              <Skeleton
                data-testid="text-gradient-preview-fallback"
                className="min-h-72 w-full rounded-2xl sm:min-h-96"
              />
              <Skeleton data-testid="text-gradient-code-fallback" className="h-40 w-full" />
            </div>
          }
        >
          <div className="flex min-w-0 flex-col gap-6">
            <section
              data-testid="text-gradient-preview"
              aria-label="Text gradient preview"
              className="flex min-h-72 items-center justify-center overflow-hidden rounded-2xl border bg-card p-6 sm:min-h-96 sm:p-10"
            >
              <p
                data-testid="text-gradient-preview-text"
                className="max-w-full wrap-break-word text-center text-5xl font-extrabold tracking-tight sm:text-7xl"
                style={styles}
              >
                {previewText || ' '}
              </p>
            </section>

            <section aria-label="Generated code">
              <CodeDisplay
                code={`const textGradient = ${JSON.stringify(styles, null, 2)};`}
                outputs={[
                  CodeDisplayPreset.JssToCss,
                  CodeDisplayPreset.JssToTailwindV3,
                  CodeDisplayPreset.Jss,
                ]}
                codeWrapperClassName="min-h-40"
              />
            </section>
          </div>
        </ClientOnly>

        <section className="flex min-w-0 flex-col gap-6 rounded-2xl border bg-card p-5 sm:p-6">
          <div className="flex items-center justify-between gap-4 border-b pb-4">
            <div>
              <h2 className="text-lg font-semibold tracking-tight">Text gradient settings</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Shape the gradient and preview it live
              </p>
            </div>
            <Button
              data-testid="text-gradient-reset"
              size="sm"
              onClick={resetValue}
              variant="secondary"
            >
              Reset
            </Button>
          </div>

          <InputWrapper label="Preset">
            <div className="flex flex-wrap gap-2">
              {TEXT_GRADIENT_PRESETS.map((preset) => (
                <Button
                  key={preset.id}
                  data-testid={`text-gradient-preset-${preset.id}`}
                  type="button"
                  variant="outline"
                  size="sm"
                  className="w-fit justify-start"
                  onClick={() => applyPreset(preset.value)}
                >
                  <span
                    aria-hidden="true"
                    className="mr-2 size-4 shrink-0 rounded-full"
                    style={{ backgroundImage: getTextGradientStyles(preset.value).backgroundImage }}
                  />
                  {preset.label}
                </Button>
              ))}
            </div>
          </InputWrapper>

          <InputWrapper label="Preview text" id="text-gradient-preview-input">
            <Input
              id="text-gradient-preview-input"
              data-testid="text-gradient-preview-input"
              value={previewText}
              maxLength={80}
              onChange={(event) => setPreviewText(event.target.value)}
            />
          </InputWrapper>

          <InputWrapper label="Gradient type">
            <ClientOnly fallback={<Skeleton className="h-9 w-full" />}>
              <Select
                value={value.type}
                onValueChange={(next) => setType(next as TextGradientType)}
              >
                <SelectTrigger data-testid="text-gradient-type-trigger" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem data-testid="text-gradient-type-linear" value="linear">
                    Linear
                  </SelectItem>
                  <SelectItem data-testid="text-gradient-type-radial" value="radial">
                    Radial
                  </SelectItem>
                </SelectContent>
              </Select>
            </ClientOnly>
          </InputWrapper>

          <ClientOnly
            fallback={
              <div
                data-testid="text-gradient-mode-controls-fallback"
                className="flex flex-col gap-3"
              >
                <Skeleton className="h-5 w-20" />
                <Skeleton className="h-9 w-full" />
                <Skeleton className="h-9 w-full" />
              </div>
            }
          >
            {value.type === 'linear' ? (
              <>
                <InputWrapper label="Orientation">
                  <ClientOnly fallback={<Skeleton className="h-9 w-full" />}>
                    <Select
                      value={value.direction}
                      onValueChange={(next) =>
                        update({ ...value, direction: next as TextGradientDirection })
                      }
                    >
                      <SelectTrigger
                        data-testid="text-gradient-direction-trigger"
                        className="w-full"
                      >
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem data-testid="text-gradient-direction-custom" value="custom">
                          Custom angle
                        </SelectItem>
                        {LINEAR_DIRECTIONS.map((direction) => (
                          <SelectItem
                            data-testid={`text-gradient-direction-${direction.value.replaceAll(' ', '-')}`}
                            key={direction.value}
                            value={direction.value}
                          >
                            {direction.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </ClientOnly>
                </InputWrapper>

                {value.direction === 'custom' && (
                  <InputWrapper
                    label="Angle"
                    id="text-gradient-angle-input"
                    helperText="0° points up. Values wrap at 360°."
                  >
                    <Input
                      id="text-gradient-angle-input"
                      data-testid="text-gradient-angle-input"
                      type="number"
                      min={0}
                      max={360}
                      value={value.angle}
                      onChange={(event) => {
                        const angle = Number(event.target.value);
                        if (event.target.value !== '' && Number.isFinite(angle)) {
                          update({ ...value, angle: Math.min(360, Math.max(0, angle)) });
                        }
                      }}
                    />
                  </InputWrapper>
                )}
              </>
            ) : (
              <>
                <InputWrapper label="Position">
                  <ClientOnly fallback={<Skeleton className="h-9 w-full" />}>
                    <Select
                      value={value.position}
                      onValueChange={(next) =>
                        update({ ...value, position: next as TextGradientPosition })
                      }
                    >
                      <SelectTrigger
                        data-testid="text-gradient-position-trigger"
                        className="w-full"
                      >
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {GRADIENT_POSITIONS.map((position) => (
                          <SelectItem
                            data-testid={`text-gradient-position-${position.value}`}
                            key={position.value}
                            value={position.value}
                          >
                            {position.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </ClientOnly>
                </InputWrapper>

                <InputWrapper label="Shape">
                  <ClientOnly fallback={<Skeleton className="h-9 w-full" />}>
                    <Select
                      value={value.shape}
                      onValueChange={(next) => {
                        const shape = next as RadialGradientShape;
                        const size =
                          shape === 'ellipse' && value.size.endsWith('corner')
                            ? 'farthest-side'
                            : value.size;
                        update({ ...value, shape, size });
                      }}
                    >
                      <SelectTrigger data-testid="text-gradient-shape-trigger" className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {RADIAL_SHAPES.map((shape) => (
                          <SelectItem
                            data-testid={`text-gradient-shape-${shape.value}`}
                            key={shape.value}
                            value={shape.value}
                          >
                            {shape.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </ClientOnly>
                </InputWrapper>

                <InputWrapper label="Size">
                  <ClientOnly fallback={<Skeleton className="h-9 w-full" />}>
                    <Select
                      value={value.size}
                      onValueChange={(next) =>
                        update({ ...value, size: next as TextGradientValue['size'] })
                      }
                    >
                      <SelectTrigger data-testid="text-gradient-size-trigger" className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {RADIAL_SIZES.filter(
                          (size) => value.shape === 'circle' || !size.value.endsWith('corner')
                        ).map((size) => (
                          <SelectItem
                            data-testid={`text-gradient-size-${size.value}`}
                            key={size.value}
                            value={size.value}
                          >
                            {size.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </ClientOnly>
                </InputWrapper>
              </>
            )}
          </ClientOnly>

          <ClientOnly
            fallback={
              <div data-testid="text-gradient-stops-fallback" className="flex flex-col gap-3">
                <Skeleton className="h-5 w-28" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
              </div>
            }
          >
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium">Color stops</h3>
                <Button
                  data-testid="text-gradient-add-stop"
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addStop}
                  disabled={value.stops.length >= MAX_STOPS}
                >
                  Add color
                </Button>
              </div>
              {value.stops.map((stop, index) => (
                <div
                  data-testid={`text-gradient-stop-${index}`}
                  key={stop.id}
                  className="flex items-end gap-2"
                >
                  <div className="min-w-0 flex-1">
                    <ColorPopover
                      value={stop.color}
                      setValue={(nextColor) =>
                        changeStop(stop.id, {
                          color:
                            typeof nextColor === 'function' ? nextColor(stop.color) : nextColor,
                        })
                      }
                      id={`text-gradient-color-${index}`}
                      label={index === 0 ? 'Color' : undefined}
                      disableAlpha
                      defaultMode="hex"
                    />
                  </div>
                  <div className="w-24">
                    <InputWrapper label={index === 0 ? 'Position (%)' : undefined}>
                      <Input
                        data-testid={`text-gradient-stop-offset-${index}`}
                        type="number"
                        min={0}
                        max={100}
                        value={stop.offset}
                        aria-label={`Stop ${index + 1} position`}
                        onChange={(event) => {
                          const offset = Number(event.target.value);
                          if (event.target.value !== '' && Number.isFinite(offset)) {
                            changeStop(stop.id, { offset: Math.min(100, Math.max(0, offset)) });
                          }
                        }}
                      />
                    </InputWrapper>
                  </div>
                  <Button
                    data-testid={`text-gradient-remove-stop-${index}`}
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => removeStop(stop.id)}
                    disabled={value.stops.length <= 2}
                    aria-label={`Remove stop ${index + 1}`}
                  >
                    ×
                  </Button>
                </div>
              ))}
            </div>
          </ClientOnly>
        </section>
      </div>
    </div>
  );
}
