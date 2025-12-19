'use client';

import { Container } from '@/components/container';
import { Textarea } from '@/components/ui/textarea';
import { useState } from 'react';
import { analyzeText, TEXT_METRICS_CONFIG } from './utils';
import { CopyButton } from '@/components/ui/copy-button';

export default function WordCounter() {
  const [value, setValue] = useState('');

  const metrics = analyzeText(value);

  return (
    <Container>
      <Textarea
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="min-h-40 h-1/2"
        placeholder="Enter your text ..."
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {TEXT_METRICS_CONFIG.map((config) => {
          const value = metrics[config.key];

          return (
            <div key={config.key} className="bg-card rounded-xl p-4 shadow-sm flex flex-col gap-4">
              <div className="flex gap-4 items-center justify-between">
                <p>{config.label}</p>
                <CopyButton content={value.toString()} />
              </div>

              <p className="text-2xl">{value}</p>
            </div>
          );
        })}
      </div>
    </Container>
  );
}
