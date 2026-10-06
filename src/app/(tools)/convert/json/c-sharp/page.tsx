import { CodeSplitView } from '@/components/code-split-view/code-split-view';
import { FaqSection } from '@/components/faq-section';
import type { FaqItem } from '@/components/faq-section';
import { jsonToCSharp } from '@/lib/actions/convert/json';
import { createConvertOptionsFromQuicktypeOptions } from '@/lib/create-convert-options';
import { CSharpTargetLanguage } from 'quicktype-core';

const OPTIONS = createConvertOptionsFromQuicktypeOptions(new CSharpTargetLanguage());

const FAQS = [
  {
    title: 'How much JSON should I provide to generate C# classes?',
    description:
      'The converter infers classes from the JSON currently in the editor. Include a representative object with nested objects and arrays so those shapes appear in the generated models. A single example cannot reveal fields that only occur in other responses.',
  },
  {
    title: 'Will the generated classes cover every API response?',
    description:
      'Not necessarily. Review fields that can be absent or null across real responses and adjust the generated C# types and serializer settings to match your API contract before relying on them in application code.',
  },
  {
    title: 'Does the generated C# code validate incoming JSON?',
    description:
      'The output provides C# definitions inferred from the sample, not a guarantee that future JSON matches those definitions. Add validation in your application if untrusted or changing payloads must be checked at runtime.',
  },
] satisfies readonly FaqItem[];

export default function JsonToCSharp() {
  return (
    <>
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
      <FaqSection items={FAQS} />
    </>
  );
}
