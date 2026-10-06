'use client';

import { Button } from '@/components/ui/button';
import { useWebStorage } from '@/hooks/use-web-storage';
import { COOKIE_FADE_OUT_MS, COOKIE_SHOW_DELAY_MS } from '@/lib/constants';
import { cn } from '@/lib/utils';
import { Cookie } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

const COOKIE_DISMISSED_KEY = 'cookie_disclaimer_dismissed';

export function CookieDisclaimer() {
  const [dismissed, setDismissed] = useWebStorage<boolean>(COOKIE_DISMISSED_KEY, 'local', false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!dismissed) {
      // Small delay so it doesn't flash in on page load
      const timer = setTimeout(() => setVisible(true), COOKIE_SHOW_DELAY_MS);
      return () => clearTimeout(timer);
    }
  }, [dismissed]);

  const handleDismiss = () => {
    setDismissed(true);
    // Animate out before actually hiding
    setTimeout(() => setVisible(false), COOKIE_FADE_OUT_MS);
  };

  if (!visible || dismissed) return null;

  return (
    <div
      data-testid="cookie-disclaimer"
      className={cn(
        'fixed bottom-4 left-4 z-100 max-w-[calc(100vw-32px)] sm:max-w-md',
        'rounded-lg border bg-card p-4 shadow-lg transition-all duration-300',
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
      )}
    >
      <div className="flex items-start gap-3">
        <p className="flex-1 text-sm text-muted-foreground leading-relaxed">
          This site uses cookies and similar technologies to enhance your experience. By continuing
          to use <span className="font-medium text-foreground">Dev X Kit</span>, you consent to our
          use of cookies as outlined in our{' '}
          <Link
            href="/privacy-policy"
            className="underline underline-offset-4 hover:text-foreground"
          >
            Privacy Policy
          </Link>
          .
        </p>

        <Button
          variant="ghost"
          size="icon-sm"
          className="shrink-0 text-muted-foreground hover:text-foreground"
          data-testid="cookie-disclaimer-close"
          onClick={handleDismiss}
          aria-label="Close cookie disclaimer"
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 14 14"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M1 1l12 12M13 1L1 13"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        </Button>
      </div>

      <div className="mt-6 flex items-center justify-end gap-2">
        <Cookie data-testid="cookie-disclaimer-icon" className="mr-auto size-6" />

        <Button variant="outline" data-testid="cookie-disclaimer-dismiss" onClick={handleDismiss}>
          Dismiss
        </Button>
      </div>
    </div>
  );
}
