import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, test } from 'vitest';
import { Providers } from './providers';
import { ThemeModeToggle } from './theme-mode-toggle';

describe('<ThemeModeToggle />', () => {
  const renderComponent = () => render(<ThemeModeToggle />, { wrapper: Providers });

  describe('rendering', () => {
    test('renders trigger button', () => {
      const { getByTestId } = renderComponent();
      expect(getByTestId('theme-toggle-trigger')).toBeInTheDocument();
    });
  });

  describe('interaction', () => {
    test('clicking light theme button switches theme to light', async () => {
      const user = userEvent.setup({ delay: 50 });
      const { getByTestId } = renderComponent();

      await user.click(getByTestId('theme-toggle-trigger'));

      await user.click(getByTestId('theme-option-light'));

      expect(document.documentElement.classList.toString()).include('light');
    });

    test('clicking dark theme button switches theme to dark', async () => {
      const user = userEvent.setup({ delay: 50 });
      const { getByTestId } = renderComponent();

      await user.click(getByTestId('theme-toggle-trigger'));

      await user.click(getByTestId('theme-option-dark'));

      expect(document.documentElement.classList.toString()).include('dark');
    });
  });
});
