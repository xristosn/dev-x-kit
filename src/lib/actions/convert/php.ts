'use server';

import 'server-only';
import { serialize, unserialize, isSerialized } from 'php-serialize';
import { safeAction } from '../safe-action';
import { ActionValidationError } from '@/lib/action-error';

export async function phpToSerialized(input: string) {
  return safeAction(async () => {
    if (isSerialized(input)) throw new ActionValidationError('PHP_ALREADY_SERIALIZED');

    return serialize(input, undefined, { encoding: 'utf-8' });
  });
}

export async function phpToDeserialized(input: string) {
  return safeAction(async () => {
    if (!isSerialized(input)) throw new ActionValidationError('PHP_NOT_SERIALIZED');

    const output = unserialize(input, undefined, { encoding: 'utf-8' });

    if (typeof output === 'string') return output;

    return JSON.stringify(output, null, 2);
  });
}
