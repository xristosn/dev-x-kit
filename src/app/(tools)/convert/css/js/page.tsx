import { CodeSplitView } from '@/components/code-split-view/code-split-view';
import { FaqSection } from '@/components/faq-section';
import type { FaqItem } from '@/components/faq-section';
import { cssToJs } from '@/lib/actions/convert/css';

const FAQS = [
  {
    title: 'What does the JavaScript output represent?',
    description:
      'The converter turns CSS selectors and declarations into a JavaScript object, for example a selector key containing its style properties. It does not apply styles to the page or generate a React component, so adapt the object to the CSS-in-JS API your project uses.',
  },
  {
    title: 'Does it preserve CSS exactly as written?',
    description:
      'The output represents validated CSS rules as JavaScript data, not as a copy of the original stylesheet. Check selector and property handling in the generated object before using it in an application.',
  },
  {
    title: 'Why does the converter reject my stylesheet?',
    description:
      'The input is validated as CSS before conversion. Fix syntax errors such as unmatched braces or malformed declarations, then convert again.',
  },
] satisfies readonly FaqItem[];

export default function CssToJs() {
  return (
    <>
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
      <FaqSection items={FAQS} />
    </>
  );
}
