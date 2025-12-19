import { cn } from '@/lib/utils';
import { Label } from './ui/label';
import { CopyButton } from './ui/copy-button';

export interface InputWrapperProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  label?: string;
  helperText?: string;
  copyValue?: string | number;
}

export const InputWrapper: React.FC<InputWrapperProps> = ({
  children,
  id,
  label,
  helperText,
  copyValue,
  ...wrapperProps
}) => (
  <div {...wrapperProps} className={cn('flex flex-col gap-2', wrapperProps?.className)}>
    <div className="flex gap-4 items-center justify-between">
      <Label htmlFor={id}>{label}</Label>

      {copyValue && <CopyButton content={copyValue.toString()} />}
    </div>

    {children}

    {helperText && <p className="text-xs text-muted-foreground">{helperText}</p>}
  </div>
);
