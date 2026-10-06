import Link from 'next/link';
import { PiCode } from 'react-icons/pi';

type ToolCardItem = {
  path: string;
  label: string;
  fullName?: string;
  summary?: string;
  icon?: React.ReactNode;
};

type ToolCardProps = {
  item: ToolCardItem;
  'data-testid'?: string;
  titleTestId?: string;
  summaryTestId?: string;
  iconTestId?: string;
};

export const ToolCard: React.FC<ToolCardProps> = ({
  item,
  'data-testid': testId,
  titleTestId,
  summaryTestId,
  iconTestId,
}) => {
  const icon = item.icon ?? <PiCode className="size-5" />;

  return (
    <Link
      href={item.path}
      className="tool-card group relative bg-card text-card-foreground border border-border rounded-xl p-5 flex flex-col gap-3 hover:border-primary/70 hover:shadow-lg transition-all ease-in-out duration-300 h-full motion-safe:hover:-translate-y-1 motion-safe:md:hover:scale-[1.02] motion-reduce:transition-none"
      data-testid={testId}
    >
      <div className="flex items-start justify-between">
        <div className="tool-card-icon-shell relative size-10 rounded-lg bg-primary/10 flex items-center justify-center">
          <span
            className="tool-card-icon-mark flex items-center justify-center"
            data-testid={iconTestId}
          >
            {icon}
          </span>
        </div>
      </div>

      <h3 className="text-base font-semibold" data-testid={titleTestId}>
        {item.fullName ?? item.label}
      </h3>

      {item.summary && (
        <p
          className="text-sm text-muted-foreground leading-relaxed flex-1"
          data-testid={summaryTestId}
        >
          {item.summary}
        </p>
      )}

      <span className="text-sm text-primary inline-flex items-center gap-1 mt-1">
        Open tool{' '}
        <span
          className="transition-transform duration-200 motion-safe:group-hover:translate-x-1 motion-reduce:transition-none"
          aria-hidden
        >
          &rarr;
        </span>
      </span>
    </Link>
  );
};
