'use client';

import { ClientOnly } from '@/components/client-only';
import { HexInput } from '@/components/color/hex-input';
import { HSVInput } from '@/components/color/hsv-input';
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
import { ColorPicker, ColorService, IColor } from 'react-color-palette';
import 'react-color-palette/css';
import { Direction, DIRECTIONS, getTriangleStyle } from './utils';
import { CodeDisplay, CodeDisplayPreset } from '@/components/code-display';
import { InputWrapper } from '@/components/input-wrapper';

interface Options {
  direction: Direction;
  width: number;
  height: number;
  color: IColor;
}

const DEFAULT_VALUE: Options = {
  direction: 'Right',
  width: 200,
  height: 200,
  color: ColorService.convert('hex', '#4a94e2'),
};

export const CSSTriangle: React.FC = () => {
  const [value, setValue] = useWebStorage('css-triangle', 'infer', DEFAULT_VALUE);
  const triangleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (triangleRef.current) {
      const style = getTriangleStyle(value.direction, value.width, value.height, value.color);
      triangleRef.current.style.borderWidth = style.borderWidth;
      triangleRef.current.style.borderColor = style.borderColor;
    }
  }, [value]);

  return (
    <>
      <div className="bg-card shadow-sm p-4 rounded-xl flex flex-col gap-2">
        <ClientOnly fallback={<Skeleton className="h-60" />}>
          <ColorPicker
            color={value.color}
            onChange={(c) => setValue((p) => ({ ...p, color: c }))}
            hideInput
          />
        </ClientOnly>

        <HexInput value={value.color} setValue={(c) => setValue((p) => ({ ...p, color: c }))} />
        <RGBInput value={value.color} setValue={(c) => setValue((p) => ({ ...p, color: c }))} />
        <HSVInput value={value.color} setValue={(c) => setValue((p) => ({ ...p, color: c }))} />
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
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Direction" id="css-triangle-dir" />
              </SelectTrigger>
              <SelectContent>
                {DIRECTIONS.map((dir) => (
                  <SelectItem key={dir} value={dir}>
                    {dir}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </InputWrapper>

          <InputWrapper label="Width" id="css-triangle-width" className="w-full">
            <Input
              id="css-triangle-width"
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
            <div className="h-8 w-full rounded-md" style={{ backgroundColor: value.color.hex }} />
          </ClientOnly>
        </div>
      </div>

      <div className="bg-card shadow-sm p-4 rounded-xl flex flex-col gap-4 items-center">
        <p className="text-lg w-full">Preview</p>

        <div className="flex items-center justify-center max-w-full w-full min-w-0 max-h-60 min-h-50 overflow-auto">
          <div ref={triangleRef} className="w-0 h-0 border-solid border-80" />
        </div>
      </div>

      <CodeDisplay
        code={`const styles = ${JSON.stringify(
          getTriangleStyle(value.direction, value.width, value.height, value.color),
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
