'use server';

import { stringify as stringifyJsonToToml } from '@iarna/toml';
import { encode as encodeJsonToToon } from '@toon-format/toon';
import {
  CSharpTargetLanguage,
  DartTargetLanguage,
  ElixirTargetLanguage,
  FlowTargetLanguage,
  GoTargetLanguage,
  InputData,
  JavaScriptPropTypesTargetLanguage,
  jsonInputForTargetLanguage,
  JSONSchemaTargetLanguage,
  PythonTargetLanguage,
  quicktype,
  RustTargetLanguage,
  TypeScriptTargetLanguage,
  TypeScriptZodTargetLanguage,
  type TargetLanguage,
} from 'quicktype-core';
import 'server-only';
// @ts-expect-error No types
import { jsonToSchema } from '@walmartlabs/json-to-simple-graphql-schema/lib';
import { JsonToJsdocConverter } from 'json-to-jsdoc-converter';
// @ts-expect-error No types
import generateSchema from 'generate-schema';
import { stringify as stringifyYaml } from 'yaml';
import { safeAction } from '../safe-action';
import { ActionValidationError, type ActionErrorLocation } from '@/lib/action-error';
import { prettifyCode } from './prettify';

function getJsonErrorLocation(input: string, error: unknown): ActionErrorLocation | undefined {
  if (!(error instanceof Error)) return undefined;

  const match = error.message.match(/position\s+(\d+)/i);
  if (!match) return undefined;

  const offset = Number(match[1]);
  if (!Number.isSafeInteger(offset) || offset < 0 || offset > input.length) return undefined;

  const lines = input.slice(0, offset).split(/\r\n|\r|\n/);
  return { line: lines.length, column: lines[lines.length - 1].length + 1 };
}

function validateInput(input: string) {
  try {
    return JSON.parse(input);
  } catch (error) {
    throw new ActionValidationError('INVALID_JSON', getJsonErrorLocation(input, error));
  }
}

async function quicktypeJsonToTargetLanguage(
  input: string,
  options: Record<string, unknown>,
  targetLanguage: TargetLanguage
) {
  const quicktypeInput = jsonInputForTargetLanguage(targetLanguage);

  await quicktypeInput.addSource({
    name: 'Root',
    samples: [input],
  });

  const inputData = new InputData();
  inputData.addInput(quicktypeInput);

  return (
    await quicktype({
      inputData,
      lang: targetLanguage,
      rendererOptions: options,
    })
  ).lines.join('\n');
}

export async function jsonToJsonSchema(input: string, options: Record<string, unknown>) {
  return safeAction(async () => {
    validateInput(input);

    const result = await quicktypeJsonToTargetLanguage(
      input,
      options,
      new JSONSchemaTargetLanguage()
    );
    return prettifyCode(result, undefined, 'json');
  });
}

export async function jsonToCSharp(input: string, options: Record<string, unknown>) {
  return safeAction(async () => {
    validateInput(input);

    return await quicktypeJsonToTargetLanguage(input, options, new CSharpTargetLanguage());
  });
}

export async function jsonToReactPropTypes(input: string, options: Record<string, unknown>) {
  return safeAction(async () => {
    validateInput(input);

    return prettifyCode(
      await quicktypeJsonToTargetLanguage(input, options, new JavaScriptPropTypesTargetLanguage()),
      undefined,
      'typescript'
    );
  });
}

export async function jsonToPython(input: string, options: Record<string, unknown>) {
  return safeAction(async () => {
    validateInput(input);

    return await quicktypeJsonToTargetLanguage(input, options, new PythonTargetLanguage());
  });
}

export async function jsonToRust(input: string, options: Record<string, unknown>) {
  return safeAction(async () => {
    validateInput(input);

    return await quicktypeJsonToTargetLanguage(input, options, new RustTargetLanguage());
  });
}

export async function jsonToTypescript(input: string, options: Record<string, unknown>) {
  return safeAction(async () => {
    validateInput(input);

    return prettifyCode(
      await quicktypeJsonToTargetLanguage(input, options, new TypeScriptTargetLanguage()),
      undefined,
      'typescript'
    );
  });
}

export async function jsonToZod(input: string, options: Record<string, unknown>) {
  return safeAction(async () => {
    validateInput(input);

    return prettifyCode(
      await quicktypeJsonToTargetLanguage(input, options, new TypeScriptZodTargetLanguage()),
      undefined,
      'typescript'
    );
  });
}

export async function jsonToGo(input: string, options: Record<string, unknown>) {
  return safeAction(async () => {
    validateInput(input);

    return await quicktypeJsonToTargetLanguage(input, options, new GoTargetLanguage());
  });
}

export async function jsonToDart(input: string, options: Record<string, unknown>) {
  return safeAction(async () => {
    validateInput(input);

    return await quicktypeJsonToTargetLanguage(input, options, new DartTargetLanguage());
  });
}

export async function jsonToFlow(input: string, options: Record<string, unknown>) {
  return safeAction(async () => {
    validateInput(input);

    return await quicktypeJsonToTargetLanguage(input, options, new FlowTargetLanguage());
  });
}

export async function jsonToElixir(input: string, options: Record<string, unknown>) {
  return safeAction(async () => {
    validateInput(input);

    return await quicktypeJsonToTargetLanguage(input, options, new ElixirTargetLanguage());
  });
}

export async function jsonToGraphQl(input: string, options: Record<string, unknown>) {
  return safeAction(async () => {
    // The converter strips non-word characters before using JSON keys as lodash.set
    // path segments. Reject dangerous keys after applying the same normalization.
    JSON.parse(input, (key, value) => {
      const normalizedKey = key.replace(/[\W]+/g, '');
      if (
        normalizedKey === '__proto__' ||
        normalizedKey === 'constructor' ||
        normalizedKey === 'prototype'
      ) {
        throw new ActionValidationError('UNSAFE_JSON_KEY');
      }
      return value;
    });

    const schema = jsonToSchema({
      jsonInput: input,
      ...options,
      baseType: options.baseType || 'Root',
    });

    return prettifyCode(schema.value, undefined, 'graphql');
  });
}

export async function jsonToJsDoc(input: string, options: Record<string, unknown>) {
  return safeAction(async () => {
    validateInput(input);

    const converter = new JsonToJsdocConverter();
    const code = converter.convert(input, options);
    return code;
  });
}

export async function jsonToMySql(input: string, options: Record<string, unknown>) {
  return safeAction(async () => {
    return generateSchema.mysql(options.tableName || 'Root', validateInput(input));
  });
}

export async function jsonToMongooseSchema(input: string) {
  return safeAction(async () => {
    return JSON.stringify(generateSchema.mongoose(validateInput(input)), null, 2);
  });
}

export async function jsonToBigQuery(input: string) {
  return safeAction(async () => {
    return JSON.stringify(generateSchema.bigquery(validateInput(input)), null, 2);
  });
}

export async function jsonToToml(input: string) {
  return safeAction(async () => {
    return stringifyJsonToToml(validateInput(input));
  });
}

export async function jsonToYaml(input: string) {
  return safeAction(async () => {
    return prettifyCode(stringifyYaml(validateInput(input)), undefined, 'yaml');
  });
}

export async function jsonToToon(input: string, options: Record<string, unknown>) {
  return safeAction(async () => {
    const delimeter = { comma: ',', tab: '\n', pipe: '|' };

    return encodeJsonToToon(validateInput(input), {
      ...options,
      delimiter: delimeter[options.delimiter as 'comma'] as ',',
    });
  });
}
