'use client';

import { cn } from '@/lib/utils';
import { Code, Maximize2, Minimize2 } from 'lucide-react';
import { useRef } from 'react';
import type { GroupImperativeHandle } from 'react-resizable-panels';
import CodeEditor from '../editor';
import { Button } from '../ui/button';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '../ui/resizable';
import { Spinner } from '../ui/spinner';
import { useSidebar } from '../ui/sidebar';
import type { PanelDirection } from './code-split-title-bar';
import { CodeSplitViewTitleBar } from './code-split-title-bar';
import type { CodeSplitViewOptionsProps } from './code-split-view-options';
import { CodeSplitViewOptions } from './code-split-view-options';
import type { CodeSplitViewProps, ConvertCallback } from './code-split-view-types';
import { CodeSplitViewUpload } from './code-split-view-upload';

export type PanelsStoreValue = {
  layout: string;
  direction: PanelDirection;
};

type CodeSplitViewPanelsProps = {
  expanded: boolean;
  onToggleExpanded: () => void;
  input: CodeSplitViewProps['input'];
  output: CodeSplitViewProps['output'];
  inputValue: string;
  outputValue: string;
  setInputValue: (value: string) => void;
  options?: CodeSplitViewProps['options'];
  optionValues: Record<string, unknown>;
  setOptions: CodeSplitViewOptionsProps['setValue'];
  resetOptions: () => void;
  loading: boolean;
  conversionError: boolean;
  editorsLoaded: boolean;
  onEditorLoaded: () => void;
  convert: ConvertCallback;
  panels: PanelsStoreValue;
  setPanels: React.Dispatch<React.SetStateAction<PanelsStoreValue>>;
};

export const CodeSplitViewPanels: React.FC<CodeSplitViewPanelsProps> = ({
  expanded,
  onToggleExpanded,
  input,
  output,
  inputValue,
  outputValue,
  setInputValue,
  options,
  optionValues,
  setOptions,
  resetOptions,
  loading,
  conversionError,
  editorsLoaded,
  onEditorLoaded,
  convert,
  panels,
  setPanels,
}) => {
  const ref = useRef<GroupImperativeHandle>(null);
  const { isMobile, state } = useSidebar();
  const direction = isMobile ? 'vertical' : panels.direction;

  return (
    <div
      className={cn(
        'flex flex-col overflow-hidden border border-border bg-card',
        expanded
          ? 'fixed right-0 bottom-0 top-(--header-height) z-50 w-auto rounded-none'
          : 'editor-height relative w-full grow basis-auto rounded-xl'
      )}
      data-testid="code-split-view-workspace"
      data-expanded={expanded}
      style={
        expanded
          ? { left: !isMobile && state === 'expanded' ? 'var(--sidebar-width)' : 0 }
          : undefined
      }
    >
      <div className="flex h-12 shrink-0 items-center justify-between gap-3 border-b bg-sidebar px-3">
        <div className="flex min-w-0 items-center gap-2 text-sm">
          <span className="truncate font-semibold" data-testid="code-split-view-conversion-label">
            {input.label} → {output.label}
          </span>
          {conversionError ? (
            <span
              className="shrink-0 text-destructive"
              data-testid="code-split-view-status"
              role="alert"
            >
              Conversion failed
            </span>
          ) : (
            outputValue.trim() && (
              <span
                className="shrink-0 text-emerald-500"
                data-testid="code-split-view-status"
                role="status"
              >
                Converted
              </span>
            )
          )}
        </div>
        <Button
          size="sm"
          variant="outline"
          data-testid="code-split-view-fullscreen-toggle"
          aria-label={expanded ? 'Exit expanded editor' : 'Expand editor'}
          aria-pressed={expanded}
          aria-controls="code-split-view-panels"
          onClick={onToggleExpanded}
        >
          {expanded ? <Minimize2 /> : <Maximize2 />}
          <span>{expanded ? 'Exit fullscreen' : 'Fullscreen'}</span>
        </Button>
      </div>

      <ResizablePanelGroup
        id="code-split-view-panels"
        groupRef={ref}
        orientation={direction}
        className="min-h-0 w-full max-w-full flex-1 opacity-0 animate-[opacity_500ms_ease_forwards]"
        onLayoutChange={(v) => {
          if (!isMobile) {
            setPanels((p) => ({ ...p, layout: v['convert-left'] + '%' }));
          }
        }}
      >
        <ResizablePanel minSize={'20%'} id="convert-left">
          <CodeSplitViewTitleBar
            title={input.label}
            code={inputValue}
            onClear={() => setInputValue('')}
            direction={isMobile ? undefined : panels.direction}
            setDirection={
              isMobile
                ? undefined
                : (direction) =>
                    setPanels((current) => ({ ...current, direction: direction as PanelDirection }))
            }
          >
            {!!options?.config?.length && (
              <CodeSplitViewOptions
                config={options.config}
                value={optionValues}
                setValue={setOptions}
                resetOptions={resetOptions}
              />
            )}

            <CodeSplitViewUpload setInputValue={setInputValue} />
          </CodeSplitViewTitleBar>

          <CodeEditor
            language={input.language}
            height={'calc(100% - (var(--spacing) * 12))'}
            value={inputValue}
            onChange={(value) => setInputValue(value || '')}
            onLoaded={onEditorLoaded}
          />
        </ResizablePanel>

        <ResizableHandle
          withHandle
          onDoubleClick={() => ref.current?.setLayout({ 'convert-left': 50, 'convert-right': 50 })}
        />

        <ResizablePanel minSize={'20%'} id="convert-right" className="relative">
          {loading && editorsLoaded && (
            <div className="absolute top-16 right-4 p-2 rounded-full bg-muted/60 z-5 flex items-center justify-center opacity-0 animate-[opacity_300ms_forwards]">
              <Spinner className="size-8" />
            </div>
          )}

          <CodeSplitViewTitleBar
            title={output.label}
            code={outputValue}
            data-testid="code-split-view-output-title-bar"
          >
            {output.sourceUrl && (
              <Button
                size="sm"
                variant="outline"
                nativeButton={false}
                data-testid="code-split-view-source-link"
                render={
                  <a href={output.sourceUrl} target="_blank" rel="noopener noreferrer">
                    <Code />
                    Source
                  </a>
                }
              />
            )}
          </CodeSplitViewTitleBar>

          {output.element ? (
            <div
              className="overflow-y-auto"
              style={{ height: 'calc(100% - (var(--spacing) * 12))' }}
            >
              {output.element({ inputValue, convert })}
            </div>
          ) : (
            <CodeEditor
              language={output.language}
              height={'calc(100% - (var(--spacing) * 12))'}
              value={outputValue}
              isReadonly
              onLoaded={onEditorLoaded}
            />
          )}
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
};
