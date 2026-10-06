import { CodeSplitView } from '@/components/code-split-view/code-split-view';
import { FaqSection } from '@/components/faq-section';
import type { FaqItem } from '@/components/faq-section';
import { jsonToFlow } from '@/lib/actions/convert/json';
import { createConvertOptionsFromQuicktypeOptions } from '@/lib/create-convert-options';
import { FlowTargetLanguage } from 'quicktype-core';

const FAQS = [
  {
    title: 'Does generated Flow code check JSON responses at runtime?',
    description:
      'No. The converter generates Flow type declarations only by default. Flow’s static checks do not inspect data arriving from an API while your program runs, so use a runtime validator when incoming data must be checked.',
  },
  {
    title: 'Can one JSON example reveal every optional property?',
    description:
      'No. The converter infers types from the single JSON value in the editor, and that value cannot show properties omitted by other valid responses. Review the output against those response variants and mark fields optional where appropriate.',
  },
  {
    title: 'Should I keep number-like or date-like values as strings?',
    description:
      'JSON distinguishes strings from numbers, but it does not carry date or numeric meaning inside a string. Check the source API contract before changing inferred Flow types, and parse values in your application if you need another runtime representation.',
  },
] satisfies readonly FaqItem[];

const OPTIONS = createConvertOptionsFromQuicktypeOptions(new FlowTargetLanguage(), {
  'runtime-typecheck': false,
  'just-types': true,
});

export default function JsonToFlow() {
  return (
    <>
      <CodeSplitView
        input={{
          label: 'JSON',
          language: 'json',
          defaultValue: `{
  "product_sku": "ELEC-HEAD-2022",
  "product_name": "Nova X Noise-Cancelling Headphones",
  "category": "Electronics",
  "average_rating": 4.6,
  "total_reviews": 1258,
  "rating_breakdown": {
    "5_star": 980,
    "4_star": 205,
    "3_star": 55,
    "2_star": 10,
    "1_star": 8
  },
  "top_tags": ["Comfortable", "Great Sound", "Long Battery Life"],
  "last_updated": "2025-12-10T15:30:00Z",
  "featured_review": {
    "user": "AudioFanatic",
    "summary": "Best sound quality for the price.",
    "rating": 5
  }
}`,
        }}
        output={{
          label: 'Flow',
          language: 'typescript',
          sourceUrl: 'https://github.com/glideapps/quicktype',
        }}
        converter={jsonToFlow}
        options={OPTIONS}
      />
      <FaqSection items={FAQS} />
    </>
  );
}
