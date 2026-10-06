import { CodeSplitView } from '@/components/code-split-view/code-split-view';
import { FaqSection } from '@/components/faq-section';
import type { FaqItem } from '@/components/faq-section';
import { jsonToMongooseSchema } from '@/lib/actions/convert/json';

const FAQS = [
  {
    title: 'What does the Mongoose output contain?',
    description:
      'The converter returns a JSON-formatted schema definition inferred from your sample. It does not create a Mongoose model, connect to MongoDB, or install anything; review and integrate the definition in your application.',
  },
  {
    title: 'Can the schema represent fields missing from my example?',
    description:
      'No sample can show every field or value variation in a collection. Include a representative document and then compare the generated definition with your full data contract, adding any missing fields and rules yourself.',
  },
  {
    title: 'Should I use the generated schema without changes?',
    description:
      'Treat it as a starting point, not a complete application schema. Check requiredness, validation rules, defaults, and any application-specific indexes or relationships before using it with your Mongoose models.',
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
          label: 'Mongoose Schema',
          language: 'json',
          sourceUrl: 'https://github.com/nijikokun/generate-schema',
        }}
        converter={jsonToMongooseSchema}
      />
      <FaqSection items={FAQS} />
    </>
  );
}
