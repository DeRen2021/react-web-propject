import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import axios from 'axios';
import { DataProvider, useData } from '../DataContext';
import { type PostType, type UserType, type TodoType, type CommentType } from '../../Type/Types';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;


const mockPosts: PostType[] = [
  { id: 1, userId: 1, title: 'testPostTitle', body: 'testPostBody' }
];

const mockUsers: UserType[] = [
  {
    id: 1,
    name: 'Test User',
    username: 'testuser',
    email: 'test@example.com',
    address: {
      street: 'Test Street',
      suite: 'Apt 1',
      city: 'Test City',
      zipcode: '12345',
      geo: { lat: '0', lng: '0' }
    },
    phone: '123-456-7890',
    website: 'test.com',
    company: {
      name: 'Test Company',
      catchPhrase: 'Test Phrase',
      bs: 'test bs'
    }
  }
];

const mockTodos: TodoType[] = [
  { id: 1, userId: 1, title: 'testTodoTitle', completed: false }
];

const mockComments: CommentType[] = [
  { id: 1, postId: 1, name: 'Test Comment', email: 'test@example.com', body: 'testCommentBody' }
];

const TestComponent: React.FC = () => {
  const { posts, users, todos, comments, postCount, userCount, todoCount, commentCount } = useData();
  
  return (
    <div>
      <div data-testid="post-count">{postCount}</div>
      <div data-testid="user-count">{userCount}</div>
      <div data-testid="todo-count">{todoCount}</div>
      <div data-testid="comment-count">{commentCount}</div>
      <div data-testid="posts-length">{posts.length}</div>
      <div data-testid="users-length">{users.length}</div>
      <div data-testid="todos-length">{todos.length}</div>
      <div data-testid="comments-length">{comments.length}</div>
      {posts.length > 0 && <div data-testid="first-post-title">{posts[0].title}</div>}
      {users.length > 0 && <div data-testid="first-user-name">{users[0].name}</div>}
      {todos.length > 0 && <div data-testid="first-todo-title">{todos[0].title}</div>}
      {comments.length > 0 && <div data-testid="first-comment-name">{comments[0].name}</div>}
    </div>
  );
};

describe('DataContext 异步获取逻辑测试', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('应该成功获取所有数据并更新状态', async () => {
    // 模拟成功的 API 响应
    mockedAxios.get.mockImplementation((url: string) => {
      if (url.includes('/posts')) {
        return Promise.resolve({ data: mockPosts });
      }
      if (url.includes('/users')) {
        return Promise.resolve({ data: mockUsers });
      }
      if (url.includes('/todos')) {
        return Promise.resolve({ data: mockTodos });
      }
      if (url.includes('/comments')) {
        return Promise.resolve({ data: mockComments });
      }
      return Promise.reject(new Error('Unknown URL'));
    });

    render(
      <DataProvider>
        <TestComponent />
      </DataProvider>
    );

    // 验证 API 调用
    await waitFor(() => {
      expect(mockedAxios.get).toHaveBeenCalledTimes(4);
    });

    expect(mockedAxios.get).toHaveBeenCalledWith('https://jsonplaceholder.typicode.com/posts');
    expect(mockedAxios.get).toHaveBeenCalledWith('https://jsonplaceholder.typicode.com/users');
    expect(mockedAxios.get).toHaveBeenCalledWith('https://jsonplaceholder.typicode.com/todos');
    expect(mockedAxios.get).toHaveBeenCalledWith('https://jsonplaceholder.typicode.com/comments');

    // 验证数据状态更新
    await waitFor(() => {
      expect(screen.getByTestId('post-count')).toHaveTextContent('1');
      expect(screen.getByTestId('user-count')).toHaveTextContent('1');
      expect(screen.getByTestId('todo-count')).toHaveTextContent('1');
      expect(screen.getByTestId('comment-count')).toHaveTextContent('1');
    });

    // 验证数组长度
    expect(screen.getByTestId('posts-length')).toHaveTextContent('1');
    expect(screen.getByTestId('users-length')).toHaveTextContent('1');
    expect(screen.getByTestId('todos-length')).toHaveTextContent('1');
    expect(screen.getByTestId('comments-length')).toHaveTextContent('1');

    // 验证数据内容
    expect(screen.getByTestId('first-post-title')).toHaveTextContent('测试帖子');
    expect(screen.getByTestId('first-user-name')).toHaveTextContent('Test User');
    expect(screen.getByTestId('first-todo-title')).toHaveTextContent('测试任务');
    expect(screen.getByTestId('first-comment-name')).toHaveTextContent('Test Comment');
  });

  test('应该处理 API 调用失败的情况', async () => {
    // 模拟 API 调用失败
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    mockedAxios.get.mockRejectedValue(new Error('网络错误'));

    render(
      <DataProvider>
        <TestComponent />
      </DataProvider>
    );

    // 验证错误处理
    await waitFor(() => {
      expect(consoleErrorSpy).toHaveBeenCalledWith('Error fetching data:', expect.any(Error));
    });

    // 验证状态保持初始值
    expect(screen.getByTestId('post-count')).toHaveTextContent('0');
    expect(screen.getByTestId('user-count')).toHaveTextContent('0');
    expect(screen.getByTestId('todo-count')).toHaveTextContent('0');
    expect(screen.getByTestId('comment-count')).toHaveTextContent('0');

    consoleErrorSpy.mockRestore();
  });

  test('useData hook 在 DataProvider 外使用时应该抛出错误', () => {
    // 模拟 console.error 以避免测试输出中的错误信息
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    expect(() => {
      render(<TestComponent />);
    }).toThrow('useData must be used within a DataProvider');

    consoleErrorSpy.mockRestore();
  });

  test('应该并行调用所有 API 端点', async () => {
    let callOrder: string[] = [];
    
    mockedAxios.get.mockImplementation((url: string) => {
      if (url.includes('/posts')) {
        callOrder.push('posts');
        return Promise.resolve({ data: mockPosts });
      }
      if (url.includes('/users')) {
        callOrder.push('users');
        return Promise.resolve({ data: mockUsers });
      }
      if (url.includes('/todos')) {
        callOrder.push('todos');
        return Promise.resolve({ data: mockTodos });
      }
      if (url.includes('/comments')) {
        callOrder.push('comments');
        return Promise.resolve({ data: mockComments });
      }
      return Promise.reject(new Error('Unknown URL'));
    });

    render(
      <DataProvider>
        <TestComponent />
      </DataProvider>
    );

    await waitFor(() => {
      expect(mockedAxios.get).toHaveBeenCalledTimes(4);
    });

    // 验证所有调用都发生了（顺序可能不同，因为是并行的）
    expect(callOrder).toHaveLength(4);
    expect(callOrder).toContain('posts');
    expect(callOrder).toContain('users');
    expect(callOrder).toContain('todos');
    expect(callOrder).toContain('comments');
  });

  test('应该正确处理空数组响应', async () => {
    // 模拟返回空数组的 API 响应
    mockedAxios.get.mockResolvedValue({ data: [] });

    render(
      <DataProvider>
        <TestComponent />
      </DataProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('post-count')).toHaveTextContent('0');
      expect(screen.getByTestId('user-count')).toHaveTextContent('0');
      expect(screen.getByTestId('todo-count')).toHaveTextContent('0');
      expect(screen.getByTestId('comment-count')).toHaveTextContent('0');
    });
  });
}); 