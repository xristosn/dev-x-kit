import { CodeSplitView } from '@/components/code-split-view/code-split-view';
import { jsonToDart } from '@/lib/actions/convert/json';
import { createConvertOptionsFromQuicktypeOptions } from '@/lib/create-convert-options';
import { DartTargetLanguage } from 'quicktype-core';

const OPTIONS = createConvertOptionsFromQuicktypeOptions(new DartTargetLanguage(), {
  'just-types': true,
});

export default function JsonToDart() {
  return (
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
  );
}
