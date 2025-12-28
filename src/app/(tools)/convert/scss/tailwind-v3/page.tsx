import { CodeSplitView } from '@/components/code-split-view/code-split-view';
import { scssToTailwindV3 } from '@/lib/actions/convert/scss';
import { CSS_TO_TAILWIND_V3_OPTIONS } from '../../css/tailwind-v3/page';

export default function ScssToTailwindV3() {
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
        label: 'HTML',
        language: 'html',
        sourceUrl: 'https://www.npmjs.com/package/css-to-tailwind-translator',
      }}
      converter={scssToTailwindV3}
      options={CSS_TO_TAILWIND_V3_OPTIONS}
    />
  );
}
