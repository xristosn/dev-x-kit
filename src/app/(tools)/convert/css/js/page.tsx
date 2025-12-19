import { CodeSplitView } from '@/components/code-split-view/code-split-view';
import { cssToJs } from '@/lib/actions/convert/css';

export default function CssToJs() {
  return (
    <CodeSplitView
      input={{
        label: 'CSS',
        language: 'css',
        defaultValue: `body {
  text-align: center;
}

header {
  font-size: 26px;
  margin-bottom: 26px;
}`,
      }}
      output={{
        label: 'Javascript',
        language: 'javascript',
        sourceUrl: 'https://www.npmjs.com/package/@babel/core',
      }}
      converter={cssToJs}
    />
  );
}
