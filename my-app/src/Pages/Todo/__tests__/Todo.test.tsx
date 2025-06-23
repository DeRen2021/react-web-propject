import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Todo from '../Todo';
import { type TodoType } from '../../../Type/Types';

const mockTodos: TodoType[] = [
  { id: 1, userId: 1, title: 'mockTitle1', completed: false },
  { id: 2, userId: 2, title: 'mockTitle2', completed: true },
  { id: 3, userId: 1, title: 'mockTitle3', completed: false },
  { id: 4, userId: 3, title: 'mockTitle4', completed: true }
];

const totalTodoCount = mockTodos.length;
const completedTodoCount = mockTodos.filter(todo => todo.completed).length;
const uncompletedTodoCount = totalTodoCount - completedTodoCount;

jest.mock('axios', () => ({
  get: jest.fn(() => Promise.resolve({ data: [] }))
}));


const renderWithProvider = (todos: TodoType[] = mockTodos) => {
  const mockContextValue = {
    posts: [],
    postCount: 0,
    users: [],
    userCount: 0,
    todos,
    todoCount: todos.length,
    comments: [],
    commentCount: 0
  };

  const useDataSpy = jest.spyOn(require('../../../Context/DataContext'), 'useData');
  useDataSpy.mockReturnValue(mockContextValue);

  return render(<Todo />);
};

describe('Todo component Test', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('render Todo list', () => {
    renderWithProvider();
    
    expect(screen.getByText(`Todos (${totalTodoCount})`)).toBeInTheDocument();
    

    for (const todo of mockTodos){
      expect(screen.getByText(todo.title)).toBeInTheDocument();
    }
  });

  test('correct filter and completed/uncompleted count', () => {
    renderWithProvider();
    
    expect(screen.getByText(`All (${totalTodoCount})`)).toBeInTheDocument();
    expect(screen.getByText(`Completed (${completedTodoCount})`)).toBeInTheDocument();
    expect(screen.getByText(`Uncompleted (${uncompletedTodoCount})`)).toBeInTheDocument();
  });

  test('filter completed todos', async () => {
    renderWithProvider();
    
    const completedButton = screen.getByText(`Completed (${completedTodoCount})`);
    fireEvent.click(completedButton);
    
    await waitFor(() => {

      for (const todo of mockTodos){
        if (todo.completed){
          expect(screen.getByText(todo.title)).toBeInTheDocument();
        }else{
          expect(screen.queryByText(todo.title)).not.toBeInTheDocument();
        }
      }

      
      
    });
  });

  test('filter uncompleted todos', async () => {
    renderWithProvider();
    
    const uncompletedButton = screen.getByText(`Uncompleted (${uncompletedTodoCount})`);
    fireEvent.click(uncompletedButton);
    
    await waitFor(() => {
      for (const todo of mockTodos){
        if (!todo.completed){
          expect(screen.getByText(todo.title)).toBeInTheDocument();
        }else{
          expect(screen.queryByText(todo.title)).not.toBeInTheDocument();
        }
      }
    });
  });

  test('sort by title', async () => {
    renderWithProvider();
    
    const sortButtonText = 'Sort by Title';
    const unsortButtonText = 'Unsort';
    const sortButton = screen.getByText(sortButtonText);
    fireEvent.click(sortButton);
    
    await waitFor(() => {
      expect(screen.getByText(unsortButtonText)).toBeInTheDocument();
    });

    fireEvent.click(sortButton);

    await waitFor(() => {
      expect(screen.getByText(sortButtonText)).toBeInTheDocument();
    });
  });


  test('No todos found with current filter', () => {
    renderWithProvider([]);
    
    expect(screen.getByText('No todos found with current filter.')).toBeInTheDocument();
    expect(screen.getByText('Todos (0)')).toBeInTheDocument();
  });

  test('correct todo info', () => {
    renderWithProvider();
    
    mockTodos.forEach(todo => {
      const titleElement = screen.getByText(todo.title);
      const todoContainer = titleElement.closest('div[style*="display: flex"]');
      
      expect(todoContainer).toHaveTextContent(`ID: ${todo.id} | User ID: ${todo.userId}`);
      expect(todoContainer).toHaveTextContent(todo.title);
      expect(todoContainer).toHaveTextContent(todo.completed ? 'Completed' : 'Pending');
    });
  });



  test('finish todo should have line-through style', () => {
    renderWithProvider();
    
    for (const todo of mockTodos){
      if (todo.completed) {
        const completedTodoElement = screen.getByText(todo.title);
        expect(completedTodoElement).toHaveStyle('text-decoration: line-through');
      }
    }
  });
}); 