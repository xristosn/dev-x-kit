'use client';

import { CircularSlider } from '@/components/circular-slider';
import { ClientOnly } from '@/components/client-only';
import { CodeDisplay, CodeDisplayPreset } from '@/components/code-display';
import { FaqSection } from '@/components/faq-section';
import type { FaqItem } from '@/components/faq-section';
import { ColorPopover } from '@/components/color/color-popover';
import { InputWrapper } from '@/components/input-wrapper';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { useWebStorage } from '@/hooks/use-web-storage';
import { ColorService, IColor } from 'react-color-palette';
import { DEFAULT_BACKGROUND_PATTERN_VALUE, PATTERNS, PatternType } from './_lib/utils';

const FAQS = [
  {
    title: 'What is the difference between Size / Spacing and Dot / Stroke Size?',
    description:
      'Size / Spacing changes the scale or repeat spacing of the selected pattern. For the Dots pattern, Dot / Stroke Size separately changes the radius of each dot. The dot control only appears for patterns that use it.',
  },
  {
    title: 'Why is the rotation control only available for Stripes?',
    description:
      'The rotation setting is used by the repeating linear gradient that draws Stripes. The other pattern generators do not use that setting, so the control is hidden when they are selected.',
  },
  {
    title: 'Why do some controls disappear when I switch patterns?',
    description:
      'Controls are shown only when the selected pattern supports them. Rotation applies to Stripes, while Dot / Stroke Size applies to Dots. Shared settings such as colors and size remain available, and values for hidden controls are retained but do not affect patterns that do not use them.',
  },
  {
    title: 'How can I make a pattern easier to see against its background?',
    description:
      'Choose contrasting foreground and background colors. If the pattern still looks too dense or too spread out, adjust Size / Spacing. For the Dots pattern, adjust Dot / Stroke Size as well to change how prominent each dot appears.',
  },
] satisfies readonly FaqItem[];

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
    <div className="flex flex-col gap-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-4 space-y-6 p-6 border rounded-xl bg-sidebar text-sidebar-foreground shadow-sm">
          <InputWrapper label="Pattern">
            <ClientOnly fallback={<Skeleton className="w-full h-9" />}>
              <Select
                value={value.pattern}
                onValueChange={(v) => setValue((p) => ({ ...p, pattern: v as PatternType }))}
              >
                <SelectTrigger data-testid="pattern-select-trigger" className="w-full">
                  <SelectValue placeholder="Pattern" />
                </SelectTrigger>
                <SelectContent>
                  {PATTERNS.map((p) => (
                    <SelectItem data-testid={`pattern-option-${p.id}`} key={p.id} value={p.id}>
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
            </ClientOnly>
          </InputWrapper>

          {selectedPattern && (
            <>
              <InputWrapper label="Foreground">
                <ClientOnly fallback={<Skeleton className="w-full h-9" />}>
                  <ColorPopover
                    value={ColorService.convert('hex', value.fgColor)}
                    setValue={(v) => setValue((p) => ({ ...p, fgColor: (v as IColor).hex }))}
                    defaultMode="rgb"
                  />
                </ClientOnly>
              </InputWrapper>

              <InputWrapper label="Background">
                <ClientOnly fallback={<Skeleton className="w-full h-9" />}>
                  <ColorPopover
                    value={ColorService.convert('hex', value.bgColor)}
                    setValue={(v) => setValue((p) => ({ ...p, bgColor: (v as IColor).hex }))}
                    defaultMode="rgb"
                  />
                </ClientOnly>
              </InputWrapper>

              <InputWrapper label="Size / Spacing" id="css-bg-size">
                <ClientOnly fallback={<Skeleton className="w-full h-9" />}>
                  <div className="flex gap-4 items-center">
                    <input
                      id="css-bg-size"
                      data-testid="pattern-size-input"
                      type="range"
                      min={5}
                      max={200}
                      step={1}
                      value={value.size}
                      onChange={(e) => setValue((p) => ({ ...p, size: parseInt(e.target.value) }))}
                      className="w-full"
                    />
                    <span
                      data-testid="pattern-size-value"
                      className="text-xs text-muted-foreground"
                    >
                      {value.size}px
                    </span>
                  </div>
                </ClientOnly>
              </InputWrapper>

              {selectedPattern.hasStrokeWidth && (
                <InputWrapper label="Dot / Stroke Size" id="css-bg-stroke">
                  <ClientOnly fallback={<Skeleton className="w-full h-9" />}>
                    <div className="flex gap-4 items-center">
                      <input
                        id="css-bg-stroke"
                        data-testid="pattern-stroke-input"
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
                  </ClientOnly>
                </InputWrapper>
              )}

              {selectedPattern.hasRotation && (
                <InputWrapper label="Rotation">
                  <ClientOnly fallback={<Skeleton className="w-full h-9" />}>
                    <div data-testid="pattern-rotation-control">
                      <CircularSlider
                        value={value.rotation}
                        onChange={(v) => setValue((p) => ({ ...p, rotation: v }))}
                        min={0}
                        max={360}
                        size={92}
                        className="mx-auto"
                      />
                    </div>
                  </ClientOnly>
                </InputWrapper>
              )}
            </>
          )}
        </div>

        <div className="lg:col-span-8 space-y-6">
          <div className="alpha-grid rounded-xl border shadow-sm overflow-hidden min-h-80 h-full">
            <ClientOnly fallback={<Skeleton className="w-full h-full" />}>
              <div
                data-testid="pattern-preview"
                className="w-full h-full transition-all duration-200"
                style={styles}
              />
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
      <FaqSection items={FAQS} />
    </div>
  );
}
