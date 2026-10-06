import { CodeSplitView } from '@/components/code-split-view/code-split-view';
import { FaqSection } from '@/components/faq-section';
import type { FaqItem } from '@/components/faq-section';
import { htmlToJsx } from '@/lib/actions/convert/html';
import { createConvertOptions } from '@/lib/create-convert-options';

const FAQS = [
  {
    title: 'How do I choose between JSX, a function component, and createClass?',
    description:
      'Choose JSX to convert the markup alone. The function component option wraps that JSX in an exported Component function, while createClass uses React’s legacy createClass form. The selected mode changes the generated code, not the input markup.',
  },
  {
    title: 'Why are some HTML attributes changed in the output?',
    description:
      'JSX uses JavaScript-friendly attribute names, so the converter adjusts HTML attributes such as class to className. Review the generated code for any component-specific behavior or props your application needs to add by hand.',
  },
  {
    title: 'Can I convert an HTML fragment, or does it need a full document?',
    description:
      'A fragment is accepted as long as it contains non-empty body content. Empty input or an empty body cannot be converted. A doctype written exactly as <!DOCTYPE html> is removed before conversion.',
  },
] satisfies readonly FaqItem[];

const OPTIONS = createConvertOptions([
  {
    label: 'Render as:',
    name: 'renderAs',
    type: 'radio',
    defaultValue: '0',
    values: [
      { label: 'JSX', value: '0' },
      { label: 'React function component', value: '1' },
      { label: 'React create class', value: '2' },
    ],
  },
]);

export default function HtmlToJSX() {
  return (
    <>
      <CodeSplitView
        input={{
          label: 'HTML',
          language: 'html',
          defaultValue: `<form action="/process-order" method="post" id="random-order-form">
    <h2>Custom Widget Order Form</h2>

    <fieldset>
        <legend>Contact Details</legend>

        <label for="orderName">Full Name:</label>
        <input type="text" id="orderName" name="customer_name" required placeholder="Jane Smith">

        <label for="orderEmail">Email:</label>
        <input type="email" id="orderEmail" name="customer_email" required placeholder="order@example.com">

        <label for="orderPhone">Phone Number (Optional):</label>
        <input type="tel" id="orderPhone" name="customer_phone" pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}" placeholder="555-123-4567">
    </fieldset>
</form>`,
        }}
        output={{
          label: 'JSX',
          language: 'javascript',
          sourceUrl: 'https://www.npmjs.com/package/htmltojsx-too',
        }}
        options={OPTIONS}
        converter={htmlToJsx}
      />
      <FaqSection items={FAQS} />
    </>
  );
}
