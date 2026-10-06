import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { USER_STORAGE_PREFS_KEY } from '@/lib/constants';
import CssBackgroundPatternGenerator from './page';

describe('<CssBackgroundPatternGenerator />', () => {
  beforeEach(() => {
    window.localStorage.setItem(USER_STORAGE_PREFS_KEY, JSON.stringify('local'));
    window.localStorage.removeItem('css-bg-pattern');
  });

  afterEach(() => {
    window.localStorage.removeItem('css-bg-pattern');
    window.localStorage.removeItem(USER_STORAGE_PREFS_KEY);
  });

  it('renders the default pattern preview and size', () => {
    render(<CssBackgroundPatternGenerator />);

    expect(screen.getByTestId('pattern-preview').style.backgroundImage).toContain(
      'radial-gradient'
    );
    expect(screen.getByTestId('pattern-size-value')).toHaveTextContent('100px');
    expect(screen.queryByTestId('pattern-rotation-control')).not.toBeInTheDocument();
    expect(screen.queryByTestId('pattern-stroke-input')).not.toBeInTheDocument();
  });

  it('shows rotation and stroke controls only for supported patterns', async () => {
    const user = userEvent.setup();
    render(<CssBackgroundPatternGenerator />);

    await user.click(screen.getByTestId('pattern-select-trigger'));
    await user.click(await screen.findByTestId('pattern-option-stripes'));

    expect(screen.getByTestId('pattern-rotation-control')).toBeInTheDocument();
    expect(screen.queryByTestId('pattern-stroke-input')).not.toBeInTheDocument();
    expect(screen.getByTestId('pattern-preview').style.backgroundImage).toContain(
      'repeating-linear-gradient'
    );

    await user.click(screen.getByTestId('pattern-select-trigger'));
    await user.click(await screen.findByTestId('pattern-option-dots'));

    expect(screen.queryByTestId('pattern-rotation-control')).not.toBeInTheDocument();
    expect(screen.getByTestId('pattern-stroke-input')).toBeInTheDocument();
    expect(screen.getByTestId('pattern-preview').style.backgroundImage).toContain(
      'radial-gradient'
    );
  });

  it('updates the preview when the pattern size changes', () => {
    render(<CssBackgroundPatternGenerator />);

    fireEvent.change(screen.getByTestId('pattern-size-input'), { target: { value: '120' } });

    expect(screen.getByTestId('pattern-size-value')).toHaveTextContent('120px');
    expect(screen.getByTestId('pattern-preview').style.backgroundSize).toBe('120px 120px');
  });
});
