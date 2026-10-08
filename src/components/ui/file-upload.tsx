'use client';

import { cn } from '@/lib/utils';
import { Clipboard, FileText, Image as ImageIcon, Info, Trash2, Upload } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import {
  type DropzoneProps as _DropzoneProps,
  type DropzoneState as _DropzoneState,
} from 'react-dropzone';

export type DropzoneState = _DropzoneState;

export type DropzoneProps = Omit<_DropzoneProps, 'children'> & {
  containerClassName?: string;
  dropZoneClassName?: string;
  children?: (dropzone: DropzoneState) => React.ReactNode;
  enableImageClipboard?: boolean;
  dropZoneDescription?: React.ReactNode;
  showClipboardGuidance?: boolean;
  showFilesList?: boolean;
  showErrorMessage?: boolean;
  testId?: string;
  inputTestId?: string;
};

const dispatchFilesAsDrop = (root: HTMLElement | null, files: File[]) => {
  if (!root || typeof DataTransfer === 'undefined' || typeof DragEvent === 'undefined')
    return false;

  const dataTransfer = new DataTransfer();
  files.forEach((file) => dataTransfer.items.add(file));
  root.dispatchEvent(
    new DragEvent('drop', {
      bubbles: true,
      cancelable: true,
      dataTransfer,
    })
  );
  return true;
};

const getDroppedFiles = (dataTransfer: DataTransfer) =>
  Array.from(dataTransfer.items)
    .filter((item) => item.kind === 'file')
    .map((item) => item.getAsFile())
    .filter((file): file is File => file !== null);

const getDroppedImageUrl = (dataTransfer: DataTransfer) => {
  const uriList = dataTransfer
    .getData('text/uri-list')
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith('#'));
  const firefoxUrl = dataTransfer.getData('text/x-moz-url').split(/\r?\n/, 1)[0]?.trim();
  const html = dataTransfer.getData('text/html');
  const htmlUrl = html
    ? new DOMParser()
        .parseFromString(html, 'text/html')
        .querySelector('img[src]')
        ?.getAttribute('src')
    : undefined;
  const candidates = [
    ...uriList,
    dataTransfer.getData('text/x-moz-url-data').trim(),
    firefoxUrl,
    dataTransfer.getData('text/plain').trim(),
    htmlUrl,
  ];

  for (const candidate of candidates) {
    if (!candidate) continue;

    try {
      const url = new URL(candidate);
      if (url.protocol === 'http:' || url.protocol === 'https:') return url.href;
    } catch {
      // Ignore unusable transfer formats and check the remaining candidates.
    }
  }
};

const fetchDroppedImage = async (imageUrl: string) => {
  const response = await fetch(imageUrl, { credentials: 'omit' });
  if (!response.ok) throw new Error('The image URL could not be loaded.');

  const blob = await response.blob();
  if (!blob.type.startsWith('image/')) throw new Error('The dropped link is not an image.');

  const filename = new URL(imageUrl).pathname.split('/').pop();
  return new File([blob], filename || 'dropped-image', { type: blob.type });
};

