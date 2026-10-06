import { CodeSplitView } from '@/components/code-split-view/code-split-view';
import { FaqSection } from '@/components/faq-section';
import type { FaqItem } from '@/components/faq-section';
import { jsonToGo } from '@/lib/actions/convert/json';
import { createConvertOptionsFromQuicktypeOptions } from '@/lib/create-convert-options';
import { GoTargetLanguage } from 'quicktype-core';

const OPTIONS = createConvertOptionsFromQuicktypeOptions(new GoTargetLanguage());

const FAQS = [
  {
    title: 'Why are some fields or types missing from the Go output?',
    description:
      'The generator infers Go structures from the JSON example currently in the editor. Add representative values for nested objects and arrays; fields that do not occur in the sample cannot be inferred from it.',
  },
  {
    title: 'How do I make the generated Go package fit my project?',
    description:
      'Use the package-name option to set the package declaration to the package where you plan to place the generated types. The default is main, which may not match a reusable package in your project.',
  },
  {
    title: 'Should I verify the JSON field tags before using the structs?',
    description:
      'Yes. The converter can generate tags for fields, but check that the chosen tag format and field names match your actual JSON keys. Also review optional and nullable fields against more than the sample object.',
  },
] satisfies readonly FaqItem[];

export default function JsonToGo() {
  return (
    <>
      <CodeSplitView
        input={{
          label: 'JSON',
          language: 'json',
          defaultValue: `{
  "transaction_id": "TXN-20251210-98765",
  "account_number": "123456789",
  "date": "2025-12-10T10:30:00Z",
  "type": "Debit",
  "category": "Groceries",
  "amount": -55.75,
  "currency": "USD",
  "description": "Purchase at Local Market",
  "balance_after_transaction": 1245.25,
  "is_recurring": false
}`,
        }}
        output={{
          label: 'Go',
          language: 'go',
          sourceUrl: 'https://github.com/glideapps/quicktype',
        }}
        converter={jsonToGo}
        options={OPTIONS}
      />
      <FaqSection items={FAQS} />
    </>
  );
}
