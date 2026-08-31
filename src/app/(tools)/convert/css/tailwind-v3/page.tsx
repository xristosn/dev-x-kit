import { CodeSplitView } from '@/components/code-split-view/code-split-view';
import { cssToTailwindV3 } from '@/lib/actions/convert/css';
import { CSS_TO_TAILWIND_V3_OPTIONS } from './options';

export default function CssToTailwindV3() {
  return (
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
  );
}
