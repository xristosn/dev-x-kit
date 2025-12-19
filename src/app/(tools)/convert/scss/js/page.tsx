import { CodeSplitView } from '@/components/code-split-view/code-split-view';
import { scssToJs } from '@/lib/actions/convert/scss';

export default function ScssToJs() {
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
        label: 'Javascript',
        language: 'javascript',
        sourceUrl: 'https://www.npmjs.com/package/sass',
      }}
      converter={scssToJs}
    />
  );
}
