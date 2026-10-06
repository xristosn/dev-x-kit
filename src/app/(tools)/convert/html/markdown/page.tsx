import { CodeSplitView } from '@/components/code-split-view/code-split-view';
import { FaqSection } from '@/components/faq-section';
import type { FaqItem } from '@/components/faq-section';
import { htmlToMarkdown } from '@/lib/actions/convert/html';
import { createConvertOptions } from '@/lib/create-convert-options';

const FAQS = [
  {
    title: 'When should I enable table column tracking?',
    description:
      'Enable it when converting tables so the converter can track table columns while producing Markdown. It only affects table conversion and does not preserve HTML styling or layout.',
  },
  {
    title: 'What metadata is included in the output?',
    description:
      'Choose No metadata to omit head metadata, Basic for title, description, and keywords, or Extended for Open Graph, Twitter card, and JSON-LD metadata. The converter reads metadata from the HTML you provide. It does not fetch the original webpage.',
  },
  {
    title: 'Why is my HTML not converted?',
    description:
      'The input needs non-empty body content. A head-only document or an empty body has nothing to convert. The result is Markdown content, so HTML-specific styling and layout are not reproduced.',
  },
] satisfies readonly FaqItem[];

const OPTIONS = createConvertOptions([
  {
    name: 'enableTableColumnTracking',
    type: 'switch',
    label: 'Enable table column tracking',
    defaultValue: false,
  },
  {
    name: 'includeMetaData',
    type: 'radio',
    label: 'Include Head metadata',
    defaultValue: '',
    values: [
      {
        label: 'No metadata',
        value: '',
      },
      {
        label: 'Only basic (title, description, keywords)',
        value: 'basic',
      },
      {
        label: 'Extended (Open Graph, twitter card tags, JSON-LD data)',
        value: 'extended',
      },
    ],
  },
]);

export default function HtmlToMarkdown() {
  return (
    <>
      <CodeSplitView
        input={{
          label: 'HTML',
          language: 'html',
          defaultValue: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Random List Example</title>
    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "Recipe",
      "name": "Quick Morning Coffee",
      "author": {
        "@type": "Person",
        "name": "The Home Barista"
      },
      "datePublished": "2025-12-09",
      "description": "A simple and quick method to brew a delicious cup of coffee at home.",
      "prepTime": "PT5M",
      "recipeIngredient": [
        "250 ml water",
        "15 g coffee beans (medium roast)"
      ],
      "recipeInstructions": [
        {
          "@type": "HowToStep",
          "text": "Heat 250ml of water to just below boiling point."
        },
        {
          "@type": "HowToStep",
          "text": "Grind 15g of coffee beans to a medium coarseness."
        },
        {
          "@type": "HowToStep",
          "text": "Pour a small amount of hot water over the grounds (bloom)."
        },
        {
          "@type": "HowToStep",
          "text": "Wait 30 seconds, then slowly pour the remaining water over the grounds."
        },
        {
          "@type": "HowToStep",
          "text": "Serve immediately and enjoy!"
        }
      ]
    }
    </script>
</head>
<body>
    <div>
        <h2>Unordered List: Daily Errands</h2>
        <ul>
            <li>Pick up dry cleaning before 5 PM</li>
            <li>Buy milk and fresh vegetables</li>
            <li>Email project update to the team</li>
            <li>Water the plants on the balcony</li>
        </ul>
    </div>
    <div>
        <h2>Ordered List: Recipe Steps for Coffee</h2>
        <ol>
            <li>Heat 250ml of water to just below boiling point.</li>
            <li>Grind 15g of coffee beans to a medium coarseness.</li>
            <li>Pour a small amount of hot water over the grounds (bloom).</li>
            <li>Wait 30 seconds, then slowly pour the remaining water over the grounds.</li>
            <li>Serve immediately and enjoy!</li>
        </ol>
    </div>
    <div>
        <h2>Key HTML Elements Used</h2>

        <table>
            <thead>
                <tr>
                    <th>Element</th>
                    <th>Category</th>
                    <th>Purpose in Document</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td><code>&lt;ul&gt;</code> / <code>&lt;li&gt;</code></td>
                    <td>List</td>
                    <td>Presents a list of items where order is not significant (Errands).</td>
                </tr>
                <tr>
                    <td><code>&lt;ol&gt;</code> / <code>&lt;li&gt;</code></td>
                    <td>List</td>
                    <td>Presents a list of items where sequential order matters (Recipe Steps).</td>
                </tr>
                <tr>
                    <td><code>&lt;script&gt;</code></td>
                    <td>Scripting/Meta</td>
                    <td>Embeds the JSON-LD structured data for search engines.</td>
                </tr>
                <tr>
                    <td><code>&lt;div&gt;</code></td>
                    <td>Grouping</td>
                    <td>Creates container boxes for styling and grouping related list content.</td>
                </tr>
            </tbody>
        </table>
    </div>
</body>
</html>`,
        }}
        output={{
          label: 'Markdown',
          language: 'markdown',
          sourceUrl: 'https://www.npmjs.com/package/dom-to-semantic-markdown',
        }}
        converter={htmlToMarkdown}
        options={OPTIONS}
      />
      <FaqSection items={FAQS} />
    </>
  );
}
