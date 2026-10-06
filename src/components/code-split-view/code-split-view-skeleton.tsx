import { Skeleton } from '../ui/skeleton';

export const CodeSplitViewSkeleton: React.FC = () => (
  <div
    className="editor-height flex w-full max-w-full flex-col overflow-hidden rounded-xl border border-border bg-card"
    data-testid="code-split-view-skeleton"
  >
    <div
      className="flex h-12 shrink-0 items-center justify-between gap-3 border-b bg-sidebar px-3"
      data-testid="code-split-view-skeleton-toolbar"
    >
      <div className="flex min-w-0 items-center gap-2">
        <Skeleton className="h-4 w-40 rounded-md" />
        <Skeleton className="h-4 w-16 rounded-md" />
      </div>
      <Skeleton className="ml-auto h-8 w-24 rounded-md" />
    </div>

    <div className="flex min-h-0 w-full flex-1 flex-col md:flex-row">
      <div className="flex min-h-0 min-w-0 flex-1 flex-col bg-background">
        <div
          className="flex h-12 shrink-0 items-center justify-between gap-2 border-b bg-sidebar px-2"
          data-testid="code-split-view-skeleton-input-title-bar"
        >
          <Skeleton className="h-4 w-20 rounded-md" />
          <div className="flex items-center gap-2">
            <Skeleton className="size-8 rounded-md" />
            <Skeleton className="size-8 rounded-md" />
            <Skeleton className="size-8 rounded-md" />
          </div>
        </div>
        <div
          className="flex-1 space-y-3 overflow-hidden p-3"
          data-testid="code-split-view-skeleton-input-editor"
        >
          <Skeleton className="h-4 w-3/4 rounded-md" />
          <Skeleton className="h-4 w-1/2 rounded-md" />
          <Skeleton className="h-4 w-5/6 rounded-md" />
          <Skeleton className="h-4 w-2/3 rounded-md" />
          <Skeleton className="h-4 w-1/4 rounded-md" />
          <Skeleton className="h-4 w-4/5 rounded-md" />
        </div>
      </div>

      <div
        className="flex h-px w-full shrink-0 items-center justify-center bg-border md:h-auto md:w-px"
        aria-hidden="true"
        data-testid="code-split-view-skeleton-divider"
      >
        <div className="h-0.5 w-4 rounded-full bg-muted-foreground/40 md:h-4 md:w-0.5" />
      </div>

      <div className="relative flex min-h-0 min-w-0 flex-1 flex-col bg-background">
        <div
          className="flex h-12 shrink-0 items-center justify-between gap-2 border-b bg-sidebar px-2"
          data-testid="code-split-view-skeleton-output-title-bar"
        >
          <Skeleton className="h-4 w-20 rounded-md" />
          <div className="flex items-center gap-2">
            <Skeleton className="size-8 rounded-md" />
            <Skeleton className="size-8 rounded-md" />
          </div>
        </div>
        <div
          className="flex-1 space-y-3 overflow-hidden p-3"
          data-testid="code-split-view-skeleton-output-editor"
        >
          <Skeleton className="h-4 w-1/3 rounded-md" />
          <Skeleton className="h-4 w-5/6 rounded-md" />
          <Skeleton className="h-4 w-2/3 rounded-md" />
          <Skeleton className="h-4 w-3/4 rounded-md" />
          <Skeleton className="h-4 w-1/2 rounded-md" />
        </div>
      </div>
    </div>
  </div>
);
