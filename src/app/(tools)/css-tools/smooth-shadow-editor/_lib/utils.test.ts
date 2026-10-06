import { describe, expect, it } from 'vitest';
import { generateSmoothShadow, SHADOWS_DEFAULT_VALUE } from './utils';

describe('generateSmoothShadow', () => {
  it('generates the configured number of shadow layers', () => {
    expect(generateSmoothShadow(SHADOWS_DEFAULT_VALUE)).toBe(
      [
        '5px 3px 7px rgba(2, 5, 15, 0.02)',
        '10px 6px 14px rgba(2, 5, 15, 0.03)',
        '14px 10px 20px rgba(2, 5, 15, 0.05)',
        '19px 13px 27px rgba(2, 5, 15, 0.06)',
        '24px 16px 34px rgba(2, 5, 15, 0.08)',
      ].join(',\n ')
    );
  });

  it('rounds each layer and preserves negative offsets', () => {
    expect(
      generateSmoothShadow({
        ...SHADOWS_DEFAULT_VALUE,
        layers: 2,
        blur: 5,
        opacity: 0.2,
        color: '#ff0000',
        offsetX: -3,
        offsetY: 1,
      })
    ).toBe('-1px 1px 3px rgba(255, 0, 0, 0.1),\n -3px 1px 5px rgba(255, 0, 0, 0.2)');
  });

  it('returns an empty string when the layer count is zero', () => {
    expect(generateSmoothShadow({ ...SHADOWS_DEFAULT_VALUE, layers: 0 })).toBe('');
  });
});
