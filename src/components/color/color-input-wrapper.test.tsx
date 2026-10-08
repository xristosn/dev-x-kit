import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { ColorInputWrapper } from './color-input-wrapper';

const color = '#3B82F6';

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
    ['hex', /^#/],
    ['rgb', /^rgb\(/],
    ['hsv', /^hsv\(/],
    ['oklch', /^oklch\(/],
    ['oklab', /^oklab\(/],
  ] as const)('copies the current value in %s mode', async (colorMode, expectedValue) => {
    const user = userEvent.setup();
    const writeText = vi.fn().mockResolvedValue(undefined);
    vi.stubGlobal('navigator', { clipboard: { writeText } });

    renderWrapper({ colorMode, value: color });
    await user.click(screen.getByTestId('copy-button'));

    await waitFor(() =>
      expect(writeText).toHaveBeenCalledWith(expect.stringMatching(expectedValue))
    );
  });

  it.each([
    '#AABBCC',
    'rgb(170, 187, 204)',
    'hsv(210, 17, 80)',
    'oklch(70% 0.4 35)',
    'oklab(70% 0.1 -0.1)',
  ])('accepts a pasted CSS color: %s', (value) => {
    const { setValue } = renderWrapper();

    fireEvent.paste(screen.getByTestId('color-input-field'), {
      clipboardData: { getData: () => value },
    });

    expect(setValue).toHaveBeenCalledWith(expect.any(String));
    if (value.startsWith('ok')) expect(setValue).toHaveBeenCalledWith(value);
  });

  it.each(['', '   ', 'not a color'])('ignores blank or invalid input: %j', (value) => {
    const { setValue } = renderWrapper();

    fireEvent.paste(screen.getByTestId('color-input-field'), {
      clipboardData: { getData: () => value },
    });

    expect(setValue).not.toHaveBeenCalled();
  });
});
