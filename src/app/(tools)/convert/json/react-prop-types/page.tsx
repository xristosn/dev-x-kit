import { CodeSplitView } from '@/components/code-split-view/code-split-view';
import { FaqSection } from '@/components/faq-section';
import type { FaqItem } from '@/components/faq-section';
import { jsonToReactPropTypes } from '@/lib/actions/convert/json';
import { createConvertOptionsFromQuicktypeOptions } from '@/lib/create-convert-options';
import { JavaScriptPropTypesTargetLanguage } from 'quicktype-core';

const FAQS = [
  {
    title: 'Are React PropTypes the same as TypeScript types?',
    description:
      'No. PropTypes provide runtime prop checks for React components, while TypeScript types are checked during development and compilation. The generated PropTypes output does not replace static TypeScript types if your project uses both.',
  },
  {
    title: 'How do I connect the generated PropTypes to a component?',
    description:
      'Use the generated validators in the component’s propTypes declaration, then review the names and shape against the props your component actually accepts. The converter infers a data shape from JSON; it does not know your component’s implementation or prop names beyond that sample.',
  },
  {
    title: 'Will the generated validators cover every object my API can return?',
    description:
      'They are inferred from the single JSON value in the editor. If other valid responses omit fields or contain different shapes, those cases are not demonstrated by this sample. Review and adjust the generated validators against your API contract.',
  },
] satisfies readonly FaqItem[];

const OPTIONS = createConvertOptionsFromQuicktypeOptions(new JavaScriptPropTypesTargetLanguage());

export default function JsonToReactPropTypes() {
  return (
    <>
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
      <FaqSection items={FAQS} />
    </>
  );
}
