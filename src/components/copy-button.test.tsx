import { act, fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, test, vi } from 'vitest';
import { CopyButton, CopyIconButton } from './copy-button';

describe('<CopyButton />', () => {
  describe('rendering', () => {
    test('renders with children', () => {
      render(<CopyButton value="hello">Copy</CopyButton>);
      expect(screen.getByTestId('copy-button')).toHaveTextContent('Copy');
    });
  });

  describe('interaction', () => {
    afterEach(() => {
      vi.useRealTimers();
    });

    test('writes value to clipboard and calls onClick', async () => {
      const writeText = vi.fn().mockResolvedValue(undefined);
      vi.stubGlobal('navigator', { clipboard: { writeText } });
      const onClick = vi.fn();

      render(
        <CopyButton value="hello" onClick={onClick}>
          Copy
        </CopyButton>
      );
      await userEvent.click(screen.getByTestId('copy-button'));
      expect(onClick).toHaveBeenCalledTimes(1);
      expect(writeText).toHaveBeenCalledWith('hello');
    });

    test('shows copied feedback until the timeout expires', async () => {
      vi.useFakeTimers();
      vi.stubGlobal('navigator', {
        clipboard: { writeText: vi.fn().mockResolvedValue(undefined) },
      });

      render(
        <CopyButton value="y" copiedProps={{ children: 'Copied!' }}>
          Copy
        </CopyButton>
      );

      const copyButton = screen.getByTestId('copy-button');
      fireEvent.click(copyButton);
      expect(copyButton).toHaveTextContent('Copied!');

      await act(async () => {
        await vi.advanceTimersByTimeAsync(699);
      });
      expect(copyButton).toHaveTextContent('Copied!');

      await act(async () => {
        await vi.advanceTimersByTimeAsync(1);
      });
      expect(copyButton).toHaveTextContent('Copy');
    });
  });
});

describe('<CopyIconButton />', () => {
  test('renders with copy icon', () => {
    render(<CopyIconButton value="icon-test" />);
    expect(screen.getByTestId('copy-button')).toBeInTheDocument();
  });
});
