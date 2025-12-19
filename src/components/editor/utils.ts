import type Monaco from 'monaco-editor/esm/vs/editor/editor.main.d.ts';
import type { editor } from 'monaco-editor';

function getCSSVarValue(varName: string) {
  return getComputedStyle(document.documentElement).getPropertyValue(varName).trim();
}

export function getTheme(isDark: boolean): editor.IStandaloneThemeData {
  return {
    base: isDark ? 'vs-dark' : 'vs',
    inherit: true,
    rules: [
      { token: 'comment', foreground: getCSSVarValue('--muted-foreground') },
      { token: 'keyword', foreground: getCSSVarValue('--primary') },
      { token: 'string', foreground: getCSSVarValue('--accent-foreground') },
    ],
    colors: {
      'editor.background': getCSSVarValue('--background'),
      'editor.foreground': getCSSVarValue('--foreground'),
      'editorCursor.foreground': getCSSVarValue('--primary'),
      'editorLineNumber.foreground': getCSSVarValue('--muted-foreground'),
      'editorLineNumber.activeForeground': getCSSVarValue('--primary'),
      'editorRuler.foreground': getCSSVarValue('--border'),

      'editor.wordHighlightBackground': getCSSVarValue('--accent'),
      'editor.findMatchBackground': getCSSVarValue('--accent-foreground'),

      'editorSuggestWidget.background': getCSSVarValue('--card'),
      'editorSuggestWidget.foreground': getCSSVarValue('--card-foreground'),
      'editorSuggestWidget.selectedBackground': getCSSVarValue('--primary'),
      'editorSuggestWidget.highlightForeground': getCSSVarValue('--primary-foreground'),
      'editorSuggestWidget.border': getCSSVarValue('--border'),

      'editorHoverWidget.background': getCSSVarValue('--popover'),
      'editorHoverWidget.foreground': getCSSVarValue('--popover-foreground'),
      'editorHoverWidget.border': getCSSVarValue('--border'),

      'list.focusBackground': getCSSVarValue('--primary'),
      'list.focusForeground': getCSSVarValue('--primary-foreground'),
      'list.hoverBackground': getCSSVarValue('--accent'),
    },
  };
}

