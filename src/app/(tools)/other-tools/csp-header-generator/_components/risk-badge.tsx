'use client';

import { Badge } from '@/components/ui/badge';
import { AlertTriangle } from 'lucide-react';
import { RISKY_SOURCES } from '../_lib/constants';

export function RiskBadge({ source }: { source: string }) {
  if (!RISKY_SOURCES.has(source)) return null;

  const isUnsafeInline = source === 'unsafe-inline';

  return (
    <Badge
      data-testid="risk-badge"
      variant="destructive"
      className="gap-1 cursor-default"
      title={`"${source}" is a risky choice that weakens CSP protection`}
    >
      <AlertTriangle className="w-3 h-3" />
      {isUnsafeInline ? 'unsafe-inline' : 'unsafe-eval'}
    </Badge>
  );
}
