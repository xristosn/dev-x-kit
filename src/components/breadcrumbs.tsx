import Link from 'next/link';
import type { NavigationBreadcrumbItem } from '@/types/navigation';

type BreadcrumbsProps = {
  items: NavigationBreadcrumbItem[];
  'data-testid'?: string;
};

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ items, 'data-testid': testId }) => {
  if (items.length === 0) return null;

  return (
    <nav aria-label="Breadcrumb" data-testid={testId}>
      <ol className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
        {items.map((item, index) => {
          const slug = item.label
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '');
          const current = index === items.length - 1;

          return (
            <li key={`${item.label}-${index}`} className="flex items-center gap-2">
              {index > 0 && <span aria-hidden="true">/</span>}
              {item.href && !current ? (
                <Link
                  href={item.href}
                  className="transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  data-testid={testId ? `${testId}-link-${slug}` : undefined}
                >
                  {item.label}
                </Link>
              ) : (
                <span
                  aria-current={current ? 'page' : undefined}
                  data-testid={current && testId ? `${testId}-current` : undefined}
                >
                  {item.label}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};
