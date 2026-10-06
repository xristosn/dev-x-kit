import type { editor } from 'monaco-editor';
import type { Monaco, OnMount } from '@monaco-editor/react';
import { vi } from 'vitest';

const mockMonaco = {
  editor: { defineTheme: vi.fn(), setTheme: vi.fn() },
  typescript: {
    typescriptDefaults: {
      addExtraLib: vi.fn(),
      setCompilerOptions: vi.fn(),
      getCompilerOptions: vi.fn(),
    },
    javascriptDefaults: {
      addExtraLib: vi.fn(),
      setCompilerOptions: vi.fn(),
      getCompilerOptions: vi.fn(),
    },
    JsxEmit: { React: 1 },
    ScriptTarget: { ESNext: 2 },
  },
  languages: { onLanguageEncountered: vi.fn(), setMonarchTokensProvider: vi.fn() },
};

const MonacoEditor = ({
  value,
  theme,
  defaultLanguage,
  onMount,
  loading,
  height,
}: {
  value?: string;
  theme?: string;
  defaultLanguage?: string;
  onMount?: OnMount;
  loading?: React.ReactNode;
  height?: string | number;
}) => (
  <div
    data-testid="monaco-editor"
    data-theme={theme}
    data-language={defaultLanguage}
    data-value={value}
    data-height={height}
  >
    <button
      data-testid="monaco-mount"
      onClick={() => {
        onMount?.({} as editor.IStandaloneCodeEditor, mockMonaco as unknown as Monaco);
      }}
    />
    {loading ? <div data-testid="monaco-loading">loading</div> : null}
  </div>
);

export { MonacoEditor as default, mockMonaco };
export type { OnMount };
export const loader = { config: vi.fn() };
export const useMonaco = vi.fn(() => mockMonaco);
