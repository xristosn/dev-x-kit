'use client';

import { ClientOnly } from '@/components/client-only';
import { HexInput } from '@/components/color/hex-input';
import { HSVInput } from '@/components/color/hsv-input';
import { RGBInput } from '@/components/color/rgb-input';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
import { Direction, DIRECTIONS, getTriangleCss, getTriangleStyle } from './utils';
import { CopyIconButton } from '@/components/copy-button';

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
  const css = getTriangleCss(value.direction, value.width, value.height, value.color);

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

      <div className="bg-card shadow-sm p-4 rounded-xl flex gap-6">
        <InputWrapper label="Direction" id="css-triangle-dir">
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

        <InputWrapper label="Width" id="css-triangle-width">
          <Input
            id="css-triangle-width"
            type="number"
            min={1}
            max={999}
            value={value.width.toString()}
            onChange={(e) => setValue((p) => ({ ...p, width: Number(e.target.value) }))}
          />
        </InputWrapper>

        <InputWrapper label="Height" id="css-triangle-height">
          <Input
            id="css-triangle-height"
            type="number"
            min={1}
            max={999}
            value={value.height.toString()}
            onChange={(e) => setValue((p) => ({ ...p, height: Number(e.target.value) }))}
          />
        </InputWrapper>

        <div className="grid w-full items-center gap-1">
          <p className="text-sm cursor-default select-none">Color Preview</p>
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

      <div className="bg-card shadow-sm p-4 rounded-xl flex flex-col gap-4 items-center">
        <p className="text-lg w-full">CSS</p>

        <ClientOnly fallback={<Skeleton className="w-full h-40" />}>
          <code className="p-2 pr-8 whitespace-pre-wrap relative bg-muted rounded-md w-full h-full">
            {css}

            <CopyIconButton
              value={css}
              variant="outline"
              size="icon-sm"
              className="absolute top-2 right-2"
            />
          </code>
        </ClientOnly>
      </div>
    </>
  );
};

function InputWrapper({
  label,
  id,
  children,
}: {
  label: string;
  id: string;
  children: React.ReactNode;
}) {
  return (
    <div className="grid w-full items-center gap-2">
      <Label htmlFor={id}>{label}</Label>
      {children}
    </div>
  );
}
