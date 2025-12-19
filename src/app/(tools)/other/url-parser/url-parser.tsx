'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useWebStorage } from '@/hooks/use-web-storage';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

export const URLParser: React.FC = () => {
  const [value, setValue] = useWebStorage(
    'url-parser',
    'infer',
    'https://duckduckgo.com/404-page-not-found?q=This+is+a+random+url&foo=with+random+query+params'
  );
  const [url, setUrl] = useState<URL | null>(null);

  useEffect(() => {
    if (!value.trim()) return;

    toast.dismiss();

    try {
      const parsed = new URL(value.trim());
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setUrl(parsed);
    } catch (err) {
      toast.error('Failed to parse URL', {
        description: (err as Error).message || (err as string),
        dismissible: false,
        duration: Infinity,
      });
    }
  }, [value]);

  return (
    <>
      <div className="bg-card shadow-sm p-4 rounded-xl">
        <InputWrapper label="URL" id="url-input" value={value}>
          <Input
            id="url-input"
            type="url"
            className="p-4 text-md sm:text-md md:text-md"
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />
        </InputWrapper>
      </div>

      <div className="flex flex-col gap-4 bg-card shadow-sm p-4 rounded-xl">
        <p>URL Details</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <InputWrapper
            label="Protocol"
            id="url-protocol"
            value={(url?.protocol || '').replace(':', '')}
          />

          <InputWrapper label="Host" id="url-host" value={url?.host} />

          <InputWrapper label="Hostname" id="url-hostname" value={url?.hostname} />

          <InputWrapper label="Port" id="url-port" value={url?.port} />

          <InputWrapper label="Pathname" id="url-pathname" value={url?.pathname} />

          <InputWrapper label="hash" id="url-hash" value={url?.hash} />
        </div>

        <InputWrapper label="Query" id="url-query" value={url?.search} />
      </div>

      <div className="flex flex-col gap-4 bg-card shadow-sm p-4 rounded-xl">
        <p>Query Parameters</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {Array.from(url?.searchParams.entries() || []).map(([key, value]) => (
            <InputWrapper key={key} label={key} id={`url-query-${key}`} value={value} />
          ))}
        </div>
      </div>
    </>
  );
};

function InputWrapper({
  label,
  id,
  children,
  value,
}: {
  label: string;
  id: string;
  children?: React.ReactNode;
  value: string | undefined;
}) {
  return (
    <div className="grid w-full items-center gap-2">
      <Label htmlFor={id}>{label}</Label>
      {children ?? <Input id={id} type="text" value={value || ''} placeholder="-" readOnly />}
    </div>
  );
}
