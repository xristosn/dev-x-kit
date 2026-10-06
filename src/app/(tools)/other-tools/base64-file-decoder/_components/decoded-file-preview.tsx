/* eslint-disable @next/next/no-img-element */

import { Button } from '@/components/ui/button';
import { File, Image as ImageIcon } from 'lucide-react';
import type { DecodeResult } from '../_lib/base64-to-file';

export function DecodedFilePreview({ result }: { result: DecodeResult }) {
  const isImage = result.mimeType.startsWith('image/');

  return (
    <div className="p-4 border-2 border-dashed rounded-xl flex flex-col gap-8">
      <a
        data-testid="base64-file-decoder-download"
        href={result.fileUrl}
        download="decoded"
        className="flex flex-col gap-4 items-center justify-center mx-auto"
      >
        <div className="p-4 bg-card text-card-foreground rounded-xl flex flex-col gap-2 items-center">
          {isImage ? <ImageIcon className="size-16" /> : <File className="size-16" />}

          <p className="text-xs text-muted-foreground">{result.displayName}</p>
        </div>

        <Button size="sm" className="cursor-pointer">
          Download {isImage ? 'Image' : 'File'}
        </Button>
      </a>

      {isImage ? (
        <div className="flex flex-col gap-2 items-center justify-center">
          <p className="text-sm">Preview</p>
          <img
            data-testid="base64-file-decoder-image-preview"
            alt=""
            src={result.fileUrl}
            className="size-20 object-contain"
          />
        </div>
      ) : result.preview ? (
        <div className="flex flex-col gap-2 items-center justify-center">
          <p className="text-sm">Preview</p>
          <iframe
            data-testid="base64-file-decoder-file-preview"
            src={result.fileUrl}
            className="w-full h-100 border-0 rounded-sm"
          />
        </div>
      ) : null}
    </div>
  );
}
