import { cn } from '@/lib/utils';

export interface ContainerProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  children: React.ReactNode;
}

export const Container: React.FC<ContainerProps> = ({ children, ...rest }) => (
  <div
    {...rest}
    className={cn(
      'flex flex-col container mx-auto p-4 xl:max-w-7xl gap-4 justify-center flex-1 min-h-0 opacity-0 animate-[opacity_500ms_ease_forwards]',
      rest?.className
    )}
  >
    {children}
  </div>
);
