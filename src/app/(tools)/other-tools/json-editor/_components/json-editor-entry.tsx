'use client';

import { InputWrapper } from '@/components/input-wrapper';
import { Button } from '@/components/ui/button';
import FileUpload from '@/components/ui/file-upload';
import { Textarea } from '@/components/ui/textarea';

type JsonEditorEntryProps = {
  inputValue: string;
  onInputChange: (value: string) => void;
  onOpenEditor: () => void;
};

export function JsonEditorEntry({ inputValue, onInputChange, onOpenEditor }: JsonEditorEntryProps) {
  return (
    <>
      <InputWrapper label="Paste your JSON here" id="json-editor-input" className="min-h-0">
        <Textarea
          id="json-editor-input"
          value={inputValue}
          onChange={(e) => onInputChange(e.target.value)}
          className="editor-height-half resize-none"
          data-testid="json-editor-input"
        />
      </InputWrapper>

      <div className="flex gap-4 items-center">
        <div className="h-px bg-border w-full" />

        <Button
          size="lg"
          className="min-w-60"
          disabled={!inputValue.trim()}
          onClick={onOpenEditor}
          data-testid="json-editor-open"
        >
          Open Editor
        </Button>

        <div className="h-px bg-border w-full" />
      </div>

      <FileUpload
        containerClassName="min-h-0 editor-height-half"
        dropZoneClassName="h-full"
        accept={{ 'application/json': [] }}
        maxSize={20 * 1024 * 1024}
        maxFiles={1}
        showFilesList={false}
        onDropAccepted={(files) => files[0].text().then(onInputChange)}
      />
    </>
  );
}
