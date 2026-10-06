'use client';

import { FaqSection, type FaqItem } from '@/components/faq-section';
import { CopyButton } from '@/components/ui/copy-button';
import { Textarea } from '@/components/ui/textarea';
import { useState } from 'react';
import { analyzeText, TEXT_METRICS_CONFIG } from './_lib/utils';

const FAQS = [
  {
    title: 'How does the word counter decide what is a word?',
    description:
      'It splits the text on whitespace, so punctuation stays attached to a word rather than being analyzed linguistically. The character total includes all whitespace, while “Characters Without spaces” removes whitespace characters such as spaces, tabs, and line breaks.',
  },
  {
    title: 'How are sentences and paragraphs counted?',
    description:
      'Sentence counts are based on runs of periods, exclamation marks, or question marks. Paragraphs are non-empty blocks separated by one or more line breaks, so a single long line counts as one paragraph.',
  },
  {
    title: 'How is reading time estimated?',
    description:
      'The estimate assumes a reading speed of 200 words per minute and rounds up to a whole minute. Text under one minute is shown as “< 1 min”; it is a rough estimate, not a measurement of your personal reading speed.',
  },
] satisfies readonly FaqItem[];

export default function WordCounter() {
  const [value, setValue] = useState('');

  const metrics = analyzeText(value);

  return (
    <>
      <Textarea
        data-testid="word-counter-input"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="editor-height-half"
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

              <p
                data-testid={`word-counter-metric-${config.key.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`)}`}
                className="text-2xl"
              >
                {value}
              </p>
            </div>
          );
        })}
      </div>
      <FaqSection items={FAQS} />
    </>
  );
}
