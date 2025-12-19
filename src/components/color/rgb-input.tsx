'use client';

import { ColorService, IColor } from 'react-color-palette';
import { Input } from '../ui/input';
import { useEffect, useState } from 'react';
import tinyColor from 'tinycolor2';
import { ColorInputWrapper } from './color-input-wrapper';
import { IColorRgb } from './utils';

export interface RGBInputProps {
  value: IColor;
  setValue: (color: IColor) => void;
  noLabel?: boolean;
}

export const RGBInput: React.FC<RGBInputProps> = ({ value, setValue, noLabel }) => {
  const [color, setColor] = useState(value.rgb);
  const [error, setError] = useState(false);

  const onColorChange = (prop: keyof IColorRgb, value: string) => {
    let finalValue = Number(value);

    if (finalValue > 255) finalValue = 255;

    const updatedColor = { ...color, [prop]: finalValue };

    const hasError = !tinyColor(updatedColor).isValid();

    if (hasError) {
      setColor(updatedColor);

      setError(hasError);
    } else {
      setValue(ColorService.convert('rgb', updatedColor));
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setColor(value.rgb);
    setError(false);
  }, [value.rgb]);

  return (
    <ColorInputWrapper
      id="color-picker-rgb"
      label={noLabel ? '' : 'RGB'}
      error={error}
      value={value}
      setValue={setValue}
      colorMode="rgb"
    >
      <div className="flex gap-1" onBlur={() => setValue(ColorService.convert('rgb', color))}>
        <Input
          type="number"
          min={0}
          max={255}
          pattern="^[0-9]*$"
          placeholder="Red"
          value={Math.round(color.r).toString()}
          onChange={(e) => onColorChange('r', e.target.value)}
        />
        <Input
          type="number"
          min={0}
          max={255}
          pattern="^[0-9]*$"
          placeholder="Green"
          value={Math.round(color.g).toString()}
          onChange={(e) => onColorChange('g', e.target.value)}
        />
        <Input
          type="number"
          min={0}
          max={255}
          pattern="^[0-9]*$"
          placeholder="Blue"
          value={Math.round(color.b).toString()}
          onChange={(e) => onColorChange('b', e.target.value)}
        />
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
      </div>
    </ColorInputWrapper>
  );
};
