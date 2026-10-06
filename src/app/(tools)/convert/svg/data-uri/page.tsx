import { CodeSplitView } from '@/components/code-split-view';
import { FaqSection } from '@/components/faq-section';
import type { FaqItem } from '@/components/faq-section';
import { svgToDataURI } from '@/lib/actions/convert/svg';

const FAQS = [
  {
    title: 'Does this tool optimize or minify my SVG?',
    description:
      'No. The tool Base64-encodes the original SVG input and adds the data:image/svg+xml;base64, prefix. To reduce the encoded output, optimize the SVG first with the SVG optimizer, then convert that result here.',
  },
  {
    title: 'Where can I use an SVG data URI?',
    description:
      'A data URI can be used in places that accept an image URL, such as an image source or a CSS image value. Base64 encoding makes the SVG self-contained, but it can make the text longer than the original SVG source.',
  },
  {
    title: 'Why is my input rejected?',
    description:
      'The converter checks that the input is SVG before encoding it. Use the complete SVG markup, including its root element, rather than a path fragment or a different image format.',
  },
] satisfies readonly FaqItem[];

export default function SvgToDataURI() {
  return (
    <>
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
      <FaqSection items={FAQS} />
    </>
  );
}
