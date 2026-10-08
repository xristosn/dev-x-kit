export type ColorOperation =
  | 'analogous'
  | 'monochromatic'
  | 'splitcomplement'
  | 'triad'
  | 'tetrad'
  | 'complement'
  | 'lighten'
  | 'darken'
  | 'brighten'
  | 'desaturate'
  | 'saturate'
  | 'spin';

export const COLOR_COMBINATION: ColorOperation[] = [
  'analogous',
  'monochromatic',
  'splitcomplement',
  'triad',
  'tetrad',
  'complement',
];

export const SHADES: Array<{ label: string; colorInstance: ColorOperation }> = [
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
