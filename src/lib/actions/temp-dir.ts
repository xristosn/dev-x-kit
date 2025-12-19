'use server';

import 'server-only';
import { existsSync } from 'fs';
import { mkdir, rm, writeFile } from 'fs/promises';
import { uniqueId } from 'lodash-es';
import { join } from 'path';
import { tmpdir } from 'os';

export async function getTempDir() {
  const dirPath = process.env.NODE_ENV === 'production' ? tmpdir() : join(process.cwd(), 'tmp');

  if (!existsSync(dirPath)) {
    await mkdir(dirPath);
  }

  return dirPath;
}

export async function getTempFile(input: string) {
  const filePath = join(await getTempDir(), `${uniqueId()}-${new Date().getTime()}.ts`);

  await writeFile(filePath, input, { encoding: 'utf-8' });

  return filePath;
}

export async function rmTempFile(filePath: string) {
  return rm(filePath, { force: true, maxRetries: 10 });
}
