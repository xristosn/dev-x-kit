import { describe, expect, it } from 'vitest';
import {
  DEFAULT_TEXT_GRADIENT_VALUE,
  GRADIENT_POSITIONS,
  LINEAR_DIRECTIONS,
  TEXT_GRADIENT_PRESETS,
  buildTextGradient,
  getTextGradientStyles,
  normalizeTextGradientValue,
} from './utils';

describe('css-text-gradient-generator utils', () => {
  it('provides uniquely identified presets that build valid gradients', () => {
    const ids = TEXT_GRADIENT_PRESETS.map(({ id }) => id);

    expect(new Set(ids).size).toBe(ids.length);

    for (const preset of TEXT_GRADIENT_PRESETS) {
      expect(buildTextGradient(preset.value)).toMatch(/^(linear|radial)-gradient\(/);
    }
  });

  describe('buildTextGradient', () => {
    it('builds linear gradients for every direction', () => {
      for (const direction of LINEAR_DIRECTIONS) {
        const gradient = buildTextGradient({
          ...DEFAULT_TEXT_GRADIENT_VALUE,
          direction: direction.value,
        });

        expect(gradient).toContain(`linear-gradient(${direction.cssValue},`);
      }
    });

    it('uses and normalizes a custom angle', () => {
      const gradient = buildTextGradient({
        ...DEFAULT_TEXT_GRADIENT_VALUE,
        direction: 'custom',
        angle: 450,
      });

      expect(gradient).toContain('linear-gradient(90deg,');
    });

    it('supports all radial positions', () => {
      for (const position of GRADIENT_POSITIONS) {
        const gradient = buildTextGradient({
          ...DEFAULT_TEXT_GRADIENT_VALUE,
          type: 'radial',
          position: position.value,
        });

        expect(gradient).toContain(` at ${position.cssValue},`);
      }
    });

    it('sorts stops and clamps offsets before serialization', () => {
      const gradient = buildTextGradient({
        ...DEFAULT_TEXT_GRADIENT_VALUE,
        stops: [
          { id: 'last', color: '#000000', offset: 150 },
          { id: 'first', color: '#ffffff', offset: -5 },
        ],
      });

      expect(gradient).toContain('#ffffff 0%, #000000 100%');
    });
  });

  describe('getTextGradientStyles', () => {
    it('adds text clipping and transparent fill to the generated gradient', () => {
      const styles = getTextGradientStyles(DEFAULT_TEXT_GRADIENT_VALUE);

      expect(styles).toEqual({
        backgroundImage: buildTextGradient(DEFAULT_TEXT_GRADIENT_VALUE),
        backgroundClip: 'text',
        WebkitBackgroundClip: 'text',
        color: 'transparent',
        WebkitTextFillColor: 'transparent',
      });
    });
  });

  describe('normalizeTextGradientValue', () => {
    it('repairs malformed saved values with safe defaults', () => {
      const normalized = normalizeTextGradientValue({
        type: 'invalid',
        angle: Number.NaN,
        stops: [{ id: 'broken', color: 'not-a-color', offset: 250 }],
      });

      expect(normalized.type).toBe(DEFAULT_TEXT_GRADIENT_VALUE.type);
      expect(normalized.angle).toBe(DEFAULT_TEXT_GRADIENT_VALUE.angle);
      expect(normalized.stops).toHaveLength(2);
      expect(normalized.stops[0].offset).toBe(0);
      expect(normalized.stops[0].color).toBe(DEFAULT_TEXT_GRADIENT_VALUE.stops[0].color);
    });
  });
});
