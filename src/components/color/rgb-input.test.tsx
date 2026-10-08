import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { RGBInput } from './rgb-input';

describe('<RGBInput />', () => {
  it('renders RGB channels from a CSS color string', () => {
    render(<RGBInput value="#3B82F6" setValue={vi.fn()} />);

    expect(screen.getByTestId('rgb-input-r')).toHaveValue(59);
    expect(screen.getByTestId('rgb-input-g')).toHaveValue(130);
    expect(screen.getByTestId('rgb-input-b')).toHaveValue(246);
    expect(screen.getByTestId('rgb-input-a')).toHaveValue(1);
  });

  it('stores edited RGB values as a CSS color string', async () => {
    const user = userEvent.setup();
    const setValue = vi.fn();
    render(<RGBInput value="#3B82F6" setValue={setValue} />);

    const red = screen.getByTestId('rgb-input-r');
    await user.clear(red);
    await user.type(red, '170');

    expect(setValue).toHaveBeenLastCalledWith(expect.stringMatching(/^rgb\(/));
  });

  it('shows an error for values outside the supported range', () => {
    const setValue = vi.fn();
    render(<RGBInput value="#3B82F6" setValue={setValue} />);

    fireEvent.change(screen.getByTestId('rgb-input-r'), { target: { value: '-1' } });

    expect(setValue).not.toHaveBeenCalled();
    expect(screen.getByTestId('hex-error-btn')).toBeInTheDocument();
  });

  it('hides alpha when disableAlpha is set', () => {
    render(<RGBInput value="#3B82F6" setValue={vi.fn()} disableAlpha />);

    expect(screen.queryByTestId('rgb-input-a')).not.toBeInTheDocument();
  });

  it('does not replace an out-of-sRGB source just to display its RGB channels', () => {
    const setValue = vi.fn();
    render(<RGBInput value="oklch(70% 0.4 35)" setValue={setValue} />);

    expect(screen.getByTestId('rgb-input-r')).toHaveValue(255);
    expect(setValue).not.toHaveBeenCalled();
  });
});
