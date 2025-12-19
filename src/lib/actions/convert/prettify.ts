'use server';

import 'server-only';
import type { Config } from 'prettier';
import angular from 'prettier/plugins/angular';
import babel from 'prettier/plugins/babel';
import estree from 'prettier/plugins/estree';
import flow from 'prettier/plugins/flow';
import graphql from 'prettier/plugins/graphql';
import html from 'prettier/plugins/html';
import markdown from 'prettier/plugins/markdown';
import postcss from 'prettier/plugins/postcss';
import typescript from 'prettier/plugins/typescript';
import yaml from 'prettier/plugins/yaml';
import { format } from 'prettier/standalone';

const defaultPrettierConfig = {
  endOfLine: 'crlf',
  semi: true,
  trailingComma: 'es5',
  printWidth: 100,
  singleQuote: true,
  tabWidth: 2,
  bracketSameLine: false,
} as Config;

export async function prettifyCode(code: string, config?: Config, parser?: Config['parser']) {
  try {
    const finalConfig: Config =
      config && Object.keys(config).length ? config : defaultPrettierConfig;

    if (parser) finalConfig.parser = parser;

    if (!finalConfig.parser) return code;

    if (
      ['babel', 'babel-flow', 'babel-ts', 'typescript', 'vue'].includes(
        finalConfig.parser as string
      )
    )
      code = code.replace(/export/g, '\n\nexport');

    return format(code, {
      ...finalConfig,
      plugins: [angular, babel, estree, flow, graphql, html, markdown, postcss, typescript, yaml],
    });
  } catch (err) {
    console.error('Failed to prettify code', err, { input: code, config, parser });
    return code;
  }
}
