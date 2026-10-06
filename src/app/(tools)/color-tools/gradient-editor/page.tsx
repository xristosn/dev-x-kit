'use client';

import { FaqSection } from '@/components/faq-section';
import type { FaqItem } from '@/components/faq-section';
import { useWebStorage } from '@/hooks/use-web-storage';
import { GRADIENT_PRESETS } from '@/lib/constants';
import { GradientEditor } from '@/components/color/gradient-editor';

const FAQS = [
  {
    title: 'What do color stops and offsets control?',
    description:
      'Each color stop adds a color to the gradient. Its offset sets where that color appears along the gradient, from 0% at the start to 100% at the end. Move or add stops to control how the colors blend.',
  },
  {
    title: 'Why is rotation unavailable for a radial gradient?',
    description:
      'Rotation changes the direction of a linear gradient. Radial gradients in this editor are circular, so they do not use the rotation setting.',
  },
  {
    title: 'How can I save a gradient as an image?',
    description:
      'Use the image export controls to download a PNG, JPEG, or WebP. Enter the output width and height to choose the image dimensions. These dimensions affect the exported image, not the CSS gradient.',
  },
  {
    title: 'Does choosing a preset replace my current gradient?',
    description:
      'Yes. A preset loads its gradient settings into the editor. Adjust its colors, stops, or direction afterward to make it your own.',
  },
] satisfies readonly FaqItem[];

export default function GradientEditorPage() {
  const [value, setValue] = useWebStorage('gradient-editor', 'infer', GRADIENT_PRESETS[0]);

  return (
    <>
      <GradientEditor value={value} setValue={setValue} />
      <FaqSection items={FAQS} />
    </>
  );
}
