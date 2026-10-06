import { CodeSplitView } from '@/components/code-split-view/code-split-view';
import { FaqSection } from '@/components/faq-section';
import type { FaqItem } from '@/components/faq-section';
import { jssToScss } from '@/lib/actions/convert/jss';
import { CSS_OPTIONS } from '../css/_lib/constants';

const FAQS = [
  {
    title: 'How does JSS become SCSS in this converter?',
    description:
      'The converter first turns the JSS style objects into CSS, then converts that CSS syntax to SCSS. Nested selectors and media queries can be represented in the output, but review the result against the original JSS when selector behavior matters.',
  },
  {
    title: 'Does it create reusable Sass variables or mixins?',
    description:
      'No. This conversion preserves style rules as SCSS syntax; it does not infer shared values and refactor them into Sass variables or mixins. Add those abstractions manually after reviewing repeated values.',
  },
  {
    title: 'Do the CSS conversion options also apply to SCSS?',
    description:
      'Yes. This page uses the same CSS conversion options as JSS to CSS, including shorthand expansion and numeric default units. Adjust those settings before converting if you need different CSS declarations in the SCSS output.',
  },
] satisfies readonly FaqItem[];

export default function JssToScss() {
  return (
    <>
      <CodeSplitView
        input={{
          label: 'JSS',
          language: 'typescript',
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
  },

  '@media (max-width: 600px)': {
    padding: '8px 12px',
    fontSize: '14px',
  }
};

const cardComponentStyles = {
  width: '300px',
  margin: '20px',
  borderRadius: '10px',
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
  backgroundColor: '#ffffff',
  fontFamily: 'Arial, sans-serif',
  overflow: 'hidden',

  '& > .card-header': {
    backgroundColor: '#f8f9fa',
    padding: '15px',
    borderBottom: '1px solid #e9ecef',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: '1.2em',


    '&:hover': {
      color: '#007bff',
    }
  },

  '& > .card-body': {
    padding: '20px',
    lineHeight: '1.6',
    color: '#333333',
  },

  '@media (prefers-color-scheme: dark)': {
    backgroundColor: '#333333',
    color: '#f5f5f5',
    boxShadow: '0 4px 15px rgba(255, 255, 255, 0.1)',


    '& > .card-header': {
      backgroundColor: '#444444',
      borderBottomColor: '#555555',
    },
  }
};`,
        }}
        output={{
          label: 'SCSS',
          language: 'scss',
          sourceUrl: 'https://www.npmjs.com/package/jss',
        }}
        converter={jssToScss}
        options={CSS_OPTIONS}
      />
      <FaqSection items={FAQS} />
    </>
  );
}
