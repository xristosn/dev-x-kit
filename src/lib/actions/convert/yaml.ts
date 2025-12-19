'use server';

import 'server-only';
import { parse as parseYaml } from 'yaml';
import { prettifyCode } from './prettify';
import { jsonToJsDoc, jsonToJsonSchema, jsonToToml, jsonToTypescript } from './json';
import { safeAction } from '../safe-action';

export async function yamlToJson(input: string) {
  return safeAction(async () => {
    const code = JSON.stringify(parseYaml(input), null, 2);
    return prettifyCode(code, undefined, 'json');
  });
}

export async function yamlToJsonSchema(input: string, options: Record<string, unknown>) {
  return safeAction(async () => {
    const code = await yamlToJson(input);

    if (typeof code === 'object' && 'error' in code) {
      throw new Error(code.message);
    }

    const schema = await jsonToJsonSchema(code, options);

    if (typeof schema === 'object' && 'error' in schema) {
      throw new Error(schema.message);
    }

    return prettifyCode(schema, undefined, 'json');
  });
}

export async function yamlToToml(input: string) {
  return safeAction(async () => {
    const json = await yamlToJson(input);

    if (typeof json === 'object' && 'error' in json) {
      throw new Error(json.message);
    }

    return jsonToToml(json);
  });
}

export async function yamlToTypescript(input: string, options: Record<string, unknown>) {
  return safeAction(async () => {
    const json = await yamlToJson(input);

    if (typeof json === 'object' && 'error' in json) {
      throw new Error(json.message);
    }

    return jsonToTypescript(json, options);
  });
}

export async function yamlToJsDoc(input: string, options: Record<string, unknown>) {
  return safeAction(async () => {
    const json = await yamlToJson(input);

    if (typeof json === 'object' && 'error' in json) {
      throw new Error(json.message);
    }

    return jsonToJsDoc(json, options);
  });
}
