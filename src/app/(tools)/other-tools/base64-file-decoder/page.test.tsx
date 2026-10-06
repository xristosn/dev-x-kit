import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { toast } from 'sonner';
import Base64FileDecoder from './page';

vi.mock('sonner', () => ({
  toast: {
    dismiss: vi.fn(),
    error: vi.fn(),
  },
}));

const originalCreateObjectURL = Object.getOwnPropertyDescriptor(URL, 'createObjectURL');

describe('<Base64FileDecoder />', () => {
  beforeEach(() => {
    Object.defineProperty(URL, 'createObjectURL', {
      configurable: true,
      value: vi.fn(() => 'blob:decoded-file'),
    });
  });

  afterEach(() => {
    if (originalCreateObjectURL) {
      Object.defineProperty(URL, 'createObjectURL', originalCreateObjectURL);
    } else {
      Reflect.deleteProperty(URL, 'createObjectURL');
    }
  });

  it('decodes a data URI and shows an image preview with a download link', async () => {
    const user = userEvent.setup();
    render(<Base64FileDecoder />);

    const input = screen.getByTestId('base64-file-decoder-input');
    const decodeButton = await screen.findByTestId('base64-file-decoder-decode');
    expect(decodeButton).toBeDisabled();

    await user.type(input, 'data:image/png;base64,aGVsbG8=');
    expect(decodeButton).toBeEnabled();
    await user.click(decodeButton);

    expect(screen.getByTestId('base64-file-decoder-download')).toHaveAttribute(
      'href',
      'blob:decoded-file'
    );
    expect(screen.getByTestId('base64-file-decoder-download')).toHaveAttribute(
      'download',
      'decoded'
    );
    expect(screen.getByTestId('base64-file-decoder-image-preview')).toHaveAttribute(
      'src',
      'blob:decoded-file'
    );
    expect(toast.dismiss).toHaveBeenCalledOnce();
  });

  it('reports invalid base64 input without showing a decoded file', async () => {
    const user = userEvent.setup();
    render(<Base64FileDecoder />);

    await user.type(screen.getByTestId('base64-file-decoder-input'), '%%%');
    await user.click(await screen.findByTestId('base64-file-decoder-decode'));

    expect(toast.error).toHaveBeenCalledWith(
      'Failed to Decode',
      expect.objectContaining({ description: expect.any(String), duration: 6000 })
    );
    expect(screen.queryByTestId('base64-file-decoder-download')).not.toBeInTheDocument();
  });
});
