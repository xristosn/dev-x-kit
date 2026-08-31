import { createConvertOptions } from '@/lib/create-convert-options';

export const CSS_TO_TAILWIND_V3_OPTIONS = createConvertOptions([
{
    label: 'Use Tailwind default values',
    name: 'useAllDefaultValues',
    type: 'switch',
    defaultValue: true,
  },
  {
    label: 'Class Prefix',
    name: 'prefix',
    type: 'text',
    defaultValue: '',
  },
]);
