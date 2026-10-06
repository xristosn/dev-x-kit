import { Button } from '../ui/button';
import { testIdSegment } from './sidebar-group-item.utils';

type SidebarTodoItemProps = {
  label: string;
  icon: React.ReactNode;
};

export const SidebarTodoItem: React.FC<SidebarTodoItemProps> = ({ label, icon }) => (
  <Button
    data-testid={`sidebar-todo-item-${testIdSegment(label)}`}
    variant="link"
    size="sm"
    className="w-full justify-start text-muted-foreground cursor-default select-none hover:no-underline"
  >
    {icon}

    {label}

    <sup className="text-[.65rem] py-2 px-1 rounded-xl bg-accent/50 text-accent-foreground">
      Todo
    </sup>
  </Button>
);
