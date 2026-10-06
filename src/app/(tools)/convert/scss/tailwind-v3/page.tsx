import { CodeSplitView } from '@/components/code-split-view/code-split-view';
import { FaqSection } from '@/components/faq-section';
import type { FaqItem } from '@/components/faq-section';
import { scssToTailwindV3 } from '@/lib/actions/convert/scss';
import { CSS_TO_TAILWIND_V3_OPTIONS } from '../../css/tailwind-v3/_lib/constants';

const FAQS = [
  {
    title: 'What happens to SCSS variables and nesting?',
    description:
      'The converter compiles SCSS to CSS before translating the resulting rules. Sass variables, mixins, and nesting are resolved during that step, so the Tailwind output reflects the compiled styles rather than preserving Sass source constructs.',
  },
  {
    title: 'How do I map the output back to my elements?',
    description:
      'Generated classes are grouped beneath comments naming their original CSS selectors. Add the corresponding classes to the matching elements yourself; the converter does not rewrite your HTML or component markup.',
  },
  {
    title: 'Can I set a prefix for generated utilities?',
    description:
      'Yes. Use the Class Prefix option to prepend your project’s configured Tailwind prefix to generated class names. Keep it consistent with the prefix configured in your Tailwind v3 setup.',
  },
] satisfies readonly FaqItem[];

export default function ScssToTailwindV3() {
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
          label: 'HTML',
          language: 'html',
          sourceUrl: 'https://www.npmjs.com/package/css-to-tailwind-translator',
        }}
        converter={scssToTailwindV3}
        options={CSS_TO_TAILWIND_V3_OPTIONS}
      />
      <FaqSection items={FAQS} />
    </>
  );
}
