import { ColorService, type IColor } from 'react-color-palette';
import tinycolor from 'tinycolor2';

export interface PaletteGeneratorStoreValue {
  theme: 'light' | 'dark';
  light: {
    primaryColor: IColor;
    bgColor: IColor;
  };
  dark: {
    primaryColor: IColor;
    bgColor: IColor;
  };
}

export const getDefaultPaletteGeneratorStoreValue = (): PaletteGeneratorStoreValue => ({
  theme: 'light',
  light: {
    primaryColor:
      typeof window === 'undefined' ? ({} as IColor) : ColorService.convert('hex', '#3b82f6'),
    bgColor:
      typeof window === 'undefined' ? ({} as IColor) : ColorService.convert('hex', '#f2f2f2'),
  },
  dark: {
    primaryColor:
      typeof window === 'undefined' ? ({} as IColor) : ColorService.convert('hex', '#3b82f6'),
    bgColor:
      typeof window === 'undefined' ? ({} as IColor) : ColorService.convert('hex', '#000000'),
  },
});

export function generatePalettes(
  baseColor: string,
  bgColor: string
): { palette: string[]; name: string } {
  const steps = 12;
  const baseIndex = 8;
  const base = tinycolor(baseColor);
  const bg = tinycolor(bgColor);

  const interpolate = (start: tinycolor.Instance, end: tinycolor.Instance, count: number) => {
    const colors = [];
    for (let i = 0; i < count; i++) {
      const amount = (i / (count - 1)) * 100;
      colors.push(tinycolor.mix(start, end, amount).toHexString());
    }
    return colors;
  };

  const start = tinycolor.mix(bgColor, baseColor, 7);

  const isBgDark = bg.isDark();
  let end;
  if (isBgDark) {
    end = tinycolor.mix(baseColor, '#ffffff', 75);
  } else {
    end = tinycolor.mix(baseColor, '#000000', 75);
  }

  const scale1 = interpolate(start, base, baseIndex + 1);
  const scale2 = interpolate(base, end, steps - baseIndex);

  const palette = [...scale1, ...scale2.slice(1)];

  let name = base.toName();
  if (name) {
    name = name.charAt(0).toUpperCase() + name.slice(1);
  } else {
    const { h, s, l } = base.toHsl();
    if (s < 0.1) {
      name = l < 0.2 ? 'Black' : l > 0.8 ? 'White' : 'Gray';
    } else {
      if (h < 15 || h >= 345) name = 'Red';
      else if (h < 45) name = 'Orange';
      else if (h < 75) name = 'Yellow';
      else if (h < 165) name = 'Green';
      else if (h < 195) name = 'Cyan';
      else if (h < 255) name = 'Blue';
      else if (h < 315) name = 'Purple';
      else name = 'Pink';
    }
  }

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
    const t = tinycolor(target).toRgb();
    const b = tinycolor(bg).toRgb();
    const ti = tinycolor(tint).toRgb();

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
      return tinycolor(step9)
        .setAlpha(Math.min(Math.max(alpha, 0), 1))
        .toHex8String();
    }

    alpha = calculateAlpha(color, bgColor, fg);
    if (alpha >= -0.05 && alpha <= 1.05) {
      return tinycolor(fg)
        .setAlpha(Math.min(Math.max(alpha, 0), 1))
        .toHex8String();
    }

    return color;
  });

  const bg = tinycolor(bgColor);
  let bgCard, bgSidebar, bgMuted;

  if (isDark) {
    bgCard = bg.clone().lighten(5).toHexString();
    bgSidebar = bg.clone().lighten(2).toHexString();
    bgMuted = bg.clone().lighten(8).toHexString();
  } else {
    bgCard = bg.clone().lighten(5).toHexString();
    bgSidebar = bg.clone().darken(2).toHexString();
    bgMuted = bg.clone().darken(5).toHexString();
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

  const firstLum = tinycolor(paletteColors[0]).getLuminance();
  const lastLum = tinycolor(paletteColors[paletteColors.length - 1]).getLuminance();

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
      return tinycolor.mix('#ffffff', bgColor, percentage).toHexString();
    });
  } else {
    bgPaletteColors = keys.map((_, i) => {
      const percentage = (i / (keys.length - 1)) * 100;
      return tinycolor.mix(bgColor, '#000000', percentage).toHexString();
    });
  }

  const bgTokens = keys
    .map((key, i) => `          ${key}: { value: "${bgPaletteColors[i]}" }`)
    .join(',\n');

  const step600 = sortedColors[7];
  const contrastValue = tinycolor(step600).isLight() ? 'black' : 'white';

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
