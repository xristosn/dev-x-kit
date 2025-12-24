/* eslint-disable @next/next/no-img-element */
'use client';

import { Container } from '@/components/container';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { getBase64FileType } from '@/lib/actions/get-base64-file-type';
import { cn } from '@/lib/utils';
import { File, Image as ImageIcon } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

export default function Base64FileDecoder() {
  const [value, setValue] = useState('');
  const [result, setResult] = useState<DecodeResult | null>(null);
  const isImage = result?.mimeType?.startsWith('image/');

  const onDecode = async () => {
    toast.dismiss();

    try {
      setResult(await base64ToFile(value));
    } catch (err) {
      toast.error('Failed to Decode', {
        description: (err as Error)?.message || (err as string),
        duration: 6000,
      });
    }
  };

  return (
    <Container className="gap-8">
      <div className="grid w-full items-center gap-2">
        <Label htmlFor="base64-input">Base64 or Data URI</Label>
        <Textarea
          id="base64-input"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className={cn(
            'h-20 min-h-20 max-h-[calc(100vh - var(--header-height) - (var(--spacing) * 8))] transition-all duration-300',
            result ? 'max-h-30' : 'min-h-[calc(80vh-var(--header-height)-(var(--spacing)*8))]'
          )}
        />
      </div>

      <div className="flex">
        <Button
          size="lg"
          className="mx-auto w-60 text-lg max-w-full"
          disabled={!value.trim()}
          onClick={onDecode}
        >
          Decode
        </Button>
      </div>

      {result && (
        <div className="p-4 border-2 border-dashed rounded-xl flex flex-col gap-8">
          <a
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
            <>
              <div className="flex flex-col gap-2 items-center justify-center">
                <p className="text-sm">Preview</p>
                <img alt="" src={result.fileUrl} className="size-20 object-contain" />
              </div>
            </>
          ) : result.preview ? (
            <>
              <div className="flex flex-col gap-2 items-center justify-center">
                <p className="text-sm">Preview</p>
                <iframe src={result.fileUrl} className="w-full h-100 border-0 rounded-sm" />
              </div>
            </>
          ) : null}
        </div>
      )}
    </Container>
  );
}

interface DecodeResult {
  size: number;
  mimeType: string;
  fileUrl: string;
  displayName: string;
  preview: boolean;
}

function parseDataUri(dataUri: string) {
  if (!dataUri.startsWith('data:')) return null;

  const parts = dataUri.split(',');

  if (parts.length !== 2) return null;

  const match = parts[0].match(/:(.*?);/);
  if (!match) return null;

  return {
    mimeType: match[1],
    rawBase64: parts[1],
  };
}

function b64ToBlob(rawBase64: string, mimeType: string) {
  const binaryString = atob(rawBase64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);

  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }

  return new Blob([bytes], { type: mimeType });
}

const COMMON_MIME_DISPLAY_MAP: Record<string, string> = {
  'text/plain': 'Text File',
  'text/html': 'HTML Document',
  'application/pdf': 'PDF Document',
  'application/rtf': 'Rich Text Format (RTF)',
  'application/msword': 'Microsoft Word (DOC)',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
    'Microsoft Word (DOCX)',
  'application/vnd.ms-excel': 'Microsoft Excel (XLS)',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'Microsoft Excel (XLSX)',
  'application/vnd.ms-powerpoint': 'Microsoft PowerPoint (PPT)',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation':
    'Microsoft PowerPoint (PPTX)',
  'text/csv': 'CSV File',

  'image/jpeg': 'JPEG Image',
  'image/png': 'PNG Image',
  'image/gif': 'GIF Image',
  'image/bmp': 'Bitmap Image (BMP)',
  'image/webp': 'WebP Image',
  'image/svg+xml': 'SVG Vector Image',
  'image/tiff': 'TIFF Image',

  'audio/mpeg': 'MP3 Audio',
  'audio/wav': 'WAV Audio',
  'audio/ogg': 'Ogg Audio',
  'audio/aac': 'AAC Audio',

  'video/mp4': 'MP4 Video',
  'video/webm': 'WebM Video',
  'video/quicktime': 'QuickTime Video (MOV)',
  'video/x-msvideo': 'AVI Video',

  'application/zip': 'ZIP Archive',
  'application/x-rar-compressed': 'RAR Archive',
  'application/gzip': 'GZ Compressed File',
  'application/x-tar': 'TAR Archive',

  'application/json': 'JSON Data',
  'application/xml': 'XML Data',
  'application/octet-stream': 'Binary/Unknown File',
};

const SUPPORTED_PREVIEW_MIME_TYPES = [
  'application/pdf',
  'text/plain',
  'text/html',
  'text/css',
  'text/javascript',

  'application/xml',
  'application/json',

  'video/mp4',
  'video/webm',
  'video/ogg',

  'audio/mpeg',
  'audio/wav',
  'audio/ogg',
];

async function base64ToFile(base64Input: string): Promise<DecodeResult> {
  if (!base64Input) {
    throw new Error('Input data cannot be empty.');
  }

  let rawBase64Data: string;
  let fileType: string;

  const uriData = parseDataUri(base64Input);

  if (uriData) {
    rawBase64Data = uriData.rawBase64;
    fileType = uriData.mimeType;
  } else {
    rawBase64Data = base64Input;
    fileType = await getBase64FileType(rawBase64Data);
  }

  const blob = b64ToBlob(rawBase64Data, fileType);

  return {
    size: blob.size,
    mimeType: blob.type,
    fileUrl: URL.createObjectURL(blob),
    displayName: COMMON_MIME_DISPLAY_MAP[blob.type] || blob.type,
    preview: SUPPORTED_PREVIEW_MIME_TYPES.includes(blob.type),
  };
}
