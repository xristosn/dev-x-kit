import { createConvertOptions } from '@/lib/create-convert-options';

export const JSON_TO_JSDOC_OPTIONS = createConvertOptions([
  {
    label: 'Types prefix',
    name: 'typesPrefix',
    type: 'text',
    defaultValue: '',
  },
  {
    label: 'Types suffix',
    name: 'typesSuffix',
    type: 'text',
    defaultValue: '',
  },
]);
