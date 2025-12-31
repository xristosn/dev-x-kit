'use client';

import { Container } from '@/components/container';
import { ColorPopover } from '@/components/color/color-popover';
import { useWebStorage } from '@/hooks/use-web-storage';
import {
  generatePalettes,
  getDefaultPaletteGeneratorStoreValue,
  paletteToChakraV3,
  paletteToCss,
  paletteToText,
} from './utils';
import { IColor } from 'react-color-palette';
import { ClientOnly } from '@/components/client-only';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Moon, Sun } from 'lucide-react';
import { cn } from '@/lib/utils';
import { PalettePreview } from './palette-preview';
import { ColorDialog } from './color-dialog';
import { CodeDisplay } from '@/components/code-display';

export default function PaletteGenerator() {
  const [value, setValue] = useWebStorage(
    'palette-generator',
    'infer',
    getDefaultPaletteGeneratorStoreValue()
  );

  console.log({ value });

  const palette = generatePalettes(
    value[value.theme].primaryColor.hex,
    value[value.theme].bgColor.hex
  );

  return (
    <Container>
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
            setValue={(v) =>
              setValue((p) => ({
                ...p,
                [p.theme]: { ...p[p.theme], primaryColor: v as IColor },
              }))
            }
            disableAlpha
          />

          <ColorPopover
            label="Background Color"
            value={value[value.theme].bgColor}
            setValue={(v) =>
              setValue((p) => ({
                ...p,
                [p.theme]: { ...p[p.theme], bgColor: v as IColor },
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
              paletteToCss(
                palette.name,
                palette.palette,
                value[value.theme].bgColor.hex,
                value.theme
              ),
          },
          {
            language: 'Chakra UI v3',
            convert: () =>
              paletteToChakraV3(
                palette.name,
                palette.palette,
                value[value.theme].bgColor.hex,
                value.theme
              ),
          },
          {
            language: 'Text',
            convert: () =>
              paletteToText(palette.name, palette.palette, value[value.theme].bgColor.hex),
          },
        ]}
      />
    </Container>
  );
}
