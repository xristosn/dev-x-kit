import Color from 'colorjs.io';

function toHex(color: Color): string {
  return color.to('srgb').toString({ format: 'hex', collapse: false, inGamut: true });
}

function toRgb(color: string | Color): { r: number; g: number; b: number; a: number } {
  const { coords, alpha } = new Color(color).to('srgb');
  return {
    r: (coords[0] ?? 0) * 255,
    g: (coords[1] ?? 0) * 255,
    b: (coords[2] ?? 0) * 255,
    a: alpha,
  };
}

function mix(start: string | Color, end: string | Color, amount: number): Color {
  return Color.mix(start, end, amount / 100, { space: 'srgb' });
}

function isDark(color: Color): boolean {
  const { r, g, b } = toRgb(color);
  return (r * 299 + g * 587 + b * 114) / 1000 < 128;
}

function isLight(color: Color): boolean {
  const { r, g, b } = toRgb(color);
  return (r * 299 + g * 587 + b * 114) / 1000 > 128;
}

function withAlpha(color: string | Color, alpha: number): string {
  const result = new Color(color);
  result.alpha = alpha;
  return toHex(result);
}

function adjustLightness(color: Color, amount: number): Color {
  const hsl = color.to('hsl');
  hsl.coords[2] = Math.min(100, Math.max(0, (hsl.coords[2] ?? 0) + amount));
  return hsl;
}

export type PaletteGeneratorStoreValue = {
  theme: 'light' | 'dark';
  light: {
    primaryColor: string;
    bgColor: string;
  };
  dark: {
    primaryColor: string;
    bgColor: string;
  };
};

export const getDefaultPaletteGeneratorStoreValue = (): PaletteGeneratorStoreValue => ({
  theme: 'light',
  light: {
    primaryColor: '#3b82f6',
    bgColor: '#f2f2f2',
  },
  dark: {
    primaryColor: '#3b82f6',
    bgColor: '#000000',
  },
});

export function generatePalettes(
  baseColor: string,
  bgColor: string
): { palette: string[]; name: string } {
  const steps = 12;
  const baseIndex = 8;
  const base = new Color(baseColor);
  const bg = new Color(bgColor);

  const interpolate = (start: Color, end: Color, count: number): string[] => {
    const colors: string[] = [];
    for (let i = 0; i < count; i++) {
      const amount = (i / (count - 1)) * 100;
      colors.push(toHex(mix(start, end, amount)));
    }
    return colors;
  };

  const start = mix(bg, base, 7);
  const end = mix(base, isDark(bg) ? '#ffffff' : '#000000', 75);

  const scale1 = interpolate(start, base, baseIndex + 1);
  const scale2 = interpolate(base, end, steps - baseIndex);

  const palette = [...scale1, ...scale2.slice(1)];

  const [hue, saturation, lightness] = base.to('hsl').coords;
  let name: string;
  if ((saturation ?? 0) < 10) {
    name = (lightness ?? 0) < 20 ? 'Black' : (lightness ?? 0) > 80 ? 'White' : 'Gray';
  } else if ((hue ?? 0) < 15 || (hue ?? 0) >= 345) name = 'Red';
  else if ((hue ?? 0) < 45) name = 'Orange';
  else if ((hue ?? 0) < 75) name = 'Yellow';
  else if ((hue ?? 0) < 165) name = 'Green';
  else if ((hue ?? 0) < 195) name = 'Cyan';
  else if ((hue ?? 0) < 255) name = 'Blue';
  else if ((hue ?? 0) < 315) name = 'Purple';
  else name = 'Pink';

  return { palette, name };
}

export function paletteToCss(
  paletteName: string,
  paletteColors: string[],
  bgColor: string,
  theme: 'light' | 'dark'
) {
  const isDark = theme === 'dark';
  const selector = isDark ? '.dark' : ':root, .light';

  const solidColors = paletteColors;
  const step9 = solidColors[8];
  const fg = isDark ? '#ffffff' : '#000000';

  const calculateAlpha = (target: string, bg: string, tint: string) => {
    const t = toRgb(target);
    const b = toRgb(bg);
    const ti = toRgb(tint);

    const diffR = ti.r - b.r;
    const diffG = ti.g - b.g;
    const diffB = ti.b - b.b;

    const maxDiff = Math.max(Math.abs(diffR), Math.abs(diffG), Math.abs(diffB));
    if (maxDiff < 5) return -1;

    if (Math.abs(diffR) === maxDiff) return (t.r - b.r) / diffR;
    if (Math.abs(diffG) === maxDiff) return (t.g - b.g) / diffG;
    return (t.b - b.b) / diffB;
  };

  const alphaColors = solidColors.map((color) => {
    let alpha = calculateAlpha(color, bgColor, step9);
    if (alpha >= -0.05 && alpha <= 1.05) {
      return withAlpha(step9, Math.min(Math.max(alpha, 0), 1));
    }

    alpha = calculateAlpha(color, bgColor, fg);
    if (alpha >= -0.05 && alpha <= 1.05) {
      return withAlpha(fg, Math.min(Math.max(alpha, 0), 1));
    }

    return color;
  });

  const bg = new Color(bgColor);
  let bgCard: string;
  let bgSidebar: string;
  let bgMuted: string;

  if (isDark) {
    bgCard = toHex(adjustLightness(bg, 5));
    bgSidebar = toHex(adjustLightness(bg, 2));
    bgMuted = toHex(adjustLightness(bg, 8));
  } else {
    bgCard = toHex(adjustLightness(bg, 5));
    bgSidebar = toHex(adjustLightness(bg, -2));
    bgMuted = toHex(adjustLightness(bg, -5));
  }

  const lines = [];
  lines.push(`${selector} {`);

  lines.push(`  --background: ${bgColor};`);
  lines.push(`  --background-card: ${bgCard};`);
  lines.push(`  --background-sidebar: ${bgSidebar};`);
  lines.push(`  --background-muted: ${bgMuted};`, '');

  solidColors.forEach((color, index) => {
    lines.push(`  --${paletteName.toLowerCase()}-${index + 1}: ${color};`);
  });

  lines.push('');
  alphaColors.forEach((color, index) => {
    lines.push(`  --${paletteName.toLowerCase()}-a${index + 1}: ${color};`);
  });

  lines.push('');

  const surface = alphaColors[1];

  lines.push(`  --${paletteName.toLowerCase()}-contrast: #fff;`);
  lines.push(`  --${paletteName.toLowerCase()}-surface: ${surface};`);
  lines.push(`  --${paletteName.toLowerCase()}-indicator: ${step9};`);
  lines.push(`  --${paletteName.toLowerCase()}-track: ${step9};`);

  lines.push('}');

  return lines.join('\n');
}

