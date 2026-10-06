import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, test, vi } from 'vitest';
import { ColorDialog } from './color-dialog';
import type { IColorHsv, IColorRgb } from '@/components/color/utils';

vi.mock('@/components/color/utils', () => ({
  colorToRgbString: (c: IColorRgb) => `rgb(${c.r}, ${c.g}, ${c.b})`,
  colorToHsvString: (c: IColorHsv) => `hsv(${c.h}, ${c.s}%, ${c.v}%)`,
}));

describe('<ColorDialog />', () => {
  test('renders trigger with children', () => {
    render(
      <ColorDialog color="#3b82f6" name="Blue">
        <span data-testid="trigger">Open</span>
      </ColorDialog>
    );
    expect(screen.getByTestId('trigger')).toBeInTheDocument();
  });

  test('renders color name in dialog title when opened', async () => {
    const user = userEvent.setup();
    render(
      <ColorDialog color="#ff0000" name="Red">
        <span data-testid="trigger">Open</span>
      </ColorDialog>
    );
    await user.click(screen.getByTestId('trigger'));
    expect(screen.getByTestId('color-dialog-title')).toHaveTextContent('Red');
  });

  test('renders hex, rgb, hsv labels', async () => {
    const user = userEvent.setup();
    render(
      <ColorDialog color="#00ff00" name="Green">
        <span data-testid="trigger">Open</span>
      </ColorDialog>
    );
    await user.click(screen.getByTestId('trigger'));
    expect(screen.getByTestId('color-dialog-value-hex')).toHaveTextContent('HEX');
    expect(screen.getByTestId('color-dialog-value-rgb')).toHaveTextContent('RGB');
    expect(screen.getByTestId('color-dialog-value-hsv')).toHaveTextContent('HSV');
  });
});
