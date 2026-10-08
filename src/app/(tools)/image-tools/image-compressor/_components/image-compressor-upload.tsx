import { ImageFileList } from '@/components/image-file-list';
import { FileUpload } from '@/components/ui/file-upload';
import { cn } from '@/lib/utils';
import { MAX_FILES } from '../_lib/utils';

type ImageCompressorUploadProps = {
  files: File[];
  activeFile: string;
  onFilesAccepted: (files: File[]) => void;
};

export function ImageCompressorUpload({
  files,
  activeFile,
  onFilesAccepted,
}: ImageCompressorUploadProps) {
  return (
    <div className={cn('flex flex-col gap-2', !files.length && 'h-full')}>
      <FileUpload
        enableImageClipboard
        showClipboardGuidance={!files.length}
        dropZoneDescription={`Upload up to ${MAX_FILES} images`}
        testId="image-compressor-dropzone"
        inputTestId="image-compressor-file-input"
        accept={{ 'image/*': [] }}
        maxSize={15 * 1024 * 1024}
        maxFiles={MAX_FILES * 2}
        showFilesList={false}
        disabled={!!activeFile}
        onDropAccepted={onFilesAccepted}
        dropZoneClassName={cn(!files.length && 'editor-height')}
      />
      <ImageFileList files={files} />
    </div>
  );
}
