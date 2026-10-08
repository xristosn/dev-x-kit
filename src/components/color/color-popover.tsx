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
import { OkColorInput } from './ok-color-input';
import { ColorMode, colorToString } from './utils';
import { ClientOnly } from '../client-only';
import { Skeleton } from '../ui/skeleton';
import { useWebStorage } from '@/hooks/use-web-storage';
import { uniq } from 'lodash-es';

export type ColorPopoverProps = {
  value: string;
  setValue: React.Dispatch<React.SetStateAction<string>>;
  id?: string;
  label?: string;
  disableAlpha?: boolean;
  defaultMode?: ColorMode;
};

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
  const colorChanged = useRef(false);

  useEffect(() => {
    if (open) {
      colorChanged.current = false;
      return;
    }

    if (!colorChanged.current) return;
    setRecentColors((previous) => uniq([value, ...previous]).slice(0, 20));
    colorChanged.current = false;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const pickerColor = ColorService.convert('hex', colorToString(value, 'hex'));
  const onPickerChange = (picked: IColor) => {
    setValue(colorToString(picked.hex, colorMode));
  };

  return (
    <div className="grid w-full items-center gap-2 not-disabled:cursor-pointer">
      {label && (
        <Label data-testid="color-popover-label" htmlFor={triggerId || `color-popover-${id}`}>
          {label}
        </Label>
      )}

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger>
          <div className="relative">
            <ClientOnly
              fallback={<Skeleton className="absolute top-1.5 left-2 size-6 rounded-sm" />}
            >
              <div
                data-testid="color-popover-preview"
                className="absolute top-1.5 left-2 size-6 rounded-sm"
                style={{ backgroundColor: value }}
              />
            </ClientOnly>

            <Input
              data-testid="color-popover-input"
              id={triggerId || `color-popover-${id}`}
              type="text"
              readOnly
              className="not-disabled:cursor-pointer pl-10"
              value={colorToString(value, colorMode)}
            />
          </div>
        </PopoverTrigger>

        <PopoverContent
          data-testid="color-popover-content"
          className="flex flex-col gap-2 w-104 max-w-dvw"
        >
          <ColorPicker
            color={pickerColor}
            onChange={onPickerChange}
            hideInput
            onChangeComplete={() => (colorChanged.current = true)}
            hideAlpha={disableAlpha}
          />

          <div className="flex flex-wrap gap-1">
            <Select value={colorMode} onValueChange={(mode) => setColorMode(mode as ColorMode)}>
              <SelectTrigger data-testid="color-mode-select" className="w-20 flex-1">
                <SelectValue placeholder="Color Mode" />
              </SelectTrigger>
              <SelectContent>
                {(['hex', 'rgb', 'hsv', 'oklch', 'oklab'] as const).map((mode) => (
                  <SelectItem data-testid={`color-mode-${mode}`} key={mode} value={mode}>
                    {mode.toUpperCase()}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="flex-1 min-w-74">
              {colorMode === 'hex' ? (
                <HexInput value={value} setValue={setValue} noLabel />
              ) : colorMode === 'rgb' ? (
                <RGBInput value={value} setValue={setValue} noLabel disableAlpha={disableAlpha} />
              ) : colorMode === 'hsv' ? (
                <HSVInput value={value} setValue={setValue} noLabel disableAlpha={disableAlpha} />
              ) : (
                <OkColorInput
                  value={value}
                  setValue={setValue}
                  space={colorMode}
                  noLabel
                  disableAlpha={disableAlpha}
                />
              )}
            </div>
          </div>

          {!!recentColors.length && (
            <div className="flex flex-col gap-2">
              <p className="text-sm text-muted-foreground">Recent Colors:</p>
              <div data-testid="color-popover-recent-colors" className="flex flex-wrap gap-2">
                {recentColors.map((recentColor) => (
                  <button
                    key={recentColor}
                    data-testid={`color-popover-recent-color-${recentColor
                      .replace(/[^a-z0-9]/gi, '')
                      .toLowerCase()}`}
                    type="button"
                    className="size-5 rounded-xs cursor-pointer shadow-xs border"
                    style={{ backgroundColor: recentColor }}
                    onClick={() => setValue(recentColor)}
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
