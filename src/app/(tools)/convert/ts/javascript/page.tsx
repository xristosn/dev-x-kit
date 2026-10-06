import { CodeSplitView } from '@/components/code-split-view/code-split-view';
import { FaqSection } from '@/components/faq-section';
import type { FaqItem } from '@/components/faq-section';
import { tsToJs } from '@/lib/actions/convert/typescript';

const FAQS = [
  {
    title: 'Does converting TypeScript to JavaScript check types?',
    description:
      'No. The converter parses valid TypeScript syntax and removes TypeScript-only syntax, but it does not run the TypeScript type checker. Use tsc or your project’s type-check command to find type errors.',
  },
  {
    title: 'Will this execute my code or load imported modules?',
    description:
      'No. This is a syntax transform, not a runtime or bundler. It does not execute the input or resolve modules, so JavaScript import statements can remain in the output for your build system to handle.',
  },
  {
    title: 'What happens to type annotations and runtime code?',
    description:
      'Type annotations, interfaces, and other TypeScript-only syntax are removed or transformed into JavaScript. Runtime statements such as function calls remain as code, but the converter does not run them.',
  },
] satisfies readonly FaqItem[];

export default function TsToJsonSchmea() {
  return (
    <>
      <CodeSplitView
        input={{
          label: 'Typescript',
          language: 'typescript',
          defaultValue: `function greet(name: string): string {
  return \`Hello, \${name}!\`;
}

let userName: string = "Alice";
let age: number = 30;
let isActive: boolean = true;
let favoriteColors: string[] = ["blue", "green", "red"];

console.log(greet(userName));  
`,
        }}
        output={{
          label: 'Javascript',
          language: 'javascript',
          sourceUrl: 'https://babeljs.io/',
        }}
        converter={tsToJs}
      />
      <FaqSection items={FAQS} />
    </>
  );
}
