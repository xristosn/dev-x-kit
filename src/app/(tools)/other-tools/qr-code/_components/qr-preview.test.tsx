import React from 'react';
import { describe, expect, test, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QrPreview } from './qr-preview';

describe('<QrPreview />', () => {
  const previewRef = {
    current: document.createElement('div'),
  } as React.RefObject<HTMLDivElement | null>;
  const qrCodeRef = { current: { download: vi.fn() } } as React.RefObject<{
    download: (opts: { extension: string }) => void;
  } | null>;

  test('renders download buttons', () => {
    render(<QrPreview previewRef={previewRef} qrCodeRef={qrCodeRef as never} />);
    expect(screen.getByTestId('qr-download-png')).toBeInTheDocument();
    expect(screen.getByTestId('qr-download-svg')).toBeInTheDocument();
  });

  test('clicking png triggers download', async () => {
    const user = userEvent.setup();
    render(<QrPreview previewRef={previewRef} qrCodeRef={qrCodeRef as never} />);
    await user.click(screen.getByTestId('qr-download-png'));
    expect(qrCodeRef.current?.download).toHaveBeenCalledWith({ extension: 'png' });
  });
});
