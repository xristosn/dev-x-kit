import { toast } from 'sonner';
import { isActionError } from '@/lib/action-error';
import type { CodeSplitViewProps } from './code-split-view-types';

export const convertInput = async (
  converter: NonNullable<CodeSplitViewProps['converter']>,
  input: string,
  options: Record<string, unknown>
) => {
  const result = await converter(input, options);

  if (isActionError(result)) throw result;

  return result;
};

export const showConversionError = (error: unknown) => {
  const description = isActionError(error)
    ? error.message
    : 'Something went wrong while converting the input.';

  if (isActionError(error) && error.kind === 'unexpected') {
    console.error('[Conversion Failed] Reference ID:', error.referenceId);
  }

  toast.error('Conversion Failed', {
    description,
    dismissible: false,
    duration: Infinity,
  });
};
