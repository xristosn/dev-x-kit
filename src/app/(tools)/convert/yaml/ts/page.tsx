import { CodeSplitView } from '@/components/code-split-view/code-split-view';
import { FaqSection } from '@/components/faq-section';
import type { FaqItem } from '@/components/faq-section';
import { yamlToTypescript } from '@/lib/actions/convert/yaml';
import { JSON_TO_TYPESCRIPT_OPTIONS } from '../../json/typescript/_lib/constants';

const FAQS = [
  {
    title: 'Does this generated TypeScript validate YAML when the app runs?',
    description:
      'No. The converter generates TypeScript declarations from parsed YAML data. Types help catch mistakes during development, but your application still needs a YAML parser and runtime validation for external configuration.',
  },
  {
    title: 'Can one YAML example reveal every optional field?',
    description:
      'No. The output is inferred from the current document only. If other valid documents omit fields or use different value shapes, compare those cases and update the generated types to reflect them.',
  },
  {
    title: 'Are YAML comments included in the TypeScript declarations?',
    description:
      'No. Comments and source formatting are not part of the parsed data passed to the type generator. Add documentation comments to the generated declarations separately if they are useful to your team.',
  },
] satisfies readonly FaqItem[];

export default function YamlToTypescript() {
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
          label: 'Typescript',
          language: 'typescript',
        }}
        converter={yamlToTypescript}
        options={JSON_TO_TYPESCRIPT_OPTIONS}
      />
      <FaqSection items={FAQS} />
    </>
  );
}
