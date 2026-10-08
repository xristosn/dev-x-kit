'use client';

import { Input } from '../ui/input';
import { ColorInputWrapper } from './color-input-wrapper';
import { colorToString, parseColor, stringToHexColor } from './utils';
import { useColorInput } from './_hooks/use-color-input';

export type HexInputProps = {
  value: string;
  setValue: (color: string) => void;
  noLabel?: boolean;
};

export const HexInput: React.FC<HexInputProps> = ({ value, setValue, noLabel }) => {
  const hexValue = colorToString(value, 'hex');
  const { color, applyChange, error } = useColorInput(
    hexValue,
    hexValue,
    (hex) => stringToHexColor(hex) !== null
  );

  const onColorChange = (next: string) => {
    let finalValue = next;
    if (finalValue && !finalValue.startsWith('#')) finalValue = `#${finalValue}`;
    if (!applyChange(finalValue)) {
      const parsed = parseColor(finalValue);
      if (parsed) setValue(parsed.to('srgb').toString({ format: 'hex', inGamut: true }));
    }
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
      />
    </ColorInputWrapper>
  );
};
