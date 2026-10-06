import { CodeSplitView } from '@/components/code-split-view/code-split-view';
import { FaqSection } from '@/components/faq-section';
import type { FaqItem } from '@/components/faq-section';
import { scssToJs } from '@/lib/actions/convert/scss';

const FAQS = [
  {
    title: 'Are SCSS variables kept as JavaScript variables?',
    description:
      'No. The converter first compiles SCSS to CSS, then converts that CSS to a JavaScript object. Sass variables and nesting are resolved during compilation, so their resulting values appear in the output rather than live Sass declarations.',
  },
  {
    title: 'What does the generated JavaScript object contain?',
    description:
      'It represents the compiled CSS rules as selector-keyed style data. It is not a React component and does not automatically apply styles, so adapt the object to the styling API used by your application.',
  },
  {
    title: 'Why does valid-looking SCSS fail to convert?',
    description:
      'SCSS must compile successfully first, and the resulting CSS must also pass CSS validation. Check Sass syntax, then inspect the compiled styles for invalid CSS declarations if conversion still fails.',
  },
] satisfies readonly FaqItem[];

export default function ScssToJs() {
  return (
    <>
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
      <FaqSection items={FAQS} />
    </>
  );
}
