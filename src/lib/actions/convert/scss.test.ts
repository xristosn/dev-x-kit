import { describe, expect, it } from 'vitest';
import { scssToCss, scssToJs, scssToTailwindV3 } from './scss';

describe('scss actions', () => {
  describe('scssToCss', () => {
    it('compiles basic SCSS to CSS', async () => {
      const r = await scssToCss('.btn { color: red; }', {});
      expect(r as string).toContain('.btn');
      expect(r as string).toContain('color: red;');
    });

    it('returns ActionError for invalid SCSS', async () => {
      const r = await scssToCss('!!!bad {', {});
      expect(r).toHaveProperty('error', true);
    });
  });

  describe('scssToJs', () => {
    it('converts SCSS to JSX/JS', async () => {
      const r = await scssToJs('.btn { color: red; }');
      expect(r as string).toContain('const css');
      expect(r as string).toContain("'.btn'");
      expect(r as string).toContain("color: 'red'");
    });
  });

  describe('scssToTailwindV3', () => {
    it('converts SCSS to Tailwind v3', async () => {
      const r = await scssToTailwindV3('.btn { color: red; }', {});
      expect(r as string).toContain('text-[red]');
    });
  });
});
