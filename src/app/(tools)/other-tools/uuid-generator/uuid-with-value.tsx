'use client';

import { v3, v4, v5, validate } from 'uuid';
import { UUIDCard, UUIDCardProps } from './uuid-card';
import { useState } from 'react';
import { Label } from '@radix-ui/react-label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';
import { ClientOnly } from '@/components/client-only';

export interface UUIDWithValueProps extends Omit<UUIDCardProps, 'value'> {
  type: 'v3' | 'v5';
}

export const UUIDWithValue: React.FC<UUIDWithValueProps> = ({ type, ...cardProps }) => {
  const [value, setValue] = useState('Random Value');
  const [namespace, setNamespace] = useState(v4());

  const getValue = () => {
    const v = value.trim();
    const ns = namespace.trim();

    if (!v || !ns) {
      return '';
    }

    if (type === 'v3') return v3(v, ns);

    return v5(v, ns);
  };

  const onNamespacePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const data = e.clipboardData.getData('text/plain');

    if (validate(data)) {
      setNamespace(data);
    }
  };

  return (
    <ClientOnly>
      <UUIDCard value={getValue()} {...cardProps}>
        <div className="flex gap-4">
          <div className="grid w-full items-center gap-2">
            <Label htmlFor={`uuid-${type}-value`}>Value</Label>
            <Input
              id={`uuid-${type}-value`}
              type="text"
              value={value}
              onChange={(e) => setValue(e.target.value)}
            />
          </div>

          <div className="grid w-full items-center gap-2">
            <Label htmlFor={`uuid-${type}-namespace`}>Namespace (Must be a valid UUID)</Label>
            <div className="relative">
              <Input
                id={`uuid-${type}-namespace`}
                className="pr-8"
                type="text"
                readOnly
                value={namespace}
                onChange={(e) => setNamespace(e.target.value)}
                onPaste={onNamespacePaste}
              />

              <Button
                size="icon-sm"
                variant="ghost"
                className="absolute top-0.5 right-1"
                onClick={() => setNamespace(v4())}
              >
                <RefreshCw />
              </Button>
            </div>
          </div>
        </div>
      </UUIDCard>
    </ClientOnly>
  );
};
