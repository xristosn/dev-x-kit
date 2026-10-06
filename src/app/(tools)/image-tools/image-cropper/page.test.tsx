'use client';

import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { ReactNode } from 'react';
import type { Crop, PixelCrop } from 'react-image-crop';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { USER_STORAGE_PREFS_KEY } from '@/lib/constants';
import ImageCropper from './page';

vi.mock('react-image-crop', async (importOriginal) => {
  const actual = await importOriginal<typeof import('react-image-crop')>();

  return {
    ...actual,
    default: ({
      children,
      aspect,
      crop,
      onComplete,
    }: {
      children: ReactNode;
      aspect?: number;
      crop?: Crop;
      onComplete: (crop: PixelCrop) => void;
    }) => (
      <div
        data-testid="image-cropper-preview"
        data-aspect={aspect ?? 'free'}
        data-crop-x={crop?.x}
        data-crop-y={crop?.y}
        data-crop-width={crop?.width}
        data-crop-height={crop?.height}
        data-crop-unit={crop?.unit}
      >
        <button
          data-testid="image-cropper-complete-crop"
          onClick={() => onComplete({ unit: 'px', x: 10, y: 20, width: 40, height: 30 })}
        >
          Complete crop
        </button>
        {children}
      </div>
    ),
  };
});

const originalCreateObjectURL = Object.getOwnPropertyDescriptor(URL, 'createObjectURL');
const originalRevokeObjectURL = Object.getOwnPropertyDescriptor(URL, 'revokeObjectURL');

function setImageDimensions(image: HTMLImageElement) {
  Object.defineProperties(image, {
    width: { configurable: true, value: 200 },
    height: { configurable: true, value: 100 },
    naturalWidth: { configurable: true, value: 400 },
    naturalHeight: { configurable: true, value: 200 },
  });
}

