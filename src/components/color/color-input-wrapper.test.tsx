import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import type { IColor } from 'react-color-palette';
import { ColorInputWrapper } from './color-input-wrapper';

const color: IColor = {
  hex: '#3B82F6',
  rgb: { r: 59, g: 130, b: 246, a: 1 },
  hsv: { h: 217, s: 75, v: 96, a: 1 },
};

function renderWrapper(props: Partial<React.ComponentProps<typeof ColorInputWrapper>> = {}) {
  const setValue = vi.fn();

  render(
    <ColorInputWrapper
      id="color-input"
      label="HEX"
      error={false}
      value={color}
      setValue={setValue}
      colorMode="hex"
      {...props}
    >
      <input data-testid="color-input-field" />
    </ColorInputWrapper>
  );

  return { setValue };
}

describe('<ColorInputWrapper />', () => {
  describe('rendering', () => {
    it('renders the label and children', () => {
      renderWrapper();

      expect(screen.getByTestId('hex-input-label')).toHaveTextContent('HEX');
      expect(screen.getByTestId('color-input-field')).toBeInTheDocument();
    });

    it('shows the error indicator only when error is true', () => {
      const { rerender } = render(
        <ColorInputWrapper
          id="color-input"
          label="HEX"
          error={false}
          value={color}
          setValue={vi.fn()}
          colorMode="hex"
        />
      );

      expect(screen.queryByTestId('hex-error-btn')).not.toBeInTheDocument();

      rerender(
        <ColorInputWrapper
          id="color-input"
          label="HEX"
          error
          value={color}
          setValue={vi.fn()}
          colorMode="hex"
        />
      );

      expect(screen.getByTestId('hex-error-btn')).toBeInTheDocument();
    });

    it.each([
      ['hex', '#3B82F6'],
      ['rgb', 'rgb(59, 130, 246)'],
      ['hsv', 'hsv(217, 75, 96, 1)'],
    ] as const)('copies the current value in %s mode', async (colorMode, expectedValue) => {
      const user = userEvent.setup();
      const writeText = vi.fn().mockResolvedValue(undefined);
      vi.stubGlobal('navigator', { clipboard: { writeText } });

      renderWrapper({ colorMode });
      await user.click(screen.getByTestId('copy-button'));

      await waitFor(() => expect(writeText).toHaveBeenCalledWith(expectedValue));
    });
  });

  describe('paste', () => {
    it.each([
      ['#AABBCC', expect.objectContaining({ hex: '#AABBCC' })],
      ['rgb(170, 187, 204)', expect.objectContaining({ rgb: { r: 170, g: 187, b: 204, a: 1 } })],
      [
        'hsv(210, 17, 80)',
        expect.objectContaining({
          hsv: expect.objectContaining({ h: 210, s: 17, v: 80, a: 1 }),
        }),
      ],
    ])('converts a pasted color string: %s', (value, expectedColor) => {
      const { setValue } = renderWrapper();
      const input = screen.getByTestId('color-input-field');

      fireEvent.paste(input, { clipboardData: { getData: () => value } });

      expect(setValue).toHaveBeenCalledWith(expectedColor);
    });

    it.each(['', '   ', 'not a color'])('ignores blank or invalid input: %j', (value) => {
      const { setValue } = renderWrapper();

      fireEvent.paste(screen.getByTestId('color-input-field'), {
        clipboardData: { getData: () => value },
      });

      expect(setValue).not.toHaveBeenCalled();
    });
  });
});
