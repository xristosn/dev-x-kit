import { describe, expect, test } from 'vitest';
import type { NavigationGroup } from '@/types/navigation';
import { NAVIGATION } from './navigation';
import { NavigationManager } from './utils';

describe('utils.ts', () => {
  describe('NavigationManager', () => {
    test('sorts items naturally and case-insensitively, with todo items last', () => {
      const groups: NavigationGroup[] = [
        {
          label: 'Tools',
          items: [
            { label: 'Tool 10', path: '/tool-10' },
            { label: 'tool 2', path: '/tool-2' },
            { label: 'alpha', path: '/alpha' },
            { label: 'Beta', path: '/beta', todo: true },
          ],
        },
      ];

      const manager = new NavigationManager(groups);

      expect(manager.getGroups()[0].items?.map((item) => item.label)).toEqual([
        'alpha',
        'tool 2',
        'Tool 10',
        'Beta',
      ]);
    });

    test('inherits parent categories while preserving explicit child categories', () => {
      const groups: NavigationGroup[] = [
        {
          label: 'Colors',
          categories: ['Colors'],
          items: [
            { label: 'Palette', path: '/palette' },
            { label: 'Contrast', path: '/contrast', categories: ['Utilities'] },
          ],
        },
      ];

      const manager = new NavigationManager(groups);
      const items = manager.getGroups()[0].items ?? [];

      expect(items.find((item) => item.label === 'Palette')?.categories).toEqual(['Colors']);
      expect(items.find((item) => item.label === 'Contrast')?.categories).toEqual(['Utilities']);
      expect(manager.getItemByPath('/palette')?.categories).toEqual(['Colors']);
    });

    test('indexes valid routes and returns searchable routes with defaults', () => {
      const groups: NavigationGroup[] = [
        {
          label: 'Tools',
          items: [
            { label: 'JSON Formatter', path: '/json' },
            { label: 'Todo Tool', path: '/todo', todo: true },
            { label: 'Empty Group', items: [{ label: 'Nested Tool', path: '/nested' }] },
          ],
        },
      ];

      const manager = new NavigationManager(groups);

      expect(manager.getItemByPath('/json')).toMatchObject({
        label: 'JSON Formatter',
        path: '/json',
        fullName: 'JSON Formatter',
        tags: [],
        summary: '',
        todo: false,
        sourceUrl: '',
      });
      expect(manager.getItemByPath('/todo')).toBeUndefined();
      expect(manager.getItemByPath('/missing')).toBeUndefined();
      expect(manager.getSearchableItems().map((item) => item.path)).toEqual(['/json', '/nested']);
    });

    test('searches labels, full names, and tags without regard to case', () => {
      const groups: NavigationGroup[] = [
        {
          label: 'Tools',
          items: [
            {
              label: 'JSON Formatter',
              fullName: 'JavaScript Object Notation Formatter',
              path: '/json',
              tags: ['pretty print'],
            },
          ],
        },
      ];
      const manager = new NavigationManager(groups);

      expect(manager.fuzzySearch('  FORMATTER  ').map((item) => item.path)).toEqual(['/json']);
      expect(manager.fuzzySearch('object notation').map((item) => item.path)).toEqual(['/json']);
      expect(manager.fuzzySearch('PRETTY PRINT').map((item) => item.path)).toEqual(['/json']);
    });

    test('returns no search results for empty or whitespace-only queries', () => {
      const groups: NavigationGroup[] = [
        { label: 'Tools', items: [{ label: 'JSON Formatter', path: '/json' }] },
      ];
      const manager = new NavigationManager(groups);

      expect(manager.fuzzySearch('')).toEqual([]);
      expect(manager.fuzzySearch('   ')).toEqual([]);
    });

    test('returns linked ancestor breadcrumbs for a route and finds its landing group', () => {
      const groups: NavigationGroup[] = [
        {
          label: 'Convert',
          path: '/convert',
          items: [
            {
              label: 'SCSS',
              path: '/convert/scss',
              items: [{ label: 'to Javascript', path: '/convert/scss/js' }],
            },
          ],
        },
      ];
      const manager = new NavigationManager(groups);

      expect(manager.getBreadcrumbsByPath('/convert/scss/js')).toEqual([
        { label: 'Home', href: '/' },
        { label: 'Convert', href: '/convert' },
        { label: 'SCSS', href: '/convert/scss' },
        { label: 'to Javascript' },
      ]);
      expect(manager.getGroupByPath('/convert/scss')).toMatchObject({ label: 'SCSS' });
    });

    test('provides linked Home and category breadcrumbs for tool routes', () => {
      expect(NAVIGATION.getBreadcrumbsByPath('/color-tools/color-picker')).toEqual([
        { label: 'Home', href: '/' },
        { label: 'Color Tools', href: '/color-tools' },
        { label: 'Color Picker' },
      ]);
      expect(NAVIGATION.getBreadcrumbsByPath('/css-tools/css-triangle')).toEqual([
        { label: 'Home', href: '/' },
        { label: 'CSS Tools', href: '/css-tools' },
        { label: 'CSS Triangle' },
      ]);
      expect(NAVIGATION.getBreadcrumbsByPath('/image-tools/image-resizer')).toEqual([
        { label: 'Home', href: '/' },
        { label: 'Image Tools', href: '/image-tools' },
        { label: 'Image Resizer' },
      ]);
      expect(NAVIGATION.getGroupByPath('/color-tools')).toBeDefined();
      expect(NAVIGATION.getGroupByPath('/css-tools')).toBeDefined();
      expect(NAVIGATION.getGroupByPath('/image-tools')).toBeDefined();
    });

    test('returns breadcrumbs for a group landing page with the group as current', () => {
      expect(NAVIGATION.getBreadcrumbsByPath('/color-tools')).toEqual([
        { label: 'Home', href: '/' },
        { label: 'Color Tools' },
      ]);
    });

    test('keeps pathless group ancestors as text-only breadcrumbs', () => {
      const manager = new NavigationManager([
        {
          label: 'Unlinked group',
          items: [{ label: 'Linked tool', path: '/linked-tool' }],
        },
      ]);

      expect(manager.getBreadcrumbsByPath('/linked-tool')).toEqual([
        { label: 'Home', href: '/' },
        { label: 'Unlinked group' },
        { label: 'Linked tool' },
      ]);
    });

    test('returns a text-only Home-first breadcrumb for unknown paths', () => {
      const breadcrumbs = NAVIGATION.getBreadcrumbsByPath('/unknown-tools/gradient-editor');

      expect(breadcrumbs).toEqual([
        { label: 'Home' },
        { label: 'Unknown Tools' },
        { label: 'Gradient Editor' },
      ]);
      expect(breadcrumbs.every((breadcrumb) => !breadcrumb.href)).toBe(true);
    });

    test('normalizes trailing slashes and handles empty and root paths', () => {
      expect(NAVIGATION.getBreadcrumbsByPath('/color-tools/')).toEqual(
        NAVIGATION.getBreadcrumbsByPath('/color-tools')
      );
      expect(NAVIGATION.getBreadcrumbsByPath('')).toEqual([]);
      expect(NAVIGATION.getBreadcrumbsByPath('/')).toEqual([{ label: 'Home' }]);
    });

    test('provides valid landing-page links for converter and Markdown Editor breadcrumbs', () => {
      const tools = NAVIGATION.getSearchableItems().filter(
        (item) => item.path.startsWith('/convert/') || item.path === '/other-tools/markdown-editor'
      );

      expect(tools.filter((item) => item.path.startsWith('/convert/'))).toHaveLength(48);

      for (const tool of tools) {
        const breadcrumbs = NAVIGATION.getBreadcrumbsByPath(tool.path);
        const ancestorBreadcrumbs = breadcrumbs.slice(1, -1);

        expect(breadcrumbs[0]).toEqual({ label: 'Home', href: '/' });
        expect(breadcrumbs.at(-1)?.label).toBe(tool.label);
        expect(ancestorBreadcrumbs.length).toBeGreaterThan(0);

        for (const breadcrumb of ancestorBreadcrumbs) {
          expect(breadcrumb.href).toBeTruthy();
          expect(NAVIGATION.getGroupByPath(breadcrumb.href!)).toBeDefined();
        }
      }
    });

    test('flattens direct and nested routes while excluding todo routes', () => {
      const groups: NavigationGroup[] = [
        {
          label: 'Root',
          items: [
            { label: 'Direct Route', path: '/direct' },
            { label: 'Todo Route', path: '/todo', todo: true },
            { label: 'Empty Group', items: [] },
            {
              label: 'Nested',
              items: [
                { label: 'Nested Route', path: '/nested' },
                {
                  label: 'Deeply Nested',
                  items: [{ label: 'Deep Route', path: '/deep' }],
                },
              ],
            },
          ],
        },
      ];
      const manager = new NavigationManager(groups);

      const flattened = manager.getGroupFlatRouteItems();

      expect(flattened.map((group) => group.label)).toEqual(['Root', 'Nested', 'Deeply Nested']);
      expect(flattened.map((group) => group.items.map((item) => item.path))).toEqual([
        ['/direct'],
        ['/nested'],
        ['/deep'],
      ]);
    });
  });
});
