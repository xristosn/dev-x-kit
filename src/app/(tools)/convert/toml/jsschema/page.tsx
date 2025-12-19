import { CodeSplitView } from '@/components/code-split-view/code-split-view';
import { tomlToJsonSchema } from '@/lib/actions/convert/toml';
import { createConvertOptionsFromQuicktypeOptions } from '@/lib/create-convert-options';
import { JSONSchemaTargetLanguage } from 'quicktype-core';

const OPTIONS = createConvertOptionsFromQuicktypeOptions(new JSONSchemaTargetLanguage());

export default function TomlToJsonSchema() {
  return (
    <CodeSplitView
      input={{
        label: 'Toml',
        language: 'toml',
        defaultValue: `recipe_id = "RC-721"
name = "Spiced Lentil Soup"
prep_time_minutes = 15
cook_time_minutes = 45
servings = 6
is_vegetarian = true
difficulty = "Easy"

[[ingredients]]
name = "Red Lentils"
quantity = 1.5
unit = "cups"

[[ingredients]]
name = "Vegetable Broth"
quantity = 6
unit = "cups"

[[ingredients]]
name = "Diced Onion"
quantity = 1
unit = "medium"

[[ingredients]]
name = "Curry Powder"
quantity = 2
unit = "teaspoons"

[[ingredients]]
name = "Diced Carrots"
quantity = 2
unit = "cups"
`,
      }}
      output={{
        label: 'JSON',
        language: 'json',
      }}
      converter={tomlToJsonSchema}
      options={OPTIONS}
    />
  );
}
