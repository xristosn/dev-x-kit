import { FaqSection } from '@/components/faq-section';
import type { FaqItem } from '@/components/faq-section';
import { ColorPicker } from './_components/color-picker';

const FAQS = [
  {
    title: 'Which color formats can I enter or paste?',
    description:
      'Use the HEX, RGB, or HSV fields. HEX accepts 3-, 6-, or 8-digit values, with or without a leading #. You can also paste comma-separated rgb(), rgba(), hsv(), or hsva() values into the color fields.',
  },
  {
    title: 'Do HEX, RGB, and HSV stay in sync?',
    description:
      'Yes. They are different representations of the same selected color. Changing the picker or a valid value in one format updates the other fields and the generated color samples.',
  },
  {
    title: 'How do I copy a color in a specific format?',
    description:
      'Use the copy button beside the HEX, RGB, or HSV field to copy the current color in that format. Use a button on any generated sample to copy that sample’s HEX value.',
  },
  {
    title: 'What do Analogous, Monochromatic, Triad, Tetrad, and Spinned mean?',
    description: (
      <>
        <ul className="list-disc space-y-1 pl-5">
          <li>
            <strong>Analogous:</strong> colors with hues close to your selected color on the color
            wheel.
          </li>
          <li>
            <strong>Monochromatic:</strong> variations that keep the same hue and saturation while
            changing brightness.
          </li>
          <li>
            <strong>Triad:</strong> three hues spaced evenly around the color wheel.
          </li>
          <li>
            <strong>Tetrad:</strong> four hues spaced evenly around the color wheel.
          </li>
          <li>
            <strong>Spinned:</strong> versions with the hue rotated around the color wheel in
            different steps.
          </li>
        </ul>
        <p className="mt-3">
          The other groups make the color lighter, darker, brighter, more saturated, or less
          saturated. Copy any swatch to use it in your project.
        </p>
      </>
    ),
  },
] satisfies readonly FaqItem[];

export default function ColorPickerPage() {
  return (
    <>
      <ColorPicker />
      <FaqSection items={FAQS} />
    </>
  );
}
