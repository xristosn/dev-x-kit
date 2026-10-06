import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { USER_STORAGE_PREFS_KEY } from '@/lib/constants';
import { SHADOWS_DEFAULT_VALUE } from './_lib/utils';
import SmoothShadowEditor from './page';

const STORAGE_KEY = 'smooth-shadow-editor';

describe('<SmoothShadowEditor />', () => {
  beforeEach(() => {
    window.localStorage.setItem(USER_STORAGE_PREFS_KEY, JSON.stringify('local'));
    window.localStorage.removeItem(STORAGE_KEY);
  });

  afterEach(() => {
    window.localStorage.removeItem(STORAGE_KEY);
    window.localStorage.removeItem(USER_STORAGE_PREFS_KEY);
  });

  it('renders the default preview and controls', async () => {
    render(<SmoothShadowEditor />);

    expect(await screen.findByTestId('shadow-preview')).toBeInTheDocument();
    expect(screen.getByTestId('shadow-layers-input')).toHaveValue(5);
    expect(screen.getByTestId('shadow-opacity-input')).toHaveValue(0.08);
    expect(screen.getByTestId('shadow-blur-input')).toHaveValue(34);
    expect(screen.getByTestId('shadow-offsetx-input')).toHaveValue(24);
    expect(screen.getByTestId('shadow-offsety-input')).toHaveValue(16);
    expect(screen.getByTestId('color-popover-input')).toHaveValue('#02050f');
    expect(screen.getByTestId('code-display-select-trigger')).toBeInTheDocument();
  });

  it('updates the preview and stored value when a numeric setting changes', () => {
    render(<SmoothShadowEditor />);

    fireEvent.change(screen.getByTestId('shadow-layers-input'), { target: { value: '2' } });

    expect(screen.getByTestId('shadow-layers-input')).toHaveValue(2);
    expect(screen.getByTestId('shadow-preview-box').style.boxShadow).toContain('rgba(2, 5, 15');
    expect(JSON.parse(window.localStorage.getItem(STORAGE_KEY)!)).toMatchObject({ layers: 2 });
  });

  it('clamps numeric settings to their supported range', () => {
    render(<SmoothShadowEditor />);

    fireEvent.change(screen.getByTestId('shadow-layers-input'), { target: { value: '13' } });

    expect(screen.getByTestId('shadow-layers-input')).toHaveValue(12);
    expect(JSON.parse(window.localStorage.getItem(STORAGE_KEY)!)).toMatchObject({ layers: 12 });
  });

  it('stores theme and radius selections', async () => {
    const user = userEvent.setup();
    render(<SmoothShadowEditor />);

    await user.click(screen.getByTestId('shadow-theme-dark'));
    await user.click(screen.getByTestId('shadow-radius-full'));

    expect(JSON.parse(window.localStorage.getItem(STORAGE_KEY)!)).toMatchObject({
      theme: 'dark',
      rounded: 'full',
    });
    expect(screen.getByTestId('shadow-theme-dark')).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByTestId('shadow-radius-full')).toHaveAttribute('aria-pressed', 'true');
  });

  it('resets changed settings to the defaults', async () => {
    const user = userEvent.setup();
    render(<SmoothShadowEditor />);

    fireEvent.change(screen.getByTestId('shadow-blur-input'), { target: { value: '80' } });
    await user.click(screen.getByTestId('shadow-radius-none'));
    await user.click(screen.getByTestId('shadow-reset'));

    expect(screen.getByTestId('shadow-blur-input')).toHaveValue(SHADOWS_DEFAULT_VALUE.blur);
    expect(window.localStorage.getItem(STORAGE_KEY)).toBeNull();
  });
});