describe('<ImageCropper />', () => {
  beforeEach(() => {
    window.localStorage.setItem(USER_STORAGE_PREFS_KEY, JSON.stringify('local'));
    window.localStorage.removeItem('img-cropper');
  });

  afterEach(() => {
    vi.restoreAllMocks();
    window.localStorage.removeItem('img-cropper');
    window.localStorage.removeItem(USER_STORAGE_PREFS_KEY);

    if (originalCreateObjectURL) {
      Object.defineProperty(URL, 'createObjectURL', originalCreateObjectURL);
    } else {
      Reflect.deleteProperty(URL, 'createObjectURL');
    }

    if (originalRevokeObjectURL) {
      Object.defineProperty(URL, 'revokeObjectURL', originalRevokeObjectURL);
    } else {
      Reflect.deleteProperty(URL, 'revokeObjectURL');
    }
  });

  it('loads an image and initializes a centered 16:9 crop', async () => {
    const user = userEvent.setup();
    const imageFile = new File(['image-data'], 'photo.png', { type: 'image/png' });
    render(<ImageCropper />);

    await user.upload(screen.getByTestId('image-cropper-file-input'), imageFile);

    const image = await screen.findByTestId('image-cropper-image');
    await waitFor(() =>
      expect(image).toHaveAttribute('src', expect.stringContaining('data:image/png'))
    );
    setImageDimensions(image as HTMLImageElement);
    fireEvent.load(image);

    await waitFor(() => {
      const preview = screen.getByTestId('image-cropper-preview');
      expect(preview).toHaveAttribute('data-crop-unit', '%');
      expect(Number(preview.getAttribute('data-crop-x'))).toBeCloseTo(5.5556);
      expect(Number(preview.getAttribute('data-crop-y'))).toBe(0);
      expect(Number(preview.getAttribute('data-crop-width'))).toBeCloseTo(88.8889);
      expect(Number(preview.getAttribute('data-crop-height'))).toBe(100);
      expect(preview).toHaveAttribute('data-aspect', 'free');
    });
  });

  it('locks the current crop ratio and resets to the upload step', async () => {
    const user = userEvent.setup();
    const imageFile = new File(['image-data'], 'photo.png', { type: 'image/png' });
    render(<ImageCropper />);

    await user.upload(screen.getByTestId('image-cropper-file-input'), imageFile);
    const image = (await screen.findByTestId('image-cropper-image')) as HTMLImageElement;
    setImageDimensions(image);
    fireEvent.load(image);

    const ratioSwitch = screen.getByTestId('image-cropper-lock-ratio');
    await user.click(ratioSwitch);

    expect(screen.getByTestId('image-cropper-preview')).toHaveAttribute(
      'data-aspect',
      String((88.88888888888889 * 200) / (100 * 100))
    );
    expect(window.localStorage.getItem('img-cropper')).toBe(
      JSON.stringify({ lockAspectRatio: true })
    );

    await user.click(screen.getByTestId('image-cropper-reset'));

    expect(screen.getByTestId('image-cropper-file-input')).toBeInTheDocument();
    expect(screen.queryByTestId('image-cropper-image')).not.toBeInTheDocument();
    expect(window.localStorage.getItem('img-cropper')).toBeNull();
  });

  it('downloads the completed crop as a scaled PNG and revokes its object URL', async () => {
    const user = userEvent.setup();
    const imageFile = new File(['image-data'], 'photo.png', { type: 'image/png' });
    const blob = new Blob(['cropped-image'], { type: 'image/png' });
    const drawImage = vi.fn();
    const createObjectURL = vi.fn(() => 'blob:cropped-image');
    const revokeObjectURL = vi.fn();
    const downloadedAnchors: HTMLAnchorElement[] = [];
    const click = vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(function (
      this: HTMLAnchorElement
    ) {
      downloadedAnchors.push(this);
    });
    const getContext = vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue({
      drawImage,
      imageSmoothingQuality: 'low',
    } as unknown as CanvasRenderingContext2D);
    const toBlob = vi
      .spyOn(HTMLCanvasElement.prototype, 'toBlob')
      .mockImplementation((callback) => callback(blob));
    Object.defineProperty(URL, 'createObjectURL', { configurable: true, value: createObjectURL });
    Object.defineProperty(URL, 'revokeObjectURL', { configurable: true, value: revokeObjectURL });

    render(<ImageCropper />);
    await user.upload(screen.getByTestId('image-cropper-file-input'), imageFile);
    const image = (await screen.findByTestId('image-cropper-image')) as HTMLImageElement;
    setImageDimensions(image);
    fireEvent.load(image);
    await user.click(screen.getByTestId('image-cropper-complete-crop'));
    await user.click(screen.getByTestId('image-cropper-download'));

    expect(getContext).toHaveBeenCalledWith('2d');
    expect(drawImage).toHaveBeenCalledWith(image, 20, 40, 80, 60, 0, 0, 80, 60);
    expect(toBlob).toHaveBeenCalledWith(expect.any(Function), 'image/png');
    expect(createObjectURL).toHaveBeenCalledWith(blob);
    expect(click).toHaveBeenCalledOnce();
    expect(downloadedAnchors).toHaveLength(1);
    expect(downloadedAnchors[0]?.download).toBe('cropped-image.png');
    expect(downloadedAnchors[0]?.href).toBe('blob:cropped-image');
    expect(revokeObjectURL).toHaveBeenCalledWith('blob:cropped-image');
  });

  it('does nothing when there is no completed crop', async () => {
    const user = userEvent.setup();
    const imageFile = new File(['image-data'], 'photo.png', { type: 'image/png' });
    const getContext = vi.spyOn(HTMLCanvasElement.prototype, 'getContext');
    render(<ImageCropper />);

    await user.upload(screen.getByTestId('image-cropper-file-input'), imageFile);
    const image = (await screen.findByTestId('image-cropper-image')) as HTMLImageElement;
    setImageDimensions(image);
    fireEvent.load(image);
    await user.click(screen.getByTestId('image-cropper-download'));

    expect(getContext).not.toHaveBeenCalled();
  });

  it('does nothing when the canvas context is unavailable', async () => {
    const user = userEvent.setup();
    const imageFile = new File(['image-data'], 'photo.png', { type: 'image/png' });
    const getContext = vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(null);
    render(<ImageCropper />);

    await user.upload(screen.getByTestId('image-cropper-file-input'), imageFile);
    const image = (await screen.findByTestId('image-cropper-image')) as HTMLImageElement;
    setImageDimensions(image);
    fireEvent.load(image);
    await user.click(screen.getByTestId('image-cropper-complete-crop'));
    await user.click(screen.getByTestId('image-cropper-download'));

    expect(getContext).toHaveBeenCalledWith('2d');
  });

  it('renders at least three task-specific FAQs', () => {
    render(<ImageCropper />);

    expect(screen.getByTestId('faq-question-0')).toBeInTheDocument();
    expect(screen.getByTestId('faq-question-1')).toBeInTheDocument();
    expect(screen.getByTestId('faq-question-2')).toBeInTheDocument();
  });
});
