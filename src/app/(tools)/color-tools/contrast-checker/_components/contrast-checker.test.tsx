import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, test, vi } from 'vitest';
import { ContastChecker } from './contrast-checker';

vi.mock('react-color-palette', async (importOriginal) => {
  const actual = await importOriginal<typeof import('react-color-palette')>();
  return {
    ...actual,
    ColorPicker: () => <div data-testid="color-picker" />,
  };
});

describe('<ContastChecker />', () => {
  test('shows the default contrast ratio and rating', () => {
    render(<ContastChecker />);

    expect(screen.getByTestId('contrast-ratio')).toHaveTextContent('21');
    expect(screen.getByTestId('contrast-rating')).toHaveTextContent('Excellent');
  });

  test('updates the contrast ratio and rating when the text color changes', async () => {
    const user = userEvent.setup();
    render(<ContastChecker />);

    await user.click(screen.getAllByTestId('color-popover-input')[0]);
    const hexInput = screen.getByTestId('hex-input');
    await user.clear(hexInput);
    await user.type(hexInput, '#777777');
    await user.tab();

    expect(screen.getByTestId('contrast-ratio')).toHaveTextContent('4.69');
    expect(screen.getByTestId('contrast-rating')).toHaveTextContent('Good');
  });
});
