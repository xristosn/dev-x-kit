import type { Metadata } from 'next';
import type { NavigationBreadcrumbItem } from '@/types/navigation';
import { SITE_URL } from './constants';

export const SITE_NAME = 'Dev X Kit';
export const SITE_DESCRIPTION =
  'Free online developer tools for code conversion, formatting, CSS, images, color, and more.';
export const OPEN_GRAPH_IMAGE_PATH = '/opengraph-image';

export function createBreadcrumbStructuredData(
  path: string,
  breadcrumbs: NavigationBreadcrumbItem[]
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbs.map((breadcrumb, index) => {
      const isCurrentPage = index === breadcrumbs.length - 1;
      const itemPath = breadcrumb.href ?? (isCurrentPage ? path : undefined);

      return {
        '@type': 'ListItem',
        position: index + 1,
        name: breadcrumb.label,
        ...(itemPath ? { item: new URL(itemPath, SITE_URL).toString() } : {}),
      };
    }),
  };
}

export function createSeoMetadata({
  title,
  description,
  path,
}: {
  title: string;
  description: string;
  path: string;
}): Metadata {
  const brandedTitle = `${title} | ${SITE_NAME}`;
  const canonicalUrl = new URL(path, SITE_URL).toString();
  const image = {
    url: OPEN_GRAPH_IMAGE_PATH,
    width: 1200,
    height: 630,
    alt: `${SITE_NAME} - free online developer tools`,
  };

  return {
    title,
    description,
    alternates: {
      canonical: path,
    },
    openGraph: {
      type: 'website',
      siteName: SITE_NAME,
      title: brandedTitle,
      description,
      url: canonicalUrl,
      images: [image],
    },
    twitter: {
      card: 'summary_large_image',
      title: brandedTitle,
      description,
      images: [OPEN_GRAPH_IMAGE_PATH],
    },
  };
}
