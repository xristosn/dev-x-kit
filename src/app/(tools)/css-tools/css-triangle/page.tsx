import { FaqSection } from '@/components/faq-section';
import type { FaqItem } from '@/components/faq-section';
import { CSSTriangle } from './_components/css-triangle';

const FAQS = [
  {
    title: 'Why do width and height behave differently from a normal CSS box?',
    description:
      'The triangle is drawn with borders on a zero-size element. Width and height set the border dimensions used to form the shape, so they change its visible base and height rather than setting the size of a rectangular element.',
  },
  {
    title: 'Why are some of the triangle borders transparent?',
    description:
      'CSS triangles use one colored border to create the visible face and transparent borders to create its sloped edges. The selected direction determines which border receives your color.',
  },
  {
    title: 'How do I make a triangle point in a different direction?',
    description:
      'Choose one of the eight direction options. The generator changes which border is colored and how the border widths are arranged, then updates the preview and generated CSS styles.',
  },
] satisfies readonly FaqItem[];

export default function CSSTrianglePage() {
  return (
    <>
      <CSSTriangle />
      <FaqSection items={FAQS} />
    </>
  );
}
