import { render } from '@testing-library/react';
import { afterEach, describe, expect, test } from 'vitest';
import PaletteGenerator from './page';

describe('<PaletteGenerator />', () => {
  afterEach(() => {
    window.localStorage.clear();
    window.sessionStorage.clear();
  });

  test('keeps stored CSS color strings in the palette state', () => {
    const storedValue = {
      theme: 'dark',
      light: { primaryColor: 'oklch(65% 0.2 250)', bgColor: '#f2f2f2' },
      dark: { primaryColor: 'oklab(50% 0.1 -0.1)', bgColor: '#000000' },
    };
    window.localStorage.setItem('palette-generator', JSON.stringify(storedValue));

    render(<PaletteGenerator />);

    expect(JSON.parse(window.localStorage.getItem('palette-generator') ?? '')).toEqual(storedValue);
  });
});
