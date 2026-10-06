import { CodeSplitView } from '@/components/code-split-view/code-split-view';
import { FaqSection } from '@/components/faq-section';
import type { FaqItem } from '@/components/faq-section';
import { cssToTailwindV3 } from '@/lib/actions/convert/css';
import { CSS_TO_TAILWIND_V3_OPTIONS } from './_lib/constants';

const FAQS = [
  {
    title: 'How do I use the generated classes with my HTML?',
    description:
      'The converter lists Tailwind classes under comments that identify the source CSS selector. Apply the classes to the matching HTML elements yourself; this tool converts the styles, not your markup.',
  },
  {
    title: 'What does “Use Tailwind default values” change?',
    description:
      'This option tells the translator to use Tailwind default values when mapping CSS declarations. Check the result against your project’s Tailwind v3 configuration, since the converter does not read your project theme.',
  },
  {
    title: 'Can every CSS declaration become a Tailwind utility?',
    description:
      'Not every selector or declaration necessarily has a direct utility mapping. Treat the output as a starting point and compare it with the original CSS, especially for custom rules or values outside Tailwind’s defaults.',
  },
] satisfies readonly FaqItem[];

export default function CssToTailwindV3() {
  return (
    <>
      <CodeSplitView
        input={{
          label: 'CSS',
          language: 'css',
          defaultValue: `.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 16px;
}

.button {
  padding: 8px 16px;
  background-color: #0066cc;
  color: white;
  border-radius: 4px;
  font-weight: 500;
  font-size: 14px;
  border: none;
  cursor: pointer;
}

.card {
  background: white;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  padding: 24px;
}`,
        }}
        output={{
          label: 'Tailwind CSS',
          language: 'html',
          sourceUrl: 'https://www.npmjs.com/package/css-to-tailwind-translator',
        }}
        converter={cssToTailwindV3}
        options={CSS_TO_TAILWIND_V3_OPTIONS}
      />
      <FaqSection items={FAQS} />
    </>
  );
}
