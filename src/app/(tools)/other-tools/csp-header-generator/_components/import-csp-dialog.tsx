'use client';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Upload } from 'lucide-react';
import { useCallback, useState } from 'react';
import type { DirectiveConfig, ParseResult } from '../_lib/types';
import { parseCspHeader } from '../_lib/utils';
import { ImportCspResult } from './import-csp-result';

type ImportCspDialogProps = {
  onImport: (directives: DirectiveConfig[]) => void;
};

export function ImportCspDialog({ onImport }: ImportCspDialogProps) {
  const [open, setOpen] = useState(false);
  const [headerText, setHeaderText] = useState('');
  const [result, setResult] = useState<ParseResult | null>(null);

  const handleParse = useCallback((text: string) => {
    if (!text.trim()) {
      setResult(null);
      return;
    }
    setResult(parseCspHeader(text));
  }, []);

  const handleTextChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const text = e.target.value;
      setHeaderText(text);
      handleParse(text);
    },
    [handleParse]
  );

  const handleApply = useCallback(() => {
    if (result?.success && result.directives) {
      onImport(result.directives);
      setHeaderText('');
      setResult(null);
      setOpen(false);
    }
  }, [result, onImport]);

  const handleClose = useCallback(() => {
    setHeaderText('');
    setResult(null);
  }, []);

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        type="button"
        onClick={() => setOpen(true)}
        data-testid="import-header-btn"
      >
        <Upload className="w-3.5 h-3.5 mr-1.5" />
        Import Header
      </Button>
      <Dialog
        open={open}
        onOpenChange={(isOpen) => {
          setOpen(isOpen);
          if (!isOpen) handleClose();
        }}
      >
        <DialogContent className="sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>Import CSP Header</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Textarea
              data-testid="import-textarea"
              placeholder="Paste your Content-Security-Policy header here, e.g.:&#10;default-src 'self'; script-src 'self' https://cdn.example.com; img-src 'self' data:"
              value={headerText}
              onChange={handleTextChange}
              className="min-h-30 font-mono text-sm"
              autoFocus
            />

            <ImportCspResult result={result} />

            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  handleClose();
                  setOpen(false);
                }}
                data-testid="import-cancel"
              >
                Cancel
              </Button>
              <Button
                onClick={handleApply}
                disabled={!result?.success || !result.directives}
                data-testid="import-apply"
              >
                Apply & Replace
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
