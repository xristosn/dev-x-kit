import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { DecodedFilePreview } from './decoded-file-preview';
import type { DecodeResult } from '../_lib/base64-to-file';

const createResult = (mimeType: string, preview: boolean): DecodeResult => ({
  size: 5,
  mimeType,
  fileUrl: 'blob:decoded-file',
  displayName: 'Decoded File',
  preview,
});

describe('<DecodedFilePreview />', () => {
  it('shows an image preview and a downloadable file link for image results', () => {
    render(<DecodedFilePreview result={createResult('image/png', false)} />);

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
    expect(screen.queryByTestId('base64-file-decoder-file-preview')).not.toBeInTheDocument();
  });

  it('embeds supported non-image files for preview', () => {
    render(<DecodedFilePreview result={createResult('application/pdf', true)} />);

    expect(screen.getByTestId('base64-file-decoder-download')).toHaveAttribute(
      'href',
      'blob:decoded-file'
    );
    expect(screen.getByTestId('base64-file-decoder-file-preview')).toHaveAttribute(
      'src',
      'blob:decoded-file'
    );
    expect(screen.queryByTestId('base64-file-decoder-image-preview')).not.toBeInTheDocument();
  });

  it('omits embedded previews for unsupported non-image files', () => {
    render(<DecodedFilePreview result={createResult('application/zip', false)} />);

    expect(screen.getByTestId('base64-file-decoder-download')).toHaveAttribute(
      'href',
      'blob:decoded-file'
    );
    expect(screen.queryByTestId('base64-file-decoder-file-preview')).not.toBeInTheDocument();
    expect(screen.queryByTestId('base64-file-decoder-image-preview')).not.toBeInTheDocument();
  });
});
