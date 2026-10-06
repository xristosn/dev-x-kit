'use client';

import { ClientOnly } from '@/components/client-only';
import { CopyIconButton } from '@/components/copy-button';
import { FaqSection, type FaqItem } from '@/components/faq-section';
import { InputWrapper } from '@/components/input-wrapper';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { capitalize } from 'lodash-es';
import { useState } from 'react';
import {
  DEFAULT_AMOUNTS,
  DEFAULT_RANDOM_TEXT_TYPE,
  generateRandomText,
  LOREM_LIMITS,
  RandomTextType,
} from './_lib/utils';

const FAQS = [
  {
    title: 'What kinds of text can the generator create?',
    description:
      'Choose paragraphs, sentences, words, or characters. Paragraph, sentence, and word output uses words from a fixed Lorem Ipsum vocabulary. Character mode instead creates random letters and digits, so it is not readable Lorem Ipsum.',
  },
  {
    title: 'How much text can I generate at once?',
    description:
      'The amount is capped according to the selected type: up to 50 paragraphs, 100 sentences, or 1,000 words or characters. If you switch types while the current amount is above the new limit, the amount is reduced to that limit.',
  },
  {
    title: 'Why does Generate change the placeholder text?',
    description:
      'The word-based modes choose from a fixed Lorem Ipsum word list, so generating again can produce a different sample. Changing the type or amount also updates the output to match the new selection.',
  },
] satisfies readonly FaqItem[];

export default function RandomTextGenerator() {
  const [type, setType] = useState<RandomTextType>(DEFAULT_RANDOM_TEXT_TYPE);
  const [amount, setAmount] = useState(DEFAULT_AMOUNTS[DEFAULT_RANDOM_TEXT_TYPE]);
  const [value, setValue] = useState(() => generateRandomText({ type, amount }));

  const onGenerate = () => {
    setValue(generateRandomText({ type, amount }));
  };

  const onAmountChange = (rawAmount: string) => {
    const nextAmount = Math.min(LOREM_LIMITS[type], Math.max(1, Number(rawAmount)));
    setAmount(nextAmount);
    setValue(generateRandomText({ type, amount: nextAmount }));
  };

  const onTypeChange = (rawType: string | null) => {
    if (rawType === null) return;

    const nextType = rawType as RandomTextType;
    const defaultAmount = nextType === 'characters' ? DEFAULT_AMOUNTS.characters : amount;
    const nextAmount = Math.min(LOREM_LIMITS[nextType], Math.max(1, Number(defaultAmount)));
    setType(nextType);
    setAmount(nextAmount);
    setValue(generateRandomText({ type: nextType, amount: nextAmount }));
  };

  return (
    <>
      <div className="flex gap-4 items-end">
        <InputWrapper label="Type">
          <Select value={type} onValueChange={onTypeChange}>
            <SelectTrigger data-testid="random-text-type-trigger" className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {['paragraphs', 'sentences', 'words', 'characters'].map((item) => (
                <SelectItem key={item} data-testid={`random-text-type-${item}`} value={item}>
                  {capitalize(item)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </InputWrapper>

        <InputWrapper label="Amount" id="lorem-amount">
          <Input
            data-testid="random-text-amount"
            id="lorem-amount"
            type="number"
            min={1}
            max={LOREM_LIMITS[type]}
            step={1}
            value={amount}
            className="w-20"
            onChange={(e) => onAmountChange(e.target.value)}
          />
        </InputWrapper>

        <Button data-testid="random-text-generate" size="lg" variant="outline" onClick={onGenerate}>
          Generate
        </Button>

        <div className="ml-auto">
          <CopyIconButton value={value} size="icon-lg" variant="outline" />
        </div>
      </div>

      <ClientOnly fallback={<div className="grow bg-muted rounded-xl shadow-sm" />}>
        <p
          data-testid="random-text-output"
          className="grow editor-height overflow-y-auto bg-muted text-foreground p-4 rounded-xl shadow-sm text-sm whitespace-break-spaces break-all"
        >
          {value}
        </p>
      </ClientOnly>
      <FaqSection items={FAQS} />
    </>
  );
}
