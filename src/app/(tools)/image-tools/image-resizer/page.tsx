'use client';

import { FaqSection, type FaqItem } from '@/components/faq-section';
import FileUpload from '@/components/ui/file-upload';
import { useWebStorage } from '@/hooks/use-web-storage';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import { ImageResizerSettings } from './_components/image-resizer-settings';
import { resizeImage } from './_lib/resize-image';
import { DEFAULT_IMAGE_RESIZER_STORE_VALUE } from './_lib/utils';

const FAQS = [
  {
    title: 'Why does changing the width also change the height?',
    description:
      'Lock Aspect Ratio is on by default, so editing either dimension updates the other to preserve the original image proportions. Turn it off when you need to set width and height independently.',
  },
  {
    title: 'What do the Crop, Pad, and Distort fit modes do?',
    description:
      'Crop fills the target dimensions by cutting off parts of the image. Pad keeps the whole image and fills any empty space with a background color. Distort stretches the image to the exact dimensions. For custom dimensions, unlock the aspect ratio to choose a fit mode; social presets also offer fit modes.',
  },
  {
    title: 'What are percentage dimensions based on?',
    description:
      'The percentage is calculated from the original uploaded image, not from a previous resized result. The resulting width and height are rounded to whole pixels.',
  },
] satisfies readonly FaqItem[];

export default function ImageResizer() {
  const [file, setFile] = useState<File | null>(null);
  const [width, setWidth] = useState<number>(0);
  const [height, setHeight] = useState<number>(0);
  const [aspectRatio, setAspectRatio] = useState<number>(1);
  const [originalSize, setOriginalSize] = useState<{ width: number; height: number } | null>(null);
  const [value, setValue] = useWebStorage(
    'image-resizer',
    'infer',
    DEFAULT_IMAGE_RESIZER_STORE_VALUE
  );

  const onFileChange = (file: File) => {
    setFile(file);

    const url = URL.createObjectURL(file);
    const img = new Image();

    img.onload = () => {
      setOriginalSize({ width: img.width, height: img.height });
      setWidth(img.width);
      setHeight(img.height);
      setAspectRatio(img.width / img.height);
    };

    img.src = url;
  };

  const onWidthChange = (val: number) => {
    setWidth(val);
    if (value.lockAspectRatio && val && aspectRatio) {
      setHeight(Math.round(val / aspectRatio));
    }
  };

  const onHeightChange = (val: number) => {
    setHeight(val);
    if (value.lockAspectRatio && val && aspectRatio) {
      setWidth(Math.round(val * aspectRatio));
    }
  };

  const onResizeClick = async () => {
    if (!file) return;
    await resizeImage({ file, width, height, originalSize, value });
  };

  return (
    <>
      <div className="flex w-full flex-col gap-4 space-y-8">
        <FileUpload
          enableImageClipboard
          showClipboardGuidance={!file}
          accept={{ 'image/*': [] }}
          maxSize={15 * 1024 * 1024}
          maxFiles={1}
          showFilesList={false}
          inputTestId="image-resizer-file-input"
          onDropAccepted={(files) => onFileChange(files[0])}
          dropZoneClassName={cn(!file && 'editor-height')}
        />

        {file && (
          <ImageResizerSettings
            value={value}
            setValue={setValue}
            width={width}
            height={height}
            onWidthChange={onWidthChange}
            onHeightChange={onHeightChange}
            onResizeClick={onResizeClick}
          />
        )}
      </div>

      <FaqSection items={FAQS} />
    </>
  );
}
