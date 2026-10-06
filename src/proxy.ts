import { NextResponse, type NextRequest } from 'next/server';

const securityHeaders = [
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
  { key: 'X-DNS-Prefetch-Control', value: 'default' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  {
    key: 'Content-Security-Policy',
    value:
      "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: https: blob:; connect-src 'self' https:; font-src 'self' data:; object-src 'none'; frame-src 'none'; worker-src 'self' blob:",
  },
  { key: 'Strict-Transport-Security', value: 'max-age=31536000; includeSubDomains; preload' },
];

const RATE_LIMIT_REQUESTS = 100;
const RATE_LIMIT_WINDOW_MS = 60 * 1000;
const RATE_LIMIT_MAX_CLIENTS = 10_000;
const RATE_LIMIT_CLEANUP_INTERVAL = 1024;

const rateLimitStore = new Map<string, number[]>();
let rateLimitRequestsSinceCleanup = 0;

function pruneRateLimitStore(now: number) {
  for (const [ip, timestamps] of rateLimitStore) {
    if (now - timestamps[timestamps.length - 1] >= RATE_LIMIT_WINDOW_MS) {
      rateLimitStore.delete(ip);
    }
  }
}

function checkRateLimit(ip: string, now: number) {
  rateLimitRequestsSinceCleanup++;
  if (rateLimitRequestsSinceCleanup >= RATE_LIMIT_CLEANUP_INTERVAL) {
    pruneRateLimitStore(now);
    rateLimitRequestsSinceCleanup = 0;
  }

  const timestamps = (rateLimitStore.get(ip) || []).filter(
    (timestamp) => now - timestamp < RATE_LIMIT_WINDOW_MS
  );
  const resetAt = timestamps.length
    ? timestamps[0] + RATE_LIMIT_WINDOW_MS
    : now + RATE_LIMIT_WINDOW_MS;

  if (timestamps.length >= RATE_LIMIT_REQUESTS) {
    rateLimitStore.delete(ip);
    rateLimitStore.set(ip, timestamps);
    return { allowed: false, remaining: 0, resetAt };
  }

  timestamps.push(now);
  const isNewClient = !rateLimitStore.has(ip);
  rateLimitStore.delete(ip);
  if (isNewClient && rateLimitStore.size >= RATE_LIMIT_MAX_CLIENTS) {
    const oldestIp = rateLimitStore.keys().next().value;
    if (oldestIp) rateLimitStore.delete(oldestIp);
  }
  rateLimitStore.set(ip, timestamps);

  return {
    allowed: true,
    remaining: RATE_LIMIT_REQUESTS - timestamps.length,
    resetAt,
  };
}

function secureResponse(response: NextResponse) {
  for (const { key, value } of securityHeaders) response.headers.set(key, value);
  return response;
}

function forwardRequest(request: NextRequest) {
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-current-path', request.nextUrl.pathname);
  return NextResponse.next({ request: { headers: requestHeaders } });
}

export function proxy(request: NextRequest) {
  if (request.method === 'POST') {
    const origin = request.headers.get('origin');
    const host = request.headers.get('host');
    let originHost: string | undefined;

    try {
      if (origin) originHost = new URL(origin).host;
    } catch {
      // Malformed origins are denied just like absent origins.
    }

    if (!originHost || !host || originHost !== host.toLowerCase()) {
      return secureResponse(new NextResponse('Access Denied', { status: 403 }));
    }
  }

  // Local development generates many requests for a single browser visit.
  if (process.env.NODE_ENV === 'development') return secureResponse(forwardRequest(request));

  // Server Actions use POST. Do not count page navigation, RSC requests, or assets.
  if (request.method !== 'POST') return secureResponse(forwardRequest(request));

  // Vercel normally overwrites this header. The in-memory limit is per runtime instance.
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
  const now = Date.now();
  const { allowed, remaining, resetAt } = checkRateLimit(ip, now);
  const resetAtSeconds = Math.ceil(resetAt / 1000).toString();

  if (!allowed) {
    const retryAfter = Math.max(1, Math.ceil((resetAt - now) / 1000));
    const response = new NextResponse('Too Many Requests', { status: 429 });
    response.headers.set('retry-after', retryAfter.toString());
    response.headers.set('x-rate-limit-limit', RATE_LIMIT_REQUESTS.toString());
    response.headers.set('x-rate-limit-remaining', '0');
    response.headers.set('x-rate-limit-reset', resetAtSeconds);
    return secureResponse(response);
  }

  const response = forwardRequest(request);
  response.headers.set('x-rate-limit-limit', RATE_LIMIT_REQUESTS.toString());
  response.headers.set('x-rate-limit-remaining', remaining.toString());
  response.headers.set('x-rate-limit-reset', resetAtSeconds);
  return secureResponse(response);
}

export const config = {
  matcher: '/((?!_next|favicon\\.ico|static|sitemap\\.xml|robots\\.txt|opengraph-image).*)',
};
