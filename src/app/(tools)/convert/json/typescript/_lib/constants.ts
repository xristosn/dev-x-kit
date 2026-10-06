import { createConvertOptionsFromQuicktypeOptions } from '@/lib/create-convert-options';
import { TypeScriptTargetLanguage } from 'quicktype-core';

export const JSON_TO_TYPESCRIPT_OPTIONS = createConvertOptionsFromQuicktypeOptions(
  new TypeScriptTargetLanguage(),
  {
    'acronym-style': 'camel',
    'runtime-typecheck': false,
    'just-types': true,
  }
);
