'use client';

import { ColorService, IColor } from 'react-color-palette';
import { Input } from '../ui/input';
import { useEffect, useState } from 'react';
import tinyColor from 'tinycolor2';
import { ColorInputWrapper } from './color-input-wrapper';
import { stringToHexColor } from './utils';

export interface HexInputProps {
  value: IColor;
  setValue: (color: IColor) => void;
  noLabel?: boolean;
}

export const HexInput: React.FC<HexInputProps> = ({ value, setValue, noLabel }) => {
  const [color, setColor] = useState(value.hex);
  const [error, setError] = useState(false);

  const onColorChange = (value: string) => {
    let finalValue = value;

    if (finalValue && !finalValue.startsWith('#')) finalValue = `#${finalValue}`;

    const hasError = !tinyColor(finalValue).isValid() || !stringToHexColor(finalValue);

    if (hasError) {
      setColor(finalValue);

      setError(hasError);
    } else {
      setValue(ColorService.convert('hex', finalValue));
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setColor(value.hex);
    setError(false);
  }, [value.hex]);

  return (
    <ColorInputWrapper
      id="color-picker-hex"
      label={noLabel ? '' : 'HEX'}
      error={error}
      value={value}
      setValue={setValue}
      colorMode="hex"
    >
      <Input
        id="color-picker-hex"
        placeholder="#RRGGBB or #RGB"
        pattern="^#?([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6}|[0-9A-Fa-f]{8})$"
        maxLength={9}
        type="text"
        value={color}
        onChange={(e) => onColorChange(e.target.value.trim())}
        onBlur={() => !error && setValue(ColorService.convert('hex', color))}
      />
    </ColorInputWrapper>
  );
};
