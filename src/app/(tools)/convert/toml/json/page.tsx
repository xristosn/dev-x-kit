import { CodeSplitView } from '@/components/code-split-view/code-split-view';
import { FaqSection } from '@/components/faq-section';
import type { FaqItem } from '@/components/faq-section';
import { tomlToJson } from '@/lib/actions/convert/toml';

const FAQS = [
  {
    title: 'Are TOML comments and formatting copied into the JSON output?',
    description:
      'No. The converter parses TOML values and formats them as JSON, so comments and the original spacing or table layout are not retained. Add any explanatory notes separately if the JSON will be maintained by hand.',
  },
  {
    title: 'How do TOML tables and arrays of tables appear in JSON?',
    description:
      'TOML tables become JSON objects, while arrays of tables become JSON arrays of objects. The converter preserves the parsed data structure, but the resulting JSON is formatted independently of the TOML layout.',
  },
  {
    title: 'Does JSON give TOML date and time values a special date type?',
    description:
      'JSON has no built-in date type. TOML date and time values are represented as serialized values in the JSON output, so parse them explicitly in your application if you need date objects.',
  },
] satisfies readonly FaqItem[];

export default function TomlToJson() {
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
          sourceUrl: 'https://github.com/iarna/iarna-toml',
        }}
        converter={tomlToJson}
      />
      <FaqSection items={FAQS} />
    </>
  );
}
