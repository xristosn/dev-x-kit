import { CodeSplitView } from '@/components/code-split-view/code-split-view';
import type { FaqItem } from '@/components/faq-section';
import { FaqSection } from '@/components/faq-section';
import { cssToScss } from '@/lib/actions/convert/css';

const FAQS = [
  {
    title: 'Can I use the result as a Sass stylesheet right away?',
    description:
      'The output is SCSS intended for the Sass compiler. Review it in your project build, especially if you plan to introduce Sass-only features that were not part of the original CSS.',
  },
  {
    title: 'What should I check when CSS conversion fails?',
    description:
      'This converter validates the input as CSS before converting it. Correct invalid syntax, including missing braces or malformed declarations, and submit the stylesheet again.',
  },
] satisfies readonly FaqItem[];

export default function CssToScss() {
  return (
    <>
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
      <FaqSection items={FAQS} />
    </>
  );
}
