import { CodeSplitView } from '@/components/code-split-view/code-split-view';
import { FaqSection } from '@/components/faq-section';
import type { FaqItem } from '@/components/faq-section';
import { yamlToJsDoc } from '@/lib/actions/convert/yaml';
import { JSON_TO_JSDOC_OPTIONS } from '../../json/jsdoc/_lib/constants';

const FAQS = [
  {
    title: 'Do JSDoc typedefs validate YAML data at runtime?',
    description:
      'No. The generated typedefs provide documentation and can support editor tooling or static checks, but they do not parse or validate YAML. Add runtime validation if your application accepts configuration from untrusted or changeable sources.',
  },
  {
    title: 'What if another YAML file has fields missing from this example?',
    description:
      'The converter can infer only from the parsed document in the editor. Review other valid YAML shapes and update the generated typedefs if they contain optional fields or different value types.',
  },
  {
    title: 'How can I make generated JSDoc type names unique?',
    description:
      'Use the available type prefix and suffix options to distinguish generated typedefs from names already used in your project. Keep the naming choice consistent wherever those typedefs are referenced.',
  },
] satisfies readonly FaqItem[];

export default function YamlToJsDoc() {
  return (
    <>
      <CodeSplitView
        input={{
          label: 'Yaml',
          language: 'yaml',
          defaultValue: `city: Cloudhaven
country: Fantasyland
date: 2025-12-11
forecast:
  day:
    condition: Partly Cloudy
    temp_max_celsius: 18
    temp_min_celsius: 10
    wind_speed_kph: 15
  night:
    condition: Light Rain
    temp_celsius: 8
    humidity_percent: 85
alerts:
  - type: Advisory
    message: Moderate pollen count expected.
is_daylight_savings: false`,
        }}
        output={{
          label: 'JSDoc',
          language: 'javascript',
        }}
        converter={yamlToJsDoc}
        options={JSON_TO_JSDOC_OPTIONS}
      />
      <FaqSection items={FAQS} />
    </>
  );
}
