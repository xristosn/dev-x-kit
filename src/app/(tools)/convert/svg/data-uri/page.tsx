import { CodeSplitView } from '@/components/code-split-view';
import { svgToDataURI } from '@/lib/actions/convert/svg';

export default function SvgToDataURI() {
  return (
    <CodeSplitView
      input={{
        label: 'SVG',
        language: 'plaintext',
        defaultValue: `<svg xmlns="http://www.w3.org/2000/svg"
    xmlns:xlink="http://www.w3.org/1999/xlink">
    <rect x="10" y="10" height="100" width="100"
      style="stroke:#ff0000; fill: #0000ff"/>
  </svg>`,
      }}
      output={{ label: 'Data URI', language: 'javascript' }}
      converter={svgToDataURI}
    />
  );
}
