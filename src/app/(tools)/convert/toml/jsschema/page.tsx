import { CodeSplitView } from '@/components/code-split-view/code-split-view';
import { FaqSection } from '@/components/faq-section';
import type { FaqItem } from '@/components/faq-section';
import { tomlToJsonSchema } from '@/lib/actions/convert/toml';
import { createConvertOptionsFromQuicktypeOptions } from '@/lib/create-convert-options';
import { JSONSchemaTargetLanguage } from 'quicktype-core';

const OPTIONS = createConvertOptionsFromQuicktypeOptions(new JSONSchemaTargetLanguage());

const FAQS = [
  {
    title: 'Can this schema describe TOML documents beyond the one I entered?',
    description:
      'The schema is inferred from the parsed data in the current TOML document. It cannot discover fields or alternate shapes that are not present, so compare it with other valid examples and adjust the schema for those cases.',
  },
  {
    title: 'Does the generated JSON Schema validate the original TOML syntax?',
    description:
      'No. The converter first parses TOML into data, then generates a JSON Schema for that data structure. It does not describe TOML grammar or replace a TOML parser.',
  },
  {
    title: 'Will the schema include rules such as allowed values or numeric ranges?',
    description:
      'A sample shows observed values and structure, but it does not establish every business rule. Add constraints such as ranges, patterns, or allowed values yourself when they are part of your data contract.',
  },
] satisfies readonly FaqItem[];

export default function TomlToJsonSchema() {
  return (
    <>
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
      <FaqSection items={FAQS} />
    </>
  );
}
