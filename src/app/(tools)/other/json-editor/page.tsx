'use client';

import { createJSONEditor, type JsonEditor } from 'vanilla-jsoneditor';
import { Container } from '@/components/container';
import { useEffect, useRef, useState } from 'react';
import { useWebStorage } from '@/hooks/use-web-storage';
import { Textarea } from '@/components/ui/textarea';
import { InputWrapper } from '@/components/input-wrapper';
import FileUpload from '@/components/ui/file-upload';
import { Button } from '@/components/ui/button';

export default function JsonEditorPage() {
  const [inputValue, setInputValue] = useState('');
  const [value, setValue, resetValue] = useWebStorage('json-editor', 'infer', '');
  const ref = useRef<HTMLDivElement>(null);
  const editor = useRef<JsonEditor>(null);
  const [editorLoaded, setEditorLoaded] = useState(false);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const openEditor = async (rawValue: string, trySaveValue = true) => {
    if (!ref.current) return;

    if (editor.current) {
      await editor.current.destroy();
      editor.current = null;
    }

    const finalValue = rawValue.trim();

    setInputValue('');

    if (trySaveValue && finalValue.length <= 1024 * 1024) {
      setValue(finalValue);
    }

    editor.current = createJSONEditor({
      target: ref.current,
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

          const finalValue = newValue.text || JSON.stringify(newValue);

          if (finalValue.length <= 1024 * 1024) {
            setValue(finalValue);
          }
        },
      },
    });

    setEditorLoaded(true);
  };

  const onReset = () => {
    resetValue();

    if (editor.current) {
      editor.current.destroy();
      editor.current = null;
    }

    setEditorLoaded(false);
  };

  useEffect(() => {
    return () => {
      if (editor.current) {
        editor.current.destroy();
        editor.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (value && !editorLoaded) {
      openEditor(value);
    }
  }, [editorLoaded, openEditor, value]);

  return (
    <>
      {!editorLoaded && (
        <Container className="gap-8 h-[calc(100vh-var(--header-height))]">
          <InputWrapper
            label="Paste your JSON here"
            id="json-editor-input"
            className="min-h-0 h-1/2"
          >
            <Textarea
              id="json-editor-input"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="h-full resize-none"
            />
          </InputWrapper>

          <div className="flex gap-4 items-center">
            <div className="h-px bg-border w-full" />

            <Button
              size="lg"
              className="min-w-60"
              disabled={!inputValue?.trim()}
              onClick={() => openEditor(inputValue)}
            >
              Open Editor
            </Button>

            <div className="h-px bg-border w-full" />
          </div>

          <FileUpload
            containerClassName="min-h-0 h-1/2"
            dropZoneClassName="h-full"
            accept={{ 'application/json': [] }}
            maxSize={20 * 1024 * 1024}
            maxFiles={1}
            showFilesList={false}
            onDropAccepted={(f) => f[0].text().then(setInputValue)}
          />
        </Container>
      )}

      <div className="h-full relative" hidden={!editorLoaded}>
        <Button
          size="sm"
          className="absolute top-1.5 right-2 z-10 text-xs h-5 w-10 rounded-xs"
          onClick={onReset}
        >
          Reset
        </Button>

        <div className="h-full" ref={ref} />
      </div>
    </>
  );
}
