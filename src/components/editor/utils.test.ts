import type * as Monaco from 'monaco-editor';
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import { getCSSVarValue, getEditorOptions, getTheme, toMonacoColor } from './utils';

function setupThemeVars(dict: Record<string, string>) {
  Object.entries(dict).forEach(([key, val]) => {
    document.documentElement.style.setProperty(key, val);
  });
}

function clearThemeVars() {
  [
    '--muted-foreground',
    '--primary',
    '--background',
    '--foreground',
    '--border',
    '--accent',
    '--secondary-foreground',
    '--card',
    '--card-foreground',
    '--popover',
    '--popover-foreground',
  ].forEach((v) => {
    document.documentElement.style.removeProperty(v);
  });
}

describe('editor utils', () => {
  describe('getEditorOptions()', () => {
    test('returns editable interaction defaults', () => {
      const options = getEditorOptions(false, undefined);

      expect(options).toMatchObject({
        readOnly: false,
        quickSuggestions: true,
        wordBasedSuggestionsOnlySameLanguage: true,
        suggestOnTriggerCharacters: true,
        acceptSuggestionOnEnter: 'smart',
        autoClosingBrackets: 'always',
        autoClosingQuotes: 'always',
        autoClosingComments: 'always',
        autoClosingOvertype: 'always',
      });
    });

    test('returns readonly interaction defaults', () => {
      const options = getEditorOptions(true, undefined);

      expect(options).toMatchObject({
        readOnly: true,
        quickSuggestions: false,
        wordBasedSuggestionsOnlySameLanguage: false,
        suggestOnTriggerCharacters: false,
        acceptSuggestionOnEnter: 'off',
        autoClosingBrackets: 'never',
        autoClosingQuotes: 'never',
        autoClosingComments: 'never',
        autoClosingOvertype: 'never',
      });
    });

    test('allows caller options to override defaults', () => {
      const options = getEditorOptions(true, { readOnly: false, fontSize: 20 });

      expect(options.readOnly).toBe(false);
      expect(options.fontSize).toBe(20);
    });

    test('merges supplied nested options over nested defaults', () => {
      const options = getEditorOptions(false, {
        bracketPairColorization: { enabled: false },
        padding: { top: 10 },
        minimap: { enabled: true },
        stickyScroll: { enabled: true },
        scrollbar: { vertical: 'hidden' },
      });

      expect(options.bracketPairColorization).toEqual({ enabled: false });
      expect(options.padding).toEqual({ top: 10, bottom: 2 });
      expect(options.minimap).toEqual({ enabled: true });
      expect(options.stickyScroll).toEqual({ enabled: true });
      expect(options.scrollbar).toEqual({
        vertical: 'hidden',
        horizontal: 'auto',
        verticalScrollbarSize: 8,
        horizontalScrollbarSize: 8,
      });
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('toMonacoColor()', () => {
    test('passes through hex colors', () => {
      expect(toMonacoColor('#ff0000', 'test')).toBe('#ff0000');
    });

    test('passes through rgb and rgba colors', () => {
      expect(toMonacoColor('rgb(255, 0, 0)', 'test')).toBe('rgb(255, 0, 0)');
      expect(toMonacoColor('rgba(255, 0, 0, 0.5)', 'test')).toBe('rgba(255, 0, 0, 0.5)');
    });

    test('passes through transparent and currentColor', () => {
      expect(toMonacoColor('transparent', 'test')).toBe('transparent');
      expect(toMonacoColor('currentColor', 'test')).toBe('currentColor');
    });

    test('returns #000000 for empty input', () => {
      expect(toMonacoColor('', 'test')).toBe('#000000');
    });

    test('converts named colors via canvas', () => {
      const originalCreateElement = document.createElement.bind(document);
      const ctx = {
        fillStyle: '',
        clearRect: vi.fn(),
        fillRect: vi.fn(),
        getImageData: vi.fn().mockReturnValue({ data: new Uint8ClampedArray([255, 0, 0, 255]) }),
      };
      vi.spyOn(document, 'createElement').mockImplementation((tag: string) => {
        if (tag === 'canvas') {
          return { getContext: () => ctx, width: 1, height: 1 } as unknown as HTMLCanvasElement;
        }
        return originalCreateElement(tag);
      });

      expect(toMonacoColor('red', 'test')).toBe('#ff0000');
    });

    test('returns original color when canvas context is unavailable', async () => {
      vi.resetModules();
      const { toMonacoColor: fresh } = await import('./utils');
      const originalCreateElement = document.createElement.bind(document);
      vi.spyOn(document, 'createElement').mockImplementation((tag: string) => {
        if (tag === 'canvas') {
          return { getContext: () => null, width: 1, height: 1 } as unknown as HTMLCanvasElement;
        }
        return originalCreateElement(tag);
      });

      expect(fresh('red', 'test')).toBe('red');
    });

    test('does not throw when processing invalid input', () => {
      expect(() => toMonacoColor('invalid-color-string', 'test')).not.toThrow();
    });
  });

  describe('getCSSVarValue()', () => {
    const testVar = '--test-var';

    beforeEach(() => {
      document.documentElement.style.removeProperty(testVar);
    });

    test('returns raw CSS value for plain colors', () => {
      document.documentElement.style.setProperty(testVar, '#333');
      expect(getCSSVarValue(testVar)).toBe('#333');
    });

    test('passes through rgba values unchanged', () => {
      document.documentElement.style.setProperty(testVar, 'rgba(0, 255, 0, 0.5)');
      expect(getCSSVarValue(testVar)).toBe('rgba(0, 255, 0, 0.5)');
    });

    test('returns empty string for missing variable', () => {
      expect(getCSSVarValue('--nonexistent')).toBe('');
    });
  });

  describe('getTheme()', () => {
    const baseVars = {
      '--muted-foreground': '#888',
      '--primary': '#0066cc',
      '--background': '#fff',
      '--foreground': '#000',
      '--border': '#ddd',
      '--accent': '#eee',
      '--secondary-foreground': '#666',
      '--card': '#fff',
      '--card-foreground': '#000',
      '--popover': '#fff',
      '--popover-foreground': '#000',
    };

    beforeEach(clearThemeVars);

    test.each([
      { isDark: true, expected: 'vs-dark', label: 'dark' },
      { isDark: false, expected: 'vs', label: 'light' },
    ])('returns $expected base when theme is $label (isDark=$isDark)', ({ isDark, expected }) => {
      setupThemeVars(baseVars);
      const theme = getTheme(isDark);

      expect(theme.base).toBe(expected);
      expect(theme.inherit).toBe(true);
      expect(theme.rules).toHaveLength(2);
      expect(theme.rules![0]).toEqual({ token: 'comment', foreground: '#888' });
      expect(theme.rules![1]).toEqual({ token: 'keyword', foreground: '#0066cc' });
      expect(theme.colors!['editor.background']).toBe('#fff');
      expect(theme.colors!['editor.foreground']).toBe('#000');
    });

    test('uses converted CSS colors for theme colors', () => {
      setupThemeVars(baseVars);
      const theme = getTheme(true);

      expect(theme.colors!['editor.background']).toBe('#fff');
      expect(theme.colors!['editor.foreground']).toBe('#000');
      expect(theme.colors!['editorCursor.foreground']).toBe('#0066cc');
    });
  });

  describe('defineJSX()', () => {
    const jsxDeclaration = 'declare namespace JSX {}';
    const jsxUrl = '/types/react-local/index.d.ts';

    function createMockMonaco() {
      const typescriptDefaults = {
        addExtraLib: vi.fn(),
        setCompilerOptions: vi.fn(),
        getCompilerOptions: vi.fn().mockReturnValue({ strict: true, allowJs: false }),
      };
      const javascriptDefaults = {
        addExtraLib: vi.fn(),
        setCompilerOptions: vi.fn(),
        getCompilerOptions: vi.fn().mockReturnValue({ strict: true, allowJs: false }),
      };
      const monaco = {
        typescript: {
          typescriptDefaults,
          javascriptDefaults,
          JsxEmit: { React: 1 },
          ScriptTarget: { ESNext: 2 },
        },
        languages: {
          onLanguageEncountered: vi.fn(),
          setMonarchTokensProvider: vi.fn(),
        },
      } as unknown as typeof Monaco;

      return { monaco, typescriptDefaults, javascriptDefaults };
    }

    beforeEach(() => {
      vi.resetModules();
    });

    test('adds fetched JSX declarations and configures compiler options', async () => {
      const fetchLib = vi
        .spyOn(globalThis, 'fetch')
        .mockResolvedValue(new Response(jsxDeclaration) as Response);
      const { defineJSX: fn } = await import('./utils');
      const { monaco, typescriptDefaults, javascriptDefaults } = createMockMonaco();

      await fn(monaco);

      expect(fetchLib).toHaveBeenCalledTimes(1);
      expect(fetchLib).toHaveBeenCalledWith(jsxUrl);
      expect(typescriptDefaults.addExtraLib).toHaveBeenCalledWith(
        jsxDeclaration,
        'ts:filename/jsx.d.ts'
      );
      expect(javascriptDefaults.addExtraLib).toHaveBeenCalledWith(
        jsxDeclaration,
        'ts:filename/jsx.d.ts'
      );
      expect(typescriptDefaults.setCompilerOptions).toHaveBeenCalledWith({
        strict: true,
        allowJs: false,
        jsx: 1,
        target: 2,
        allowNonTsExtensions: true,
      });
      expect(javascriptDefaults.setCompilerOptions).toHaveBeenCalledWith({
        strict: true,
        allowJs: true,
        jsx: 1,
        target: 2,
        allowNonTsExtensions: true,
      });
      expect(monaco.languages.onLanguageEncountered).toHaveBeenCalledTimes(2);
    });

    test('only fetches JSX declarations once across calls', async () => {
      const fetchLib = vi
        .spyOn(globalThis, 'fetch')
        .mockResolvedValue(new Response(jsxDeclaration) as Response);
      const { defineJSX: fn } = await import('./utils');
      const { monaco, typescriptDefaults, javascriptDefaults } = createMockMonaco();

      await fn(monaco);
      await fn(monaco);

      expect(fetchLib).toHaveBeenCalledTimes(1);
      expect(fetchLib).toHaveBeenCalledWith(jsxUrl);
      expect(typescriptDefaults.addExtraLib).toHaveBeenCalledTimes(2);
      expect(typescriptDefaults.addExtraLib).toHaveBeenCalledWith(
        jsxDeclaration,
        'ts:filename/jsx.d.ts'
      );
      expect(javascriptDefaults.addExtraLib).toHaveBeenCalledTimes(2);
      expect(javascriptDefaults.addExtraLib).toHaveBeenCalledWith(
        jsxDeclaration,
        'ts:filename/jsx.d.ts'
      );
    });

    test('handles fetch failure gracefully', async () => {
      const fetchLib = vi.spyOn(globalThis, 'fetch').mockRejectedValue(new Error('network error'));
      const { defineJSX: fn } = await import('./utils');
      const { monaco, typescriptDefaults, javascriptDefaults } = createMockMonaco();

      await expect(fn(monaco)).resolves.toBeUndefined();

      expect(fetchLib).toHaveBeenCalledTimes(1);
      expect(fetchLib).toHaveBeenCalledWith(jsxUrl);
      expect(typescriptDefaults.addExtraLib).toHaveBeenCalledWith('', 'ts:filename/jsx.d.ts');
      expect(javascriptDefaults.addExtraLib).toHaveBeenCalledWith('', 'ts:filename/jsx.d.ts');
      expect(typescriptDefaults.setCompilerOptions).toHaveBeenCalledWith({
        strict: true,
        allowJs: false,
        jsx: 1,
        target: 2,
        allowNonTsExtensions: true,
      });
      expect(javascriptDefaults.setCompilerOptions).toHaveBeenCalledWith({
        strict: true,
        allowJs: true,
        jsx: 1,
        target: 2,
        allowNonTsExtensions: true,
      });
    });
  });
});
