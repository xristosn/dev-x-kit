// @vitest-environment node
import { afterEach, describe, expect, it, vi } from 'vitest';
import { NextRequest } from 'next/server';
import nextConfig from '../next.config';
import { config, proxy } from './proxy';

describe('proxy', () => {
  afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllEnvs();
  });
  it('configures same-origin isolation for public and application resources', async () => {
    const headerRules = (await nextConfig.headers?.()) || [];
    const siteWideRule = headerRules.find((rule) => rule.source === '/:path*');

    expect(siteWideRule?.headers).toContainEqual({
      key: 'Cross-Origin-Resource-Policy',
      value: 'same-origin',
    });
  });

  it('retains security headers, matcher, and path forwarding', () => {
    const request = new NextRequest('http://localhost:3000/convert/json/graphql', {
      headers: { host: 'localhost:3000', 'x-forwarded-for': '192.0.2.43' },
    });
    const response = proxy(request);

    expect(config.matcher).toBe(
      '/((?!_next|favicon\\.ico|static|sitemap\\.xml|robots\\.txt|opengraph-image).*)'
    );
    expect(response.headers.get('x-content-type-options')).toBe('nosniff');
    expect(response.headers.get('x-frame-options')).toBe('SAMEORIGIN');
    expect(response.headers.get('x-dns-prefetch-control')).toBe('default');
    expect(response.headers.get('referrer-policy')).toBe('strict-origin-when-cross-origin');
    const contentSecurityPolicy = response.headers.get('content-security-policy') || '';
    expect(contentSecurityPolicy).toContain("'unsafe-eval'");
    expect(contentSecurityPolicy).toContain('https://www.googletagmanager.com');
    expect(contentSecurityPolicy).toContain("img-src 'self' data: https: blob:");
    expect(contentSecurityPolicy).not.toContain('cdn.jsdelivr.net');
    expect(response.headers.get('strict-transport-security')).toBe(
      'max-age=31536000; includeSubDomains; preload'
    );
    expect(response.headers.get('x-middleware-request-x-current-path')).toBe(
      '/convert/json/graphql'
    );
    expect(response.headers.get('x-rate-limit-limit')).toBeNull();
  });

  it('allows a same-host POST', () => {
    const request = new NextRequest('http://localhost:3000/tool', {
      method: 'POST',
      headers: { host: 'localhost:3000', origin: 'http://localhost:3000' },
    });

    expect(proxy(request).status).toBe(200);
  });

  it('rejects an origin whose hostname only contains the allowed host', () => {
    const request = new NextRequest('http://localhost:3000/tool', {
      method: 'POST',
      headers: { host: 'localhost:3000', origin: 'https://localhost:3000.attacker.test' },
    });

    expect(proxy(request).status).toBe(403);
  });

  it('rejects invalid or absent origins for POSTs', () => {
    for (const origin of ['not-a-url', 'null', '']) {
      const request = new NextRequest('http://localhost:3000/tool', {
        method: 'POST',
        headers: { host: 'localhost:3000', ...(origin && { origin }) },
      });
      expect(proxy(request).status).toBe(403);
    }
  });

  it('does not throttle local development page and action requests', () => {
    vi.stubEnv('NODE_ENV', 'development');
    const headers = { host: 'localhost:3000', origin: 'http://localhost:3000' };

    for (let i = 0; i < 120; i++) {
      const request = new NextRequest('http://localhost:3000/tool', {
        method: i % 2 ? 'POST' : 'GET',
        headers,
      });
      const response = proxy(request);
      expect(response.status).toBe(200);
      expect(response.headers.get('content-security-policy')).toBeTruthy();
      expect(response.headers.get('x-middleware-next')).toBe('1');
    }
  });

  it('does not count page navigation and asset GET requests against the limit', () => {
    vi.stubEnv('NODE_ENV', 'production');
    const headers = { host: 'localhost:3000', 'x-forwarded-for': '192.0.2.41' };

    for (let i = 0; i < 150; i++) {
      const response = proxy(new NextRequest(`http://localhost:3000/tool-${i}`, { headers }));
      expect(response.status).toBe(200);
      expect(response.headers.get('x-rate-limit-limit')).toBeNull();
    }
  });

  it('limits Server Action POSTs per IP over a rolling minute', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-01-01T00:00:00Z'));
    vi.stubEnv('NODE_ENV', 'production');
    const headers = {
      host: 'localhost:3000',
      origin: 'http://localhost:3000',
      'x-forwarded-for': '192.0.2.42',
    };

    for (let i = 0; i < 100; i++) {
      if (i > 0) vi.advanceTimersByTime(500);
      const response = proxy(
        new NextRequest('http://localhost:3000/tool', { method: 'POST', headers })
      );
      expect(response.status).toBe(200);
      if (i === 0) {
        expect(response.headers.get('x-rate-limit-remaining')).toBe('99');
        expect(response.headers.get('x-rate-limit-reset')).toBe('1767225660');
      }
      if (i === 99) expect(response.headers.get('x-rate-limit-remaining')).toBe('0');
    }

    const firstBlocked = proxy(
      new NextRequest('http://localhost:3000/tool', { method: 'POST', headers })
    );
    expect(firstBlocked.status).toBe(429);
    expect(firstBlocked.headers.get('retry-after')).toBe('11');
    expect(firstBlocked.headers.get('x-rate-limit-limit')).toBe('100');
    expect(firstBlocked.headers.get('x-rate-limit-remaining')).toBe('0');
    expect(firstBlocked.headers.get('x-rate-limit-reset')).toBe('1767225660');
    expect(firstBlocked.headers.get('x-middleware-next')).toBeNull();
    expect(firstBlocked.headers.get('content-security-policy')).toBeTruthy();

    vi.advanceTimersByTime(10_000);
    const stillBlocked = proxy(
      new NextRequest('http://localhost:3000/tool', { method: 'POST', headers })
    );
    expect(stillBlocked.status).toBe(429);
    expect(stillBlocked.headers.get('retry-after')).toBe('1');

    vi.advanceTimersByTime(501);
    const allowedAfterWindow = proxy(
      new NextRequest('http://localhost:3000/tool', { method: 'POST', headers })
    );
    expect(allowedAfterWindow.status).toBe(200);
    expect(allowedAfterWindow.headers.get('x-rate-limit-remaining')).toBe('0');
  });

  it('maintains separate POST budgets for separate client IPs', () => {
    vi.stubEnv('NODE_ENV', 'production');
    const makePost = (ip: string) =>
      new NextRequest('http://localhost:3000/tool', {
        method: 'POST',
        headers: {
          host: 'localhost:3000',
          origin: 'http://localhost:3000',
          'x-forwarded-for': ip,
        },
      });

    for (let i = 0; i < 100; i++) {
      expect(proxy(makePost('192.0.2.43')).status).toBe(200);
    }

    expect(proxy(makePost('192.0.2.43')).status).toBe(429);
    expect(proxy(makePost('192.0.2.44')).status).toBe(200);
  });
});
