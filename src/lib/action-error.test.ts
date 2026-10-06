import { describe, expect, it } from 'vitest';
import { isActionError } from './action-error';

describe('isActionError', () => {
  it('recognizes curated validation errors and unexpected errors', () => {
    expect(
      isActionError({
        error: true,
        kind: 'validation',
        code: 'INVALID_JSON',
        message: 'Input is not valid JSON. Error near line 2, column 3.',
        location: { line: 2, column: 3 },
      })
    ).toBe(true);
    expect(
      isActionError({
        error: true,
        kind: 'unexpected',
        message: 'Unable to convert input. Please check your input and try again.',
        referenceId: 'reference-123',
      })
    ).toBe(true);
  });

  it('rejects unknown validation codes, unsafe locations, and empty references', () => {
    expect(
      isActionError({ error: true, kind: 'validation', code: 'toString', message: 'unsafe' })
    ).toBe(false);
    expect(
      isActionError({
        error: true,
        kind: 'validation',
        code: 'INVALID_JSON',
        message: 'unsafe',
        location: { line: '2', column: 3 },
      })
    ).toBe(false);
    expect(
      isActionError({
        error: true,
        kind: 'unexpected',
        message: 'generic',
        referenceId: '',
      })
    ).toBe(false);
  });
});
