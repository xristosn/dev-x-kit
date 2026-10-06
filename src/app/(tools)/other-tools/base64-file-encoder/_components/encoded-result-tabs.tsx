/* eslint-disable @next/next/no-img-element */
'use client';

import { CopyIconButton } from '@/components/copy-button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

type EncodedResultTabsProps = {
  result: {
    type: string;
    dataUri: string;
  };
};

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
          <Input
            id="img-tag"
            type="text"
            readOnly
            data-testid="encoded-result-snippet-image-element"
            value={`<img src="${dataUri}" />`}
          />
        </div>

        <div className="flex flex-col gap-2">
          <p className="text-sm">Preview</p>
          <img
            src={dataUri}
            data-testid="encoded-result-image-preview"
            className="size-20 object-contain"
            alt=""
          />
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

          <Input
            id="img-tag"
            type="text"
            readOnly
            data-testid="encoded-result-snippet-css-background-image"
            value={`background-image: url(${dataUri});`}
          />
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
            data-testid="encoded-result-snippet-html-favicon"
            value={`<link rel="shortcut icon" href="${dataUri}" />`}
          />
        </div>
      </>
    ),
    imageOnly: true,
  },
];

function toTestId(label: string) {
  return label.toLowerCase().replace(/\s+/g, '-');
}

export function EncodedResultTabs({ result }: EncodedResultTabsProps) {
  const isImage = result.type.startsWith('image/');
  const tabs = TABS.filter((tab) => isImage || !tab.imageOnly).map((tab) => ({
    label: tab.label,
    result: tab.render(result.dataUri),
  }));

  return (
    <Tabs defaultValue={tabs[0].label} className="p-4 border-2 border-dashed rounded-xl">
      <TabsList className="mb-4">
        {tabs.map((tab) => (
          <TabsTrigger
            key={tab.label}
            value={tab.label}
            data-testid={`encoded-result-tab-${toTestId(tab.label)}`}
          >
            {tab.label}
          </TabsTrigger>
        ))}
      </TabsList>

      {tabs.map((tab) => (
        <TabsContent key={tab.label} value={tab.label} className="w-full">
          {typeof tab.result === 'string' ? (
            <div className="flex flex-col gap-2">
              <div className="flex gap-2 items-center justify-between">
                <p className="text-sm">Code</p>
                <CopyIconButton size="icon-sm" value={result.dataUri} variant="outline" />
              </div>

              <code
                data-testid={`encoded-result-value-${toTestId(tab.label)}`}
                className="block w-full max-h-40 overflow-auto whitespace-pre-wrap bg-card text-card-foreground p-4 rounded-xl text-sm"
              >
                {tab.result}
              </code>
            </div>
          ) : (
            <div className="flex flex-col gap-4">{tab.result}</div>
          )}
        </TabsContent>
      ))}
    </Tabs>
  );
}
