import { CodeSplitView } from '@/components/code-split-view/code-split-view';
import { jsonToToml } from '@/lib/actions/convert/json';

export default function JsonToMongooseSchema() {
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
        label: 'Toml',
        language: 'toml',
        sourceUrl: 'https://github.com/iarna/iarna-toml',
      }}
      converter={jsonToToml}
    />
  );
}
