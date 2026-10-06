import { describe, expect, test } from 'vitest';
import { getShadeColors } from './utils';
import tinyColor from 'tinycolor2';

describe('getShadeColors', () => {
  const baseColor = '#2d2bb6';

  describe('number-based shade functions', () => {
    test('lighten returns progressively lighter colors', () => {
      const result = getShadeColors(baseColor, 'lighten');
      const brightness = result.map(([bg]) => tinyColor(bg).getBrightness());
      for (let i = 1; i < brightness.length; i++) {
        expect(brightness[i]).toBeGreaterThan(brightness[i - 1]);
      }
    });

    test('darken returns progressively darker colors', () => {
      const result = getShadeColors(baseColor, 'darken');
      const brightness = result.map(([bg]) => tinyColor(bg).getBrightness());
      for (let i = 1; i < brightness.length; i++) {
        expect(brightness[i]).toBeLessThan(brightness[i - 1]);
      }
    });

    test('brighten returns progressively brighter colors', () => {
      const result = getShadeColors(baseColor, 'brighten');
      const brightness = result.map(([bg]) => tinyColor(bg).getBrightness());
      for (let i = 1; i < brightness.length; i++) {
        expect(brightness[i]).toBeGreaterThan(brightness[i - 1]);
      }
    });

    test('desaturate returns progressively less saturated colors', () => {
      const result = getShadeColors(baseColor, 'desaturate');
      const saturation = result.map(([bg]) => tinyColor(bg).toHsv().s);
      for (let i = 1; i < saturation.length; i++) {
        expect(saturation[i]).toBeLessThan(saturation[i - 1]);
      }
    });

    test('saturate returns progressively more saturated colors', () => {
      const result = getShadeColors(baseColor, 'saturate');
      const saturation = result.map(([bg]) => tinyColor(bg).toHsv().s);
      for (let i = 1; i < saturation.length; i++) {
        expect(saturation[i]).toBeGreaterThan(saturation[i - 1]);
      }
    });

    test('spin(0) returns the original color', () => {
      const result = getShadeColors(baseColor, 'spin');
      const spinResults = result.map(([bg]) => bg);
      expect(spinResults[2]).toBe(baseColor);
    });

    test('spin returns distinct colors for different angles', () => {
      const result = getShadeColors(baseColor, 'spin');
      const spinResults = result.map(([bg]) => bg);
      const unique = new Set(spinResults);
      expect(unique.size).toBe(5);
    });
  });

  describe('combination functions', () => {
    test('analogous returns 6 colors centered around hue', () => {
      const result = getShadeColors(baseColor, 'analogous');
      expect(result).toHaveLength(6);
      const hues = result.map(([bg]) => tinyColor(bg).toHsv().h);
      const hueDiff = Math.abs(hues[0] - hues[1]);
      expect(hueDiff).toBeGreaterThan(10);
    });

    test('monochromatic returns colors varying in lightness', () => {
      const result = getShadeColors(baseColor, 'monochromatic');
      expect(result).toHaveLength(6);
      const saturations = result.map(([bg]) => tinyColor(bg).toHsv().s);
      const avgSat = saturations.reduce((a, b) => a + b, 0) / saturations.length;
      saturations.forEach((s) => {
        expect(Math.abs(s - avgSat)).toBeLessThan(50);
      });
    });

    test('triad returns 3 evenly spaced hues', () => {
      const result = getShadeColors(baseColor, 'triad');
      expect(result).toHaveLength(3);
      const hues = result.map(([bg]) => tinyColor(bg).toHsv().h);
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
      const hues = result.map(([bg]) => tinyColor(bg).toHsv().h);
      const uniqueHues = new Set(hues.map((h) => Math.round(h)));
      expect(uniqueHues.size).toBe(4);
    });
  });

  test('foreground contrast color is correct', () => {
    const result = getShadeColors(baseColor, 'lighten');
    result.forEach(([bg, fg]) => {
      const tc = tinyColor(bg);
      expect(fg).toBe(tc.isLight() ? '#000' : '#fff');
    });
  });
});
