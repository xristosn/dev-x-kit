'use client';

import { ColorService, IColor } from 'react-color-palette';
import { Input } from '../ui/input';
import { useEffect, useState } from 'react';
import tinyColor from 'tinycolor2';
import { ColorInputWrapper } from './color-input-wrapper';
import { IColorHsv } from './utils';

export interface RGBInputProps {
  value: IColor;
  setValue: (color: IColor) => void;
  noLabel?: boolean;
  disableAlpha?: boolean;
}

export const HSVInput: React.FC<RGBInputProps> = ({ value, setValue, noLabel, disableAlpha }) => {
  const [color, setColor] = useState(value.hsv);
  const [error, setError] = useState(false);

  const onColorChange = (prop: keyof IColorHsv, value: string) => {
    let finalValue = Number(value);
    const max = prop === 'h' ? 360 : 100;

    if (finalValue > max) finalValue = max;

    const updatedColor = { ...color, [prop]: finalValue };

    const hasError = !tinyColor(updatedColor).isValid();

    if (hasError) {
      setColor(updatedColor);
      setError(hasError);
    } else {
      setValue(ColorService.convert('hsv', updatedColor));
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setColor(value.hsv);
    setError(false);
  }, [value.hsv]);

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
          type="number"
          min={0}
          max={360}
          pattern="^[0-9]*$"
          placeholder="Hue"
          value={Math.round(color.h).toString()}
          onChange={(e) => onColorChange('h', e.target.value)}
        />
        <Input
          type="number"
          min={0}
          max={100}
          pattern="^[0-9]*$"
          placeholder="Saturation"
          value={Math.round(color.s).toString()}
          onChange={(e) => onColorChange('s', e.target.value)}
        />
        <Input
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
