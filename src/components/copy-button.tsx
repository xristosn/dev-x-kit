'use client';

import { COPY_TIMEOUT_MS } from '@/lib/constants';
import { cn } from '@/lib/utils';
import { type BaseUIEvent } from '@base-ui/react';
import { Copy, CopyCheck } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Button } from './ui/button';

export type CopyButtonProps = React.ComponentProps<typeof Button> & {
  value: string;
  copiedProps?: React.ComponentProps<typeof Button>;
};

export const CopyButton: React.FC<CopyButtonProps> = ({
  onClick,
  value,
  children,
  className,
  copiedProps = {},
  ...buttonProps
}) => {
  const [copied, setCopied] = useState(false);

  const handleClick = (e: BaseUIEvent<React.MouseEvent<HTMLButtonElement, MouseEvent>>) => {
    setCopied(true);
    onClick?.(e);
  };

  useEffect(() => {
    if (!copied) return;

    window.navigator.clipboard.writeText(value);

    const timeout = setTimeout(() => {
      setCopied(false);
    }, COPY_TIMEOUT_MS);

    return () => clearTimeout(timeout);
  }, [copied, value]);

  return (
    <Button
      data-testid="copy-button"
      {...buttonProps}
      {...(copied ? copiedProps : {})}
      className={cn(className, copied && copiedProps.className)}
      onClick={handleClick}
    >
      {copied ? copiedProps.children || children : children}
    </Button>
  );
};

export const CopyIconButton: React.FC<CopyButtonProps> = ({ size = 'icon-sm', ...rest }) => (
  <CopyButton
    {...rest}
    size={size}
    copiedProps={{ children: <CopyCheck />, ...(rest.copiedProps || {}) }}
  >
    <Copy />
  </CopyButton>
);
