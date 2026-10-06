'use client';

import { ClientOnly } from '@/components/client-only';
import { CodeDisplay, CodeDisplayPreset } from '@/components/code-display';
import { ColorPopover } from '@/components/color/color-popover';
import type { FaqItem } from '@/components/faq-section';
import { FaqSection } from '@/components/faq-section';
import { InputWrapper } from '@/components/input-wrapper';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useWebStorage } from '@/hooks/use-web-storage';
import { cn } from '@/lib/utils';
import { useTheme } from 'next-themes';
import { ColorService, IColor } from 'react-color-palette';
import { InputSlider } from './_components/input-slider';
import {
  generateSmoothShadow,
  ROUNDED_CONFIG,
  SHADOWS_DEFAULT_VALUE,
  THEME_CONFIG,
} from './_lib/utils';

const FAQS = [
  {
    title: 'What does the Layers setting change in the generated shadow?',
    description:
      'It sets how many shadows are combined in the box-shadow value. Each layer scales the configured offset, blur, and opacity from a smaller value up to the full settings, creating a gradual shadow instead of one hard-edged shadow.',
  },
  {
    title: 'Does the opacity setting apply equally to every shadow layer?',
    description:
      'No. The opacity increases proportionally across the layers. The final layer uses the opacity value you set, while earlier layers use lower opacity values to build up the effect.',
  },
  {
    title: 'Why do theme and box radius changes not appear in the CSS output?',
    description:
      'Theme and box radius are preview-only settings. They change the editor preview so you can judge the shadow against different surfaces and corners, but the generated output contains only the box-shadow styling.',
  },
  {
    title: 'How can I adjust the shadow direction?',
    description:
      'Use Horizontal distance and Vertical distance. Positive values move the shadow right or down, while negative values move it left or up. Blur controls softness independently of the offset.',
  },
] satisfies readonly FaqItem[];

