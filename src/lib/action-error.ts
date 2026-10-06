export const ACTION_UNEXPECTED_MESSAGE =
  'Unable to convert input. Please check your input and try again.';

export const ACTION_VALIDATION_MESSAGES = {
  INVALID_JSON: 'Input is not valid JSON.',
  UNSAFE_JSON_KEY: 'Input contains a key that cannot be converted safely.',
  INVALID_CSS: 'Input is not valid CSS.',
  INVALID_HTML: 'Input could not be recognized as valid HTML.',
  EMPTY_HTML_BODY: 'HTML input must contain non-empty body content.',
  INVALID_JSS: 'Input is not valid JSS.',
  NO_JSS_STYLE_OBJECTS: 'Input does not contain any style objects.',
  PHP_ALREADY_SERIALIZED: 'Input is already a serialized PHP value.',
  PHP_NOT_SERIALIZED: 'Input is not a serialized PHP value.',
  INVALID_SVG: 'Input is not a valid SVG.',
  INVALID_TYPESCRIPT: 'Input is not valid TypeScript.',
  TYPESCRIPT_GENERATION_FAILED: 'Unable to generate Zod schemas from this TypeScript input.',
} as const;

export type ActionValidationCode = keyof typeof ACTION_VALIDATION_MESSAGES;
export type ActionErrorLocation = { line: number; column: number };

export function isActionValidationCode(value: unknown): value is ActionValidationCode {
  return typeof value === 'string' && Object.hasOwn(ACTION_VALIDATION_MESSAGES, value);
}

export type ActionError =
  | {
      error: true;
      kind: 'validation';
      code: ActionValidationCode;
      message: string;
      location?: ActionErrorLocation;
    }
  | {
      error: true;
      kind: 'unexpected';
      message: string;
      referenceId: string;
    };

export function getActionValidationMessage(
  code: ActionValidationCode,
  location?: ActionErrorLocation
) {
  return code === 'INVALID_JSON' && location
    ? `${ACTION_VALIDATION_MESSAGES[code]} Error near line ${location.line}, column ${location.column}.`
    : ACTION_VALIDATION_MESSAGES[code];
}

export class ActionValidationError extends Error {
  constructor(
    readonly code: ActionValidationCode,
    readonly location?: ActionErrorLocation
  ) {
    super(getActionValidationMessage(code, location));
    this.name = 'ActionValidationError';
  }
}

function isActionErrorLocation(value: unknown): value is ActionErrorLocation {
  return (
    typeof value === 'object' &&
    value !== null &&
    'line' in value &&
    typeof value.line === 'number' &&
    Number.isSafeInteger(value.line) &&
    value.line > 0 &&
    'column' in value &&
    typeof value.column === 'number' &&
    Number.isSafeInteger(value.column) &&
    value.column > 0
  );
}

export function isActionError(value: unknown): value is ActionError {
  if (!value || typeof value !== 'object' || !('error' in value) || value.error !== true) {
    return false;
  }

  if (!('kind' in value) || !('message' in value) || typeof value.message !== 'string') {
    return false;
  }

  if (value.kind === 'unexpected') {
    return (
      value.message === ACTION_UNEXPECTED_MESSAGE &&
      'referenceId' in value &&
      typeof value.referenceId === 'string' &&
      value.referenceId.length > 0
    );
  }

  if (value.kind !== 'validation' || !('code' in value) || !isActionValidationCode(value.code)) {
    return false;
  }

  const location = 'location' in value ? value.location : undefined;
  if (location !== undefined && !isActionErrorLocation(location)) return false;

  return value.message === getActionValidationMessage(value.code as ActionValidationCode, location);
}
