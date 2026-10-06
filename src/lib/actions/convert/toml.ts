'use server';

import { parse as parseToml } from '@iarna/toml';
import 'server-only';
import { safeAction } from '../safe-action';
import { isActionError } from '@/lib/action-error';
import { jsonToJsDoc, jsonToJsonSchema, jsonToTypescript, jsonToYaml } from './json';
import { prettifyCode } from './prettify';

export async function tomlToJson(input: string) {
  return safeAction(async () => {
    const json = parseToml(input);
    return prettifyCode(JSON.stringify(json, null, 2), undefined, 'json');
  });
}

export async function tomlToJsonSchema(input: string, options: Record<string, unknown>) {
  return safeAction(async () => {
    const json = await tomlToJson(input);

    if (isActionError(json)) return json;

    return jsonToJsonSchema(json, options);
  });
}

export async function tomlToYaml(input: string) {
  return safeAction(async () => {
    const json = await tomlToJson(input);

    if (isActionError(json)) return json;

    return jsonToYaml(json);
  });
}

export async function tomlToTypescript(input: string, options: Record<string, unknown>) {
  return safeAction(async () => {
    const json = await tomlToJson(input);

    if (isActionError(json)) return json;

    return jsonToTypescript(json, options);
  });
}

export async function tomlToJsDoc(input: string, options: Record<string, unknown>) {
  return safeAction(async () => {
    const json = await tomlToJson(input);

    if (isActionError(json)) return json;

    return jsonToJsDoc(json, options);
  });
}
