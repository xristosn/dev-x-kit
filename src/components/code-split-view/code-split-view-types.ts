import type { CreateConvertOptionsResult } from '@/lib/create-convert-options';
import type { ActionError } from '@/lib/action-error';
import type { DebouncedFunc } from 'lodash-es';

export type ConverterResult = string | ActionError;
export type ConvertCallback = DebouncedFunc<(noLoader?: boolean) => Promise<void>>;

export type CodeSplitViewProps = {
  input: {
    label: string;
    language: string;
    defaultValue?: string;
  };

  output: {
    label: string;
    language: string;
    sourceUrl?: string;
    element?: (props: { inputValue: string; convert: ConvertCallback }) => React.ReactNode;
  };

  converter?: (
    input: string,
    options: Record<string, unknown>
  ) => ConverterResult | Promise<ConverterResult>;

  options?: CreateConvertOptionsResult;
};
