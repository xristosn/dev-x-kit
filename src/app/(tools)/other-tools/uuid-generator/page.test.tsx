import { render, screen } from '@testing-library/react';
import { describe, expect, test, vi } from 'vitest';
import { validate } from 'uuid';
import UUIDGenerator from './page';

const { refresh } = vi.hoisted(() => ({ refresh: vi.fn() }));

vi.mock('next/navigation', () => ({
  useRouter: () => ({ refresh }),
}));

describe('<UUIDGenerator />', () => {
  test('renders valid UUIDs for the supported versions', () => {
    render(<UUIDGenerator />);

    const values = screen
      .getAllByTestId('uuid-card-value')
      .map((element) => element.textContent ?? '');
    const versions = values.map((value) => {
      expect(validate(value)).toBe(true);
      return value[14];
    });

    expect(versions.sort()).toEqual(['1', '3', '4', '4', '5', '6', '6', '7']);
  });
});
