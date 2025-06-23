import React, { createContext, useState, useEffect, type ReactNode} from 'react';
import type {PostType,UserType,TodoType,CommentType,DataStoreType} from "../Type/Types"
import axios from 'axios'

const DataContext = createContext<DataStoreType | undefined>(undefined);

interface DataProviderProps {
    children: ReactNode;
  }


export const DataProvider: React.FC<DataProviderProps> = ({ children }) => {
    const [posts, setPosts] = useState<PostType[]>([]);
    const [users, setUsers] = useState<UserType[]>([]);
    const [todos, setTodos] = useState<TodoType[]>([]);
    const [comments, setComments] = useState<CommentType[]>([]);

    const [postCount, setPostCount] = useState<number | null>(null);
    const [userCount, setUserCount] = useState<number | null>(null);
    const [todoCount, setTodoCount] = useState<number | null>(null);
    const [commentCount, setCommentCount] = useState<number | null>(null);
    
    


    useEffect(() => {
        const fetchData = async () => {
            try {
                const [postRes, userRes, todoRes, commentRes] = await Promise.all([
                    axios.get<PostType[]>('https://jsonplaceholder.typicode.com/posts'),
                    axios.get<UserType[]>('https://jsonplaceholder.typicode.com/users'),
                    axios.get<TodoType[]>('https://jsonplaceholder.typicode.com/todos'),
                    axios.get<CommentType[]>('https://jsonplaceholder.typicode.com/comments')
                ]);
                
                setPosts(postRes.data);
                setUsers(userRes.data);
                setTodos(todoRes.data);
                setComments(commentRes.data);

                setPostCount(postRes.data.length);
                setUserCount(userRes.data.length);
                setTodoCount(todoRes.data.length);
                setCommentCount(commentRes.data.length);

            } catch (err) {
                console.error('Error fetching data:', err);
            }
        };

        fetchData();
    }, []);

    const contextValue: DataStoreType = {
        posts,
        postCount: postCount || 0,
        users,
        userCount: userCount || 0,
        todos,
        todoCount: todoCount || 0,
        comments,
        commentCount: commentCount || 0
    };

    return (
        <DataContext.Provider value={contextValue}>
            {children}
        </DataContext.Provider>
    );
};

export const useData = () => {
    const context = React.useContext(DataContext);
    if (context === undefined) {
        throw new Error('useData must be used within a DataProvider');
    }
    return context;
};

export default DataContext;