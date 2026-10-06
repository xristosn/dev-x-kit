import { CodeSplitView } from '@/components/code-split-view/code-split-view';
import { FaqSection } from '@/components/faq-section';
import type { FaqItem } from '@/components/faq-section';
import { yamlToToml } from '@/lib/actions/convert/yaml';

const FAQS = [
  {
    title: 'Are YAML comments and formatting carried into the TOML?',
    description:
      'No. The converter parses the YAML data and generates TOML from that value, so comments, indentation, and other source formatting are not copied. Add TOML comments or layout preferences after conversion.',
  },
  {
    title: 'What happens to YAML null values when converting to TOML?',
    description:
      'TOML has no null value, so YAML null cannot be encoded directly and may cause conversion to fail. Replace it with a TOML-supported value or omit the key before retrying.',
  },
  {
    title: 'How are nested YAML objects and lists represented in TOML?',
    description:
      'Nested mappings and sequences are serialized using TOML tables and arrays. TOML and YAML have different data models, so inspect the generated structure before relying on it as a drop-in replacement.',
  },
] satisfies readonly FaqItem[];

export default function YamlToToml() {
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
          label: 'TOML',
          language: 'toml',
        }}
        converter={yamlToToml}
      />
      <FaqSection items={FAQS} />
    </>
  );
}
