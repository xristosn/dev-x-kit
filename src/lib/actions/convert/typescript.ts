'use server';

import 'server-only';
import { prettifyCode } from './prettify';
import { join } from 'path';
import { getTempFile } from '../temp-dir';
import { rm } from 'fs/promises';
import { createGenerator } from 'ts-json-schema-generator';
import { generate } from 'ts-to-zod';
import transformTypeScript from '@babel/plugin-transform-typescript';
import { parseAsync, transformAsync } from '@babel/core';
import { safeAction } from '../safe-action';
import { ActionValidationError } from '@/lib/action-error';

async function validateInput(input: string) {
  try {
    await parseAsync(input, {
      sourceType: 'module',
      plugins: [transformTypeScript],
      babelrc: false,
      configFile: false,
      sourceMaps: false,
      retainLines: false,
    });
  } catch (error) {
    if (error instanceof SyntaxError) throw new ActionValidationError('INVALID_TYPESCRIPT');
    throw error;
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

      if (generator.errors.length) {
        throw new ActionValidationError('TYPESCRIPT_GENERATION_FAILED');
      }

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
      plugins: [transformTypeScript],
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
