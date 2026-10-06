import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import type { ReactNode } from 'react';

export type FaqItem = {
  title: string;
  description: ReactNode;
};

type FaqSectionProps = {
  items: readonly FaqItem[];
  title?: string;
};

export const FaqSection: React.FC<FaqSectionProps> = ({
  items,
  title = 'Frequently asked questions',
}) => {
  if (items.length === 0) return null;

  return (
    <section className="flex flex-col gap-6 mt-12" aria-labelledby="faq-section-title">
      <h2 id="faq-section-title" className="text-2xl font-bold tracking-tight md:text-3xl">
        {title}
      </h2>

      <Accordion className="border-border" data-testid="faq-section">
        {items.map((item, index) => (
          <AccordionItem
            key={item.title}
            value={`faq-${index}`}
            className="not-last:border-border"
            data-testid={`faq-item-${index}`}
          >
            <AccordionTrigger
              className="min-h-14 items-center text-base leading-6 focus-visible:relative focus-visible:z-1 focus-visible:outline-2 focus-visible:outline-ring focus-visible:outline-offset-[-3px]"
              data-testid={`faq-question-${index}`}
            >
              {item.title}
            </AccordionTrigger>
            <AccordionContent
              keepMounted
              className="text-foreground [&_kbd]:inline-flex [&_kbd]:min-h-5 [&_kbd]:items-center [&_kbd]:justify-center [&_kbd]:rounded [&_kbd]:border [&_kbd]:border-border [&_kbd]:bg-muted [&_kbd]:px-1.5 [&_kbd]:font-mono [&_kbd]:text-xs [&_kbd]:leading-4 [&_kbd]:align-middle [&_kbd]:shadow-[0_1px_0_var(--border)]"
              data-testid={`faq-answer-${index}`}
            >
              {item.description}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  );
};
