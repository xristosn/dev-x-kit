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
  CompressionState,
  ConvertedFile,
  DEFAULT_IMAGE_COMPRESS_STORE_VALUE,
  MAX_FILES,
} from './utils';
import { QualityRange } from './quality-range';

export default function ImageCompressor() {
  const [value, setValue] = useWebStorage(
    'image-compressor',
    'infer',
    DEFAULT_IMAGE_COMPRESS_STORE_VALUE
  );
  const [state, setState] = useState(CompressionState.None);
  const [files, setFiles] = useState<File[]>([]);
  const [convertedFiles, setConvertedFiles] = useState<ConvertedFile[]>([]);
  const [activeFile, setActiveFile] = useState('');

  const optimize = async () => {
    setState(CompressionState.Active);

    for (const file of files) {
      setActiveFile(file.name);

      await new Promise((resolve, reject) => {
        new Compressor(file, {
          quality: value.quality,
          mimeType: file.type,
          retainExif: true,

          success(outputFile) {
            setConvertedFiles((p) => [
              ...p,
              {
                name: file.name,
                size: outputFile.size,
                url: URL.createObjectURL(outputFile),
                sizeSavedRatio: Math.round(((file.size - outputFile.size) / file.size) * 100),
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
    setState(CompressionState.Ended);
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
      link.download = 'compressed_images.zip';
      link.click();
    });
  };

  const onStartOver = () => {
    setFiles([]);
    setConvertedFiles([]);
    setState(CompressionState.None);
  };

  const totalOriginalSize = files.reduce((acc, file) => acc + file.size, 0);
  const totalConvertedSize = convertedFiles.reduce((acc, file) => acc + (file.size || 0), 0);
  const totalSizeSaved = totalOriginalSize - totalConvertedSize;
  const totalSizeSavedRatio =
    totalOriginalSize > 0 ? Math.round((totalSizeSaved / totalOriginalSize) * 100) : 0;

  return (
    <Container>
      {state === CompressionState.None && (
        <div
          className={cn(
            'flex flex-col gap-2',
            state === CompressionState.None && !files.length && 'h-full'
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
              state === CompressionState.None &&
                !files.length &&
                'h-[calc(75vh-var(--header-height)-(var(--spacing)*8))]'
            )}
          />

          <p className="text-xs text-center text-muted-foreground">
            Upload up to {MAX_FILES} images
          </p>
        </div>
      )}

      {state === CompressionState.None && !!files.length && (
        <div className="flex flex-col items-center gap-8 my-12 max-w-md mx-auto w-full">
          <QualityRange
            value={value.quality}
            setValue={(v) => setValue((p) => ({ ...p, quality: v as number }))}
          />

          <Button
            size="lg"
            className="text-xl font-bold h-12 w-full"
            variant="outline"
            onClick={optimize}
          >
            Convert {files.length} file{files.length === 1 ? '' : 's'}
          </Button>
        </div>
      )}

      {state !== CompressionState.None && (
        <>
          <div className="shadow-md">
            <div className="bg-card text-sidebar-foreground p-4 rounded-t-lg flex gap-4 items-center justify-between">
              <div className="flex flex-col gap-2">
                {activeFile && (
                  <div className="flex gap-4 items-center">
                    <Spinner />
                    <p className="text-lg">Optimizing ({value.quality * 100}% quality)</p>
                  </div>
                )}

                {!!convertedFiles.length && !activeFile && (
                  <div className="flex flex-col gap-2">
                    <p className="text-lg flex gap-2 items-center">
                      <Check className="text-green-500" /> Optimization Complete (
                      {value.quality * 100}% quality)
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Original Size: {prettyBytes(totalOriginalSize)}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Converted Size: {prettyBytes(totalConvertedSize)} (Saved:{' '}
                      {totalSizeSavedRatio}
                      %)
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
                              Saved {converted.sizeSavedRatio}% ({prettyBytes(converted.size)})
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
