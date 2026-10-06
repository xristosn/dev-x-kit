import { NavigationGroupPage } from '@/components/navigation-group-page';
import { NAVIGATION } from '@/lib/navigation';
import { notFound } from 'next/navigation';

const cssToolsGroup = NAVIGATION.getGroupByPath('/css-tools');

export default function CssToolsPage() {
  if (!cssToolsGroup) notFound();

  return (
    <NavigationGroupPage
      group={cssToolsGroup}
      description="Browse CSS tools for generating styles, patterns, and responsive measurements."
      breadcrumbs={NAVIGATION.getBreadcrumbsByPath('/css-tools')}
    />
  );
}
