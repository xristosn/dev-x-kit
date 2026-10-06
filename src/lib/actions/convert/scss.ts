'use server';

import 'server-only';
import { compileStringAsync } from 'sass';
import { prettifyCode } from './prettify';
import { cssToJs, cssToTailwindV3 } from './css';
import { safeAction } from '../safe-action';
import { isActionError } from '@/lib/action-error';

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

    if (isActionError(css)) return css;

    const js = await cssToJs(css as string);

    if (isActionError(js)) return js;

    return prettifyCode(js, undefined, 'typescript');
  });
}

export async function scssToTailwindV3(input: string, options: Record<string, unknown>) {
  return safeAction(async () => {
    const css = await scssToCss(input, { format: 'expanded' });

    if (isActionError(css)) return css;

    return await cssToTailwindV3(css as string, options);
  });
}
