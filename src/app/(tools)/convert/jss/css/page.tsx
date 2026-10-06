import { CodeSplitView } from '@/components/code-split-view/code-split-view';
import { FaqSection } from '@/components/faq-section';
import type { FaqItem } from '@/components/faq-section';
import { jssToCss } from '@/lib/actions/convert/jss';
import { CSS_OPTIONS } from './_lib/constants';

const FAQS = [
  {
    title: 'Can I paste a JSS style object without a variable declaration?',
    description:
      'Yes. The converter accepts style objects declared with const, let, or var, and also has a fallback for a bare style object. A declared object’s variable name becomes its CSS selector unless you enable generated class IDs.',
  },
  {
    title: 'How are nested selectors and media queries converted?',
    description:
      'Nested selectors such as &:hover and nested at-rules such as media queries are converted into CSS rules. Review the generated selectors and breakpoints in context, especially when the source uses nested selectors that depend on the original component class.',
  },
  {
    title: 'What do the shorthand and unit options change?',
    description:
      'The Transform short properties option expands JSS shortcuts such as ml into margin-left. The Default units option adds units to numeric values for supported properties such as font size, width, margin, and padding. Both options are on by default, with px selected for each unit setting.',
  },
] satisfies readonly FaqItem[];

export default function JssToCss() {
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
          label: 'CSS',
          language: 'css',
          sourceUrl: 'https://www.npmjs.com/package/jss',
        }}
        converter={jssToCss}
        options={CSS_OPTIONS}
      />
      <FaqSection items={FAQS} />
    </>
  );
}
