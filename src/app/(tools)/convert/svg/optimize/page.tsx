import { CodeSplitView } from '@/components/code-split-view';
import { FaqSection } from '@/components/faq-section';
import type { FaqItem } from '@/components/faq-section';
import { svgToOptimized } from '@/lib/actions/convert/svg';
import { SVGO_VALUES } from '@/lib/constants';
import { createConvertOptions } from '@/lib/create-convert-options';

const FAQS = [
  {
    title: 'What does the default SVGO template do?',
    description:
      'The default template runs SVGO’s preset-default configuration. Turn off Use default template to choose individual plugin options instead. Compare the output with your source, especially if your SVG relies on metadata or editor-specific markup.',
  },
  {
    title: 'Will the optimized SVG look exactly the same?',
    description:
      'Optimization can remove or rewrite redundant SVG markup to reduce the source. The goal is to preserve the rendered image, but review the output in your target context before replacing a production asset.',
  },
  {
    title: 'Why did the output remove parts of my SVG?',
    description:
      'SVGO may remove markup it considers unnecessary, and custom plugin choices affect what transformations run. If an element or attribute matters to your workflow, compare plugin settings and test the resulting SVG before using it.',
  },
] satisfies readonly FaqItem[];

const OPTIONS = createConvertOptions([
  {
    label: 'Use default template',
    name: 'useDefault',
    type: 'switch',
    defaultValue: true,
    reverse: true,
    children: SVGO_VALUES.map((v) => ({
      label: v,
      name: `svgoConfig.plugins.${v}`,
      type: 'switch',
      defaultValue: false,
    })),
  },
]);

export default function SvgToOptimized() {
  return (
    <>
      <CodeSplitView
        input={{
          label: 'SVG',
          language: 'html',
          defaultValue: `<svg xmlns="http://www.w3.org/2000/svg"
  xmlns:xlink="http://www.w3.org/1999/xlink">
  <rect x="10" y="10" height="100" width="100"
    style="stroke:#ff0000; fill: #0000ff"/>
</svg>`,
        }}
        output={{
          label: 'Optimized SVG',
          language: 'html',
          sourceUrl: 'https://github.com/gregberge/svgr',
        }}
        options={OPTIONS}
        converter={svgToOptimized}
      />
      <FaqSection items={FAQS} />
    </>
  );
}
