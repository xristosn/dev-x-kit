import { CodeSplitView } from '@/components/code-split-view/code-split-view';
import { FaqSection } from '@/components/faq-section';
import type { FaqItem } from '@/components/faq-section';
import { tomlToYaml } from '@/lib/actions/convert/toml';

const FAQS = [
  {
    title: 'Are TOML comments preserved in the YAML output?',
    description:
      'No. TOML is parsed into data before YAML is generated, so comments and the original spacing or table layout are discarded. Add comments to the YAML output separately if you need them.',
  },
  {
    title: 'How are TOML tables and arrays of tables represented in YAML?',
    description:
      'Tables become YAML mappings, and arrays of tables become sequences of mappings. The converter carries over the parsed data structure, not TOML-specific syntax or formatting.',
  },
  {
    title: 'Will the YAML keep the same layout as my TOML file?',
    description:
      'No. The YAML is newly serialized from the parsed TOML values. Review the result before using it in a configuration file, especially if your project expects particular keys or conventions.',
  },
] satisfies readonly FaqItem[];

export default function TomlToYaml() {
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
          label: 'YAML',
          language: 'yaml',
        }}
        converter={tomlToYaml}
      />
      <FaqSection items={FAQS} />
    </>
  );
}
