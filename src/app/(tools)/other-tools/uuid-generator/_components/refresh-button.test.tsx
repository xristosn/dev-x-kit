import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, test, vi } from 'vitest';
import { RefreshPageButton } from './refresh-button';

const { refresh } = vi.hoisted(() => ({ refresh: vi.fn() }));

vi.mock('next/navigation', () => ({
  useRouter: () => ({ refresh }),
}));

describe('<RefreshPageButton />', () => {
  test('refreshes the page when clicked', () => {
    render(<RefreshPageButton />);

    fireEvent.click(screen.getByTestId('uuid-refresh-page'));

    expect(refresh).toHaveBeenCalledOnce();
  });
});
