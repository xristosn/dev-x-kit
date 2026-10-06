import { toast } from 'sonner';
import { afterEach, describe, expect, it, vi } from 'vitest';
import type { ActionError } from '@/lib/action-error';
import { convertInput, showConversionError } from './code-split-view-conversion';

describe('code split view conversion errors', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('preserves ActionError values from the server action', async () => {
    const actionError = {
      error: true,
      kind: 'validation',
      code: 'INVALID_JSON',
      message: 'Input is not valid JSON.',
    } satisfies ActionError;

    await expect(convertInput(async () => actionError, 'bad input', {})).rejects.toEqual(
      actionError
    );
  });

  it('shows curated validation messages without a reference ID', () => {
    const toastError = vi.spyOn(toast, 'error').mockImplementation(() => 'toast-id');
    const actionError = {
      error: true,
      kind: 'validation',
      code: 'INVALID_JSON',
      message: 'Input is not valid JSON.',
    } satisfies ActionError;

    showConversionError(actionError);

    expect(toastError).toHaveBeenCalledWith(
      'Conversion Failed',
      expect.objectContaining({ description: actionError.message })
    );
  });

  it('shows a generic message and logs the reference ID for unexpected server errors', () => {
    const toastError = vi.spyOn(toast, 'error').mockImplementation(() => 'toast-id');
    const logError = vi.spyOn(console, 'error').mockImplementation(() => {});
    const actionError = {
      error: true,
      kind: 'unexpected',
      message: 'Unable to convert input. Please check your input and try again.',
      referenceId: 'error-reference-123',
    } satisfies ActionError;

    showConversionError(actionError);

    expect(toastError).toHaveBeenCalledWith(
      'Conversion Failed',
      expect.objectContaining({ description: actionError.message })
    );
    expect(JSON.stringify(toastError.mock.calls)).not.toContain(actionError.referenceId);
    expect(logError).toHaveBeenCalledWith(
      '[Conversion Failed] Reference ID:',
      actionError.referenceId
    );
  });

  it('does not show arbitrary exception details from the client', () => {
    const toastError = vi.spyOn(toast, 'error').mockImplementation(() => 'toast-id');

    showConversionError(new Error('private internal detail'));

    expect(toastError).toHaveBeenCalledWith(
      'Conversion Failed',
      expect.objectContaining({
        description: 'Something went wrong while converting the input.',
      })
    );
    expect(JSON.stringify(toastError.mock.calls)).not.toContain('private internal detail');
  });
});
