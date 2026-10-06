import { CodeSplitView } from '@/components/code-split-view/code-split-view';
import { FaqSection } from '@/components/faq-section';
import type { FaqItem } from '@/components/faq-section';
import { tsToJsonSchema } from '@/lib/actions/convert/typescript';
import { createConvertOptions } from '@/lib/create-convert-options';

const FAQS = [
  {
    title: 'Does generating a schema check TypeScript types?',
    description:
      'The converter checks that the input parses as TypeScript, then generates a schema with type-checking skipped. It does not report ordinary TypeScript type errors, so run your project’s type checker separately.',
  },
  {
    title: 'Which declarations are included in the schema?',
    description:
      'The Type exposing option controls what declarations are exposed: Export includes exported types (the default), All includes all types, and None does not expose individual types. Choose the setting that matches how your schema consumers will select definitions.',
  },
  {
    title: 'What do the JSDoc and description options change?',
    description:
      'Read JsDoc annotations controls whether basic, extended, or no JSDoc annotations are read. The separate markdown-description option adds a markdownDescription alongside description where available. Minify only changes JSON formatting, not which types are converted.',
  },
] satisfies readonly FaqItem[];

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
    <>
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
      <FaqSection items={FAQS} />
    </>
  );
}
