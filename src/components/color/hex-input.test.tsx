import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { HexInput } from './hex-input';

describe('<HexInput />', () => {
  it('renders a hex view of the source color', () => {
    render(<HexInput value="oklch(70% 0.4 35)" setValue={vi.fn()} />);

    expect(screen.getByTestId('hex-input')).toHaveValue('#ff5a2d');
  });

  it('stores valid hex edits as CSS hex strings', () => {
    const setValue = vi.fn();
    render(<HexInput value="#3B82F6" setValue={setValue} />);

    fireEvent.change(screen.getByTestId('hex-input'), { target: { value: '#AABBCC' } });

    expect(setValue).toHaveBeenCalledWith('#abc');
  });

  it('does not store invalid hex edits', () => {
    const setValue = vi.fn();
    render(<HexInput value="#3B82F6" setValue={setValue} />);

    fireEvent.change(screen.getByTestId('hex-input'), { target: { value: 'INVALID' } });

    expect(setValue).not.toHaveBeenCalled();
    expect(screen.getByTestId('hex-error-btn')).toBeInTheDocument();
  });

  it('keeps the native source color when the hex view is not edited', () => {
    const setValue = vi.fn();
    render(<HexInput value="oklch(70% 0.4 35)" setValue={setValue} />);

    fireEvent.blur(screen.getByTestId('hex-input'));

    expect(setValue).not.toHaveBeenCalled();
  });
});
