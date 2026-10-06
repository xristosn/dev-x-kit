import { Breadcrumbs } from '@/components/breadcrumbs';
import type { NavigationBreadcrumbItem } from '@/types/navigation';

type ToolPageHeaderProps = {
  title: string;
  description?: string;
  breadcrumbs?: NavigationBreadcrumbItem[];
};

export const ToolPageHeader: React.FC<ToolPageHeaderProps> = ({
  title,
  description,
  breadcrumbs = [],
}) => (
  <header className="mb-2 flex flex-col gap-3">
    <Breadcrumbs items={breadcrumbs} data-testid="tool-page-breadcrumb" />
    <h1
      className="text-3xl font-semibold tracking-tight sm:text-4xl"
      data-testid="code-split-view-label"
    >
      {title}
    </h1>
    {description && (
      <p className="max-w-2xl text-muted-foreground" data-testid="tool-page-header-description">
        {description}
      </p>
    )}
  </header>
);
