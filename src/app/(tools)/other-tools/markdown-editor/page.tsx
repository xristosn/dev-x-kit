import { FaqSection, type FaqItem } from '@/components/faq-section';
import { MarkdownEditor } from './_components/markdown-editor';

const FAQS = [
  {
    title: 'Does the preview update from the Markdown source?',
    description:
      'Yes. The preview renders the text from the editor, so changes to the Markdown source are reflected in the preview.',
  },
  {
    title: 'Can I copy HTML from the preview?',
    description:
      'The preview shows the rendered result, but this editor does not provide a separate HTML export. Use the Markdown source if you need to save or copy the original text.',
  },
  {
    title: 'Why do Markdown symbols disappear in the preview?',
    description:
      'The preview renders Markdown syntax as formatted content. For example, heading markers and emphasis characters are part of the source syntax and are not shown as literal text in the rendered view.',
  },
] satisfies readonly FaqItem[];

export default function MarkdownEditorPage() {
  return (
    <>
      <MarkdownEditor />
      <FaqSection items={FAQS} />
    </>
  );
}
