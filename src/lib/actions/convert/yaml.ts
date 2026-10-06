'use server';

import 'server-only';
import { parse as parseYaml } from 'yaml';
import { prettifyCode } from './prettify';
import { jsonToJsDoc, jsonToJsonSchema, jsonToToml, jsonToTypescript } from './json';
import { safeAction } from '../safe-action';
import { isActionError } from '@/lib/action-error';

export async function yamlToJson(input: string) {
  return safeAction(async () => {
    const code = JSON.stringify(parseYaml(input), null, 2);
    return prettifyCode(code, undefined, 'json');
  });
}

export async function yamlToJsonSchema(input: string, options: Record<string, unknown>) {
  return safeAction(async () => {
    const code = await yamlToJson(input);

    if (isActionError(code)) return code;

    const schema = await jsonToJsonSchema(code, options);

    if (isActionError(schema)) return schema;

    return prettifyCode(schema, undefined, 'json');
  });
}

export async function yamlToToml(input: string) {
  return safeAction(async () => {
    const json = await yamlToJson(input);

    if (isActionError(json)) return json;

    return jsonToToml(json);
  });
}

export async function yamlToTypescript(input: string, options: Record<string, unknown>) {
  return safeAction(async () => {
    const json = await yamlToJson(input);

    if (isActionError(json)) return json;

    return jsonToTypescript(json, options);
  });
}

export async function yamlToJsDoc(input: string, options: Record<string, unknown>) {
  return safeAction(async () => {
    const json = await yamlToJson(input);

    if (isActionError(json)) return json;

    return jsonToJsDoc(json, options);
  });
}
