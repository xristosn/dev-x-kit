import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { HSVInput } from './hsv-input';

describe('<HSVInput />', () => {
  it('renders HSV channels from a CSS color string', () => {
    render(<HSVInput value="#3B82F6" setValue={vi.fn()} />);

    expect(screen.getByTestId('hsv-input-h')).toHaveValue(217);
    expect(screen.getByTestId('hsv-input-s')).toHaveValue(76);
    expect(screen.getByTestId('hsv-input-v')).toHaveValue(96);
    expect(screen.getByTestId('hsv-input-a')).toHaveValue(1);
  });

  it('stores an edited HSV color as CSS text', async () => {
    const user = userEvent.setup();
    const setValue = vi.fn();
    render(<HSVInput value="#3B82F6" setValue={setValue} />);

    const hue = screen.getByTestId('hsv-input-h');
    await user.clear(hue);
    await user.type(hue, '300');

    expect(setValue).toHaveBeenLastCalledWith(expect.stringMatching(/^rgb\(/));
  });

  it('shows an error for channels outside the supported range', () => {
    const setValue = vi.fn();
    render(<HSVInput value="#3B82F6" setValue={setValue} />);

    fireEvent.change(screen.getByTestId('hsv-input-h'), { target: { value: '-1' } });

    expect(setValue).not.toHaveBeenCalled();
    expect(screen.getByTestId('hex-error-btn')).toBeInTheDocument();
  });

  it('hides alpha when disableAlpha is set', () => {
    render(<HSVInput value="#3B82F6" setValue={vi.fn()} disableAlpha />);

    expect(screen.queryByTestId('hsv-input-a')).not.toBeInTheDocument();
  });

  it('updates its fields when the external color changes', () => {
    const { rerender } = render(<HSVInput value="#3B82F6" setValue={vi.fn()} />);
    rerender(<HSVInput value="#FF0000" setValue={vi.fn()} />);

    expect(screen.getByTestId('hsv-input-h')).toHaveValue(0);
    expect(screen.getByTestId('hsv-input-s')).toHaveValue(100);
    expect(screen.getByTestId('hsv-input-v')).toHaveValue(100);
  });
});
