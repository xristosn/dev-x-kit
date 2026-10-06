import { CodeSplitView } from '@/components/code-split-view/code-split-view';
import { FaqSection, type FaqItem } from '@/components/faq-section';
import { phpToSerialized } from '@/lib/actions/convert/php';

const FAQS = [
  {
    title: 'Does this convert JSON into a PHP array?',
    description:
      'No. The converter serializes the entire input as a UTF-8 PHP string. If you enter JSON text, that text is serialized as a string rather than parsed into a PHP array or object.',
  },
  {
    title: 'Why is already-serialized input rejected?',
    description:
      'This page is for converting plain input into PHP serialized form. It checks whether the input is already serialized and rejects it to avoid serializing the serialized representation a second time.',
  },
  {
    title: 'What does the serialized result represent?',
    description:
      'The result is a PHP serialized string value. PHP can unserialize it back to the exact input text, including JSON text if that was the original input.',
  },
] satisfies readonly FaqItem[];

export default function PhpToSerialized() {
  return (
    <>
      <CodeSplitView
        input={{
          label: 'Data',
          language: 'plaintext',
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
          label: 'PHP',
          language: 'php',
          sourceUrl: 'https://www.npmjs.com/package/php-serialize',
        }}
        converter={phpToSerialized}
      />
      <FaqSection items={FAQS} />
    </>
  );
}
