'use client';

import { Input } from '../ui/input';
import { ColorInputWrapper } from './color-input-wrapper';
import { colorFromChannels, getColorChannels } from './utils';
import { useColorInput } from './_hooks/use-color-input';

type OkColorSpace = 'oklch' | 'oklab';
type OkColorChannels = { lightness: number; second: number; third: number; alpha: number };

function toChannels(value: string, space: OkColorSpace): OkColorChannels {
  const result = getColorChannels(value, space);
  const coords = result?.coords ?? [0, 0, 0];
  return {
    lightness: (coords[0] ?? 0) * 100,
    second: coords[1] ?? 0,
    third: coords[2] ?? 0,
    alpha: result?.alpha ?? 1,
  };
}

function isValidChannels(value: OkColorChannels, space: OkColorSpace): boolean {
  return (
    Number.isFinite(value.lightness) &&
    value.lightness >= 0 &&
    value.lightness <= 100 &&
    Number.isFinite(value.second) &&
    Number.isFinite(value.third) &&
    (space !== 'oklch' || value.second >= 0) &&
    (space !== 'oklch' || (value.third >= 0 && value.third <= 360)) &&
    Number.isFinite(value.alpha) &&
    value.alpha >= 0 &&
    value.alpha <= 1
  );
}

export type OkColorInputProps = {
  value: string;
  setValue: (color: string) => void;
  space: OkColorSpace;
  noLabel?: boolean;
  disableAlpha?: boolean;
};

export const OkColorInput: React.FC<OkColorInputProps> = ({
  value,
  setValue,
  space,
  noLabel,
  disableAlpha,
}) => {
  const initial = toChannels(value, space);
  const { color, applyChange, error } = useColorInput(initial, initial, (next) =>
    isValidChannels(next, space)
  );

  const update = (field: keyof OkColorChannels, raw: string) => {
    const next = { ...color, [field]: Number(raw) };
    if (!applyChange(next)) {
      const coords: [number, number, number] = [next.lightness / 100, next.second, next.third];
      setValue(colorFromChannels(space, coords, next.alpha));
    }
  };

  const isLch = space === 'oklch';
  const fields: {
    key: keyof OkColorChannels;
    testId: string;
    placeholder: string;
    step: number;
  }[] = [
    { key: 'lightness', testId: `${space}-input-l`, placeholder: 'Lightness %', step: 1 },
    {
      key: 'second',
      testId: `${space}-input-${isLch ? 'c' : 'a'}`,
      placeholder: isLch ? 'Chroma' : 'A',
      step: 0.01,
    },
    {
      key: 'third',
      testId: `${space}-input-${isLch ? 'h' : 'b'}`,
      placeholder: isLch ? 'Hue' : 'B',
      step: isLch ? 1 : 0.01,
    },
  ];

  return (
    <ColorInputWrapper
      id={`color-picker-${space}`}
      label={noLabel ? '' : space.toUpperCase()}
      error={error}
      value={value}
      setValue={setValue}
      colorMode={space}
    >
      <div className="flex gap-1">
        {fields.map((field) => (
          <Input
            key={field.key}
            data-testid={field.testId}
            type="number"
            step={field.step}
            min={field.key === 'lightness' ? 0 : isLch && field.key === 'third' ? 0 : undefined}
            max={field.key === 'lightness' ? 100 : isLch && field.key === 'third' ? 360 : undefined}
            placeholder={field.placeholder}
            value={Number(color[field.key].toFixed(4)).toString()}
            onChange={(e) => update(field.key, e.target.value)}
          />
        ))}
        {!disableAlpha && (
          <Input
            data-testid={`${space}-input-alpha`}
            type="number"
            min={0}
            max={1}
            step={0.01}
            placeholder="Alpha"
            value={Number(color.alpha.toFixed(2)).toString()}
            onChange={(e) => update('alpha', e.target.value)}
          />
        )}
      </div>
    </ColorInputWrapper>
  );
};
