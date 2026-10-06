import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ImportCspDialog } from './import-csp-dialog';
import { DIRECTIVE_INFO } from '../_lib/constants';
import type { DirectiveConfig } from '../_lib/types';

describe('<ImportCspDialog />', () => {
  let lastUnmount: (() => void) | undefined;

  function renderDialog() {
    const onImport = vi.fn<(directives: DirectiveConfig[]) => void>();
    const result = render(<ImportCspDialog onImport={onImport} />);
    lastUnmount = result.unmount;
    return { onImport, ...result };
  }

  beforeEach(() => {
    cleanup();
  });

  afterEach(() => {
    lastUnmount?.();
    cleanup();
  });

  describe('initial state', () => {
    it('renders the Import Header button', () => {
      renderDialog();
      expect(screen.getByTestId('import-header-btn')).toBeTruthy();
    });

    it('does not show the dialog content initially', () => {
      renderDialog();
      expect(screen.queryByTestId('import-textarea')).not.toBeInTheDocument();
    });
  });

  describe('opening the dialog', () => {
    it('opens the dialog when Import Header is clicked', async () => {
      const user = userEvent.setup();
      renderDialog();
      await user.click(screen.getByTestId('import-header-btn'));
      expect(screen.getByTestId('import-textarea')).toBeInTheDocument();
    });

    it('renders the textarea inside the dialog', async () => {
      const user = userEvent.setup();
      renderDialog();
      await user.click(screen.getByTestId('import-header-btn'));
      expect(screen.getByTestId('import-textarea')).toBeTruthy();
    });

    it('renders Cancel and Apply buttons after opening', async () => {
      const user = userEvent.setup();
      renderDialog();
      await user.click(screen.getByTestId('import-header-btn'));
      expect(screen.getByTestId('import-cancel')).toBeTruthy();
      expect(screen.getByTestId('import-apply')).toBeTruthy();
    });

    it('focuses the textarea on open', async () => {
      const user = userEvent.setup();
      renderDialog();
      await user.click(screen.getByTestId('import-header-btn'));
      expect(screen.getByTestId('import-textarea')).toHaveFocus();
    });
  });

  describe('closing the dialog', () => {
    it('closes when Cancel is clicked', async () => {
      const user = userEvent.setup();
      renderDialog();
      await user.click(screen.getByTestId('import-header-btn'));
      await user.click(screen.getByTestId('import-cancel'));
      expect(screen.queryByTestId('import-textarea')).not.toBeInTheDocument();
    });

    it.each([
      {
        state: 'successful preview and warnings',
        header: "default-src 'self'; bogus-directive foo",
        feedbackId: 'import-warnings',
      },
      {
        state: 'parse error',
        header: 'invalid-directive foo',
        feedbackId: 'import-error-message',
      },
    ])('clears $state when canceled and reopened', async ({ header, feedbackId }) => {
      const user = userEvent.setup();
      const { onImport } = renderDialog();
      await user.click(screen.getByTestId('import-header-btn'));
      await user.type(screen.getByTestId('import-textarea'), header);
      expect(screen.getByTestId('import-textarea')).toHaveValue(header);
      expect(screen.getByTestId('import-result')).toBeInTheDocument();
      expect(screen.getByTestId(feedbackId)).toBeInTheDocument();

      await user.click(screen.getByTestId('import-cancel'));
      expect(screen.queryByTestId('import-textarea')).not.toBeInTheDocument();
      expect(onImport).not.toHaveBeenCalled();

      await user.click(screen.getByTestId('import-header-btn'));
      expect(screen.getByTestId('import-textarea')).toHaveValue('');
      expect(screen.queryByTestId('import-result')).not.toBeInTheDocument();
      expect(screen.queryByTestId('import-directive-count')).not.toBeInTheDocument();
      expect(screen.queryByTestId('import-error-message')).not.toBeInTheDocument();
      expect(screen.queryByTestId('import-warnings')).not.toBeInTheDocument();
      expect(screen.getByTestId('import-apply')).toBeDisabled();
    });
  });

  describe('parsing behavior', () => {
    it('shows no result for empty textarea', async () => {
      const user = userEvent.setup();
      renderDialog();
      await user.click(screen.getByTestId('import-header-btn'));
      await user.clear(screen.getByTestId('import-textarea'));
      expect(screen.queryByTestId('import-result')).not.toBeInTheDocument();
    });

    it('shows success state for valid CSP header', async () => {
      const user = userEvent.setup();
      renderDialog();
      await user.click(screen.getByTestId('import-header-btn'));
      await user.type(
        screen.getByTestId('import-textarea'),
        "default-src 'self'; script-src 'self' https://cdn.example.com"
      );
      expect(screen.getByTestId('import-result')).toBeTruthy();
    });

    it('shows error state for invalid header', async () => {
      const user = userEvent.setup();
      renderDialog();
      await user.click(screen.getByTestId('import-header-btn'));
      await user.type(screen.getByTestId('import-textarea'), 'invalid-directive foo bar');
      expect(screen.getByTestId('import-error-message')).toBeTruthy();
    });

    it('shows directive count when parsing succeeds', async () => {
      const user = userEvent.setup();
      renderDialog();
      await user.click(screen.getByTestId('import-header-btn'));
      await user.type(
        screen.getByTestId('import-textarea'),
        "default-src 'self'; script-src 'self'; img-src 'self'"
      );
      expect(screen.getByTestId('import-directive-count')).toBeTruthy();
    });

    it('shows warnings for unknown directives', async () => {
      const user = userEvent.setup();
      renderDialog();
      await user.click(screen.getByTestId('import-header-btn'));
      await user.type(
        screen.getByTestId('import-textarea'),
        "default-src 'self'; bogus-directive foo"
      );
      expect(screen.getByTestId('import-warnings')).toBeTruthy();
    });

    it('clears result when textarea is cleared', async () => {
      const user = userEvent.setup();
      renderDialog();
      await user.click(screen.getByTestId('import-header-btn'));
      await user.type(screen.getByTestId('import-textarea'), "default-src 'self'");
      expect(screen.getByTestId('import-result')).toBeTruthy();
      await user.clear(screen.getByTestId('import-textarea'));
      expect(screen.queryByTestId('import-result')).not.toBeInTheDocument();
    });
  });

  describe('Apply & Replace button', () => {
    it('is disabled when no header is pasted', async () => {
      const user = userEvent.setup();
      renderDialog();
      await user.click(screen.getByTestId('import-header-btn'));
      const applyBtn = screen.getByTestId('import-apply');
      expect(applyBtn).toBeDisabled();
    });

    it('is disabled when parsing fails', async () => {
      const user = userEvent.setup();
      renderDialog();
      await user.click(screen.getByTestId('import-header-btn'));
      await user.type(screen.getByTestId('import-textarea'), 'invalid-directive foo');
      const applyBtn = screen.getByTestId('import-apply');
      expect(applyBtn).toBeDisabled();
    });

    it('is enabled when parsing succeeds', async () => {
      const user = userEvent.setup();
      renderDialog();
      await user.click(screen.getByTestId('import-header-btn'));
      await user.type(screen.getByTestId('import-textarea'), "default-src 'self'");
      const applyBtn = screen.getByTestId('import-apply');
      expect(applyBtn).toBeEnabled();
    });

    it('calls onImport with parsed directives and closes on apply', async () => {
      const { onImport } = renderDialog();
      const user = userEvent.setup();
      await user.click(screen.getByTestId('import-header-btn'));
      await user.type(
        screen.getByTestId('import-textarea'),
        "default-src 'self'; script-src 'self' https://cdn.example.com"
      );
      await user.click(screen.getByTestId('import-apply'));
      expect(onImport).toHaveBeenCalledTimes(1);
      const importedDirectives = onImport.mock.calls[0]?.[0];
      expect(importedDirectives?.filter((directive) => directive.enabled)).toStrictEqual([
        {
          name: 'default-src',
          ...DIRECTIVE_INFO['default-src'],
          enabled: true,
          sources: ["'self'"],
        },
        {
          name: 'script-src',
          ...DIRECTIVE_INFO['script-src'],
          enabled: true,
          sources: ["'self'", 'https://cdn.example.com'],
        },
      ] satisfies DirectiveConfig[]);
      expect(screen.queryByTestId('import-textarea')).not.toBeInTheDocument();
    });

    it('does not call onImport when Apply is clicked with invalid header', async () => {
      const { onImport } = renderDialog();
      const user = userEvent.setup();
      await user.click(screen.getByTestId('import-header-btn'));
      await user.type(screen.getByTestId('import-textarea'), 'invalid-directive foo');
      await user.click(screen.getByTestId('import-apply'));
      expect(onImport).not.toHaveBeenCalled();
    });

    it('clears input, preview, and warnings after applying and reopening', async () => {
      const user = userEvent.setup();
      renderDialog();
      await user.click(screen.getByTestId('import-header-btn'));
      const header = "default-src 'self'; bogus-directive foo";
      await user.type(screen.getByTestId('import-textarea'), header);
      expect(screen.getByTestId('import-textarea')).toHaveValue(header);
      expect(screen.getByTestId('import-result')).toBeInTheDocument();
      expect(screen.getByTestId('import-directive-count')).toHaveTextContent('1 directive found');
      expect(screen.getByTestId('import-warnings')).toBeInTheDocument();

      await user.click(screen.getByTestId('import-apply'));
      expect(screen.queryByTestId('import-textarea')).not.toBeInTheDocument();

      await user.click(screen.getByTestId('import-header-btn'));
      expect(screen.getByTestId('import-textarea')).toHaveValue('');
      expect(screen.queryByTestId('import-result')).not.toBeInTheDocument();
      expect(screen.queryByTestId('import-directive-count')).not.toBeInTheDocument();
      expect(screen.queryByTestId('import-error-message')).not.toBeInTheDocument();
      expect(screen.queryByTestId('import-warnings')).not.toBeInTheDocument();
      expect(screen.getByTestId('import-apply')).toBeDisabled();
    });
  });

  describe('directive count display', () => {
    it('shows singular count for one directive', async () => {
      const user = userEvent.setup();
      renderDialog();
      await user.click(screen.getByTestId('import-header-btn'));
      await user.type(screen.getByTestId('import-textarea'), "default-src 'self'");
      const countEl = screen.getByTestId('import-directive-count');
      expect(countEl.textContent).toContain('1 directive');
    });

    it('shows plural count for multiple directives', async () => {
      const user = userEvent.setup();
      renderDialog();
      await user.click(screen.getByTestId('import-header-btn'));
      await user.type(
        screen.getByTestId('import-textarea'),
        "default-src 'self'; script-src 'self'; img-src 'self'"
      );
      const countEl = screen.getByTestId('import-directive-count');
      expect(countEl.textContent).toContain('directives');
    });
  });
});
