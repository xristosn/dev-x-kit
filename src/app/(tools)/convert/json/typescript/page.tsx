import { CodeSplitView } from '@/components/code-split-view/code-split-view';
import { jsonToTypescript } from '@/lib/actions/convert/json';
import { createConvertOptionsFromQuicktypeOptions } from '@/lib/create-convert-options';
import { TypeScriptTargetLanguage } from 'quicktype-core';

export const JSON_TO_TYPESCRIPT_OPTIONS = createConvertOptionsFromQuicktypeOptions(
  new TypeScriptTargetLanguage(),
  {
    'acronym-style': 'camel',
    'runtime-typecheck': false,
    'just-types': true,
  }
);

export default function JsonToTypescript() {
  return (
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
  );
}
