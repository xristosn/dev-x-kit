import { vi } from 'vitest';

export const ColorPicker = () => <div data-testid="color-picker" />;

export const IColor: Record<string, never> = {};

export const ColorService = {
  convert: vi.fn((_format: string, value: unknown) => value),
};
