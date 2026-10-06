import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { USER_STORAGE_PREFS_KEY } from '@/lib/constants';
import DataSizeConverter from './page';

describe('<DataSizeConverter />', () => {
  beforeEach(() => {
    window.localStorage.setItem(USER_STORAGE_PREFS_KEY, JSON.stringify('local'));
    window.localStorage.removeItem('data-size-convert');
  });

  afterEach(() => {
    window.localStorage.removeItem('data-size-convert');
    window.localStorage.removeItem(USER_STORAGE_PREFS_KEY);
  });

  it('renders the default value and conversions for each other unit', async () => {
    render(<DataSizeConverter />);

    expect(await screen.findByTestId('data-size-converter-size-input')).toHaveValue(2);
    expect(screen.getByTestId('data-size-converter-output-b')).toHaveTextContent('2097152');
    expect(screen.getByTestId('data-size-converter-output-kb')).toHaveTextContent('2048');
    expect(screen.getByTestId('data-size-converter-output-gb')).toHaveTextContent('0.001953125');
    expect(screen.queryByTestId('data-size-converter-output-mb')).not.toBeInTheDocument();
  });

  it('updates all conversions when the input value changes', async () => {
    render(<DataSizeConverter />);

    fireEvent.change(await screen.findByTestId('data-size-converter-size-input'), {
      target: { value: '3' },
    });

    expect(screen.getByTestId('data-size-converter-output-kb')).toHaveTextContent('3072');
  });

  it('clamps negative and oversized input values to the supported range', async () => {
    render(<DataSizeConverter />);
    const input = await screen.findByTestId('data-size-converter-size-input');

    fireEvent.change(input, { target: { value: '-5' } });
    expect(input).toHaveValue(0);

    fireEvent.change(input, { target: { value: '9007199254740992' } });
    expect(input).toHaveValue(Number.MAX_SAFE_INTEGER);
  });

  it('changes the source unit and recalculates the conversions', async () => {
    const user = userEvent.setup();
    render(<DataSizeConverter />);

    await user.click(await screen.findByTestId('data-size-converter-type-trigger'));
    await user.click(screen.getByTestId('data-size-converter-type-option-gb'));

    expect(screen.getByTestId('data-size-converter-output-mb')).toHaveTextContent('2048');
    expect(screen.queryByTestId('data-size-converter-output-gb')).not.toBeInTheDocument();
  });

  it('recalculates using the decimal base when the base switch is turned off', async () => {
    const user = userEvent.setup();
    render(<DataSizeConverter />);

    await user.click(await screen.findByTestId('data-size-converter-base-switch'));

    expect(screen.getByTestId('data-size-converter-output-kb')).toHaveTextContent('2000');
  });
});
