import { CodeSplitView } from '@/components/code-split-view/code-split-view';
import { FaqSection } from '@/components/faq-section';
import type { FaqItem } from '@/components/faq-section';
import { jsonToToml } from '@/lib/actions/convert/json';

const FAQS = [
  {
    title: 'Why does the TOML output use different syntax for nested JSON?',
    description:
      'JSON objects and arrays are serialized into TOML tables and array syntax rather than copied as JSON text. The result is newly formatted TOML, so review the generated structure if you need a particular configuration-file layout.',
  },
  {
    title: 'Will a date written as a JSON string become a TOML date?',
    description:
      'No. A quoted date in JSON is parsed as a string, so the converter serializes it as a TOML string. If your configuration needs a TOML date or date-time value, edit the output to use the appropriate TOML value.',
  },
  {
    title: 'Are comments from the input preserved in TOML?',
    description:
      'JSON input does not support comments, and this converter parses the data before serializing it again. Add TOML comments to the generated output after conversion if your configuration needs them.',
  },
] satisfies readonly FaqItem[];

export default function JsonToMongooseSchema() {
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
          label: 'Toml',
          language: 'toml',
          sourceUrl: 'https://github.com/iarna/iarna-toml',
        }}
        converter={jsonToToml}
      />
      <FaqSection items={FAQS} />
    </>
  );
}