export default function SmoothShadowEditor() {
  const { resolvedTheme } = useTheme();
  const [value, setValue, reset] = useWebStorage(
    'smooth-shadow-editor',
    'infer',
    SHADOWS_DEFAULT_VALUE
  );

  return (
    <div className="flex flex-col gap-8">
      <div className="grid min-w-0 items-start gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(21rem,30rem)]">
        <div className="flex min-w-0 flex-col gap-6">
          <ClientOnly fallback={<Skeleton className="min-h-96 w-full rounded-2xl sm:min-h-128" />}>
            <section
              data-testid="shadow-preview"
              aria-label="Shadow preview"
              className={cn(
                'relative flex min-h-96 items-center justify-center overflow-hidden rounded-2xl border bg-background p-6 sm:min-h-128 sm:p-10',
                value.theme !== 'auto' ? value.theme : resolvedTheme
              )}
            >
              <div className="absolute inset-x-6 top-5 flex items-center justify-between text-sm">
                <span className="font-medium text-foreground">Live preview</span>
                <span className="rounded-full border bg-card px-3 py-1 text-xs text-muted-foreground">
                  Preview only
                </span>
              </div>
              <div className="flex w-full items-center justify-center">
                <div
                  data-testid="shadow-preview-box"
                  className={cn(
                    'aspect-9/6 w-full max-w-md bg-white dark:bg-muted',
                    value.rounded === 'half'
                      ? 'rounded-xl'
                      : value.rounded === 'full'
                        ? 'rounded-[2.5rem]'
                        : 'rounded-none'
                  )}
                  style={{ boxShadow: generateSmoothShadow(value) }}
                />
              </div>
            </section>
          </ClientOnly>

          <section aria-label="Generated code">
            <CodeDisplay
              code={`const styles = ${JSON.stringify({ boxShadow: generateSmoothShadow(value) }, null, 2)};`}
              outputs={[
                CodeDisplayPreset.JssToCss,
                CodeDisplayPreset.JssToTailwindV3,
                CodeDisplayPreset.Jss,
              ]}
              codeWrapperClassName="min-h-40"
            />
          </section>
        </div>

        <section className="flex min-w-0 flex-col gap-6 rounded-2xl border bg-card p-5 sm:p-6">
          <div className="flex items-center justify-between gap-4 border-b pb-4">
            <div>
              <h2 className="text-lg font-semibold tracking-tight">Shadow styling</h2>
              <p className="mt-1 text-sm text-muted-foreground">Tune the look of your shadow</p>
            </div>
            <Button data-testid="shadow-reset" size="sm" onClick={reset} variant="secondary">
              Reset
            </Button>
          </div>

          <InputWrapper label="Theme">
            <div
              aria-label="Preview theme"
              className="grid grid-cols-3 gap-1 rounded-xl bg-muted p-1"
              role="group"
            >
              {THEME_CONFIG.map((theme) => (
                <Button
                  key={theme.value}
                  data-testid={`shadow-theme-${theme.value}`}
                  type="button"
                  size="sm"
                  variant="ghost"
                  aria-pressed={theme.value === value.theme}
                  onClick={() => setValue((p) => ({ ...p, theme: theme.value }))}
                  className={cn(
                    'h-10 rounded-lg text-muted-foreground hover:bg-background/70 hover:text-foreground',
                    theme.value === value.theme && 'bg-background text-foreground shadow-sm'
                  )}
                >
                  {theme.label}
                </Button>
              ))}
            </div>
            <p className="text-xs text-muted-foreground">Preview only</p>
          </InputWrapper>

          <InputWrapper label="Box radius">
            <div
              aria-label="Preview box radius"
              className="grid grid-cols-3 gap-1 rounded-xl bg-muted p-1"
              role="group"
            >
              {ROUNDED_CONFIG.map((corner) => (
                <Button
                  key={corner.value}
                  data-testid={`shadow-radius-${corner.value}`}
                  type="button"
                  size="sm"
                  variant="ghost"
                  aria-pressed={corner.value === value.rounded}
                  onClick={() => setValue((p) => ({ ...p, rounded: corner.value }))}
                  className={cn(
                    'h-10 rounded-lg text-muted-foreground hover:bg-background/70 hover:text-foreground',
                    corner.value === value.rounded && 'bg-background text-foreground shadow-sm'
                  )}
                >
                  {corner.label}
                </Button>
              ))}
            </div>
            <p className="text-xs text-muted-foreground">Preview only</p>
          </InputWrapper>

          <div className="flex flex-col gap-5">
            <InputWrapper label="Layers" id="shadow-layers">
              <InputSlider
                id="shadow-layers"
                min={1}
                max={12}
                step={1}
                value={value.layers}
                setValue={(v) => setValue((p) => ({ ...p, layers: v as number }))}
              />
            </InputWrapper>

            <InputWrapper label="Opacity" id="shadow-opacity">
              <InputSlider
                id="shadow-opacity"
                min={0.01}
                max={1}
                step={0.01}
                value={value.opacity}
                setValue={(v) => setValue((p) => ({ ...p, opacity: v as number }))}
              />
            </InputWrapper>

            <InputWrapper label="Blur" id="shadow-blur">
              <InputSlider
                id="shadow-blur"
                min={0}
                max={512}
                step={1}
                value={value.blur}
                setValue={(v) => setValue((p) => ({ ...p, blur: v as number }))}
              />
            </InputWrapper>

            <InputWrapper label="Horizontal distance" id="shadow-offsetx">
              <InputSlider
                id="shadow-offsetx"
                min={-512}
                max={512}
                step={1}
                value={value.offsetX}
                setValue={(v) => setValue((p) => ({ ...p, offsetX: v as number }))}
              />
            </InputWrapper>

            <InputWrapper label="Vertical distance" id="shadow-offsety">
              <InputSlider
                id="shadow-offsety"
                min={-512}
                max={512}
                step={1}
                value={value.offsetY}
                setValue={(v) => setValue((p) => ({ ...p, offsetY: v as number }))}
              />
            </InputWrapper>
          </div>

          <div className="border-t pt-5">
            <ColorPopover
              label="Color"
              value={ColorService.convert('hex', value.color)}
              setValue={(v) => setValue((p) => ({ ...p, color: (v as IColor).hex }))}
              disableAlpha
            />
          </div>
        </section>
      </div>
      <FaqSection items={FAQS} />
    </div>
  );
}
