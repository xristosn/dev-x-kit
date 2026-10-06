import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Link from 'next/link';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, test } from 'vitest';
import { FaqSection } from './faq-section';

describe('<FaqSection />', () => {
  test('includes closed answers in the server-rendered markup', () => {
    const markup = renderToStaticMarkup(
      <FaqSection items={[{ title: 'Question?', description: 'The answer is in the HTML.' }]} />
    );
    const document = new DOMParser().parseFromString(markup, 'text/html');
    const answer = document.querySelector('[data-testid="faq-answer-0"]');

    expect(answer?.textContent).toContain('The answer is in the HTML.');
  });

  test('toggles accordion panels while keeping answers in the document', async () => {
    const user = userEvent.setup();
    render(
      <FaqSection items={[{ title: 'Question?', description: 'The answer stays in HTML.' }]} />
    );

    const question = screen.getByTestId('faq-question-0');
    const answer = screen.getByTestId('faq-answer-0');

    expect(question).toHaveAttribute('aria-expanded', 'false');
    expect(answer).toHaveTextContent('The answer stays in HTML.');

    await user.click(question);
    expect(question).toHaveAttribute('aria-expanded', 'true');

    await user.click(question);
    expect(question).toHaveAttribute('aria-expanded', 'false');
    expect(answer).toHaveTextContent('The answer stays in HTML.');
  });

  test('closes the previous answer when another opens', async () => {
    const user = userEvent.setup();
    render(
      <FaqSection
        items={[
          { title: 'First question?', description: 'First answer.' },
          { title: 'Second question?', description: 'Second answer.' },
        ]}
      />
    );

    const firstQuestion = screen.getByTestId('faq-question-0');
    const secondQuestion = screen.getByTestId('faq-question-1');

    await user.click(firstQuestion);
    expect(firstQuestion).toHaveAttribute('aria-expanded', 'true');

    await user.click(secondQuestion);
    expect(secondQuestion).toHaveAttribute('aria-expanded', 'true');
    expect(firstQuestion).toHaveAttribute('aria-expanded', 'false');
  });

  test('renders keyboard shortcuts as a single non-wrapping unit', () => {
    render(
      <FaqSection
        items={[
          {
            title: 'How do I open search?',
            description: (
              <span
                className="inline-flex items-center gap-1 whitespace-nowrap"
                data-testid="faq-shortcut"
              >
                <kbd>Ctrl</kbd>
                <span>+</span>
                <kbd>K</kbd>
              </span>
            ),
          },
        ]}
      />
    );

    expect(screen.getByTestId('faq-shortcut').querySelectorAll('kbd')).toHaveLength(2);
    expect(screen.getByTestId('faq-answer-0')).toHaveTextContent('Ctrl+K');
  });

  test('renders rich descriptions and omits the section when there are no items', () => {
    const { rerender } = render(
      <FaqSection
        items={[
          {
            title: 'Where are details?',
            description: <Link href="/privacy-policy">Privacy Policy</Link>,
          },
        ]}
      />
    );

    expect(screen.getByTestId('faq-answer-0').querySelector('a')).toHaveAttribute(
      'href',
      '/privacy-policy'
    );

    rerender(<FaqSection items={[]} />);
    expect(screen.queryByTestId('faq-section')).not.toBeInTheDocument();
  });
});
