'use client';

import { FC, useEffect, useState } from 'react';

import MonacoEditor, {
  loader,
  type Monaco,
  type OnChange,
  type OnMount,
} from '@monaco-editor/react';
import { useTheme } from 'next-themes';
import { ClientOnly } from '../client-only';
import { Spinner } from '../ui/spinner';
import { defineJSX, getEditorOptions, getTheme } from './utils';

loader.config({ paths: { vs: '/monaco/vs' } });

export type CodeEditorProps = {
  value?: string;
  onChange?: OnChange;
  isReadonly?: boolean;
  onLoaded?: () => void;

  height?: string | number;
  language?: string;
  options?: React.ComponentProps<typeof MonacoEditor>['options'];
};

export const CodeEditor: FC<CodeEditorProps> = ({
  language,
  onChange,
  value,
  height,
  isReadonly,
  onLoaded,
  options,
}) => {
  const { resolvedTheme: theme } = useTheme();
  const [monaco, setMonaco] = useState<Monaco | null>(null);
  const [definedThemes, setDefinedThemes] = useState<Array<string>>([]);

  const onMount: OnMount = (_, monaco) => {
    const themeName = `monaco-${theme}`;

    monaco.editor.defineTheme(themeName, getTheme(theme === 'dark'));

    monaco.editor.setTheme(themeName);

    setMonaco(monaco);
    setDefinedThemes((p) => [...p, themeName]);

    defineJSX(monaco);

    onLoaded?.();
  };

  useEffect(() => {
    if (!monaco) return;

    const timeout = setTimeout(() => {
      const themeName = `monaco-${theme}`;

      if (!definedThemes.includes(themeName)) {
        monaco.editor.defineTheme(themeName, getTheme(theme === 'dark'));

        setDefinedThemes((p) => [...p, themeName]);
      }

      monaco.editor.setTheme(themeName);
    }, 50);

    return () => clearTimeout(timeout);
  }, [monaco, theme, definedThemes]);

  return (
    <ClientOnly fallback={<div className="w-full" style={{ height }} />}>
      <MonacoEditor
        theme={`monaco-${theme}`}
        defaultLanguage={language}
        height={height}
        value={value}
        onChange={isReadonly ? undefined : onChange}
        onMount={onMount}
        loading={<Spinner />}
        options={getEditorOptions(isReadonly, options)}
      />
    </ClientOnly>
  );
};

export default CodeEditor;
