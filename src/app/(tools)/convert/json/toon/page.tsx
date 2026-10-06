import { CodeSplitView } from '@/components/code-split-view';
import { FaqSection } from '@/components/faq-section';
import type { FaqItem } from '@/components/faq-section';
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

const FAQS = [
  {
    title: 'What does key folding change in TOON output?',
    description:
      'When enabled, key folding collapses chains of single-key wrapper objects into dotted paths. Compare the folded output with your expected TOON structure before using it in a parser or prompt.',
  },
  {
    title: 'Why might changing the TOON delimiter not change the output?',
    description:
      'The page exposes comma, tab, and pipe choices, but its delimiter option is currently named delimeter while the converter action reads delimiter. Because those keys do not match, changing the control may not affect the encoded output. Check the result before relying on a non-default delimiter.',
  },
  {
    title: 'What does the indentation option control?',
    description:
      'Indent sets the number of spaces used for each indentation level, from 0 to 6. Choose a value that keeps nested output readable in the system that will consume the TOON text.',
  },
] satisfies readonly FaqItem[];

export default function JsonToToon() {
  return (
    <>
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
      <FaqSection items={FAQS} />
    </>
  );
}
