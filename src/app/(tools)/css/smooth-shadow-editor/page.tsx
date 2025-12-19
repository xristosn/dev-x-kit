'use client';

import { Container } from '@/components/container';
import { useWebStorage } from '@/hooks/use-web-storage';
import {
  generateSmoothShadow,
  getShadowCss,
  ROUNDED_CONFIG,
  SHADOWS_DEFAULT_VALUE,
  THEME_CONFIG,
} from './utils';
import { cn } from '@/lib/utils';
import { InputWrapper } from '@/components/input-wrapper';
import { InputSlider } from './input-slider';
import { Button } from '@/components/ui/button';
import { ClientOnly } from '@/components/client-only';
import { Skeleton } from '@/components/ui/skeleton';
import { useTheme } from 'next-themes';
import { ColorPopover } from '@/components/color/color-popover';
import { ColorService, IColor } from 'react-color-palette';
import { CopyIconButton } from '@/components/copy-button';

export default function SmoothShadowEditor() {
  const { resolvedTheme } = useTheme();
  const [value, setValue, reset] = useWebStorage(
    'smooth-shadow-editor',
    'infer',
    SHADOWS_DEFAULT_VALUE
  );
  const css = getShadowCss(value);

  return (
    <Container className="md:p-0 md:flex-row md:max-w-none xl:max-w-none md:gap-0">
      <ClientOnly fallback={<Skeleton className="h-1/2 min-h-[220px] md:h-full w-full" />}>
        <div
          className={cn(
            'h-1/2 min-h-[220px] md:h-[calc(100vh-var(--header-height))] w-full flex items-center justify-center bg-background',
            value.theme !== 'auto' ? value.theme : resolvedTheme
          )}
        >
          <div
            className={cn(
              'w-[400px] h-[200px] bg-white dark:bg-muted',
              value.rounded === 'half'
                ? 'rounded-md'
                : value.rounded === 'full'
                  ? 'rounded-4xl'
                  : 'rounded-none'
            )}
            style={{ boxShadow: generateSmoothShadow(value) }}
          />
        </div>
      </ClientOnly>

      <div className="bg-sidebar rounded-xl w-full min-h-[220px] md:h-[calc(100vh-var(--header-height))] overflow-auto md:w-[400px] md:min-w-[400px] md:rounded-none md:border-l flex flex-col gap-6 p-4">
        <div className="flex gap-4 items-center justify-between">
          <p className="text-lg">Shadow Styling</p>
          <Button size="sm" onClick={reset} variant="secondary">
            Reset
          </Button>
        </div>

        <InputWrapper label="Theme" helperText="For preview only">
          <ClientOnly fallback={<Skeleton className="w-full" />}>
            <div className="flex gap-4">
              {THEME_CONFIG.map((theme) => (
                <Button
                  key={theme.value}
                  size="icon"
                  variant={theme.value === value.theme ? 'default' : 'outline'}
                  onClick={() => setValue((p) => ({ ...p, theme: theme.value }))}
                >
                  {<theme.icon />}
                </Button>
              ))}
            </div>
          </ClientOnly>
        </InputWrapper>

        <InputWrapper label="Box radius" helperText="For preview only">
          <ClientOnly fallback={<Skeleton className="w-full" />}>
            <div className="flex gap-4">
              {ROUNDED_CONFIG.map((corner) => (
                <Button
                  key={corner.value}
                  size="sm"
                  variant={corner.value === value.rounded ? 'default' : 'outline'}
                  onClick={() => setValue((p) => ({ ...p, rounded: corner.value }))}
                >
                  {corner.label}
                </Button>
              ))}
            </div>
          </ClientOnly>
        </InputWrapper>

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

        <ColorPopover
          label="Color"
          value={ColorService.convert('hex', value.color)}
          setValue={(v) => setValue((p) => ({ ...p, color: (v as IColor).hex }))}
          disableAlpha
        />

        <div className="flex flex-col gap-2 items-center">
          <p className="text-sm w-full">CSS</p>

          <ClientOnly fallback={<Skeleton className="w-full h-40" />}>
            <code className="p-2 pr-8 whitespace-pre-wrap relative bg-muted rounded-md w-full h-full border">
              {css}

              <CopyIconButton
                value={css}
                variant="outline"
                size="icon-sm"
                className="absolute top-2 right-2"
              />
            </code>
          </ClientOnly>
        </div>
      </div>
    </Container>
  );
}
