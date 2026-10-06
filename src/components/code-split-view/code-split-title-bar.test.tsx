import { act, fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, test, vi } from 'vitest';
import { CodeSplitViewTitleBar } from './code-split-title-bar';

describe('<CodeSplitViewTitleBar />', () => {
  describe('rendering', () => {
    test('renders title', () => {
      render(<CodeSplitViewTitleBar title="My Title" />);
      expect(screen.getByTestId('code-split-view-title')).toHaveTextContent('My Title');
    });

    test('renders children', () => {
      render(
        <CodeSplitViewTitleBar title="T">
          <button data-testid="child-btn">Child</button>
        </CodeSplitViewTitleBar>
      );
      expect(screen.getByTestId('child-btn')).toBeInTheDocument();
    });
  });

  describe('rotate button', () => {
    test('does not render when direction is not provided', () => {
      render(<CodeSplitViewTitleBar title="T" />);
      expect(screen.queryByTestId('code-split-view-rotate-button')).not.toBeInTheDocument();
    });

    test('renders when direction is provided', () => {
      render(<CodeSplitViewTitleBar title="T" direction="horizontal" setDirection={vi.fn()} />);
      expect(screen.getByTestId('code-split-view-rotate-button')).toBeInTheDocument();
    });

    test('toggles direction from horizontal to vertical on click', async () => {
      const setDirection = vi.fn();
      render(
        <CodeSplitViewTitleBar title="T" direction="horizontal" setDirection={setDirection} />
      );
      await userEvent.click(screen.getByTestId('code-split-view-rotate-button'));
      expect(setDirection).toHaveBeenCalledWith('vertical');
    });

    test('toggles direction from vertical to horizontal on click', async () => {
      const setDirection = vi.fn();
      render(<CodeSplitViewTitleBar title="T" direction="vertical" setDirection={setDirection} />);
      await userEvent.click(screen.getByTestId('code-split-view-rotate-button'));
      expect(setDirection).toHaveBeenCalledWith('horizontal');
    });
  });

  describe('copy button', () => {
    afterEach(() => {
      vi.useRealTimers();
    });

    test('is disabled when code is not provided', () => {
      render(<CodeSplitViewTitleBar title="T" />);
      expect(screen.getByTestId('code-split-view-copy-button')).toBeDisabled();
    });

    test('is enabled when code is provided', () => {
      render(<CodeSplitViewTitleBar title="T" code="hello world" />);
      expect(screen.getByTestId('code-split-view-copy-button')).not.toBeDisabled();
    });

    test('writes code to clipboard when clicked', async () => {
      const writeText = vi.fn().mockResolvedValue(undefined);
      vi.stubGlobal('navigator', { clipboard: { writeText } });

      render(<CodeSplitViewTitleBar title="T" code="hello world" />);
      await userEvent.click(screen.getByTestId('code-split-view-copy-button'));

      expect(writeText).toHaveBeenCalledWith('hello world');
    });

    test('shows copied feedback until the timeout expires', async () => {
      vi.useFakeTimers();
      vi.stubGlobal('navigator', {
        clipboard: { writeText: vi.fn().mockResolvedValue(undefined) },
      });
      render(<CodeSplitViewTitleBar title="T" code="hello world" />);
      const copyButton = screen.getByTestId('code-split-view-copy-button');

      fireEvent.click(copyButton);
      expect(copyButton).toHaveAttribute('aria-label', 'Code copied');

      await act(async () => {
        await vi.advanceTimersByTimeAsync(699);
      });
      expect(copyButton).toHaveAttribute('aria-label', 'Code copied');

      await act(async () => {
        await vi.advanceTimersByTimeAsync(1);
      });
      expect(copyButton).toHaveAttribute('aria-label', 'Copy code');
    });
  });

  describe('clear button', () => {
    test('does not render when onClear is not provided', () => {
      render(<CodeSplitViewTitleBar title="T" />);
      expect(screen.queryByTestId('code-split-view-clear-button')).not.toBeInTheDocument();
    });

    test('is disabled when code is not provided', () => {
      const onClear = vi.fn();
      render(<CodeSplitViewTitleBar title="T" onClear={onClear} />);
      expect(screen.getByTestId('code-split-view-clear-button')).toBeDisabled();
    });

    test('is enabled when code is provided', () => {
      const onClear = vi.fn();
      render(<CodeSplitViewTitleBar title="T" code="hello" onClear={onClear} />);
      expect(screen.getByTestId('code-split-view-clear-button')).not.toBeDisabled();
    });

    test('calls onClear when clicked', async () => {
      const onClear = vi.fn();
      render(<CodeSplitViewTitleBar title="T" code="hello" onClear={onClear} />);
      await userEvent.click(screen.getByTestId('code-split-view-clear-button'));
      expect(onClear).toHaveBeenCalledTimes(1);
    });
  });
});
