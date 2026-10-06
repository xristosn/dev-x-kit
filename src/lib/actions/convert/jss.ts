'use server';

import { ActionValidationError, isActionError } from '@/lib/action-error';
import { parseAsync } from '@babel/core';
import ivm from 'isolated-vm';
import JSON from 'json5';
import { create, createGenerateId, GenerateId, type Plugin } from 'jss';
import type { Options as DefaultUnitOptions } from 'jss-plugin-default-unit';
import jssDefaultPreset from 'jss-preset-default';
import 'server-only';
import { safeAction } from '../safe-action';
import { cssToScss, cssToTailwindV3 } from './css';
import { prettifyCode } from './prettify';

const SANDBOX_TIMEOUT_MS = 5000;

function withTimeout<T>(promise: Promise<T>, timeoutMs: number): Promise<T> {
  const timeout = new Promise<never>((_, reject) => {
    setTimeout(() => reject(new Error('Sandbox execution timed out')), timeoutMs);
  });
  return Promise.race([promise, timeout]);
}

async function validateInput(input: string) {
  try {
    await parseAsync(input, {
      sourceType: 'module',
    });
  } catch {
    try {
      await parseAsync(`const __root = { ${input} }`, { sourceType: 'module' });
    } catch (error) {
      if (error instanceof SyntaxError) throw new ActionValidationError('INVALID_JSS');
      throw error;
    }
  }
}

async function runInSandbox(input: string) {
  const modifiedCode = gatherVariablesAndAppend(normalizeSpaces(input));

  const isolate = new ivm.Isolate({ memoryLimit: 128 });
  const context = await isolate.createContext();

  const global = context.global;

  try {
    await withTimeout(context.eval(modifiedCode), SANDBOX_TIMEOUT_MS);

    const result = await global.get('scopeVariables');

    const scopeVariables = result.copy();

    return scopeVariables;
  } catch (err) {
    try {
      const wrappedCode = `const __root = { ${input} }; scopeVariables = [{ ROOT: __root }];`;
      await withTimeout(context.eval(wrappedCode), SANDBOX_TIMEOUT_MS);
      const result = await global.get('scopeVariables');
      return result.copy();
    } catch {
      throw err;
    }
  } finally {
    isolate.dispose();
  }
}

function gatherVariablesAndAppend(input: string) {
  const regex = /(?:^|\s)(const|let|var)\s+([a-zA-Z_$][a-zA-Z_$0-9]*)\s*(?==)/gm;

  const variables: string[] = [];
  let match;
  while ((match = regex.exec(input)) !== null) {
    variables.push(match[2]);
  }

  const scopeVariables = `scopeVariables = [ ${variables.map((v) => `{"${v}": ${v}}`).join(', ')} ];`;
  return input + '\n' + scopeVariables;
}

function normalizeSpaces(code: string) {
  return code
    .replace(/(const)\s+/g, 'const ')
    .replace(/(let)\s+/g, 'let ')
    .replace(/(var)\s+/g, 'var ');
}

function jssShorthandPlugin(): Plugin {
  const shorthandMap: Record<string, string | string[]> = {
    ml: 'margin-left',
    mr: 'margin-right',
    mt: 'margin-top',
    mb: 'margin-bottom',
    mx: ['margin-left', 'margin-right'],
    my: ['margin-top', 'margin-bottom'],
    pt: 'padding-top',
    pb: 'padding-bottom',
    pl: 'padding-left',
    pr: 'padding-right',
    px: ['padding-left', 'padding-right'],
    py: ['padding-top', 'padding-bottom'],
    m: 'margin',
    p: 'padding',
    w: 'width',
    h: 'height',
  };

  return {
    onProcessStyle(style) {
      for (const key in style) {
        const match = shorthandMap[key];

        if (match) {
          const matchArr = Array.isArray(match) ? match : [match];

          matchArr.forEach((propertyName) => {
            // @ts-expect-error Asignment of shorthand property to normal CSS property
            style[propertyName] = style[key];
          });

          // @ts-expect-error Delete the shorthand property
          delete style[key];
        }
      }

      return style;
    },
  };
}

function extractRawOutput(code: string) {
  const match = code.match(/^[^{]+\{\s*([\s\S]*)\s*\}\s*$/);
  return match ? match[1].trim() : code;
}

export async function jssToCss(input: string, options: Record<string, unknown>) {
  return safeAction(async () => {
    await validateInput(input);

    const styleObjects = [];

    try {
      const obj = JSON.parse(input);
      styleObjects.push({ ROOT: obj });
    } catch {
      styleObjects.push(...(await runInSandbox(input)));
    }

    if (!styleObjects.length) throw new ActionValidationError('NO_JSS_STYLE_OBJECTS');

    let code = '';

    const defaultUnits = (
      options.defaultUnitValues ? options.defaultUnits : {}
    ) as DefaultUnitOptions;

    if (options.defaultUnitValues) {
      ['margin-left', 'margin-right', 'margin-top', 'margin-bottom'].forEach((key) => {
        defaultUnits[key] = defaultUnits['margin'];
      });

      ['padding-left', 'padding-right', 'padding-top', 'padding-bottom'].forEach((key) => {
        defaultUnits[key] = defaultUnits['padding'];
      });

      defaultUnits['height'] = defaultUnits['width'];

      defaultUnits['border-width'] = defaultUnits['border'];

      defaultUnits['left'] = defaultUnits['top'];
      defaultUnits['right'] = defaultUnits['top'];
      defaultUnits['bottom'] = defaultUnits['top'];
    }

    const jss = create(jssDefaultPreset({ defaultUnit: defaultUnits }));
    if (options.transformShortProps) jss.use(jssShorthandPlugin());

    const generateId: GenerateId = options.generateClassIds
      ? createGenerateId()
      : (rule) => rule.key;

    styleObjects.forEach((styleObj) => {
      const styles = jss.createStyleSheet(styleObj, {
        classNamePrefix: options.classPrefix as string,
        generateId: generateId,
      });

      code += styles.toString() + '\n\n';
    });

    let css = code;

    if (options.rawOutput) {
      css = extractRawOutput(css);
    }

    return prettifyCode(css, undefined, 'css');
  });
}

export async function jssToScss(input: string, options: Record<string, unknown>) {
  return safeAction(async () => {
    await validateInput(input);

    const css = await jssToCss(input, { ...options, rawOutput: false });

    if (isActionError(css)) return css;

    const scss = await cssToScss(css as string);

    if (typeof scss === 'string' && options.rawOutput) {
      return extractRawOutput(scss);
    }

    return scss;
  });
}

export async function jssToTailwindV3(input: string, options: Record<string, unknown>) {
  return safeAction(async () => {
    await validateInput(input);

    const css = await jssToCss(input, { ...options, rawOutput: false });

    if (isActionError(css)) return css;

    return await cssToTailwindV3(css as string, options);
  });
}
