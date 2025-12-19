import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
  if (request.method === 'POST') {
    const origin = request.headers.get('origin');
    const host = request.headers.get('host');

    if (!origin || !origin.includes(host as string)) {
      return new NextResponse('Access Denied', { status: 403 });
    }
  }

  const requestHeaders = new Headers(request.headers);

  requestHeaders.set('x-current-path', request.nextUrl.pathname);

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
