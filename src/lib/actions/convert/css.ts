'use server';

import 'server-only';
import { transformAsync } from '@babel/core';
// @ts-expect-error No types
import cssConverter from '@gecka/styleflux';
// @ts-expect-error No types
import babelCssToJs from 'babel-plugin-css-to-js';
// @ts-expect-error No types
import { validate } from 'csstree-validator';
import { prettifyCode } from './prettify';
import { safeAction } from '../safe-action';

function validateInput(input: string) {
  const errors = validate(input, 'input.css');

  if (errors.length) {
    throw new Error(`Input is not valid CSS, ${errors.map((err: Error) => err.message)}`, {
      cause: errors,
    });
  }
}

export async function cssToJs(input: string) {
  return safeAction(async () => {
    validateInput(input);

    const result = await transformAsync(
      `
  export const testCss = () => css\`
    ${input}
    \`
    `,
      {
        plugins: [babelCssToJs],
        babelrc: false,
        configFile: false,
        sourceMaps: false,
        retainLines: false,
      }
    );

    if (!result?.code) throw new Error('No code generated');

    const transformedCode = result?.code
      ?.replace('export const testCss = () => (', 'const css = ')
      .replace('});', '};');

    return prettifyCode(transformedCode, undefined, 'typescript');
  });
}

export async function cssToScss(code: string) {
  return safeAction(async () => {
    validateInput(code);

    return prettifyCode(cssConverter.cssToScss(code) as string, undefined, 'scss');
  });
}
