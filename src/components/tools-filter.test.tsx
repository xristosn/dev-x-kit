import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, test } from 'vitest';
import ToolsFilter from './tools-filter';
import type { NavigationRouteItem } from '@/types/navigation';

const mockTools: NavigationRouteItem[] = [
  {
    path: '/json',
    label: 'JSON',
    fullName: 'JSON Formatter',
    summary: 'Format JSON data.',
    categories: ['Data Converters'],
  },
  {
    path: '/base64',
    label: 'Base64',
    fullName: 'Base64 Encoder',
    summary: 'Encode to Base64.',
    categories: ['Data Converters'],
  },
  {
    path: '/css',
    label: 'CSS',
    fullName: 'CSS Minifier',
    summary: 'Minify CSS.',
    categories: ['CSS'],
  },
];

describe('<ToolsFilter />', () => {
  describe('rendering', () => {
    test('renders section and filter tabs after hydration', () => {
      render(<ToolsFilter initialTools={mockTools} initialFilter={null} />);
      expect(screen.getByTestId('tools-filter')).toBeInTheDocument();
      expect(screen.getByTestId('filter-tabs')).toBeInTheDocument();
      expect(screen.getByTestId('filter-pill-all-tools')).toBeInTheDocument();
      expect(screen.queryByTestId('filter-skeleton')).not.toBeInTheDocument();
    });

    test('shows all tool cards initially', () => {
      render(<ToolsFilter initialTools={mockTools} initialFilter={null} />);
      expect(screen.getByTestId('tool-card--json')).toBeInTheDocument();
      expect(screen.getByTestId('tool-card--base64')).toBeInTheDocument();
      expect(screen.getByTestId('tool-card--css')).toBeInTheDocument();
      expect(screen.getByTestId('tools-count')).toHaveTextContent('3 tools');
    });

    test('renders with initial filter applied', () => {
      render(<ToolsFilter initialTools={mockTools} initialFilter="CSS" />);
      expect(screen.getByTestId('tool-card--css')).toBeInTheDocument();
      expect(screen.queryByTestId('tool-card--json')).not.toBeInTheDocument();
      expect(screen.getByTestId('tools-count')).toHaveTextContent('1 tools');
    });
  });

  describe('interaction', () => {
    test('clicking category pill filters cards', async () => {
      const user = userEvent.setup();
      render(<ToolsFilter initialTools={mockTools} initialFilter={null} />);

      await user.click(screen.getByTestId('filter-pill-data-converters'));
      expect(screen.getByTestId('tool-card--json')).toBeInTheDocument();
      expect(screen.getByTestId('tool-card--base64')).toBeInTheDocument();
      expect(screen.queryByTestId('tool-card--css')).not.toBeInTheDocument();
      expect(screen.getByTestId('tools-count')).toHaveTextContent('2 tools');
    });

    test('clicking all tools resets filter', async () => {
      const user = userEvent.setup();
      render(<ToolsFilter initialTools={mockTools} initialFilter="CSS" />);

      await user.click(screen.getByTestId('filter-pill-all-tools'));
      expect(screen.getByTestId('tool-card--json')).toBeInTheDocument();
      expect(screen.getByTestId('tool-card--css')).toBeInTheDocument();
      expect(screen.getByTestId('tools-count')).toHaveTextContent('3 tools');
    });

    test('shows active pill state for selected category', async () => {
      const user = userEvent.setup();
      render(<ToolsFilter initialTools={mockTools} initialFilter={null} />);

      await user.click(screen.getByTestId('filter-pill-colors'));
      expect(screen.getByTestId('filter-pill-colors')).toHaveAttribute('aria-pressed', 'true');
      expect(screen.getByTestId('filter-pill-all-tools')).toHaveAttribute('aria-pressed', 'false');
    });
  });
});
