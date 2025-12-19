import { CodeSplitView } from '@/components/code-split-view/code-split-view';
import { cssToScss } from '@/lib/actions/convert/css';

export default function CssToScss() {
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
        label: 'SCSS',
        language: 'scss',
        sourceUrl: 'https://www.npmjs.com/package/@gecka/styleflux',
      }}
      converter={cssToScss}
    />
  );
}
