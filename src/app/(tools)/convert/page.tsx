import { NavigationGroupPage } from '@/components/navigation-group-page';
import { NAVIGATION } from '@/lib/navigation';
import { createSeoMetadata } from '@/lib/seo-metadata';
import { notFound } from 'next/navigation';

const convertGroup = NAVIGATION.getGroupByPath('/convert');

export const metadata = createSeoMetadata({
  title: 'Code Converters',
  description: 'Browse online converters for code, markup, stylesheets, and data formats.',
  path: '/convert',
});

export default function ConvertLandingPage() {
  if (!convertGroup) notFound();

  return (
    <NavigationGroupPage
      group={convertGroup}
      description="Choose a source format to browse its available conversions."
      breadcrumbs={NAVIGATION.getBreadcrumbsByPath('/convert')}
    />
  );
}
