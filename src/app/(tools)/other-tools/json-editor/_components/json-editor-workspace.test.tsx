import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createJSONEditor } from 'vanilla-jsoneditor';
import { JsonEditorWorkspace } from './json-editor-workspace';

const { createJSONEditorMock } = vi.hoisted(() => ({ createJSONEditorMock: vi.fn() }));

vi.mock('vanilla-jsoneditor', () => ({ createJSONEditor: createJSONEditorMock }));

describe('<JsonEditorWorkspace />', () => {
  beforeEach(() => {
    localStorage.clear();
    createJSONEditorMock.mockReturnValue({ destroy: vi.fn() });
  });

  it('opens the editor with trimmed input and persists it', async () => {
    const user = userEvent.setup();
    render(<JsonEditorWorkspace />);

    fireEvent.change(screen.getByTestId('json-editor-input'), {
      target: { value: '  {"valid":true}  ' },
    });
    await user.click(screen.getByTestId('json-editor-open'));

    expect(createJSONEditor).toHaveBeenCalledOnce();
    expect(createJSONEditor).toHaveBeenCalledWith(
      expect.objectContaining({
        props: expect.objectContaining({ content: { text: '{"valid":true}' }, mode: 'text' }),
      })
    );
    await waitFor(() => {
      expect(JSON.parse(localStorage.getItem('json-editor') ?? 'null')).toBe('{"valid":true}');
    });
    expect(screen.getByTestId('json-editor-host')).toBeInTheDocument();
  });

  it('keeps the editor closed when the input contains only whitespace', async () => {
    const user = userEvent.setup();
    render(<JsonEditorWorkspace />);

    fireEvent.change(screen.getByTestId('json-editor-input'), {
      target: { value: '  \n  ' },
    });

    expect(screen.getByTestId('json-editor-open')).toBeDisabled();
    await user.click(screen.getByTestId('json-editor-open'));
    expect(createJSONEditor).not.toHaveBeenCalled();
  });

  it('persists valid editor changes and ignores empty content', async () => {
    const user = userEvent.setup();
    render(<JsonEditorWorkspace />);

    fireEvent.change(screen.getByTestId('json-editor-input'), {
      target: { value: '{"start":true}' },
    });
    await user.click(screen.getByTestId('json-editor-open'));

    const [{ props }] = createJSONEditorMock.mock.calls[0];
    const onChange = props.onChange as (
      value: { text: string; json?: Map<unknown, unknown> },
      previous: unknown,
      metadata: { contentErrors: unknown }
    ) => void;

    act(() => {
      onChange({ text: '{"updated":true}', json: new Map() }, undefined, {
        contentErrors: undefined,
      });
    });
    await waitFor(() => {
      expect(JSON.parse(localStorage.getItem('json-editor') ?? 'null')).toBe('{"updated":true}');
    });

    act(() => {
      onChange({ text: '', json: undefined }, undefined, { contentErrors: undefined });
    });
    expect(JSON.parse(localStorage.getItem('json-editor') ?? 'null')).toBe('{"updated":true}');
  });

  it.each([
    { size: 1024 * 1024, shouldPersist: true },
    { size: 1024 * 1024 + 1, shouldPersist: false },
  ])(
    'persists opened content only when it is within the 1 MiB limit ($size characters)',
    async ({ size, shouldPersist }) => {
      const user = userEvent.setup();
      const value = JSON.stringify('a'.repeat(size - 2));
      render(<JsonEditorWorkspace />);

      fireEvent.change(screen.getByTestId('json-editor-input'), { target: { value } });
      await user.click(screen.getByTestId('json-editor-open'));

      if (shouldPersist) {
        await waitFor(() => {
          expect(JSON.parse(localStorage.getItem('json-editor') ?? 'null')).toBe(value);
        });
      } else {
        expect(localStorage.getItem('json-editor')).toBeNull();
      }
    }
  );

  it('does not persist editor changes above the 1 MiB limit', async () => {
    const user = userEvent.setup();
    render(<JsonEditorWorkspace />);

    fireEvent.change(screen.getByTestId('json-editor-input'), {
      target: { value: '{"start":true}' },
    });
    await user.click(screen.getByTestId('json-editor-open'));

    const [{ props }] = createJSONEditorMock.mock.calls[0];
    const onChange = props.onChange as (
      value: { text: string; json: Map<unknown, unknown> },
      previous: unknown,
      metadata: { contentErrors: unknown }
    ) => void;
    const boundaryValue = JSON.stringify('a'.repeat(1024 * 1024 - 2));

    act(() => {
      onChange({ text: boundaryValue, json: new Map() }, undefined, { contentErrors: undefined });
    });
    await waitFor(() => {
      expect(JSON.parse(localStorage.getItem('json-editor') ?? 'null')).toBe(boundaryValue);
    });

    act(() => {
      onChange({ text: JSON.stringify('a'.repeat(1024 * 1024 - 1)), json: new Map() }, undefined, {
        contentErrors: undefined,
      });
    });
    expect(JSON.parse(localStorage.getItem('json-editor') ?? 'null')).toBe(boundaryValue);
  });

  it('restores a saved JSON value into the editor', async () => {
    localStorage.setItem('json-editor', JSON.stringify('{"saved":true}'));
    render(<JsonEditorWorkspace />);

    await waitFor(() => expect(createJSONEditor).toHaveBeenCalledOnce());
    expect(createJSONEditor).toHaveBeenCalledWith(
      expect.objectContaining({
        props: expect.objectContaining({ content: { text: '{"saved":true}' } }),
      })
    );
  });

  it('ignores invalid editor changes and destroys the editor on reset', async () => {
    const user = userEvent.setup();
    const editorInstance = { destroy: vi.fn() };
    createJSONEditorMock.mockReturnValue(editorInstance);
    render(<JsonEditorWorkspace />);

    fireEvent.change(screen.getByTestId('json-editor-input'), {
      target: { value: '{"start":true}' },
    });
    await user.click(screen.getByTestId('json-editor-open'));

    const [{ props }] = createJSONEditorMock.mock.calls[0];
    const onChange = props.onChange as (
      value: { text: string; json: Map<unknown, unknown> },
      previous: unknown,
      metadata: { contentErrors: unknown }
    ) => void;
    act(() => {
      onChange({ text: '{"invalid":', json: new Map() }, undefined, { contentErrors: 'invalid' });
    });
    expect(JSON.parse(localStorage.getItem('json-editor') ?? 'null')).toBe('{"start":true}');

    await user.click(screen.getByTestId('json-editor-reset'));

    expect(editorInstance.destroy).toHaveBeenCalledOnce();
    expect(screen.getByTestId('json-editor-input')).toBeInTheDocument();
    await waitFor(() => expect(localStorage.getItem('json-editor')).toBeNull());
  });

  it('destroys the editor when the workspace unmounts', async () => {
    const user = userEvent.setup();
    const editorInstance = { destroy: vi.fn() };
    createJSONEditorMock.mockReturnValue(editorInstance);
    const { unmount } = render(<JsonEditorWorkspace />);

    fireEvent.change(screen.getByTestId('json-editor-input'), {
      target: { value: '{"start":true}' },
    });
    await user.click(screen.getByTestId('json-editor-open'));
    unmount();

    expect(editorInstance.destroy).toHaveBeenCalledOnce();
  });
});
