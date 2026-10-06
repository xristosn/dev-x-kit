import { CodeSplitView } from '@/components/code-split-view/code-split-view';
import { FaqSection } from '@/components/faq-section';
import type { FaqItem } from '@/components/faq-section';
import { jsonToDart } from '@/lib/actions/convert/json';
import { createConvertOptionsFromQuicktypeOptions } from '@/lib/create-convert-options';
import { DartTargetLanguage } from 'quicktype-core';

const OPTIONS = createConvertOptionsFromQuicktypeOptions(new DartTargetLanguage(), {
  'just-types': true,
});

const FAQS = [
  {
    title: 'Why does the Dart output contain types but no JSON helpers?',
    description:
      'This page starts with the Dart “Types only” option enabled. Turn it off if you want the generator to include more than the type definitions, then inspect the output to confirm it includes the helpers your app needs.',
  },
  {
    title: 'How can I get Dart types for every JSON variant?',
    description:
      'The output is inferred from the sample in the editor. Include representative nested objects and array entries, and compare the result with other valid payloads because a single example cannot reveal every optional field or value variation.',
  },
  {
    title: 'Can I treat the generated Dart types as a runtime validator?',
    description:
      'No. Generated type declarations alone do not check arbitrary JSON at runtime. If your app receives untrusted or variable payloads, add decoding and validation that covers the cases in your API contract.',
  },
] satisfies readonly FaqItem[];

export default function JsonToDart() {
  return (
    <>
      <CodeSplitView
        input={{
          label: 'JSON',
          language: 'json',
          defaultValue: `{
  "release_version": "2.14.0",
  "release_date": "2025-12-10",
  "status": "Production Deployment",
  "changes": {
    "features": [
      {
        "id": "FEAT-903",
        "description": "Added dark mode theme option for user dashboard."
      },
      {
        "id": "FEAT-904",
        "description": "Implemented multi-factor authentication (MFA) support."
      }
    ],
    "fixes": [
      {
        "id": "BUG-455",
        "description": "Resolved issue where complex filter searches would timeout."
      },
      {
        "id": "BUG-456",
        "description": "Corrected display bug in mobile view for table data."
      }
    ],
    "improvements": [
      "Optimized database query performance by 15%.",
      "Updated third-party libraries for security patches."
    ]
  },
  "is_major_release": false,
  "documentation_url": "https://docs.example.com/v2.14"
}`,
        }}
        output={{
          label: 'Dart',
          language: 'dart',
          sourceUrl: 'https://github.com/glideapps/quicktype',
        }}
        converter={jsonToDart}
        options={OPTIONS}
      />
      <FaqSection items={FAQS} />
    </>
  );
}
