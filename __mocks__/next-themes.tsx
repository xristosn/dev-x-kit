import { vi } from 'vitest';

type Theme = 'light' | 'dark' | 'system';

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => children;

export const useTheme = () => ({
  resolvedTheme: 'light' as Theme,
  theme: 'light' as Theme,
  setTheme: vi.fn(),
  systemTheme: 'light' as Theme,
});
