import { CodeSplitView } from '@/components/code-split-view/code-split-view';
import { CSS_TO_TAILWIND_V3_OPTIONS } from '../../css/tailwind-v3/page';
import { jssToTailwindV3 } from '@/lib/actions/convert/jss';

export default function JssToTailwindV3() {
  return (
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
  );
}
