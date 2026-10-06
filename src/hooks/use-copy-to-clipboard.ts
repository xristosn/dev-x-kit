import { useCallback, useRef, useState } from 'react';
import { toast } from 'sonner';
import { USE_COPY_TO_CLIPBOARD_TIMEOUT_MS } from '@/lib/constants';

type UseCopyToClipboardProps = {
  text: string;
  copyMessage?: string;
};

export function useCopyToClipboard({
  text,
  copyMessage = 'Copied to clipboard!',
}: UseCopyToClipboardProps) {
  const [isCopied, setIsCopied] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleCopy = useCallback(() => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        toast.success(copyMessage);
        setIsCopied(true);
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
          timeoutRef.current = null;
        }
        timeoutRef.current = setTimeout(() => {
          setIsCopied(false);
        }, USE_COPY_TO_CLIPBOARD_TIMEOUT_MS);
      })
      .catch(() => {
        toast.error('Failed to copy to clipboard.');
      });
  }, [text, copyMessage]);

  return { isCopied, handleCopy };
}
