import { FaqSection, type FaqItem } from '@/components/faq-section';
import { TextGradientGenerator } from './_components/text-gradient-generator';

const FAQS = [
  {
    title: 'How does a CSS text gradient work?',
    description:
      'The text is made transparent, then a CSS gradient is painted behind it and clipped to the text shape. The generated styles include the standard and WebKit-prefixed clipping properties for browser support.',
  },
  {
    title: 'What is the difference between linear and radial gradients?',
    description:
      'A linear gradient blends colors along a straight line. Choose one of the eight directions or set a custom angle. A radial gradient blends outward from a position such as the center or a corner, with a circle or ellipse shape and a size.',
  },
  {
    title: 'How do color stops work?',
    description:
      'Each color stop has a color and a position from 0% to 100%. Add stops to create extra blends, move their positions to change where colors transition, or remove stops when you need a simpler gradient. Stops are sorted by position in the generated CSS.',
  },
  {
    title: 'Which code formats can I copy?',
    description:
      'The output selector provides CSS, Tailwind CSS v3 utilities, and a JavaScript style object in JSS format. Some CSS properties may not have a direct Tailwind utility, so check the generated CSS or JSS output when you need the complete text-clipping declarations.',
  },
] satisfies readonly FaqItem[];

export default function CssTextGradientGeneratorPage() {
  return (
    <div className="flex flex-col gap-8">
      <TextGradientGenerator />
      <FaqSection items={FAQS} />
    </div>
  );
}
