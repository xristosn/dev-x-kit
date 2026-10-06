'use client';

import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Compressor from 'compressorjs';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { USER_STORAGE_PREFS_KEY } from '@/lib/constants';
import ImageCompressor from './page';

vi.mock('compressorjs', () => ({ default: vi.fn() }));

const originalCreateObjectURL = Object.getOwnPropertyDescriptor(URL, 'createObjectURL');

describe('<ImageCompressor />', () => {
  beforeEach(() => {
    window.localStorage.setItem(USER_STORAGE_PREFS_KEY, JSON.stringify('local'));
    window.localStorage.removeItem('image-compressor');
    vi.mocked(Compressor).mockReset();

    let outputCount = 0;
    Object.defineProperty(URL, 'createObjectURL', {
      configurable: true,
      value: vi.fn(() => `blob:compressed-${++outputCount}`),
    });

    vi.mocked(Compressor).mockImplementation(function (file, options) {
      options?.success?.call(
        this,
        new File(['small'], file instanceof File ? file.name : 'image.png', {
          type: file.type,
        })
      );
    });
  });

  afterEach(() => {
    window.localStorage.removeItem('image-compressor');
    window.localStorage.removeItem(USER_STORAGE_PREFS_KEY);

    if (originalCreateObjectURL) {
      Object.defineProperty(URL, 'createObjectURL', originalCreateObjectURL);
    } else {
      Reflect.deleteProperty(URL, 'createObjectURL');
    }
  });

  it('compresses accepted images using the selected quality and exposes download links', async () => {
    const user = userEvent.setup();
    const firstImage = new File(['original-image'], 'first.png', { type: 'image/png' });
    const secondImage = new File(['another-original'], 'second.jpg', { type: 'image/jpeg' });
    render(<ImageCompressor />);

    await user.upload(screen.getByTestId('image-compressor-file-input'), [firstImage, secondImage]);
    fireEvent.change(screen.getByTestId('image-compressor-quality'), {
      target: { value: '0.5' },
    });

    await user.click(screen.getByTestId('image-compressor-convert'));

    expect(await screen.findByTestId('image-compressor-complete')).toBeInTheDocument();
    expect(Compressor).toHaveBeenCalledTimes(2);
    expect(vi.mocked(Compressor).mock.calls[0]?.[1]).toMatchObject({
      quality: 0.5,
      mimeType: 'image/png',
      retainExif: true,
    });
    expect(screen.getByTestId('image-compressor-download-first.png')).toHaveAttribute(
      'href',
      'blob:compressed-1'
    );
    expect(screen.getByTestId('image-compressor-download-second.jpg')).toHaveAttribute(
      'href',
      'blob:compressed-2'
    );
  });

  it('shows compression errors and continues with later files', async () => {
    const user = userEvent.setup();
    const images = [
      new File(['broken-image'], 'broken.png', { type: 'image/png' }),
      new File(['valid-image'], 'valid.png', { type: 'image/png' }),
    ];
    const technicalError = new Error('Failed to load the image.');

    vi.mocked(Compressor).mockImplementation(function (file, options) {
      queueMicrotask(() => {
        if (file instanceof File && file.name === 'broken.png') {
          options?.error?.call(this, technicalError);
          return;
        }

        options?.success?.call(
          this,
          new File(['small'], file instanceof File ? file.name : 'image.png', {
            type: file.type,
          })
        );
      });
    });

    render(<ImageCompressor />);
    await user.upload(screen.getByTestId('image-compressor-file-input'), images);
    await user.click(screen.getByTestId('image-compressor-convert'));

    expect(await screen.findByTestId('image-compressor-complete')).toBeInTheDocument();
    expect(screen.getByTestId('image-compressor-file-error-broken.png')).toBeInTheDocument();
    expect(screen.getByTestId('image-compressor-error-details-broken.png')).toHaveTextContent(
      technicalError.message
    );
    expect(screen.getByTestId('image-compressor-download-valid.png')).toBeInTheDocument();
  });

  it('records synchronous compressor failures and finishes with every file failed', async () => {
    const user = userEvent.setup();
    const images = [
      new File(['broken-image'], 'broken.png', { type: 'image/png' }),
      new File(['another-broken-image'], 'another-broken.png', { type: 'image/png' }),
    ];

    vi.mocked(Compressor).mockImplementation(function (file) {
      throw new Error(`Failed to process ${file instanceof File ? file.name : 'image'}`);
    });

    render(<ImageCompressor />);
    await user.upload(screen.getByTestId('image-compressor-file-input'), images);
    await user.click(screen.getByTestId('image-compressor-convert'));

    expect(await screen.findByTestId('image-compressor-complete')).toBeInTheDocument();
    expect(screen.getByTestId('image-compressor-failure-count')).toHaveTextContent(
      '2 images could not be compressed.'
    );
    expect(screen.getByTestId('image-compressor-error-details-broken.png')).toHaveTextContent(
      'Failed to process broken.png'
    );
    expect(
      screen.getByTestId('image-compressor-error-details-another-broken.png')
    ).toHaveTextContent('Failed to process another-broken.png');
  });

  it('limits an upload to MAX_FILES and returns to the upload step when starting over', async () => {
    const user = userEvent.setup();
    const images = Array.from(
      { length: 16 },
      (_, index) => new File([`image-${index}`], `image-${index}.png`, { type: 'image/png' })
    );
    render(<ImageCompressor />);

    await user.upload(screen.getByTestId('image-compressor-file-input'), images);
    await user.click(screen.getByTestId('image-compressor-convert'));

    expect(await screen.findByTestId('image-compressor-complete')).toBeInTheDocument();
    expect(Compressor).toHaveBeenCalledTimes(15);

    await user.click(screen.getByTestId('image-compressor-start-over'));

    expect(screen.getByTestId('image-compressor-dropzone')).toBeInTheDocument();
    expect(screen.queryByTestId('image-compressor-convert')).not.toBeInTheDocument();
  });

  it('renders at least three task-specific FAQs', () => {
    render(<ImageCompressor />);

    expect(screen.getByTestId('faq-question-0')).toBeInTheDocument();
    expect(screen.getByTestId('faq-question-1')).toBeInTheDocument();
    expect(screen.getByTestId('faq-question-2')).toBeInTheDocument();
  });
});
