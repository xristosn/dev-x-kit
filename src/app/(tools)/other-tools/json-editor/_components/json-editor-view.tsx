'use client';

import type { RefObject } from 'react';
import { Button } from '@/components/ui/button';

type JsonEditorViewProps = {
  editorRef: RefObject<HTMLDivElement | null>;
  hidden: boolean;
  onReset: () => void;
};

export function JsonEditorView({ editorRef, hidden, onReset }: JsonEditorViewProps) {
  return (
    <div className="h-full relative" hidden={hidden} data-testid="json-editor-view">
      <Button
        className="absolute top-1.5 right-2 z-10 text-xs h-6 w-14 rounded-xs"
        onClick={onReset}
        data-testid="json-editor-reset"
      >
        Reset
      </Button>

      <div className="h-full" ref={editorRef} data-testid="json-editor-host" />
    </div>
  );
}
