import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, test, vi } from 'vitest';
import RandomTextGenerator from './page';

describe('<RandomTextGenerator />', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  test('generates a new result when the Generate button is clicked', async () => {
    const user = userEvent.setup();
    const random = vi.spyOn(Math, 'random').mockReturnValue(0);
    render(<RandomTextGenerator />);
    const output = screen.getByTestId('random-text-output');
    const initialValue = output.textContent;

    random.mockReturnValue(0.5);
    await user.click(screen.getByTestId('random-text-generate'));

    expect(output.textContent).not.toBe(initialValue);
  });

  test('regenerates using the changed amount and type', async () => {
    const user = userEvent.setup();
    render(<RandomTextGenerator />);
    const amountInput = screen.getByTestId('random-text-amount');
    const output = screen.getByTestId('random-text-output');

    fireEvent.change(amountInput, { target: { value: '2' } });
    expect(output.textContent?.split('. ')).toHaveLength(2);

    await user.click(screen.getByTestId('random-text-type-trigger'));
    await user.click(screen.getByTestId('random-text-type-words'));

    expect(output.textContent?.split(' ')).toHaveLength(2);
  });

  test('uses sensible defaults for character generation', async () => {
    const user = userEvent.setup();
    render(<RandomTextGenerator />);
    const amountInput = screen.getByTestId('random-text-amount');
    const output = screen.getByTestId('random-text-output');

    await user.click(screen.getByTestId('random-text-type-trigger'));
    await user.click(screen.getByTestId('random-text-type-characters'));

    expect(amountInput).toHaveValue(32);
    expect(output.textContent).toHaveLength(32);
    expect(output.textContent).toMatch(/^[A-Za-z0-9]+$/);

    fireEvent.change(amountInput, { target: { value: '1001' } });
    expect(amountInput).toHaveValue(1000);
    expect(output.textContent).toHaveLength(1000);
  });

  test('clamps the amount when changing to a type with a lower limit', async () => {
    const user = userEvent.setup();
    render(<RandomTextGenerator />);
    const amountInput = screen.getByTestId('random-text-amount');

    await user.click(screen.getByTestId('random-text-type-trigger'));
    await user.click(screen.getByTestId('random-text-type-words'));
    fireEvent.change(amountInput, { target: { value: '1000' } });
    await user.click(screen.getByTestId('random-text-type-trigger'));
    await user.click(screen.getByTestId('random-text-type-paragraphs'));

    expect(amountInput).toHaveValue(50);
    expect(screen.getByTestId('random-text-output').textContent?.split('\n\n')).toHaveLength(50);
  });
});
