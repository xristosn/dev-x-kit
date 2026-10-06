import { CodeSplitView } from '@/components/code-split-view/code-split-view';
import { FaqSection, type FaqItem } from '@/components/faq-section';
import { phpToDeserialized } from '@/lib/actions/convert/php';

const FAQS = [
  {
    title: 'What input does this page accept?',
    description:
      'Enter a PHP serialized value, such as the output produced by PHP’s serialize function. Ordinary JSON text is not automatically treated as PHP serialized data.',
  },
  {
    title: 'Why does the result sometimes look like JSON?',
    description:
      'Serialized PHP strings are returned as plain text. Other decoded values are formatted as JSON with indentation, which makes arrays and objects easier to read.',
  },
  {
    title: 'Why does decoding fail for some input?',
    description:
      'The input must be recognized as PHP serialized data. Check that the serialized value is complete and that its type markers, lengths, and delimiters have not been changed.',
  },
] satisfies readonly FaqItem[];

export default function PhpToDeserialized() {
  return (
    <>
      <CodeSplitView
        input={{
          label: 'PHP',
          language: 'php',
          defaultValue: `s:607:"{
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
}";`,
        }}
        output={{
          label: 'Data',
          language: 'plaintext',
          sourceUrl: 'https://www.npmjs.com/package/php-serialize',
        }}
        converter={phpToDeserialized}
      />
      <FaqSection items={FAQS} />
    </>
  );
}
