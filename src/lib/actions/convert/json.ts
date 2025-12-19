'use server';

import 'server-only';
import {
  quicktype,
  jsonInputForTargetLanguage,
  InputData,
  JSONSchemaTargetLanguage,
  type TargetLanguage,
  CSharpTargetLanguage,
  JavaScriptPropTypesTargetLanguage,
  PythonTargetLanguage,
  RustTargetLanguage,
  TypeScriptTargetLanguage,
  TypeScriptZodTargetLanguage,
  GoTargetLanguage,
  DartTargetLanguage,
  FlowTargetLanguage,
  ElixirTargetLanguage,
} from 'quicktype-core';
// @ts-expect-error No types
import { jsonToSchema } from '@walmartlabs/json-to-simple-graphql-schema/lib';
import { JsonToJsdocConverter } from 'json-to-jsdoc-converter';
// @ts-expect-error No types
import generateSchema from 'generate-schema';
import { stringify as stringifyJsonToToml } from '@iarna/toml';
import { stringify as stringifyYaml } from 'yaml';
import { encode as encodeJsonToToon } from '@toon-format/toon';
import { prettifyCode } from './prettify';
import { safeAction } from '../safe-action';

function validateInput(input: string) {
  try {
    JSON.parse(input);
  } catch (err) {
    throw new Error(`Input is not a valid JSON. ${(err as Error)?.message || err} `, {
      cause: err,
    });
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
    validateInput(input);

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
    validateInput(input);

    return generateSchema.mysql(options.tableName || 'Root', JSON.parse(input));
  });
}

export async function jsonToMongooseSchema(input: string) {
  return safeAction(async () => {
    validateInput(input);

    return JSON.stringify(generateSchema.mongoose(JSON.parse(input)), null, 2);
  });
}

export async function jsonToBigQuery(input: string) {
  return safeAction(async () => {
    validateInput(input);

    return JSON.stringify(generateSchema.bigquery(JSON.parse(input)), null, 2);
  });
}

export async function jsonToToml(input: string) {
  return safeAction(async () => {
    validateInput(input);

    return stringifyJsonToToml(JSON.parse(input));
  });
}

export async function jsonToYaml(input: string) {
  return safeAction(async () => {
    validateInput(input);

    return prettifyCode(stringifyYaml(JSON.parse(input)), undefined, 'yaml');
  });
}

export async function jsonToToon(input: string, options: Record<string, unknown>) {
  return safeAction(async () => {
    validateInput(input);

    const delimeter = { comma: ',', tab: '\n', pipe: '|' };

    return encodeJsonToToon(JSON.parse(input), {
      ...options,
      delimiter: delimeter[options.delimiter as 'comma'] as ',',
    });
  });
}
