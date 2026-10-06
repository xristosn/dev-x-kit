import { CodeSplitView } from '@/components/code-split-view/code-split-view';
import { FaqSection } from '@/components/faq-section';
import type { FaqItem } from '@/components/faq-section';
import { jsonToJsonSchema } from '@/lib/actions/convert/json';
import { createConvertOptionsFromQuicktypeOptions } from '@/lib/create-convert-options';
import { JSONSchemaTargetLanguage } from 'quicktype-core';

const FAQS = [
  {
    title: 'Can a schema inferred from one example describe every API response?',
    description:
      'Not necessarily. This converter builds its schema from the JSON currently in the editor. It cannot infer fields or alternate shapes that are absent from that example, so compare the result with other valid responses and update the schema for those cases.',
  },
  {
    title: 'Does the generated schema enforce business rules that are not in the JSON?',
    description:
      'No. A sample can show the values and structure that appeared in that document, but it does not establish rules such as numeric ranges, allowed transitions, or relationships between fields. Add those constraints yourself when they are part of your contract.',
  },
  {
    title: 'Why does valid JSON sometimes fail to produce a schema?',
    description:
      'The input must be a complete JSON value, not a JavaScript object literal. Use double-quoted property names and strings, and remove comments or trailing commas before converting.',
  },
] satisfies readonly FaqItem[];

const OPTIONS = createConvertOptionsFromQuicktypeOptions(new JSONSchemaTargetLanguage());

export default function JsonToJsonSchema() {
  return (
    <>
      <CodeSplitView
        input={{
          label: 'JSON',
          language: 'json',
          defaultValue: `{
  "device_name": "CoreRouter-01",
  "device_type": "Router",
  "ip_address": "192.168.1.254",
  "mac_address": "00:A0:C9:14:7C:A8",
  "status": "Active",
  "model": "Cisco XYZ-4000",
  "interfaces": [
    {
      "name": "GigabitEthernet0/1",
      "speed_mbps": 1000,
      "link_status": "Up"
    },
    {
      "name": "GigabitEthernet0/2",
      "speed_mbps": 1000,
      "link_status": "Down"
    }
  ],
  "uptime_seconds": 367200
}`,
        }}
        output={{
          label: 'JSON Schema',
          language: 'json',
          sourceUrl: 'https://github.com/glideapps/quicktype',
        }}
        converter={jsonToJsonSchema}
        options={OPTIONS}
      />
      <FaqSection items={FAQS} />
    </>
  );
}
