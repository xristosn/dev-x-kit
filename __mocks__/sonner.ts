import { vi } from 'vitest';

export const toast = {
  dismiss: vi.fn(),
  error: vi.fn(),
  success: vi.fn(),
  info: vi.fn(),
  warning: vi.fn(),
};

export const Toaster = () => null;

export const useSonner = () => ({ toasts: [], dismiss: vi.fn() });
