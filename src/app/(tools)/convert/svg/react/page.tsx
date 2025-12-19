import { CodeSplitView } from '@/components/code-split-view';
import { svgToReact } from '@/lib/actions/convert/svg';
import { SVGO_VALUES } from '@/lib/constants';
import { createConvertOptions } from '@/lib/create-convert-options';

const OPTIONS = createConvertOptions([
  {
    label: 'JSX Runtime',
    name: 'jsxRuntime',
    type: 'radio',
    defaultValue: 'automatic',
    values: [
      {
        label: 'Classic',
        value: 'classic',
        helperText: 'Adds "import * as React from \'react\'" on the top of file',
      },
      {
        label: 'Automatic',
        value: 'automatic',
        helperText: 'Do not add anything',
      },
      {
        label: 'Classic Preact',
        value: 'classic-preact',
        helperText: 'Adds "import { h } from \'preact\'" on the top of file',
      },
    ],
  },
  {
    label: 'Replace SVG width and height by a custom value',
    name: 'icon',
    type: 'text',
    defaultValue: '',
    helperText:
      'If value is omitted, it uses 1em in order to make SVG size inherits from text size.',
    placeholder: 'Value in px, em, rem, etc.',
  },
  {
    label: 'Generate TypeScript typings',
    name: 'typescript',
    type: 'switch',
    defaultValue: true,
  },
  {
    label: 'Keep width and height attributes from the root SVG tag.',
    name: 'dimensions',
    type: 'switch',
    defaultValue: true,
  },
  {
    label: 'Use Prettier to format JavaScript code output',
    name: 'prettier',
    type: 'switch',
    defaultValue: true,
  },
  {
    label: 'All properties given to component will be forwarded on SVG tag',
    name: 'expandProps',
    type: 'radio',
    defaultValue: 'end',
    values: [
      { label: 'None', value: 'none' },
      { label: 'Start', value: 'start' },
      { label: 'End', value: 'end' },
    ],
  },
  {
    label: 'Forward Ref?',
    name: 'ref',
    type: 'switch',
    defaultValue: false,
  },
  {
    label: 'Use SVGO to optimize SVG code',
    name: 'svgo',
    type: 'switch',
    defaultValue: true,
    children: [
      {
        label: 'Use default template',
        name: 'useDefault',
        type: 'switch',
        defaultValue: true,
        reverse: true,
        children: SVGO_VALUES.map((v) => ({
          label: v,
          name: `svgoConfig.plugins.${v}`,
          type: 'switch',
          defaultValue: false,
        })),
      },
    ],
  },
]);

export default function SvgToReact() {
  return (
    <CodeSplitView
      input={{
        label: 'SVG',
        language: 'html',
        defaultValue: `<svg xmlns="http://www.w3.org/2000/svg"
  xmlns:xlink="http://www.w3.org/1999/xlink">
  <rect x="10" y="10" height="100" width="100"
    style="stroke:#ff0000; fill: #0000ff"/>
</svg>`,
      }}
      output={{
        label: 'React',
        language: 'typescript',
        sourceUrl: 'https://github.com/svg/svgo',
      }}
      options={OPTIONS}
      converter={svgToReact}
    />
  );
}
