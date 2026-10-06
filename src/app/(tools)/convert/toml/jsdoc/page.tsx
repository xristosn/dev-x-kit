import { CodeSplitView } from '@/components/code-split-view/code-split-view';
import { FaqSection } from '@/components/faq-section';
import type { FaqItem } from '@/components/faq-section';
import { tomlToJsDoc } from '@/lib/actions/convert/toml';
import { JSON_TO_JSDOC_OPTIONS } from '../../json/jsdoc/_lib/constants';

const FAQS = [
  {
    title: 'Do the generated JSDoc types validate a TOML configuration?',
    description:
      'No. JSDoc annotations describe expected values for editor tooling and type checkers, but they do not parse or validate TOML at runtime. Use a TOML parser and add runtime checks if the configuration must be validated.',
  },
  {
    title: 'What happens if other TOML files have fields missing from this example?',
    description:
      'Those fields cannot be inferred from the current document. The generated typedefs reflect the parsed sample, so compare them with the other valid shapes your application accepts and revise the types as needed.',
  },
  {
    title: 'Can I avoid JSDoc type-name collisions in my project?',
    description:
      'Yes. The shared JSDoc options let you add a prefix or suffix to generated type names. Choose names that do not conflict with existing typedefs and use them consistently in your code.',
  },
] satisfies readonly FaqItem[];

export default function TomlToJsDoc() {
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
          label: 'JSDoc',
          language: 'javascript',
        }}
        converter={tomlToJsDoc}
        options={JSON_TO_JSDOC_OPTIONS}
      />
      <FaqSection items={FAQS} />
    </>
  );
}
