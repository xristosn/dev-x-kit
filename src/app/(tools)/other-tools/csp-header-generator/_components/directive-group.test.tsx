import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { DirectiveGroup } from './directive-group';
import type { DirectiveConfig, DirectiveCategory } from '../_lib/types';
import { Lock, Code } from 'lucide-react';

describe('<DirectiveGroup />', () => {
  const mockCategory: DirectiveCategory = {
    id: 'general',
    label: 'General',
    description: 'General directives for all content types.',
    icon: Lock,
    directives: ['default-src', 'script-src'],
  };

  const mockDirectives: DirectiveConfig[] = [
    {
      name: 'default-src',
      label: 'default-src',
      description: 'Default policy',
      enabled: true,
      sources: ["'self'"],
    },
    {
      name: 'script-src',
      label: 'script-src',
      description: 'Script policy',
      enabled: false,
      sources: [],
    },
  ];

  function renderGroup(directives: DirectiveConfig[] = mockDirectives) {
    const onToggle = vi.fn();
    const onAddSource = vi.fn();
    const onRemoveSource = vi.fn();
    const onMoveUp = vi.fn();
    const onMoveDown = vi.fn();
    const user = userEvent.setup();

    render(
      <DirectiveGroup
        category={mockCategory}
        directives={directives}
        onToggle={onToggle}
        onAddSource={onAddSource}
        onRemoveSource={onRemoveSource}
        onMoveUp={onMoveUp}
        onMoveDown={onMoveDown}
      />
    );

    return {
      onToggle,
      onAddSource,
      onRemoveSource,
      onMoveUp,
      onMoveDown,
      user,
    };
  }

  it('renders the category label and description', () => {
    renderGroup();
    expect(screen.getByTestId('csp-group-label-general')).toHaveTextContent('General');
    expect(screen.getByTestId('csp-group-description-general')).toHaveTextContent(
      'General directives for all content types.'
    );
  });

  it('renders the category icon', () => {
    renderGroup();
    expect(screen.getByTestId('csp-group-icon-general')).toBeInTheDocument();
  });

  it('shows enabled count badge when there are enabled directives', () => {
    renderGroup();
    expect(screen.getByTestId('csp-group-badge')).toBeInTheDocument();
  });

  it('does not show badge when no directives are enabled', () => {
    renderGroup([{ ...mockDirectives[0], enabled: false }]);
    expect(screen.queryByTestId('csp-group-badge')).not.toBeInTheDocument();
  });

  it('collapses when header is clicked', async () => {
    const { user } = renderGroup();
    const header = screen.getByTestId('csp-group-header');
    await user.click(header);
    expect(screen.queryByTestId('csp-group-content')).not.toBeInTheDocument();
  });

  it('expands when header is clicked again', async () => {
    const { user } = renderGroup();
    const header = screen.getByTestId('csp-group-header');
    await user.click(header);
    await user.click(header);
    expect(screen.getByTestId('csp-group-content')).toBeInTheDocument();
  });

  it('renders directive rows when expanded', () => {
    renderGroup();
    expect(screen.getByTestId('csp-directive-row-default-src')).toBeInTheDocument();
    expect(screen.getByTestId('csp-directive-row-script-src')).toBeInTheDocument();
  });

  it('does not render directive rows when collapsed', async () => {
    const { user } = renderGroup();
    const header = screen.getByTestId('csp-group-header');
    await user.click(header);
    expect(screen.queryByTestId('csp-directive-row-default-src')).not.toBeInTheDocument();
  });

  it('calls onToggle when a directive toggle is clicked', async () => {
    const { user, onToggle } = renderGroup();
    const toggle = screen.getByTestId('csp-directive-toggle-default-src');
    await user.click(toggle);
    expect(onToggle).toHaveBeenCalledWith('default-src');
  });

  it('calls onAddSource when a source is added', async () => {
    const { user, onAddSource } = renderGroup();
    const input = screen.getByTestId('csp-add-source-input-default-src');
    await user.type(input, 'https://example.com');
    const button = screen.getByTestId('csp-add-source-button-default-src');
    await user.click(button);
    expect(onAddSource).toHaveBeenCalledWith('default-src', 'https://example.com');
  });

  it('calls onRemoveSource when a source is removed', async () => {
    const { user, onRemoveSource } = renderGroup();
    const removeBtn = screen.getByTestId('csp-remove-source--self-');
    await user.click(removeBtn);
    expect(onRemoveSource).toHaveBeenCalledWith('default-src', "'self'");
  });

  it('calls onMoveUp when move up is clicked', async () => {
    const { user, onMoveUp } = renderGroup();
    const upBtn = screen.getByTestId('csp-move-up-script-src');
    await user.click(upBtn);
    expect(onMoveUp).toHaveBeenCalledWith('script-src', 'up');
  });

  it('calls onMoveDown when move down is clicked', async () => {
    const { user, onMoveDown } = renderGroup();
    const downBtn = screen.getByTestId('csp-move-down-default-src');
    await user.click(downBtn);
    expect(onMoveDown).toHaveBeenCalledWith('default-src', 'down');
  });

  it('renders different icons for different categories', () => {
    const scriptCategory: DirectiveCategory = {
      id: 'scripts',
      label: 'Scripts',
      description: 'Script-related directives.',
      icon: Code,
      directives: ['script-src'],
    };
    render(
      <DirectiveGroup
        category={scriptCategory}
        directives={mockDirectives}
        onToggle={vi.fn()}
        onAddSource={vi.fn()}
        onRemoveSource={vi.fn()}
        onMoveUp={vi.fn()}
        onMoveDown={vi.fn()}
      />
    );
    expect(screen.getByTestId('csp-group-icon-scripts')).toBeInTheDocument();
  });
});
