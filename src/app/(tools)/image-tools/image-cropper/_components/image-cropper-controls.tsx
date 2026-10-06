'use client';

import { Download, Trash2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';

type ImageCropperControlsProps = {
  lockAspectRatio: boolean;
  onLockAspectRatioChange: (checked: boolean) => void;
  onReset: () => void;
  onDownload: () => void;
};

export function ImageCropperControls({
  lockAspectRatio,
  onLockAspectRatioChange,
  onReset,
  onDownload,
}: ImageCropperControlsProps) {
  return (
    <div className="flex items-center justify-between flex-wrap gap-4">
      <div className="flex items-center space-x-2">
        <Switch
          id="lock-aspect-ratio"
          data-testid="image-cropper-lock-ratio"
          checked={lockAspectRatio}
          onCheckedChange={onLockAspectRatioChange}
        />
        <label
          htmlFor="lock-aspect-ratio"
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          Lock Aspect Ratio
        </label>
      </div>
      <div className="flex gap-2">
        <Button variant="outline" size="sm" data-testid="image-cropper-reset" onClick={onReset}>
          <Trash2 className="mr-2 h-4 w-4" />
          Reset
        </Button>
        <Button size="sm" data-testid="image-cropper-download" onClick={onDownload}>
          <Download className="mr-2 h-4 w-4" />
          Download
        </Button>
      </div>
    </div>
  );
}
