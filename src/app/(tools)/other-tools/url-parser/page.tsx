import { FaqSection, type FaqItem } from '@/components/faq-section';
import { URLParser } from './_components/url-parser';

const FAQS = [
  {
    title: 'Why does a relative URL fail to parse?',
    description:
      'The parser uses the browser URL constructor without a base address, so enter a complete URL that includes its scheme, such as https://example.com/path.',
  },
  {
    title: 'Which parts of a URL does the tool show?',
    description:
      'It separates the protocol, host, hostname, port, pathname, fragment, and query string. Query parameters are also listed by key and value.',
  },
  {
    title: 'What happens when the URL is blank or invalid?',
    description:
      'Blank input is not parsed, and clearing a previously parsed URL can leave its last details visible. Invalid non-empty input shows a “Failed to parse URL” error. Include the scheme and check that the URL is complete if parsing fails.',
  },
] satisfies readonly FaqItem[];

export default function URLParserPage() {
  return (
    <>
      <URLParser />
      <FaqSection items={FAQS} />
    </>
  );
}
