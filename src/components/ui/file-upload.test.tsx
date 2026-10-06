import { createEvent, fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import FileUpload from './file-upload';

const imageFile = () => new File(['image data'], 'photo.png', { type: 'image/png' });

class TestDataTransfer {
  files: File[] = [];
  types = ['Files'];
  items: Array<{ kind: string; type: string; getAsFile: () => File }> & {
    add: (file: File) => void;
  } = Object.assign([], {
    add: (file: File) => {
      this.files.push(file);
      this.items.push({ kind: 'file', type: file.type, getAsFile: () => file });
    },
  });
}

class TestClipboardEvent extends Event {
  clipboardData: TestDataTransfer;

  constructor(type: string, init: ClipboardEventInit & { clipboardData: TestDataTransfer }) {
    super(type, init);
    this.clipboardData = init.clipboardData;
  }
}

class TestDropEvent extends Event {
  dataTransfer: TestDataTransfer;

  constructor(type: string, init: DragEventInit & { dataTransfer: TestDataTransfer }) {
    super(type, init);
    this.dataTransfer = init.dataTransfer;
  }
}

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('<FileUpload /> clipboard and drop support', () => {
  it('shows the redesigned upload prompt and file size limit', () => {
    render(<FileUpload testId="file-upload-dropzone" maxSize={15 * 1024 * 1024} />);

    expect(screen.getByTestId('file-upload-prompt')).toHaveTextContent('Upload files');
    expect(screen.getByTestId('file-upload-icon')).toBeInTheDocument();
    expect(screen.getByTestId('file-upload-max-size')).toHaveTextContent(
      'Max. file size: 15.00 MB'
    );
  });

  it('removes an uploaded file from the file list', async () => {
    render(<FileUpload inputTestId="file-upload-input" />);
    fireEvent.change(screen.getByTestId('file-upload-input'), {
      target: { files: [imageFile()] },
    });

    const removeButton = await screen.findByTestId('file-upload-remove-0');
    await userEvent.click(removeButton);

    expect(screen.queryByTestId('file-upload-remove-0')).not.toBeInTheDocument();
  });

  it('places the dropzone description before optional clipboard guidance', () => {
    render(
      <FileUpload
        enableImageClipboard
        showClipboardGuidance={false}
        dropZoneDescription="Upload up to 15 images"
      />
    );

    expect(screen.getByTestId('file-upload-description')).toHaveTextContent(
      'Upload up to 15 images'
    );
    expect(screen.queryByTestId('file-upload-clipboard-info')).not.toBeInTheDocument();
    expect(screen.queryByTestId('file-upload-paste-button')).not.toBeInTheDocument();
  });

  it('shows clipboard guidance only when enabled', () => {
    const { rerender } = render(<FileUpload />);

    expect(screen.queryByTestId('file-upload-paste-button')).not.toBeInTheDocument();

    rerender(<FileUpload enableImageClipboard />);

    expect(screen.getByTestId('file-upload-paste-button')).toBeInTheDocument();
    expect(screen.getByTestId('file-upload-clipboard-info')).toHaveTextContent(
      'your browser may ask you to grant clipboard permission.'
    );
  });

  it('does not inspect clipboard contents on render', () => {
    const read = vi.fn();
    vi.stubGlobal('navigator', { clipboard: { read } });

    render(<FileUpload enableImageClipboard />);

    expect(read).not.toHaveBeenCalled();
  });

  it('imports image files pasted into the dropzone', async () => {
    const onDropAccepted = vi.fn();
    const file = imageFile();

    render(
      <FileUpload
        testId="file-upload-dropzone"
        accept={{ 'image/*': [] }}
        onDropAccepted={onDropAccepted}
      />
    );
    fireEvent.paste(screen.getByTestId('file-upload-dropzone'), {
      clipboardData: {
        files: [file],
        items: [{ kind: 'file', type: file.type, getAsFile: () => file }],
        types: ['Files'],
      },
    });

    await waitFor(() => expect(onDropAccepted).toHaveBeenCalledWith([file], expect.anything()));
  });

  it('imports pasted images when the user pastes anywhere on the page', async () => {
    vi.stubGlobal('DataTransfer', TestDataTransfer);
    vi.stubGlobal('ClipboardEvent', TestClipboardEvent);
    vi.stubGlobal('DragEvent', TestDropEvent);

    const onDropAccepted = vi.fn();
    const file = imageFile();
    const clipboardData = {
      files: [file],
      items: [{ kind: 'file', type: file.type, getAsFile: () => file }],
      types: ['Files'],
    };

    render(
      <FileUpload
        enableImageClipboard
        showClipboardGuidance={false}
        testId="file-upload-dropzone"
        accept={{ 'image/*': [] }}
        onDropAccepted={onDropAccepted}
      />
    );
    fireEvent.paste(document.body, { clipboardData });

    await waitFor(() => expect(onDropAccepted).toHaveBeenCalledWith([file], expect.anything()));
    expect(await screen.findByTestId('file-upload-clipboard-status')).toHaveTextContent(
      'Clipboard image sent to upload validation'
    );
  });

  it('imports Firefox clipboard files without react-dropzone file markers', async () => {
    vi.stubGlobal('DataTransfer', TestDataTransfer);
    vi.stubGlobal('ClipboardEvent', TestClipboardEvent);
    vi.stubGlobal('DragEvent', TestDropEvent);

    const onDropAccepted = vi.fn();
    const file = imageFile();

    render(
      <FileUpload
        enableImageClipboard
        testId="file-upload-dropzone"
        accept={{ 'image/*': [] }}
        onDropAccepted={onDropAccepted}
      />
    );
    fireEvent.paste(document.body, {
      clipboardData: { files: [file], items: [], types: [] },
    });

    await waitFor(() => expect(onDropAccepted).toHaveBeenCalledWith([file], expect.anything()));
  });

  it('uses the same accepted-file pipeline for the clipboard button', async () => {
    vi.stubGlobal('DataTransfer', TestDataTransfer);
    vi.stubGlobal('ClipboardEvent', TestClipboardEvent);
    vi.stubGlobal('DragEvent', TestDropEvent);

    const read = vi.fn().mockResolvedValue([
      {
        types: ['image/png'],
        getType: vi.fn().mockResolvedValue(new Blob(['image data'], { type: 'image/png' })),
      },
    ]);
    vi.stubGlobal('navigator', { clipboard: { read } });
    const onDropAccepted = vi.fn();

    render(
      <FileUpload enableImageClipboard accept={{ 'image/*': [] }} onDropAccepted={onDropAccepted} />
    );
    await userEvent.click(screen.getByTestId('file-upload-paste-button'));

    await waitFor(() => expect(onDropAccepted).toHaveBeenCalledTimes(1));
    expect(onDropAccepted.mock.calls[0][0][0]).toMatchObject({
      name: expect.stringMatching(/^clipboard-image-/),
      type: 'image/png',
    });
    expect(read).toHaveBeenCalledTimes(1);
  });

  it('applies dropzone size limits to images from the clipboard button', async () => {
    vi.stubGlobal('DataTransfer', TestDataTransfer);
    vi.stubGlobal('ClipboardEvent', TestClipboardEvent);
    vi.stubGlobal('DragEvent', TestDropEvent);

    const read = vi.fn().mockResolvedValue([
      {
        types: ['image/png'],
        getType: vi.fn().mockResolvedValue(new Blob(['image data'], { type: 'image/png' })),
      },
    ]);
    vi.stubGlobal('navigator', { clipboard: { read } });
    const onDropRejected = vi.fn();

    render(
      <FileUpload
        enableImageClipboard
        accept={{ 'image/*': [] }}
        maxSize={1}
        onDropRejected={onDropRejected}
      />
    );
    await userEvent.click(screen.getByTestId('file-upload-paste-button'));

    await waitFor(() => expect(onDropRejected).toHaveBeenCalledTimes(1));
    expect(onDropRejected.mock.calls[0][0][0].errors[0].code).toBe('file-too-large');
  });

  it('does not intercept non-image clipboard content pasted elsewhere on the page', () => {
    const onDropAccepted = vi.fn();
    render(
      <FileUpload
        enableImageClipboard
        testId="file-upload-dropzone"
        accept={{ 'image/*': [] }}
        onDropAccepted={onDropAccepted}
      />
    );

    const pasteEvent = createEvent.paste(document.body, {
      clipboardData: { files: [], items: [], types: ['text/plain'] },
    });
    fireEvent(document.body, pasteEvent);

    expect(pasteEvent.defaultPrevented).toBe(false);
    expect(onDropAccepted).not.toHaveBeenCalled();
  });

  it('recommends keyboard paste when clipboard read has no image', async () => {
    const read = vi.fn().mockResolvedValue([{ types: ['text/plain'], getType: vi.fn() }]);
    const onDropAccepted = vi.fn();
    vi.stubGlobal('navigator', { clipboard: { read } });

    render(<FileUpload enableImageClipboard onDropAccepted={onDropAccepted} />);
    await userEvent.click(screen.getByTestId('file-upload-paste-button'));

    expect(await screen.findByTestId('file-upload-clipboard-status')).toHaveTextContent(
      'No image found in the clipboard. Paste with Ctrl/Cmd+V instead.'
    );
    expect(onDropAccepted).not.toHaveBeenCalled();
  });

  it('explains when clipboard permission is denied', async () => {
    const read = vi.fn().mockRejectedValue(new DOMException('denied', 'NotAllowedError'));
    vi.stubGlobal('navigator', { clipboard: { read } });

    render(<FileUpload enableImageClipboard />);
    await userEvent.click(screen.getByTestId('file-upload-paste-button'));

    expect(await screen.findByTestId('file-upload-clipboard-status')).toHaveTextContent(
      'Clipboard access was denied or unavailable'
    );
  });

  it('reports unavailable clipboard access without breaking file upload', async () => {
    vi.stubGlobal('navigator', { clipboard: { read: undefined } });
    const onDropAccepted = vi.fn();

    render(
      <FileUpload
        enableImageClipboard
        accept={{ 'image/*': [] }}
        onDropAccepted={onDropAccepted}
        inputTestId="image-input"
      />
    );
    fireEvent.click(screen.getByTestId('file-upload-paste-button'));

    expect(await screen.findByTestId('file-upload-clipboard-status')).toHaveTextContent(
      'Clipboard access is unavailable'
    );
    fireEvent.change(screen.getByTestId('image-input'), { target: { files: [imageFile()] } });

    await waitFor(() => expect(onDropAccepted).toHaveBeenCalledTimes(1));
  });

  it('imports a dropped image through the normal dropzone callback', async () => {
    const onDropAccepted = vi.fn();
    const file = imageFile();

    render(
      <FileUpload
        testId="file-upload-dropzone"
        accept={{ 'image/*': [] }}
        onDropAccepted={onDropAccepted}
      />
    );
    fireEvent.drop(screen.getByTestId('file-upload-dropzone'), {
      dataTransfer: {
        files: [file],
        items: [{ kind: 'file', type: file.type, getAsFile: () => file }],
        types: ['Files'],
      },
    });

    await waitFor(() => expect(onDropAccepted).toHaveBeenCalledWith([file], expect.anything()));
  });
});
