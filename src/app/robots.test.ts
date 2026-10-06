import { beforeEach, describe, expect, it, vi } from 'vitest';

describe('robots', () => {
  beforeEach(() => {
    vi.resetModules();
    vi.stubEnv('SITE_URL', 'http://localhost:3000');
  });

  it('allows public crawling and points to the sitemap', async () => {
    const { default: robots } = await import('./robots');

    expect(robots()).toEqual({
      rules: {
        userAgent: '*',
        allow: '/',
      },
      sitemap: 'http://localhost:3000/sitemap.xml',
    });
  });
});
