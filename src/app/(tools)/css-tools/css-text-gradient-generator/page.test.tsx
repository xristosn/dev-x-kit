import { act, fireEvent, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { hydrateRoot } from 'react-dom/client';
import { renderToString } from 'react-dom/server';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { USER_STORAGE_PREFS_KEY } from '@/lib/constants';
import CssTextGradientGeneratorPage from './page';

describe('<CssTextGradientGeneratorPage />', () => {
  beforeEach(() => {
    window.localStorage.setItem(USER_STORAGE_PREFS_KEY, JSON.stringify('local'));
    window.localStorage.removeItem('css-text-gradient-generator');
  });

  afterEach(() => {
    window.localStorage.removeItem('css-text-gradient-generator');
    window.localStorage.removeItem(USER_STORAGE_PREFS_KEY);
  });

  it('hydrates persisted radial settings without mismatching storage-dependent sections', async () => {
    window.localStorage.setItem(
      'css-text-gradient-generator',
      JSON.stringify({
        type: 'radial',
        position: 'top left',
        shape: 'circle',
        size: 'farthest-corner',
        stops: [
          { id: 'start', color: '#7c3aed', offset: 0 },
          { id: 'end', color: '#ec4899', offset: 100 },
        ],
      })
    );

    const container = document.createElement('div');
    container.innerHTML = renderToString(<CssTextGradientGeneratorPage />);
    document.body.append(container);
    const recoverableErrors: unknown[] = [];
    let root: ReturnType<typeof hydrateRoot> | undefined;

    try {
      expect(within(container).getByTestId('text-gradient-preview-fallback')).toBeInTheDocument();
      expect(
        within(container).getByTestId('text-gradient-mode-controls-fallback')
      ).toBeInTheDocument();
      expect(within(container).getByTestId('text-gradient-stops-fallback')).toBeInTheDocument();

      await act(async () => {
        root = hydrateRoot(container, <CssTextGradientGeneratorPage />, {
          onRecoverableError: (error) => recoverableErrors.push(error),
        });
      });

      expect(recoverableErrors).toHaveLength(0);
      expect(within(container).getByTestId('text-gradient-position-trigger')).toBeInTheDocument();
      expect(
        within(container).queryByTestId('text-gradient-direction-trigger')
      ).not.toBeInTheDocument();
    } finally {
      if (root) {
        const mountedRoot = root;
        await act(async () => mountedRoot.unmount());
      }
      container.remove();
    }
  });

  it('renders the default text preview, styles, code formats, and FAQs', async () => {
    render(<CssTextGradientGeneratorPage />);

    expect(screen.getByTestId('text-gradient-preview-text')).toHaveTextContent('Gradient Text');
    expect(screen.getByTestId('text-gradient-preview-text').style.backgroundImage).toContain(
      'linear-gradient(to right'
    );
    expect(screen.getByTestId('text-gradient-preview-text').style.backgroundClip).toBe('text');
    expect(screen.getByTestId('text-gradient-preview-text').style.webkitTextFillColor).toBe(
      'transparent'
    );
    expect(screen.getByTestId('code-display-select-trigger')).toBeInTheDocument();
    expect(await screen.findByTestId('code-display-output')).toHaveTextContent(
      'background-clip: text'
    );
    expect(screen.getByTestId('code-display-output')).toHaveTextContent(
      '-webkit-background-clip: text'
    );
    expect(screen.getByTestId('faq-section')).toBeInTheDocument();
  });

  it('provides Tailwind V3 classes for text clipping', async () => {
    const user = userEvent.setup();
    render(<CssTextGradientGeneratorPage />);

    await user.click(screen.getByTestId('code-display-select-trigger'));
    await user.click(await screen.findByTestId('code-display-option-Tailwind V3'));

    expect(await screen.findByTestId('code-display-output')).toHaveTextContent('bg-clip-text');
    expect(screen.getByTestId('code-display-output')).toHaveTextContent('text-transparent');
  });

  it('updates preview text and switches to the radial position controls', async () => {
    const user = userEvent.setup();
    render(<CssTextGradientGeneratorPage />);

    fireEvent.change(screen.getByTestId('text-gradient-preview-input'), {
      target: { value: 'Hello gradient' },
    });
    expect(screen.getByTestId('text-gradient-preview-text')).toHaveTextContent('Hello gradient');

    await user.click(screen.getByTestId('text-gradient-type-trigger'));
    await user.click(await screen.findByTestId('text-gradient-type-radial'));

    expect(screen.getByTestId('text-gradient-preview-text').style.backgroundImage).toContain(
      'radial-gradient'
    );
    expect(screen.getByTestId('text-gradient-position-trigger')).toBeInTheDocument();
    expect(screen.queryByTestId('text-gradient-direction-trigger')).not.toBeInTheDocument();
  });

  it('adds and removes editable color stops and applies presets', async () => {
    const user = userEvent.setup();
    render(<CssTextGradientGeneratorPage />);

    await user.click(screen.getByTestId('text-gradient-add-stop'));
    expect(screen.getByTestId('text-gradient-stop-2')).toBeInTheDocument();

    await user.click(screen.getByTestId('text-gradient-remove-stop-2'));
    expect(screen.queryByTestId('text-gradient-stop-2')).not.toBeInTheDocument();

    await user.click(screen.getByTestId('text-gradient-preset-sunset'));
    expect(screen.getByTestId('text-gradient-preview-text').style.backgroundImage).toContain(
      'rgb(249, 115, 22)'
    );
    expect(screen.getAllByTestId(/^text-gradient-stop-\d+$/)).toHaveLength(3);

    await user.click(screen.getByTestId('text-gradient-reset'));
    expect(screen.getByTestId('text-gradient-preview-text').style.backgroundImage).toContain(
      'linear-gradient(to right'
    );
    expect(screen.getAllByTestId(/^text-gradient-stop-\d+$/)).toHaveLength(2);
  });

  it('clamps edited stop offsets to the supported range', () => {
    render(<CssTextGradientGeneratorPage />);

    fireEvent.change(screen.getByTestId('text-gradient-stop-offset-0'), {
      target: { value: '150' },
    });

    expect(screen.getByTestId('text-gradient-stop-offset-0')).toHaveValue(100);
    expect(screen.getByTestId('text-gradient-preview-text').style.backgroundImage).toContain(
      'rgb(124, 58, 237) 100%'
    );
  });
});
