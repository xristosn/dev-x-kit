import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import WordCounter from './page';

describe('<WordCounter />', () => {
  it('shows zero metrics before text is entered', () => {
    render(<WordCounter />);

    expect(screen.getByTestId('word-counter-metric-words')).toHaveTextContent('0');
    expect(screen.getByTestId('word-counter-metric-characters')).toHaveTextContent('0');
    expect(screen.getByTestId('word-counter-metric-characters-no-spaces')).toHaveTextContent('0');
    expect(screen.getByTestId('word-counter-metric-sentences')).toHaveTextContent('0');
    expect(screen.getByTestId('word-counter-metric-paragraphs')).toHaveTextContent('0');
    expect(screen.getByTestId('word-counter-metric-reading-time')).toHaveTextContent('0 min');
  });

  it('updates the metrics when the text changes', async () => {
    const user = userEvent.setup();
    render(<WordCounter />);

    await user.type(
      screen.getByTestId('word-counter-input'),
      'Hello world! Second line.\nNew paragraph.'
    );

    expect(screen.getByTestId('word-counter-metric-words')).toHaveTextContent('6');
    expect(screen.getByTestId('word-counter-metric-characters')).toHaveTextContent('40');
    expect(screen.getByTestId('word-counter-metric-characters-no-spaces')).toHaveTextContent('35');
    expect(screen.getByTestId('word-counter-metric-sentences')).toHaveTextContent('3');
    expect(screen.getByTestId('word-counter-metric-paragraphs')).toHaveTextContent('2');
    expect(screen.getByTestId('word-counter-metric-reading-time')).toHaveTextContent('< 1 min');
  });
});
