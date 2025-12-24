'use client';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Container } from '@/components/container';
import {
  DataSizeType,
  DATA_SIZE_TYPES,
  convertDataSize,
  DEFAULT_DATA_SIZE_STORE_VALUE,
} from './utils';
import { useWebStorage } from '@/hooks/use-web-storage';
import { Input } from '@/components/ui/input';
import { InputWrapper } from '@/components/input-wrapper';
import { Switch } from '@/components/ui/switch';
import { CopyIconButton } from '@/components/copy-button';
import { ClientOnly } from '@/components/client-only';

export default function DataSizeConverter() {
  const [value, setValue] = useWebStorage(
    'data-size-convert',
    'infer',
    DEFAULT_DATA_SIZE_STORE_VALUE
  );

  return (
    <Container>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 p-4 rounded-xl bg-card shadow-md">
        <InputWrapper label="Convert">
          <Select
            value={value.type}
            onValueChange={(v) => setValue((p) => ({ ...p, type: v as DataSizeType }))}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Convert" className="w-full" />
            </SelectTrigger>
            <SelectContent>
              {DATA_SIZE_TYPES.map((size) => (
                <SelectItem key={size.value} value={size.value}>
                  {size.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </InputWrapper>

        <InputWrapper label="Value" id="size-value">
          <Input
            type="number"
            min={0}
            step={1}
            max={Number.MAX_SAFE_INTEGER}
            id="size-value"
            placeholder="Value"
            value={value.value}
            onChange={(e) =>
              setValue((p) => ({
                ...p,
                value: Math.min(Number.MAX_SAFE_INTEGER, Math.max(0, Number(e.target.value))),
              }))
            }
          />
        </InputWrapper>

        <InputWrapper label="Base" id="size-base">
          <div className="flex items-center space-x-2 mt-2">
            <p
              className="text-muted-foreground cursor-default text-sm"
              onClick={() => setValue((p) => ({ ...p, base: 1000 }))}
            >
              1000
            </p>

            <ClientOnly>
              <Switch
                id="size-base"
                checked={value.base === 1024}
                onCheckedChange={(checked) =>
                  setValue((p) => ({ ...p, base: checked ? 1024 : 1000 }))
                }
              />
            </ClientOnly>

            <p
              className="text-muted-foreground cursor-default text-sm"
              onClick={() => setValue((p) => ({ ...p, base: 1024 }))}
            >
              1024
            </p>
          </div>
        </InputWrapper>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {DATA_SIZE_TYPES.filter((s) => s.value !== value.type).map((size) => (
          <div key={size.value} className="bg-card p-4 rounded-xl shadow-md flex flex-col gap-4">
            <div className="flex gap-4 justify-between items-center">
              <p className="text-xl text-muted-foreground">
                <ClientOnly>{size.label}</ClientOnly>
              </p>

              <CopyIconButton
                value={convertDataSize(value.value, value.type, size.value, value.base).toString()}
                variant="outline"
              />
            </div>

            <p className="text-3xl break-all">
              <ClientOnly>
                {convertDataSize(value.value, value.type, size.value, value.base)}
              </ClientOnly>
            </p>
          </div>
        ))}
      </div>
    </Container>
  );
}
