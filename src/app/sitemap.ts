import type { MetadataRoute } from 'next';
import { NAVIGATION } from '@/lib/navigation';
import { SITE_URL } from '@/lib/constants';

const STATIC_PATHS = ['/', '/privacy-policy', '/terms-of-use'] as const;

type SitemapItem = {
  path?: string;
  todo?: boolean;
  items?: readonly SitemapItem[];
};

export function getSitemapPaths(items: readonly SitemapItem[]) {
  const collectPaths = (nodes: readonly SitemapItem[]): string[] =>
    nodes.flatMap((item) => {
      if (item.todo) return [];

      return [...(item.path ? [item.path] : []), ...(item.items ? collectPaths(item.items) : [])];
    });

  return [...new Set([...STATIC_PATHS, ...collectPaths(items)])];
}

export default function sitemap(): MetadataRoute.Sitemap {
  return getSitemapPaths(NAVIGATION.getGroups()).map((path) => ({
    url: new URL(path, SITE_URL).toString(),
  }));
}
