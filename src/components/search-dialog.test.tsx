import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, test, vi, beforeEach, afterEach } from 'vitest';
import { SearchDialog } from './search-dialog';

vi.mock('@/hooks/use-mobile', () => ({ useIsMobile: () => false }));

describe('<SearchDialog />', () => {
  beforeEach(() => {
    vi.stubGlobal('navigator', { clipboard: { writeText: vi.fn() } });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  describe('rendering', () => {
    test('renders trigger button', () => {
      render(<SearchDialog />);
      expect(screen.getByTestId('search-dialog-trigger')).toBeInTheDocument();
    });
  });

  describe('interaction', () => {
    async function setup() {
      const user = userEvent.setup();
      render(<SearchDialog />);
      await user.click(screen.getByTestId('search-dialog-trigger'));
      return { user, input: screen.getByTestId('search-dialog-input') };
    }

    test('clicking trigger opens dialog', async () => {
      const user = userEvent.setup();
      render(<SearchDialog />);
      await user.click(screen.getByTestId('search-dialog-trigger'));
      expect(screen.getByTestId('search-dialog-input')).toBeInTheDocument();
    });

    test('Ctrl+K opens dialog', async () => {
      const user = userEvent.setup();
      render(<SearchDialog />);
      await user.keyboard('{Control>}k{/Control}');
      expect(screen.getByTestId('search-dialog-input')).toBeInTheDocument();
    });

    test.each(['json', 'JSON', '  json  '])(
      'query "%s" shows matching tools and excludes unrelated tools',
      async (query) => {
        const { user, input } = await setup();
        const initialPaths = screen
          .getAllByTestId('search-dialog-result')
          .map((result) => result.getAttribute('href'));
        expect(initialPaths).toContain('/other-tools/uuid-generator');

        await user.type(input, query);

        const paths = screen
          .getAllByTestId('search-dialog-result')
          .map((result) => result.getAttribute('href'));
        expect(paths).toEqual(
          expect.arrayContaining(['/convert/json/typescript', '/convert/json/json-schema'])
        );
        expect(paths).not.toContain('/other-tools/uuid-generator');
      }
    );

    test('an unmatched query shows no results', async () => {
      const { user, input } = await setup();
      expect(screen.getAllByTestId('search-dialog-result').length).toBeGreaterThan(0);

      await user.type(input, 'zzzz-no-matching-tool');

      expect(screen.queryAllByTestId('search-dialog-result')).toHaveLength(0);
    });

    test('clearing the query restores all tools', async () => {
      const { user, input } = await setup();
      const initialPaths = screen
        .getAllByTestId('search-dialog-result')
        .map((result) => result.getAttribute('href'));
      await user.type(input, 'zzzz-no-matching-tool');
      expect(screen.queryAllByTestId('search-dialog-result')).toHaveLength(0);

      await user.clear(input);

      const restoredPaths = screen
        .getAllByTestId('search-dialog-result')
        .map((result) => result.getAttribute('href'));
      expect(restoredPaths).toEqual(initialPaths);
    });

    test('Escape closes dialog', async () => {
      const user = userEvent.setup();
      render(<SearchDialog />);
      await user.click(screen.getByTestId('search-dialog-trigger'));
      await user.keyboard('{Escape}');
      expect(screen.queryByTestId('search-dialog-input')).not.toBeInTheDocument();
    });

    test('ArrowDown from input focuses first result', async () => {
      const user = userEvent.setup();
      render(<SearchDialog />);
      await user.click(screen.getByTestId('search-dialog-trigger'));
      const input = screen.getByTestId('search-dialog-input');
      await user.type(input, 'a');
      const results = await screen.findAllByTestId('search-dialog-result');
      expect(results.length).toBeGreaterThan(0);
      await user.keyboard('{ArrowDown}');
      expect(results[0]).toHaveFocus();
    });

    test('clicking result closes dialog', async () => {
      const user = userEvent.setup();
      render(<SearchDialog />);
      await user.click(screen.getByTestId('search-dialog-trigger'));
      const input = screen.getByTestId('search-dialog-input');
      await user.type(input, 'json');
      const results = await screen.findAllByTestId('search-dialog-result');
      expect(results.length).toBeGreaterThan(0);
      await user.click(results[0]);
      expect(screen.queryByTestId('search-dialog-input')).not.toBeInTheDocument();
    });
  });
});
