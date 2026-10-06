import { Instance as TinyColorInstance } from 'tinycolor2';

export const COLOR_COMBINATION: (keyof TinyColorInstance)[] = [
  'analogous',
  'monochromatic',
  'splitcomplement',
  'triad',
  'tetrad',
  'complement',
];

export const SHADES: Array<{ label: string; colorInstance: keyof TinyColorInstance }> = [
  {
    label: 'Lighter',
    colorInstance: 'lighten',
  },
  {
    label: 'Darker',
    colorInstance: 'darken',
  },
  {
    label: 'Brighter',
    colorInstance: 'brighten',
  },
  {
    label: 'Desaturated',
    colorInstance: 'desaturate',
  },
  {
    label: 'Saturated',
    colorInstance: 'saturate',
  },
  {
    label: 'Spinned',
    colorInstance: 'spin',
  },
  {
    label: 'Analogous',
    colorInstance: 'analogous',
  },
  {
    label: 'Monochromatic',
    colorInstance: 'monochromatic',
  },
  {
    label: 'Triad',
    colorInstance: 'triad',
  },
  {
    label: 'Tetrad',
    colorInstance: 'tetrad',
  },
];
