import { describe, expect, it } from 'vitest';
import { convertDataSize, DataSizeType } from './utils';

describe('convertDataSize', () => {
  it('converts between adjacent units using the default binary base', () => {
    expect(convertDataSize(1, DataSizeType.MB, DataSizeType.KB)).toBe(1024);
    expect(convertDataSize(1, DataSizeType.KB, DataSizeType.MB)).toBe(0.0009765625);
  });

  it('converts across multiple units using the decimal base', () => {
    expect(convertDataSize(1, DataSizeType.PB, DataSizeType.MB, 1000)).toBe(1_000_000_000);
  });

  it('returns the input unchanged when source and target units match', () => {
    expect(convertDataSize(12.34567890123, DataSizeType.MB, DataSizeType.MB)).toBe(12.3456789012);
  });

  it('rounds conversion results to ten decimal places', () => {
    expect(convertDataSize(1, DataSizeType.B, DataSizeType.KB, 1000)).toBe(0.001);
  });

  it('returns zero when a very small result is below floating-point precision', () => {
    expect(convertDataSize(Number.MIN_VALUE, DataSizeType.PB, DataSizeType.B)).toBe(0);
  });

  it('rejects unit values that are not supported', () => {
    expect(() => convertDataSize(1, 'invalid' as DataSizeType, DataSizeType.B)).toThrow(
      'Invalid data size type provided'
    );
  });
});
