import { CodeSplitView } from '@/components/code-split-view/code-split-view';
import { FaqSection } from '@/components/faq-section';
import type { FaqItem } from '@/components/faq-section';
import { jsonToYaml } from '@/lib/actions/convert/json';

const FAQS = [
  {
    title: 'Why does the YAML formatting differ from my JSON input?',
    description:
      'The converter parses the JSON values and serializes them as YAML, then prettifies the result. It regenerates formatting instead of preserving the input whitespace, so review the output if a specific YAML layout is required.',
  },
  {
    title: 'Can I keep comments or choose YAML indentation here?',
    description:
      'JSON input has no comment syntax, and this page does not provide a YAML formatting option. The serializer chooses the output formatting; add comments or adjust indentation in the YAML result afterward if needed.',
  },
  {
    title: 'Will nested objects and arrays remain represented in the output?',
    description:
      'The converter serializes the parsed JSON data, including its nested objects and arrays, into YAML structure. Check that the generated nesting matches the configuration or data file you intend to use.',
  },
] satisfies readonly FaqItem[];

export default function JsonToYaml() {
  return (
    <>
      <CodeSplitView
        input={{
          label: 'JSON',
          language: 'json',
          defaultValue: `{
  "city": "Cloudhaven",
  "country": "Fantasyland",
  "date": "2025-12-11",
  "forecast": {
    "day": {
      "condition": "Partly Cloudy",
      "temp_max_celsius": 18,
      "temp_min_celsius": 10,
      "wind_speed_kph": 15
    },
    "night": {
      "condition": "Light Rain",
      "temp_celsius": 8,
      "humidity_percent": 85
    }
  },
  "alerts": [
    {
      "type": "Advisory",
      "message": "Moderate pollen count expected."
    }
  ],
  "is_daylight_savings": false
}`,
        }}
        output={{
          label: 'YAML',
          language: 'yaml',
          sourceUrl: 'https://www.npmjs.com/package/yaml',
        }}
        converter={jsonToYaml}
      />
      <FaqSection items={FAQS} />
    </>
  );
}
