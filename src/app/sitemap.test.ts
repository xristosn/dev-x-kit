import { beforeEach, describe, expect, it, vi } from 'vitest';

describe('sitemap', () => {
  beforeEach(() => {
    vi.resetModules();
    vi.stubEnv('SITE_URL', 'http://localhost:3000');
    vi.stubEnv('NEXT_PUBLIC_GOOGLE_ANALYTICS_ID', 'G-TEST');
  });

  it('includes public groups and tool routes while excluding TODO subtrees', async () => {
    const { getSitemapPaths } = await import('./sitemap');

    expect(
      getSitemapPaths([
        {
          path: '/color-tools',
          items: [{ path: '/color-tools/color-picker' }, { path: '/unfinished-tool', todo: true }],
        },
        {
          path: '/convert',
          items: [
            {
              path: '/convert/json',
              items: [{ path: '/convert/json/typescript' }],
            },
          ],
        },
        { path: '/unfinished-group', todo: true, items: [{ path: '/unfinished-group/tool' }] },
        { items: [{ path: '/pathless-parent/tool' }] },
        { path: '/color-tools' },
      ])
    ).toEqual([
      '/',
      '/privacy-policy',
      '/terms-of-use',
      '/color-tools',
      '/color-tools/color-picker',
      '/convert',
      '/convert/json',
      '/convert/json/typescript',
      '/pathless-parent/tool',
    ]);
  });

  it('returns absolute URLs for every sitemap entry, including landing pages', async () => {
    const { default: sitemap } = await import('./sitemap');
    const entries = sitemap();
    const urls = entries.map((entry) => entry.url);

    expect(entries.length).toBeGreaterThan(3);
    expect(entries[0].url).toBe('http://localhost:3000/');
    const landingPaths = [
      '/color-tools',
      '/css-tools',
      '/convert',
      '/convert/css',
      '/convert/html',
      '/convert/json',
      '/convert/jss',
      '/convert/php',
      '/convert/scss',
      '/convert/svg',
      '/convert/toml',
      '/convert/ts',
      '/convert/yaml',
      '/image-tools',
      '/other-tools',
    ];

    expect(landingPaths.every((path) => urls.includes(`http://localhost:3000${path}`))).toBe(true);
    expect(new Set(urls).size).toBe(urls.length);
    expect(entries.every((entry) => entry.url.startsWith('http://localhost:3000/'))).toBe(true);
  });
});
