import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { Check } from 'lucide-react';
import prettyBytes from 'pretty-bytes';
import { ConvertedFile } from '../_lib/utils';

type ImageCompressorResultsProps = {
  files: File[];
  convertedFiles: ConvertedFile[];
  activeFile: string;
  quality: number;
  totalOriginalSize: number;
  totalConvertedSize: number;
  totalSizeSavedRatio: number;
  onDownloadAll: () => void;
  onStartOver: () => void;
};

export function ImageCompressorResults({
  files,
  convertedFiles,
  activeFile,
  quality,
  totalOriginalSize,
  totalConvertedSize,
  totalSizeSavedRatio,
  onDownloadAll,
  onStartOver,
}: ImageCompressorResultsProps) {
  const failedCount = convertedFiles.filter((file) => file.error).length;

  return (
    <>
      <div className="shadow-md">
        <div className="bg-card text-sidebar-foreground p-4 rounded-t-lg flex gap-4 items-center justify-between">
          <div className="flex flex-col gap-2">
            {activeFile && (
              <div className="flex gap-4 items-center">
                <Spinner />
                <p className="text-lg">Optimizing ({quality * 100}% quality)</p>
              </div>
            )}

            {!!convertedFiles.length && !activeFile && (
              <div className="flex flex-col gap-2">
                <p
                  className="text-lg flex gap-2 items-center"
                  data-testid="image-compressor-complete"
                >
                  <Check className="text-green-500" /> Optimization{' '}
                  {failedCount ? 'Finished' : 'Complete'} ({quality * 100}% quality)
                </p>
                {failedCount ? (
                  <p
                    className="text-sm text-muted-foreground"
                    data-testid="image-compressor-failure-count"
                  >
                    {failedCount} image{failedCount === 1 ? '' : 's'} could not be compressed.
                  </p>
                ) : (
                  <>
                    <p className="text-sm text-muted-foreground">
                      Original Size: {prettyBytes(totalOriginalSize)}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Converted Size: {prettyBytes(totalConvertedSize)} (Saved:{' '}
                      {totalSizeSavedRatio}%)
                    </p>
                  </>
                )}
              </div>
            )}
          </div>

          <Button
            size="lg"
            variant="outline"
            data-testid="image-compressor-download-all"
            onClick={onDownloadAll}
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
                  {converted?.error ? (
                    <div className="flex flex-col gap-2">
                      <p
                        className="text-red-300"
                        data-testid={`image-compressor-file-error-${file.name}`}
                      >
                        Couldn&apos;t compress this image.
                      </p>
                      <p className="text-xs text-muted-foreground">
                        It may be damaged, unsupported, or too large for this browser to decode. Try
                        re-saving it or using a different image format.
                      </p>
                      <details
                        className="text-xs text-muted-foreground"
                        data-testid={`image-compressor-error-details-${file.name}`}
                      >
                        <summary className="cursor-pointer">Technical details</summary>
                        <p className="mt-1 break-all">{converted.error}</p>
                      </details>
                    </div>
                  ) : isActive ? (
                    <Spinner />
                  ) : (
                    <div className="flex flex-col gap-2 text-center">
                      <Button
                        variant="outline"
                        disabled={isActive || !converted}
                        nativeButton={false}
                        render={
                          <a
                            href={converted?.url}
                            download={file.name}
                            data-testid={`image-compressor-download-${file.name}`}
                          >
                            Download
                          </a>
                        }
                      />

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

      <Button
        className="mx-auto mt-4"
        size="lg"
        variant="outline"
        data-testid="image-compressor-start-over"
        onClick={onStartOver}
      >
        Start Over
      </Button>
    </>
  );
}
