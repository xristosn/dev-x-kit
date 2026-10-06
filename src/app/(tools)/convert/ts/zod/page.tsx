import { CodeSplitView } from '@/components/code-split-view/code-split-view';
import { FaqSection } from '@/components/faq-section';
import type { FaqItem } from '@/components/faq-section';
import { tsToZod } from '@/lib/actions/convert/typescript';
import { createConvertOptions } from '@/lib/create-convert-options';

const FAQS = [
  {
    title: 'Does the converter validate data with Zod?',
    description:
      'It generates TypeScript source code that defines Zod schemas. It does not run those schemas against data here; add the generated code to your project, make sure Zod is installed there, and call the schema’s parse or safeParse method when validating values.',
  },
  {
    title: 'How do JSDoc options affect the generated schemas?',
    description:
      'JSDoc annotations are used to create validators by default. Turn on Skip the creation of zod validators from JSDoc annotations to disable that behavior. Keep TSDoc Comments separately controls whether comments are retained in the generated source.',
  },
  {
    title: 'Why might generation return an error instead of schemas?',
    description:
      'The input must parse as TypeScript and be supported by the schema generator. If generation fails, check the input syntax and the types involved, then simplify or split the declarations and retry. This tool produces code only when generation succeeds.',
  },
] satisfies readonly FaqItem[];

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
      <FaqSection items={FAQS} />
    </>
  );
}
