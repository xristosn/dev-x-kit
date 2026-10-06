'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';
import type { ServicePreset } from '../_lib/types';

export function ServicePresetCard({
  preset,
  onApply,
  applied,
}: {
  preset: ServicePreset;
  onApply: (preset: ServicePreset) => void;
  applied: boolean;
}) {
  return (
    <div
      className={`p-4 rounded-lg border transition-all ${
        applied ? 'border-primary/50 bg-primary/5' : 'border-border hover:border-border/80'
      }`}
    >
      <div className="flex items-start gap-3">
        <span className="text-xl">{preset.icon}</span>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h4 className="font-medium text-sm">{preset.name}</h4>
            {applied && (
              <Badge variant="secondary" className="text-xs gap-1">
                <Check className="w-3 h-3" /> Applied
              </Badge>
            )}
          </div>
          <p className="text-xs text-muted-foreground mt-1">{preset.description}</p>
          <div className="flex flex-wrap gap-1 mt-2">
            {preset.tags.map((tag) => (
              <Badge key={tag} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        </div>
      </div>
      <div className="mt-3">
        <Button
          size="sm"
          variant={applied ? 'secondary' : 'outline'}
          onClick={() => onApply(preset)}
          className="w-full text-xs"
        >
          {applied ? 'Remove' : 'Add to policy'}
        </Button>
      </div>
    </div>
  );
}
