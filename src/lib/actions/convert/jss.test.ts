import { describe, expect, it, vi } from 'vitest';
import { jssToCss, jssToScss, jssToTailwindV3 } from './jss';

describe('jss actions', () => {
  describe('rejection', () => {
    it.each([
      ['jssToCss', jssToCss],
      ['jssToScss', jssToScss],
      ['jssToTailwindV3', jssToTailwindV3],
    ] as const)('%s returns a sanitized error for invalid syntax', async (_name, convert) => {
      const result = await convert('const = {', {});

      expect(result).toMatchObject({
        error: true,
        kind: 'validation',
        code: 'INVALID_JSS',
        message: 'Input is not valid JSS.',
      });
    });

    it.each([
      ['require', 'const x = require("fs");'],
      ['process.exit', 'process.exit();'],
    ])('blocks %s without exposing server details', async (_name, input) => {
      const result = await jssToCss(input, {});

      expect(result).toMatchObject({
        error: true,
        kind: 'unexpected',
        message: 'Unable to convert input. Please check your input and try again.',
      });
      expect(result).toHaveProperty('referenceId');
    });

    it('rejects an infinite loop safely', async () => {
      const result = await jssToCss('while (true) {}', {});

      expect(result).toMatchObject({
        error: true,
        kind: 'unexpected',
        message: 'Unable to convert input. Please check your input and try again.',
      });
      expect(result).toHaveProperty('referenceId');
    }, 15000);
  });

  describe('sandbox isolation', () => {
    it('ignores injected scope variables and keeps global mutations inside the isolate', async () => {
      vi.stubGlobal('__jssScopeMarker', 'host');
      const input = `
        globalThis.__jssScopeMarker = 'sandbox';
        globalThis.scopeVariables = [{ injected: { color: 'blue' } }];
        const btn = { color: 'red' };
      `;

      const result = await jssToCss(input, {});

      expect(result).toBe('.btn {\r\n  color: red;\r\n}\r\n');
      expect(Reflect.get(globalThis, '__jssScopeMarker')).toBe('host');
    });
  });

  describe('jssToCss', () => {
    it('produces CSS declarations for valid JSS input', async () => {
      const result = await jssToCss('const btn = { color: "red", background: "blue" };', {});

      expect(result).toBe('.btn {\r\n  color: red;\r\n  background: blue;\r\n}\r\n');
    });
  });

  describe('jssToScss', () => {
    it('produces nested SCSS rules for valid JSS input', async () => {
      const result = await jssToScss(
        'const btn = { color: "red", background: "blue", "&:hover": { color: "green" } };',
        {}
      );

      expect(result).toBe(
        '.btn {\r\n  color: red;\r\n  background: blue;\r\n\r\n  &:hover {\r\n    color: green;\r\n  }\r\n}\r\n'
      );
    });
  });

  describe('jssToTailwindV3', () => {
    it('produces Tailwind utilities for valid JSS input', async () => {
      const result = await jssToTailwindV3(
        'const btn = { display: "flex", padding: 16, marginTop: 8 };',
        {}
      );

      expect(result).toBe('<!-- .btn -->\nflex p-[16px] mt-[8px]');
    });
  });
});
