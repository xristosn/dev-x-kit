import { describe, expect, it } from 'vitest';
import { cssToJs, cssToScss, cssToTailwindV3 } from './css';

describe('css actions', () => {
  describe('cssToJs', () => {
    it('transforms valid CSS into a prettified JS object literal', async () => {
      const result = await cssToJs('body { color: red; }');
      expect(result).toBe("const css = {\r\n  body: {\r\n    color: 'red',\r\n  },\r\n};\r\n");
    });

    it('returns ActionError for invalid CSS', async () => {
      const result = await cssToJs('!!!invalid');
      expect(result).toMatchObject({
        error: true,
        kind: 'validation',
        code: 'INVALID_CSS',
        message: 'Input is not valid CSS.',
      });
    });
  });

  describe('cssToScss', () => {
    it('converts valid CSS to SCSS', async () => {
      const result = await cssToScss('.a { color: blue; }');
      expect(result).toBe('.a {\r\n  color: blue;\r\n}\r\n');
    });

    it('returns ActionError for invalid CSS', async () => {
      const result = await cssToScss('!!!bad');
      expect(result).toHaveProperty('error', true);
    });
  });

  describe('cssToTailwindV3', () => {
    it('translates valid CSS to Tailwind v3 classes', async () => {
      const result = await cssToTailwindV3('.x { color: #ff0000; }', {});
      expect(result).toBe('<!-- .x -->\ntext-[#ff0000]');
    });

    it('returns ActionError for invalid CSS input', async () => {
      const result = await cssToTailwindV3('!!!invalid', {});
      expect(result).toHaveProperty('error', true);
    });
  });
});
