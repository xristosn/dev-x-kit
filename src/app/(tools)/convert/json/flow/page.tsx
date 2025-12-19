import { CodeSplitView } from '@/components/code-split-view/code-split-view';
import { jsonToFlow } from '@/lib/actions/convert/json';
import { createConvertOptionsFromQuicktypeOptions } from '@/lib/create-convert-options';
import { FlowTargetLanguage } from 'quicktype-core';

const OPTIONS = createConvertOptionsFromQuicktypeOptions(new FlowTargetLanguage(), {
  'runtime-typecheck': false,
  'just-types': true,
});

export default function JsonToFlow() {
  return (
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
  );
}
