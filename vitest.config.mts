import react from '@vitejs/plugin-react';
import { fileURLToPath, URL } from 'node:url';
import { configDefaults, defineConfig } from 'vitest/config';

const nodeOnlyFolders = ['src/lib/actions'];
const nodeIncludes = [
  ...nodeOnlyFolders.map((dir) => `${dir}/**/*.test.{ts,tsx}`),
  'src/proxy.test.ts',
];
const nodeExcludes = [...nodeOnlyFolders.map((dir) => `${dir}/**`), 'src/proxy.test.ts'];

export default defineConfig({
  plugins: [react()],
  test: {
    projects: [
      {
        test: {
          name: 'node',
          environment: 'node',
          include: nodeIncludes,
        },
      },
      {
        test: {
          name: 'jsdom',
          environment: 'jsdom',
          include: ['src/**/*.test.{ts,tsx}'],
          exclude: [...configDefaults.exclude, ...nodeExcludes],
          setupFiles: ['./vitest.setup.ts'],
        },
      },
    ],
    environment: 'jsdom',
    environmentOptions: {
      jsdom: { pretendToBeVisual: true }, // provides requestAnimationFrame
    },
    setupFiles: ['./vitest.setup.ts'],
    clearMocks: true, // reset call history of ALL vi.fn (incl. setup-file mocks) each test
    unstubEnvs: true, // auto-revert vi.stubEnv between tests
    unstubGlobals: true, // auto-revert vi.stubGlobal between tests
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'json'],
      include: ['src/**/*.{js,jsx,ts,tsx}'],
    },
    testTimeout: 10000,
  },
  resolve: {
    tsconfigPaths: true,
    alias: {
      'server-only': fileURLToPath(new URL('./bin/empty-stub.ts', import.meta.url)),
      'client-only': fileURLToPath(new URL('./bin/empty-stub.ts', import.meta.url)),
      devbug: fileURLToPath(new URL('./bin/devbug-stub.ts', import.meta.url)),
      'devbug/lib/index.js': fileURLToPath(new URL('./bin/devbug-stub.ts', import.meta.url)),
    },
  },
});
