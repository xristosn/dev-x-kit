/* eslint-disable @next/next/no-img-element */
'use client';

import { Container } from '@/components/container';
import { CopyIconButton } from '@/components/copy-button';
import FileUpload from '@/components/ui/file-upload';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import { TabsList } from '@radix-ui/react-tabs';
import { useState } from 'react';

const TABS: Array<{
  label: string;
  imageOnly?: boolean;
  render: (dataUri: string) => React.ReactNode;
}> = [
  {
    label: 'Base 64',
    render: (dataUri) => dataUri.split(',')[1],
  },
  {
    label: 'Data URI',
    render: (dataUri) => dataUri,
  },
  {
    label: 'Image Element',
    render: (dataUri) => (
      <>
        <div className="grid w-full items-center gap-2">
          <div className="flex justify-between items-center">
            <Label htmlFor="img-tag">Image tag</Label>
            <CopyIconButton size="icon-sm" variant="outline" value={`<img src="${dataUri}" />`} />
          </div>
          <Input id="img-tag" type="text" readOnly value={`<img src="${dataUri}" />`} />
        </div>

        <div className="flex flex-col gap-2">
          <p className="text-sm">Preview</p>

          <img src={dataUri} className="size-20 object-contain" alt="" />
        </div>
      </>
    ),
    imageOnly: true,
  },
  {
    label: 'CSS Background Image',
    render: (dataUri) => (
      <>
        <div className="grid w-full items-center gap-2">
          <div className="flex justify-between items-center">
            <Label htmlFor="img-tag">CSS Background Image</Label>
            <CopyIconButton
              size="icon-sm"
              variant="outline"
              value={`background-image: url(${dataUri});`}
            />
          </div>

          <Input id="img-tag" type="text" readOnly value={`background-image: url(${dataUri});`} />
        </div>

        <div className="flex flex-col gap-2">
          <p className="text-sm">Preview</p>
          <div
            className="size-20 bg-contain bg-no-repeat bg-center"
            style={{ backgroundImage: `url(${dataUri})` }}
          />
        </div>
      </>
    ),
    imageOnly: true,
  },
  {
    label: 'HTML Favicon',
    render: (dataUri) => (
      <>
        <div className="grid w-full items-center gap-2">
          <div className="flex justify-between items-center">
            <Label htmlFor="img-tag">HTML Favicon</Label>
            <CopyIconButton
              size="icon-sm"
              variant="outline"
              value={`<link rel="shortcut icon" href="${dataUri}" />`}
            />
          </div>

          <Input
            id="img-tag"
            type="text"
            readOnly
            value={`<link rel="shortcut icon" href="${dataUri}" />`}
          />
        </div>
      </>
    ),
    imageOnly: true,
  },
];

export default function Base64FileEncoder() {
  const [result, setResult] = useState<EncodeResult | null>(null);
  const isImage = result?.type.startsWith('image/');
  const tabs = result
    ? TABS.filter((t) => isImage || !t.imageOnly).map((t) => ({
        label: t.label,
        result: t.render(result.dataUri),
      }))
    : [];

  return (
    <Container className="gap-8">
      <FileUpload
        maxSize={10 * 1024 * 1024}
        accept={{ '*/*': ['*/*'] }}
        maxFiles={1}
        showFilesList={false}
        onDropAccepted={async (files) => {
          setResult(null);
          setResult(await fileToBase64(files[0]));
        }}
        dropZoneClassName={cn(
          'min-h-16',
          !result && 'h-[calc(100vh-var(--header-height)-(var(--spacing)*8))]'
        )}
      />

      {!!result && (
        <Tabs defaultValue={tabs[0].label} className="p-4 border-2 border-dashed rounded-xl">
          <TabsList className="mb-4">
            {tabs.map((t) => (
              <TabsTrigger key={t.label} value={t.label}>
                {t.label}
              </TabsTrigger>
            ))}
          </TabsList>

          {tabs.map((t) => (
            <TabsContent key={t.label} value={t.label} className="w-full">
              {typeof t.result === 'string' ? (
                <div className="flex flex-col gap-2">
                  <div className="flex gap-2 items-center justify-between">
                    <p className="text-sm">Code</p>
                    <CopyIconButton size="icon-sm" value={result.dataUri} variant="outline" />
                  </div>

                  <code className="block w-full max-h-40 overflow-auto whitespace-pre-wrap bg-card text-card-foreground p-4 rounded-xl text-sm">
                    {t.result}
                  </code>
                </div>
              ) : (
                <div className="flex flex-col gap-4">{t.result}</div>
              )}
            </TabsContent>
          ))}
        </Tabs>
      )}
    </Container>
  );
}

interface EncodeResult {
  name: string;
  size: number;
  type: string;
  dataUri: string;
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
