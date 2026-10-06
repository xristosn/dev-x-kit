'use client';

import { ColorService, IColor } from 'react-color-palette';
import { Input } from '../ui/input';
import { ColorInputWrapper } from './color-input-wrapper';
import { IColorRgb } from './utils';
import { useColorInput } from './_hooks/use-color-input';

const isValidRgbColor = ({ r, g, b, a }: IColorRgb) =>
  [r, g, b].every((value) => Number.isFinite(value) && value >= 0 && value <= 255) &&
  Number.isFinite(a) &&
  a >= 0 &&
  a <= 1;

export type RGBInputProps = {
  value: IColor;
  setValue: (color: IColor) => void;
  noLabel?: boolean;
  disableAlpha?: boolean;
};

export const RGBInput: React.FC<RGBInputProps> = ({ value, setValue, noLabel, disableAlpha }) => {
  const { color, applyChange, error } = useColorInput(value.rgb, value.rgb, isValidRgbColor);

  const onColorChange = (prop: keyof IColorRgb, value: string) => {
    let finalValue = Number(value);
    if (finalValue > 255) finalValue = 255;
    const updatedColor = { ...color, [prop]: finalValue };
    const hasError = applyChange(updatedColor);
    if (!hasError) setValue(ColorService.convert('rgb', updatedColor));
  };

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
          data-testid="rgb-input-r"
          value={Math.round(color.r).toString()}
          onChange={(e) => onColorChange('r', e.target.value)}
        />
        <Input
          type="number"
          min={0}
          max={255}
          pattern="^[0-9]*$"
          placeholder="Green"
          data-testid="rgb-input-g"
          value={Math.round(color.g).toString()}
          onChange={(e) => onColorChange('g', e.target.value)}
        />
        <Input
          type="number"
          min={0}
          max={255}
          pattern="^[0-9]*$"
          placeholder="Blue"
          data-testid="rgb-input-b"
          value={Math.round(color.b).toString()}
          onChange={(e) => onColorChange('b', e.target.value)}
        />
        {!disableAlpha && (
          <Input
            data-testid="rgb-input-a"
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
