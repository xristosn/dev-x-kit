import { NavigationGroupPage } from '@/components/navigation-group-page';
import { NAVIGATION } from '@/lib/navigation';
import { createSeoMetadata } from '@/lib/seo-metadata';
import { notFound } from 'next/navigation';

type ConverterFormatPageProps = {
  params: Promise<{ format: string }>;
};

const converterGroup = NAVIGATION.getGroupByPath('/convert');
const converterFormats =
  converterGroup?.items?.filter((item) => 'items' in item && Array.isArray(item.items)) ?? [];

export const dynamicParams = false;

export function generateStaticParams() {
  return converterFormats.flatMap((item) =>
    item.path ? [{ format: item.path.split('/').at(-1)! }] : []
  );
}

export async function generateMetadata({ params }: ConverterFormatPageProps) {
  const { format } = await params;
  const group = NAVIGATION.getGroupByPath(`/convert/${format}`);

  return createSeoMetadata({
    title: group?.fullName || group?.label || 'Code Converters',
    description: `Browse available ${group?.label || 'code'} conversions.`,
    path: `/convert/${format}`,
  });
}

export default async function ConverterFormatPage({ params }: ConverterFormatPageProps) {
  const { format } = await params;
  const group = NAVIGATION.getGroupByPath(`/convert/${format}`);

  if (!group) notFound();

  return (
    <NavigationGroupPage
      group={group}
      description={`Choose a ${group.label} conversion to open the tool.`}
      breadcrumbs={NAVIGATION.getBreadcrumbsByPath(`/convert/${format}`)}
    />
  );
}
