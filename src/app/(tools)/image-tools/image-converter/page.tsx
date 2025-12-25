'use client';

import { Container } from '@/components/container';
import { FileUpload } from '@/components/ui/file-upload';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import Compressor from 'compressorjs';
import { Spinner } from '@/components/ui/spinner';
import { Button } from '@/components/ui/button';
import prettyBytes from 'pretty-bytes';
import JSZip from 'jszip';
import { Check } from 'lucide-react';
import { useWebStorage } from '@/hooks/use-web-storage';
import {
  DEFAULT_IMAGE_CONVERTER_STORE_VALUE,
  ConversionState,
  ConvertedFile,
  MAX_FILES,
  MIME_TYPE_LABELS,
  SUPPORTED_MIME_TYPES,
  OPAQUE_MIME_TYPES,
} from './utils';
import { ColorPopover } from '@/components/color/color-popover';
import { ColorService, IColor } from 'react-color-palette';
import { InputWrapper } from '@/components/input-wrapper';

export default function ImageConverter() {
  const [value, setValue] = useWebStorage(
    'image-converter',
    'infer',
    DEFAULT_IMAGE_CONVERTER_STORE_VALUE
  );
  const [state, setState] = useState(ConversionState.None);
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
      } else
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
              console.log(error.message);
              setConvertedFiles((p) => [...p, { name: file.name, size: 0, error: error.message }]);
              reject(error);
            },
          });
        });
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
    <Container>
      {state === ConversionState.None && (
        <div
          className={cn(
            'flex flex-col gap-2',
            state === ConversionState.None && !files.length && 'h-full'
          )}
        >
          <FileUpload
            accept={{ 'image/*': [] }}
            maxSize={15 * 1024 * 1024}
            maxFiles={MAX_FILES * 2}
            showFilesList={false}
            disabled={!!activeFile}
            onDropAccepted={(files) => setFiles(files.slice(0, MAX_FILES))}
            containerClassName="my-auto"
            dropZoneClassName={cn(
              'min-h-40',
              state === ConversionState.None &&
                !files.length &&
                'h-[calc(75vh-var(--header-height)-(var(--spacing)*8))]'
            )}
          />

          <p className="text-xs text-center text-muted-foreground">
            Upload up to {MAX_FILES} images
          </p>
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
                  size="lg"
                  variant={value.to === type ? 'default' : 'outline'}
                  onClick={() => setValue((p) => ({ ...p, to: type }))}
                >
                  {MIME_TYPE_LABELS[type]}
                </Button>
              ))}
            </div>

            {OPAQUE_MIME_TYPES.includes(value.to) && (
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
            )}
          </div>

          <Button
            size="lg"
            className="text-xl font-bold h-12 w-full"
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
                    <p className="text-lg flex gap-2 items-center">
                      <Check className="text-green-500" /> Convertion to{' '}
                      {MIME_TYPE_LABELS[value.to]} Complete
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Original Size: {prettyBytes(totalOriginalSize)}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Converted Size: {prettyBytes(totalConvertedSize)}
                    </p>
                  </div>
                )}
              </div>

              <Button size="lg" variant="outline" onClick={onDownloadAllClick}>
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
                          <p className="text-xs text-muted-foreground">{converted.error}</p>
                        </div>
                      ) : (
                        <div className="flex flex-col gap-2 text-center">
                          <Button asChild variant="outline" disabled={isActive || !converted}>
                            <a href={converted?.url} download={file.name}>
                              Download
                            </a>
                          </Button>

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

          <Button className="mx-auto mt-4" size="lg" variant="outline" onClick={onStartOver}>
            Start Over
          </Button>
        </>
      )}
    </Container>
  );
}
