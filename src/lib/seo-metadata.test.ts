import { describe, expect, test } from 'vitest';
import { SITE_URL } from './constants';
import { createBreadcrumbStructuredData } from './seo-metadata';

describe('createBreadcrumbStructuredData', () => {
  test('preserves breadcrumb order and resolves each item to an absolute URL', () => {
    const structuredData = createBreadcrumbStructuredData('/color-tools/color-picker', [
      { label: 'Home', href: '/' },
      { label: 'Color Tools', href: '/color-tools' },
      { label: 'Color Picker' },
    ]);

    expect(structuredData).toEqual({
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Home',
          item: new URL('/', SITE_URL).toString(),
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'Color Tools',
          item: new URL('/color-tools', SITE_URL).toString(),
        },
        {
          '@type': 'ListItem',
          position: 3,
          name: 'Color Picker',
          item: new URL('/color-tools/color-picker', SITE_URL).toString(),
        },
      ],
    });
  });

  test('does not assign URLs to pathless ancestor crumbs', () => {
    const structuredData = createBreadcrumbStructuredData('/tool', [
      { label: 'Home', href: '/' },
      { label: 'Unlinked Group' },
      { label: 'Tool' },
    ]);

    expect(structuredData.itemListElement[1]).toEqual({
      '@type': 'ListItem',
      position: 2,
      name: 'Unlinked Group',
    });
    expect(structuredData.itemListElement[2].item).toBe(new URL('/tool', SITE_URL).toString());
  });
});
