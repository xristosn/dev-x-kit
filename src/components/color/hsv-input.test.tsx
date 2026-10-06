import { describe, expect, test, vi, beforeEach } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { HSVInput } from './hsv-input';
import { type IColor } from 'react-color-palette';

vi.mock('react-color-palette');

const initialColor: IColor = {
  hex: '#3B82F6',
  rgb: { r: 59, g: 130, b: 246, a: 1 },
  hsv: { h: 217, s: 75, v: 96, a: 1 },
};

describe('<HSVInput />', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('renders inputs with initial HSV values', () => {
    render(<HSVInput value={initialColor} setValue={vi.fn()} />);
    expect(screen.getByTestId('hsv-input-h')).toHaveValue(217);
    expect(screen.getByTestId('hsv-input-s')).toHaveValue(75);
    expect(screen.getByTestId('hsv-input-v')).toHaveValue(96);
    expect(screen.getByTestId('hsv-input-a')).toHaveValue(1);
  });

  test('renders label by default', () => {
    render(<HSVInput value={initialColor} setValue={vi.fn()} />);
    expect(screen.getByTestId('hsv-input-label')).toHaveTextContent('HSV');
  });

  test('hides label when noLabel is true', () => {
    render(<HSVInput value={initialColor} setValue={vi.fn()} noLabel />);
    expect(screen.queryByTestId('hsv-input-label')).not.toBeInTheDocument();
  });

  test('rejects HSV values outside the supported range', () => {
    const setValue = vi.fn();
    render(<HSVInput value={initialColor} setValue={setValue} />);

    fireEvent.change(screen.getByTestId('hsv-input-h'), { target: { value: '-1' } });

    expect(setValue).not.toHaveBeenCalled();
    expect(screen.getByTestId('hex-error-btn')).toBeInTheDocument();
  });

  describe('clamping', () => {
    test('clamps hue to 0-360', async () => {
      const setValue = vi.fn();
      render(<HSVInput value={initialColor} setValue={setValue} />);

      const input = screen.getByTestId('hsv-input-h');
      await userEvent.setup().click(input);
      await userEvent.clear(input);
      await userEvent.type(input, '400');

      expect(setValue).toHaveBeenCalled();
    });

    test('clamps saturation and value to 0-100', async () => {
      const setValue = vi.fn();
      render(<HSVInput value={initialColor} setValue={setValue} />);

      const sInput = screen.getByTestId('hsv-input-s');
      await userEvent.setup().click(sInput);
      await userEvent.clear(sInput);
      await userEvent.type(sInput, '150');

      expect(setValue).toHaveBeenCalled();

      const vInput = screen.getByTestId('hsv-input-v');
      await userEvent.setup().click(vInput);
      await userEvent.clear(vInput);
      await userEvent.type(vInput, '120');

      expect(setValue).toHaveBeenCalled();
    });
  });

  test('alpha field toggles based on disableAlpha prop', () => {
    const { rerender } = render(<HSVInput value={initialColor} setValue={vi.fn()} />);
    expect(screen.getByTestId('hsv-input-a')).toBeInTheDocument();

    rerender(<HSVInput value={initialColor} setValue={vi.fn()} disableAlpha />);
    expect(screen.queryByTestId('hsv-input-a')).not.toBeInTheDocument();
  });

  test('blur calls setValue with converted color', async () => {
    const setValue = vi.fn();
    render(<HSVInput value={initialColor} setValue={setValue} />);

    const input = screen.getByTestId('hsv-input-h');
    await userEvent.setup().click(input);
    await userEvent.clear(input);
    await userEvent.type(input, '300');
    await userEvent.tab();

    expect(setValue).toHaveBeenCalled();
  });

  test('external value changes update input fields', () => {
    const { rerender } = render(<HSVInput value={initialColor} setValue={vi.fn()} />);

    const newColor: IColor = {
      hex: '#FF0000',
      rgb: { r: 255, g: 0, b: 0, a: 1 },
      hsv: { h: 0, s: 100, v: 100, a: 1 },
    };

    rerender(<HSVInput value={newColor} setValue={vi.fn()} />);

    expect(screen.getByTestId('hsv-input-h')).toHaveValue(0);
    expect(screen.getByTestId('hsv-input-s')).toHaveValue(100);
    expect(screen.getByTestId('hsv-input-v')).toHaveValue(100);
    expect(screen.getByTestId('hsv-input-a')).toHaveValue(1);
  });
});
