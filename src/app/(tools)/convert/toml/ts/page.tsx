import { CodeSplitView } from '@/components/code-split-view/code-split-view';
import { FaqSection } from '@/components/faq-section';
import type { FaqItem } from '@/components/faq-section';
import { tomlToTypescript } from '@/lib/actions/convert/toml';
import { JSON_TO_TYPESCRIPT_OPTIONS } from '../../json/typescript/_lib/constants';

const FAQS = [
  {
    title: 'Does the generated TypeScript check TOML values at runtime?',
    description:
      'No. This route generates TypeScript declarations from the parsed TOML data. TypeScript types help during development, but they do not validate configuration values while your program is running.',
  },
  {
    title: 'Can the output include keys that are absent from my TOML example?',
    description:
      'No. The generator sees the current document only, so fields and alternate value shapes that are not present cannot be inferred. Compare the output with other valid configurations and update it to cover those cases.',
  },
  {
    title: 'Are TOML comments included in the TypeScript output?',
    description:
      'No. The converter parses TOML data before generating declarations, so source comments and formatting are not passed through. Add documentation comments to the generated code if you need to retain that context.',
  },
] satisfies readonly FaqItem[];

export default function TomlToTypescript() {
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
          label: 'Typescript',
          language: 'typescript',
        }}
        converter={tomlToTypescript}
        options={JSON_TO_TYPESCRIPT_OPTIONS}
      />
      <FaqSection items={FAQS} />
    </>
  );
}
