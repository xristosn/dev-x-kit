'use client';

import { Container } from '@/components/container';
import { DEFAULT_BACKGROUND_PATTERN_VALUE, PATTERNS, PatternType } from './utils';
import { useWebStorage } from '@/hooks/use-web-storage';
import { ColorService, IColor } from 'react-color-palette';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { InputWrapper } from '@/components/input-wrapper';
import { ColorPopover } from '@/components/color/color-popover';
import { ClientOnly } from '@/components/client-only';
import { Skeleton } from '@/components/ui/skeleton';
import { CircularSlider } from '@/components/circular-slider';
import { CodeDisplay, CodeDisplayPreset } from '@/components/code-display';

export default function CssBackgroundPatternGenerator() {
  const [value, setValue] = useWebStorage(
    'css-bg-pattern',
    'infer',
    DEFAULT_BACKGROUND_PATTERN_VALUE
  );

  const selectedPattern = PATTERNS.find((p) => p.id === value.pattern);
  const styles = selectedPattern?.getStyles({
    ...value,
    fgColor: ColorService.convert('hex', value.fgColor),
    bgColor: ColorService.convert('hex', value.bgColor),
  });

  return (
    <Container>
      <div className="flex flex-col gap-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-4 space-y-6 p-6 border rounded-xl bg-sidebar text-sidebar-foreground shadow-sm">
            <Select
              value={value.pattern}
              onValueChange={(v) => setValue((p) => ({ ...p, pattern: v as PatternType }))}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Pattern" />
              </SelectTrigger>
              <SelectContent>
                {PATTERNS.map((p) => (
                  <SelectItem key={p.id} value={p.id}>
                    <div
                      className="size-6 rounded-sm shadow-xs border transition-all duration-200"
                      style={p.getStyles({
                        ...value,
                        size: 8,
                        stroke: 2,
                        fgColor: ColorService.convert('hex', value.fgColor),
                        bgColor: ColorService.convert('hex', value.bgColor),
                      })}
                    />

                    {p.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {selectedPattern && (
              <ClientOnly>
                <InputWrapper label="Foreground">
                  <ColorPopover
                    value={ColorService.convert('hex', value.fgColor)}
                    setValue={(v) => setValue((p) => ({ ...p, fgColor: (v as IColor).hex }))}
                    defaultMode="rgb"
                  />
                </InputWrapper>

                <InputWrapper label="Background">
                  <ColorPopover
                    value={ColorService.convert('hex', value.bgColor)}
                    setValue={(v) => setValue((p) => ({ ...p, bgColor: (v as IColor).hex }))}
                    defaultMode="rgb"
                  />
                </InputWrapper>

                <InputWrapper label="Size / Spacing" id="css-bg-size">
                  <div className="flex gap-4 items-center">
                    <input
                      id="css-bg-size"
                      type="range"
                      min={5}
                      max={200}
                      step={1}
                      value={value.size}
                      onChange={(e) => setValue((p) => ({ ...p, size: parseInt(e.target.value) }))}
                      className="w-full"
                    />
                    <span className="text-xs text-muted-foreground">{value.size}px</span>
                  </div>
                </InputWrapper>

                {selectedPattern.hasStrokeWidth && (
                  <InputWrapper label="Dot / Stroke Size" id="css-bg-stroke">
                    <div className="flex gap-4 items-center">
                      <input
                        id="css-bg-stroke"
                        type="range"
                        min={1}
                        max={50}
                        step={1}
                        value={value.stroke}
                        onChange={(e) =>
                          setValue((p) => ({ ...p, stroke: parseInt(e.target.value) }))
                        }
                        className="w-full"
                      />
                      <span className="text-xs text-muted-foreground">{value.stroke}px</span>
                    </div>
                  </InputWrapper>
                )}

                {selectedPattern.hasRotation && (
                  <InputWrapper label="Rotation">
                    <CircularSlider
                      value={value.rotation}
                      onChange={(v) => setValue((p) => ({ ...p, rotation: v }))}
                      min={0}
                      max={360}
                      size={92}
                      className="mx-auto"
                    />
                  </InputWrapper>
                )}
              </ClientOnly>
            )}
          </div>

          <div className="lg:col-span-8 space-y-6">
            <div className="alpha-grid rounded-xl border shadow-sm overflow-hidden min-h-80 h-full">
              <ClientOnly fallback={<Skeleton className="w-full h-full" />}>
                <div className="w-full h-full transition-all duration-200" style={styles} />
              </ClientOnly>
            </div>
          </div>
        </div>

        <CodeDisplay
          code={`const styles = ${JSON.stringify(styles, null, 2)};`}
          outputs={[
            CodeDisplayPreset.JssToCss,
            CodeDisplayPreset.JssToTailwindV3,
            CodeDisplayPreset.Jss,
          ]}
        />
      </div>
    </Container>
  );
}
