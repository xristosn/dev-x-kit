import { CodeSplitView } from '@/components/code-split-view/code-split-view';
import { FaqSection } from '@/components/faq-section';
import type { FaqItem } from '@/components/faq-section';
import { jssToTailwindV3 } from '@/lib/actions/convert/jss';
import { CSS_TO_TAILWIND_V3_OPTIONS } from '../../css/tailwind-v3/_lib/constants';

const FAQS = [
  {
    title: 'Why is the output labeled HTML if it contains classes?',
    description:
      'The output groups generated Tailwind utility classes under comments naming each source selector. It is a guide for applying the classes to matching elements; the converter does not rewrite your HTML or JSX markup.',
  },
  {
    title: 'Why are some JSS declarations missing from the Tailwind output?',
    description:
      'Not every CSS declaration, selector, or custom value has a direct Tailwind v3 utility mapping. Treat the generated classes as a starting point, compare them with the original styles, and add custom CSS or utilities for anything that cannot be represented.',
  },
  {
    title: 'Does the converter use my Tailwind configuration?',
    description:
      'No. Use Tailwind default values controls whether the translator favors built-in defaults, and the prefix option lets you add a prefix to generated utility classes. Check the result against your project’s Tailwind configuration and adjust it if your theme or prefix differs.',
  },
] satisfies readonly FaqItem[];

export default function JssToTailwindV3() {
  return (
    <>
      <CodeSplitView
        input={{
          label: 'JSS',
          language: 'javascript',
          defaultValue: `const primaryButtonStyles = {
  backgroundColor: '#007bff',
  color: 'white',
  padding: '10px 15px',
  border: 'none',
  borderRadius: '5px',
  fontSize: '16px',
  cursor: 'pointer',
  transition: 'background-color 0.3s ease',
  display: 'flex',
  alignItems: 'center',
  marginLeft: 12,

  '&:hover': {
    backgroundColor: '#0056b3',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.15)',
  },

  '&:disabled': {
    backgroundColor: '#cccccc',
    cursor: 'not-allowed',
    opacity: '0.6',
  },

  '& > .button-icon': {
    marginRight: '8px',
    fontSize: '18px',

    '> svg path': {
      fill: 'white',
    },
  }
};`,
        }}
        output={{
          label: 'HTML',
          language: 'html',
          sourceUrl: 'https://www.npmjs.com/package/css-to-tailwind-translator',
        }}
        converter={jssToTailwindV3}
        options={CSS_TO_TAILWIND_V3_OPTIONS}
      />
      <FaqSection items={FAQS} />
    </>
  );
}
