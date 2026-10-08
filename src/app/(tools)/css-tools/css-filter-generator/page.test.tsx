import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { USER_STORAGE_PREFS_KEY } from '@/lib/constants';
import { MAX_FILTERS } from './_lib/utils';
import CssFilterGeneratorPage from './page';

describe('<CssFilterGeneratorPage />', () => {
  beforeEach(() => {
    window.localStorage.setItem(USER_STORAGE_PREFS_KEY, JSON.stringify('local'));
    window.localStorage.removeItem('css-filter-generator');
  });

  afterEach(() => {
    window.localStorage.removeItem('css-filter-generator');
    window.localStorage.removeItem(USER_STORAGE_PREFS_KEY);
  });

  it('renders a live illustration and initial code output', async () => {
    render(<CssFilterGeneratorPage />);

    expect(screen.getByTestId('filter-preview-image')).toHaveStyle({ filter: 'none' });
    expect(screen.getByTestId('filter-empty-state')).toBeInTheDocument();
    expect(await screen.findByTestId('code-display-output')).toHaveTextContent('filter: none;');
    expect(screen.getByTestId('faq-section')).toBeInTheDocument();
  });

  it('adds, edits, reorders, and removes filters while updating the preview and exports', async () => {
    const user = userEvent.setup();
    render(<CssFilterGeneratorPage />);

    await user.click(screen.getByTestId('filter-type-select-trigger'));
    await user.click(await screen.findByTestId('filter-type-option-brightness'));
    await user.click(screen.getByTestId('filter-add'));
    await user.click(screen.getByTestId('filter-type-select-trigger'));
    await user.click(await screen.findByTestId('filter-type-option-blur'));
    await user.click(screen.getByTestId('filter-add'));

    expect(screen.getByTestId('filter-entry-0')).toBeInTheDocument();
    expect(screen.getByTestId('filter-entry-1')).toBeInTheDocument();

    const brightnessValue = screen.getByTestId('filter-0-value');
    await user.clear(brightnessValue);
    await user.type(brightnessValue, '140');

    expect(screen.getByTestId('filter-preview-image')).toHaveStyle({
      filter: 'brightness(140%) blur(4px)',
    });

    await user.click(screen.getByTestId('filter-move-down-0'));
    expect(screen.getByTestId('filter-preview-image')).toHaveStyle({
      filter: 'blur(4px) brightness(140%)',
    });

    expect(await screen.findByTestId('code-display-output')).toHaveTextContent(
      'filter: blur(4px) brightness(140%);'
    );

    await user.click(screen.getByTestId('code-display-select-trigger'));
    await user.click(await screen.findByTestId('code-display-option-Tailwind CSS'));
    expect(await screen.findByTestId('code-display-output')).toHaveTextContent(
      '[filter:blur(4px)_brightness(140%)]'
    );

    await user.click(screen.getByTestId('filter-remove-0'));
    expect(screen.getByTestId('filter-preview-image')).toHaveStyle({ filter: 'brightness(140%)' });
  }, 15000);

  it('accepts a raw CSS expression without appending a unit', async () => {
    const user = userEvent.setup();
    render(<CssFilterGeneratorPage />);

    await user.click(screen.getByTestId('filter-add'));
    await user.selectOptions(screen.getByTestId('filter-0-value-unit'), 'custom');
    const blurValue = screen.getByTestId('filter-0-value');
    await user.clear(blurValue);
    await user.type(blurValue, 'calc(1rem + 2px)');

    expect(screen.getByTestId('filter-preview-image')).toHaveStyle({
      filter: 'blur(calc(1rem + 2px))',
    });
  });

  it('keeps the editor function-chain-only and applies presets as replacements', async () => {
    const user = userEvent.setup();
    render(<CssFilterGeneratorPage />);

    expect(screen.queryByTestId('filter-mode-trigger')).not.toBeInTheDocument();
    expect(screen.queryByTestId('filter-keyword-trigger')).not.toBeInTheDocument();
    expect(screen.getByTestId('filter-type-select-trigger')).toBeInTheDocument();
    expect(screen.getByTestId('filter-list-scroll')).toHaveClass(
      'max-h-[32rem]',
      'overflow-y-auto'
    );

    await user.click(screen.getByTestId('filter-add'));
    await user.click(screen.getByTestId('filter-preset-grayscale'));

    expect(screen.getByTestId('filter-entry-0')).toBeInTheDocument();
    expect(screen.queryByTestId('filter-entry-1')).not.toBeInTheDocument();
    expect(screen.getByTestId('filter-preview-image')).toHaveStyle({ filter: 'grayscale(100%)' });
    expect(await screen.findByTestId('code-display-output')).toHaveTextContent(
      'filter: grayscale(100%);'
    );
    expect(screen.getByTestId('filter-preset-subtle')).toBeInTheDocument();
    expect(screen.getByTestId('filter-preset-warm')).toBeInTheDocument();
    expect(screen.getByTestId('filter-preset-cool')).toBeInTheDocument();
    expect(screen.getByTestId('filter-preset-vintage')).toBeInTheDocument();
    expect(screen.getByTestId('filter-preset-vivid')).toBeInTheDocument();
    expect(screen.getByTestId('filter-preset-dramatic')).toBeInTheDocument();
    expect(screen.getByTestId('filter-preset-soft-focus')).toBeInTheDocument();
  });

  it('disables adding filters when the chain reaches its maximum', () => {
    const filters = Array.from({ length: MAX_FILTERS }, (_, index) => ({
      id: `stored-${index}`,
      type: 'blur',
      value: '2',
      unit: 'px',
    }));
    window.localStorage.setItem('css-filter-generator', JSON.stringify({ filters }));

    render(<CssFilterGeneratorPage />);

    expect(screen.getByTestId('filter-count')).toHaveTextContent(
      `${MAX_FILTERS} / ${MAX_FILTERS} filters`
    );
    expect(screen.getByTestId('filter-add')).toBeDisabled();
    expect(screen.getByTestId(`filter-entry-${MAX_FILTERS - 1}`)).toBeInTheDocument();
  });
});
