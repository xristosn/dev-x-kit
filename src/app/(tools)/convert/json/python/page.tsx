import { CodeSplitView } from '@/components/code-split-view/code-split-view';
import { FaqSection } from '@/components/faq-section';
import type { FaqItem } from '@/components/faq-section';
import { jsonToPython } from '@/lib/actions/convert/json';
import { createConvertOptionsFromQuicktypeOptions } from '@/lib/create-convert-options';
import { RustTargetLanguage } from 'quicktype-core';

const OPTIONS = createConvertOptionsFromQuicktypeOptions(new RustTargetLanguage());

const FAQS = [
  {
    title: 'How do nested objects and lists affect the generated Python?',
    description:
      'The converter uses the JSON sample in the editor to infer the Python data structures. Include representative nested objects and list items, then compare the output with other payload variants that may contain different fields or value shapes.',
  },
  {
    title: 'What if a property can be missing or null?',
    description:
      'One JSON sample cannot show every optional-field case in your data. Check the generated Python against responses where properties are omitted or null, and update the code to handle those cases before using it with production payloads.',
  },
  {
    title: 'Can I use the generated output as runtime input validation?',
    description:
      'Generated Python code reflects the sample but does not establish that future input conforms to your full data contract. Add runtime validation in your application when incoming JSON must be checked before use.',
  },
] satisfies readonly FaqItem[];

export default function JsonToPython() {
  return (
    <>
      <CodeSplitView
        input={{
          label: 'JSON',
          language: 'json',
          defaultValue: `{
  "recipe_id": "RC-721",
  "name": "Spiced Lentil Soup",
  "prep_time_minutes": 15,
  "cook_time_minutes": 45,
  "servings": 6,
  "ingredients": [
    {
      "name": "Red Lentils",
      "quantity": 1.5,
      "unit": "cups"
    },
    {
      "name": "Vegetable Broth",
      "quantity": 6,
      "unit": "cups"
    },
    {
      "name": "Diced Onion",
      "quantity": 1,
      "unit": "medium"
    },
    {
      "name": "Curry Powder",
      "quantity": 2,
      "unit": "teaspoons"
    },
    {
      "name": "Diced Carrots",
      "quantity": 2,
      "unit": "cups"
    }
  ],
  "is_vegetarian": true,
  "difficulty": "Easy"
}`,
        }}
        output={{
          label: 'Python',
          language: 'python',
          sourceUrl: 'https://github.com/glideapps/quicktype',
        }}
        converter={jsonToPython}
        options={OPTIONS}
      />
      <FaqSection items={FAQS} />
    </>
  );
}
