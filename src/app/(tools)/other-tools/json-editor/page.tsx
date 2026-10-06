'use client';

import { FaqSection, type FaqItem } from '@/components/faq-section';
import { JsonEditorWorkspace } from './_components/json-editor-workspace';

const FAQS = [
  {
    title: 'How can I open JSON in the editor?',
    description:
      'Paste JSON into the entry area or choose a single JSON file up to 20 MiB, then open it in the editor. If the editor reports a parse error, check commas, quotes, and brackets before relying on the content as valid JSON.',
  },
  {
    title: 'Are my edits saved if I leave the page?',
    description:
      'Valid editor content is saved in browser storage for this tool, up to 1 MiB. Invalid JSON is not saved, so fix parse errors before leaving if you want the latest edits to be available for restoration.',
  },
  {
    title: 'Why can I open a file that is too large to restore later?',
    description:
      'The file upload limit is 20 MiB, but the browser-storage limit for saved editor content is 1 MiB. A larger file may open for editing without being eligible for automatic persistence.',
  },
] satisfies readonly FaqItem[];

export default function JsonEditorPage() {
  return (
    <>
      <JsonEditorWorkspace />
      <FaqSection items={FAQS} />
    </>
  );
}
