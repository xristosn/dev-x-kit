import { describe, expect, it } from 'vitest';
import { svgToDataURI, svgToOptimized, svgToReact } from './svg';

describe('svg actions', () => {
  describe('svgToReact', () => {
    it('converts valid SVG to React component', async () => {
      const r = await svgToReact(
        '<svg xmlns="http://www.w3.org/2000/svg"><circle cx="10" cy="10" r="8"/></svg>',
        {}
      );
      expect(r as string).toContain('import * as React');
      expect(r as string).toContain('const MyComponent');
      expect(r as string).toContain('<circle');
      expect(r as string).toContain('cx={10}');
      expect(r as string).toContain('cy={10}');
      expect(r as string).toContain('r={8}');
    });

    it('returns ActionError for non-SVG input', async () => {
      const r = await svgToReact('hello', {});
      expect(r).toHaveProperty('error', true);
    });
  });

  describe('svgToOptimized', () => {
    it('optimizes SVG with SVGO', async () => {
      const r = await svgToOptimized(
        '<svg xmlns="http://www.w3.org/2000/svg"><circle cx="10" cy="10" r="8"/></svg>',
        {}
      );
      expect(r as string).toContain('<svg');
      expect(r as string).toContain('<circle');
      expect(r as string).toContain('cx="10"');
      expect(r as string).toContain('cy="10"');
      expect(r as string).toContain('r="8"');
    });
  });

  describe('svgToDataURI', () => {
    it('encodes SVG to base64 data URI', async () => {
      const r = await svgToDataURI(
        '<svg xmlns="http://www.w3.org/2000/svg"><circle cx="10" cy="10" r="8"/></svg>'
      );
      expect(r as string).toMatch(/^data:image\/svg\+xml;base64,/);
      const payload = (r as string).replace(/^data:image\/svg\+xml;base64,/, '');
      expect(Buffer.from(payload, 'base64').toString()).toBe(
        '<svg xmlns="http://www.w3.org/2000/svg"><circle cx="10" cy="10" r="8"/></svg>'
      );
    });

    it('returns ActionError for non-SVG input', async () => {
      const r = await svgToDataURI('not svg');
      expect(r).toHaveProperty('error', true);
    });
  });
});
