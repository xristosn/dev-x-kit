import { Copy, XIcon, CopyCheck, FlipHorizontal, FlipVertical } from 'lucide-react';
import { Button } from '../ui/button';
import { CopyButton } from '../copy-button';
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip';

export interface CodeSplitViewTitleBarProps extends React.PropsWithChildren {
  title: string;

  code?: string;
  onClear?: () => void;

  direction?: PanelDirection;
  setDirection?: React.Dispatch<React.SetStateAction<PanelDirection>>;
}

export type PanelDirection = 'horizontal' | 'vertical';

export const CodeSplitViewTitleBar: React.FC<CodeSplitViewTitleBarProps> = ({
  title,
  code,
  onClear,
  children,
  direction,
  setDirection,
}) => (
  <div className="flex gap-2 items-center justify-between border-b px-2 h-12 bg-sidebar">
    <h3 className="text-md">{title}</h3>

    <div className="flex min-h-full gap-2 items-center">
      {children}

      {direction && (
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              size="icon-sm"
              variant="outline"
              onClick={() => setDirection?.(direction === 'horizontal' ? 'vertical' : 'horizontal')}
            >
              {direction === 'horizontal' ? <FlipHorizontal /> : <FlipVertical />}
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Rotate the panel</p>
          </TooltipContent>
        </Tooltip>
      )}

      <Tooltip>
        <TooltipTrigger asChild>
          <CopyButton
            size="icon-sm"
            variant="outline"
            copiedProps={{ variant: 'default', children: <CopyCheck /> }}
            value={code || ''}
            disabled={!code}
          >
            <Copy />
          </CopyButton>
        </TooltipTrigger>
        <TooltipContent>
          <p>Copy the code</p>
        </TooltipContent>
      </Tooltip>

      {typeof onClear === 'function' && (
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              size="icon-sm"
              variant="outline"
              className="text-red-500 not-disabled:cursor-pointer"
              disabled={!code}
              onClick={onClear}
            >
              <XIcon />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Clear the code</p>
          </TooltipContent>
        </Tooltip>
      )}
    </div>
  </div>
);
