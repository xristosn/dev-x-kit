import { Copy, XIcon, CopyCheck, FlipHorizontal, FlipVertical } from 'lucide-react';
import { Button } from '../ui/button';
import { CopyButton } from '../copy-button';
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip';

export type CodeSplitViewTitleBarProps = React.PropsWithChildren & {
  title: string;

  code?: string;
  onClear?: () => void;

  direction?: PanelDirection;
  setDirection?: React.Dispatch<React.SetStateAction<PanelDirection>>;
};

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
    <h3 className="text-md" data-testid="code-split-view-title">
      {title}
    </h3>

    <div className="flex min-h-full gap-2 items-center">
      {children}

      {direction && (
        <Tooltip>
          <TooltipTrigger
            render={
              <Button
                size="icon-sm"
                variant="outline"
                data-testid="code-split-view-rotate-button"
                onClick={() =>
                  setDirection?.(direction === 'horizontal' ? 'vertical' : 'horizontal')
                }
              >
                {direction === 'horizontal' ? <FlipHorizontal /> : <FlipVertical />}
              </Button>
            }
          />
          <TooltipContent>
            <p>Rotate the panel</p>
          </TooltipContent>
        </Tooltip>
      )}

      <Tooltip>
        <TooltipTrigger
          render={
            <CopyButton
              size="icon-sm"
              variant="outline"
              data-testid="code-split-view-copy-button"
              aria-label="Copy code"
              copiedProps={{
                variant: 'default',
                children: <CopyCheck />,
                'aria-label': 'Code copied',
              }}
              value={code || ''}
              disabled={!code}
            >
              <Copy />
            </CopyButton>
          }
        />
        <TooltipContent>
          <p>Copy the code</p>
        </TooltipContent>
      </Tooltip>

      {typeof onClear === 'function' && (
        <Tooltip>
          <TooltipTrigger
            render={
              <Button
                size="icon-sm"
                variant="outline"
                className="text-red-500 not-disabled:cursor-pointer"
                data-testid="code-split-view-clear-button"
                disabled={!code}
                onClick={onClear}
              >
                <XIcon />
              </Button>
            }
          />
          <TooltipContent>
            <p>Clear the code</p>
          </TooltipContent>
        </Tooltip>
      )}
    </div>
  </div>
);
