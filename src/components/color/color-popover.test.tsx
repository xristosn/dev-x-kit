import { describe, expect, test, vi, beforeEach, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ColorPopover } from './color-popover';
import { Providers } from '../providers';

vi.mock('react-color-palette');

// Mock next-themes
vi.mock('next-themes');

describe('<ColorPopover />', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    window.localStorage.clear();
  });

  afterEach(() => {
    window.localStorage.clear();
  });

  const renderPopover = (extra: Partial<React.ComponentProps<typeof ColorPopover>> = {}) => {
    const setValue = vi.fn();
    const initialColor = '#3B82F6';

    render(
      <Providers>
        <ColorPopover value={initialColor} setValue={setValue} {...extra} />
      </Providers>
    );

    return {
      user: userEvent.setup(),
      setValue,
      initialColor,
    };
  };

  describe('rendering', () => {
    test('renders label when provided', () => {
      renderPopover({ label: 'Pick a color' });
      expect(screen.getByTestId('color-popover-label')).toHaveTextContent('Pick a color');
    });

    test('renders color preview swatch with correct background', () => {
      renderPopover();
      const swatch = screen.getByTestId('color-popover-preview');
      expect(swatch).toHaveStyle({ backgroundColor: '#3B82F6' });
    });

    test('renders input with hex value by default', () => {
      renderPopover();
      const input = screen.getByTestId('color-popover-input');
      expect(input).toHaveValue('#3b82f6');
    });
  });

  describe('popover open/close', () => {
    test('opens popover when trigger is clicked', async () => {
      const { user } = renderPopover();
      const input = screen.getByTestId('color-popover-input');
      await user.click(input);
      expect(screen.getByTestId('color-popover-content')).toBeInTheDocument();
    });

    test('closes popover when clicking outside', async () => {
      const { user } = renderPopover();
      const input = screen.getByTestId('color-popover-input');
      await user.click(input);
      expect(screen.getByTestId('color-popover-content')).toBeInTheDocument();

      await user.click(document.body);
      expect(screen.queryByTestId('color-popover-content')).not.toBeInTheDocument();
    });
  });

  describe('color mode switching', () => {
    test('renders with defaultMode hex', () => {
      renderPopover({ defaultMode: 'hex' });
      const input = screen.getByTestId('color-popover-input');
      expect(input).toHaveValue('#3b82f6');
    });

    test('renders with defaultMode rgb', () => {
      renderPopover({ defaultMode: 'rgb' });
      const input = screen.getByTestId('color-popover-input');
      expect(input).toHaveValue('rgb(59, 130, 246)');
    });

    test('renders with defaultMode hsv', () => {
      renderPopover({ defaultMode: 'hsv' });
      const input = screen.getByTestId('color-popover-input');
      expect(input).toHaveValue('hsv(217.22, 76.02, 96.47, 1)');
    });
  });

  describe('recent colors', () => {
    test('renders recent color swatches when stored', async () => {
      window.localStorage.setItem(
        'recent-colors',
        JSON.stringify(['#FF0000', '#00FF00', '#0000FF'])
      );
      const { user } = renderPopover();
      const input = screen.getByTestId('color-popover-input');
      await user.click(input);
      expect(screen.getByTestId('color-popover-recent-colors')).toBeInTheDocument();
    });

    test('clicking a recent color sets it via setValue', async () => {
      window.localStorage.setItem(
        'recent-colors',
        JSON.stringify(['#FF0000', '#00FF00', '#0000FF'])
      );
      const { user, setValue } = renderPopover();
      const input = screen.getByTestId('color-popover-input');
      await user.click(input);
      expect(screen.getByTestId('color-popover-recent-colors')).toBeInTheDocument();
      const redSwatch = screen.getByTestId('color-popover-recent-color-ff0000');
      await user.click(redSwatch);
      expect(setValue).toHaveBeenCalled();
    });
  });
});
