import { describe, expect, it, vi } from 'vitest';
import { ActionValidationError } from '@/lib/action-error';
import { safeAction } from './safe-action';

describe('safeAction', () => {
  it('returns the result of a successful action', async () => {
    expect(await safeAction(async () => 'converted')).toBe('converted');
  });

  it('returns curated validation errors without logging', async () => {
    const log = vi.spyOn(console, 'error').mockImplementation(() => {});

    try {
      const result = await safeAction(async () => {
        throw new ActionValidationError('INVALID_JSON', { line: 2, column: 4 });
      });

      expect(result).toEqual({
        error: true,
        kind: 'validation',
        code: 'INVALID_JSON',
        message: 'Input is not valid JSON. Error near line 2, column 4.',
        location: { line: 2, column: 4 },
      });
      expect(log).not.toHaveBeenCalled();
    } finally {
      log.mockRestore();
    }
  });

  it('returns a generic reference for unexpected errors and logs no error message', async () => {
    const log = vi.spyOn(console, 'error').mockImplementation(() => {});
    const privateDetail = 'private path and submitted input';

    try {
      const error = Object.assign(new Error(privateDetail), { code: 'ERR_TEST_FAILURE' });
      const result = await safeAction(async () => {
        throw error;
      });

      expect(result).toMatchObject({
        error: true,
        kind: 'unexpected',
        message: 'Unable to convert input. Please check your input and try again.',
      });
      expect(result).toHaveProperty('referenceId');
      expect(JSON.stringify(result)).not.toContain(privateDetail);
      expect(log).toHaveBeenCalledOnce();
      expect(log.mock.calls[0]?.[1]).toMatchObject({
        errorName: 'Error',
        errorCode: 'ERR_TEST_FAILURE',
      });
      expect(JSON.stringify(log.mock.calls)).not.toContain(privateDetail);
      expect(JSON.stringify(log.mock.calls)).not.toContain('Error:');
    } finally {
      log.mockRestore();
    }
  });

  it('handles non-Error thrown values without exposing them', async () => {
    const log = vi.spyOn(console, 'error').mockImplementation(() => {});
    const privateDetail = 'private thrown value';

    try {
      const result = await safeAction(async () => {
        throw privateDetail;
      });

      expect(result).toMatchObject({ error: true, kind: 'unexpected' });
      expect(JSON.stringify(result)).not.toContain(privateDetail);
      expect(log).toHaveBeenCalledOnce();
      expect(JSON.stringify(log.mock.calls)).not.toContain(privateDetail);
    } finally {
      log.mockRestore();
    }
  });
});
