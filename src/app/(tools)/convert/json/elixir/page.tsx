import { CodeSplitView } from '@/components/code-split-view/code-split-view';
import { FaqSection } from '@/components/faq-section';
import type { FaqItem } from '@/components/faq-section';
import { jsonToElixir } from '@/lib/actions/convert/json';
import { createConvertOptionsFromQuicktypeOptions } from '@/lib/create-convert-options';
import { ElixirTargetLanguage } from 'quicktype-core';

const OPTIONS = createConvertOptionsFromQuicktypeOptions(new ElixirTargetLanguage());

const FAQS = [
  {
    title: 'What does the Elixir generator infer from my JSON?',
    description:
      'It generates Elixir data structures from the JSON sample in the editor. Include representative nested maps and list values, then check the result against other payloads because one sample cannot show fields or value types that occur only in other cases.',
  },
  {
    title: 'When should I set a module namespace?',
    description:
      'Use the namespace option when the generated definitions should live under a module in your application. Choose a name that fits your project’s module structure, then review the generated module declaration before adding the code.',
  },
  {
    title: 'Does generated Elixir code guarantee incoming data is valid?',
    description:
      'No. The output is based on the example provided and does not prove that later JSON has the same shape. Validate or normalize incoming data in your application when payloads can be incomplete or vary.',
  },
] satisfies readonly FaqItem[];

export default function JsonToElixir() {
  return (
    <>
      <CodeSplitView
        input={{
          label: 'JSON',
          language: 'json',
          defaultValue: `{
  "location_id": "POI-9934",
  "name": "Emerald Lake Vista",
  "type": "Natural Landmark",
  "coordinates": {
    "latitude": 45.5678,
    "longitude": -121.3456,
    "elevation_meters": 1500
  },
  "address": {
    "street": "",
    "city": "Cascade Falls",
    "state": "Oregon",
    "country": "USA"
  },
  "tags": ["hiking", "scenic view", "waterfall"],
  "last_survey_date": "2024-06-20",
  "is_accessible_by_car": false
}`,
        }}
        output={{
          label: 'Elixir',
          language: 'elixir',
          sourceUrl: 'https://github.com/glideapps/quicktype',
        }}
        converter={jsonToElixir}
        options={OPTIONS}
      />
      <FaqSection items={FAQS} />
    </>
  );
}
