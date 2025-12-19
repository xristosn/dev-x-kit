'use server';

import 'server-only';
import { type ConfigPlugin, type Config as SvgrConfig, transform } from '@svgr/core';
import jsxPlugin from '@svgr/plugin-jsx';
import svgoPlugin from '@svgr/plugin-svgo';
import { prettifyCode } from './prettify';
import { type Config as SvgoConfig } from 'svgo';
import isSvg from 'is-svg';
import { safeAction } from '../safe-action';

function validateInput(input: string) {
  if (!isSvg(input)) throw new Error('Input is not a valid SVG');
}

function getConfig(options: Record<string, unknown>): SvgrConfig {
  const config = { ...options, plugins: [] } as SvgrConfig;

  if (options.svgo) {
    if (options.useDefault) {
      config.plugins = ['preset-default'];
      config.svgoConfig = undefined;
    } else {
      if (!config.svgoConfig) config.svgoConfig = { plugins: [] };

      config.svgoConfig.plugins = Object.entries(
        (options.svgoConfig as { plugins: Record<string, boolean> })?.plugins || {}
      )
        .reduce(
          (prev, [pluginName, enabled]) => [...prev, enabled ? pluginName : ''],
          [] as string[]
        )
        .filter(Boolean) as SvgoConfig['plugins'];
    }
  }

  return config;
}

export async function svgToReact(input: string, options: Record<string, unknown>) {
  return safeAction(async () => {
    validateInput(input);

    const config = getConfig(options);

    let reactCode = await transform(
      input,
      {
        ...config,
        plugins: [config.svgo && svgoPlugin, jsxPlugin].filter(Boolean) as ConfigPlugin[],
      },
      { componentName: 'MyComponent', filePath: 'foo' }
    );

    if (options.prettier) {
      reactCode = await prettifyCode(
        reactCode
          .replace('const MyComponent', '\nconst MyComponent')
          .replace('export default', '\nexport default'),
        undefined,
        options.typescript ? 'typescript' : 'babel'
      );
    }

    return reactCode;
  });
}

export async function svgToOptimized(input: string, options: Record<string, unknown>) {
  return safeAction(async () => {
    validateInput(input);

    const config = getConfig({ ...options, svgo: true });

    return await transform(
      input,
      {
        ...config,
        plugins: [svgoPlugin],
      },
      { filePath: 'foo' }
    );
  });
}

export async function svgToDataURI(input: string) {
  return safeAction(async () => {
    validateInput(input);

    return `data:image/svg+xml;base64,${Buffer.from(input).toString('base64')}`;
  });
}
