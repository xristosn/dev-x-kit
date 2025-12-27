'use client';

import { useEffect, useId, useRef, useState } from 'react';
import { ColorPicker, ColorService, IColor } from 'react-color-palette';
import 'react-color-palette/css';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { HexInput } from './hex-input';
import { RGBInput } from './rgb-input';
import { HSVInput } from './hsv-input';
import { ColorMode, colorToString } from './utils';
import { ClientOnly } from '../client-only';
import { Skeleton } from '../ui/skeleton';
import { useWebStorage } from '@/hooks/use-web-storage';
import { uniq } from 'lodash-es';

export interface ColorPopoverProps {
  value: IColor;
  setValue: React.Dispatch<React.SetStateAction<IColor>>;
  id?: string;
  label?: string;
  disableAlpha?: boolean;
  defaultMode?: ColorMode;
}

export const ColorPopover: React.FC<ColorPopoverProps> = ({
  value,
  setValue,
  id: triggerId,
  label,
  disableAlpha,
  defaultMode,
}) => {
  const id = useId();
  const [colorMode, setColorMode] = useState<ColorMode>(defaultMode || 'hex');
  const [recentColors, setRecentColors] = useWebStorage('recent-colors', 'infer', [] as string[]);
  const [open, setOpen] = useState(false);
  const wasOpen = useRef(false);
  const colorChanged = useRef(false);

  useEffect(() => {
    if (open) {
      colorChanged.current = false;
      wasOpen.current = true;
      return;
    }

    if (!colorChanged.current) return;

    setRecentColors((p) => uniq([value.hex, ...p]).slice(0, 20));

    wasOpen.current = false;
    colorChanged.current = false;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  return (
    <div className="grid w-full items-center gap-2 not-disabled:cursor-pointer">
      {label && <Label htmlFor={triggerId || `color-popover-${id}`}>{label}</Label>}

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger>
          <div className="relative">
            <ClientOnly fallback={<Skeleton className="size-6" />}>
              <div
                className="absolute top-1.5 left-2 size-6 rounded-sm"
                style={{ backgroundColor: value.hex }}
              />
            </ClientOnly>

            <Input
              id={triggerId || `color-popover-${id}`}
              type="text"
              readOnly
              className="not-disabled:cursor-pointer pl-10"
              value={colorToString(value, colorMode)}
            />
          </div>
        </PopoverTrigger>

        <PopoverContent className="flex flex-col gap-2 w-104 max-w-dvw">
          <ColorPicker
            color={value}
            onChange={setValue}
            hideInput
            onChangeComplete={() => (colorChanged.current = true)}
            hideAlpha={disableAlpha}
          />

          <div className="flex flex-wrap gap-1">
            <Select value={colorMode as string} onValueChange={(v) => setColorMode(v as ColorMode)}>
              <SelectTrigger className="w-20 flex-1">
                <SelectValue placeholder="Color Mode" />
              </SelectTrigger>
              <SelectContent>
                {['hex', 'rgb', 'hsv'].map((mode) => (
                  <SelectItem key={mode} value={mode}>
                    {mode.toUpperCase()}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="flex-1 min-w-74">
              {colorMode === 'hex' ? (
                <HexInput value={value} setValue={setValue} noLabel />
              ) : colorMode === 'rgb' ? (
                <RGBInput value={value} setValue={setValue} noLabel />
              ) : (
                <HSVInput value={value} setValue={setValue} noLabel />
              )}
            </div>
          </div>

          {!!recentColors.length && (
            <div className="flex flex-col gap-2">
              <p className="text-sm text-muted-foreground">Recent Colors:</p>

              <div className="flex flex-wrap gap-2">
                {recentColors.map((c) => (
                  <button
                    key={c}
                    type="button"
                    className="size-5 rounded-xs cursor-pointer shadow-xs border"
                    style={{ backgroundColor: c }}
                    onClick={() => setValue(ColorService.convert('hex', c))}
                  />
                ))}
              </div>
            </div>
          )}
        </PopoverContent>
      </Popover>
    </div>
  );
};
