'use client';

import { Badge } from '@/components/ui/badge';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { useState } from 'react';
import type { DirectiveCategory, DirectiveConfig, DirectiveName } from '../_lib/types';
import { DirectiveRow } from './directive-row';

export function DirectiveGroup({
  category,
  directives,
  onToggle,
  onAddSource,
  onRemoveSource,
  onMoveUp,
  onMoveDown,
}: {
  category: DirectiveCategory;
  directives: DirectiveConfig[];
  onToggle: (name: DirectiveName) => void;
  onAddSource: (name: DirectiveName, source: string) => void;
  onRemoveSource: (name: DirectiveName, source: string) => void;
  onMoveUp: (name: DirectiveName, direction: 'up' | 'down') => void;
  onMoveDown: (name: DirectiveName, direction: 'up' | 'down') => void;
}) {
  const [collapsed, setCollapsed] = useState(false);
  const Icon = category.icon;
  const enabledCount = directives.filter((d) => d.enabled).length;

  return (
    <div className="rounded-lg border border-border overflow-hidden">
      <button
        data-testid="csp-group-header"
        onClick={() => setCollapsed(!collapsed)}
        className="w-full flex items-center gap-3 px-4 py-3 bg-muted/40 hover:bg-muted/60 transition-colors text-left"
      >
        <Icon
          data-testid={`csp-group-icon-${category.id}`}
          className="w-4 h-4 text-muted-foreground shrink-0"
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span data-testid={`csp-group-label-${category.id}`} className="font-medium text-sm">
              {category.label}
            </span>
            {enabledCount > 0 && (
              <Badge data-testid="csp-group-badge" variant="secondary" className="text-xs">
                {enabledCount} active
              </Badge>
            )}
          </div>
          <p
            data-testid={`csp-group-description-${category.id}`}
            className="text-xs text-muted-foreground mt-0.5"
          >
            {category.description}
          </p>
        </div>
        {collapsed ? (
          <ChevronRight className="w-4 h-4 text-muted-foreground flex-shrink-0" />
        ) : (
          <ChevronDown className="w-4 h-4 text-muted-foreground flex-shrink-0" />
        )}
      </button>
      {!collapsed && (
        <div data-testid="csp-group-content" className="p-3 space-y-2 bg-card">
          {directives.map((directive) => {
            const globalIdx = directives.indexOf(directive);
            return (
              <DirectiveRow
                key={directive.name}
                directive={directive}
                onToggle={() => onToggle(directive.name)}
                onAddSource={(source) => onAddSource(directive.name, source)}
                onRemoveSource={(source) => onRemoveSource(directive.name, source)}
                onMoveUp={() => onMoveUp(directive.name, 'up')}
                onMoveDown={() => onMoveDown(directive.name, 'down')}
                isFirst={globalIdx === 0}
                isLast={globalIdx === directives.length - 1}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
