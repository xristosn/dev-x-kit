'use client';

import { ColorService, IColor } from 'react-color-palette';
import { Input } from '../ui/input';
import { ColorInputWrapper } from './color-input-wrapper';
import { IColorHsv } from './utils';
import { useColorInput } from './_hooks/use-color-input';

const isValidHsvColor = ({ h, s, v, a }: IColorHsv) =>
  Number.isFinite(h) &&
  h >= 0 &&
  h <= 360 &&
  [s, v].every((value) => Number.isFinite(value) && value >= 0 && value <= 100) &&
  Number.isFinite(a) &&
  a >= 0 &&
  a <= 1;

export type HSVInputProps = {
  value: IColor;
  setValue: (color: IColor) => void;
  noLabel?: boolean;
  disableAlpha?: boolean;
};

export const HSVInput: React.FC<HSVInputProps> = ({ value, setValue, noLabel, disableAlpha }) => {
  const { color, applyChange, error } = useColorInput(value.hsv, value.hsv, isValidHsvColor);

  const onColorChange = (prop: keyof IColorHsv, value: string) => {
    let finalValue = Number(value);
    const max = prop === 'h' ? 360 : 100;
    if (finalValue > max) finalValue = max;
    const updatedColor = { ...color, [prop]: finalValue };
    const hasError = applyChange(updatedColor);
    if (!hasError) setValue(ColorService.convert('hsv', updatedColor));
  };

  return (
    <ColorInputWrapper
      id="color-picker-hsv"
      label={noLabel ? '' : 'HSV'}
      error={error}
      value={value}
      setValue={setValue}
      colorMode="hsv"
    >
      <div className="flex gap-1" onBlur={() => setValue(ColorService.convert('hsv', color))}>
        <Input
          data-testid="hsv-input-h"
          type="number"
          min={0}
          max={360}
          pattern="^[0-9]*$"
          placeholder="Hue"
          value={Math.round(color.h).toString()}
          onChange={(e) => onColorChange('h', e.target.value)}
        />
        <Input
          data-testid="hsv-input-s"
          type="number"
          min={0}
          max={100}
          pattern="^[0-9]*$"
          placeholder="Saturation"
          value={Math.round(color.s).toString()}
          onChange={(e) => onColorChange('s', e.target.value)}
        />
        <Input
          data-testid="hsv-input-v"
          type="number"
          min={0}
          max={100}
          pattern="^[0-9]*$"
          placeholder="Brightness"
          value={Math.round(color.v).toString()}
          onChange={(e) => onColorChange('v', e.target.value)}
        />
        {!disableAlpha && (
          <Input
            data-testid="hsv-input-a"
            type="number"
            min={0}
            max={1}
            step={0.1}
            pattern="^(0(\.[0-9]{1,2})?|1(\.0{1,2})?)$"
            placeholder="Alpha"
            value={Number(color.a.toFixed(2)).toString()}
            onChange={(e) => onColorChange('a', e.target.value)}
          />
        )}
      </div>
    </ColorInputWrapper>
  );
};
