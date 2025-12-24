'use client';

import { Container } from '@/components/container';
import { generateLorem, LOREM_LIMITS, LoremType } from './utils';
import { useEffect, useState } from 'react';
import { InputWrapper } from '@/components/input-wrapper';
import { Input } from '@/components/ui/input';
import { CopyIconButton } from '@/components/copy-button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { capitalize } from 'lodash-es';
import { Button } from '@/components/ui/button';
import { ClientOnly } from '@/components/client-only';

export default function RandomTextGenerator() {
  const [type, setType] = useState<LoremType>('sentences');
  const [amount, setAmount] = useState(5);
  const [value, setValue] = useState(generateLorem({ type, amount }));

  const onGenerate = () => {
    setValue(generateLorem({ type, amount }));
  };

  useEffect(() => {
    onGenerate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [amount, type]);

  return (
    <Container>
      <div className="flex gap-4 items-end">
        <InputWrapper label="Type">
          <Select
            value={type}
            onValueChange={(v) => {
              setAmount((prev) =>
                Math.min(LOREM_LIMITS[v as LoremType], Math.max(1, Number(prev)))
              );
              setType(v as LoremType);
            }}
          >
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {['paragraphs', 'sentences', 'words'].map((item) => (
                <SelectItem key={item} value={item}>
                  {capitalize(item)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </InputWrapper>

        <InputWrapper label="Amount" id="lorem-amount">
          <Input
            id="lorem-amount"
            type="number"
            min={1}
            max={LOREM_LIMITS[type]}
            step={1}
            value={amount}
            className="w-20"
            onChange={(e) =>
              setAmount(Math.min(LOREM_LIMITS[type], Math.max(1, Number(e.target.value))))
            }
          />
        </InputWrapper>

        <Button size="lg" variant="outline" onClick={onGenerate}>
          Generate
        </Button>

        <div className="ml-auto">
          <CopyIconButton value={value} size="icon-lg" variant="outline" />
        </div>
      </div>

      <ClientOnly fallback={<div className="grow" />}>
        <p className="grow bg-muted text-foreground p-4 rounded-xl shadow-sm text-sm whitespace-break-spaces">
          {value}
        </p>
      </ClientOnly>
    </Container>
  );
}
