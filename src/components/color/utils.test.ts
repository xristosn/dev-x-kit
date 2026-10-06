import { afterEach, describe, it, expect, vi } from 'vitest';
import {
  stringToHexColor,
  stringToHsvColor,
  colorToHsvString,
  colorToRgbString,
  stringToRgbColor,
  colorToString,
  sortStops,
  moveGradientStop,
  getGradientColor,
  cssGradientToImage,
} from './utils';
import type { GradientStop, GradientValue } from '@/types/gradient';

describe('color utils', () => {
  describe('stringToHexColor', () => {
    it('returns null for empty string', () => {
      expect(stringToHexColor('')).toBeNull();
    });

    it('returns null for whitespace-only string', () => {
      expect(stringToHexColor('   ')).toBeNull();
    });

    it('returns null for non-string input', () => {
      expect(stringToHexColor(null as unknown as string)).toBeNull();
    });

    it('parses 3-digit hex without hash', () => {
      expect(stringToHexColor('f00')).toBe('#F00');
    });

    it('parses 6-digit hex without hash', () => {
      expect(stringToHexColor('ff0000')).toBe('#FF0000');
    });

    it('parses 8-digit hex (with alpha)', () => {
      expect(stringToHexColor('ff000080')).toBe('#FF000080');
    });

    it('parses 3-digit hex with hash', () => {
      expect(stringToHexColor('#f00')).toBe('#F00');
    });

    it('parses 6-digit hex with hash', () => {
      expect(stringToHexColor('#ff0000')).toBe('#FF0000');
    });

    it('normalizes lowercase to uppercase', () => {
      expect(stringToHexColor('#abc123')).toBe('#ABC123');
    });

    it('trims whitespace before parsing', () => {
      expect(stringToHexColor('  #ff0000  ')).toBe('#FF0000');
    });

    it('returns null for invalid hex length (4 chars)', () => {
      expect(stringToHexColor('f000')).toBeNull();
    });

    it('returns null for non-hex characters', () => {
      expect(stringToHexColor('#gggggg')).toBeNull();
    });

    it('returns null for too-long hex (7 digits)', () => {
      expect(stringToHexColor('ff00000')).toBeNull();
    });
  });

  describe('stringToHsvColor', () => {
    it('returns null for empty string', () => {
      expect(stringToHsvColor('')).toBeNull();
    });

    it('returns null for non-string input', () => {
      expect(stringToHsvColor(null as unknown as string)).toBeNull();
    });

    it('parses hsv(h, s, v) format', () => {
      const result = stringToHsvColor('hsv(180, 50%, 75%)');
      expect(result).not.toBeNull();
      expect(result!.h).toBe(180);
      expect(result!.s).toBe(50);
      expect(result!.v).toBe(75);
      expect(result!.a).toBe(1);
    });

    it('parses hsva(h, s, v, a) format', () => {
      const result = stringToHsvColor('hsva(180, 50%, 75%, 0.5)');
      expect(result).not.toBeNull();
      expect(result!.h).toBe(180);
      expect(result!.s).toBe(50);
      expect(result!.v).toBe(75);
      expect(result!.a).toBe(0.5);
    });

    it('parses without spaces', () => {
      const result = stringToHsvColor('hsv(0,100%,50%)');
      expect(result).not.toBeNull();
      expect(result!.h).toBe(0);
      expect(result!.s).toBe(100);
      expect(result!.v).toBe(50);
    });

    it('parses decimal hue values', () => {
      const result = stringToHsvColor('hsv(120.5, 50.25%, 75.1%)');
      expect(result).not.toBeNull();
      expect(result!.h).toBe(120.5);
      expect(result!.s).toBe(50.25);
      expect(result!.v).toBe(75.1);
    });

    it('clamps hue to [0, 360]', () => {
      const result = stringToHsvColor('hsv(400, 50%, 75%)');
      expect(result!.h).toBe(360);
    });

    it('rejects negative hue (regex does not match)', () => {
      expect(stringToHsvColor('hsv(-10, 50%, 75%)')).toBeNull();
    });

    it('clamps saturation to [0, 100]', () => {
      const result = stringToHsvColor('hsv(180, 150%, 75%)');
      expect(result!.s).toBe(100);
    });

    it('clamps value to [0, 100]', () => {
      const result = stringToHsvColor('hsv(180, 50%, 120%)');
      expect(result!.v).toBe(100);
    });

    it('clamps alpha to [0, 1]', () => {
      const result = stringToHsvColor('hsva(180, 50%, 75%, 1.5)');
      expect(result!.a).toBe(1);
    });

    it('rejects negative alpha (regex does not match)', () => {
      expect(stringToHsvColor('hsva(180, 50%, 75%, -0.5)')).toBeNull();
    });

    it('rejects invalid format', () => {
      expect(stringToHsvColor('red')).toBeNull();
    });

    it('rejects malformed function call', () => {
      expect(stringToHsvColor('hsv(180, 50)')).toBeNull();
    });

    it('handles case-insensitive function name', () => {
      const result = stringToHsvColor('HSV(180, 50%, 75%)');
      expect(result).not.toBeNull();
    });

    it('handles mixed case hsva', () => {
      const result = stringToHsvColor('HsvA(180, 50%, 75%, 0.8)');
      expect(result).not.toBeNull();
      expect(result!.a).toBe(0.8);
    });

    it('returns null for NaN values', () => {
      expect(stringToHsvColor('hsv(abc, 50%, 75%)')).toBeNull();
    });
  });

  describe('colorToHsvString', () => {
    it('formats hsv with two decimal places, trimmed by Number()', () => {
      const result = colorToHsvString({ h: 180, s: 50, v: 75, a: 1 });
      expect(result).toBe('hsv(180, 50, 75, 1)');
    });

    it('keeps meaningful decimals', () => {
      const result = colorToHsvString({ h: 120.5, s: 50.25, v: 75.1, a: 0.75 });
      expect(result).toBe('hsv(120.5, 50.25, 75.1, 0.75)');
    });
  });

  describe('colorToRgbString', () => {
    it('formats rgb without alpha when alpha is 1', () => {
      const result = colorToRgbString({ r: 255, g: 0, b: 0, a: 1 });
      expect(result).toBe('rgb(255, 0, 0)');
    });

    it('formats rgba when alpha is not 1', () => {
      const result = colorToRgbString({ r: 255, g: 0, b: 0, a: 0.5 });
      expect(result).toBe('rgba(255, 0, 0, 0.5)');
    });

    it('keeps meaningful decimals', () => {
      const result = colorToRgbString({ r: 255.5, g: 128.25, b: 64.1, a: 0.75 });
      expect(result).toBe('rgba(255.5, 128.25, 64.1, 0.75)');
    });
  });

  describe('stringToRgbColor', () => {
    it('parses rgb(r, g, b) format', () => {
      const result = stringToRgbColor('rgb(255, 128, 64)');
      expect(result).not.toBeNull();
      expect(result!.r).toBe(255);
      expect(result!.g).toBe(128);
      expect(result!.b).toBe(64);
      expect(result!.a).toBe(1.0);
    });

    it('parses rgba(r, g, b, a) format', () => {
      const result = stringToRgbColor('rgba(255, 128, 64, 0.75)');
      expect(result).not.toBeNull();
      expect(result!.r).toBe(255);
      expect(result!.g).toBe(128);
      expect(result!.b).toBe(64);
      expect(result!.a).toBe(0.75);
    });

    it('parses without spaces', () => {
      const result = stringToRgbColor('rgb(0,0,0)');
      expect(result).not.toBeNull();
      expect(result!.r).toBe(0);
      expect(result!.g).toBe(0);
      expect(result!.b).toBe(0);
    });

    it('rejects r > 255', () => {
      expect(stringToRgbColor('rgb(256, 0, 0)')).toBeNull();
    });

    it('rejects negative r', () => {
      expect(stringToRgbColor('rgb(-1, 0, 0)')).toBeNull();
    });

    it('rejects g > 255', () => {
      expect(stringToRgbColor('rgb(0, 256, 0)')).toBeNull();
    });

    it('rejects b > 255', () => {
      expect(stringToRgbColor('rgb(0, 0, 256)')).toBeNull();
    });

    it('rejects alpha > 1', () => {
      expect(stringToRgbColor('rgba(0, 0, 0, 1.1)')).toBeNull();
    });

    it('rejects negative alpha', () => {
      expect(stringToRgbColor('rgba(0, 0, 0, -0.1)')).toBeNull();
    });

    it('rejects invalid format', () => {
      expect(stringToRgbColor('blue')).toBeNull();
    });

    it('handles case-insensitive function name', () => {
      const result = stringToRgbColor('RGB(100, 200, 50)');
      expect(result).not.toBeNull();
      expect(result!.r).toBe(100);
    });

    it('returns null for empty string', () => {
      expect(stringToRgbColor('')).toBeNull();
    });
  });

  describe('colorToString', () => {
    it('returns rgb string for rgb mode', () => {
      const color = {
        hex: '#ff0000',
        rgb: { r: 255, g: 0, b: 0, a: 1 },
        hsv: { h: 0, s: 100, v: 100, a: 1 },
      };
      expect(colorToString(color, 'rgb')).toBe('rgb(255, 0, 0)');
    });

    it('returns hsv string for hsv mode', () => {
      const color = {
        hex: '#ff0000',
        rgb: { r: 255, g: 0, b: 0, a: 1 },
        hsv: { h: 0, s: 100, v: 100, a: 1 },
      };
      expect(colorToString(color, 'hsv')).toBe('hsv(0, 100, 100, 1)');
    });

    it('returns hex string for hex mode', () => {
      const color = {
        hex: '#ff0000',
        rgb: { r: 255, g: 0, b: 0, a: 1 },
        hsv: { h: 0, s: 100, v: 100, a: 1 },
      };
      expect(colorToString(color, 'hex')).toBe('#ff0000');
    });
  });

  describe('sortStops', () => {
    it('returns -1 when a has lower offset', () => {
      const a: GradientStop = { id: 'a', color: 'red', offset: 10 };
      const b: GradientStop = { id: 'b', color: 'blue', offset: 50 };
      expect(sortStops(a, b)).toBe(-1);
    });

    it('returns 1 when a has higher offset', () => {
      const a: GradientStop = { id: 'a', color: 'red', offset: 80 };
      const b: GradientStop = { id: 'b', color: 'blue', offset: 20 };
      expect(sortStops(a, b)).toBe(1);
    });

    it('returns 0 when offsets are equal', () => {
      const a: GradientStop = { id: 'a', color: 'red', offset: 50 };
      const b: GradientStop = { id: 'b', color: 'blue', offset: 50 };
      expect(sortStops(a, b)).toBe(0);
    });
  });

  describe('moveGradientStop', () => {
    const track = { left: 100, width: 200, min: 0, max: 100, step: 1 };

    it.each([
      {
        direction: 'left',
        clientX: 120,
        expected: [
          { id: 'b', color: '#00ff00', offset: 10 },
          { id: 'a', color: '#ff0000', offset: 20 },
          { id: 'c', color: '#0000ff', offset: 80 },
        ],
      },
      {
        direction: 'right',
        clientX: 280,
        expected: [
          { id: 'a', color: '#ff0000', offset: 20 },
          { id: 'c', color: '#0000ff', offset: 80 },
          { id: 'b', color: '#00ff00', offset: 90 },
        ],
      },
    ])(
      'reorders a stop crossing its $direction neighbor without changing other data',
      ({ clientX, expected }) => {
        const stops: GradientStop[] = [
          { id: 'a', color: '#ff0000', offset: 20 },
          { id: 'b', color: '#00ff00', offset: 50 },
          { id: 'c', color: '#0000ff', offset: 80 },
        ];

        const result = moveGradientStop(stops, 1, { ...track, clientX });

        expect(result).toEqual(expected);
        expect(stops).toEqual([
          { id: 'a', color: '#ff0000', offset: 20 },
          { id: 'b', color: '#00ff00', offset: 50 },
          { id: 'c', color: '#0000ff', offset: 80 },
        ]);
      }
    );

    it('maps the pointer into a custom range and rounds to the configured step', () => {
      const stops: GradientStop[] = [{ id: 'a', color: '#ff0000', offset: 10 }];

      expect(
        moveGradientStop(stops, 0, { ...track, clientX: 200, min: 10, max: 90, step: 15 })
      ).toEqual([{ id: 'a', color: '#ff0000', offset: 45 }]);
    });

    it.each([
      { clientX: 50, expectedOffset: 10 },
      { clientX: 350, expectedOffset: 100 },
    ])(
      'clamps an out-of-track drag at $clientX after step rounding',
      ({ clientX, expectedOffset }) => {
        const stops: GradientStop[] = [{ id: 'a', color: '#ff0000', offset: 50 }];

        expect(
          moveGradientStop(stops, 0, { ...track, clientX, min: 10, max: 100, step: 60 })
        ).toEqual([{ id: 'a', color: '#ff0000', offset: expectedOffset }]);
      }
    );
  });

  describe('getGradientColor', () => {
    it('returns single stop color directly', () => {
      const value: GradientValue = {
        type: 'linear',
        rotation: 90,
        colorStops: [{ id: 's1', color: '#ff0000', offset: 0 }],
      };
      expect(getGradientColor(value)).toBe('#ff0000');
    });

    it('generates linear-gradient CSS for multiple stops', () => {
      const value: GradientValue = {
        type: 'linear',
        rotation: 180,
        colorStops: [
          { id: 's1', color: 'red', offset: 0 },
          { id: 's2', color: 'blue', offset: 100 },
        ],
      };
      const result = getGradientColor(value);
      expect(result).toBe('linear-gradient(180deg, red 0%, blue 100%)');
    });

    it('generates radial-gradient CSS for radial type', () => {
      const value: GradientValue = {
        type: 'radial',
        rotation: 0,
        colorStops: [
          { id: 's1', color: 'red', offset: 0 },
          { id: 's2', color: 'blue', offset: 100 },
        ],
      };
      const result = getGradientColor(value);
      expect(result).toBe('radial-gradient(circle, red 0%, blue 100%)');
    });

    it('handles three or more stops', () => {
      const value: GradientValue = {
        type: 'linear',
        rotation: 45,
        colorStops: [
          { id: 's1', color: 'red', offset: 0 },
          { id: 's2', color: 'green', offset: 50 },
          { id: 's3', color: 'blue', offset: 100 },
        ],
      };
      const result = getGradientColor(value);
      expect(result).toBe('linear-gradient(45deg, red 0%, green 50%, blue 100%)');
    });
  });

  describe('cssGradientToImage', () => {
    afterEach(() => {
      vi.restoreAllMocks();
    });

    function setupCanvas() {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('Canvas mock must provide a 2D context.');

      // Keep vitest-canvas-mock's canvas implementation and inspect the exported canvas.
      vi.spyOn(document, 'createElement').mockReturnValueOnce(canvas);
      return { canvas, ctx };
    }

    it('throws when canvas 2d context is unavailable', () => {
      vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValueOnce(null);
      const value: GradientValue = {
        type: 'linear',
        rotation: 90,
        colorStops: [{ id: 's1', color: 'red', offset: 0 }],
      };

      expect(() => cssGradientToImage(value, 100, 100, 'png')).toThrow(
        'Could not get 2D rendering context from canvas.'
      );
    });

    it.each([
      { rotation: 45, endpoints: [30, 150, 210, -30] },
      { rotation: 90, endpoints: [60, 60, 180, 60] },
    ])('creates a linear gradient at $rotation degrees', ({ rotation, endpoints }) => {
      const { ctx } = setupCanvas();
      const value: GradientValue = {
        type: 'linear',
        rotation,
        colorStops: [
          { id: 's1', color: 'red', offset: 0 },
          { id: 's2', color: 'blue', offset: 100 },
        ],
      };

      cssGradientToImage(value, 240, 120, 'png');

      expect(ctx.createLinearGradient).toHaveBeenCalledTimes(1);
      expect(ctx.createLinearGradient).toHaveBeenCalledWith(
        ...endpoints.map((coordinate) => expect.closeTo(coordinate, 8))
      );
      expect(ctx.createRadialGradient).not.toHaveBeenCalled();
      expect(ctx.fillStyle).toBe(vi.mocked(ctx.createLinearGradient).mock.results[0].value);
    });

    it('keeps legacy gradients with a missing type linear', () => {
      const { ctx } = setupCanvas();
      const value = {
        rotation: 90,
        colorStops: [
          { id: 's1', color: 'red', offset: 0 },
          { id: 's2', color: 'blue', offset: 100 },
        ],
      };

      // @ts-expect-error Legacy stored gradients can lack the now-required type field.
      cssGradientToImage(value, 240, 120, 'png');

      expect(ctx.createLinearGradient).toHaveBeenCalledTimes(1);
      expect(ctx.createLinearGradient).toHaveBeenCalledWith(60, 60, 180, 60);
      expect(ctx.createRadialGradient).not.toHaveBeenCalled();
    });

    it.each([
      { width: 240, height: 120, centerX: 120, centerY: 60, radius: 60 },
      { width: 120, height: 240, centerX: 60, centerY: 120, radius: 60 },
    ])(
      'creates a centered radial gradient for a $width by $height image',
      ({ width, height, centerX, centerY, radius }) => {
        const { ctx } = setupCanvas();
        const value: GradientValue = {
          type: 'radial',
          rotation: 45,
          colorStops: [
            { id: 's1', color: 'red', offset: 0 },
            { id: 's2', color: 'blue', offset: 100 },
          ],
        };

        cssGradientToImage(value, width, height, 'png');

        expect(ctx.createRadialGradient).toHaveBeenCalledTimes(1);
        expect(ctx.createRadialGradient).toHaveBeenCalledWith(
          centerX,
          centerY,
          0,
          centerX,
          centerY,
          radius
        );
        expect(ctx.createLinearGradient).not.toHaveBeenCalled();
        expect(ctx.fillStyle).toBe(vi.mocked(ctx.createRadialGradient).mock.results[0].value);
      }
    );

    it('fills and exports the requested non-square canvas dimensions', () => {
      const { canvas, ctx } = setupCanvas();
      const value: GradientValue = {
        type: 'linear',
        rotation: 0,
        colorStops: [{ id: 's1', color: 'red', offset: 50 }],
      };

      cssGradientToImage(value, 70, 130, 'png');

      expect(canvas.width).toBe(70);
      expect(canvas.height).toBe(130);
      expect(ctx.fillRect).toHaveBeenCalledTimes(1);
      expect(ctx.fillRect).toHaveBeenCalledWith(0, 0, 70, 130);
      expect(canvas.toDataURL).toHaveBeenCalledTimes(1);
      expect(canvas.toDataURL).toHaveBeenCalledWith('image/png');
    });

    it.each(['png', 'jpeg', 'webp'] as const)('returns an image/%s data URL', (format) => {
      const { canvas } = setupCanvas();
      const value: GradientValue = {
        type: 'linear',
        rotation: 90,
        colorStops: [{ id: 's1', color: 'red', offset: 0 }],
      };

      const result = cssGradientToImage(value, 100, 100, format);

      expect(canvas.toDataURL).toHaveBeenCalledWith(`image/${format}`);
      expect(result).toMatch(new RegExp(`^data:image/${format};base64,`));
    });

    it.each(['linear', 'radial'] as const)(
      'normalizes and clamps %s stop offsets while preserving colors',
      (type) => {
        const { ctx } = setupCanvas();
        const value: GradientValue = {
          type,
          rotation: 90,
          colorStops: [
            { id: 's1', color: 'red', offset: -10 },
            { id: 's2', color: '#00ff00', offset: 0 },
            { id: 's3', color: 'rgba(0, 0, 255, 0.5)', offset: 25 },
            { id: 's4', color: '#ffffff', offset: 100 },
            { id: 's5', color: 'blue', offset: 150 },
          ],
        };

        cssGradientToImage(value, 100, 100, 'png');

        const gradient = ctx.fillStyle;
        if (!(gradient instanceof CanvasGradient)) {
          throw new Error('Expected the canvas to be filled with the created gradient.');
        }
        expect(vi.mocked(gradient.addColorStop).mock.calls).toEqual([
          [0, 'red'],
          [0, '#00ff00'],
          [0.25, 'rgba(0, 0, 255, 0.5)'],
          [1, '#ffffff'],
          [1, 'blue'],
        ]);
      }
    );
  });
});
