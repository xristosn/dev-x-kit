import Compressor from 'compressorjs';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { resizeImageCanvas, SOCIAL_PRESETS, type ImageResizerStoreValue } from './utils';
import { resizeImage } from './resize-image';

vi.mock('compressorjs', () => ({ default: vi.fn() }));
vi.mock('./utils', async (importOriginal) => ({
  ...(await importOriginal<typeof import('./utils')>()),
  resizeImageCanvas: vi.fn(),
}));

const file = new File(['image'], 'photo.png', { type: 'image/png' });
const baseValue: ImageResizerStoreValue = {
  mode: 'dimensions',
  fit: 'cover',
  background: '#abcdef',
  lockAspectRatio: true,
  socialPlatform: 'facebook',
  socialPreset: 0,
  percentage: 80,
};
const makeOptions = (overrides: Partial<ImageResizerStoreValue> = {}) => ({
  file,
  width: 320,
  height: 180,
  originalSize: { width: 1600, height: 900 },
  value: { ...baseValue, ...overrides },
});

describe('resizeImage', () => {
  const output = new File(['resized'], 'output.png', { type: 'image/png' });
  let createObjectURL: ReturnType<typeof vi.fn>;
  let clickedLinks: HTMLAnchorElement[];

  beforeEach(() => {
    vi.mocked(Compressor).mockReset();
    vi.mocked(resizeImageCanvas).mockReset();
    vi.mocked(resizeImageCanvas).mockResolvedValue(new Blob(['canvas-image'], { type: file.type }));
    createObjectURL = vi.fn(() => 'blob:resized-image');
    clickedLinks = [];
    vi.stubGlobal('URL', { ...URL, createObjectURL });
    vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(function (
      this: HTMLAnchorElement
    ) {
      clickedLinks.push(this);
    });
    vi.mocked(Compressor).mockImplementation(function (_input, options) {
      options?.success?.call(this, output);
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('passes explicit dimensions and standard compressor options', async () => {
    await resizeImage(makeOptions());

    expect(Compressor).toHaveBeenCalledWith(
      file,
      expect.objectContaining({
        width: 320,
        height: 180,
        quality: 1,
        resize: 'contain',
        mimeType: 'image/png',
        retainExif: true,
      })
    );
    expect(resizeImageCanvas).not.toHaveBeenCalled();
  });

  it('calculates percentage dimensions from the original size with rounding', async () => {
    await resizeImage(makeOptions({ mode: 'percentage', percentage: 33 }));

    expect(Compressor).toHaveBeenCalledWith(
      file,
      expect.objectContaining({ width: 528, height: 297 })
    );
  });

  it('uses the selected social preset dimensions', async () => {
    await resizeImage(
      makeOptions({ mode: 'social', socialPlatform: 'instagram', socialPreset: 1 })
    );

    expect(Compressor).toHaveBeenCalledWith(
      file,
      expect.objectContaining({
        width: SOCIAL_PRESETS.instagram[1].width,
        height: SOCIAL_PRESETS.instagram[1].height,
      })
    );
  });

  it.each(['contain', 'fill'] as const)(
    'uses the canvas helper for custom %s fitting',
    async (fit) => {
      const canvasBlob = new Blob(['canvas'], { type: file.type });
      vi.mocked(resizeImageCanvas).mockResolvedValue(canvasBlob);

      await resizeImage(makeOptions({ mode: 'social', fit }));

      expect(resizeImageCanvas).toHaveBeenCalledWith(file, 170, 170, fit, '#abcdef');
      expect(Compressor).toHaveBeenCalledWith(
        canvasBlob,
        expect.objectContaining({ width: undefined, height: undefined, resize: 'contain' })
      );
    }
  );

  it('uses Compressor cover resizing for custom cover fitting', async () => {
    await resizeImage(makeOptions({ mode: 'social', fit: 'cover' }));

    expect(resizeImageCanvas).not.toHaveBeenCalled();
    expect(Compressor).toHaveBeenCalledWith(
      file,
      expect.objectContaining({ width: 170, height: 170, resize: 'cover' })
    );
  });

  it('downloads the resized output using the original filename', async () => {
    await resizeImage(makeOptions());

    expect(createObjectURL).toHaveBeenCalledWith(output);
    expect(clickedLinks).toHaveLength(1);
    expect(clickedLinks[0]).toMatchObject({ href: 'blob:resized-image', download: file.name });
  });

  it('logs compressor errors', async () => {
    const error = new Error('Compression failed');
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});
    vi.mocked(Compressor).mockImplementation(function (_input, options) {
      options?.error?.call(this, error);
    });

    await resizeImage(makeOptions());

    expect(consoleError).toHaveBeenCalledWith(error.message);
  });

  it('logs canvas errors and stops before creating the compressor', async () => {
    const error = new Error('Canvas failed');
    vi.mocked(resizeImageCanvas).mockRejectedValue(error);
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});

    await resizeImage(makeOptions({ mode: 'social', fit: 'contain' }));

    expect(consoleError).toHaveBeenCalledWith(error);
    expect(Compressor).not.toHaveBeenCalled();
  });
});
