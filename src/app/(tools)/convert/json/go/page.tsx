import { CodeSplitView } from '@/components/code-split-view/code-split-view';
import { jsonToGo } from '@/lib/actions/convert/json';
import { createConvertOptionsFromQuicktypeOptions } from '@/lib/create-convert-options';
import { GoTargetLanguage } from 'quicktype-core';

const OPTIONS = createConvertOptionsFromQuicktypeOptions(new GoTargetLanguage());

export default function JsonToGo() {
  return (
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
  );
}
