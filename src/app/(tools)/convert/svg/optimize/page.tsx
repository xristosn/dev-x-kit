import { CodeSplitView } from '@/components/code-split-view';
import { svgToOptimized } from '@/lib/actions/convert/svg';
import { SVGO_VALUES } from '@/lib/constants';
import { createConvertOptions } from '@/lib/create-convert-options';

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
  );
}
