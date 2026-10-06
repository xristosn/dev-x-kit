import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, test, vi } from 'vitest';
import { useMonaco } from '@monaco-editor/react';
import { CodeEditor } from './index';

vi.mock('@monaco-editor/react');

vi.mock('next-themes');

describe('<CodeEditor />', () => {
  const mockOnChange = vi.fn();
  const mockOnLoaded = vi.fn();

  const defaultProps = {
    value: 'function test() {}',
    onChange: mockOnChange,
    onLoaded: mockOnLoaded,
    height: '100%',
    language: 'javascript',
    isReadonly: false,
  };

  beforeEach(() => {
    mockOnChange.mockClear();
    mockOnLoaded.mockClear();
    vi.mocked(useMonaco).mockClear();
  });

  test('configures Monaco to load assets locally', async () => {
    vi.resetModules();
    const { loader } = await import('@monaco-editor/react');
    await import('./index');

    expect(loader.config).toHaveBeenCalledWith({ paths: { vs: '/monaco/vs' } });
  });

  test('renders without error', () => {
    render(<CodeEditor {...defaultProps} />);
    expect(screen.getByTestId('monaco-editor')).toBeInTheDocument();
  });

  test('does not subscribe to the Monaco loader through useMonaco', () => {
    render(<CodeEditor {...defaultProps} />);

    expect(useMonaco).not.toHaveBeenCalled();
  });

  test('passes value prop to editor', () => {
    render(<CodeEditor {...defaultProps} value="hello world" />);
    expect(screen.getByTestId('monaco-editor')).toHaveAttribute('data-value', 'hello world');
  });

  test('passes language prop to editor', () => {
    render(<CodeEditor {...defaultProps} language="typescript" />);
    expect(screen.getByTestId('monaco-editor')).toHaveAttribute('data-language', 'typescript');
  });

  test('passes height prop to editor', () => {
    render(<CodeEditor {...defaultProps} height="200px" />);
    expect(screen.getByTestId('monaco-editor')).toHaveAttribute('data-height', '200px');
  });

  test('passes theme prop based on resolved theme', () => {
    render(<CodeEditor {...defaultProps} />);
    expect(screen.getByTestId('monaco-editor')).toHaveAttribute('data-theme', 'monaco-light');
  });

  test('calls onLoaded when editor mounts', () => {
    render(<CodeEditor {...defaultProps} />);
    fireEvent.click(screen.getByTestId('monaco-mount'));
    expect(mockOnLoaded).toHaveBeenCalledTimes(1);
  });

  test('does not pass onChange when readonly', () => {
    render(<CodeEditor {...defaultProps} isReadonly />);
    expect(screen.getByTestId('monaco-editor')).toBeInTheDocument();
  });
});
