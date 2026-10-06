import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { SidebarTodoItem } from './sidebar-todo-item';

describe('<SidebarTodoItem />', () => {
  it('renders the todo label, badge, and supplied icon without a route', () => {
    render(<SidebarTodoItem label="Coming soon" icon={<span data-testid="sidebar-todo-icon" />} />);

    const todo = screen.getByTestId('sidebar-todo-item-coming-soon');
    expect(todo).toHaveTextContent('Coming soon');
    expect(todo).toHaveTextContent('Todo');
    expect(todo).not.toHaveAttribute('href');
    expect(screen.getByTestId('sidebar-todo-icon')).toBeInTheDocument();
  });
});
