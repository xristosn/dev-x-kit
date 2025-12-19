import { CodeSplitView } from '@/components/code-split-view/code-split-view';
import { jsonToCSharp } from '@/lib/actions/convert/json';
import { createConvertOptionsFromQuicktypeOptions } from '@/lib/create-convert-options';
import { CSharpTargetLanguage } from 'quicktype-core';

const OPTIONS = createConvertOptionsFromQuicktypeOptions(new CSharpTargetLanguage());

export default function JsonToCSharp() {
  return (
    <CodeSplitView
      input={{
        label: 'JSON',
        language: 'json',
        defaultValue: `{
  "device_id": "HVAC-UNIT-03",
  "device_name": "Smart Thermostat - Living Room",
  "device_type": "Thermostat",
  "manufacturer": "Climatic Solutions",
  "current_status": "Heating",
  "current_temperature_celsius": 21.5,
  "target_temperature_celsius": 22.0,
  "operating_mode": "Auto",
  "fan_speed": "Low",
  "schedule": {
    "is_active": true,
    "next_change_time": "2025-12-10T18:00:00Z",
    "next_target_celsius": 20.0
  },
  "error_code": null,
  "battery_level_percent": 95
}`,
      }}
      output={{
        label: 'C#',
        language: 'csharp',
        sourceUrl: 'https://github.com/glideapps/quicktype',
      }}
      converter={jsonToCSharp}
      options={OPTIONS}
    />
  );
}
