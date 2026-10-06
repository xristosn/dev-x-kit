import { FaqSection } from '@/components/faq-section';
import type { FaqItem } from '@/components/faq-section';
import { ContastChecker } from './_components/contrast-checker';

const FAQS = [
  {
    title: 'What does the contrast ratio tell me?',
    description:
      'The ratio compares the text color with the background color. A higher number means a stronger difference in luminance and usually makes text easier to distinguish. The displayed value is rounded to two decimal places.',
  },
  {
    title: 'Why does the rating change when I edit either color?',
    description:
      'The checker recalculates the ratio whenever the text or background color changes. Choose the actual foreground and background colors you plan to use, since changing either one changes the result.',
  },
  {
    title: 'Does the rating verify accessibility for every text size?',
    description:
      'No. The preview shows the color combination at several text sizes, but the rating is based on the contrast ratio alone and does not apply separate pass/fail rules by size. Check the applicable accessibility criteria for your text and interface, and review other accessibility needs separately.',
  },
  {
    title: 'How are the rating labels assigned?',
    description:
      'This tool labels ratios of 10 or higher Excellent, 7 or higher Very Good, 4.5 or higher Good, and 3 or higher Poor. Ratios below 3 are Very Poor. These labels summarize the ratio and are not a complete accessibility audit.',
  },
] satisfies readonly FaqItem[];

export default function ContrastCheckerPage() {
  return (
    <>
      <ContastChecker />
      <FaqSection items={FAQS} />
    </>
  );
}
