import 'server-only';
import { randomUUID } from 'node:crypto';
import {
  ACTION_UNEXPECTED_MESSAGE,
  ActionValidationError,
  getActionValidationMessage,
  isActionValidationCode,
  type ActionError,
} from '@/lib/action-error';

export async function safeAction<T>(actionFn: () => Promise<T>): Promise<T | ActionError> {
  try {
    return await actionFn();
  } catch (error) {
    if (error instanceof ActionValidationError && isActionValidationCode(error.code)) {
      return {
        error: true,
        kind: 'validation',
        code: error.code,
        message: getActionValidationMessage(error.code, error.location),
        ...(error.location && { location: error.location }),
      };
    }

    const referenceId = randomUUID();
    const errorName =
      error instanceof Error && /^[A-Za-z][A-Za-z0-9]{0,63}$/.test(error.name)
        ? error.name
        : typeof error;
    const errorCode =
      error instanceof Error &&
      'code' in error &&
      typeof error.code === 'string' &&
      /^[A-Z][A-Z0-9_]{0,63}$/.test(error.code)
        ? error.code
        : undefined;
    const stackFrames =
      error instanceof Error
        ? error.stack
            ?.split('\n')
            .slice(1)
            .filter((line) => /^\s+at\s/.test(line))
            .slice(0, 12)
        : undefined;

    console.error('[safeAction] Unexpected conversion failure', {
      referenceId,
      errorName,
      errorCode,
      stackFrames,
    });

    return {
      error: true,
      kind: 'unexpected',
      message: ACTION_UNEXPECTED_MESSAGE,
      referenceId,
    };
  }
}
