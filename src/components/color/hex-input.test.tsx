import { describe, expect, test, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { HexInput } from './hex-input';
import { type IColor } from 'react-color-palette';

const initialColor: IColor = {
  hex: '#3B82F6',
  rgb: { r: 59, g: 130, b: 246, a: 1 },
  hsv: { h: 217, s: 75, v: 96, a: 1 },
};

describe('<HexInput />', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('renders input with initial hex value', () => {
    const setValue = vi.fn();
    render(<HexInput value={initialColor} setValue={setValue} />);

    const input = screen.getByTestId('hex-input');
    expect(input).toHaveValue('#3B82F6');
    expect(input).toHaveAttribute('placeholder', '#RRGGBB or #RGB');
  });

  test('renders label by default', () => {
    render(<HexInput value={initialColor} setValue={vi.fn()} />);
    expect(screen.getByTestId('hex-input-label')).toHaveTextContent('HEX');
  });

  test('hides label when noLabel is true', () => {
    render(<HexInput value={initialColor} setValue={vi.fn()} noLabel />);
    expect(screen.queryByTestId('hex-input-label')).not.toBeInTheDocument();
  });

  describe('input editing', () => {
    test('passes the converted color to setValue when valid hex is entered', () => {
      const setValue = vi.fn();
      render(<HexInput value={initialColor} setValue={setValue} />);

      const input = screen.getByTestId('hex-input');
      fireEvent.change(input, { target: { value: '#AABBCC' } });

      expect(setValue).toHaveBeenCalledWith(
        expect.objectContaining({
          hex: '#AABBCC',
          rgb: { r: 170, g: 187, b: 204, a: 1 },
          hsv: expect.objectContaining({
            h: expect.any(Number),
            s: expect.any(Number),
            v: expect.any(Number),
            a: 1,
          }),
        })
      );
    });

    test('adds # prefix if missing', () => {
      const setValue = vi.fn();
      render(<HexInput value={initialColor} setValue={setValue} />);

      const input = screen.getByTestId('hex-input');
      fireEvent.change(input, { target: { value: 'AABBCC' } });

      expect(setValue).toHaveBeenCalledWith(
        expect.objectContaining({
          hex: '#AABBCC',
          rgb: { r: 170, g: 187, b: 204, a: 1 },
          hsv: expect.objectContaining({
            h: expect.any(Number),
            s: expect.any(Number),
            v: expect.any(Number),
            a: 1,
          }),
        })
      );
    });

    test('does not call setValue for invalid hex (shows error instead)', () => {
      const setValue = vi.fn();
      render(<HexInput value={initialColor} setValue={setValue} />);

      const input = screen.getByTestId('hex-input');
      fireEvent.change(input, { target: { value: 'ZZZZ' } });

      expect(setValue).not.toHaveBeenCalled();
    });

    test('shows error indicator for invalid hex', () => {
      render(<HexInput value={initialColor} setValue={vi.fn()} />);

      const input = screen.getByTestId('hex-input');
      fireEvent.change(input, { target: { value: 'INVALID' } });

      expect(screen.getByTestId('hex-error-btn')).toBeInTheDocument();
    });

    test('accepts 3-digit shorthand hex', () => {
      const setValue = vi.fn();
      render(<HexInput value={initialColor} setValue={setValue} />);

      const input = screen.getByTestId('hex-input');
      fireEvent.change(input, { target: { value: '#ABC' } });

      expect(setValue).toHaveBeenCalledWith(
        expect.objectContaining({
          hex: '#AABBCC',
          rgb: expect.objectContaining({
            r: 170,
            g: 187,
            b: 204,
            a: expect.any(Number),
          }),
          hsv: expect.objectContaining({
            h: expect.any(Number),
            s: expect.any(Number),
            v: expect.any(Number),
            a: expect.any(Number),
          }),
        })
      );
    });

    test('accepts 8-digit hex with alpha', () => {
      const setValue = vi.fn();
      render(<HexInput value={initialColor} setValue={setValue} />);

      const input = screen.getByTestId('hex-input');
      fireEvent.change(input, { target: { value: '#AABBCCDD' } });

      expect(setValue).toHaveBeenCalledWith(
        expect.objectContaining({
          hex: '#AABBCCDD',
          rgb: expect.objectContaining({
            r: 170,
            g: 187,
            b: 204,
            a: expect.any(Number),
          }),
          hsv: expect.objectContaining({
            h: expect.any(Number),
            s: expect.any(Number),
            v: expect.any(Number),
            a: expect.any(Number),
          }),
        })
      );
    });
  });

  describe('blur behavior', () => {
    test('calls setValue with current value on blur when valid', () => {
      const setValue = vi.fn();
      render(<HexInput value={initialColor} setValue={setValue} />);

      const input = screen.getByTestId('hex-input');
      fireEvent.change(input, { target: { value: '#112233' } });
      fireEvent.blur(input);

      expect(setValue).toHaveBeenCalled();
    });

    test('does not call setValue on blur when error is set', () => {
      const setValue = vi.fn();
      render(<HexInput value={initialColor} setValue={setValue} />);

      const input = screen.getByTestId('hex-input');
      fireEvent.change(input, { target: { value: 'INVALID' } });
      setValue.mockClear();

      fireEvent.blur(input);

      expect(setValue).not.toHaveBeenCalled();
    });
  });

  describe('external value changes', () => {
    test('updates input value when prop value changes', () => {
      const { rerender } = render(<HexInput value={initialColor} setValue={vi.fn()} />);

      const newColor: IColor = {
        hex: '#FF0000',
        rgb: { r: 255, g: 0, b: 0, a: 1 },
        hsv: { h: 0, s: 100, v: 100, a: 1 },
      };

      rerender(<HexInput value={newColor} setValue={vi.fn()} />);

      expect(screen.getByTestId('hex-input')).toHaveValue('#FF0000');
    });
  });
});
