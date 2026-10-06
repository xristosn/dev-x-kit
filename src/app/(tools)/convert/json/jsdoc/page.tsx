import { CodeSplitView } from '@/components/code-split-view/code-split-view';
import { FaqSection } from '@/components/faq-section';
import type { FaqItem } from '@/components/faq-section';
import { jsonToJsDoc } from '@/lib/actions/convert/json';
import { JSON_TO_JSDOC_OPTIONS } from './_lib/constants';

const FAQS = [
  {
    title: 'Why does the output contain several @typedef declarations?',
    description:
      'Nested JSON objects are represented as separate JSDoc typedefs, then referenced by the typedef for their parent object. This lets you reuse the generated object types in editor tooling instead of writing one large inline type.',
  },
  {
    title: 'What do the Types prefix and Types suffix options change?',
    description:
      'They add text before and after generated type names. For example, a suffix can distinguish these typedefs from existing names in your project. Keep the chosen names valid and consistent with how your code refers to the generated types.',
  },
  {
    title: 'Why can a null value produce an any type in the JSDoc output?',
    description:
      'A single null sample does not tell the converter what non-null value might appear in that field, so its generated type can be broad. Replace that type with the actual union or domain type once you know the field’s possible values.',
  },
] satisfies readonly FaqItem[];

export default function JsonToJsDoc() {
  return (
    <>
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
      <FaqSection items={FAQS} />
    </>
  );
}
