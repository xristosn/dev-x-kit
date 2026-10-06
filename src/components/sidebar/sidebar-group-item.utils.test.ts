import { describe, expect, it } from 'vitest';
import { isDescendantActive, testIdSegment } from './sidebar-group-item.utils';

describe('sidebar-group-item.utils', () => {
  describe('testIdSegment', () => {
    it.each([
      ['/JSON to YAML', 'json-to-yaml'],
      ['Data & formats!', 'data-formats'],
      ['', ''],
    ])('normalizes %s to %s', (value, expected) => {
      expect(testIdSegment(value)).toBe(expected);
    });
  });

  describe('isDescendantActive', () => {
    it('matches a route at the current path and its descendants', () => {
      expect(isDescendantActive({ label: 'JSON', path: '/json' }, '/json')).toBe(true);
      expect(isDescendantActive({ label: 'JSON', path: '/json' }, '/json/format')).toBe(true);
    });

    it('finds a matching route through nested groups', () => {
      const item = {
        label: 'Converters',
        items: [
          {
            label: 'Data formats',
            items: [{ label: 'JSON to YAML', path: '/converters/json-to-yaml' }],
          },
        ],
      };

      expect(isDescendantActive(item, '/converters/json-to-yaml')).toBe(true);
    });

    it('returns false when no route matches', () => {
      expect(isDescendantActive({ label: 'JSON', path: '/json' }, '/yaml')).toBe(false);
      expect(isDescendantActive({ label: 'Pathless', path: undefined }, '/yaml')).toBe(false);
      expect(isDescendantActive({ label: 'Pathless' }, '/yaml')).toBe(false);
    });
  });
});
