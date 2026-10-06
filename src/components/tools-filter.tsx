'use client';

import { Skeleton } from '@/components/ui/skeleton';
import { ToolCard } from '@/components/tool-card';
import type { NavigationRouteItem, ToolCategory } from '@/types/navigation';
import { useEffect, useRef, useState } from 'react';

const FILTER_TABS: { label: string; categories: ToolCategory[] }[] = [
  { label: 'All tools', categories: [] },
  { label: 'Data Converters', categories: ['Data Converters'] },
  { label: 'Code Converters', categories: ['Code Converters'] },
  { label: 'CSS', categories: ['CSS'] },
  { label: 'Colors', categories: ['Colors'] },
  { label: 'Utilities', categories: ['Utilities'] },
];

type ToolsFilterProps = {
  initialTools: readonly NavigationRouteItem[];
  initialFilter: ToolCategory | null;
};

export default function ToolsFilter({ initialTools, initialFilter }: ToolsFilterProps) {
  const [activeCategories, setActiveCategories] = useState<ToolCategory[]>(
    initialFilter ? [initialFilter] : []
  );
  const [hasHydrated, setHasHydrated] = useState(false);
  const mountedRef = useRef(false);

  // Track hydration: set true after first client render
  useEffect(() => {
    if (!mountedRef.current) {
      mountedRef.current = true;
      setHasHydrated(true);
    }
  }, []);

  // Server renders all tools (empty activeCategories = no filter).
  // Client hydrates with the same state, so no mismatch.
  const filteredTools = initialTools.filter((item) => {
    if (activeCategories.length === 0) return true;
    if (!item.categories) return false;
    return activeCategories.some((cat) => item.categories!.includes(cat));
  });

  return (
    <section className="flex flex-col gap-6" data-testid="tools-filter">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex flex-col gap-1">
          <span className="text-xs uppercase tracking-widest text-muted-foreground font-medium">
            Browse the toolkit
          </span>
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight">
            Tools that get out of your way.
          </h2>
        </div>
        <span className="text-xs font-mono text-muted-foreground" data-testid="tools-count">
          {filteredTools.length} tools
        </span>
      </div>

      <div className="flex flex-wrap gap-2" data-testid="filter-tabs">
        {FILTER_TABS.map((tab) =>
          hasHydrated ? (
            <FilterPill
              key={tab.label}
              label={tab.label}
              data-testid={`filter-pill-${tab.label.toLowerCase().replace(/\s+/g, '-')}`}
              active={
                tab.categories.length === 0
                  ? activeCategories.length === 0
                  : activeCategories.some((cat) => tab.categories!.includes(cat))
              }
              onClick={() => {
                if (tab.categories.length === 0) {
                  setActiveCategories([]);
                } else {
                  setActiveCategories(tab.categories);
                }
              }}
            />
          ) : (
            <Skeleton
              key={tab.label}
              className="w-28 h-8 rounded-full"
              data-testid="filter-skeleton"
            />
          )
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {filteredTools.map((item) => (
          <ToolCard
            key={item.path}
            item={item}
            data-testid={`tool-card-${item.path.replace(/\//g, '-')}`}
          />
        ))}
      </div>
    </section>
  );
}

function FilterPill({
  label,
  active,
  onClick,
  'data-testid': testId,
}: {
  label: string;
  active?: boolean;
  onClick: () => void;
  'data-testid'?: string;
}) {
  return (
    <button
      type="button"
      data-testid={testId}
      aria-pressed={active}
      onClick={onClick}
      className={`px-4 py-1.5 rounded-full text-sm border transition-colors ${
        active
          ? 'bg-primary/10 text-primary border-primary/30'
          : 'bg-card text-foreground border-border hover:bg-accent/40'
      }`}
    >
      {label}
    </button>
  );
}
