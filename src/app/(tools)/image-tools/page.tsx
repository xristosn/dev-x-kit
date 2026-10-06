import { NavigationGroupPage } from '@/components/navigation-group-page';
import { NAVIGATION } from '@/lib/navigation';
import { notFound } from 'next/navigation';

const imageToolsGroup = NAVIGATION.getGroupByPath('/image-tools');

export default function ImageToolsPage() {
  if (!imageToolsGroup) notFound();

  return (
    <NavigationGroupPage
      group={imageToolsGroup}
      description="Browse tools for converting, resizing, compressing, and generating images."
      breadcrumbs={NAVIGATION.getBreadcrumbsByPath('/image-tools')}
    />
  );
}
