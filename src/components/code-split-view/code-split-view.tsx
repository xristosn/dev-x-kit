'use client';

import CodeEditor from '../editor';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '../ui/resizable';
import { useEffect, useRef, useState } from 'react';
import { CodeSplitViewOptions } from './code-split-view-options';
import { CreateConvertOptionsResult } from '@/lib/create-convert-options';
import { debounce, DebouncedFunc } from 'lodash-es';
import { ImperativePanelGroupHandle } from 'react-resizable-panels';
import { CodeSplitViewTitleBar, PanelDirection } from './code-split-title-bar';
import { toast } from 'sonner';
import { Spinner } from '../ui/spinner';
import { Button } from '../ui/button';
import { Code } from 'lucide-react';
import { useWebStorage } from '@/hooks/use-web-storage';
import { ClientOnly } from '../client-only';
import { ActionError } from '@/types/action-error';

type ConverterResult = string | ActionError;

export interface CodeSplitViewProps {
  input: {
    label: string;
    language: string;
    defaultValue?: string;
  };

  output: { label: string } & {
    label: string;
    language: string;
    sourceUrl?: string;
    element?: (props: {
      inputValue: string;
      convert: DebouncedFunc<(noLoader?: boolean) => Promise<void>>;
    }) => React.ReactNode;
  };

  converter?: (
    input: string,
    options: Record<string, unknown>
  ) => ConverterResult | Promise<ConverterResult>;

  options?: CreateConvertOptionsResult;
}

interface PanelsStoreValue {
  layout: [number, number];
  direction: PanelDirection;
}

const PANELS_DEFAULT_VALUE: PanelsStoreValue = {
  layout: [50, 50],
  direction: 'horizontal',
};

export const CodeSplitView: React.FC<CodeSplitViewProps> = ({
  input,
  output,
  options: optionsConfig,
  converter,
}) => {
  const ref = useRef<ImperativePanelGroupHandle>(null);
  const isFirstRender = useRef(true);
  const [editorsLoadedCount, setEditorsLoadedCount] = useState(0);
  const [inputValue, setInputValue] = useState(input.defaultValue || '');
  const [outputValue, setOutputValue] = useState('');
  const [options, setOptions, resetOptions] = useWebStorage(
    `${input.language}-${output.language}`,
    'infer',
    optionsConfig?.defaultValues || {}
  );
  const [loading, setLoading] = useState(false);
  const [panels, setPanels] = useWebStorage('convert-panels', 'infer', PANELS_DEFAULT_VALUE);

  const editorsLoaded = (typeof output.element === 'function' ? 1 : 2) === editorsLoadedCount;

  const convert = async (noLoader = false) => {
    if (!inputValue.trim()) return;

    toast.dismiss();

    if (!noLoader) {
      setLoading(true);
    }

    if (typeof converter !== 'function') {
      setOutputValue(inputValue.trim());
      return;
    }

    try {
      const output = await converter(inputValue, options);

      if (typeof output === 'object' && 'error' in output) {
        throw new Error(output.message);
      }

      setOutputValue(output);
    } catch (err) {
      console.error(err);
      toast.error('Convertion Failed', {
        description: (err as Error)?.message || (err as string),
        dismissible: false,
        duration: Infinity,
      });
    } finally {
      setLoading(false);
    }
  };

  const convertDebounced = debounce(convert, 350);

  useEffect(() => {
    convert(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    convertDebounced();

    return () => convertDebounced.cancel();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inputValue, options]);

  return (
    <>
      <h1 className="visually-hidden">
        {input.label} to {output.label}
      </h1>

      <ClientOnly>
        <ResizablePanelGroup
          ref={ref}
          direction={panels.direction}
          className="w-full max-w-full opacity-0 animate-[opacity_500ms_ease_forwards] max-h-[calc(100vh-var(--header-height))]"
          onLayout={(v) => setPanels((p) => ({ ...p, layout: v as [number, number] }))}
        >
          <ResizablePanel
            minSize={20}
            defaultSize={panels.layout[0]}
            maxSize={80}
            order={1}
            id="convert-left"
          >
            <CodeSplitViewTitleBar
              title={input.label}
              code={inputValue}
              onClear={() => setInputValue('')}
              direction={panels.direction}
              setDirection={(d) => setPanels((p) => ({ ...p, direction: d as PanelDirection }))}
            >
              {!!optionsConfig?.config?.length && (
                <CodeSplitViewOptions
                  config={optionsConfig.config}
                  value={options}
                  setValue={setOptions}
                  resetOptions={resetOptions}
                />
              )}
            </CodeSplitViewTitleBar>

            <CodeEditor
              language={input.language}
              height={'calc(100% - (var(--spacing) * 12))'}
              value={inputValue}
              onChange={(v) => setInputValue(v || '')}
              onLoaded={() => setEditorsLoadedCount((p) => p + 1)}
            />
          </ResizablePanel>

          <ResizableHandle withHandle onDoubleClick={() => ref.current?.setLayout([50, 50])} />

          <ResizablePanel
            minSize={20}
            defaultSize={panels.layout[1]}
            maxSize={80}
            order={2}
            id="convert-right"
            className="relative"
          >
            {loading && editorsLoaded && (
              <div className="absolute top-16 right-4 p-2 rounded-full bg-muted/60 z-5 flex items-center justify-center opacity-0 animate-[opacity_300ms_forwards]">
                <Spinner className="size-8" />
              </div>
            )}

            <CodeSplitViewTitleBar title={output.label} code={outputValue}>
              {output.sourceUrl && (
                <Button asChild size="sm" variant="outline">
                  <a href={output.sourceUrl} target="_blank" rel="noopener noreferrer">
                    <Code />
                    Source
                  </a>
                </Button>
              )}
            </CodeSplitViewTitleBar>

            {output.element ? (
              <div
                className="overflow-y-auto"
                style={{ height: 'calc(100% - (var(--spacing) * 12))' }}
              >
                {output.element({ inputValue, convert: convertDebounced })}
              </div>
            ) : (
              <CodeEditor
                language={output.language}
                height={'calc(100% - (var(--spacing) * 12))'}
                value={outputValue}
                isReadonly
                onLoaded={() => setEditorsLoadedCount((p) => p + 1)}
              />
            )}
          </ResizablePanel>
        </ResizablePanelGroup>
      </ClientOnly>
    </>
  );
};
