import { colorToRgbString } from '@/components/color/utils';
import { IColor } from 'react-color-palette';
import tinycolor from 'tinycolor2';

export interface CssBackgroundPatternValue {
  pattern: PatternType;
  fgColor: string;
  bgColor: string;
  size: number;
  rotation: number;
  stroke: number;
}

export const DEFAULT_BACKGROUND_PATTERN_VALUE: CssBackgroundPatternValue = {
  pattern: 'polka',
  fgColor: '#848cbd',
  bgColor: '#ffffff',
  size: 100,
  rotation: 45,
  stroke: 2,
};

export type PatternType =
  | 'polka'
  | 'stripes'
  | 'grid'
  | 'checkerboard'
  | 'zigzag'
  | 'triangles'
  | 'diamonds'
  | 'dots'
  | 'nested-squares'
  | 'nested-squares-outlined'
  | 'wavy'
  | 'ripple'
  | 'paper'
  | 'crosses'
  | 'cubes'
  | 'curved-lines'
  | 'overlapping-circles'
  | 'mesh'
  | 'hearts'
  | '3d-squares'
  | 'rotated-rectangles'
  | 'meander'
  | '3d-diamonds'
  | 'linked-squares'
  | 'loop-circles';

interface PatternConfig {
  id: PatternType;
  label: string;
  hasRotation?: boolean;
  hasStrokeWidth?: boolean;
  getStyles: (
    params: Omit<CssBackgroundPatternValue, 'fgColor' | 'bgColor'> & {
      fgColor: IColor;
      bgColor: IColor;
    }
  ) => React.CSSProperties;
}

