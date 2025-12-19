'use client';

import { useEffect, useState } from 'react';
import { Button } from './ui/button';
import { cn } from '@/lib/utils';
import { Copy, CopyCheck } from 'lucide-react';

export interface CopyButtonProps extends React.ComponentProps<typeof Button> {
  value: string;
  copiedProps?: React.ComponentProps<typeof Button>;
}

export const CopyButton: React.FC<CopyButtonProps> = ({
  onClick,
  value,
  children,
  className,
  copiedProps = {},
  ...buttonProps
}) => {
  const [copied, setCopied] = useState(false);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    setCopied(true);
    onClick?.(e);
  };

  useEffect(() => {
    if (!copied) return;

    window.navigator.clipboard.writeText(value);

    const timeout = setTimeout(() => {
      setCopied(false);
    }, 700);

    return () => clearTimeout(timeout);
  }, [copied, value]);

  return (
    <Button
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
