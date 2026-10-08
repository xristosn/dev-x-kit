'use client';

import { AlertTriangle } from 'lucide-react';
import { Label } from '../ui/label';
import { Button } from '../ui/button';
import { CopyIconButton } from '../copy-button';
import {
  colorFromChannels,
  colorToString,
  isValidColor,
  stringToHexColor,
  stringToHsvColor,
} from './utils';

export type ColorInputWrapperProps = React.PropsWithChildren & {
  id: string;
  label: string;
  error: boolean;
  value: string;
  setValue: (color: string) => void;
  colorMode: 'rgb' | 'hex' | 'hsv' | 'oklch' | 'oklab';
};

export const ColorInputWrapper: React.FC<ColorInputWrapperProps> = ({
  id,
  label,
  error,
  children,
  colorMode,
  value,
  setValue,
}) => {
  const onPaste = (e: React.ClipboardEvent<HTMLDivElement>) => {
    e.preventDefault();
    const data = e.clipboardData.getData('text/plain').trim();
    if (!data) return;

    const hexColor = stringToHexColor(data);
    if (hexColor) return setValue(hexColor);

    const hsvColor = stringToHsvColor(data);
    if (hsvColor) {
      return setValue(colorFromChannels('hsv', [hsvColor.h, hsvColor.s, hsvColor.v], hsvColor.a));
    }

    if (isValidColor(data)) setValue(data);
  };

  return (
    <div className="grid w-full items-center gap-2" onPaste={onPaste}>
      {label && (
        <div className="flex gap-4 items-center justify-between">
          <Label data-testid={`${colorMode}-input-label`} htmlFor={id}>
            {label}
          </Label>

          <div className="flex gap-2">
            <CopyIconButton
              variant="outline"
              className="size-6"
              value={colorToString(value, colorMode)}
            />

            {error && (
              <Button
                data-testid="hex-error-btn"
                size="icon-sm"
                variant="outline"
                className="size-6 text-destructive hover:text-destructive"
              >
                <AlertTriangle />
              </Button>
            )}
          </div>
        </div>
      )}

      {children}
    </div>
  );
};
