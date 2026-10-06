'use client';

import { ClientOnly } from '@/components/client-only';
import { FaqSection, type FaqItem } from '@/components/faq-section';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import { toast } from 'sonner';
import { DecodedFilePreview } from './_components/decoded-file-preview';
import { base64ToFile, type DecodeResult } from './_lib/base64-to-file';

const FAQS = [
  {
    title: 'Should I enter raw Base64 or a data URI?',
    description:
      'Either format is accepted. A data URI provides a media type in its header, while raw Base64 requires the tool to identify the file type from the encoded bytes.',
  },
  {
    title: 'Why can raw Base64 fail even when it looks valid?',
    description:
      'For raw Base64, the decoder must recognize the file type from its contents. If it cannot determine a type, it returns an error. A data URI can provide the media type explicitly.',
  },
  {
    title: 'Why is there no preview for my decoded file?',
    description:
      'Decoded files can be downloaded, but previews are limited to images and a supported set of media and document types. Other file types still appear as a downloadable file without an embedded preview.',
  },
] satisfies readonly FaqItem[];

export default function Base64FileDecoder() {
  const [value, setValue] = useState('');
  const [result, setResult] = useState<DecodeResult | null>(null);

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
    <>
      <div className="grid w-full items-center gap-2">
        <Label htmlFor="base64-input">Base64 or Data URI</Label>
        <Textarea
          id="base64-input"
          data-testid="base64-file-decoder-input"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className={cn(
            'h-20 min-h-20 max-h-[calc(100vh - var(--header-height) - (var(--spacing) * 8))] transition-all duration-300',
            result ? 'max-h-30' : 'editor-height'
          )}
        />
      </div>

      <div className="flex">
        <ClientOnly>
          <Button
            size="lg"
            data-testid="base64-file-decoder-decode"
            className="mx-auto w-60 text-lg max-w-full"
            disabled={!value.trim()}
            onClick={onDecode}
          >
            Decode
          </Button>
        </ClientOnly>
      </div>

      {result && <DecodedFilePreview result={result} />}
      <FaqSection items={FAQS} />
    </>
  );
}
