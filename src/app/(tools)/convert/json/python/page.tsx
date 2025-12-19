import { CodeSplitView } from '@/components/code-split-view/code-split-view';
import { jsonToPython } from '@/lib/actions/convert/json';
import { createConvertOptionsFromQuicktypeOptions } from '@/lib/create-convert-options';
import { RustTargetLanguage } from 'quicktype-core';

const OPTIONS = createConvertOptionsFromQuicktypeOptions(new RustTargetLanguage());

export default function JsonToPython() {
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
        label: 'Python',
        language: 'python',
        sourceUrl: 'https://github.com/glideapps/quicktype',
      }}
      converter={jsonToPython}
      options={OPTIONS}
    />
  );
}
