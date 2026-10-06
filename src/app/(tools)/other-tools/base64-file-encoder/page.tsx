import { FaqSection, type FaqItem } from '@/components/faq-section';
import { Base64FileEncoderTool } from './_components/base64-file-encoder-tool';

const FAQS = [
  {
    title: 'Can I encode a file that is not an image?',
    description:
      'Yes. The uploader accepts one file of any type. The result includes a Base64 view and a data URI; image files also have image-specific HTML and CSS snippet options.',
  },
  {
    title: 'What is the file size limit?',
    description:
      'The tool accepts files up to 10 MiB. Larger files are not accepted by the uploader.',
  },
  {
    title: 'Can I paste an image instead of selecting a file?',
    description:
      'Yes. Image clipboard input is enabled, so you can paste an image into the upload area. Only one file or image is processed at a time.',
  },
  {
    title: 'Why might encoding fail for an accepted file?',
    description:
      'The browser reads the file locally. A read error or a read that takes longer than the tool’s 60-second timeout results in an error instead of an encoded result.',
  },
] satisfies readonly FaqItem[];

export default function Base64FileEncoder() {
  return (
    <>
      <Base64FileEncoderTool />
      <FaqSection items={FAQS} />
    </>
  );
}
