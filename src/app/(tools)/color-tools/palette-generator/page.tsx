'use client';

import { FaqSection } from '@/components/faq-section';
import type { FaqItem } from '@/components/faq-section';
import { ClientOnly } from '@/components/client-only';
import { CodeDisplay } from '@/components/code-display';
import { ColorPopover } from '@/components/color/color-popover';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useWebStorage } from '@/hooks/use-web-storage';
import { cn } from '@/lib/utils';
import { Moon, Sun } from 'lucide-react';
import { ColorDialog } from './_components/color-dialog';
import { PalettePreview } from './_components/palette-preview';
import { generatePalettes, paletteToChakraV3, paletteToCss, paletteToText } from './_lib/utils';

type PaletteGeneratorStoreValue = {
  theme: 'light' | 'dark';
  light: { primaryColor: string; bgColor: string };
  dark: { primaryColor: string; bgColor: string };
};

const DEFAULT_PALETTE_GENERATOR_STORE_VALUE: PaletteGeneratorStoreValue = {
  theme: 'light',
  light: { primaryColor: '#3b82f6', bgColor: '#f2f2f2' },
  dark: { primaryColor: '#3b82f6', bgColor: '#000000' },
};

function asRecord(value: unknown): Record<string, unknown> {
  return typeof value === 'object' && value !== null ? (value as Record<string, unknown>) : {};
}

function colorString(value: unknown, fallback: string): string {
  return typeof value === 'string' ? value : fallback;
}

function normalizePaletteGeneratorStoreValue(value: unknown): PaletteGeneratorStoreValue {
  const stored = asRecord(value);
  const light = asRecord(stored.light);
  const dark = asRecord(stored.dark);

  return {
    theme: stored.theme === 'dark' ? 'dark' : 'light',
    light: {
      primaryColor: colorString(
        light.primaryColor,
        DEFAULT_PALETTE_GENERATOR_STORE_VALUE.light.primaryColor
      ),
      bgColor: colorString(light.bgColor, DEFAULT_PALETTE_GENERATOR_STORE_VALUE.light.bgColor),
    },
    dark: {
      primaryColor: colorString(
        dark.primaryColor,
        DEFAULT_PALETTE_GENERATOR_STORE_VALUE.dark.primaryColor
      ),
      bgColor: colorString(dark.bgColor, DEFAULT_PALETTE_GENERATOR_STORE_VALUE.dark.bgColor),
    },
  };
}

const FAQS = [
  {
    title: 'How do the primary and background colors affect the palette?',
    description:
      'The generator builds a 12-color scale from the selected primary and background colors. It blends between those colors, then extends the scale toward white or black depending on the background. Changing either input regenerates the scale and preview.',
  },
  {
    title: 'Do light and dark modes share the same colors?',
    description:
      'No. Light and dark mode each keep their own primary and background colors. Switching modes changes which pair is used to generate the palette, so you can tune both themes separately.',
  },
  {
    title: 'Can I copy a specific palette color?',
    description:
      'Select a swatch to open its color details. The dialog shows the color as HEX, RGB, and HSV, with a copy button for each format.',
  },
  {
    title: 'Which code formats can I export?',
    description:
      'The output panel provides CSS, Chakra UI v3, and plain text versions of the generated palette. The palette preview and these formats do not certify that every color combination meets accessibility contrast requirements.',
  },
] satisfies readonly FaqItem[];

export default function PaletteGenerator() {
  const [storedValue, setValue] = useWebStorage<PaletteGeneratorStoreValue>(
    'palette-generator',
    'infer',
    DEFAULT_PALETTE_GENERATOR_STORE_VALUE
  );
  const value = normalizePaletteGeneratorStoreValue(storedValue);

  const palette = generatePalettes(value[value.theme].primaryColor, value[value.theme].bgColor);

  return (
    <>
      <div className="bg-card text-card-foreground p-4 rounded-xl shadow-md flex flex-col gap-4">
        <div className="flex items-center justify-center">
          <ClientOnly fallback={<Skeleton className="h-10 w-40" />}>
            <Button
              className={cn(
                'rounded-r-none text-foreground border hover:bg-white/45',
                value.theme === 'light'
                  ? 'bg-white border-white text-black hover:bg-white/90'
                  : 'bg-transparent border-border/75'
              )}
              size="lg"
              onClick={() => setValue((p) => ({ ...p, theme: 'light' }))}
            >
              <Sun /> Light
            </Button>

            <Button
              className={cn(
                'rounded-l-none text-foreground border hover:bg-black/45',
                value.theme === 'dark'
                  ? 'bg-black border-black text-white hover:bg-black/90'
                  : 'bg-transparent border-border/75'
              )}
              size="lg"
              onClick={() => setValue((p) => ({ ...p, theme: 'dark' }))}
            >
              Dark <Moon />
            </Button>
          </ClientOnly>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <ColorPopover
            label="Primary Color"
            value={value[value.theme].primaryColor}
            setValue={(nextColor) =>
              setValue((p) => ({
                ...p,
                [p.theme]: {
                  ...p[p.theme],
                  primaryColor:
                    typeof nextColor === 'function'
                      ? nextColor(p[p.theme].primaryColor)
                      : nextColor,
                },
              }))
            }
            disableAlpha
          />

          <ColorPopover
            label="Background Color"
            value={value[value.theme].bgColor}
            setValue={(nextColor) =>
              setValue((p) => ({
                ...p,
                [p.theme]: {
                  ...p[p.theme],
                  bgColor:
                    typeof nextColor === 'function' ? nextColor(p[p.theme].bgColor) : nextColor,
                },
              }))
            }
            disableAlpha
          />
        </div>
      </div>

      <div className="bg-card text-card-foreground p-4 shadow-md rounded-xl flex flex-col gap-4">
        <h5 className="text-lg">Palette</h5>

        <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-12 gap-4 items-center justify-center">
          {palette.palette.map((color, idx) => (
            <ColorDialog key={idx} color={color} name={`${palette.name} ${idx + 1}`}>
              <ClientOnly fallback={<Skeleton className="size-14 rounded-sm" />}>
                <div
                  className="size-14 rounded-sm shadow-sm border-2 cursor-pointer hover:border-accent-foreground mx-auto"
                  style={{ backgroundColor: color }}
                />
              </ClientOnly>
            </ColorDialog>
          ))}
        </div>
      </div>

      <div className="bg-card text-card-foreground p-4 shadow-md rounded-xl flex flex-col gap-4">
        <h5 className="text-lg">Preview</h5>

        <ClientOnly fallback={<Skeleton className="w-full h-170" />}>
          <PalettePreview
            bgColor={value[value.theme].bgColor}
            primaryColor={value[value.theme].primaryColor}
            palette={palette.palette}
          />
        </ClientOnly>
      </div>

      <CodeDisplay
        code={palette.palette.join('')}
        outputs={[
          {
            language: 'CSS',
            convert: () =>
              paletteToCss(palette.name, palette.palette, value[value.theme].bgColor, value.theme),
          },
          {
            language: 'Chakra UI v3',
            convert: () =>
              paletteToChakraV3(
                palette.name,
                palette.palette,
                value[value.theme].bgColor,
                value.theme
              ),
          },
          {
            language: 'Text',
            convert: () => paletteToText(palette.name, palette.palette, value[value.theme].bgColor),
          },
        ]}
      />
      <FaqSection items={FAQS} />
    </>
  );
}
