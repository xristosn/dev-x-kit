import { NavigationGroupPage } from '@/components/navigation-group-page';
import { NAVIGATION } from '@/lib/navigation';
import { notFound } from 'next/navigation';

const colorToolsGroup = NAVIGATION.getGroupByPath('/color-tools');

export default function ColorToolsPage() {
  if (!colorToolsGroup) notFound();

  return (
    <NavigationGroupPage
      group={colorToolsGroup}
      description="Browse color tools for picking colors, editing gradients, checking contrast, and generating palettes."
      breadcrumbs={NAVIGATION.getBreadcrumbsByPath('/color-tools')}
    />
  );
}
