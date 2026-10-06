import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { DirectiveRow } from './directive-row';
import type { DirectiveConfig } from '../_lib/types';

describe('<DirectiveRow />', () => {
  const baseDirective: DirectiveConfig = {
    name: 'default-src',
    label: 'default-src',
    description: 'Defines the default policy for fetching content.',
    enabled: true,
    sources: ["'self'"],
  };

  function renderDirective(
    directive: DirectiveConfig = baseDirective,
    options: { isFirst?: boolean; isLast?: boolean } = {}
  ) {
    const onToggle = vi.fn();
    const onAddSource = vi.fn();
    const onRemoveSource = vi.fn();
    const onMoveUp = vi.fn();
    const onMoveDown = vi.fn();

    render(
      <DirectiveRow
        directive={directive}
        onToggle={onToggle}
        onAddSource={onAddSource}
        onRemoveSource={onRemoveSource}
        onMoveUp={onMoveUp}
        onMoveDown={onMoveDown}
        isFirst={options.isFirst ?? false}
        isLast={options.isLast ?? false}
      />
    );

    return {
      onToggle,
      onAddSource,
      onRemoveSource,
      onMoveUp,
      onMoveDown,
    };
  }

  it('renders the directive label and description', () => {
    renderDirective();
    expect(screen.getByTestId('csp-directive-row-default-src')).toBeInTheDocument();
    expect(screen.getByTestId('csp-directive-label-default-src')).toHaveTextContent('default-src');
    expect(screen.getByTestId('csp-directive-description-default-src')).toHaveTextContent(
      'Defines the default policy for fetching content.'
    );
  });

  it('renders a switch that is checked when enabled', async () => {
    const { onToggle } = renderDirective();
    const user = userEvent.setup();
    const toggle = screen.getByTestId('csp-directive-toggle-default-src');
    expect(toggle).toHaveAttribute('aria-checked', 'true');
    await user.click(toggle);
    expect(onToggle).toHaveBeenCalledTimes(1);
  });

  it('renders source badges when enabled', () => {
    renderDirective();
    const badges = screen.getAllByTestId(/csp-remove-source-/);
    expect(badges.length).toBeGreaterThan(0);
  });

  it('hides source controls when disabled', () => {
    renderDirective({ ...baseDirective, enabled: false });
    expect(screen.queryByTestId('csp-add-source-input-default-src')).not.toBeInTheDocument();
  });

  it('removes a source when its X button is clicked', async () => {
    const { onRemoveSource } = renderDirective();
    const user = userEvent.setup();
    const removeBtn = screen.getByTestId('csp-remove-source--self-');
    await user.click(removeBtn);
    expect(onRemoveSource).toHaveBeenCalledWith("'self'");
  });

  it('adds a source when Enter is pressed in the input', async () => {
    const { onAddSource } = renderDirective();
    const user = userEvent.setup();
    const input = screen.getByTestId('csp-add-source-input-default-src');
    await user.type(input, 'https://example.com{Enter}');
    expect(onAddSource).toHaveBeenCalledWith('https://example.com');
  });

  it('adds a source when Plus button is clicked', async () => {
    const { onAddSource } = renderDirective();
    const user = userEvent.setup();
    const input = screen.getByTestId('csp-add-source-input-default-src');
    const plusBtn = screen.getByTestId('csp-add-source-button-default-src');
    await user.type(input, 'https://example.com');
    await user.click(plusBtn);
    expect(onAddSource).toHaveBeenCalledWith('https://example.com');
  });

  it('does not add duplicate sources', async () => {
    const { onAddSource } = renderDirective();
    const user = userEvent.setup();
    const input = screen.getByTestId('csp-add-source-input-default-src');
    const plusBtn = screen.getByTestId('csp-add-source-button-default-src');
    await user.type(input, "'self'");
    await user.click(plusBtn);
    expect(onAddSource).not.toHaveBeenCalled();
  });

  it('trims whitespace from new sources', async () => {
    const { onAddSource } = renderDirective();
    const user = userEvent.setup();
    const input = screen.getByTestId('csp-add-source-input-default-src');
    const plusBtn = screen.getByTestId('csp-add-source-button-default-src');
    await user.type(input, '  https://example.com  ');
    await user.click(plusBtn);
    expect(onAddSource).toHaveBeenCalledWith('https://example.com');
  });

  it('does not add empty sources', async () => {
    const { onAddSource } = renderDirective();
    const user = userEvent.setup();
    const plusBtn = screen.getByTestId('csp-add-source-button-default-src');
    await user.click(plusBtn);
    expect(onAddSource).not.toHaveBeenCalled();
  });

  it('renders move up and move down buttons', () => {
    renderDirective();
    expect(screen.getByTestId('csp-move-up-default-src')).toBeInTheDocument();
    expect(screen.getByTestId('csp-move-down-default-src')).toBeInTheDocument();
  });

  it('calls onMoveUp when move up is clicked', async () => {
    const { onMoveUp } = renderDirective();
    const user = userEvent.setup();
    await user.click(screen.getByTestId('csp-move-up-default-src'));
    expect(onMoveUp).toHaveBeenCalledTimes(1);
  });

  it('calls onMoveDown when move down is clicked', async () => {
    const { onMoveDown } = renderDirective();
    const user = userEvent.setup();
    await user.click(screen.getByTestId('csp-move-down-default-src'));
    expect(onMoveDown).toHaveBeenCalledTimes(1);
  });

  it('disables move up when first', () => {
    renderDirective(baseDirective, { isFirst: true });
    expect(screen.getByTestId('csp-move-up-default-src')).toBeDisabled();
  });

  it('disables move down when last', () => {
    renderDirective(baseDirective, { isLast: true });
    expect(screen.getByTestId('csp-move-down-default-src')).toBeDisabled();
  });

  it('marks risky source badges as destructive', () => {
    renderDirective({ ...baseDirective, sources: ["'self'", 'unsafe-inline'] });
    expect(screen.getByTestId('csp-source-badge-default-src-unsafe-inline')).toHaveAttribute(
      'data-variant',
      'destructive'
    );
  });

  it('marks safe source badges as secondary', () => {
    renderDirective();
    expect(screen.getByTestId('csp-source-badge-default-src--self-')).toHaveAttribute(
      'data-variant',
      'secondary'
    );
  });

  it('marks the directive row disabled when its directive is disabled', () => {
    renderDirective({ ...baseDirective, enabled: false });
    expect(screen.getByTestId('csp-directive-row-default-src')).toHaveAttribute(
      'aria-disabled',
      'true'
    );
  });

  it('renders risk badges for unsafe-inline', () => {
    renderDirective({
      ...baseDirective,
      sources: ["'self'", 'unsafe-inline'],
    });
    expect(screen.getByTestId('csp-source-badge-default-src-unsafe-inline')).toHaveAttribute(
      'data-variant',
      'destructive'
    );
  });

  it('renders risk badges for unsafe-eval', () => {
    renderDirective({ ...baseDirective, sources: ["'self'", 'unsafe-eval'] });
    expect(screen.getByTestId('csp-source-badge-default-src-unsafe-eval')).toHaveAttribute(
      'data-variant',
      'destructive'
    );
  });

  it('does not render risk badges for safe sources only', () => {
    renderDirective();
    const riskBadge = screen.queryByTestId('csp-remove-source-unsafe-inline');
    expect(riskBadge).not.toBeInTheDocument();
  });
});
