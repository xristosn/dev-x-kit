'use client';

import { AlertTriangle, CheckCircle2, XCircle } from 'lucide-react';
import type { ParseResult } from '../_lib/types';

export function ImportCspResult({ result }: { result: ParseResult | null }) {
  if (!result) return null;

  const directiveCount = result.directives?.filter((directive) => directive.enabled).length ?? 0;

  return (
    <div
      className={`rounded-lg border p-3 space-y-2 ${
        result.success
          ? 'border-emerald-500/30 bg-emerald-500/5'
          : 'border-destructive/30 bg-destructive/5'
      }`}
    >
      <div data-testid="import-result" className="flex items-center gap-2">
        {result.success ? (
          <CheckCircle2 className="w-4 h-4 text-emerald-500" />
        ) : (
          <XCircle className="w-4 h-4 text-destructive" />
        )}
        <span className="text-sm font-medium">
          {result.success ? 'Parsed successfully' : 'Could not parse'}
        </span>
      </div>

      {result.success && result.directives && (
        <div data-testid="import-directive-count" className="text-xs text-muted-foreground">
          <span>
            {directiveCount} directive{directiveCount !== 1 ? 's' : ''} found
          </span>
          {result.warnings && result.warnings.length > 0 && (
            <span className="ml-2">(see warnings below)</span>
          )}
        </div>
      )}

      {!result.success && result.message && (
        <p data-testid="import-error-message" className="text-xs text-muted-foreground">
          {result.message}
        </p>
      )}

      {result.warnings && result.warnings.length > 0 && (
        <div data-testid="import-warnings" className="space-y-1">
          {result.warnings.map((warning, index) => (
            <div key={index} className="flex items-start gap-1.5 text-xs text-amber-600">
              <AlertTriangle className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
              <span>{warning}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
