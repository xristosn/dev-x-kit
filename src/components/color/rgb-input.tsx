'use client';

import { Input } from '../ui/input';
import { ColorInputWrapper } from './color-input-wrapper';
import { colorFromChannels, getColorChannels, IColorRgb } from './utils';
import { useColorInput } from './_hooks/use-color-input';

const isValidRgbColor = ({ r, g, b, a }: IColorRgb) =>
  [r, g, b].every((value) => Number.isFinite(value) && value >= 0 && value <= 255) &&
  Number.isFinite(a) &&
  a >= 0 &&
  a <= 1;

export type RGBInputProps = {
  value: string;
  setValue: (color: string) => void;
  noLabel?: boolean;
  disableAlpha?: boolean;
};

function toRgb(value: string): IColorRgb {
  const channels = getColorChannels(value, 'srgb');
  const coords = channels?.coords ?? [0, 0, 0];
  const clamp = (channel: number | null) => Math.max(0, Math.min(255, (channel ?? 0) * 255));
  return { r: clamp(coords[0]), g: clamp(coords[1]), b: clamp(coords[2]), a: channels?.alpha ?? 1 };
}

export const RGBInput: React.FC<RGBInputProps> = ({ value, setValue, noLabel, disableAlpha }) => {
  const initial = toRgb(value);
  const { color, applyChange, error } = useColorInput(initial, initial, isValidRgbColor);

  const onColorChange = (prop: keyof IColorRgb, raw: string) => {
    let next = Number(raw);
    if (prop !== 'a' && next > 255) next = 255;
    if (prop === 'a' && next > 1) next = 1;
    const updated = { ...color, [prop]: next };
    if (!applyChange(updated)) {
      setValue(
        colorFromChannels('srgb', [updated.r / 255, updated.g / 255, updated.b / 255], updated.a)
      );
    }
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
      <div className="flex gap-1">
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
            pattern="^(0(\\.[0-9]{1,2})?|1(\\.0{1,2})?)$"
            placeholder="Alpha"
            value={Number(color.a.toFixed(2)).toString()}
            onChange={(e) => onColorChange('a', e.target.value)}
          />
        )}
      </div>
    </ColorInputWrapper>
  );
};
