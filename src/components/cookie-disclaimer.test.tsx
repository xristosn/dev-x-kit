import { describe, expect, test, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { COOKIE_SHOW_DELAY_MS } from '@/lib/constants';
import { CookieDisclaimer } from './cookie-disclaimer';

const DISMISSED_KEY = 'cookie_disclaimer_dismissed';

function advanceTime(milliseconds: number) {
  act(() => {
    vi.advanceTimersByTime(milliseconds);
  });
}

function setupVisibleBanner() {
  const { unmount } = render(<CookieDisclaimer />);
  advanceTime(COOKIE_SHOW_DELAY_MS);

  return {
    unmount,
    banner: screen.getByTestId('cookie-disclaimer'),
    dismiss: screen.getByTestId('cookie-disclaimer-dismiss'),
    close: screen.getByTestId('cookie-disclaimer-close'),
  };
}

describe('<CookieDisclaimer />', () => {
  describe('delayed visibility and persisted dismissal', () => {
    beforeEach(() => {
      vi.useFakeTimers();
      localStorage.removeItem(DISMISSED_KEY);
      sessionStorage.removeItem(DISMISSED_KEY);
    });

    afterEach(() => {
      try {
        if (vi.isFakeTimers()) {
          act(() => {
            vi.runOnlyPendingTimers();
          });
        }
      } finally {
        vi.useRealTimers();
        localStorage.removeItem(DISMISSED_KEY);
        sessionStorage.removeItem(DISMISSED_KEY);
      }
    });

    test('shows the complete undismissed banner only after the exact show delay', () => {
      render(<CookieDisclaimer />);
      expect(screen.queryByTestId('cookie-disclaimer')).not.toBeInTheDocument();

      advanceTime(COOKIE_SHOW_DELAY_MS - 1);
      expect(screen.queryByTestId('cookie-disclaimer')).not.toBeInTheDocument();

      advanceTime(1);
      expect(screen.getByTestId('cookie-disclaimer')).toHaveTextContent(
        'This site uses cookies and similar technologies'
      );
      expect(screen.getByTestId('cookie-disclaimer')).toHaveTextContent('Privacy Policy');
      expect(screen.getByTestId('cookie-disclaimer-icon')).toBeInTheDocument();
      expect(screen.getByTestId('cookie-disclaimer-dismiss')).toHaveTextContent('Dismiss');
      expect(screen.getByTestId('cookie-disclaimer-close')).toHaveAttribute(
        'aria-label',
        'Close cookie disclaimer'
      );
      expect(localStorage.getItem(DISMISSED_KEY)).toBeNull();
    });

    test.each(['dismiss', 'close'] as const)(
      'persists dismissal with the %s control and remains hidden after remount',
      async (control) => {
        const view = setupVisibleBanner();
        expect(view.banner).toBeInTheDocument();

        // RTL's async wrapper only drains fake timers automatically under Jest.
        vi.useRealTimers();
        const user = userEvent.setup();
        await user.click(view[control]);

        expect(screen.queryByTestId('cookie-disclaimer')).not.toBeInTheDocument();
        expect(localStorage.getItem(DISMISSED_KEY)).toBe(JSON.stringify(true));
        expect(sessionStorage.getItem(DISMISSED_KEY)).toBeNull();

        view.unmount();
        vi.useFakeTimers();
        render(<CookieDisclaimer />);
        advanceTime(COOKIE_SHOW_DELAY_MS + 1);

        expect(screen.queryByTestId('cookie-disclaimer')).not.toBeInTheDocument();
        expect(localStorage.getItem(DISMISSED_KEY)).toBe(JSON.stringify(true));
      }
    );

    test('keeps a previously persisted dismissal hidden beyond the show delay', () => {
      localStorage.setItem(DISMISSED_KEY, JSON.stringify(true));
      render(<CookieDisclaimer />);

      advanceTime(COOKIE_SHOW_DELAY_MS + 1);

      expect(screen.queryByTestId('cookie-disclaimer')).not.toBeInTheDocument();
      expect(localStorage.getItem(DISMISSED_KEY)).toBe(JSON.stringify(true));
    });
  });
});
