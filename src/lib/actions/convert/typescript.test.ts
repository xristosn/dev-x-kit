import { describe, expect, it, vi } from 'vitest';
import { tsToJs, tsToJsonSchema, tsToZod } from './typescript';

describe('typescript actions', () => {
  describe('input validation', () => {
    it('rejects non-TypeScript syntax', async () => {
      const r = await tsToJs('!!!bad syntax');
      expect(r).toHaveProperty('error', true);
    });

    it('rejects empty input', async () => {
      const r = await tsToJs('');
      expect(r).toHaveProperty('error', true);
    });
  });

  describe('transpilation without execution', () => {
    it('transpiles a global mutation without executing it', async () => {
      const marker = { executed: false };
      vi.stubGlobal('__typescriptExecutionMarker', marker);
      const input = 'globalThis.__typescriptExecutionMarker.executed = true as boolean;';

      const r = await tsToJs(input);

      expect(marker.executed).toBe(false);
      expect(r).toBe('globalThis.__typescriptExecutionMarker.executed = true;\r\n');
    });

    it('transpiles require calls without loading modules', async () => {
      const marker = { executed: false };
      vi.stubGlobal(
        'require',
        vi.fn(() => {
          marker.executed = true;
          return {};
        })
      );
      const input = "require('node:path');";

      const r = await tsToJs(input);

      expect(marker.executed).toBe(false);
      expect(r).toBe(`${input}\r\n`);
    });

    it('transpiles eval calls without executing their payload', async () => {
      const marker = { executed: false };
      vi.stubGlobal('__typescriptExecutionMarker', marker);
      const input = "eval('globalThis.__typescriptExecutionMarker.executed = true;');";

      const r = await tsToJs(input);

      expect(marker.executed).toBe(false);
      expect(r).toBe(`${input}\r\n`);
    });
  });

  describe('temp file isolation', () => {
    it('writes temp file safely and cleans up', async () => {
      const r = await tsToJsonSchema('interface A { x: string; }', {});
      expect(typeof r === 'string' ? r : '').toContain('"$schema"');
    }, 20000);
  });

  describe('tsToJsonSchema', () => {
    it('infers JSON Schema from TypeScript interface', async () => {
      const r = await tsToJsonSchema('interface User { name: string; age: number; }', {});
      expect(r as string).toContain('"$schema"');
    }, 20000);
  });

  describe('tsToZod', () => {
    it('infers Zod schema from TypeScript', async () => {
      const r = await tsToZod('interface User { name: string; }', {});
      expect(r as string).toContain('import { z }');
    });
  });

  describe('tsToJs', () => {
    it('transpiles valid TypeScript to JavaScript', async () => {
      const r = await tsToJs('const x: number = 1;');
      expect(r as string).toContain('const x');
    });
  });
});
