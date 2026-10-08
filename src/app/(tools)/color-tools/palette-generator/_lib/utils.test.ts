import { describe, expect, test } from 'vitest';
import {
  getDefaultPaletteGeneratorStoreValue,
  generatePalettes,
  paletteToCss,
  paletteToText,
  paletteToChakraV3,
} from './utils';

describe('getDefaultPaletteGeneratorStoreValue', () => {
  test('returns light theme with default colors', () => {
    const value = getDefaultPaletteGeneratorStoreValue();
    expect(value.theme).toBe('light');
    expect(value.light.primaryColor).toBe('#3b82f6');
    expect(value.light.bgColor).toBe('#f2f2f2');
  });

  test('has dark theme defaults', () => {
    const value = getDefaultPaletteGeneratorStoreValue();
    expect(value.dark.primaryColor).toBe('#3b82f6');
    expect(value.dark.bgColor).toBe('#000000');
    expect(value.theme).toBe('light');
    expect(value.dark).toBeDefined();
  });
});

describe('generatePalettes', () => {
  test('generates 12 colors', () => {
    const result = generatePalettes('#3b82f6', '#f2f2f2');
    expect(result.palette).toHaveLength(12);
  });

  test('returns a name for a known color', () => {
    const result = generatePalettes('#ff0000', '#ffffff');
    expect(result.name).toBe('Red');
  });

  test('returns Gray for low saturation dark colors', () => {
    const result = generatePalettes('#111111', '#ffffff');
    expect(result.name).toBe('Black');
  });

  test('interpolates from light background', () => {
    const result = generatePalettes('#0000ff', '#ffffff');
    expect(result.palette.length).toBe(12);
    expect(result.name).toBe('Blue');
  });

  test('interpolates from dark background', () => {
    const result = generatePalettes('#ff0000', '#000000');
    expect(result.palette.length).toBe(12);
    expect(result.name).toBe('Red');
  });
});

describe('paletteToCss', () => {
  const palette = ['#a1a1aa', '#3b82f6', '#1d4ed8', '#1e3a8a'];

  test('includes light selector', () => {
    const css = paletteToCss('Blue', palette.concat(new Array(8).fill('#fff')), '#fff', 'light');
    expect(css).toContain(':root, .light');
  });

  test('includes dark selector', () => {
    const css = paletteToCss('Blue', palette.concat(new Array(8).fill('#fff')), '#000', 'dark');
    expect(css).toContain('.dark');
  });

  test('outputs palette variables', () => {
    const fullPalette = new Array(12).fill('#3b82f6');
    const css = paletteToCss('Blue', fullPalette, '#fff', 'light');
    expect(css).toContain('--blue-1');
    expect(css).toContain('--blue-12');
  });
});

describe('paletteToText', () => {
  test('includes palette colors', () => {
    const text = paletteToText('Green', ['#a1a1aa', '#22c55e'], '#ffffff');
    expect(text).toContain('#a1a1aa');
    expect(text).toContain('#22c55e');
  });

  test('includes background color', () => {
    const text = paletteToText('Green', ['#22c55e'], '#000000');
    expect(text).toContain('#000000');
  });
});

describe('paletteToChakraV3', () => {
  test('includes color tokens', () => {
    const colors = new Array(12).fill('#3b82f6');
    const result = paletteToChakraV3('Blue', colors, '#fff', 'light');
    expect(result).toContain('50:');
    expect(result).toContain('950:');
  });

  test('includes bg palette tokens', () => {
    const colors = new Array(12).fill('#3b82f6');
    const result = paletteToChakraV3('Blue', colors, '#f2f2f2', 'light');
    expect(result).toContain('bg:');
  });

  test('reverses colors when first luminance is lower', () => {
    const colors = [
      '#000000',
      '#111111',
      '#222222',
      '#333333',
      '#444444',
      '#555555',
      '#666666',
      '#777777',
      '#888888',
      '#999999',
      '#aaaaaa',
      '#bbbbbb',
    ];
    const result = paletteToChakraV3('Gray', colors, '#fff', 'light');
    expect(result).toContain('#bbbbbb');
  });
});
