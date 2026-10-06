import { NavigationGroupPage } from '@/components/navigation-group-page';
import { NAVIGATION } from '@/lib/navigation';
import { createSeoMetadata } from '@/lib/seo-metadata';
import { notFound } from 'next/navigation';

const otherToolsGroup = NAVIGATION.getGroupByPath('/other-tools');

export const metadata = createSeoMetadata({
  title: 'Developer Utilities',
  description: 'Browse practical developer utilities for everyday coding tasks.',
  path: '/other-tools',
});

export default function OtherToolsLandingPage() {
  if (!otherToolsGroup) notFound();

  return (
    <NavigationGroupPage
      group={otherToolsGroup}
      description="Browse useful developer utilities and small everyday helpers."
      breadcrumbs={NAVIGATION.getBreadcrumbsByPath('/other-tools')}
    />
  );
}
