import { createConvertOptions } from '@/lib/create-convert-options';
import { ConvertOptionRadio } from '@/types/convert';

const UNIT_VALUES: ConvertOptionRadio['values'] = ['px', 'rem', 'em', '%', 'vw', 'vh'].map((v) => ({
  label: v,
  value: v,
}));

export const CSS_OPTIONS = createConvertOptions([
  {
    name: 'generateClassIds',
    label: 'Suffix class names with ids',
    type: 'switch',
    defaultValue: false,
  },
  {
    name: 'transformShortProps',
    label: 'Transform short properties (ml to margin-left)',
    type: 'switch',
    defaultValue: true,
  },
  {
    name: 'defaultUnitValues',
    label: 'Default units for numeric values',
    type: 'switch',
    defaultValue: true,
    children: [
      {
        name: 'defaultUnits["font-size"]',
        label: 'Font size unit',
        type: 'radio',
        values: UNIT_VALUES,
        defaultValue: 'px',
      },
      {
        name: 'defaultUnits["line-height"]',
        label: 'Line height unit',
        type: 'radio',
        values: UNIT_VALUES,
        defaultValue: 'px',
      },
      {
        name: 'defaultUnits["width"]',
        label: 'Sizes unit (width / height)',
        type: 'radio',
        values: UNIT_VALUES,
        defaultValue: 'px',
      },
      {
        name: 'defaultUnits["margin"]',
        label: 'Margins unit',
        type: 'radio',
        values: UNIT_VALUES,
        defaultValue: 'px',
      },
      {
        name: 'defaultUnits["padding"]',
        label: 'Paddings unit',
        type: 'radio',
        values: UNIT_VALUES,
        defaultValue: 'px',
      },
      {
        name: 'defaultUnits["border"]',
        label: 'Border unit',
        type: 'radio',
        values: UNIT_VALUES,
        defaultValue: 'px',
      },
      {
        name: 'defaultUnits["top"]',
        label: 'Position unit',
        type: 'radio',
        values: UNIT_VALUES,
        defaultValue: 'px',
      },
    ],
  },
]);
