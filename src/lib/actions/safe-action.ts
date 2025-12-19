'use server';

import 'server-only';
import { ActionError } from '@/types/action-error';

export async function safeAction<T>(actionFn: () => Promise<T>): Promise<T | ActionError> {
  try {
    const data = await actionFn();
    return data;
  } catch (err) {
    console.error(err);

    return { error: true, message: (err as Error)?.message || (err as string) };
  }
}
