'use client';

import FileUpload from '@/components/ui/file-upload';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import { toast } from 'sonner';
import { EncodedResultTabs } from './encoded-result-tabs';

type EncodeResult = {
  name: string;
  size: number;
  type: string;
  dataUri: string;
};

export function Base64FileEncoderTool() {
  const [result, setResult] = useState<EncodeResult | null>(null);

  return (
    <>
      <FileUpload
        inputTestId="base64-file-encoder-input"
        maxSize={10 * 1024 * 1024}
        accept={{ '*/*': ['*/*'] }}
        maxFiles={1}
        showFilesList={false}
        enableImageClipboard
        onDropAccepted={async (files) => {
          try {
            setResult(null);
            setResult(await fileToBase64(files[0]));
          } catch (err) {
            toast.error('Failed to encode', {
              description: (err as Error)?.message || (err as string),
              duration: 6000,
            });
          }
        }}
        containerClassName={cn(!result && 'flex-1 min-h-0')}
        dropZoneClassName={cn('min-h-42', !result && 'editor-height')}
      />

      {result && <EncodedResultTabs result={result} />}
    </>
  );
}

function fileToBase64(file: File): Promise<EncodeResult> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    const base = {
      name: file.name,
      size: file.size,
      type: file.type,
    };

    const timeout = setTimeout(() => {
      reader.abort();
    }, 60000);

    reader.addEventListener('abort', (e) => {
      clearTimeout(timeout);
      reject(new Error(`Aborted: ${e}`));
    });

    reader.addEventListener('error', (e) => {
      clearTimeout(timeout);
      reject(new Error(`File reader error: ${e}`));
    });

    reader.addEventListener(
      'load',
      () => {
        clearTimeout(timeout);

        resolve({
          ...base,
          dataUri: reader.result as string,
        });
      },
      false
    );

    reader.readAsDataURL(file);
  });
}
