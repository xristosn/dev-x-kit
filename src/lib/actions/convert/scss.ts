'use server';

import 'server-only';
import { compileStringAsync } from 'sass';
import { prettifyCode } from './prettify';
import { cssToJs, cssToTailwindV3 } from './css';
import { safeAction } from '../safe-action';

export async function scssToCss(input: string, options: Record<string, unknown>) {
  return safeAction(async () => {
    const result = await compileStringAsync(input, {
      sourceMap: false,
      style: 'expanded',
      charset: false,
      ...options,
    });

    const css = result.css.replace(/(}\r|}\n)/, '}\n\n');

    if (options.style === 'expanded') return prettifyCode(css, undefined, 'css');
    return css;
  });
}

export async function scssToJs(input: string) {
  return safeAction(async () => {
    const css = await scssToCss(input, { format: 'expanded' });

    if (typeof css === 'object' && 'error' in css) {
      throw new Error(css.message);
    }

    const js = await cssToJs(css as string);

    if (typeof js === 'object' && 'error' in js) {
      throw new Error(js.message);
    }

    return prettifyCode(js, undefined, 'typescript');
  });
}

export async function scssToTailwindV3(input: string, options: Record<string, unknown>) {
  return safeAction(async () => {
    const css = await scssToCss(input, { format: 'expanded' });

    if (typeof css === 'object' && 'error' in css) {
      throw new Error(css.message);
    }

    return await cssToTailwindV3(css as string, options);
  });
}
