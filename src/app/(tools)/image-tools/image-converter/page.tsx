'use client';

import { ColorPopover } from '@/components/color/color-popover';
import { FaqSection, type FaqItem } from '@/components/faq-section';
import { InputWrapper } from '@/components/input-wrapper';
import { Button } from '@/components/ui/button';
import { FileUpload } from '@/components/ui/file-upload';
import { Spinner } from '@/components/ui/spinner';
import { useWebStorage } from '@/hooks/use-web-storage';
import { cn } from '@/lib/utils';
import Compressor from 'compressorjs';
import JSZip from 'jszip';
import { Check } from 'lucide-react';
import prettyBytes from 'pretty-bytes';
import { useState } from 'react';
import { ColorService, IColor } from 'react-color-palette';
import {
  ConversionState,
  ConvertedFile,
  DEFAULT_IMAGE_CONVERTER_STORE_VALUE,
  MAX_FILES,
  MIME_TYPE_LABELS,
  OPAQUE_MIME_TYPES,
  SUPPORTED_MIME_TYPES,
} from './_lib/utils';

const FAQS = [
  {
    title: 'Which output formats can I convert to?',
    description:
      'Choose JPEG, PNG, WebP, or BMP. The tool accepts image files, but conversion depends on whether your browser can decode the source image. You can convert up to 15 files per batch, with a 15 MiB limit per file.',
  },
  {
    title: 'What happens to transparent areas in JPEG or BMP?',
    description:
      'JPEG and BMP do not support transparency, so the tool fills transparent areas with the selected opaque color. White is used by default. PNG and WebP output can retain transparent areas.',
  },
  {
    title: 'Why does a converted file keep its original extension?',
    description:
      'Downloads use the source filename, including its extension, even when you select another output format. Check the format you chose before using the downloaded file. If the source already matches the selected format, it is passed through without conversion.',
  },
] satisfies readonly FaqItem[];

