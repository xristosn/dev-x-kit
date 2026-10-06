import { CodeSplitView } from '@/components/code-split-view/code-split-view';
import { FaqSection } from '@/components/faq-section';
import type { FaqItem } from '@/components/faq-section';
import { jsonToZod } from '@/lib/actions/convert/json';
import { createConvertOptionsFromQuicktypeOptions } from '@/lib/create-convert-options';
import { TypeScriptZodTargetLanguage } from 'quicktype-core';

const FAQS = [
  {
    title: 'Does generating a Zod schema validate my API response automatically?',
    description:
      'No. This page generates TypeScript source that defines schemas. Your application must import the generated schema and call a validation method, such as parse or safeParse, with each value it wants to check.',
  },
  {
    title: 'Why might the generated schema need changes for other responses?',
    description:
      'The converter infers its output from the one JSON example in the editor. If another valid response omits fields or uses additional shapes, that variation is not represented by this sample alone; update the schema to match the full API contract.',
  },
  {
    title: 'Can I use the generated file without installing Zod?',
    description:
      'No. The generated TypeScript uses Zod APIs, so the project that imports the file needs the Zod package and compatible TypeScript setup. This browser converter produces code but does not install dependencies in your project.',
  },
] satisfies readonly FaqItem[];

const OPTIONS = createConvertOptionsFromQuicktypeOptions(new TypeScriptZodTargetLanguage());

export default function JsonToZod() {
  return (
    <>
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
      <FaqSection items={FAQS} />
    </>
  );
}
