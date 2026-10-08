import { cn } from '@/lib/utils';
import { Image as ImageIcon } from 'lucide-react';
import prettyBytes from 'pretty-bytes';
import React from 'react';

type ImageFileListProps = {
  files: File[];
};

const getFileType = (file: File) => {
  if (file.type) return file.type;

  const extension = file.name.split('.').pop();
  return extension && extension !== file.name ? `.${extension}` : 'Unknown type';
};

export const ImageFileList: React.FC<ImageFileListProps> = ({ files }) => {
  if (!files.length) return null;

  return (
    <ul
      data-testid="image-file-list"
      className={cn('flex w-full flex-col gap-2', files.length > 3 && 'max-h-48 overflow-y-auto')}
    >
      {files.map((file, index) => (
        <li
          key={`${file.name}-${file.lastModified}-${index}`}
          data-testid={`image-file-list-item-${index}`}
          className="flex min-h-16 items-center gap-3 rounded-xl border border-border bg-card px-4 py-3"
        >
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10">
            <ImageIcon aria-hidden="true" className="h-5 w-5 text-primary" />
          </span>
          <span className="flex min-w-0 flex-col">
            <span
              data-testid={`image-file-name-${index}`}
              title={file.name}
              className="truncate text-sm font-medium leading-snug"
            >
              {file.name}
            </span>
            <span className="text-xs text-muted-foreground leading-tight">
              <span data-testid={`image-file-type-${index}`}>{getFileType(file)}</span>
              {' · '}
              <span data-testid={`image-file-size-${index}`}>{prettyBytes(file.size)}</span>
            </span>
          </span>
        </li>
      ))}
    </ul>
  );
};
