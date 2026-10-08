import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, test, vi } from 'vitest';
import { CSSTriangle } from './css-triangle';

vi.mock('react-color-palette', async (importOriginal) => {
  const actual = await importOriginal<typeof import('react-color-palette')>();
  return {
    ...actual,
    ColorPicker: () => <div data-testid="color-picker" />,
  };
});

describe('<CSSTriangle />', () => {
  afterEach(() => {
    window.localStorage.clear();
    window.sessionStorage.clear();
  });

  test('renders the default triangle dimensions and color', () => {
    render(<CSSTriangle />);

    expect(screen.getByTestId('css-triangle-width')).toHaveValue(200);
    expect(screen.getByTestId('css-triangle-height')).toHaveValue(200);
    expect(screen.getByTestId('hex-input')).toHaveValue('#4a94e2');
    expect(screen.getByTestId('css-triangle-color-preview')).toHaveStyle({
      backgroundColor: '#4a94e2',
    });
    const triangle = screen.getByTestId('css-triangle-preview');
    expect(triangle.style.borderWidth).toBe('100px 0px 100px 200px');
    expect(triangle.style.borderColor).toBe(
      'transparent transparent transparent rgb(74, 148, 226)'
    );
  });

  test('updates the preview when the dimensions and direction change', async () => {
    const user = userEvent.setup();
    render(<CSSTriangle />);

    const widthInput = screen.getByTestId('css-triangle-width');
    const heightInput = screen.getByTestId('css-triangle-height');
    await user.clear(widthInput);
    await user.type(widthInput, '300');
    await user.clear(heightInput);
    await user.type(heightInput, '120');
    await user.click(screen.getByTestId('css-triangle-direction'));
    await user.click(screen.getByTestId('css-triangle-direction-option-up'));

    const triangle = screen.getByTestId('css-triangle-preview');
    expect(triangle.style.borderWidth).toBe('0px 150px 120px');
    expect(triangle.style.borderColor).toBe('transparent transparent rgb(74, 148, 226)');
  });

  test('renders and updates the OKLCH color inputs', async () => {
    const user = userEvent.setup();
    render(<CSSTriangle />);

    const lightness = screen.getByTestId('oklch-input-l');
    const chroma = screen.getByTestId('oklch-input-c');
    const hue = screen.getByTestId('oklch-input-h');

    expect(lightness).toBeInTheDocument();
    expect(chroma).toBeInTheDocument();
    expect(hue).toBeInTheDocument();

    await user.clear(chroma);
    await user.type(chroma, '0.4');

    expect(chroma).toHaveValue(0.4);
  });

  test('renders and updates the OKLab color inputs', async () => {
    const user = userEvent.setup();
    render(<CSSTriangle />);

    const lightness = screen.getByTestId('oklab-input-l');
    const a = screen.getByTestId('oklab-input-a');
    const b = screen.getByTestId('oklab-input-b');

    expect(lightness).toBeInTheDocument();
    expect(a).toBeInTheDocument();
    expect(b).toBeInTheDocument();

    await user.clear(a);
    await user.type(a, '0.2');

    expect(a).toHaveValue(0.2);
  });

  test('updates the triangle and color preview when the color changes', async () => {
    const user = userEvent.setup();
    render(<CSSTriangle />);

    const hexInput = screen.getByTestId('hex-input');
    await user.clear(hexInput);
    await user.paste('#ff0000');
    await user.tab();

    expect(hexInput).toHaveValue('#ff0000');
    expect(screen.getByTestId('css-triangle-color-preview').style.backgroundColor).toBe(
      'rgb(255, 0, 0)'
    );
    expect(screen.getByTestId('css-triangle-preview').style.borderColor).toBe(
      'transparent transparent transparent rgb(255, 0, 0)'
    );
  });
});
