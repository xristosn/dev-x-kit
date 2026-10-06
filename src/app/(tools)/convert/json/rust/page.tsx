import { CodeSplitView } from '@/components/code-split-view/code-split-view';
import { FaqSection } from '@/components/faq-section';
import type { FaqItem } from '@/components/faq-section';
import { jsonToRust } from '@/lib/actions/convert/json';
import { createConvertOptionsFromQuicktypeOptions } from '@/lib/create-convert-options';
import { RustTargetLanguage } from 'quicktype-core';

const OPTIONS = createConvertOptionsFromQuicktypeOptions(new RustTargetLanguage());

const FAQS = [
  {
    title: 'Why does the Rust output depend on the JSON sample?',
    description:
      'The converter infers Rust structures from the object in the editor. Include representative nested objects and array elements; properties or value variations absent from that sample cannot be inferred automatically.',
  },
  {
    title: 'What should I check before deserializing production data?',
    description:
      'Compare the generated structures with all expected payload variants, especially fields that may be missing or null. Adjust the Rust types and serde configuration to reflect the real API contract rather than assuming one example covers it.',
  },
  {
    title: 'Does this page create a complete Rust application?',
    description:
      'No. It generates Rust code for the JSON data shape, not a Cargo project or API client. Add the code to your project and confirm its dependencies and serialization setup match how you plan to read or write JSON.',
  },
] satisfies readonly FaqItem[];

export default function JsonToRust() {
  return (
    <>
      <CodeSplitView
        input={{
          label: 'JSON',
          language: 'json',
          defaultValue: `{
  "task_id": "PROJ-45-FEAT-201",
  "project": "Apollo Launch",
  "title": "Implement user authentication endpoint",
  "priority": "High",
  "status": "In Progress",
  "assigned_to": {
    "user_id": 9001,
    "name": "Alex Johnson"
  },
  "due_date": "2026-01-20T17:00:00Z",
  "tags": ["backend", "security", "API"],
  "estimated_hours": 8.5,
  "dependencies": [
    "PROJ-45-SETUP-100"
  ]
}`,
        }}
        output={{
          label: 'Rust',
          language: 'rust',
          sourceUrl: 'https://github.com/glideapps/quicktype',
        }}
        converter={jsonToRust}
        options={OPTIONS}
      />
      <FaqSection items={FAQS} />
    </>
  );
}
