import { Container } from '@/components/container';
import { FaqSection, type FaqItem } from '@/components/faq-section';
import { FilterGenerator } from './_components/filter-generator';

const FAQS = [
  {
    title: 'Which CSS filter functions can I combine?',
    description:
      'Build an ordered chain with blur, brightness, contrast, drop-shadow, grayscale, hue-rotate, invert, opacity, saturate, sepia, or an SVG filter URL. You can add the same function more than once.',
  },
  {
    title: 'Does the order of filters matter?',
    description:
      'Yes. Each filter is applied to the result of the one before it. Use the move buttons to reorder the chain and see the sample preview update immediately.',
  },
  {
    title: 'What code can I export?',
    description:
      'Copy a CSS filter declaration, a Tailwind arbitrary-property class, or a JSS style object. The Tailwind class keeps the complete filter chain in its original order.',
  },
] satisfies readonly FaqItem[];

export default function CssFilterGeneratorPage() {
  return (
    <Container className="gap-8">
      <FilterGenerator />
      <FaqSection items={FAQS} />
    </Container>
  );
}
