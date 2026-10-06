'use client';

import React from 'react';
import QRCodeStyling from 'qr-code-styling';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';

type QrPreviewProps = {
  previewRef: React.RefObject<HTMLDivElement | null>;
  qrCodeRef: React.RefObject<QRCodeStyling | null>;
};

export function QrPreview({ previewRef, qrCodeRef }: QrPreviewProps) {
  return (
    <div className="max-w-full lg:sticky top-1">
      <div className="flex flex-col gap-8 bg-card p-4 rounded-xl shadow-sm mx-auto w-full">
        <div
          ref={previewRef}
          className="[&>canvas]:max-w-72 [&>canvas]:w-full [&>canvas]:max-h-72 w-full"
        />
        <div className="flex flex-wrap gap-4 max-w-72">
          <p className="flex gap-4 text-lg items-center justify-center w-full">
            <Download /> Download to:
          </p>
          <div className="grid grid-cols-2 gap-4 items-center justify-between w-full">
            <Button
              data-testid="qr-download-png"
              onClick={() => qrCodeRef.current?.download({ extension: 'png' })}
            >
              .png
            </Button>
            <Button onClick={() => qrCodeRef.current?.download({ extension: 'jpeg' })}>
              .jpeg
            </Button>
            <Button
              data-testid="qr-download-svg"
              onClick={() => qrCodeRef.current?.download({ extension: 'svg' })}
            >
              .svg
            </Button>
            <Button onClick={() => qrCodeRef.current?.download({ extension: 'webp' })}>
              .webp
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
