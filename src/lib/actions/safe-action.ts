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
    const stackFrames =
      error instanceof Error
        ? error.stack
            ?.split('\n')
            .slice(1)
            .filter((line) => /^\s+at\s/.test(line))
            .slice(0, 12)
        : undefined;

    console.error('[safeAction] Unexpected conversion failure', { referenceId, stackFrames });

    return {
      error: true,
      kind: 'unexpected',
      message: ACTION_UNEXPECTED_MESSAGE,
      referenceId,
    };
  }
}