export default function ImageConverter() {
  const [value, setValue] = useWebStorage(
    'image-converter',
    'infer',
    DEFAULT_IMAGE_CONVERTER_STORE_VALUE
  );
  const [state, setState] = useState<ConversionState>(ConversionState.None);
  const [files, setFiles] = useState<File[]>([]);
  const [convertedFiles, setConvertedFiles] = useState<ConvertedFile[]>([]);
  const [activeFile, setActiveFile] = useState('');

  const convert = async () => {
    setState(ConversionState.Active);

    for (const file of files) {
      setActiveFile(file.name);

      if (file.type === value.to) {
        setConvertedFiles((p) => [
          ...p,
          {
            name: file.name,
            size: file.size,
            url: URL.createObjectURL(file),
          },
        ]);
      } else {
        try {
          await new Promise((resolve, reject) => {
            new Compressor(file, {
              quality: 1,
              mimeType: value.to,
              retainExif: true,

              beforeDraw(context, canvas) {
                if (OPAQUE_MIME_TYPES.includes(value.to)) {
                  context.fillStyle = value.opaqueColor;
                  context.fillRect(0, 0, canvas.width, canvas.height);
                }
              },

              success(outputFile) {
                setConvertedFiles((p) => [
                  ...p,
                  {
                    name: file.name,
                    size: outputFile.size,
                    url: URL.createObjectURL(outputFile),
                  },
                ]);

                resolve(outputFile);
              },
              error(error) {
                setConvertedFiles((p) => [
                  ...p,
                  { name: file.name, size: 0, error: error.message },
                ]);
                reject(error);
              },
            });
          });
        } catch {
          // The error callback records the failed file so conversion can continue.
        }
      }
    }

    setActiveFile('');
    setState(ConversionState.Ended);
  };

  const onDownloadAllClick = async () => {
    const zip = new JSZip();

    for (const file of convertedFiles) {
      if (file.url) {
        const response = await fetch(file.url);
        const blob = await response.blob();
        zip.file(file.name, blob);
      }
    }

    zip.generateAsync({ type: 'blob' }).then((content) => {
      const link = document.createElement('a');
      link.href = URL.createObjectURL(content);
      link.download = 'converted_images.zip';
      link.click();
    });
  };

  const onStartOver = () => {
    setFiles([]);
    setConvertedFiles([]);
    setState(ConversionState.None);
  };

  const totalOriginalSize = files.reduce((acc, file) => acc + file.size, 0);
  const totalConvertedSize = convertedFiles.reduce((acc, file) => acc + (file.size || 0), 0);

  return (
    <>
      {state === ConversionState.None && (
        <div
          className={cn(
            'flex flex-col gap-2',
            state === ConversionState.None && !files.length && 'h-full'
          )}
        >
          <FileUpload
            enableImageClipboard
            showClipboardGuidance={!files.length}
            dropZoneDescription={`Upload up to ${MAX_FILES} images`}
            accept={{ 'image/*': [] }}
            maxSize={15 * 1024 * 1024}
            maxFiles={MAX_FILES * 2}
            showFilesList={false}
            disabled={!!activeFile}
            onDropAccepted={(files) => setFiles(files.slice(0, MAX_FILES))}
            dropZoneClassName={cn(
              state === ConversionState.None && !files.length && 'editor-height'
            )}
          />
        </div>
      )}

      {state === ConversionState.None && !!files.length && (
        <div className="flex flex-col items-center gap-8 my-12 max-w-md mx-auto w-full">
          <div className="p-4 bg-sidebar rounded-xl flex flex-col gap-4">
            <p className="text-center text-lg">Convert to:</p>

            <div className="flex flex-wrap gap-4 justify-center">
              {SUPPORTED_MIME_TYPES.map((type) => (
                <Button
                  key={type}
                  data-testid={`image-converter-format-${MIME_TYPE_LABELS[type].toLowerCase()}`}
                  size="lg"
                  variant={value.to === type ? 'default' : 'outline'}
                  onClick={() => setValue((p) => ({ ...p, to: type }))}
                >
                  {MIME_TYPE_LABELS[type]}
                </Button>
              ))}
            </div>

            {OPAQUE_MIME_TYPES.includes(value.to) && (
              <div data-testid="image-converter-opaque-color">
                <InputWrapper
                  label="Opaque Color"
                  helperText="Choose a color to fill transparent areas when converting to an opaque format (e.g., PNG to JPEG)."
                >
                  <ColorPopover
                    value={ColorService.convert('hex', value.opaqueColor)}
                    setValue={(c) => setValue((p) => ({ ...p, opaqueColor: (c as IColor).hex }))}
                    disableAlpha
                  />
                </InputWrapper>
              </div>
            )}
          </div>

          <Button
            size="lg"
            className="text-xl font-bold h-12 w-full"
            data-testid="image-converter-convert"
            variant="outline"
            onClick={convert}
          >
            Convert {files.length} file{files.length === 1 ? '' : 's'}
          </Button>
        </div>
      )}

      {state !== ConversionState.None && (
        <>
          <div className="shadow-md">
            <div className="bg-card text-sidebar-foreground p-4 rounded-t-lg flex gap-4 items-center justify-between">
              <div className="flex flex-col gap-2">
                {activeFile && (
                  <div className="flex gap-4 items-center">
                    <Spinner />
                    <p className="text-lg">Converting to {MIME_TYPE_LABELS[value.to]}</p>
                  </div>
                )}

                {!!convertedFiles.length && !activeFile && (
                  <div className="flex flex-col gap-2">
                    <p
                      data-testid="image-converter-completion"
                      className="text-lg flex gap-2 items-center"
                    >
                      <Check className="text-green-500" /> Convertion to{' '}
                      {MIME_TYPE_LABELS[value.to]} Complete
                    </p>
                    <p
                      data-testid="image-converter-original-size"
                      className="text-sm text-muted-foreground"
                    >
                      Original Size: {prettyBytes(totalOriginalSize)}
                    </p>
                    <p
                      data-testid="image-converter-converted-size"
                      className="text-sm text-muted-foreground"
                    >
                      Converted Size: {prettyBytes(totalConvertedSize)}
                    </p>
                  </div>
                )}
              </div>

              <Button
                data-testid="image-converter-download-all"
                size="lg"
                variant="outline"
                onClick={onDownloadAllClick}
              >
                Download all images
              </Button>
            </div>

            <div className="flex flex-col gap-4 bg-sidebar p-4 rounded-b-lg">
              {files.map((file) => {
                const isActive = activeFile === file.name;
                const converted = convertedFiles.find((f) => f.name === file.name);

                return (
                  <div key={file.name} className="flex gap-4 items-center justify-between">
                    <div className="flex flex-col gap-2">
                      <p>{file.name}</p>
                      <p className="text-sm text-muted-foreground">{prettyBytes(file.size)}</p>
                    </div>

                    <div className="flex flex-col gap-2">
                      {isActive ? (
                        <Spinner />
                      ) : converted?.error ? (
                        <div className="flex flex-col gap-2">
                          <p className="text-red-300">An error occured</p>
                          <p
                            data-testid={`image-converter-file-error-${file.name}`}
                            className="text-xs text-muted-foreground"
                          >
                            {converted.error}
                          </p>
                        </div>
                      ) : (
                        <div className="flex flex-col gap-2 text-center">
                          <Button
                            data-testid={`image-converter-file-download-${file.name}`}
                            variant="outline"
                            disabled={isActive || !converted}
                            nativeButton={false}
                            render={
                              <a href={converted?.url} download={file.name}>
                                Download
                              </a>
                            }
                          />

                          {converted?.size && (
                            <p className="text-sm text-muted-foreground">
                              {prettyBytes(converted.size)}
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <Button
            data-testid="image-converter-start-over"
            className="mx-auto mt-4"
            size="lg"
            variant="outline"
            onClick={onStartOver}
          >
            Start Over
          </Button>
        </>
      )}

      <FaqSection items={FAQS} />
    </>
  );
}
