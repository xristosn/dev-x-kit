import { CodeDisplay } from '@/components/code-display';
import {
  getFilterCode,
  getFilterStyles,
  getTailwindFilterClass,
  type FilterValue,
} from '../_lib/utils';

function FilterIllustration({ filter }: { filter: string }) {
  return (
    <div
      data-testid="filter-preview-image"
      role="img"
      aria-label={`Illustration with CSS filter ${filter}`}
      className="aspect-4/3 w-full overflow-hidden rounded-xl bg-slate-100 shadow-sm"
      style={{ filter }}
    >
      <svg aria-hidden="true" viewBox="0 0 640 480" className="h-full w-full">
        <defs>
          <linearGradient id="filter-sky" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0" stopColor="#7638c8" />
            <stop offset="1" stopColor="#ff8a76" />
          </linearGradient>
          <linearGradient id="filter-sea" x1="0" x2="1" y1="0" y2="1">
            <stop offset="0" stopColor="#07b6d5" />
            <stop offset="1" stopColor="#1748a6" />
          </linearGradient>
        </defs>
        <rect width="640" height="480" fill="url(#filter-sky)" />
        <circle cx="455" cy="142" r="65" fill="#ffe89c" />
        <path d="M0 302 148 143l122 159 116-125 254 170v133H0Z" fill="#412c78" />
        <path d="m0 346 147-118 128 145 116-109 249 116v100H0Z" fill="#e06e75" />
        <path d="M0 340q110-30 215 10t210 0 215-3v133H0Z" fill="url(#filter-sea)" />
        <path d="M0 397q120-28 240 2t240 0 160-4" fill="none" stroke="#b5eff2" strokeWidth="8" />
        <path d="M0 439q95-22 195 1t210 0 235-3" fill="none" stroke="#8ddbe9" strokeWidth="5" />
      </svg>
    </div>
  );
}

type FilterPreviewProps = {
  value: FilterValue;
  filter: string;
};

export function FilterPreview({ value, filter }: FilterPreviewProps) {
  const styles = getFilterStyles(value);

  return (
    <div className="flex min-w-0 flex-col gap-6">
      <section
        data-testid="filter-preview"
        aria-label="CSS filter preview"
        className="flex flex-col gap-4 rounded-2xl border bg-card p-5 sm:p-6"
      >
        <div>
          <h2 className="text-lg font-semibold tracking-tight">Live preview</h2>
          <p className="mt-1 text-sm text-muted-foreground">A sample scene updates as you edit.</p>
        </div>
        <FilterIllustration filter={filter} />
        <code
          data-testid="filter-preview-value"
          className="break-all text-xs text-muted-foreground"
        >
          filter: {filter};
        </code>
      </section>
      <section data-testid="filter-generated-code" aria-label="Generated code">
        <CodeDisplay
          code={getFilterCode(value)}
          outputs={[
            { language: 'CSS', convert: () => `filter: ${filter};` },
            { language: 'Tailwind CSS', convert: () => getTailwindFilterClass(value) },
            {
              language: 'JSS',
              convert: () => `const filterStyle = ${JSON.stringify(styles, null, 2)};`,
            },
          ]}
          codeWrapperClassName="min-h-32"
        />
      </section>
    </div>
  );
}
