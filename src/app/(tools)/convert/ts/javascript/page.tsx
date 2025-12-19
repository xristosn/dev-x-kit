import { CodeSplitView } from '@/components/code-split-view/code-split-view';
import { tsToJs } from '@/lib/actions/convert/typescript';

export default function TsToJsonSchmea() {
  return (
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
  );
}
