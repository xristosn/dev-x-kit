import { CodeSplitView } from '@/components/code-split-view';
import { FaqSection } from '@/components/faq-section';
import type { FaqItem } from '@/components/faq-section';
import { svgToReact } from '@/lib/actions/convert/svg';
import { SVGO_VALUES } from '@/lib/constants';
import { createConvertOptions } from '@/lib/create-convert-options';

const FAQS = [
  {
    title: 'What does the generated React component include?',
    description:
      'The output is a component named MyComponent. TypeScript generation is enabled by default, and the JSX runtime option controls whether the output includes runtime-specific imports or uses automatic JSX. Choose the settings that match your project, then rename the component as needed.',
  },
  {
    title: 'How can I control the generated SVG dimensions?',
    description:
      'Keep width and height attributes enabled to retain the root SVG dimensions. You can also provide a custom value such as 1em, px, or rem to replace them. If the custom value is omitted, the tool uses 1em for the icon size.',
  },
  {
    title: 'How do I pass props or a ref to the SVG?',
    description:
      'The expand props option controls whether component props are forwarded to the SVG and whether they are placed before or after its existing attributes. Enable Forward Ref only if your component needs to expose a ref to the underlying SVG element.',
  },
  {
    title: 'Does conversion optimize the SVG markup?',
    description:
      'SVGO is enabled by default for this converter. You can turn it off or change its plugin settings; Prettier formatting is controlled separately. Review the generated component in your project, since the converter does not add application-specific imports or behavior.',
  },
] satisfies readonly FaqItem[];

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
    <>
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
      <FaqSection items={FAQS} />
    </>
  );
}
