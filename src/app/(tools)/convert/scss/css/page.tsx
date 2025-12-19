import { CodeSplitView } from '@/components/code-split-view/code-split-view';
import { scssToCss } from '@/lib/actions/convert/scss';
import { createConvertOptions } from '@/lib/create-convert-options';

const OPTIONS = createConvertOptions([
  {
    label: 'Style',
    name: 'style',
    type: 'radio',
    defaultValue: 'expanded',
    values: [
      { label: 'Expanded', value: 'expanded' },
      { label: 'Compressed', value: 'compressed' },
    ],
  },
]);

export default function ScssToCss() {
  return (
    <CodeSplitView
      input={{
        label: 'SCSS',
        language: 'scss',
        defaultValue: `body {
  text-align: center;
  > #container {
    text-align: left;
    margin: 0 auto;
    width: 500px;
  }
}

header {
  h1 {
    font-size: 26px;
    margin-bottom: 26px;
  }
}`,
      }}
      output={{
        label: 'CSS',
        language: 'css',
        sourceUrl: 'https://www.npmjs.com/package/sass',
      }}
      converter={scssToCss}
      options={OPTIONS}
    />
  );
}
