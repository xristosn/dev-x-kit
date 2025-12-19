import { CodeSplitView } from '@/components/code-split-view/code-split-view';
import { tsToJsonSchema } from '@/lib/actions/convert/typescript';
import { createConvertOptions } from '@/lib/create-convert-options';

const OPTIONS = createConvertOptions([
  {
    label: 'Type exposing',
    name: 'expose',
    type: 'radio',
    defaultValue: 'export',
    values: [
      { label: 'All', value: 'all' },
      { label: 'Export', value: 'export' },
      { label: 'None', value: 'none' },
    ],
  },
  {
    label: 'Read JsDoc annotations',
    name: 'jsDoc',
    type: 'radio',
    defaultValue: 'extended',
    values: [
      { label: 'Basic', value: 'basic' },
      { label: 'Extended', value: 'extended' },
      { label: 'None', value: 'none' },
    ],
  },
  {
    label: 'Minify',
    name: 'minify',
    type: 'switch',
    defaultValue: false,
  },
  {
    label: 'Generate a markdown description in addition to description',
    name: 'markdownDescription',
    type: 'switch',
    defaultValue: false,
  },
]);

export default function TsToJsonSchmea() {
  return (
    <CodeSplitView
      input={{
        label: 'Typescript',
        language: 'typescript',
        defaultValue: `export interface Root {
  userId: number;
  id: number;
  title: string;
  completed: boolean;
}

export interface Props {
  /** The user's name */
  name: string;
  priority?: Priority
}
  
enum Priority {
   None,
   Low,
   Hight
}`,
      }}
      output={{
        label: 'JSON Schema',
        language: 'json',
        sourceUrl: 'https://www.npmjs.com/package/ts-json-schema-generator',
      }}
      converter={tsToJsonSchema}
      options={OPTIONS}
    />
  );
}
