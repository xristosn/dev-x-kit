import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactCompiler: true,

  async headers() {
    return [
      {
        source: '/:path*',
        headers: [{ key: 'Cross-Origin-Resource-Policy', value: 'same-origin' }],
      },
    ];
  },

  experimental: {
    serverActions: {
      bodySizeLimit: '10mb',
    },
  },

  serverExternalPackages: [
    '@babel/core',
    '@babel/plugin-transform-typescript',
    '@babel/preset-typescript',
    'postcss',
    'sass',
    'ts-json-schema-generator',
    'devbug',
  ],

  turbopack: {
    resolveAlias: {
      devbug: './bin/devbug-stub.ts',
    },
  },

  compiler: {
    reactRemoveProperties: { properties: ['^data-testid$'] },
  },
};

export default nextConfig;
