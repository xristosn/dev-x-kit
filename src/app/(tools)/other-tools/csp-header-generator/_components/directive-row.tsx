'use client';

import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { ArrowUp, ArrowDown, Plus, X } from 'lucide-react';
import type { DirectiveConfig } from '../_lib/types';
import { RISKY_SOURCES } from '../_lib/constants';
import { RiskBadge } from './risk-badge';

export function DirectiveRow({
  directive,
  onToggle,
  onAddSource,
  onRemoveSource,
  onMoveUp,
  onMoveDown,
  isFirst,
  isLast,
}: {
  directive: DirectiveConfig;
  onToggle: () => void;
  onAddSource: (source: string) => void;
  onRemoveSource: (source: string) => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  isFirst: boolean;
  isLast: boolean;
}) {
  const [newSource, setNewSource] = useState('');
  const hasRiskySources = directive.sources.some((s) => RISKY_SOURCES.has(s));

  const handleAddSource = () => {
    const trimmed = newSource.trim();
    if (trimmed && !directive.sources.includes(trimmed)) {
      onAddSource(trimmed);
    }
    setNewSource('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddSource();
    }
  };

  return (
    <div
      data-testid={`csp-directive-row-${directive.name}`}
      aria-disabled={!directive.enabled}
      className={`group flex flex-col sm:flex-row sm:items-center gap-3 p-3 rounded-lg border ${
        directive.enabled ? 'border-border bg-card' : 'border-border bg-muted/30 opacity-60'
      }`}
    >
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <Switch
          data-testid={`csp-directive-toggle-${directive.name}`}
          checked={directive.enabled}
          onCheckedChange={onToggle}
        />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span
              data-testid={`csp-directive-label-${directive.name}`}
              className="font-mono text-sm font-medium"
            >
              {directive.label}
            </span>
            {hasRiskySources && (
              <div className="flex gap-1">
                {directive.sources
                  .filter((s) => RISKY_SOURCES.has(s))
                  .map((s) => (
                    <RiskBadge key={s} source={s} />
                  ))}
              </div>
            )}
          </div>
          <p
            data-testid={`csp-directive-description-${directive.name}`}
            className="text-xs text-muted-foreground mt-0.5"
          >
            {directive.description}
          </p>
        </div>
      </div>

      {directive.enabled && (
        <div className="flex items-center gap-2 flex-1 sm:justify-end">
          <div className="flex flex-wrap gap-1">
            {directive.sources.map((source) => (
              <div key={source} className="flex items-center gap-1">
                <Badge
                  data-testid={`csp-source-badge-${directive.name}-${source.replace(/[^a-zA-Z0-9]/g, '-')}`}
                  variant={RISKY_SOURCES.has(source) ? 'destructive' : 'secondary'}
                  className="text-xs font-mono cursor-default"
                >
                  {source}
                </Badge>
                <button
                  data-testid={`csp-remove-source-${source.replace(/[^a-zA-Z0-9]/g, '-')}`}
                  onClick={() => onRemoveSource(source)}
                  className="text-muted-foreground hover:text-destructive transition-colors"
                  aria-label={`Remove ${source}`}
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-1">
            <Input
              data-testid={`csp-add-source-input-${directive.name}`}
              placeholder="Add source..."
              value={newSource}
              onChange={(e) => setNewSource(e.target.value)}
              onKeyDown={handleKeyDown}
              className="w-32 h-7 text-xs"
            />
            <button
              data-testid={`csp-add-source-button-${directive.name}`}
              onClick={handleAddSource}
              className="text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Add source"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      <div className="flex items-center gap-1 sm:opacity-0 sm:group-hover:opacity-100">
        <button
          data-testid={`csp-move-up-${directive.name}`}
          onClick={onMoveUp}
          disabled={isFirst}
          className="text-muted-foreground hover:text-foreground disabled:opacity-30 transition-colors"
          aria-label="Move up"
        >
          <ArrowUp className="w-3.5 h-3.5" />
        </button>
        <button
          data-testid={`csp-move-down-${directive.name}`}
          onClick={onMoveDown}
          disabled={isLast}
          className="text-muted-foreground hover:text-foreground disabled:opacity-30 transition-colors"
          aria-label="Move down"
        >
          <ArrowDown className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
