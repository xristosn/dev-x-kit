import { describe, expect, test, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { CircularSlider } from './circular-slider';

describe('<CircularSlider />', () => {
  const mockOnChange = vi.fn();

  beforeEach(() => {
    mockOnChange.mockClear();
  });

  const mockSvgRect = (svg: SVGElement, rect: DOMRectInit) => {
    Object.defineProperty(svg, 'getBoundingClientRect', {
      value: () => rect,
      configurable: true,
    });
  };

  const defaultRect = { left: 100, top: 100, width: 200, height: 200 };

  describe('rendering', () => {
    test('displays the current value in the input', () => {
      render(<CircularSlider value={50} onChange={mockOnChange} />);
      expect(screen.getByTestId('circular-slider-input')).toHaveValue('50');
    });

    test('renders the track SVG', () => {
      render(<CircularSlider value={50} onChange={mockOnChange} />);
      expect(screen.getByTestId('circular-slider-track')).toBeInTheDocument();
    });

    test('disables the input when disabled prop is true', () => {
      render(<CircularSlider value={50} onChange={mockOnChange} disabled />);
      expect(screen.getByTestId('circular-slider-input')).toBeDisabled();
    });
  });

  describe('value display', () => {
    test('input reflects value prop changes', () => {
      const { rerender } = render(<CircularSlider value={30} onChange={mockOnChange} />);
      expect(screen.getByTestId('circular-slider-input')).toHaveValue('30');

      rerender(<CircularSlider value={70} onChange={mockOnChange} />);
      expect(screen.getByTestId('circular-slider-input')).toHaveValue('70');
    });
  });

  describe('dragging', () => {
    test('updates value when dragging on the track', () => {
      render(<CircularSlider value={50} onChange={mockOnChange} />);
      const svg = screen.getByTestId('circular-slider-track');
      mockSvgRect(svg as unknown as SVGElement, defaultRect);

      fireEvent.mouseDown(svg);
      window.dispatchEvent(new MouseEvent('mousemove', { clientX: 300, clientY: 200 }));

      expect(mockOnChange).toHaveBeenCalledWith(25);

      window.dispatchEvent(new MouseEvent('mouseup'));
    });

    test('updates value to 50 when dragging to bottom', () => {
      render(<CircularSlider value={50} onChange={mockOnChange} />);
      const svg = screen.getByTestId('circular-slider-track');
      mockSvgRect(svg as unknown as SVGElement, defaultRect);

      fireEvent.mouseDown(svg);
      window.dispatchEvent(new MouseEvent('mousemove', { clientX: 200, clientY: 300 }));

      expect(mockOnChange).toHaveBeenCalledWith(50);
      window.dispatchEvent(new MouseEvent('mouseup'));
    });

    test('does not update value when disabled', () => {
      render(<CircularSlider value={50} onChange={mockOnChange} disabled />);
      const svg = screen.getByTestId('circular-slider-track');
      mockSvgRect(svg as unknown as SVGElement, defaultRect);

      fireEvent.mouseDown(svg);
      window.dispatchEvent(new MouseEvent('mousemove', { clientX: 300, clientY: 200 }));

      expect(mockOnChange).not.toHaveBeenCalled();
      window.dispatchEvent(new MouseEvent('mouseup'));
    });
  });

  describe('input editing', () => {
    test('confirms value on Enter', () => {
      const { rerender } = render(<CircularSlider value={50} onChange={mockOnChange} />);
      const input = screen.getByTestId('circular-slider-input');

      fireEvent.focus(input);
      fireEvent.change(input, { target: { value: '75' } });
      fireEvent.keyDown(input, { key: 'Enter' });

      expect(mockOnChange).toHaveBeenCalledWith(75);
      rerender(<CircularSlider value={75} onChange={mockOnChange} />);
      expect(input).toHaveValue('75');
    });

    test('cancels editing on Escape', () => {
      render(<CircularSlider value={50} onChange={mockOnChange} />);
      const input = screen.getByTestId('circular-slider-input');

      fireEvent.focus(input);
      fireEvent.change(input, { target: { value: '999' } });
      fireEvent.keyDown(input, { key: 'Escape' });

      expect(mockOnChange).not.toHaveBeenCalled();
      expect(input).toHaveValue('50');
    });

    test('clamps value to max on Enter', () => {
      const { rerender } = render(<CircularSlider value={50} onChange={mockOnChange} max={100} />);
      const input = screen.getByTestId('circular-slider-input');

      fireEvent.focus(input);
      fireEvent.change(input, { target: { value: '999' } });
      fireEvent.keyDown(input, { key: 'Enter' });

      expect(mockOnChange).toHaveBeenCalledWith(100);
      rerender(<CircularSlider value={100} onChange={mockOnChange} max={100} />);
      expect(input).toHaveValue('100');
    });

    test('clamps value to min on Enter', () => {
      const { rerender } = render(<CircularSlider value={50} onChange={mockOnChange} min={0} />);
      const input = screen.getByTestId('circular-slider-input');

      fireEvent.focus(input);
      fireEvent.change(input, { target: { value: '-50' } });
      fireEvent.keyDown(input, { key: 'Enter' });

      expect(mockOnChange).toHaveBeenCalledWith(0);
      rerender(<CircularSlider value={0} onChange={mockOnChange} min={0} />);
      expect(input).toHaveValue('0');
    });

    test('restores original value on invalid input with Enter', () => {
      render(<CircularSlider value={50} onChange={mockOnChange} />);
      const input = screen.getByTestId('circular-slider-input');

      fireEvent.focus(input);
      fireEvent.change(input, { target: { value: 'abc' } });
      fireEvent.keyDown(input, { key: 'Enter' });

      expect(mockOnChange).not.toHaveBeenCalled();
      expect(input).toHaveValue('50');
    });

    test('confirms value on blur', () => {
      const { rerender } = render(<CircularSlider value={50} onChange={mockOnChange} />);
      const input = screen.getByTestId('circular-slider-input');

      fireEvent.focus(input);
      fireEvent.change(input, { target: { value: '25' } });
      fireEvent.blur(input);

      expect(mockOnChange).toHaveBeenCalledWith(25);
      rerender(<CircularSlider value={25} onChange={mockOnChange} />);
      expect(input).toHaveValue('25');
    });
  });
});
