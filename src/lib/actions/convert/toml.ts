'use server';

import 'server-only';
import { parse as parseToml } from '@iarna/toml';
import { prettifyCode } from './prettify';
import { jsonToJsDoc, jsonToJsonSchema, jsonToTypescript, jsonToYaml } from './json';
import { safeAction } from '../safe-action';

export async function tomlToJson(input: string) {
  return safeAction(async () => {
    const json = parseToml(input);
    return prettifyCode(JSON.stringify(json, null, 2), undefined, 'json');
  });
}

export async function tomlToJsonSchema(input: string, options: Record<string, unknown>) {
  return safeAction(async () => {
    const json = await tomlToJson(input);

    if (typeof json === 'object' && 'error' in json) {
      throw new Error(json.message);
    }

    return jsonToJsonSchema(json, options);
  });
}

export async function tomlToYaml(input: string) {
  return safeAction(async () => {
    const json = await tomlToJson(input);

    if (typeof json === 'object' && 'error' in json) {
      throw new Error(json.message);
    }

    return jsonToYaml(json);
  });
}

export async function tomlToTypescript(input: string, options: Record<string, unknown>) {
  return safeAction(async () => {
    const json = await tomlToJson(input);

    if (typeof json === 'object' && 'error' in json) {
      throw new Error(json.message);
    }

    return jsonToTypescript(json, options);
  });
}

export async function tomlToJsDoc(input: string, options: Record<string, unknown>) {
  return safeAction(async () => {
    const json = await tomlToJson(input);

    if (typeof json === 'object' && 'error' in json) {
      throw new Error(json.message);
    }

    return jsonToJsDoc(json, options);
  });
}
