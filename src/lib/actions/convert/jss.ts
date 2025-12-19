'use server';

import 'server-only';
import JSON from 'json5';
import ivm from 'isolated-vm';
import { create, createGenerateId, GenerateId, type Plugin } from 'jss';
import jssDefaultPreset from 'jss-preset-default';
import type { Options as DefaultUnitOptions } from 'jss-plugin-default-unit';
import { parseAsync } from '@babel/core';
import { prettifyCode } from './prettify';
import { cssToScss } from './css';
import { safeAction } from '../safe-action';
import { ActionError } from '@/types/action-error';

async function validateInput(input: string) {
  try {
    await parseAsync(input, {
      sourceType: 'module',
    });
  } catch (err) {
    throw new Error(`Input is not valid JSS. ${(err as Error)?.message || err}`, { cause: err });
  }
}

async function runInSandbox(input: string) {
  const modifiedCode = gatherVariablesAndAppend(normalizeSpaces(input));

  const isolate = new ivm.Isolate({ memoryLimit: 128 });
  const context = await isolate.createContext();

  const global = context.global;

  try {
    await context.eval(modifiedCode);

    const result = await global.get('scopeVariables');

    const scopeVariables = result.copy();

    return scopeVariables;
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

    if (!styleObjects.length) throw new Error('No style objects found');

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

    return prettifyCode(code, undefined, 'css');
  });
}

export async function jssToScss(input: string, options: Record<string, unknown>) {
  return safeAction(async () => {
    await validateInput(input);

    const css = await jssToCss(input, options);

    if ((css as ActionError)?.error) {
      throw new Error((css as ActionError).message);
    }

    return cssToScss(css as string);
  });
}
