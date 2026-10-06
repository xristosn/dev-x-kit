import { CodeSplitView } from '@/components/code-split-view/code-split-view';
import { FaqSection } from '@/components/faq-section';
import type { FaqItem } from '@/components/faq-section';
import { yamlToJson } from '@/lib/actions/convert/yaml';

const FAQS = [
  {
    title: 'Are YAML comments and indentation preserved in JSON?',
    description:
      'No. YAML is parsed into data and then serialized as formatted JSON. Comments, blank lines, and the original indentation are not retained in the output.',
  },
  {
    title: 'How should I keep a YAML scalar as a string in JSON?',
    description:
      'The YAML parser decides the value of each scalar before JSON is written. Quote values that could be read as numbers, booleans, or null when you intend them to remain strings, then check the generated JSON.',
  },
  {
    title: 'Do YAML mappings and sequences keep their structure?',
    description:
      'Yes. YAML mappings become JSON objects and sequences become JSON arrays. The output reflects the parsed data structure, not YAML-specific syntax such as comments or anchors.',
  },
] satisfies readonly FaqItem[];

export default function YamlToJson() {
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
          label: 'JSON',
          language: 'json',
          sourceUrl: 'https://www.npmjs.com/package/yaml',
        }}
        converter={yamlToJson}
      />
      <FaqSection items={FAQS} />
    </>
  );
}
