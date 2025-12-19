import { CodeSplitView } from '@/components/code-split-view/code-split-view';
import { yamlToJsDoc } from '@/lib/actions/convert/yaml';
import { JSON_TO_JSDOC_OPTIONS } from '../../json/jsdoc/page';

export default function YamlToJsDoc() {
  return (
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
  );
}
