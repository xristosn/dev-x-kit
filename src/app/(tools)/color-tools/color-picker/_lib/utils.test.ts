import Color from 'colorjs.io';
import { describe, expect, test } from 'vitest';
import { getShadeColors } from './utils';

describe('getShadeColors', () => {
  const baseColor = '#2d2bb6';

  describe('number-based shade functions', () => {
    test('lighten returns progressively lighter colors', () => {
      const result = getShadeColors(baseColor, 'lighten');
      const lightness = result.map(([bg]) => new Color(bg).to('hsl').coords[2] ?? 0);
      for (let i = 1; i < lightness.length; i++) {
        expect(lightness[i]).toBeGreaterThan(lightness[i - 1]);
      }
    });

    test('darken returns progressively darker colors', () => {
      const result = getShadeColors(baseColor, 'darken');
      const lightness = result.map(([bg]) => new Color(bg).to('hsl').coords[2] ?? 0);
      for (let i = 1; i < lightness.length; i++) {
        expect(lightness[i]).toBeLessThan(lightness[i - 1]);
      }
    });

    test('brighten returns progressively brighter colors', () => {
      const result = getShadeColors(baseColor, 'brighten');
      const brightness = result.map(([bg]) => {
        const [r, g, b] = new Color(bg).to('srgb').coords.map((channel) => (channel ?? 0) * 255);
        return (r * 299 + g * 587 + b * 114) / 1000;
      });
      for (let i = 1; i < brightness.length; i++) {
        expect(brightness[i]).toBeGreaterThan(brightness[i - 1]);
      }
    });

    test('desaturate returns progressively less saturated colors', () => {
      const result = getShadeColors(baseColor, 'desaturate');
      const saturation = result.map(([bg]) => new Color(bg).to('hsv').coords[1] ?? 0);
      for (let i = 1; i < saturation.length; i++) {
        expect(saturation[i]).toBeLessThan(saturation[i - 1]);
      }
    });

    test('saturate returns progressively more saturated colors', () => {
      const result = getShadeColors(baseColor, 'saturate');
      const saturation = result.map(([bg]) => new Color(bg).to('hsv').coords[1] ?? 0);
      for (let i = 1; i < saturation.length; i++) {
        expect(saturation[i]).toBeGreaterThan(saturation[i - 1]);
      }
    });

    test('spin(0) returns the original color', () => {
      const result = getShadeColors(baseColor, 'spin');
      expect(result.map(([bg]) => bg)[2]).toBe(baseColor);
    });

    test('spin returns distinct colors for different angles', () => {
      const result = getShadeColors(baseColor, 'spin');
      expect(new Set(result.map(([bg]) => bg)).size).toBe(5);
    });
  });

  describe('combination functions', () => {
    test('analogous returns 6 colors centered around hue', () => {
      const result = getShadeColors(baseColor, 'analogous');
      expect(result).toHaveLength(6);
      const hues = result.map(([bg]) => new Color(bg).to('hsv').coords[0] ?? 0);
      expect(Math.abs(hues[0] - hues[1])).toBeGreaterThan(10);
    });

    test('monochromatic returns colors varying in lightness', () => {
      const result = getShadeColors(baseColor, 'monochromatic');
      expect(result).toHaveLength(6);
      const values = result.map(([bg]) => new Color(bg).to('hsv').coords[2] ?? 0);
      expect(new Set(values).size).toBe(6);
    });

    test('triad returns 3 evenly spaced hues', () => {
      const result = getShadeColors(baseColor, 'triad');
      expect(result).toHaveLength(3);
      const hues = result.map(([bg]) => new Color(bg).to('hsv').coords[0] ?? 0);
      const sortedHues = [...hues].sort((a, b) => a - b);
      const diff1 = sortedHues[1] - sortedHues[0];
      const diff2 = sortedHues[2] - sortedHues[1];
      const diff3 = 360 - sortedHues[2] + sortedHues[0];
      expect(diff1).toBeCloseTo(120, 0);
      expect(diff2).toBeCloseTo(120, 0);
      expect(diff3).toBeCloseTo(120, 0);
    });

    test('tetrad returns 4 colors', () => {
      const result = getShadeColors(baseColor, 'tetrad');
      expect(result).toHaveLength(4);
      const hues = result.map(([bg]) => new Color(bg).to('hsv').coords[0] ?? 0);
      expect(new Set(hues.map((hue) => Math.round(hue))).size).toBe(4);
    });
  });

  test('foreground contrast color is correct', () => {
    const result = getShadeColors(baseColor, 'lighten');
    result.forEach(([bg, fg]) => {
      const [r, g, b] = new Color(bg).to('srgb').coords.map((channel) => (channel ?? 0) * 255);
      const isLight = (r * 299 + g * 587 + b * 114) / 1000 > 128;
      expect(fg).toBe(isLight ? '#000' : '#fff');
    });
  });
});
