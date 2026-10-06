'use client';

import { useWebStorage } from '@/hooks/use-web-storage';
import { debounce } from 'lodash-es';
import { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import { ClientOnly } from '../client-only';
import { convertInput, showConversionError } from './code-split-view-conversion';
import type { PanelsStoreValue } from './code-split-view-panels';
import { CodeSplitViewPanels } from './code-split-view-panels';
import { CodeSplitViewSkeleton } from './code-split-view-skeleton';
import type { CodeSplitViewProps } from './code-split-view-types';

export type { CodeSplitViewProps } from './code-split-view-types';

const PANELS_DEFAULT_VALUE: PanelsStoreValue = {
  layout: '50%',
  direction: 'horizontal',
};

export const CodeSplitView: React.FC<CodeSplitViewProps> = ({
  input,
  output,
  options: optionsConfig,
  converter,
}) => {
  const isFirstRender = useRef(true);
  const [expanded, setExpanded] = useState(false);
  const [editorsLoadedCount, setEditorsLoadedCount] = useState(0);
  const [inputValue, setInputValue] = useState(input.defaultValue || '');
  const [outputValue, setOutputValue] = useState(() =>
    typeof converter === 'function' ? '' : (input.defaultValue || '').trim()
  );
  const [options, setOptions, resetOptions] = useWebStorage(
    `${input.language}-${output.language}`,
    'infer',
    optionsConfig?.defaultValues || {}
  );
  const [loading, setLoading] = useState(false);
  const [conversionError, setConversionError] = useState(false);
  const [panels, setPanels] = useWebStorage('convert-panels', 'infer', PANELS_DEFAULT_VALUE, true);

  const editorsLoaded = (typeof output.element === 'function' ? 1 : 2) === editorsLoadedCount;

  const convert = async (noLoader = false) => {
    if (!inputValue.trim()) {
      setConversionError(false);
      return;
    }

    setConversionError(false);
    toast.dismiss();

    if (!noLoader) {
      setLoading(true);
    }

    if (typeof converter !== 'function') {
      setOutputValue(inputValue.trim());
      setLoading(false);
      return;
    }

    try {
      setOutputValue(await convertInput(converter, inputValue, options));
    } catch (err) {
      setConversionError(true);
      showConversionError(err);
    } finally {
      setLoading(false);
    }
  };

  const convertDebounced = debounce(convert, 350);

  useEffect(() => {
    let active = true;

    if (inputValue.trim() && typeof converter === 'function') {
      toast.dismiss();

      void convertInput(converter, inputValue, options)
        .then((result) => {
          if (active) {
            setOutputValue(result);
            setConversionError(false);
          }
        })
        .catch((err: unknown) => {
          if (active) {
            setConversionError(true);
            showConversionError(err);
          }
        });
    }

    return () => {
      active = false;
      toast.dismiss();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    setConversionError(false);
    convertDebounced();

    return () => convertDebounced.cancel();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inputValue, options]);

  useEffect(() => {
    if (!expanded) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape' || event.defaultPrevented) return;
      if (event.target instanceof Element && event.target.closest('[role="dialog"]')) return;

      setExpanded(false);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [expanded]);

  return (
    <ClientOnly fallback={<CodeSplitViewSkeleton />}>
      <CodeSplitViewPanels
        expanded={expanded}
        onToggleExpanded={() => setExpanded((current) => !current)}
        input={input}
        output={output}
        inputValue={inputValue}
        outputValue={outputValue}
        setInputValue={setInputValue}
        options={optionsConfig}
        optionValues={options}
        setOptions={setOptions}
        resetOptions={resetOptions}
        loading={loading}
        conversionError={conversionError}
        editorsLoaded={editorsLoaded}
        onEditorLoaded={() => setEditorsLoadedCount((count) => count + 1)}
        convert={convertDebounced}
        panels={panels}
        setPanels={setPanels}
      />
    </ClientOnly>
  );
};
