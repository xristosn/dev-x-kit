import { CodeSplitView } from '@/components/code-split-view/code-split-view';
import { jsonToJsonSchema } from '@/lib/actions/convert/json';
import { createConvertOptionsFromQuicktypeOptions } from '@/lib/create-convert-options';
import { JSONSchemaTargetLanguage } from 'quicktype-core';

const OPTIONS = createConvertOptionsFromQuicktypeOptions(new JSONSchemaTargetLanguage());

export default function JsonToJsonSchema() {
  return (
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
  );
}
