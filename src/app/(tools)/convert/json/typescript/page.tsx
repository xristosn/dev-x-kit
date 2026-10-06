import { CodeSplitView } from '@/components/code-split-view/code-split-view';
import { FaqSection } from '@/components/faq-section';
import type { FaqItem } from '@/components/faq-section';
import { jsonToTypescript } from '@/lib/actions/convert/json';
import { JSON_TO_TYPESCRIPT_OPTIONS } from './_lib/constants';

const FAQS = [
  {
    title: 'Does the generated TypeScript validate JSON at runtime?',
    description:
      'No. This page generates types only by default, so TypeScript can check your code during development but does not validate data received at runtime. Add a runtime validator if API responses need to be checked before your app uses them.',
  },
  {
    title: 'How does the converter know which properties are optional?',
    description:
      'It receives the one JSON sample in the editor. A property missing from other responses cannot be recognized from that single example, so compare the generated type with your API’s full range of responses and mark optional fields where needed.',
  },
  {
    title: 'Will date-looking strings become JavaScript Date values?',
    description:
      'The input is JSON, where dates are represented as strings. Review the generated type and your application’s parsing code together if you want to work with Date objects; a TypeScript type alone does not convert the incoming value.',
  },
] satisfies readonly FaqItem[];

export default function JsonToTypescript() {
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
          label: 'Typescript',
          language: 'typescript',
          sourceUrl: 'https://github.com/glideapps/quicktype',
        }}
        converter={jsonToTypescript}
        options={JSON_TO_TYPESCRIPT_OPTIONS}
      />
      <FaqSection items={FAQS} />
    </>
  );
}
