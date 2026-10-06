import { CodeSplitView } from '@/components/code-split-view/code-split-view';
import { FaqSection } from '@/components/faq-section';
import type { FaqItem } from '@/components/faq-section';
import { jsonToGraphQl } from '@/lib/actions/convert/json';
import { createConvertOptions } from '@/lib/create-convert-options';

const OPTIONS = createConvertOptions([
  {
    label: 'Base type name',
    name: 'baseType',
    type: 'text',
    defaultValue: 'Root',
  },
  {
    label: 'Child types prefix',
    name: 'prefix',
    type: 'text',
    defaultValue: '',
  },
]);

const FAQS = [
  {
    title: 'What does the base type name change?',
    description:
      'The base type name sets the name used for the object type inferred from your top-level JSON object. It defaults to Root; enter a GraphQL-style type name that fits the schema you are building.',
  },
  {
    title: 'When should I use a child types prefix?',
    description:
      'Set a prefix when you want generated types for nested objects to share a naming convention or avoid collisions with types already in your schema. Leave it empty to generate child type names without an added prefix.',
  },
  {
    title: 'Why might a JSON key be rejected during conversion?',
    description:
      'The converter normalizes JSON keys before using them to build the schema and rejects keys that normalize to __proto__, constructor, or prototype. If conversion fails, inspect unusual property names and rename unsafe keys in the source data.',
  },
] satisfies readonly FaqItem[];

export default function JsonToGraphQL() {
  return (
    <>
      <CodeSplitView
        input={{
          label: 'JSON',
          language: 'json',
          defaultValue: `{
  "transaction_id": "9A8B7C6D5E4F",
  "timestamp": 1678886400,
  "status": "completed",
  "items": [
    {
      "product_id": 1001,
      "name": "Wireless Mouse",
      "price": 25.99,
      "quantity": 1
    },
    {
      "product_id": 2005,
      "name": "Mechanical Keyboard",
      "price": 89.50,
      "quantity": 2
    }
  ],
  "customer_details": {
    "user_id": 54321,
    "email": "jane.doe@example.com",
    "shipping_address": {
      "street": "123 Tech Lane",
      "city": "Innovation City",
      "zip_code": "90210"
    }
  },
  "total_amount": 205.00,
  "is_discount_applied": true
}`,
        }}
        output={{
          label: 'GraphQL',
          language: 'graphql',
          sourceUrl: 'https://github.com/walmartlabs/json-to-simple-graphql-schema',
        }}
        converter={jsonToGraphQl}
        options={OPTIONS}
      />
      <FaqSection items={FAQS} />
    </>
  );
}
