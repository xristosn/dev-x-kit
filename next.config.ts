import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactCompiler: true,

  experimental: {
    serverActions: {
      allowedOrigins: ['dev-x-kit.netlify.app'],
      bodySizeLimit: '10mb',
    },
  },

  serverExternalPackages: [
    '@babel/plugin-transform-typescript',
    '@babel/preset-typescript',
    'postcss',
    'sass',
    'ts-json-schema-generator',
  ],
};

export default nextConfig;