export function paletteToText(name: string, palette: string[], bgColor: string) {
  return [
    '// Palette Colors',

    palette.map((c, idx) => [`// ${name} ${idx + 1}`, `${c}`].join('\n')).join('\n'),

    ['// Background Color', bgColor].join('\n'),
  ].join('\n\n');
}

export function paletteToChakraV3(
  paletteName: string,
  paletteColors: string[],
  bgColor: string,
  theme: 'light' | 'dark'
) {
  const name = paletteName.toLowerCase();

  const firstLum = new Color(paletteColors[0]).luminance;
  const lastLum = new Color(paletteColors[paletteColors.length - 1]).luminance;

  const sortedColors = [...paletteColors];
  if (firstLum < lastLum) {
    sortedColors.reverse();
  }

  const keys = [50, 100, 150, 200, 300, 400, 500, 600, 700, 800, 900, 950];

  const tokens = keys
    .map((key, i) => `          ${key}: { value: "${sortedColors[i]}" }`)
    .join(',\n');

  const isDark = theme === 'dark';
  let bgPaletteColors: string[];

  if (isDark) {
    bgPaletteColors = keys.map((_, i) => {
      const percentage = (i / (keys.length - 1)) * 100;
      return toHex(mix('#ffffff', bgColor, percentage));
    });
  } else {
    bgPaletteColors = keys.map((_, i) => {
      const percentage = (i / (keys.length - 1)) * 100;
      return toHex(mix(bgColor, '#000000', percentage));
    });
  }

  const bgTokens = keys
    .map((key, i) => `          ${key}: { value: "${bgPaletteColors[i]}" }`)
    .join(',\n');

  const step600 = sortedColors[7];
  const contrastValue = isLight(new Color(step600)) ? 'black' : 'white';

  return `import { createSystem, defineConfig, defaultConfig } from "@chakra-ui/react"

const config = defineConfig({
  theme: {
    tokens: {
      colors: {
        ${name}: {
${tokens},
        },
        bg: {
${bgTokens}
        }
      }
    },
    semanticTokens: {
      colors: {
        ${name}: {
          contrast: {
            value: "${contrastValue}",
          },
          fg: {
            value: { _light: "{colors.${name}.700}", _dark: "{colors.${name}.300}" },
          },
          subtle: {
            value: { _light: "{colors.${name}.100}", _dark: "{colors.${name}.900}" },
          },
          muted: {
            value: { _light: "{colors.${name}.200}", _dark: "{colors.${name}.800}" },
          },
          emphasized: {
            value: { _light: "{colors.${name}.300}", _dark: "{colors.${name}.700}" },
          },
          solid: {
            value: { _light: "{colors.${name}.600}", _dark: "{colors.${name}.600}" },
          },
          focusRing: {
            value: { _light: "{colors.${name}.500}", _dark: "{colors.${name}.500}" },
          },
          border: {
            value: { _light: "{colors.${name}.500}", _dark: "{colors.${name}.400}" },
          },
        },
        bg: {
          DEFAULT: {
            value: { _light: "{colors.bg.50}", _dark: "{colors.bg.950}" },
          },
          subtle: {
            value: { _light: "{colors.bg.100}", _dark: "{colors.bg.900}" },
          },
          muted: {
            value: { _light: "{colors.bg.200}", _dark: "{colors.bg.800}" },
          },
          emphasized: {
            value: { _light: "{colors.bg.300}", _dark: "{colors.bg.700}" },
          },
          inverted: {
            value: { _light: "{colors.bg.950}", _dark: "{colors.bg.50}" },
          },
          panel: {
            value: { _light: "{colors.bg.50}", _dark: "{colors.bg.950}" },
          },
        }
      }
    }
  }
});

export const system = createSystem(defaultConfig, config)`;
}
