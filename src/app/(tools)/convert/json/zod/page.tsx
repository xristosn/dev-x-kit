import { CodeSplitView } from '@/components/code-split-view/code-split-view';
import { jsonToZod } from '@/lib/actions/convert/json';
import { createConvertOptionsFromQuicktypeOptions } from '@/lib/create-convert-options';
import { TypeScriptZodTargetLanguage } from 'quicktype-core';

const OPTIONS = createConvertOptionsFromQuicktypeOptions(new TypeScriptZodTargetLanguage());

export default function JsonToZod() {
  return (
    <CodeSplitView
      input={{
        label: 'JSON',
        language: 'json',
        defaultValue: `{
  "character_name": "Kaelen Stonehand",
  "class": "Warrior",
  "level": 42,
  "stats": {
    "strength": 85,
    "dexterity": 50,
    "intelligence": 30,
    "constitution": 92
  },
  "inventory": [
    {
      "item_id": "WS001",
      "name": "Sunstone Greatsword",
      "type": "weapon",
      "damage": "45-60"
    },
    {
      "item_id": "AR005",
      "name": "Plate Armor of Resilience",
      "type": "armor",
      "defense": 120
    }
  ],
  "is_online": false,
  "last_login": "2025-12-10T11:45:00Z"
}`,
      }}
      output={{
        label: 'Zod',
        language: 'typescript',
        sourceUrl: 'https://github.com/glideapps/quicktype',
      }}
      converter={jsonToZod}
      options={OPTIONS}
    />
  );
}
