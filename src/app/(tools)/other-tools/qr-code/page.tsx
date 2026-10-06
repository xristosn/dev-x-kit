import { FaqSection, type FaqItem } from '@/components/faq-section';
import QrGenerator from './_components/qr-generator';

const FAQS = [
  {
    title: 'What information can I put in a QR code?',
    description:
      'Choose a schema for plain text, a URL, Wi-Fi credentials, a geographic location, an SMS, an email, or a vCard. Use the schema fields to format data for the intended scanner instead of pasting a label or extra text around it.',
  },
  {
    title: 'Will a center image make my QR code harder to scan?',
    description:
      'A center image can cover QR modules. Higher error correction can help a code tolerate some damage, but it does not guarantee that an image-covered code will scan. Test the downloaded code at its final display or print size, especially after changing its colors or adding an image.',
  },
  {
    title: 'Which file formats can I download?',
    description:
      'The generator can export PNG, JPEG, SVG, and WebP. Raster formats are convenient for image workflows, while SVG stays vector-based for resizing. Scan the exported file after styling it to check contrast and readability.',
  },
] satisfies readonly FaqItem[];

export default function QrCodePage() {
  return (
    <>
      <QrGenerator />
      <FaqSection items={FAQS} />
    </>
  );
}
