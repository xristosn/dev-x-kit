import { ColorService } from 'react-color-palette';
import { describe, expect, it } from 'vitest';
import { colorToRgbString } from '@/components/color/utils';
import { DEFAULT_BACKGROUND_PATTERN_VALUE, PATTERNS } from './utils';

describe('css background pattern utils', () => {
  const fgColor = ColorService.convert('hex', '#123456');
  const bgColor = ColorService.convert('hex', '#abcdef');
  const params = { pattern: 'polka' as const, fgColor, bgColor, size: 80, rotation: 30, stroke: 4 };

  it('exports the expected default pattern settings', () => {
    expect(DEFAULT_BACKGROUND_PATTERN_VALUE).toEqual({
      pattern: 'polka',
      fgColor: '#848cbd',
      bgColor: '#ffffff',
      size: 100,
      rotation: 45,
      stroke: 2,
    });
  });

  it('generates background colors and images for every pattern', () => {
    expect(PATTERNS).toHaveLength(25);
    expect(new Set(PATTERNS.map(({ id }) => id)).size).toBe(PATTERNS.length);

    for (const pattern of PATTERNS) {
      const styles = pattern.getStyles(params);

      expect(styles.backgroundColor, `${pattern.id} backgroundColor`).toBeTruthy();
      expect(styles.backgroundImage, `${pattern.id} backgroundImage`).toBeTruthy();
    }
  });

  it('uses the selected colors and size for polka dots', () => {
    const styles = PATTERNS.find(({ id }) => id === 'polka')!.getStyles(params);

    expect(styles.backgroundColor).toBe(colorToRgbString(bgColor.rgb));
    expect(styles.backgroundImage).toContain(colorToRgbString(fgColor.rgb));
    expect(styles.backgroundSize).toBe('80px 80px');
    expect(styles.backgroundImage).toContain('8px');
  });

  it('uses the rotation and size for stripes', () => {
    const stripes = PATTERNS.find(({ id }) => id === 'stripes')!;

    expect(stripes.getStyles(params).backgroundImage).toContain('30deg');
    expect(stripes.getStyles({ ...params, rotation: 210 }).backgroundImage).toContain('210deg');
    expect(stripes.getStyles(params).backgroundImage).toContain('20px');
  });

  it('uses the configured stroke width for dots', () => {
    const dots = PATTERNS.find(({ id }) => id === 'dots')!;
    const styles = dots.getStyles(params);

    expect(styles.backgroundImage).toContain(`${colorToRgbString(fgColor.rgb)} 4px`);
    expect(styles.backgroundSize).toBe('80px 80px');
  });
});
