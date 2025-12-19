'use server';

import 'server-only';
import { prettifyCode } from './prettify';
import { join } from 'path';
import { getTempFile } from '../temp-dir';
import { rm } from 'fs/promises';
import { createGenerator } from 'ts-json-schema-generator';
import { generate } from 'ts-to-zod';
import { parseAsync, transformAsync } from '@babel/core';
import { safeAction } from '../safe-action';

async function validateInput(input: string) {
  try {
    await parseAsync(input, {
      sourceType: 'module',
      plugins: ['@babel/plugin-transform-typescript'],
      babelrc: false,
      configFile: false,
      sourceMaps: false,
      retainLines: false,
    });
  } catch (err) {
    throw new Error(`Input is not valid Typescript. ${(err as Error)?.message || err}`, {
      cause: err,
    });
  }
}

export async function tsToJsonSchema(input: string, options: Record<string, unknown>) {
  return safeAction(async () => {
    await validateInput(input);

    const filePath = await getTempFile(input);

    try {
      const schema = createGenerator({
        ...options,
        path: filePath,
        type: '*',
        tsconfig: join(process.cwd(), 'tsconfig.json'),
        skipTypeCheck: true,
      }).createSchema('*');

      const code = JSON.stringify(schema, null, options.minify ? 0 : 2);

      if (options.minify) return code;

      return prettifyCode(code, undefined, 'json');
    } catch (err) {
      throw err;
    } finally {
      await rm(filePath, { force: true, maxRetries: 10 });
    }
  });
}

export async function tsToZod(input: string, options: Record<string, unknown>) {
  return safeAction(async () => {
    await validateInput(input);

    const filePath = await getTempFile(input);

    try {
      const generator = generate({ ...options, sourceText: input });
      const schema = generator.getZodSchemasFile(filePath).split(/\r?\n/).slice(1).join('\n');

      if (generator.errors.length) throw new Error(generator.errors.join('\n, '));

      return prettifyCode(schema, undefined, 'typescript');
    } finally {
      await rm(filePath, { force: true, maxRetries: 10 });
    }
  });
}

export async function tsToJs(input: string) {
  return safeAction(async () => {
    await validateInput(input);

    const result = await transformAsync(input, {
      sourceType: 'module',
      plugins: ['@babel/plugin-transform-typescript'],
      filename: 'file.ts',
      babelrc: false,
      configFile: false,
      sourceMaps: false,
      retainLines: false,
    });

    if (result?.code) return prettifyCode(result.code, undefined, 'typescript');

    throw new Error('Transpilation failed to produce code.');
  });
}
