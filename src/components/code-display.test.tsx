import { act, render, screen, waitFor } from '@testing-library/react';
import { renderToStaticMarkup } from 'react-dom/server';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, test, vi } from 'vitest';
import { jssToCss } from '@/lib/actions/convert/jss';
import type { ActionError } from '@/lib/action-error';
import { CodeDisplay, CodeDisplayPreset } from './code-display';

vi.mock('@/lib/actions/convert/jss', () => ({
  jssToCss: vi.fn(async (input: string) => `.converted-${input} { color: red; }`),
  jssToTailwindV3: vi.fn(async () => '.tw { color: blue; }'),
}));

vi.mock('@/lib/constants', async (importOriginal) => ({
  ...(await importOriginal<typeof import('@/lib/constants')>()),
  CODE_DISPLAY_DEBOUNCE_MS: 0,
}));

describe('<CodeDisplay />', () => {
  describe('rendering', () => {
    test('renders select trigger and disabled copy button before conversion', () => {
      render(<CodeDisplay code="const a=1" outputs={[CodeDisplayPreset.JssToCss]} />);
      expect(screen.getByTestId('code-display-select-trigger')).toBeInTheDocument();
      expect(screen.getByTestId('code-display-copy')).toBeDisabled();
    });

    test('does not server-render the client-only copy button', () => {
      const container = document.createElement('div');
      container.innerHTML = renderToStaticMarkup(
        <CodeDisplay code="const a=1" outputs={[CodeDisplayPreset.JssToCss]} />
      );

      expect(container.querySelector('[data-testid="code-display-copy"]')).not.toBeInTheDocument();
    });
  });

  describe('conversion', () => {
    afterEach(() => {
      vi.resetAllMocks();
      vi.restoreAllMocks();
    });

    test('shows result after conversion completes', async () => {
      render(<CodeDisplay code="const x=1" outputs={[CodeDisplayPreset.JssToCss]} />);
      expect(await screen.findByTestId('code-display-output')).toHaveTextContent(
        '.converted-const x=1 { color: red; }'
      );
      expect(screen.queryByTestId('code-display-loading')).not.toBeInTheDocument();
      expect(screen.getByTestId('code-display-copy')).not.toBeDisabled();
    });

    test('changing code replaces the previous result with the new conversion', async () => {
      const convert = vi.mocked(jssToCss);
      const { rerender } = render(<CodeDisplay code="a" outputs={[CodeDisplayPreset.JssToCss]} />);
      expect(await screen.findByTestId('code-display-output')).toHaveTextContent(
        '.converted-a { color: red; }'
      );
      expect(convert).toHaveBeenNthCalledWith(1, 'a', { rawOutput: true });

      rerender(<CodeDisplay code="b" outputs={[CodeDisplayPreset.JssToCss]} />);

      await waitFor(() => {
        expect(convert).toHaveBeenNthCalledWith(2, 'b', { rawOutput: true });
        expect(screen.getByTestId('code-display-output')).toHaveTextContent(
          '.converted-b { color: red; }'
        );
      });
      expect(screen.getByTestId('code-display-output')).not.toHaveTextContent('.converted-a');
      expect(screen.queryByTestId('code-display-loading')).not.toBeInTheDocument();
      expect(screen.getByTestId('code-display-copy')).not.toBeDisabled();

      rerender(<CodeDisplay code="a" outputs={[CodeDisplayPreset.JssToCss]} />);
      await waitFor(() => {
        expect(convert).toHaveBeenNthCalledWith(3, 'a', { rawOutput: true });
        expect(screen.getByTestId('code-display-output')).toHaveTextContent(
          '.converted-a { color: red; }'
        );
      });
    });

    test('shows a generic ActionError and logs only its reference ID', async () => {
      const user = userEvent.setup();
      const writeText = vi.spyOn(navigator.clipboard, 'writeText');
      const reportError = vi.spyOn(console, 'error').mockImplementation(() => {});
      const actionError = {
        error: true,
        kind: 'unexpected',
        message: 'Unable to convert input. Please check your input and try again.',
        referenceId: 'error-reference-123',
      } satisfies ActionError;
      const convert = vi.mocked(jssToCss);
      const { rerender } = render(<CodeDisplay code="a" outputs={[CodeDisplayPreset.JssToCss]} />);
      expect(await screen.findByTestId('code-display-output')).toHaveTextContent('.converted-a');
      expect(screen.getByTestId('code-display-copy')).not.toBeDisabled();
      convert.mockResolvedValue(actionError);

      rerender(<CodeDisplay code="bad" outputs={[CodeDisplayPreset.JssToCss]} />);

      await waitFor(() => {
        expect(convert).toHaveBeenNthCalledWith(2, 'bad', { rawOutput: true });
        expect(screen.getByTestId('code-display-error')).toHaveTextContent(actionError.message);
        expect(screen.getByTestId('code-display-error')).not.toHaveTextContent(
          actionError.referenceId
        );
        expect(screen.getByTestId('code-display-output')).toBeEmptyDOMElement();
        expect(screen.queryByTestId('code-display-loading')).not.toBeInTheDocument();
      });
      expect(reportError).toHaveBeenCalledWith(
        '[Conversion Failed] Reference ID:',
        actionError.referenceId
      );
      expect(screen.getByTestId('code-display-copy')).toBeDisabled();
      await user.click(screen.getByTestId('code-display-copy'));
      expect(writeText).not.toHaveBeenCalled();
      expect(convert).toHaveBeenCalledTimes(2);

      convert.mockImplementation(async (input) => `.converted-${input} { color: red; }`);
      rerender(<CodeDisplay code="b" outputs={[CodeDisplayPreset.JssToCss]} />);

      await waitFor(() => {
        expect(screen.getByTestId('code-display-output')).toHaveTextContent(
          '.converted-b { color: red; }'
        );
      });
      expect(convert).toHaveBeenNthCalledWith(3, 'b', { rawOutput: true });
      expect(screen.queryByTestId('code-display-loading')).not.toBeInTheDocument();
      expect(screen.getByTestId('code-display-copy')).not.toBeDisabled();
    });

    describe('completed empty results', () => {
      afterEach(() => {
        vi.useRealTimers();
      });

      test.each([
        { name: 'an empty string', result: '' },
        {
          name: 'an ActionError',
          result: {
            error: true,
            kind: 'validation',
            code: 'INVALID_CSS',
            message: 'Input is not valid CSS.',
          } satisfies ActionError,
        },
      ])('$name stays settled without retrying the same input', async ({ result }) => {
        vi.useFakeTimers();
        vi.spyOn(console, 'error').mockImplementation(() => {});
        const convert = vi.mocked(jssToCss).mockResolvedValue(result);
        const { rerender } = render(
          <CodeDisplay code="a" outputs={[CodeDisplayPreset.JssToCss]} />
        );

        await act(async () => {
          await vi.advanceTimersByTimeAsync(1);
        });
        expect(screen.getByTestId('code-display-output')).toBeEmptyDOMElement();
        expect(screen.queryByTestId('code-display-loading')).not.toBeInTheDocument();
        expect(screen.getByTestId('code-display-copy')).toBeDisabled();
        expect(convert).toHaveBeenCalledTimes(1);

        rerender(<CodeDisplay code="a" outputs={[CodeDisplayPreset.JssToCss]} />);
        await act(async () => {
          await vi.advanceTimersByTimeAsync(1);
        });

        expect(screen.getByTestId('code-display-output')).toBeEmptyDOMElement();
        expect(screen.queryByTestId('code-display-loading')).not.toBeInTheDocument();
        expect(screen.getByTestId('code-display-copy')).toBeDisabled();
        expect(convert).toHaveBeenCalledTimes(1);
      });
    });
  });
});
