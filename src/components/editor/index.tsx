'use client';

import { FC, useEffect, useState } from 'react';

import MonacoEditor, { OnChange, OnMount, useMonaco } from '@monaco-editor/react';
import { useTheme } from 'next-themes';
import { defineJSX, getTheme } from './utils';
import { Spinner } from '../ui/spinner';
import { ClientOnly } from '../client-only';

export interface CodeEditorProps {
  value?: string;
  onChange?: OnChange;
  isReadonly?: boolean;
  onLoaded?: () => void;

  height?: string | number;
  language?: string;
  options?: React.ComponentProps<typeof MonacoEditor>['options'];
}

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
  const monaco = useMonaco();
  const [definedThemes, setDefinedThemes] = useState<Array<string>>([]);

  const onMount: OnMount = (_, monaco) => {
    const themeName = `monaco-${theme}`;

    monaco.editor.defineTheme(themeName, getTheme(theme === 'dark'));

    monaco.editor.setTheme(themeName);

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
        options={{
          readOnly: !!isReadonly,
          fontSize: 14,
          mouseWheelZoom: true,
          lineHeight: 18,
          glyphMargin: false,
          lineNumbersMinChars: 3,
          scrollBeyondLastLine: false,
          quickSuggestions: !isReadonly,
          wordBasedSuggestionsOnlySameLanguage: !isReadonly,
          suggestOnTriggerCharacters: !isReadonly,
          acceptSuggestionOnEnter: isReadonly ? 'off' : 'smart',
          tabIndex: -1,
          autoClosingBrackets: isReadonly ? 'never' : 'always',
          autoClosingQuotes: isReadonly ? 'never' : 'always',
          autoClosingComments: isReadonly ? 'never' : 'always',
          autoClosingOvertype: isReadonly ? 'never' : 'always',
          wordWrap: 'on',
          overviewRulerLanes: 0,
          ...options,
          bracketPairColorization: {
            enabled: true,
            ...(options?.bracketPairColorization || {}),
          },
          padding: { top: 2, bottom: 2, ...(options?.padding || {}) },
          minimap: { enabled: false, ...(options?.minimap || {}) },
          stickyScroll: { enabled: false, ...(options?.stickyScroll || {}) },
          scrollbar: {
            vertical: 'auto',
            horizontal: 'auto',
            verticalScrollbarSize: 8,
            horizontalScrollbarSize: 8,
            ...(options?.scrollbar || {}),
          },
        }}
      />
    </ClientOnly>
  );
};

export default CodeEditor;
