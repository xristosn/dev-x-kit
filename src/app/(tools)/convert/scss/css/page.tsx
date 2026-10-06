import { CodeSplitView } from '@/components/code-split-view/code-split-view';
import { FaqSection } from '@/components/faq-section';
import type { FaqItem } from '@/components/faq-section';
import { scssToCss } from '@/lib/actions/convert/scss';
import { createConvertOptions } from '@/lib/create-convert-options';

const FAQS = [
  {
    title: 'What happens to nested SCSS selectors?',
    description:
      'Sass compiles nested rules into regular CSS selectors. For example, a child selector nested inside a parent rule is emitted as a combined selector, so review the generated CSS if you need to confirm how the nesting resolved.',
  },
  {
    title: 'When should I choose expanded or compressed CSS?',
    description:
      'Expanded output keeps indentation and line breaks for easier review. Compressed output removes most formatting whitespace for a smaller, harder-to-read result. Choose the format that fits whether you are inspecting or preparing the CSS.',
  },
  {
    title: 'Are SCSS variables and mixins preserved in the CSS?',
    description:
      'No. Sass compiles those features into ordinary CSS declarations and selectors. The output is static CSS, so Sass variables and mixin definitions are not carried over as reusable source constructs.',
  },
] satisfies readonly FaqItem[];

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
          label: 'CSS',
          language: 'css',
          sourceUrl: 'https://www.npmjs.com/package/sass',
        }}
        converter={scssToCss}
        options={OPTIONS}
      />
      <FaqSection items={FAQS} />
    </>
  );
}
