'use client';

import { AlertTriangle } from 'lucide-react';
import { Label } from '../ui/label';
import { Button } from '../ui/button';
import { CopyIconButton } from '../copy-button';
import { ColorService, IColor } from 'react-color-palette';
import { colorToString, stringToHexColor, stringToHsvColor, stringToRgbColor } from './utils';

export interface ColorInputWrapperProps extends React.PropsWithChildren {
  id: string;
  label: string;
  error: boolean;
  value: IColor;
  setValue: (color: IColor) => void;
  colorMode: 'rgb' | 'hex' | 'hsv';
}

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

    const data = e.clipboardData.getData('text/plain');

    if (!data?.trim()) return;

    const hexColor = stringToHexColor(data);
    if (hexColor) {
      return setValue(ColorService.convert('hex', hexColor));
    }

    const rgbColor = stringToRgbColor(data);
    if (rgbColor) {
      return setValue(ColorService.convert('rgb', rgbColor));
    }

    const hsvColor = stringToHsvColor(data);
    if (hsvColor) {
      return setValue(ColorService.convert('hsv', hsvColor));
    }
  };

  return (
    <div className="grid w-full items-center gap-2" onPaste={onPaste}>
      {label && (
        <div className="flex gap-4 items-center justify-between">
          <Label htmlFor={id}>{label}</Label>

          <div className="flex gap-2">
            <CopyIconButton
              variant="outline"
              className="size-6"
              value={colorToString(value, colorMode)}
            />

            {error && (
              <Button
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
