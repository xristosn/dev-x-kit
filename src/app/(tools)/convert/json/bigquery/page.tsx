import { CodeSplitView } from '@/components/code-split-view/code-split-view';
import { FaqSection } from '@/components/faq-section';
import type { FaqItem } from '@/components/faq-section';
import { jsonToBigQuery } from '@/lib/actions/convert/json';

const FAQS = [
  {
    title: 'What does the BigQuery converter return?',
    description:
      'It returns a JSON-formatted BigQuery schema inferred from the sample you enter. It does not create a dataset or table, load rows, or connect to Google Cloud; use the schema in your own BigQuery workflow after reviewing it.',
  },
  {
    title: 'Will the generated schema cover every record in my dataset?',
    description:
      'The converter derives the schema from the provided JSON example. Compare it with representative records from the full dataset and adjust it for fields, nulls, or value variations that the sample does not show.',
  },
  {
    title: 'What should I check before using the schema to load data?',
    description:
      'Review the generated field names and types against the source data and the table design you need. Confirm that nested and repeated values match your intended BigQuery schema before using it in a load job.',
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
          label: 'BigQuery',
          language: 'json',
          sourceUrl: 'https://github.com/nijikokun/generate-schema',
        }}
        converter={jsonToBigQuery}
      />
      <FaqSection items={FAQS} />
    </>
  );
}
