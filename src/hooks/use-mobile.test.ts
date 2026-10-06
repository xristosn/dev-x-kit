import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useIsMobile } from './use-mobile';

describe('<use-mobile />', () => {
  let originalInnerWidth: number;
  let matchMediaMockImpl: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    originalInnerWidth = window.innerWidth;
    matchMediaMockImpl = vi.fn().mockImplementation((query: string) => ({
      matches: false,
      media: query,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }));
    vi.stubGlobal('matchMedia', matchMediaMockImpl);
  });

  afterEach(() => {
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: originalInnerWidth,
    });
    vi.unstubAllGlobals();
  });

  describe('useIsMobile', () => {
    it('returns false when window width is above mobile breakpoint', () => {
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 1024,
      });
      const { result } = renderHook(() => useIsMobile());
      expect(result.current).toBe(false);
    });

    it('returns true when window width is below mobile breakpoint', () => {
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 500,
      });
      const { result } = renderHook(() => useIsMobile());
      expect(result.current).toBe(true);
    });

    it('updates to true when resized below breakpoint', () => {
      const callbacks: Array<() => void> = [];
      matchMediaMockImpl.mockImplementation((query: string) => ({
        matches: query.includes('max-width'),
        media: query,
        addEventListener: vi.fn((event, cb) => {
          if (event === 'change') callbacks.push(cb);
        }),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      }));

      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 1024,
      });
      const { result } = renderHook(() => useIsMobile());
      expect(result.current).toBe(false);

      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 500,
      });
      callbacks.forEach((cb) => act(() => cb()));
      expect(result.current).toBe(true);
    });
  });
});
