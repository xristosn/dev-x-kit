import { Breadcrumbs } from '@/components/breadcrumbs';
import { ToolCard } from '@/components/tool-card';
import type {
  NavigationBreadcrumbItem,
  NavigationGroup,
  NavigationGroupItem,
} from '@/types/navigation';
import { Container } from './container';

type NavigationGroupPageProps = {
  group: NavigationGroup;
  description: string;
  breadcrumbs?: NavigationBreadcrumbItem[];
};

export const NavigationGroupPage: React.FC<NavigationGroupPageProps> = ({
  group,
  description,
  breadcrumbs = [],
}) => (
  <Container className="sm:py-6">
    <div className="flex flex-col gap-6">
      <Breadcrumbs items={breadcrumbs} data-testid="navigation-group-page-breadcrumb" />
      <header className="flex flex-col gap-3">
        <h1
          className="text-3xl font-semibold tracking-tight sm:text-4xl"
          data-testid="navigation-group-page-title"
        >
          {group.fullName || group.label}
        </h1>
        <p
          className="max-w-2xl text-muted-foreground"
          data-testid="navigation-group-page-description"
        >
          {description}
        </p>
      </header>

      <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {group.items?.map((item) => renderGroupItem(item))}
      </ul>
    </div>
  </Container>
);

function renderGroupItem(item: NavigationGroupItem) {
  if (!item.path) return null;

  const slug = item.label
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

  return (
    <li key={item.path}>
      <ToolCard
        item={{
          path: item.path,
          label: item.label,
          fullName: item.fullName,
          summary: item.summary,
          icon: item.icon,
        }}
        data-testid={`navigation-group-page-item-${slug}`}
        summaryTestId={item.summary ? `navigation-group-page-item-summary-${slug}` : undefined}
      />
    </li>
  );
}
