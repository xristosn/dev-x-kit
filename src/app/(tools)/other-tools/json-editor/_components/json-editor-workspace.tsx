'use client';

import { createJSONEditor, type JsonEditor } from 'vanilla-jsoneditor';
import { useEffect, useRef, useState } from 'react';
import { useWebStorage } from '@/hooks/use-web-storage';
import { JsonEditorEntry } from './json-editor-entry';
import { JsonEditorView } from './json-editor-view';

const MAX_PERSISTED_SIZE = 1024 * 1024;

export function JsonEditorWorkspace() {
  const [inputValue, setInputValue] = useState('');
  const [value, setValue, resetValue] = useWebStorage('json-editor', 'infer', '');
  const editorContainerRef = useRef<HTMLDivElement>(null);
  const editorRef = useRef<JsonEditor>(null);
  const [editorLoaded, setEditorLoaded] = useState(false);

  const openEditor = async (rawValue: string, trySaveValue = true) => {
    if (!editorContainerRef.current) return;

    if (editorRef.current) {
      await editorRef.current.destroy();
      editorRef.current = null;
    }

    const finalValue = rawValue.trim();

    setInputValue('');

    if (trySaveValue && finalValue.length <= MAX_PERSISTED_SIZE) {
      setValue(finalValue);
    }

    editorRef.current = createJSONEditor({
      target: editorContainerRef.current,
      props: {
        content: { text: finalValue },
        mode: 'text',
        onChange: (
          newValue: { text: string; json: Map<unknown, unknown> },
          _: unknown,
          { contentErrors }: { contentErrors: unknown | undefined }
        ) => {
          if (!newValue.text && !newValue.json) return;
          if (contentErrors) return;

          const updatedValue = newValue.text || JSON.stringify(newValue);

          if (updatedValue.length <= MAX_PERSISTED_SIZE) {
            setValue(updatedValue);
          }
        },
      },
    });

    setEditorLoaded(true);
  };

  const onReset = () => {
    resetValue();

    if (editorRef.current) {
      editorRef.current.destroy();
      editorRef.current = null;
    }

    setEditorLoaded(false);
  };

  useEffect(() => {
    return () => {
      if (editorRef.current) {
        editorRef.current.destroy();
        editorRef.current = null;
      }
    };
  }, []);

  // The restore callback only needs to run when the stored value or editor state changes.
  useEffect(() => {
    if (value && !editorLoaded) {
      openEditor(value);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editorLoaded, value]);

  return (
    <>
      {!editorLoaded && (
        <JsonEditorEntry
          inputValue={inputValue}
          onInputChange={setInputValue}
          onOpenEditor={() => openEditor(inputValue)}
        />
      )}

      <JsonEditorView editorRef={editorContainerRef} hidden={!editorLoaded} onReset={onReset} />
    </>
  );
}
