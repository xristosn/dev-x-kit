import { CodeSplitView } from '@/components/code-split-view/code-split-view';
import { cssToTailwindV3 } from '@/lib/actions/convert/css';
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

export default function CssToTailwindV3() {
  return (
    <CodeSplitView
      input={{
        label: 'CSS',
        language: 'css',
        defaultValue: `body {
  text-align: center;
  background-color: #111;
}

body header {
  font-size: 26px;
  margin-bottom: 26px;
  background-color: #111;
}`,
      }}
      output={{
        label: 'HTML',
        language: 'html',
        sourceUrl: 'https://www.npmjs.com/package/css-to-tailwind-translator',
      }}
      converter={cssToTailwindV3}
      options={CSS_TO_TAILWIND_V3_OPTIONS}
    />
  );
}
