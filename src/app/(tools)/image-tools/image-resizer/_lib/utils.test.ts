import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { resizeImageCanvas } from './utils';

class MockImage {
  width = 400;
  height = 200;
  src = '';
  onload: ((event: Event) => void) | null = null;
  onerror: ((event: Event) => void) | null = null;
}

describe('resizeImageCanvas', () => {
  const file = new File(['image'], 'photo.png', { type: 'image/png' });
  let image: MockImage;
  let context: {
    fillStyle: string | CanvasGradient | CanvasPattern;
    fillRect: ReturnType<typeof vi.fn>;
    drawImage: ReturnType<typeof vi.fn>;
  };
  let blob: Blob;
  let createObjectURL: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    image = new MockImage();
    vi.stubGlobal(
      'Image',
      class {
        constructor() {
          return image;
        }
      }
    );
    createObjectURL = vi.fn(() => 'blob:source-image');
    vi.stubGlobal('URL', { ...URL, createObjectURL });
    blob = new Blob(['resized'], { type: file.type });
    context = {
      fillStyle: '',
      fillRect: vi.fn(),
      drawImage: vi.fn(),
    };
    vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(
      context as unknown as CanvasRenderingContext2D
    );
    vi.spyOn(HTMLCanvasElement.prototype, 'toBlob').mockImplementation((callback, type) => {
      callback(type === file.type ? blob : null);
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('centers a contained image over the selected background and preserves its ratio', async () => {
    const result = resizeImageCanvas(file, 300, 300, 'contain', '#abcdef');
    image.onload?.(new Event('load'));

    await expect(result).resolves.toBe(blob);
    expect(createObjectURL).toHaveBeenCalledWith(file);
    expect(context.fillStyle).toBe('#abcdef');
    expect(context.fillRect).toHaveBeenCalledWith(0, 0, 300, 300);
    expect(context.drawImage).toHaveBeenCalledWith(image, 0, 75, 300, 150);
    expect(HTMLCanvasElement.prototype.toBlob).toHaveBeenCalledWith(
      expect.any(Function),
      'image/png'
    );
  });

  it('stretches an image to the full target size in fill mode', async () => {
    const result = resizeImageCanvas(file, 120, 80, 'fill', '#ffffff');
    image.onload?.(new Event('load'));

    await expect(result).resolves.toBe(blob);
    expect(context.fillRect).not.toHaveBeenCalled();
    expect(context.drawImage).toHaveBeenCalledWith(image, 0, 0, 120, 80);
  });

  it('rejects when the image cannot be loaded', async () => {
    const result = resizeImageCanvas(file, 120, 80, 'fill', '#ffffff');
    const error = new Error('Image load failed');
    image.onerror?.(error as unknown as Event);

    await expect(result).rejects.toBe(error);
  });

  it('rejects when the canvas has no 2D context', async () => {
    vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(null);
    const result = resizeImageCanvas(file, 120, 80, 'fill', '#ffffff');
    image.onload?.(new Event('load'));

    await expect(result).rejects.toThrow('No context');
  });

  it('rejects when the canvas cannot produce a blob', async () => {
    vi.spyOn(HTMLCanvasElement.prototype, 'toBlob').mockImplementation((callback) =>
      callback(null)
    );
    const result = resizeImageCanvas(file, 120, 80, 'fill', '#ffffff');
    image.onload?.(new Event('load'));

    await expect(result).rejects.toThrow('Blob failed');
  });
});
