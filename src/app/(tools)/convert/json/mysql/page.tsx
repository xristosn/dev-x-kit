import { CodeSplitView } from '@/components/code-split-view/code-split-view';
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

export default function JsonToMySQL() {
  return (
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
  );
}
