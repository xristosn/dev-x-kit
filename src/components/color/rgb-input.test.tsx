import { describe, expect, test, vi, beforeEach } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { RGBInput } from './rgb-input';
import { type IColor } from 'react-color-palette';

vi.mock('react-color-palette');

const initialColor: IColor = {
  hex: '#3B82F6',
  rgb: { r: 59, g: 130, b: 246, a: 1 },
  hsv: { h: 217, s: 75, v: 96, a: 1 },
};

describe('<RGBInput />', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('renders inputs with initial RGB values', () => {
    render(<RGBInput value={initialColor} setValue={vi.fn()} />);
    expect(screen.getByTestId('rgb-input-r')).toHaveValue(59);
    expect(screen.getByTestId('rgb-input-g')).toHaveValue(130);
    expect(screen.getByTestId('rgb-input-b')).toHaveValue(246);
    expect(screen.getByTestId('rgb-input-a')).toHaveValue(1);
  });

  test('renders label by default', () => {
    render(<RGBInput value={initialColor} setValue={vi.fn()} />);
    expect(screen.getByTestId('rgb-input-label')).toHaveTextContent('RGB');
  });

  test('hides label when noLabel is true', () => {
    render(<RGBInput value={initialColor} setValue={vi.fn()} noLabel />);
    expect(screen.queryByTestId('rgb-input-label')).not.toBeInTheDocument();
  });

  test('rejects RGB values outside the supported range', () => {
    const setValue = vi.fn();
    render(<RGBInput value={initialColor} setValue={setValue} />);

    fireEvent.change(screen.getByTestId('rgb-input-r'), { target: { value: '-1' } });

    expect(setValue).not.toHaveBeenCalled();
    expect(screen.getByTestId('hex-error-btn')).toBeInTheDocument();
  });

  describe('clamping', () => {
    test('clamps red above 255', async () => {
      const setValue = vi.fn();
      render(<RGBInput value={initialColor} setValue={setValue} />);

      const input = screen.getByTestId('rgb-input-r');
      await userEvent.setup().click(input);
      await userEvent.clear(input);
      await userEvent.type(input, '300');

      expect(setValue).toHaveBeenCalled();
    });

    test('clamps green above 255', async () => {
      const setValue = vi.fn();
      render(<RGBInput value={initialColor} setValue={setValue} />);

      const input = screen.getByTestId('rgb-input-g');
      await userEvent.setup().click(input);
      await userEvent.clear(input);
      await userEvent.type(input, '400');

      expect(setValue).toHaveBeenCalled();
    });
  });

  describe('alpha field', () => {
    test('renders alpha input by default', () => {
      render(<RGBInput value={initialColor} setValue={vi.fn()} />);
      expect(screen.getByTestId('rgb-input-a')).toBeInTheDocument();
    });

    test('hides alpha input when disableAlpha is true', () => {
      const { rerender } = render(<RGBInput value={initialColor} setValue={vi.fn()} />);
      expect(screen.getByTestId('rgb-input-a')).toBeInTheDocument();

      rerender(<RGBInput value={initialColor} setValue={vi.fn()} disableAlpha />);
      expect(screen.queryByTestId('rgb-input-a')).not.toBeInTheDocument();
    });
  });

  describe('blur behavior', () => {
    test('calls setValue with converted color on blur', async () => {
      const setValue = vi.fn();
      render(<RGBInput value={initialColor} setValue={setValue} />);

      const input = screen.getByTestId('rgb-input-r');
      await userEvent.setup().click(input);
      await userEvent.clear(input);
      await userEvent.type(input, '100');
      await userEvent.tab();

      expect(setValue).toHaveBeenCalled();
    });
  });

  describe('external value changes', () => {
    test('updates input fields when prop changes', () => {
      const { rerender } = render(<RGBInput value={initialColor} setValue={vi.fn()} />);

      const newColor: IColor = {
        hex: '#FF0000',
        rgb: { r: 255, g: 0, b: 0, a: 1 },
        hsv: { h: 0, s: 100, v: 100, a: 1 },
      };

      rerender(<RGBInput value={newColor} setValue={vi.fn()} />);

      expect(screen.getByTestId('rgb-input-r')).toHaveValue(255);
      expect(screen.getByTestId('rgb-input-g')).toHaveValue(0);
      expect(screen.getByTestId('rgb-input-b')).toHaveValue(0);
      expect(screen.getByTestId('rgb-input-a')).toHaveValue(1);
    });
  });
});
