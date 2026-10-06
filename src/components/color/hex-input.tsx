'use client';

import { ColorService, IColor } from 'react-color-palette';
import { Input } from '../ui/input';
import { ColorInputWrapper } from './color-input-wrapper';
import { stringToHexColor } from './utils';
import { useColorInput } from './_hooks/use-color-input';

export type HexInputProps = {
  value: IColor;
  setValue: (color: IColor) => void;
  noLabel?: boolean;
};

export const HexInput: React.FC<HexInputProps> = ({ value, setValue, noLabel }) => {
  const { color, applyChange, error } = useColorInput(
    value.hex,
    value.hex,
    (hex) => stringToHexColor(hex) !== null
  );

  const onColorChange = (value: string) => {
    let finalValue = value;
    if (finalValue && !finalValue.startsWith('#')) finalValue = `#${finalValue}`;
    const hasError = applyChange(finalValue);
    if (!hasError) setValue(ColorService.convert('hex', finalValue));
  };

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
        data-testid="hex-input"
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
