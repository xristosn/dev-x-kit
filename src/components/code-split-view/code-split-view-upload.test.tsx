import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, test, vi } from 'vitest';
import { toast } from 'sonner';
import { CodeSplitViewUpload } from './code-split-view-upload';

vi.mock('sonner');

const setInputValue = vi.fn();

function createTextFile(name: string, contents: string) {
  const file = new File([contents], name, { type: 'text/plain' });
  Object.defineProperty(file, 'text', { value: vi.fn().mockResolvedValue(contents) });
  return file;
}

async function openUploadDialog() {
  await userEvent.click(screen.getByTestId('code-split-view-upload-trigger'));
  expect(screen.getByTestId('code-split-view-upload-dialog')).toBeInTheDocument();
}

async function selectFile(file: File) {
  fireEvent.change(screen.getByTestId('code-split-view-upload-input'), {
    target: { files: [file] },
  });
}

beforeEach(() => {
  vi.clearAllMocks();
});

describe('<CodeSplitViewUpload />', () => {
  test('opens the modal and replaces the input with an allowed text file', async () => {
    render(<CodeSplitViewUpload setInputValue={setInputValue} />);
    await openUploadDialog();

    const file = createTextFile('example.ts', 'const answer = 42;');
    await selectFile(file);

    await waitFor(() => expect(setInputValue).toHaveBeenCalledWith('const answer = 42;'));
    expect(file.text).toHaveBeenCalledTimes(1);
    await waitFor(() =>
      expect(screen.queryByTestId('code-split-view-upload-dialog')).not.toBeInTheDocument()
    );
  });

  test('replaces the input on each successful import and accepts only one file at a time', async () => {
    render(<CodeSplitViewUpload setInputValue={setInputValue} />);
    await openUploadDialog();

    const input = screen.getByTestId('code-split-view-upload-input');
    expect(input).not.toHaveAttribute('multiple');

    await selectFile(createTextFile('first.txt', 'first'));
    await waitFor(() => expect(setInputValue).toHaveBeenLastCalledWith('first'));

    await userEvent.click(screen.getByTestId('code-split-view-upload-trigger'));
    await selectFile(createTextFile('second.txt', 'second'));
    await waitFor(() => expect(setInputValue).toHaveBeenLastCalledWith('second'));
    expect(setInputValue).toHaveBeenCalledTimes(2);
  });

  test('rejects unsupported extensions without changing input', async () => {
    render(<CodeSplitViewUpload setInputValue={setInputValue} />);
    await openUploadDialog();
    await selectFile(createTextFile('payload.exe', 'not code'));

    await waitFor(() => expect(toast.error).toHaveBeenCalled());
    expect(setInputValue).not.toHaveBeenCalled();
    expect(screen.getByTestId('code-split-view-upload-dialog')).toBeInTheDocument();
  });

  test('rejects files larger than 10 MiB without reading them', async () => {
    render(<CodeSplitViewUpload setInputValue={setInputValue} />);
    await openUploadDialog();

    const contents = new Uint8Array(10 * 1024 * 1024 + 1);
    const file = new File([contents], 'large.txt', { type: 'text/plain' });
    const read = vi.fn().mockResolvedValue('');
    Object.defineProperty(file, 'text', { value: read });
    await selectFile(file);

    await waitFor(() => expect(toast.error).toHaveBeenCalled());
    expect(read).not.toHaveBeenCalled();
    expect(setInputValue).not.toHaveBeenCalled();
  });

  test('rejects binary-like contents and keeps the dialog open', async () => {
    render(<CodeSplitViewUpload setInputValue={setInputValue} />);
    await openUploadDialog();
    await selectFile(createTextFile('data.txt', 'not\u0000text'));

    await waitFor(() => expect(toast.error).toHaveBeenCalled());
    expect(setInputValue).not.toHaveBeenCalled();
    expect(screen.getByTestId('code-split-view-upload-dialog')).toBeInTheDocument();
  });

  test('handles file read failures without changing input', async () => {
    render(<CodeSplitViewUpload setInputValue={setInputValue} />);
    await openUploadDialog();

    const file = new File(['contents'], 'broken.txt', { type: 'text/plain' });
    Object.defineProperty(file, 'text', {
      value: vi.fn().mockRejectedValue(new Error('read failed')),
    });
    await selectFile(file);

    await waitFor(() =>
      expect(toast.error).toHaveBeenCalledWith('Could not read the selected file.')
    );
    expect(setInputValue).not.toHaveBeenCalled();
    expect(screen.getByTestId('code-split-view-upload-dialog')).toBeInTheDocument();
  });
});
