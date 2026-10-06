import { fireEvent, render as testingRender, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { ChangeEvent, ReactNode } from 'react';
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import type { CodeEditorProps } from '../editor';
import { SidebarProvider, SidebarTrigger } from '../ui/sidebar';
import { CodeSplitView } from './code-split-view';
import { CodeSplitViewSkeleton } from './code-split-view-skeleton';

const { useIsMobileMock } = vi.hoisted(() => ({ useIsMobileMock: vi.fn(() => false) }));

vi.mock('@/hooks/use-mobile', () => ({ useIsMobile: useIsMobileMock }));

type MockCodeEditorProps = Pick<CodeEditorProps, 'value' | 'onChange' | 'onLoaded' | 'isReadonly'>;

const withSidebar = (children: ReactNode) => <SidebarProvider>{children}</SidebarProvider>;

function renderWithSidebar(children: ReactNode) {
  return testingRender(withSidebar(children));
}

vi.mock('@/hooks/use-web-storage', async () => {
  const { useState } = await import('react');

  return {
    useWebStorage: (_key?: string, _ts?: string, defaultValue?: unknown) => {
      const [value, setValue] = useState(defaultValue);
      const resetValue = () => setValue(defaultValue);
      const valueExists = () => true;
      return [value, setValue, resetValue, valueExists] as const;
    },
  };
});

vi.mock('sonner');

vi.mock('next-themes');

vi.mock('../editor', async () => {
  const React = await import('react');

  const CodeEditorMock = ({ value = '', onChange, onLoaded, isReadonly }: MockCodeEditorProps) => {
    const loaded = React.useRef(false);

    React.useEffect(() => {
      if (!loaded.current) {
        loaded.current = true;
        onLoaded?.();
      }
    }, [onLoaded]);

    return React.createElement(
      'div',
      { 'data-testid': 'mock-code-editor' },
      React.createElement('textarea', {
        'data-testid': 'mock-editor-textarea',
        value: value ?? '',
        onChange: (event: ChangeEvent<HTMLTextAreaElement>) =>
          onChange?.(
            event.target.value,
            event as unknown as Parameters<NonNullable<CodeEditorProps['onChange']>>[1]
          ),
        readOnly: isReadonly,
      })
    );
  };

  return {
    __esModule: true,
    CodeEditor: CodeEditorMock,
    default: CodeEditorMock,
  };
});

describe('<CodeSplitView />', () => {
  const mockConverter = vi.fn(async (input: string) => `output:${input}`);
  const inputProps = { label: 'Input', language: 'ts', defaultValue: 'hello' };
  const outputProps = { label: 'Output', language: 'ts' };

  beforeEach(() => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
    vi.clearAllMocks();
    useIsMobileMock.mockReturnValue(false);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  test('leaves page heading rendering to the tools layout', () => {
    renderWithSidebar(
      <CodeSplitView input={inputProps} output={outputProps} converter={mockConverter} />
    );

    expect(screen.queryByTestId('code-split-view-label')).not.toBeInTheDocument();
  });

  test('expands the editor and exits expanded mode with Escape', () => {
    renderWithSidebar(
      <>
        <div role="dialog" data-testid="editor-dialog" />
        <CodeSplitView input={inputProps} output={outputProps} converter={mockConverter} />
      </>
    );
    const toggle = screen.getByTestId('code-split-view-fullscreen-toggle');
    const workspace = screen.getByTestId('code-split-view-workspace');

    expect(toggle).toHaveAttribute('aria-pressed', 'false');
    expect(workspace).toHaveAttribute('data-expanded', 'false');
    fireEvent.click(toggle);
    expect(toggle).toHaveAttribute('aria-pressed', 'true');
    expect(workspace).toHaveAttribute('data-expanded', 'true');

    fireEvent.keyDown(screen.getByTestId('editor-dialog'), { key: 'Escape' });
    expect(toggle).toHaveAttribute('aria-pressed', 'true');

    fireEvent.keyDown(window, { key: 'Escape' });
    expect(toggle).toHaveAttribute('aria-pressed', 'false');
    expect(workspace).toHaveAttribute('data-expanded', 'false');
  });

  test('uses the responsive editor height in normal mode', () => {
    renderWithSidebar(
      <CodeSplitView input={inputProps} output={outputProps} converter={mockConverter} />
    );

    expect(screen.getByTestId('code-split-view-workspace')).toHaveClass('editor-height');
  });

  test('uses responsive editor height in the skeleton fallback', () => {
    testingRender(<CodeSplitViewSkeleton />);

    expect(screen.getByTestId('code-split-view-skeleton')).toHaveClass('editor-height');
  });

  test('keeps expanded workspace beside an open sidebar and uses full width when collapsed', () => {
    renderWithSidebar(
      <>
        <SidebarTrigger data-testid="sidebar-state-trigger" />
        <CodeSplitView input={inputProps} output={outputProps} converter={mockConverter} />
      </>
    );

    fireEvent.click(screen.getByTestId('code-split-view-fullscreen-toggle'));
    const workspace = screen.getByTestId('code-split-view-workspace');
    expect(workspace).toHaveStyle({ left: 'var(--sidebar-width)' });

    fireEvent.click(screen.getByTestId('sidebar-state-trigger'));
    expect(workspace).toHaveStyle({ left: '0px' });
  });

  test('forces mobile panels vertical without changing the saved desktop direction', () => {
    const view = renderWithSidebar(
      <CodeSplitView input={inputProps} output={outputProps} converter={mockConverter} />
    );

    expect(screen.getByTestId('code-split-view-panels')).toHaveStyle({ flexDirection: 'row' });
    useIsMobileMock.mockReturnValue(true);
    view.rerender(
      withSidebar(
        <CodeSplitView input={inputProps} output={outputProps} converter={mockConverter} />
      )
    );

    expect(screen.getByTestId('code-split-view-panels')).toHaveStyle({ flexDirection: 'column' });
    expect(screen.queryByTestId('code-split-view-rotate-button')).not.toBeInTheDocument();

    useIsMobileMock.mockReturnValue(false);
    view.rerender(
      withSidebar(
        <CodeSplitView input={inputProps} output={outputProps} converter={mockConverter} />
      )
    );

    expect(screen.getByTestId('code-split-view-panels')).toHaveStyle({ flexDirection: 'row' });
    expect(screen.getByTestId('code-split-view-rotate-button')).toBeInTheDocument();
  });

  test('shows an error status instead of Converted when a later conversion fails', async () => {
    const conditionalConverter = vi.fn(async (value: string) => {
      if (value === 'hello') return 'output:hello';
      throw new Error('Invalid input');
    });

    renderWithSidebar(
      <CodeSplitView input={inputProps} output={outputProps} converter={conditionalConverter} />
    );

    await waitFor(() =>
      expect(screen.getByTestId('code-split-view-status')).toHaveTextContent('Converted')
    );

    fireEvent.change(screen.getAllByTestId('mock-editor-textarea')[0], {
      target: { value: 'invalid' },
    });
    await vi.advanceTimersByTimeAsync(350);

    await waitFor(() =>
      expect(screen.getByTestId('code-split-view-status')).toHaveTextContent('Conversion failed')
    );
  });

  test('converts initial input', async () => {
    renderWithSidebar(
      <CodeSplitView input={inputProps} output={outputProps} converter={mockConverter} />
    );
    await waitFor(() => expect(mockConverter).toHaveBeenCalledWith('hello', {}));
    await waitFor(() =>
      expect(screen.getAllByTestId('mock-editor-textarea')[1]).toHaveValue('output:hello')
    );
  });

  test('updates input and triggers debounced conversion', async () => {
    renderWithSidebar(
      <CodeSplitView input={inputProps} output={outputProps} converter={mockConverter} />
    );
    const edit = screen.getAllByTestId('mock-editor-textarea')[0];
    fireEvent.change(edit, { target: { value: 'world' } });
    await vi.advanceTimersByTimeAsync(350);
    expect(mockConverter).toHaveBeenLastCalledWith('world', {});
  });

  test('renders both input and output editors', () => {
    renderWithSidebar(
      <CodeSplitView input={inputProps} output={outputProps} converter={mockConverter} />
    );
    expect(screen.getAllByTestId('mock-editor-textarea')).toHaveLength(2);
  });

  test('shows source link when sourceUrl is provided', () => {
    renderWithSidebar(
      <CodeSplitView
        input={inputProps}
        output={{ ...outputProps, sourceUrl: 'https://ex.com/src' }}
        converter={mockConverter}
      />
    );
    expect(screen.getByTestId('code-split-view-source-link')).toHaveAttribute(
      'href',
      'https://ex.com/src'
    );
  });

  test('imports a file into the input and converts its contents without options', async () => {
    renderWithSidebar(
      <CodeSplitView input={inputProps} output={outputProps} converter={mockConverter} />
    );
    await userEvent.click(screen.getByTestId('code-split-view-upload-trigger'));

    const file = new File(['imported input'], 'input.ts', { type: 'text/plain' });
    Object.defineProperty(file, 'text', { value: vi.fn().mockResolvedValue('imported input') });
    fireEvent.change(screen.getByTestId('code-split-view-upload-input'), {
      target: { files: [file] },
    });

    await waitFor(() =>
      expect(screen.getAllByTestId('mock-editor-textarea')[0]).toHaveValue('imported input')
    );
    await vi.advanceTimersByTimeAsync(350);
    expect(mockConverter).toHaveBeenLastCalledWith('imported input', {});
  });
});
