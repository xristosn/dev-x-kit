import { CodeSplitView } from '@/components/code-split-view/code-split-view';
import { FaqSection } from '@/components/faq-section';
import type { FaqItem } from '@/components/faq-section';
import { jsonToMySql } from '@/lib/actions/convert/json';
import { createConvertOptions } from '@/lib/create-convert-options';

const OPTIONS = createConvertOptions([
  {
    label: 'Table name',
    name: 'tableName',
    type: 'text',
    defaultValue: 'Root',
  },
]);

const FAQS = [
  {
    title: 'How do I name the generated MySQL table?',
    description:
      'Enter the desired table name in the Table name option. The default is Root; use a name that matches your database naming conventions and review the generated SQL before running it.',
  },
  {
    title: 'Does the converter create or update a MySQL database?',
    description:
      'No. It returns SQL generated from the JSON sample; it does not connect to a database or execute the statement. Review the output for compatibility with your MySQL version and schema before applying it.',
  },
  {
    title: 'Will one JSON example capture every column I need?',
    description:
      'The schema is generated from the object you provide. Compare it with representative records from your dataset, especially if fields can be absent, null, or have different value shapes, and adjust the SQL to your actual data requirements.',
  },
] satisfies readonly FaqItem[];

export default function JsonToMySQL() {
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
          label: 'MySQL',
          language: 'sql',
          sourceUrl: 'https://github.com/nijikokun/generate-schema',
        }}
        converter={jsonToMySql}
        options={OPTIONS}
      />
      <FaqSection items={FAQS} />
    </>
  );
}
