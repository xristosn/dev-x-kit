import { AppHeader } from '@/components/app-header';
import { Footer } from '@/components/footer';
import { AppSidebar } from '@/components/sidebar';
import { ToolPageShell } from '@/components/tool-page-shell';
import type { ToolPageRouteMetadata } from '@/components/tool-page-shell';
import { NAVIGATION } from '@/lib/navigation';
import { createBreadcrumbStructuredData, createSeoMetadata } from '@/lib/seo-metadata';
import type { Metadata } from 'next';
import { headers } from 'next/headers';

function getToolPageRouteMetadata(): ToolPageRouteMetadata[] {
  return NAVIGATION.getSearchableItems().map((item) => ({
    path: item.path,
    title: item.pageTitle || item.fullName || item.label,
    description: item.summary,
    breadcrumbs: NAVIGATION.getBreadcrumbsByPath(item.path),
  }));
}

async function getCurrentTool() {
  const headerList = await headers();
  const pathname = headerList.get('x-current-path') || '';
  const navigationItem = NAVIGATION.getItemByPath(pathname) ?? NAVIGATION.getGroupByPath(pathname);
  return { pathname, navigationItem };
}

export async function generateMetadata(): Promise<Metadata> {
  const { pathname, navigationItem } = await getCurrentTool();
  const toolPath = navigationItem && 'path' in navigationItem ? navigationItem.path : undefined;

  return createSeoMetadata({
    title: navigationItem?.fullName || navigationItem?.label || 'Developer Tool',
    description: navigationItem?.summary || 'Use this free online developer tool from Dev X Kit.',
    path: toolPath || pathname || '/',
  });
}

export default async function ToolsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const routeMetadata = getToolPageRouteMetadata();
  const { pathname, navigationItem } = await getCurrentTool();
  const routePath = navigationItem && 'path' in navigationItem ? navigationItem.path : undefined;
  const breadcrumbs = routePath ? NAVIGATION.getBreadcrumbsByPath(routePath) : [];
  const fallbackBreadcrumbs = navigationItem ? [] : NAVIGATION.getBreadcrumbsByPath(pathname);
  const breadcrumbStructuredData =
    routePath && breadcrumbs.length > 0
      ? createBreadcrumbStructuredData(routePath, breadcrumbs)
      : undefined;

  return (
    <div className="flex h-dvh w-full flex-col overflow-hidden [&>header]:shrink-0">
      {breadcrumbStructuredData && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(breadcrumbStructuredData).replace(/</g, '\\u003c'),
          }}
        />
      )}
      <AppHeader />

      <main className="relative flex min-h-0 w-full flex-1 overflow-hidden">
        <AppSidebar />

        <div className="relative flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
          <ToolPageShell
            routeMetadata={routeMetadata}
            fallbackBreadcrumbs={fallbackBreadcrumbs}
            footer={<Footer />}
          >
            {children}
          </ToolPageShell>
        </div>
      </main>
    </div>
  );
}
