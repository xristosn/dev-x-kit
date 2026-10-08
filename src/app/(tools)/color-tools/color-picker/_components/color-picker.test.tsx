import { act, fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { afterEach, describe, expect, test, vi, beforeEach } from 'vitest';
import { ColorPicker } from './color-picker';

vi.mock('react-color-palette', async (importOriginal) => {
  const actual = await importOriginal<typeof import('react-color-palette')>();
  return {
    ...actual,
    ColorPicker: () => <div data-testid="color-picker" />,
  };
});

vi.mock('@/hooks/use-web-storage', () => ({
  useWebStorage: vi.fn((_key: string, _storageType: string, defaultValue: string) =>
    useState(defaultValue)
  ),
}));

describe('<ColorPicker />', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    window.localStorage.clear();
  });

  test('renders with default color', () => {
    render(<ColorPicker />);
    const hexInput = screen.getByTestId('hex-input');
    expect(hexInput).toHaveValue('#2d2bb6');
    expect(screen.getByTestId('rgb-input-r')).toBeInTheDocument();
    expect(screen.getByTestId('hsv-input-h')).toBeInTheDocument();
  });

  test('uses a section heading for the color picker panel', () => {
    render(<ColorPicker />);

    expect(screen.getByTestId('color-picker-section-title').tagName).toBe('H2');
  });

  describe('hex input', () => {
    test('updates RGB, HSV, and shade values when changed', () => {
      render(<ColorPicker />);
      const hexInput = screen.getByTestId('hex-input');

      fireEvent.change(hexInput, { target: { value: '#ff0000' } });
      fireEvent.blur(hexInput);

      expect(hexInput).toHaveValue('#ff0000');
      expect(screen.getByTestId('rgb-input-r')).toHaveValue(255);
      expect(screen.getByTestId('rgb-input-g')).toHaveValue(0);
      expect(screen.getByTestId('rgb-input-b')).toHaveValue(0);
      expect(screen.getByTestId('hsv-input-h')).toHaveValue(0);
      expect(screen.getByTestId('hsv-input-s')).toHaveValue(100);
      expect(screen.getByTestId('hsv-input-v')).toHaveValue(100);
      expect(
        screen
          .getAllByTestId('color-picker-shade-copy-button')
          .some((button) => button.textContent === '#ff0000')
      ).toBe(true);
    });

    test('shows error indicator for invalid hex', () => {
      render(<ColorPicker />);
      const hexInput = screen.getByTestId('hex-input');
      fireEvent.change(hexInput, { target: { value: 'invalid' } });
      expect(screen.getByTestId('hex-error-btn')).toBeInTheDocument();
    });
  });

  describe('rgb input', () => {
    test('updates the shared color when the red component changes', async () => {
      const user = userEvent.setup();
      render(<ColorPicker />);
      const redInput = screen.getByTestId('rgb-input-r');

      await user.clear(redInput);
      await user.type(redInput, '255');
      await user.tab();

      expect(redInput).toHaveValue(255);
      expect(screen.getByTestId('rgb-input-g')).toHaveValue(43);
      expect(screen.getByTestId('rgb-input-b')).toHaveValue(182);
      expect(screen.getByTestId('hex-input')).toHaveValue('#ff2bb6');
      expect(screen.getByTestId('hsv-input-h')).toHaveValue(321);
      expect(screen.getByTestId('hsv-input-s')).toHaveValue(83);
      expect(screen.getByTestId('hsv-input-v')).toHaveValue(100);
    });
  });

  describe('copy button', () => {
    afterEach(() => {
      vi.useRealTimers();
    });

    test('click copies background color to clipboard', async () => {
      render(<ColorPicker />);
      const copyButtons = screen.getAllByTestId('copy-button');
      const firstCopyButton = copyButtons[0];

      const writeTextMock = vi.fn().mockResolvedValue(undefined);
      vi.stubGlobal('navigator', { clipboard: { writeText: writeTextMock } });

      await userEvent.click(firstCopyButton);
      expect(writeTextMock).toHaveBeenCalledTimes(1);
      expect(writeTextMock).toHaveBeenCalledWith(expect.any(String));
    });

    test('shows copied feedback until the timeout expires', async () => {
      vi.useFakeTimers();
      render(<ColorPicker />);
      const copyButton = screen.getAllByTestId('color-picker-shade-copy-button')[0];
      const originalText = copyButton.textContent;

      const writeTextMock = vi.fn().mockResolvedValue(undefined);
      vi.stubGlobal('navigator', { clipboard: { writeText: writeTextMock } });

      fireEvent.click(copyButton);
      expect(copyButton).toHaveTextContent('Copied!');
      expect(writeTextMock).toHaveBeenCalledWith(originalText);

      await act(async () => {
        await vi.advanceTimersByTimeAsync(699);
      });
      expect(copyButton).toHaveTextContent('Copied!');

      await act(async () => {
        await vi.advanceTimersByTimeAsync(1);
      });
      expect(copyButton).toHaveTextContent(originalText ?? '');
    });
  });
});
