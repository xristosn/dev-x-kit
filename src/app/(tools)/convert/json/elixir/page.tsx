import { CodeSplitView } from '@/components/code-split-view/code-split-view';
import { jsonToElixir } from '@/lib/actions/convert/json';
import { createConvertOptionsFromQuicktypeOptions } from '@/lib/create-convert-options';
import { ElixirTargetLanguage } from 'quicktype-core';

const OPTIONS = createConvertOptionsFromQuicktypeOptions(new ElixirTargetLanguage());

export default function JsonToElixir() {
  return (
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
  );
}
