import { CodeSplitView } from '@/components/code-split-view/code-split-view';
import { phpToSerialized } from '@/lib/actions/convert/php';

export default function PhpToSerialized() {
  return (
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
  );
}
