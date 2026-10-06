'use client';

import { Breadcrumbs } from '@/components/breadcrumbs';
import { usePathname } from 'next/navigation';
import { Container } from './container';
import { ToolPageHeader } from './tool-page-header';
import { ToolPageTitleProvider } from './tool-page-title-context';
import type { NavigationBreadcrumbItem } from '@/types/navigation';

export type ToolPageRouteMetadata = {
  path: string;
  title: string;
  description?: string;
  breadcrumbs: NavigationBreadcrumbItem[];
};

type ToolPageShellProps = React.PropsWithChildren<{
  routeMetadata: ToolPageRouteMetadata[];
  fallbackBreadcrumbs?: NavigationBreadcrumbItem[];
  footer?: React.ReactNode;
}>;

export const ToolPageShell: React.FC<ToolPageShellProps> = ({
  children,
  routeMetadata,
  fallbackBreadcrumbs = [],
  footer,
}) => {
  const pathname = usePathname();
  const route = routeMetadata.find((item) => item.path === pathname);

  return (
    <div
      className="relative flex min-h-0 min-w-0 flex-1 flex-col overflow-x-hidden overflow-y-auto"
      data-testid="tool-page-scroll-area"
    >
      {route ? (
        <Container
          className="tool-page-container flex-none min-h-fit"
          data-testid="tool-page-container"
        >
          <ToolPageTitleProvider
            title={route.title}
            description={route.description}
            breadcrumbs={route.breadcrumbs}
          >
            <ToolPageHeader
              title={route.title}
              description={route.description}
              breadcrumbs={route.breadcrumbs}
            />
            {children}
          </ToolPageTitleProvider>
        </Container>
      ) : (
        <>
          {fallbackBreadcrumbs.length > 0 && (
            <Container
              className="flex-none sm:py-6"
              data-testid="tool-page-fallback-breadcrumbs-container"
            >
              <Breadcrumbs items={fallbackBreadcrumbs} data-testid="tool-page-breadcrumb" />
            </Container>
          )}
          <div className="flex-none min-h-fit" data-testid="tool-page-content">
            {children}
          </div>
        </>
      )}
      {footer && (
        <div className="mt-auto shrink-0" data-testid="tool-page-footer">
          {footer}
        </div>
      )}
    </div>
  );
};
