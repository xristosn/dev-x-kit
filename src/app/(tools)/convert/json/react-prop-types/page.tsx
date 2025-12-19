import { CodeSplitView } from '@/components/code-split-view/code-split-view';
import { jsonToReactPropTypes } from '@/lib/actions/convert/json';
import { createConvertOptionsFromQuicktypeOptions } from '@/lib/create-convert-options';
import { JavaScriptPropTypesTargetLanguage } from 'quicktype-core';

const OPTIONS = createConvertOptionsFromQuicktypeOptions(new JavaScriptPropTypesTargetLanguage());

export default function JsonToReactPropTypes() {
  return (
    <CodeSplitView
      input={{
        label: 'JSON',
        language: 'json',
        defaultValue: `{
  "isbn": "978-1234567890",
  "title": "The Obsidian Spire",
  "author": {
    "first_name": "Elara",
    "last_name": "Vance",
    "nationality": "Canadian"
  },
  "genre": "Fantasy",
  "publication_year": 2024,
  "page_count": 512,
  "publisher": "Mythos Press",
  "is_available": true,
  "reviews": [
    {
      "reviewer_id": 101,
      "rating": 5,
      "comment": "A breathtaking epic from start to finish."
    },
    {
      "reviewer_id": 102,
      "rating": 4,
      "comment": "Strong world-building, minor pacing issues."
    }
  ]
}`,
      }}
      output={{
        label: 'React Prop Types',
        language: 'typescript',
        sourceUrl: 'https://github.com/glideapps/quicktype',
      }}
      converter={jsonToReactPropTypes}
      options={OPTIONS}
    />
  );
}
