import { CodeSplitView } from '@/components/code-split-view/code-split-view';
import { tsToZod } from '@/lib/actions/convert/typescript';
import { createConvertOptions } from '@/lib/create-convert-options';

const OPTIONS = createConvertOptions([
  {
    name: 'keepComments',
    label: 'Keep TSDoc Comments',
    type: 'switch',
    defaultValue: true,
  },
  {
    name: 'skipParseJSDoc',
    label: 'Skip the creation of zod validators from JSDoc annotations',
    type: 'switch',
    defaultValue: false,
  },
]);

export default function TsToZod() {
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
  /** Should the name be rendered in bold */
  priority?: boolean
}`,
      }}
      output={{
        label: 'Zod',
        language: 'typescript',
        sourceUrl: 'https://www.npmjs.com/package/ts-to-zod',
      }}
      converter={tsToZod}
      options={OPTIONS}
    />
  );
}
