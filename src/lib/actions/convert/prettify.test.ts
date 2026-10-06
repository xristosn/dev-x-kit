import { describe, expect, it, vi } from 'vitest';
import { prettifyCode } from './prettify';

describe('prettify', () => {
  describe('prettifyCode', () => {
    it('formats TypeScript with exact spacing', async () => {
      const r = await prettifyCode('const x=1;', undefined, 'typescript');
      expect(r).toBe('const x = 1;\r\n');
    });

    it('formats CSS with exact spacing when parser available', async () => {
      const r = await prettifyCode('.a{color:red}', undefined, 'css');
      expect(r).toBe('.a {\r\n  color: red;\r\n}\r\n');
    });

    it('formats YAML', async () => {
      const r = await prettifyCode('name: test', undefined, 'yaml');
      expect(r as string).toBe('name: test\r\n');
    });

    it('formats HTML', async () => {
      const r = await prettifyCode('<div>hi</div>', undefined, 'html');
      expect(r as string).toContain('<div');
    });

    it('formats Markdown', async () => {
      const r = await prettifyCode('# hi', undefined, 'markdown');
      expect(r as string).toContain('# hi');
    });

    it('formats GraphQL', async () => {
      const r = await prettifyCode('type Query { a: String }', undefined, 'graphql');
      expect(r as string).toContain('type Query');
    });

    it('does not log submitted code when formatting fails', async () => {
      const log = vi.spyOn(console, 'error').mockImplementation(() => {});

      try {
        const result = await prettifyCode('PRIVATE_CONTENT=bad{{{', undefined, 'typescript');
        expect(result).toBe('PRIVATE_CONTENT=bad{{{');
        expect(log).not.toHaveBeenCalled();
      } finally {
        log.mockRestore();
      }
    });
  });
});
