'use client';

import ReactCrop, { Crop, PixelCrop } from 'react-image-crop';

type ImageCropperEditorProps = {
  imgSrc: string;
  crop: Crop | undefined;
  aspectRatio: number;
  lockAspectRatio: boolean;
  imgRef: React.RefObject<HTMLImageElement | null>;
  onCropChange: (crop: Crop) => void;
  onCropComplete: (crop: PixelCrop) => void;
  onImageLoad: (event: React.SyntheticEvent<HTMLImageElement>) => void;
};

export function ImageCropperEditor({
  imgSrc,
  crop,
  aspectRatio,
  lockAspectRatio,
  imgRef,
  onCropChange,
  onCropComplete,
  onImageLoad,
}: ImageCropperEditorProps) {
  return (
    <div className="h-full alpha-grid flex items-center justify-center">
      <div className="flex justify-center">
        <ReactCrop
          crop={crop}
          aspect={lockAspectRatio ? aspectRatio : undefined}
          onChange={(_, percentCrop) => onCropChange(percentCrop)}
          onComplete={(completedCrop) => onCropComplete(completedCrop)}
          className="max-h-[70vh]"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            ref={imgRef}
            alt="Crop me"
            data-testid="image-cropper-image"
            src={imgSrc}
            onLoad={onImageLoad}
            className="max-h-[70vh] w-auto object-contain"
          />
        </ReactCrop>
      </div>
    </div>
  );
}
