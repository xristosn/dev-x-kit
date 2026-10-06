import { CodeSplitView } from '@/components/code-split-view/code-split-view';
import { FaqSection } from '@/components/faq-section';
import type { FaqItem } from '@/components/faq-section';
import { yamlToJsonSchema } from '@/lib/actions/convert/yaml';
import { createConvertOptionsFromQuicktypeOptions } from '@/lib/create-convert-options';
import { JSONSchemaTargetLanguage } from 'quicktype-core';

const OPTIONS = createConvertOptionsFromQuicktypeOptions(new JSONSchemaTargetLanguage());

const FAQS = [
  {
    title: 'Can this schema cover YAML documents with other fields or shapes?',
    description:
      'The schema is inferred from the parsed data in the YAML document currently entered. It cannot infer fields or alternate shapes that are absent, so compare it with other valid examples and update the schema to cover them.',
  },
  {
    title: 'Does the JSON Schema validate YAML syntax?',
    description:
      'No. The converter parses YAML first and generates a JSON Schema for the resulting data structure. Use a YAML parser to check YAML syntax; this schema does not define the YAML language.',
  },
  {
    title: 'Will the schema infer application-specific rules?',
    description:
      'Not from a sample alone. Rules such as numeric ranges, string patterns, and allowed values should be added explicitly when your application depends on them.',
  },
] satisfies readonly FaqItem[];

export default function YamlToJsonSchema() {
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
          label: 'JSON Schema',
          language: 'json',
          sourceUrl: 'https://www.npmjs.com/package/yaml',
        }}
        converter={yamlToJsonSchema}
        options={OPTIONS}
      />
      <FaqSection items={FAQS} />
    </>
  );
}
