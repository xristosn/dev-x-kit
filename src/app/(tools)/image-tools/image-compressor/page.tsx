'use client';

import { useWebStorage } from '@/hooks/use-web-storage';
import { FaqSection, type FaqItem } from '@/components/faq-section';
import { useState } from 'react';
import Compressor from 'compressorjs';
import JSZip from 'jszip';
import {
  CompressionState,
  ConvertedFile,
  DEFAULT_IMAGE_COMPRESS_STORE_VALUE,
  MAX_FILES,
} from './_lib/utils';
import { ImageCompressorUpload } from './_components/image-compressor-upload';
import { ImageCompressorSetup } from './_components/image-compressor-setup';
import { ImageCompressorResults } from './_components/image-compressor-results';

const FAQS = [
  {
    title: 'Does the quality setting guarantee a smaller file?',
    description:
      'No. The setting controls the compressor quality from 10% to 99%, with 80% as the default. The resulting size depends on the image and its format, so a lower setting does not guarantee a particular size reduction.',
  },
  {
    title: 'How many images can I compress at once?',
    description:
      'You can process up to 15 images in one batch. Each image must be no larger than 15 MiB. Compression runs one image at a time in your browser.',
  },
  {
    title: 'What happens if one image in the batch fails?',
    description:
      'The remaining images continue processing. Successful results can be downloaded individually or together in a ZIP file, while failed files are skipped in the ZIP.',
  },
] satisfies readonly FaqItem[];

export default function ImageCompressor() {
  const [value, setValue] = useWebStorage(
    'image-compressor',
    'infer',
    DEFAULT_IMAGE_COMPRESS_STORE_VALUE
  );
  const [state, setState] = useState<CompressionState>(CompressionState.None);
  const [files, setFiles] = useState<File[]>([]);
  const [convertedFiles, setConvertedFiles] = useState<ConvertedFile[]>([]);
  const [activeFile, setActiveFile] = useState('');

  const optimize = async () => {
    setState(CompressionState.Active);

    try {
      for (const file of files) {
        setActiveFile(file.name);

        try {
          await new Promise<void>((resolve) => {
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
                    blob: outputFile,
                    sizeSavedRatio: Math.round(((file.size - outputFile.size) / file.size) * 100),
                  },
                ]);
                resolve();
              },
              error(error) {
                setConvertedFiles((p) => [
                  ...p,
                  { name: file.name, size: 0, error: error.message },
                ]);
                resolve();
              },
            });
          });
        } catch (error) {
          setConvertedFiles((p) => [
            ...p,
            {
              name: file.name,
              size: 0,
              error: error instanceof Error ? error.message : String(error),
            },
          ]);
        }
      }
    } finally {
      setActiveFile('');
      setState(CompressionState.Ended);
    }
  };

  const onDownloadAllClick = async () => {
    const zip = new JSZip();

    for (const file of convertedFiles) {
      if (file.blob) zip.file(file.name, file.blob);
    }

    const content = await zip.generateAsync({ type: 'blob' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(content);
    link.download = 'compressed_images.zip';
    link.click();
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
    <>
      {state === CompressionState.None && (
        <ImageCompressorUpload
          files={files}
          activeFile={activeFile}
          onFilesAccepted={(acceptedFiles) => setFiles(acceptedFiles.slice(0, MAX_FILES))}
        />
      )}

      {state === CompressionState.None && !!files.length && (
        <ImageCompressorSetup
          fileCount={files.length}
          quality={value.quality}
          setQuality={(quality) => setValue((previous) => ({ ...previous, quality }))}
          onOptimize={optimize}
        />
      )}

      {state !== CompressionState.None && (
        <ImageCompressorResults
          files={files}
          convertedFiles={convertedFiles}
          activeFile={activeFile}
          quality={value.quality}
          totalOriginalSize={totalOriginalSize}
          totalConvertedSize={totalConvertedSize}
          totalSizeSavedRatio={totalSizeSavedRatio}
          onDownloadAll={onDownloadAllClick}
          onStartOver={onStartOver}
        />
      )}

      <FaqSection items={FAQS} />
    </>
  );
}