const tokenProvider = {
  defaultToken: 'invalid',
  tokenPostfix: '.ts',

  typeKeywords: ['any', 'bigint', 'boolean', 'number', 'object', 'string', 'unknown', 'void'],

  ctrlKeywords: [
    'export',
    'default',
    'return',
    'as',
    'if',
    'break',
    'case',
    'catch',
    'continue',
    'do',
    'else',
    'finally',
    'for',
    'throw',
    'try',
    'with',
    'yield',
    'await',
    'import',
    'from',
    'type',
  ],

  alwaysKeyword: ['constructor', 'super'],

  keywords: [
    'abstract',
    'asserts',
    'class',
    'const',
    'debugger',
    'declare',
    'delete',
    'enum',
    'extends',
    'false',
    'function',
    'get',
    'implements',
    'in',
    'infer',
    'instanceof',
    'interface',
    'is',
    'keyof',
    'let',
    'module',
    'namespace',
    'never',
    'new',
    'null',
    'out',
    'package',
    'private',
    'protected',
    'public',
    'override',
    'readonly',
    'require',
    'global',
    'satisfies',
    'set',
    'static',
    'switch',
    'symbol',
    'this',
    'true',
    'typeof',
    'undefined',
    'unique',
    'var',
    'while',
    'async',
    'of',
  ],

  operators: [
    '<=',
    '>=',
    '==',
    '!=',
    '===',
    '!==',
    '=>',
    '+',
    '-',
    '**',
    '*',
    '/',
    '%',
    '++',
    '--',
    '<<',
    '</',
    '>>',
    '>>>',
    '&',
    '|',
    '^',
    '!',
    '~',
    '&&',
    '||',
    '??',
    '?',
    ':',
    '=',
    '+=',
    '-=',
    '*=',
    '**=',
    '/=',
    '%=',
    '<<=',
    '>>=',
    '>>>=',
    '&=',
    '|=',
    '^=',
    '@',
  ],

  symbols: /[=><!~?:&|+\-*\/\^%]+/,
  escapes: /\\(?:[abfnrtv\\"']|x[0-9A-Fa-f]{1,4}|u[0-9A-Fa-f]{4}|U[0-9A-Fa-f]{8})/,
  digits: /\d+(_+\d+)*/,
  octaldigits: /[0-7]+(_+[0-7]+)*/,
  binarydigits: /[0-1]+(_+[0-1]+)*/,
  hexdigits: /[[0-9a-fA-F]+(_+[0-9a-fA-F]+)*/,

  regexpctl: /[(){}\[\]\$\^|\-*+?\.]/,
  regexpesc: /\\(?:[bBdDfnrstvwWn0\\\/]|@regexpctl|c[A-Z]|x[0-9a-fA-F]{2}|u[0-9a-fA-F]{4})/,

  tokenizer: {
    root: [
      [
        /}/,
        {
          cases: {
            '$S2==INJSX': { token: '@brackets', next: '@pop' },
            '@default': '@brackets',
          },
        },
      ],

      [/{/, 'delimiter.bracket'],

      [/^\s+#?[\w$]+(?=\s*[;=:])/, 'variable.property'],

      [
        /(function|class|new)(\s+)(#?[\w$]+)(\s*)([<(]?)/,
        [
          'keyword',
          '',
          {
            cases: {
              '$1==function': 'method',
              '$1==class': 'type.identifier',
              '$1==new': 'type.identifier',
            },
          },
          '',
          {
            cases: {
              '<': { token: '@brackets', next: '@typeparams' },
              '@default': '@rematch',
            },
          },
        ],
      ],

      [
        /(const|let|var)(\s+)(#?[\w$]+)/,
        [
          'keyword',
          '',
          {
            cases: {
              '$1==const': 'constant',
              '@default': 'variable',
            },
          },
        ],
      ],

      { include: 'jsxReady' },

      { include: 'common' },
    ],

    common: [
      [
        /(#?[a-zA-Z_$][\w$]*)([<(]?)/,
        [
          {
            cases: {
              '@typeKeywords': 'type.identifier',
              '@alwaysKeyword': 'keyword',
              '$1~#?[A-Z].*': 'type.identifier',
              $2: 'method',
              '@ctrlKeywords': 'keyword.flow',
              '@keywords': 'keyword',
              '@default': 'identifier',
            },
          },
          {
            cases: {
              '$2==<': { token: '@brackets', next: '@typeparams' },
              '@default': '@rematch',
            },
          },
        ],
      ],

      { include: '@whitespace' },

      [
        /\/(?=([^\\\/]|\\.)+\/([dgimsuy]*)(\s*)(\.|;|,|\)|\]|\}|$))/,
        { token: 'regexp', bracket: '@open', next: '@regexp' },
      ],

      [/[()\[\]]/, '@brackets'],
      [/[<>](?!@symbols)/, '@brackets'],
      [/!(?=([^=]|$))/, 'delimiter'],
      [
        /@symbols/,
        {
          cases: {
            '@operators': 'delimiter',
            '@default': '',
          },
        },
      ],

      [/\.\.\./, 'keyword'],

      [/(@digits)[eE]([\-+]?(@digits))?/, 'number.float'],
      [/(@digits)\.(@digits)([eE][\-+]?(@digits))?/, 'number.float'],
      [/0[xX](@hexdigits)n?/, 'number.hex'],
      [/0[oO]?(@octaldigits)n?/, 'number.octal'],
      [/0[bB](@binarydigits)n?/, 'number.binary'],
      [/(@digits)n?/, 'number'],

      [/[;,.]/, 'delimiter'],

      [/"([^"\\]|\\.)*$/, 'string.invalid'],
      [/'([^'\\]|\\.)*$/, 'string.invalid'],
      [/"/, 'string', '@string_double'],
      [/'/, 'string', '@string_single'],
      [/`/, 'string', '@string_backtick'],
    ],

    typeparams: [[/>/, '@brackets', '@pop'], { include: 'common' }],

    jsxReady: [
      [/<>/, 'delimiter.html', '@jsxText.FRAGMENT'],
      [
        /(<)([A-Z][\w$]*\s*(?:,|extends|implements))/,
        ['@brackets', { token: '@rematch', next: '@typeparams' }],
      ],
      [/(<)([a-zA-Z$])/, ['delimiter.html', { token: '@rematch', next: '@jsxIdent.jsxOpen.' }]],
    ],

    jsxIdent: [
      [/\./, { token: 'delimiter', switchTo: '$S0^' }],
      [/[A-Z][\w$]*/, { token: 'type.identifier', switchTo: '$S0$0' }],
      [/[\w$-]+/, { token: 'tag', switchTo: '$S0$0' }],
      [/.+/, { token: '@rematch', switchTo: '@$S2.$S3.$S4' }],
    ],

    jsxOpen: [
      [/{/, { token: 'keyword', next: '@root.INJSX', bracket: '@open' }],
      [/>/, { token: 'delimiter.html', switchTo: '@jsxText.$S2' }],
      [/\/>/, { token: 'delimiter.html', next: '@pop' }],
      [/ +([\w-$]+)/, 'attribute.name'],
      [/(=)(')/, ['delimiter', { token: 'string', next: '@string_single' }]],
      [/(=)(")/, ['delimiter', { token: 'string', next: '@string_double' }]],
      [/(=)({)/, ['delimiter', { token: '@brackets', next: '@root.INJSX' }]],
    ],

    jsxText: [
      [/{/, { token: 'keyword', next: '@root.INJSX', bracket: '@open' }],
      [
        /<\/>/,
        {
          cases: {
            '$S2==FRAGMENT': { token: 'delimiter.html', next: '@pop' },
            '@default': { token: 'invalid', next: '@pop' },
          },
        },
      ],
      [
        /(<\/)(\s*)([\w$])/,
        ['delimiter.html', '', { token: '@rematch', switchTo: '@jsxIdent.jsxClose.$S2.' }],
      ],
      { include: 'jsxReady' },
      [/./, 'string'],
    ],

    jsxClose: [
      [
        />/,
        {
          cases: {
            '$S2==$S3': { token: 'delimiter.html', next: '@pop' },
            '@default': { token: 'invalid', next: '@pop' },
          },
        },
      ],
    ],

    whitespace: [
      [/[ \t\r\n]+/, ''],
      [/\/\*\*(?!\/)/, 'comment.doc', '@jsdoc'],
      [/\/\*/, 'comment', '@comment'],
      [/\/\/.*$/, 'comment'],
    ],

    comment: [
      [/[^\/*]+/, 'comment'],
      [/\*\//, 'comment', '@pop'],
      [/[\/*]/, 'comment'],
    ],

    jsdoc: [
      [/[^\/*]+/, 'comment.doc'],
      [/\*\//, 'comment.doc', '@pop'],
      [/[\/*]/, 'comment.doc'],
    ],

    regexp: [
      [
        /(\{)(\d+(?:,\d*)?)(\})/,
        ['regexp.escape.control', 'regexp.escape.control', 'regexp.escape.control'],
      ],
      [
        /(\[)(\^?)(?=(?:[^\]\\\/]|\\.)+)/,
        ['regexp.escape.control', { token: 'regexp.escape.control', next: '@regexrange' }],
      ],
      [/(\()(\?:|\?=|\?!)/, ['regexp.escape.control', 'regexp.escape.control']],
      [/[()]/, 'regexp.escape.control'],
      [/@regexpctl/, 'regexp.escape.control'],
      [/[^\\\/]/, 'regexp'],
      [/@regexpesc/, 'regexp.escape'],
      [/\\\./, 'regexp.invalid'],
      [/(\/)([dgimsuy]*)/, [{ token: 'regexp', bracket: '@close', next: '@pop' }, 'keyword.other']],
    ],

    regexrange: [
      [/-/, 'regexp.escape.control'],
      [/\^/, 'regexp.invalid'],
      [/@regexpesc/, 'regexp.escape'],
      [/[^\]]/, 'regexp'],
      [
        /\]/,
        {
          token: 'regexp.escape.control',
          next: '@pop',
          bracket: '@close',
        },
      ],
    ],

    string_double: [
      [/[^\\"]+/, 'string'],
      [/@escapes/, 'string.escape'],
      [/\\./, 'string.escape.invalid'],
      [/"/, 'string', '@pop'],
    ],

    string_single: [
      [/[^\\']+/, 'string'],
      [/@escapes/, 'string.escape'],
      [/\\./, 'string.escape.invalid'],
      [/'/, 'string', '@pop'],
    ],

    string_backtick: [
      [/\$\{/, { token: 'delimiter.bracket', next: '@bracketCounting' }],
      [/[^\\`$]+/, 'string'],
      [/@escapes/, 'string.escape'],
      [/\\./, 'string.escape.invalid'],
      [/`/, 'string', '@pop'],
    ],

    bracketCounting: [
      [/\{/, 'delimiter.bracket', '@bracketCounting'],
      [/\}/, 'delimiter.bracket', '@pop'],
      { include: 'common' },
    ],
  },
};

let JSXLib = '';

export async function defineJSX(monaco: typeof Monaco) {
  if (!JSXLib) {
    try {
      await fetch('https://unpkg.com/@types/react/index.d.ts')
        .then((response) => response.text())
        .then((code) => {
          JSXLib = code;
        });
    } catch {}
  }

  monaco.typescript.typescriptDefaults.addExtraLib(JSXLib, `ts:filename/jsx.d.ts`);
  monaco.typescript.javascriptDefaults.addExtraLib(JSXLib, `ts:filename/jsx.d.ts`);

  monaco.typescript.typescriptDefaults.setCompilerOptions({
    ...monaco.typescript.typescriptDefaults.getCompilerOptions(),
    jsx: monaco.typescript.JsxEmit.React,
    target: monaco.typescript.ScriptTarget.ESNext,
    allowNonTsExtensions: true,
  });

  monaco.typescript.javascriptDefaults.setCompilerOptions({
    ...monaco.typescript.javascriptDefaults.getCompilerOptions(),
    jsx: monaco.typescript.JsxEmit.React,
    target: monaco.typescript.ScriptTarget.ESNext,
    allowJs: true,
    allowNonTsExtensions: true,
  });

  monaco.languages.onLanguageEncountered('typescript', () => {
    monaco.languages.setMonarchTokensProvider(
      'typescript',
      tokenProvider as Monaco.languages.IMonarchLanguage
    );
  });

  monaco.languages.onLanguageEncountered('javascript', () => {
    monaco.languages.setMonarchTokensProvider(
      'javascript',
      tokenProvider as Monaco.languages.IMonarchLanguage
    );
  });
}
