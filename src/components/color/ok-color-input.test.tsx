import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { OkColorInput } from './ok-color-input';

describe('<OkColorInput />', () => {
  it('keeps an out-of-sRGB authored color until a channel is edited', () => {
    const setValue = vi.fn();
    const value = 'oklch(70% 0.4 35)';

    render(<OkColorInput value={value} setValue={setValue} space="oklch" />);

    expect(screen.getByTestId('oklch-input-l')).toHaveValue(70);
    expect(screen.getByTestId('oklch-input-c')).toHaveValue(0.4);
    expect(screen.getByTestId('oklch-input-h')).toHaveValue(35);
    expect(setValue).not.toHaveBeenCalled();
  });

  it('serializes edited OKLCH channels without gamut mapping', async () => {
    const user = userEvent.setup();
    const setValue = vi.fn();
    render(<OkColorInput value="oklch(70% 0.3 35)" setValue={setValue} space="oklch" />);

    const chroma = screen.getByTestId('oklch-input-c');
    await user.clear(chroma);
    await user.type(chroma, '0.4');

    expect(setValue).toHaveBeenLastCalledWith(expect.stringMatching(/^oklch\(/));
    expect(setValue.mock.lastCall?.[0]).toContain('0.4');
  });

  it('rejects invalid OKLCH hue values', () => {
    const setValue = vi.fn();
    render(<OkColorInput value="oklch(70% 0.3 35)" setValue={setValue} space="oklch" />);

    fireEvent.change(screen.getByTestId('oklch-input-h'), { target: { value: '361' } });

    expect(setValue).not.toHaveBeenCalled();
    expect(screen.getByTestId('hex-error-btn')).toBeInTheDocument();
  });

  it('supports alpha while editing OKLab', async () => {
    const user = userEvent.setup();
    const setValue = vi.fn();
    render(<OkColorInput value="oklab(70% 0.1 -0.1 / 0.5)" setValue={setValue} space="oklab" />);

    const alpha = screen.getByTestId('oklab-input-alpha');
    await user.clear(alpha);
    await user.type(alpha, '0.75');

    expect(setValue).toHaveBeenLastCalledWith(expect.stringMatching(/^oklab\(/));
    expect(setValue.mock.lastCall?.[0]).toContain('/ 0.75');
  });
});
