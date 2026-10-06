import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  DEFAULT_IMAGE_PLACEHOLDER_STORE_VALUE,
  downloadImage,
  generatePlaceholderImage,
} from './utils';

describe('placeholder image utilities', () => {
  let context: {
    fillStyle: string | CanvasGradient | CanvasPattern;
    fillRect: ReturnType<typeof vi.fn>;
    fillText: ReturnType<typeof vi.fn>;
    font: string;
    textAlign: CanvasTextAlign;
    textBaseline: CanvasTextBaseline;
  };

  beforeEach(() => {
    context = {
      fillStyle: '',
      fillRect: vi.fn(),
      fillText: vi.fn(),
      font: '',
      textAlign: 'start',
      textBaseline: 'alphabetic',
    };

    vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(
      context as unknown as CanvasRenderingContext2D
    );
    vi.spyOn(HTMLCanvasElement.prototype, 'toDataURL').mockReturnValue(
      'data:image/png;base64,test'
    );
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('generatePlaceholderImage', () => {
    it('uses the default settings', () => {
      expect(DEFAULT_IMAGE_PLACEHOLDER_STORE_VALUE).toEqual({
        backgroundColor: '#000000',
        width: 200,
        height: 200,
        text: '',
      });
    });

    it('draws a centered dimension label on a canvas with the requested size', () => {
      const result = generatePlaceholderImage('#7f7f7f', 400, 200);

      expect(result).toBe('data:image/png;base64,test');
      expect(HTMLCanvasElement.prototype.getContext).toHaveBeenCalledWith('2d');
      expect(context.fillStyle).toBe('#FFFFFF');
      expect(context.fillRect).toHaveBeenCalledWith(0, 0, 400, 200);
      expect(context.textAlign).toBe('center');
      expect(context.textBaseline).toBe('middle');
      expect(context.font).toBe('40px Arial');
      expect(context.fillText).toHaveBeenCalledWith('400x200', 200, 100);
      expect(HTMLCanvasElement.prototype.toDataURL).toHaveBeenCalledOnce();
    });

    it('uses custom text and chooses dark text for a light background', () => {
      generatePlaceholderImage('#808080', 300, 150, 'Sample');

      expect(context.fillStyle).toBe('#000000');
      expect(context.font).toBe('30px Arial');
      expect(context.fillText).toHaveBeenCalledWith('Sample', 150, 75);
    });

    it('returns an empty string when the 2D canvas context is unavailable', () => {
      vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(null);
      const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      expect(generatePlaceholderImage('#000000', 100, 50)).toBe('');
      expect(errorSpy).toHaveBeenCalledWith(new Error('Could not get 2D context from canvas'));
      expect(HTMLCanvasElement.prototype.toDataURL).not.toHaveBeenCalled();
    });

    it('returns an empty string when running without a browser window', () => {
      vi.stubGlobal('window', undefined);

      expect(generatePlaceholderImage('#000000', 100, 50)).toBe('');
      expect(HTMLCanvasElement.prototype.getContext).not.toHaveBeenCalled();
    });
  });

  describe('downloadImage', () => {
    it.each([
      ['jpeg', 'placeholder.jpeg'],
      ['webp', 'placeholder.webp'],
    ] as const)('downloads a %s image with the expected filename', (format, filename) => {
      const dataUrl = 'data:image/png;base64,test';
      const clickedLinks: HTMLAnchorElement[] = [];
      const clickSpy = vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(function (
        this: HTMLAnchorElement
      ) {
        clickedLinks.push(this);
      });

      downloadImage(dataUrl, format);

      expect(clickSpy).toHaveBeenCalledOnce();
      expect(clickedLinks[0]?.href).toBe(dataUrl);
      expect(clickedLinks[0]?.download).toBe(filename);
    });
  });
});