export const FileUpload = ({
  containerClassName,
  dropZoneClassName,
  children,
  enableImageClipboard = false,
  showClipboardGuidance = true,
  showFilesList = true,
  dropZoneDescription,
  testId,
  inputTestId,
  ...props
}: DropzoneProps) => {
  const [clipboardStatus, setClipboardStatus] = useState<string>();
  const [dropStatus, setDropStatus] = useState<string>();
  const dropzone = useDropzone({
    ...props,
    onDrop(acceptedFiles, fileRejections, event) {
      if (props.onDrop) props.onDrop(acceptedFiles, fileRejections, event);
      else {
        setFilesUploaded((_filesUploaded) => [..._filesUploaded, ...acceptedFiles]);
        if (fileRejections.length > 0) {
          let _errorMessage = `Could not upload ${fileRejections[0].file.name}`;
          if (fileRejections.length > 1)
            _errorMessage = _errorMessage + `, and ${fileRejections.length - 1} other files.`;
          setErrorMessage(_errorMessage);
        } else {
          setErrorMessage('');
        }
      }
    },
  });

  const handleExternalImageDrop = async (event: React.DragEvent<HTMLDivElement>) => {
    if (props.disabled || event.dataTransfer.files.length > 0) return;

    const droppedFiles = getDroppedFiles(event.dataTransfer);
    if (droppedFiles.length && dispatchFilesAsDrop(dropzone.rootRef.current, droppedFiles)) {
      event.preventDefault();
      event.stopPropagation();
      setDropStatus('Dropped files sent to upload validation.');
      return;
    }

    const imageUrl = getDroppedImageUrl(event.dataTransfer);
    if (!imageUrl) return;

    event.preventDefault();
    event.stopPropagation();
    setDropStatus('Loading dropped image…');

    try {
      const file = await fetchDroppedImage(imageUrl);
      if (!dispatchFilesAsDrop(dropzone.rootRef.current, [file])) {
        throw new Error('The dropzone is unavailable.');
      }
      setDropStatus('Dropped image sent to upload validation.');
    } catch (error) {
      setDropStatus(
        error instanceof Error && error.message === 'The dropped link is not an image.'
          ? 'The dropped link did not return an image.'
          : 'Could not access the dropped image. Try saving it and uploading it instead.'
      );
    }
  };

  useEffect(() => {
    if (!enableImageClipboard || props.disabled) return;

    const handlePagePaste = (event: ClipboardEvent) => {
      const root = dropzone.rootRef.current;
      if (!root || root.contains(event.target as Node)) return;

      const clipboardData = event.clipboardData;
      const imageFiles = Array.from(clipboardData?.files ?? []).filter((file) =>
        file.type.startsWith('image/')
      );
      const itemFiles = Array.from(clipboardData?.items ?? [])
        .filter((item) => item.kind === 'file' && item.type.startsWith('image/'))
        .map((item) => item.getAsFile())
        .filter((file): file is File => file !== null);
      const files = imageFiles.length ? imageFiles : itemFiles;

      if (!files.length || !dispatchFilesAsDrop(root, files)) return;

      event.preventDefault();
      setClipboardStatus('Clipboard image sent to upload validation.');
    };

    window.addEventListener('paste', handlePagePaste);
    return () => window.removeEventListener('paste', handlePagePaste);
  }, [dropzone.rootRef, enableImageClipboard, props.disabled]);

  const pasteClipboardImages = async () => {
    setClipboardStatus('Checking for an image in the clipboard…');

    if (!navigator.clipboard?.read) {
      setClipboardStatus('Clipboard access is unavailable in this browser.');
      return;
    }

    let clipboardItems: ClipboardItems;
    try {
      clipboardItems = await navigator.clipboard.read();
    } catch {
      setClipboardStatus('Clipboard access was denied or unavailable. Paste with Ctrl+V instead.');
      return;
    }

    try {
      const clipboardFiles: File[] = [];

      for (const item of clipboardItems) {
        const type = item.types.find((clipboardType) => clipboardType.startsWith('image/'));
        if (!type) continue;

        const blob = await item.getType(type);
        const subtype = type
          .slice('image/'.length)
          .split('+')[0]
          .replace(/[^a-z0-9]/gi, '');
        const extension = subtype === 'jpeg' ? 'jpg' : subtype || 'img';
        clipboardFiles.push(
          new File([blob], `clipboard-image-${clipboardFiles.length + 1}.${extension}`, {
            type,
          })
        );
      }

      if (!clipboardFiles.length) {
        setClipboardStatus('No image found in the clipboard. Paste with Ctrl/Cmd+V instead.');
        return;
      }

      if (!dispatchFilesAsDrop(dropzone.rootRef.current, clipboardFiles)) {
        setClipboardStatus(
          'Clipboard images are not supported here. Paste with Ctrl/Cmd+V instead.'
        );
        return;
      }

      setClipboardStatus('Clipboard image sent to upload validation.');
    } catch {
      setClipboardStatus('Could not paste the clipboard image. Paste with Ctrl+V instead.');
    }
  };

  const [filesUploaded, setFilesUploaded] = useState<File[]>([]);
  const [errorMessage, setErrorMessage] = useState<string>();

  const deleteUploadedFile = (index: number) => {
    setFilesUploaded((_uploadedFiles) => [
      ..._uploadedFiles.slice(0, index),
      ..._uploadedFiles.slice(index + 1),
    ]);
  };

  return (
    <div className={cn('flex flex-col gap-4', containerClassName)}>
      <div
        {...dropzone.getRootProps({ onDropCapture: handleExternalImageDrop })}
        data-testid={testId}
        className={cn(
          'group flex w-full min-h-32 flex-col items-center justify-center gap-3 rounded-3xl border border-dashed border-border bg-muted/20 px-6 py-8 text-center transition-colors hover:border-primary/50 hover:bg-muted/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 select-none cursor-pointer',
          dropzone.isDragAccept && 'border-primary bg-primary/5',
          props.disabled && 'cursor-not-allowed opacity-60 hover:border-border hover:bg-muted/20',
          dropZoneClassName
        )}
      >
        <input {...dropzone.getInputProps()} data-testid={inputTestId} />
        {children ? (
          children(dropzone)
        ) : dropzone.isDragAccept ? (
          <div data-testid="file-upload-prompt" className="text-base font-medium">
            Drop your files here
          </div>
        ) : (
          <div data-testid="file-upload-prompt" className="flex flex-col items-center gap-3">
            <span
              data-testid="file-upload-icon"
              className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary"
            >
              <Upload aria-hidden="true" className="h-5 w-5" />
            </span>
            <span className="flex flex-col items-center gap-1">
              <span className="text-lg font-medium">Upload files</span>
              {props.maxSize && (
                <span data-testid="file-upload-max-size" className="text-sm text-muted-foreground">
                  Max. file size: {(props.maxSize / (1024 * 1024)).toFixed(2)} MB
                </span>
              )}
            </span>
          </div>
        )}
      </div>
      {dropStatus && (
        <span
          data-testid="file-upload-drop-status"
          className="self-center text-xs text-muted-foreground"
          aria-live="polite"
        >
          {dropStatus}
        </span>
      )}
      {dropZoneDescription && (
        <div
          data-testid="file-upload-description"
          className="text-center text-xs text-muted-foreground"
        >
          {dropZoneDescription}
        </div>
      )}
      {enableImageClipboard && (
        <>
          {showClipboardGuidance && (
            <>
              <div
                role="note"
                data-testid="file-upload-clipboard-info"
                className="flex items-start gap-3 rounded-xl border border-border bg-muted/30 p-4 text-sm text-muted-foreground"
              >
                <Info aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0" />
                <span>
                  Paste one or more images anywhere on this page with Ctrl/Cmd+V, or check them
                  here. You can also drag images from another tab. Cross-origin image links must
                  allow browser access. The clipboard is only read after you click the button, and
                  your browser may ask you to grant clipboard permission. Images stay in your
                  browser.
                </span>
              </div>
              <button
                type="button"
                data-testid="file-upload-paste-button"
                className="inline-flex items-center gap-2 self-center text-sm font-medium text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                disabled={props.disabled}
                onClick={pasteClipboardImages}
              >
                <Clipboard aria-hidden="true" className="h-4 w-4" />
                Check and paste image
              </button>
            </>
          )}
          {clipboardStatus && (
            <span
              data-testid="file-upload-clipboard-status"
              className="self-center text-xs text-muted-foreground"
              aria-live="polite"
            >
              {clipboardStatus}
            </span>
          )}
        </>
      )}
      {errorMessage && <span className="text-xs text-red-600 mt-3">{errorMessage}</span>}
      {showFilesList && filesUploaded.length > 0 && (
        <div
          className={`flex flex-col gap-2 w-full ${filesUploaded.length > 2 ? 'h-48' : 'h-fit'} mt-2 ${filesUploaded.length > 0 ? 'pb-2' : ''}`}
        >
          <div className="w-full">
            {filesUploaded.map((fileUploaded, index) => (
              <div
                key={index}
                className="mt-2 flex min-h-16 w-full flex-row items-center justify-between rounded-xl border border-border bg-card px-4 py-3"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10">
                    {fileUploaded.type === 'application/pdf' ? (
                      <FileText aria-hidden="true" className="h-5 w-5 text-primary" />
                    ) : (
                      <ImageIcon aria-hidden="true" className="h-5 w-5 text-primary" />
                    )}
                  </span>
                  <div className="flex min-w-0 flex-col">
                    <div className="truncate text-sm font-medium leading-snug">
                      {fileUploaded.name.split('.').slice(0, -1).join('.').substring(0, 30)}
                    </div>
                    <div className="text-xs text-muted-foreground leading-tight">
                      .{fileUploaded.name.split('.').pop()} •{' '}
                      {(fileUploaded.size / (1024 * 1024)).toFixed(2)} MB
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  aria-label={`Remove ${fileUploaded.name}`}
                  data-testid={`file-upload-remove-${index}`}
                  className="ml-3 flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  onClick={() => deleteUploadedFile(index)}
                >
                  <Trash2 aria-hidden="true" className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default FileUpload;
