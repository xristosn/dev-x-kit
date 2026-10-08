'use client';

import { ClientOnly } from '@/components/client-only';
import { HexInput } from '@/components/color/hex-input';
import { HSVInput } from '@/components/color/hsv-input';
import { OkColorInput } from '@/components/color/ok-color-input';
import { RGBInput } from '@/components/color/rgb-input';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { useWebStorage } from '@/hooks/use-web-storage';
import { useEffect, useRef } from 'react';
import { ColorPicker, ColorService } from 'react-color-palette';
import 'react-color-palette/css';
import { Direction, DIRECTIONS, getTriangleStyle } from '../_lib/utils';
import { CodeDisplay, CodeDisplayPreset } from '@/components/code-display';
import { InputWrapper } from '@/components/input-wrapper';

type Options = {
  direction: Direction;
  width: number;
  height: number;
  color: string;
};

const DEFAULT_VALUE: Options = {
  direction: 'Right',
  width: 200,
  height: 200,
  color: '#4a94e2',
};

export const CSSTriangle: React.FC = () => {
  const [value, setValue] = useWebStorage('css-triangle', 'infer', DEFAULT_VALUE);
  const triangleRef = useRef<HTMLDivElement>(null);
  const color = typeof value.color === 'string' ? value.color : DEFAULT_VALUE.color;

  useEffect(() => {
    if (triangleRef.current) {
      const style = getTriangleStyle(value.direction, value.width, value.height, color);
      triangleRef.current.style.borderWidth = style.borderWidth;
      triangleRef.current.style.borderColor = style.borderColor;
    }
  }, [color, value.direction, value.height, value.width]);

  return (
    <>
      <div className="bg-card shadow-sm p-4 rounded-xl flex flex-col gap-2">
        <ClientOnly fallback={<Skeleton className="h-60" />}>
          <ColorPicker
            color={ColorService.convert('hex', color)}
            onChange={(c) => setValue((p) => ({ ...p, color: c.hex }))}
            hideInput
          />
        </ClientOnly>

        <HexInput value={color} setValue={(color) => setValue((p) => ({ ...p, color }))} />
        <RGBInput value={color} setValue={(color) => setValue((p) => ({ ...p, color }))} />
        <HSVInput value={color} setValue={(color) => setValue((p) => ({ ...p, color }))} />
        <OkColorInput
          value={color}
          setValue={(color) => setValue((p) => ({ ...p, color }))}
          space="oklch"
        />
        <OkColorInput
          value={color}
          setValue={(color) => setValue((p) => ({ ...p, color }))}
          space="oklab"
        />
      </div>

      <div className="bg-card shadow-sm p-4 rounded-xl flex gap-6 items-center">
        <div className="flex gap-6 w-full">
          <InputWrapper label="Direction" id="css-triangle-dir" className="w-full">
            <Select
              value={value.direction as string}
              onValueChange={(v) =>
                setValue((p) => ({
                  ...p,
                  direction: v as Direction,
                }))
              }
            >
              <SelectTrigger data-testid="css-triangle-direction" className="w-full">
                <SelectValue placeholder="Direction" id="css-triangle-dir" />
              </SelectTrigger>
              <SelectContent>
                {DIRECTIONS.map((dir) => (
                  <SelectItem
                    key={dir}
                    data-testid={`css-triangle-direction-option-${dir.toLowerCase().replaceAll(' ', '-')}`}
                    value={dir}
                  >
                    {dir}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </InputWrapper>

          <InputWrapper label="Width" id="css-triangle-width" className="w-full">
            <Input
              id="css-triangle-width"
              data-testid="css-triangle-width"
              type="number"
              min={1}
              max={999}
              value={value.width.toString()}
              onChange={(e) => setValue((p) => ({ ...p, width: Number(e.target.value) }))}
            />
          </InputWrapper>

          <InputWrapper label="Height" id="css-triangle-height" className="w-full">
            <Input
              id="css-triangle-height"
              data-testid="css-triangle-height"
              type="number"
              min={1}
              max={999}
              value={value.height.toString()}
              onChange={(e) => setValue((p) => ({ ...p, height: Number(e.target.value) }))}
            />
          </InputWrapper>
        </div>

        <div className="flex flex-col gap-2 w-full">
          <p className="text-sm cursor-default select-none leading-none">Color Preview</p>

          <ClientOnly>
            <div
              data-testid="css-triangle-color-preview"
              className="h-8 w-full rounded-md"
              style={{ backgroundColor: color }}
            />
          </ClientOnly>
        </div>
      </div>

      <div className="bg-card shadow-sm p-4 rounded-xl flex flex-col gap-4 items-center">
        <p className="text-lg w-full">Preview</p>

        <div className="flex items-center justify-center max-w-full w-full min-w-0 max-h-60 min-h-50 overflow-auto">
          <div
            ref={triangleRef}
            data-testid="css-triangle-preview"
            className="w-0 h-0 border-solid border-80"
          />
        </div>
      </div>

      <CodeDisplay
        code={`const styles = ${JSON.stringify(
          getTriangleStyle(value.direction, value.width, value.height, color),
          null,
          2
        )}`}
        outputs={[
          CodeDisplayPreset.JssToCss,
          CodeDisplayPreset.JssToTailwindV3,
          CodeDisplayPreset.Jss,
        ]}
      />
    </>
  );
};
