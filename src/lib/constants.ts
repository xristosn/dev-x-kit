import { v4 as uuid } from 'uuid';
import { GradientValue } from '@/types/gradient';

export const SVGO_VALUES = [
  'removeDoctype',
  'removeXMLProcInst',
  'removeComments',
  'removeMetadata',
  'removeEditorsNSData',
  'cleanupAttrs',
  'mergeStyles',
  'inlineStyles',
  'minifyStyles',
  'cleanupIds',
  'removeUselessDefs',
  'cleanupNumericValues',
  'convertColors',
  'removeUnknownsAndDefaults',
  'removeNonInheritableGroupAttrs',
  'removeUselessStrokeAndFill',
  'removeViewBox',
  'cleanupEnableBackground',
  'removeHiddenElems',
  'removeEmptyText',
  'convertShapeToPath',
  'convertEllipseToCircle',
  'moveElemsAttrsToGroup',
  'moveGroupAttrsToElems',
  'collapseGroups',
  'convertPathData',
  'convertTransform',
  'removeEmptyAttrs',
  'removeEmptyContainers',
  'removeUnusedNS',
  'mergePaths',
  'sortAttrs',
  'sortDefsChildren',
  'removeTitle',
  'removeDesc',
];

export const GRADIENT_PRESETS: GradientValue[] = [
  {
    rotation: 90,
    type: 'linear',
    colorStops: [
      { id: uuid(), color: '#227db2', offset: 0 },
      { id: uuid(), color: '#54149b', offset: 100 },
    ],
  },
  {
    rotation: 90,
    type: 'radial',
    colorStops: [
      { id: uuid(), color: '#3784c9', offset: 0 },
      { id: uuid(), color: '#012337', offset: 85 },
    ],
  },
  {
    rotation: 90,
    type: 'linear',
    colorStops: [
      { id: uuid(), color: '#610d95', offset: 0 },
      { id: uuid(), color: '#c32e2e', offset: 50 },
      { id: uuid(), color: '#b67a22', offset: 100 },
    ],
  },
  {
    rotation: 90,
    type: 'radial',
    colorStops: [
      { id: uuid(), color: '#dadadb', offset: 0 },
      { id: uuid(), color: '#B7B7B7', offset: 100 },
    ],
  },
  {
    rotation: 135,
    type: 'linear',
    colorStops: [
      { id: uuid(), color: '#0db0cc', offset: 0 },
      { id: uuid(), color: '#0990b1', offset: 40 },
      { id: uuid(), color: '#154f64', offset: 100 },
    ],
  },
  {
    rotation: 90,
    type: 'linear',
    colorStops: [
      {
        id: uuid(),
        color: '#2381A6',
        offset: 0,
      },
      {
        id: uuid(),
        color: '#57BD81',
        offset: 50,
      },
      {
        id: uuid(),
        color: '#F0E159',
        offset: 100,
      },
    ],
  },
  {
    rotation: 55,
    type: 'linear',
    colorStops: [
      { id: uuid(), color: '#c892fd', offset: 0 },
      { id: uuid(), color: '#8757f3', offset: 40 },
      { id: uuid(), color: '#6063f1', offset: 80 },
      { id: uuid(), color: '#1d1a4b', offset: 100 },
    ],
  },
  {
    rotation: 300,
    type: 'linear',
    colorStops: [
      { id: uuid(), color: '#0e9bb9', offset: 0 },
      { id: uuid(), color: '#1138c2', offset: 50 },
      { id: uuid(), color: '#5c088d', offset: 100 },
    ],
  },
  {
    rotation: 90,
    type: 'linear',
    colorStops: [
      { id: uuid(), color: '#0e9bb9', offset: 0 },
      { id: uuid(), color: '#ff0000', offset: 10 },
      { id: uuid(), color: '#ff9a00', offset: 20 },
      { id: uuid(), color: '#d0de21', offset: 30 },
      { id: uuid(), color: '#4fdc4a', offset: 40 },
      { id: uuid(), color: '#3fdad8', offset: 50 },
      { id: uuid(), color: '#2fc9e2', offset: 60 },
      { id: uuid(), color: '#1c7fee', offset: 70 },
      { id: uuid(), color: '#5f15f2', offset: 80 },
      { id: uuid(), color: '#ba0cf8', offset: 90 },
      { id: uuid(), color: '#ff0000', offset: 100 },
    ],
  },
];

export const USER_STORAGE_PREFS_KEY = 'user-storage-pref';
