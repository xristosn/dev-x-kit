'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import FileUpload from '@/components/ui/file-upload';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { FileUp } from 'lucide-react';
import { useState } from 'react';
import type { Accept } from 'react-dropzone';
import { toast } from 'sonner';

const MAX_FILE_SIZE = 10 * 1024 * 1024;
const ALLOWED_EXTENSIONS = [
  '.c',
  '.cc',
  '.cpp',
  '.cs',
  '.css',
  '.csv',
  '.go',
  '.h',
  '.hpp',
  '.htm',
  '.html',
  '.java',
  '.js',
  '.json',
  '.jsx',
  '.log',
  '.md',
  '.markdown',
  '.mjs',
  '.php',
  '.py',
  '.rb',
  '.rs',
  '.sh',
  '.sql',
  '.ts',
  '.tsx',
  '.toml',
  '.txt',
  '.xml',
  '.yaml',
  '.yml',
] as const;

const ACCEPTED_FILE_TYPES = {
  'application/json': ['.json'],
  'application/javascript': ['.js', '.mjs'],
  'application/typescript': ['.ts', '.tsx'],
  'application/xml': ['.xml'],
  'text/css': ['.css'],
  'text/html': ['.htm', '.html'],
  'text/javascript': ['.js', '.mjs', '.jsx'],
  'text/plain': ALLOWED_EXTENSIONS.filter(
    (extension) =>
      !['.json', '.xml', '.htm', '.html', '.css', '.js', '.mjs', '.jsx', '.ts', '.tsx'].includes(
        extension
      )
  ),
  'text/xml': ['.xml'],
} satisfies Accept;

type CodeSplitViewUploadProps = {
  setInputValue: (value: string) => void;
};

export const CodeSplitViewUpload: React.FC<CodeSplitViewUploadProps> = ({ setInputValue }) => {
  const [open, setOpen] = useState(false);
  const [isReading, setIsReading] = useState(false);

  const importFile = async (files: File[]) => {
    const file = files[0];

    if (files.length !== 1 || !file) {
      toast.error('Choose one text or code file.');
      return;
    }

    const extensionIndex = file.name.lastIndexOf('.');
    const extension = extensionIndex > 0 ? file.name.slice(extensionIndex).toLowerCase() : '';
    if (!ALLOWED_EXTENSIONS.includes(extension as (typeof ALLOWED_EXTENSIONS)[number])) {
      toast.error('Unsupported file type. Choose a text or code file.');
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      toast.error('File is too large. The maximum size is 10 MiB.');
      return;
    }

    setIsReading(true);
    try {
      const contents = await file.text();
      if (contents.includes('\u0000')) {
        toast.error('This file does not appear to be a text file.');
        return;
      }

      setInputValue(contents);
      setOpen(false);
    } catch {
      toast.error('Could not read the selected file.');
    } finally {
      setIsReading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Tooltip>
        <TooltipTrigger
          render={
            <DialogTrigger
              render={
                <Button
                  size="icon-sm"
                  variant="outline"
                  data-testid="code-split-view-upload-trigger"
                >
                  <FileUp aria-hidden="true" />
                </Button>
              }
            />
          }
        />
        <TooltipContent>
          <p>Upload input file</p>
        </TooltipContent>
      </Tooltip>

      <DialogContent className="lg:max-w-2xl px-4" data-testid="code-split-view-upload-dialog">
        <DialogHeader>
          <DialogTitle>Upload input file</DialogTitle>
          <DialogDescription>
            Choose one text or code file up to 10 MiB. It is read in your browser and is not
            uploaded.
          </DialogDescription>
        </DialogHeader>

        <FileUpload
          accept={ACCEPTED_FILE_TYPES}
          maxSize={MAX_FILE_SIZE}
          maxFiles={1}
          multiple={false}
          disabled={isReading}
          showFilesList={false}
          showClipboardGuidance={false}
          testId="code-split-view-upload-dropzone"
          inputTestId="code-split-view-upload-input"
          dropZoneDescription="Supported file extensions only. File contents are treated as text."
          onDropAccepted={importFile}
          onDropRejected={() =>
            toast.error('File not accepted. Choose one supported text or code file.')
          }
        />
      </DialogContent>
    </Dialog>
  );
};
