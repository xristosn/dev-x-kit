import { CodeSplitView } from '@/components/code-split-view/code-split-view';
import { jsonToJsDoc } from '@/lib/actions/convert/json';
import { createConvertOptions } from '@/lib/create-convert-options';

export const JSON_TO_JSDOC_OPTIONS = createConvertOptions([
  {
    label: 'Types prefix',
    name: 'typesPrefix',
    type: 'text',
    defaultValue: '',
  },
  {
    label: 'Types suffix',
    name: 'typesSuffix',
    type: 'text',
    defaultValue: '',
  },
]);

export default function JsonToJsDoc() {
  return (
    <CodeSplitView
      input={{
        label: 'JSON',
        language: 'json',
        defaultValue: `{
  "employee_id": "EMP-3091",
  "first_name": "Marcus",
  "last_name": "Chen",
  "position": "Senior Data Scientist",
  "department": "Research & Development",
  "hire_date": "2020-08-15",
  "is_full_time": true,
  "contact": {
    "email": "marcus.chen@foobar.com",
    "phone": "555-123-4567"
  },
  "benefits_enrolled": ["Health Insurance", "401k", "Dental"]
}`,
      }}
      output={{
        label: 'JSDoc',
        language: 'javascript',
        sourceUrl: 'https://gitlab.com/nvidia1997/json-to-jsdoc-converter',
      }}
      converter={jsonToJsDoc}
      options={JSON_TO_JSDOC_OPTIONS}
    />
  );
}