export const PATTERNS: PatternConfig[] = [
  {
    id: 'polka',
    label: 'Polka Dots',
    getStyles: ({ bgColor, fgColor, size }) => {
      const rgbaFg = colorToRgbString(fgColor.rgb);
      const rgbaBg = colorToRgbString(bgColor.rgb);
      return {
        backgroundColor: rgbaBg,
        backgroundImage: `radial-gradient(${rgbaFg} ${size / 10}px, transparent ${size / 10}px), radial-gradient(${rgbaBg} ${size / 10}px, transparent ${size / 10}px)`,
        backgroundSize: `${size}px ${size}px`,
        backgroundPosition: `0 0, ${size / 2}px ${size / 2}px`,
      };
    },
  },
  {
    id: 'stripes',
    label: 'Stripes',
    hasRotation: true,
    getStyles: ({ bgColor, fgColor, size, rotation }) => {
      const rgbaFg = colorToRgbString(fgColor.rgb);
      const rgbaBg = colorToRgbString(bgColor.rgb);
      return {
        backgroundColor: rgbaBg,
        backgroundImage: `repeating-linear-gradient(${rotation}deg, ${rgbaFg}, ${rgbaFg} ${size / 4}px, transparent ${size / 4}px, transparent ${size}px)`,
      };
    },
  },
  {
    id: 'grid',
    label: 'Grid',
    getStyles: ({ bgColor, fgColor, size }) => {
      const rgbaFg = colorToRgbString(fgColor.rgb);
      const rgbaBg = colorToRgbString(bgColor.rgb);
      return {
        backgroundColor: rgbaBg,
        backgroundImage: `linear-gradient(${rgbaFg} 1px, transparent 1px), linear-gradient(90deg, ${rgbaFg} 1px, transparent 1px)`,
        backgroundSize: `${size}px ${size}px`,
      };
    },
  },
  {
    id: 'checkerboard',
    label: 'Checkerboard',
    getStyles: ({ bgColor, fgColor, size }) => {
      const rgbaFg = colorToRgbString(fgColor.rgb);
      const rgbaBg = colorToRgbString(bgColor.rgb);
      return {
        backgroundColor: rgbaBg,
        backgroundImage: `linear-gradient(45deg, ${rgbaFg} 25%, transparent 25%, transparent 75%, ${rgbaFg} 75%, ${rgbaFg}), linear-gradient(45deg, ${rgbaFg} 25%, transparent 25%, transparent 75%, ${rgbaFg} 75%, ${rgbaFg})`,
        backgroundPosition: `0 0, ${size / 2}px ${size / 2}px`,
        backgroundSize: `${size}px ${size}px`,
      };
    },
  },
  {
    id: 'zigzag',
    label: 'Zigzag',
    getStyles: ({ bgColor, fgColor, size }) => {
      const rgbaFg = colorToRgbString(fgColor.rgb);
      const rgbaBg = colorToRgbString(bgColor.rgb);
      return {
        backgroundColor: rgbaBg,
        backgroundImage: `linear-gradient(135deg, ${rgbaFg} 25%, transparent 25%), linear-gradient(225deg, ${rgbaFg} 25%, transparent 25%), linear-gradient(45deg, ${rgbaFg} 25%, transparent 25%), linear-gradient(315deg, ${rgbaFg} 25%, transparent 25%)`,
        backgroundPosition: `${size / 2}px 0, ${size / 2}px 0, 0 0, 0 0`,
        backgroundSize: `${size}px ${size}px`,
      };
    },
  },
  {
    id: 'triangles',
    label: 'Triangles',
    getStyles: ({ bgColor, fgColor, size }) => {
      const rgbaFg = colorToRgbString(fgColor.rgb);
      const rgbaBg = colorToRgbString(bgColor.rgb);
      return {
        backgroundColor: rgbaBg,
        backgroundImage: `conic-gradient(from 150deg at 50% 33%, ${rgbaFg} 60deg, transparent 60deg)`,
        backgroundSize: `${size}px ${size}px`,
      };
    },
  },
  {
    id: 'diamonds',
    label: 'Diamonds',
    getStyles: ({ bgColor, fgColor, size }) => {
      const rgbaFg = colorToRgbString(fgColor.rgb);
      const rgbaBg = colorToRgbString(bgColor.rgb);
      return {
        backgroundColor: rgbaBg,
        backgroundImage: `repeating-conic-gradient(from 45deg, ${rgbaFg} 0% 25%, transparent 0% 50%)`,
        backgroundSize: `${size}px ${size}px`,
      };
    },
  },
  {
    id: 'dots',
    label: 'Dots',
    hasStrokeWidth: true,
    getStyles: ({ bgColor, fgColor, size, stroke }) => {
      const rgbaFg = colorToRgbString(fgColor.rgb);
      const rgbaBg = colorToRgbString(bgColor.rgb);
      return {
        backgroundColor: rgbaBg,
        backgroundImage: `radial-gradient(${rgbaFg} ${stroke}px, transparent ${stroke}px)`,
        backgroundSize: `${size}px ${size}px`,
      };
    },
  },
  {
    id: 'nested-squares',
    label: 'Nested Squares (Filled)',
    getStyles: ({ bgColor, fgColor, size }) => {
      const rgbaFg = colorToRgbString(fgColor.rgb);
      const rgbaBg = colorToRgbString(bgColor.rgb);
      return {
        backgroundColor: rgbaBg,
        backgroundImage: `linear-gradient(45deg, transparent calc(25%/3), ${rgbaFg} 0 calc(50%/3), transparent 0 calc(250%/3), ${rgbaFg} 0 calc(275%/3), transparent 0),linear-gradient(45deg, ${rgbaFg} calc(25%/3), transparent 0 calc(50%/3), ${rgbaFg} 0 25%, transparent 0 75%, ${rgbaFg} 0 calc(250%/3), transparent 0 calc(275%/3), ${rgbaFg} 0),linear-gradient(-45deg, transparent calc(25%/3), ${rgbaFg} 0 calc(50%/3), transparent 0 calc(250%/3), ${rgbaFg} 0 calc(275%/3), transparent 0),linear-gradient(-45deg, ${rgbaFg} calc(25%/3), transparent 0 calc(50%/3), ${rgbaFg} 0 25%, transparent 0 75%, ${rgbaFg} 0 calc(250%/3), transparent 0 calc(275%/3), ${rgbaFg} 0)`,
        backgroundSize: `${size}px ${size}px`,
        backgroundPosition: `0 0, ${size / 2}px ${size / 2}px, 0 0, ${size / 2}px ${size / 2}px`,
      };
    },
  },
  {
    id: 'nested-squares-outlined',
    label: 'Nested Squares (Outlined)',
    getStyles: ({ bgColor, fgColor, size }) => {
      const rgbaFg = colorToRgbString(fgColor.rgb);
      const rgbaBg = colorToRgbString(bgColor.rgb);
      const grad1 = `repeating-linear-gradient(45deg, transparent calc(-650%/13) calc(50%/13), ${rgbaFg} 0 calc(100%/13), transparent 0 calc(150%/13), ${rgbaFg} 0 calc(200%/13), transparent 0 calc(250%/13), ${rgbaFg} 0 calc(300%/13))`;
      const grad2 = `repeating-linear-gradient(-45deg, transparent calc(-650%/13) calc(50%/13), ${rgbaFg} 0 calc(100%/13), transparent 0 calc(150%/13), ${rgbaFg} 0 calc(200%/13), transparent 0 calc(250%/13), ${rgbaFg} 0 calc(300%/13))`;
      return {
        backgroundColor: rgbaBg,
        backgroundImage: `${grad1}, ${grad1}, ${grad2}, ${grad2}`,
        backgroundSize: `${size}px ${size}px`,
        backgroundPosition: `0 0, ${size / 2}px ${size / 2}px, 0 0, ${size / 2}px ${size / 2}px`,
      };
    },
  },
  {
    id: 'wavy',
    label: 'Wavy',
    getStyles: ({ bgColor, fgColor, size }) => {
      const rgbaFg = colorToRgbString(fgColor.rgb);
      const rgbaBg = colorToRgbString(bgColor.rgb);
      return {
        backgroundColor: rgbaBg,
        backgroundImage: `repeating-radial-gradient( circle at 0 0, transparent 0, ${rgbaBg} ${size}px ), repeating-linear-gradient( ${rgbaFg}, ${rgbaFg} )`,
      };
    },
  },
  {
    id: 'ripple',
    label: 'Ripple',
    getStyles: ({ bgColor, fgColor, size }) => {
      const rgbaFg = colorToRgbString(fgColor.rgb);
      const rgbaBg = colorToRgbString(bgColor.rgb);
      return {
        backgroundColor: rgbaBg,
        backgroundImage: `radial-gradient(circle at center center, ${rgbaFg}, ${rgbaBg}), repeating-radial-gradient(circle at center center, ${rgbaFg} 0, ${rgbaFg} ${size}px, transparent ${size}px, transparent ${size * 2}px)`,
        backgroundBlendMode: 'multiply',
      };
    },
  },
  {
    id: 'paper',
    label: 'Paper',
    getStyles: ({ bgColor, fgColor, size }) => {
      const rgbaFg = colorToRgbString(fgColor.rgb);
      const rgbaBg = colorToRgbString(bgColor.rgb);
      return {
        backgroundColor: rgbaBg,
        backgroundImage: `linear-gradient(${rgbaFg} 2px, transparent 2px), linear-gradient(90deg, ${rgbaFg} 2px, transparent 2px), linear-gradient(${rgbaFg} 1px, transparent 1px), linear-gradient(90deg, ${rgbaFg} 1px, ${rgbaBg} 1px)`,
        backgroundSize: `${size}px ${size}px, ${size}px ${size}px, ${size / 5}px ${size / 5}px, ${size / 5}px ${size / 5}px`,
        backgroundPosition: `-2px -2px, -2px -2px, -1px -1px, -1px -1px`,
      };
    },
  },
  {
    id: 'crosses',
    label: 'Crosses',
    getStyles: ({ bgColor, fgColor, size }) => {
      const rgbaFg = colorToRgbString(fgColor.rgb);
      const rgbaBg = colorToRgbString(bgColor.rgb);
      return {
        backgroundColor: rgbaBg,
        backgroundImage: `radial-gradient(circle, transparent 20%, ${rgbaBg} 20%, ${rgbaBg} 80%, transparent 80%, transparent), radial-gradient(circle, transparent 20%, ${rgbaBg} 20%, ${rgbaBg} 80%, transparent 80%, transparent), linear-gradient(${rgbaFg} 2px, transparent 2px), linear-gradient(90deg, ${rgbaFg} 2px, ${rgbaBg} 2px)`,
        backgroundSize: `${size}px ${size}px, ${size}px ${size}px, ${size / 2}px ${size / 2}px, ${size / 2}px ${size / 2}px`,
        backgroundPosition: `0 0, ${size / 2}px ${size / 2}px, 0 -1px, -1px 0`,
      };
    },
  },
  {
    id: 'cubes',
    label: 'Cubes',
    getStyles: ({ bgColor, fgColor, size }) => {
      const c1 = colorToRgbString(fgColor.rgb);
      const c2 = colorToRgbString(bgColor.rgb);
      const c3 = tinycolor(fgColor.hex).darken(10).toRgbString();
      const height = size * 0.57735; // tan(30deg)
      return {
        backgroundColor: c2,
        backgroundImage: `repeating-conic-gradient(from 30deg, transparent 0 120deg, ${c3} 0 50%), repeating-conic-gradient(from 30deg, ${c1} 0 60deg, ${c2} 0 120deg, ${c3} 0 50%)`,
        backgroundSize: `${size}px ${height}px`,
        backgroundPosition: `${size / 2}px ${height / 2}px, 0 0`,
      };
    },
  },
  {
    id: 'curved-lines',
    label: 'Curved Lines',
    getStyles: ({ bgColor, fgColor, size }) => {
      const c1 = colorToRgbString(fgColor.rgb);
      const c2 = colorToRgbString(bgColor.rgb);
      const c3 = tinycolor(fgColor.hex).darken(15).toRgbString();
      const g = `50%, transparent 37%, ${c1} 39% 70%, transparent 72%`;
      const t = `50%, ${c2} 40deg, ${c3} 0 140deg, ${c2} 0 180deg, transparent 0`;
      const s = `47% 50% at`;
      return {
        backgroundColor: c2,
        backgroundImage: `radial-gradient(${s} -10% ${g}), radial-gradient(${s} -10% ${g}), radial-gradient(${s} 110% ${g}), radial-gradient(${s} 110% ${g}), conic-gradient(from 0deg at 55% ${t}), conic-gradient(from 180deg at 45% ${t})`,
        backgroundPosition: `0 ${size / 2}px, ${size / 2}px 0, 0 0, ${size / 2}px ${size / 2}px, ${size / 4}px 0, ${size / 4}px 0`,
        backgroundSize: `${size}px ${size}px`,
      };
    },
  },
  {
    id: 'overlapping-circles',
    label: 'Overlapping Circles',
    getStyles: ({ bgColor, fgColor, size }) => {
      const c1 = colorToRgbString(fgColor.rgb);
      const c2 = colorToRgbString(bgColor.rgb);
      const g = `${c1} 0% 5%, ${c2} 6% 15%, ${c1} 16% 25%, ${c2} 26% 35%, ${c1} 36% 45%, ${c2} 46% 55%, ${c1} 56% 65%, ${c2} 66% 75%, ${c1} 76% 85%, ${c2} 86% 95%, transparent 96%`;
      return {
        backgroundColor: c1,
        backgroundImage: `radial-gradient(50% 50% at 100% 0, ${g}), radial-gradient(50% 50% at 0 100%, ${g}), radial-gradient(50% 50%, ${g}), radial-gradient(50% 50%, ${g})`,
        backgroundPosition: `0 0, 0 0, 0 0, ${size / 2}px ${size / 2}px`,
        backgroundSize: `${size}px ${size}px`,
      };
    },
  },
  {
    id: 'mesh',
    label: 'Mesh',
    getStyles: ({ bgColor, fgColor, size }) => {
      const c1 = colorToRgbString(fgColor.rgb);
      const c2 = colorToRgbString(bgColor.rgb);
      const g = `transparent 52%, ${c1} 54% 57%, transparent 59%`;
      const sSmall = size / 4.667;
      return {
        backgroundColor: c2,
        backgroundImage: `radial-gradient(farthest-side at -33.33% 50%, ${g}), radial-gradient(farthest-side at 50% 133.33%, ${g}), radial-gradient(farthest-side at 133.33% 50%, ${g}), radial-gradient(farthest-side at 50% -33.33%, ${g})`,
        backgroundPosition: `0 ${size / 2}px, ${size / 2}px 0, 0 0, 0 0`,
        backgroundSize: `${sSmall}px ${size}px, ${size}px ${sSmall}px, ${sSmall}px ${size}px, ${size}px ${sSmall}px`,
      };
    },
  },
  {
    id: 'hearts',
    label: 'Hearts',
    getStyles: ({ bgColor, fgColor, size }) => {
      const c1 = colorToRgbString(fgColor.rgb);
      const c2 = colorToRgbString(bgColor.rgb);
      const g = `80%, ${c1} 25.4%, transparent 26%`;
      return {
        backgroundColor: c2,
        backgroundImage: `radial-gradient(at 80% ${g}), radial-gradient(at 20% ${g}), conic-gradient(from -45deg at 50% 41%, ${c1} 90deg, ${c2} 0)`,
        backgroundPosition: `0 0, 0 0, ${size / 2}px 0`,
        backgroundSize: `${size}px ${size}px`,
      };
    },
  },
  {
    id: '3d-squares',
    label: '3D Squares',
    getStyles: ({ bgColor, fgColor, size }) => {
      const c1 = colorToRgbString(fgColor.rgb);
      const c2 = colorToRgbString(bgColor.rgb);
      const c3 = tinycolor.mix(fgColor.hex, bgColor.hex, 50).toRgbString();
      const g = `${c1} 10%, ${c2} 10.5% 19%, transparent 19.5% 80.5%, ${c2} 81% 89.5%, ${c3} 90%`;
      const c = `from -90deg at 37.5% 50%, transparent 75%`;
      const l1 = `linear-gradient(145deg, ${g})`;
      const l2 = `linear-gradient( 35deg, ${g})`;
      return {
        backgroundColor: c2,
        backgroundImage: `${l1}, ${l1}, ${l2}, ${l2}, conic-gradient(${c}, ${c1} 0), conic-gradient(${c}, ${c3} 0), linear-gradient(90deg, ${c3} 38%, ${c1} 0 50%, ${c3} 0 62%, ${c1} 0)`,
        backgroundPosition: `0 0, ${size / 2}px ${size}px, 0 0, ${size / 2}px ${size}px, ${size / 8}px 0, ${size / 2}px 0, 0 0`,
        backgroundSize: `${size}px ${(size * 2) / 3}px`,
      };
    },
  },
  {
    id: 'rotated-rectangles',
    label: 'Rotated Rectangles',
    getStyles: ({ bgColor, fgColor, size }) => {
      const c1 = colorToRgbString(fgColor.rgb);
      const c2 = colorToRgbString(bgColor.rgb);
      const g = `transparent 8%, ${c1} 0 17%, transparent 0 58%`;
      return {
        backgroundColor: c2,
        backgroundImage: `linear-gradient(135deg, transparent 20.5%, ${c1} 0 29.5%, transparent 0), linear-gradient(45deg, ${g}), linear-gradient(135deg, ${g}, ${c1} 0 67%, transparent 0), linear-gradient(45deg, ${g}, ${c1} 0 67%, transparent 0 83%, ${c1} 0 92%, transparent 0)`,
        backgroundPosition: `0 ${size / 4}px, ${size / 2}px 0, 0 0, 0 0`,
        backgroundSize: `${size}px ${size}px`,
      };
    },
  },
  {
    id: 'meander',
    label: 'Meander',
    getStyles: ({ bgColor, fgColor, size }) => {
      const c1 = colorToRgbString(fgColor.rgb);
      const c2 = colorToRgbString(bgColor.rgb);
      const c = `${c1} 25%, transparent 0`;
      const g1 = `conic-gradient(at 62.5% 12.5%, ${c})`;
      const g2 = `conic-gradient(at 87.5% 62.5%, ${c})`;
      const g3 = `conic-gradient(at 25% 12.5%, ${c})`;
      return {
        backgroundColor: c2,
        backgroundImage: `${g1}, ${g1}, ${g2}, ${g2}, ${g3}, ${g3}, conic-gradient(at 87.5% 87.5%, ${c})`,
        backgroundPosition: `${-size / 8}px ${size / 2}px, ${(-3 * size) / 8}px ${size / 4}px, ${(3 * size) / 8}px ${size / 4}px, ${-size / 8}px 0, 0 ${-size / 4}px, ${-size / 4}px 0, ${size / 8}px 0`,
        backgroundSize: `${size}px ${size}px`,
      };
    },
  },
  {
    id: '3d-diamonds',
    label: '3D Diamonds',
    getStyles: ({ bgColor, fgColor, size }) => {
      const c1 = colorToRgbString(bgColor.rgb);
      const c2 = colorToRgbString(fgColor.rgb);
      const c3 = tinycolor(fgColor.hex).spin(-40).toRgbString();
      const c = `75%, ${c3} 52.72deg, transparent 0`;
      const g1 = `conic-gradient(from -116.36deg at 25% ${c})`;
      const g2 = `conic-gradient(from 63.43deg at 75% ${c})`;
      return {
        backgroundColor: c1,
        backgroundImage: `${g1}, ${g1}, ${g2}, ${g2}, conic-gradient(${c2} 63.43deg, ${c1} 0 116.36deg, ${c2} 0 180deg, ${c1} 0 243.43deg, ${c2} 0 296.15deg, ${c1} 0)`,
        backgroundPosition: `0 0, ${3 * size}px ${size / 2}px, 0 0, ${3 * size}px ${size / 2}px, 0 0`,
        backgroundSize: `${2 * size}px ${size}px`,
      };
    },
  },
  {
    id: 'linked-squares',
    label: 'Linked Squares',
    getStyles: ({ bgColor, fgColor, size }) => {
      const c1 = colorToRgbString(bgColor.rgb);
      const c2 = colorToRgbString(fgColor.rgb);
      const s2 = size * 2;
      const g = `conic-gradient(at 40% 40%, transparent 75%, ${c1} 0)`;
      const p = `conic-gradient(at 20% 20%, transparent 75%, ${c2} 0)`;
      return {
        backgroundColor: c1,
        backgroundImage: `${p}, ${p}, ${g}, ${g}, conic-gradient(from 90deg at 20% 20%, ${c2} 25%, ${c1} 0)`,
        backgroundPosition: `${0.9 * size}px ${0.9 * size}px, ${-0.1 * size}px ${-0.1 * size}px, ${0.7 * size}px ${0.7 * size}px, ${-0.3 * size}px ${-0.3 * size}px, 0 0`,
        backgroundSize: `${s2}px ${s2}px, ${s2}px ${s2}px, ${s2}px ${s2}px, ${s2}px ${s2}px, ${size}px ${size}px`,
      };
    },
  },
  {
    id: 'loop-circles',
    label: 'Loop Circles',
    getStyles: ({ bgColor, fgColor, size }) => {
      const c1 = colorToRgbString(bgColor.rgb);
      const c2 = colorToRgbString(fgColor.rgb);
      const g = `${c1} 6.1%, ${c2} 6.4% 18.6%, ${c1} 18.9% 31.1%, ${c2} 31.4% 43.6%, ${c1} 43.9% 56.1%, ${c2} 56.4% 68.6%, transparent 68.9%`;
      return {
        backgroundColor: c1,
        backgroundImage: `radial-gradient(${size}px at 100% 0, ${g}), radial-gradient(${size}px at 0 0, ${g}), radial-gradient(${size}px at 0 100%, ${g}), radial-gradient(${size}px at 100% 100%, ${g})`,
        backgroundPosition: `0 0`,
        backgroundSize: `${size}px ${size}px`,
      };
    },
  },
];
