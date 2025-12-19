import { CodeSplitView } from '@/components/code-split-view';
import { jsonToToon } from '@/lib/actions/convert/json';
import { createConvertOptions } from '@/lib/create-convert-options';

const JSON_TO_TOON_OPTIONS = createConvertOptions([
  {
    name: 'delimeter',
    label: 'Delimeter',
    type: 'radio',
    defaultValue: 'comma',
    values: [
      { label: 'Comma (,)', value: 'comma' },
      { label: 'Tab (\\t)', value: 'tab' },
      { label: 'Pipe (|)', value: 'pipe' },
    ],
  },
  {
    name: 'keyFolding',
    label: 'Key folding',
    type: 'radio',
    helperText: 'Enable key folding to collapse single-key wrapper chains into dotted paths',
    defaultValue: 'off',
    values: [
      { label: 'Off', value: 'off' },
      { label: 'Safe', value: 'safe' },
    ],
  },
  {
    name: 'indent',
    label: 'Indent',
    type: 'number',
    defaultValue: 2,
    min: 0,
    max: 6,
    step: 1,
    helperText: 'Number of spaces per indentation level',
  },
]);

export default function JsonToToon() {
  return (
    <CodeSplitView
      input={{
        label: 'JSON',
        language: 'json',
        defaultValue: `{
  "title": "The Stars Above",
  "author": {
    "firstName": "Elara",
    "lastName": "Vance",
    "nationality": "American"
  },
  "publishedYear": 2023,
  "genres": [
    "Science Fiction",
    "Adventure",
    "Mystery"
  ],
  "details": {
    "isbn": "978-1234567890",
    "pageCount": 412,
    "publisher": "Galactic Press"
  },
  "inStock": true,
  "price": 19.99
}`,
      }}
      output={{
        label: 'TOON',
        language: 'toon',
        sourceUrl: 'https://www.npmjs.com/package/@toon-format/toon',
      }}
      converter={jsonToToon}
      options={JSON_TO_TOON_OPTIONS}
    />
  );
}
