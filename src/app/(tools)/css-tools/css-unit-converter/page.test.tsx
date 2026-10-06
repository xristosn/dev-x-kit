import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { USER_STORAGE_PREFS_KEY } from '@/lib/constants';
import CssUnitConverter from './page';

describe('<CssUnitConverter />', () => {
  beforeEach(() => {
    window.localStorage.setItem(USER_STORAGE_PREFS_KEY, JSON.stringify('local'));
    window.localStorage.removeItem('css-unit-converter');
  });

  afterEach(() => {
    window.localStorage.removeItem('css-unit-converter');
    window.localStorage.removeItem(USER_STORAGE_PREFS_KEY);
  });

  it('renders conversions for the default pixel value', async () => {
    render(<CssUnitConverter />);

    expect(await screen.findByTestId('css-unit-converter-output-rem')).toHaveTextContent('1rem');
    expect(screen.getByTestId('css-unit-converter-output-em')).toHaveTextContent('1em');
    expect(screen.getByTestId('css-unit-converter-size-input')).toHaveValue(16);
  });

  it('updates conversions when the input size changes', async () => {
    render(<CssUnitConverter />);

    fireEvent.change(await screen.findByTestId('css-unit-converter-size-input'), {
      target: { value: '32' },
    });

    expect(screen.getByTestId('css-unit-converter-output-rem')).toHaveTextContent('2rem');
  });

  it('uses updated context values for conversions', async () => {
    render(<CssUnitConverter />);

    fireEvent.change(await screen.findByTestId('css-unit-converter-context-rem-size'), {
      target: { value: '32' },
    });

    expect(screen.getByTestId('css-unit-converter-output-rem')).toHaveTextContent('0.5rem');
  });

  it('changes the source unit and recalculates the available conversions', async () => {
    const user = userEvent.setup();
    render(<CssUnitConverter />);

    await user.click(await screen.findByTestId('css-unit-converter-unit-trigger'));
    await user.click(await screen.findByTestId('css-unit-converter-unit-option-rem'));

    expect(screen.getByTestId('css-unit-converter-context-rem-size')).toBeInTheDocument();
    expect(screen.getByTestId('css-unit-converter-output-px')).toHaveTextContent('256px');
  });
});
