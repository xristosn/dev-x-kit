import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { useCopyToClipboard } from './use-copy-to-clipboard';

vi.mock('sonner');
vi.mock('@/lib/constants', () => ({
  ...vi.importActual('@/lib/constants'),
  USE_COPY_TO_CLIPBOARD_TIMEOUT_MS: 10,
}));

import { toast } from 'sonner';

describe('useCopyToClipboard()', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('initial state', () => {
    it('returns isCopied false by default', () => {
      const { result } = renderHook(() => useCopyToClipboard({ text: 'hello' }));
      expect(result.current.isCopied).toBe(false);
    });

    it('exposes handleCopy function', () => {
      const { result } = renderHook(() => useCopyToClipboard({ text: 'hello' }));
      expect(typeof result.current.handleCopy).toBe('function');
    });
  });

  describe('handleCopy on success', () => {
    it('writes text to clipboard, sets isCopied true, and shows success toast', async () => {
      const writeText = vi.fn().mockResolvedValue(undefined);
      vi.stubGlobal('navigator', { clipboard: { writeText } });

      const { result } = renderHook(() => useCopyToClipboard({ text: 'hello' }));
      await act(async () => {
        result.current.handleCopy();
      });

      expect(writeText).toHaveBeenCalledWith('hello');
      expect(result.current.isCopied).toBe(true);
      expect(toast.success).toHaveBeenCalledWith('Copied to clipboard!');
    });

    it('uses custom copyMessage when provided', async () => {
      const writeText = vi.fn().mockResolvedValue(undefined);
      vi.stubGlobal('navigator', { clipboard: { writeText } });

      const { result } = renderHook(() =>
        useCopyToClipboard({ text: 'hello', copyMessage: 'Custom!' })
      );
      await act(async () => {
        result.current.handleCopy();
      });

      expect(toast.success).toHaveBeenCalledWith('Custom!');
    });
  });

  describe('handleCopy on failure', () => {
    it('shows error toast when clipboard write fails', async () => {
      const writeText = vi.fn().mockRejectedValue(new Error('denied'));
      vi.stubGlobal('navigator', { clipboard: { writeText } });

      const { result } = renderHook(() => useCopyToClipboard({ text: 'hello' }));
      await act(async () => {
        result.current.handleCopy();
      });

      expect(result.current.isCopied).toBe(false);
      expect(toast.error).toHaveBeenCalledWith('Failed to copy to clipboard.');
    });
  });

  describe('timing', () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });

    afterEach(() => {
      vi.runOnlyPendingTimers();
      vi.useRealTimers();
    });

    it('resets isCopied to false after timeout', async () => {
      const writeText = vi.fn().mockResolvedValue(undefined);
      vi.stubGlobal('navigator', { clipboard: { writeText } });

      const { result } = renderHook(() => useCopyToClipboard({ text: 'hello' }));
      await act(async () => {
        result.current.handleCopy();
      });

      expect(result.current.isCopied).toBe(true);

      act(() => {
        vi.advanceTimersByTime(10);
      });

      expect(result.current.isCopied).toBe(false);
    });

    it('clears previous timeout when clicked again before timeout expires', async () => {
      const writeText = vi.fn().mockResolvedValue(undefined);
      vi.stubGlobal('navigator', { clipboard: { writeText } });

      const { result } = renderHook(() => useCopyToClipboard({ text: 'hello' }));

      await act(async () => {
        result.current.handleCopy();
      });

      act(() => {
        vi.advanceTimersByTime(5);
      });

      await act(async () => {
        result.current.handleCopy();
      });

      act(() => {
        vi.advanceTimersByTime(5);
      });
      // Should still be true because second call reset the timer
      expect(result.current.isCopied).toBe(true);

      act(() => {
        vi.advanceTimersByTime(5);
      });
      expect(result.current.isCopied).toBe(false);
    });
  });
});
