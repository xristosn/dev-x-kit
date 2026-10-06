'use client';

import { FaqSection, type FaqItem } from '@/components/faq-section';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  DataSizeType,
  DATA_SIZE_TYPES,
  convertDataSize,
  DEFAULT_DATA_SIZE_STORE_VALUE,
} from './_lib/utils';
import { useWebStorage } from '@/hooks/use-web-storage';
import { Input } from '@/components/ui/input';
import { InputWrapper } from '@/components/input-wrapper';
import { Switch } from '@/components/ui/switch';
import { CopyIconButton } from '@/components/copy-button';
import { ClientOnly } from '@/components/client-only';

const FAQS = [
  {
    title: 'When should I use base 1000 or base 1024?',
    description:
      'Base 1000 uses each larger unit as 1,000 of the previous unit, which is common for drive and network capacities. Base 1024 uses 1,024, as in binary-based memory calculations. Choose the base that matches the convention used by the value you are comparing.',
  },
  {
    title: 'Which data-size units can I convert?',
    description:
      'The converter supports bytes, kilobytes, megabytes, gigabytes, terabytes, and petabytes. Select the unit of your input, enter a non-negative value, and the page shows the corresponding values in the other units.',
  },
  {
    title: 'Why is my selected input unit missing from the results?',
    description:
      'The input unit is left out of the result cards because it is the source value. Change the “Convert” selection to see the same amount expressed from a different source unit. Each result card also has a copy action.',
  },
] satisfies readonly FaqItem[];

export default function DataSizeConverter() {
  const [value, setValue] = useWebStorage(
    'data-size-convert',
    'infer',
    DEFAULT_DATA_SIZE_STORE_VALUE
  );

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 p-4 rounded-xl bg-card shadow-md">
        <InputWrapper label="Convert">
          <Select
            value={value.type}
            onValueChange={(v) => setValue((p) => ({ ...p, type: v as DataSizeType }))}
          >
            <SelectTrigger data-testid="data-size-converter-type-trigger" className="w-full">
              <SelectValue placeholder="Convert" className="w-full" />
            </SelectTrigger>
            <SelectContent>
              {DATA_SIZE_TYPES.map((size) => (
                <SelectItem
                  key={size.value}
                  value={size.value}
                  data-testid={`data-size-converter-type-option-${size.value}`}
                >
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
            data-testid="data-size-converter-size-input"
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
                data-testid="data-size-converter-base-switch"
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

            <p
              data-testid={`data-size-converter-output-${size.value}`}
              className="text-3xl break-all"
            >
              <ClientOnly>
                {convertDataSize(value.value, value.type, size.value, value.base)}
              </ClientOnly>
            </p>
          </div>
        ))}
      </div>
      <FaqSection items={FAQS} />
    </>
  );
}
