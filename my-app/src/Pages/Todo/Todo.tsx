import React, { useState, useMemo } from 'react';
import { useData } from '../../Context/DataContext';

const Todo: React.FC = () => {
    const { todos } = useData();
    const [filter, setFilter] = useState<'all' | 'completed' | 'uncompleted'>('all');
    const [sortByTitle, setSortByTitle] = useState<boolean>(false);

    const processedTodos = useMemo(() => {
        let filtered = todos;

        if (filter === 'completed') {
            filtered = todos.filter(todo => todo.completed);
        } else if (filter === 'uncompleted') {
            filtered = todos.filter(todo => !todo.completed);
        }

        if (sortByTitle) {
            filtered = [...filtered].sort((a, b) => a.title.localeCompare(b.title));
        }

        return filtered;
    }, [todos, filter, sortByTitle]);

    return (
        <div style={{ padding: '20px' }}>
            <h2>Todos ({processedTodos.length})</h2>
            
            <div style={{ marginBottom: '20px' }}>
                <button 
                    onClick={() => setFilter('all')}
                    style={{ 
                        marginRight: '10px', 
                        backgroundColor: filter === 'all' ? '#007bff' : '#f8f9fa',
                        color: filter === 'all' ? 'white' : 'black',
                        border: '1px solid #ccc',
                        padding: '8px 16px',
                        borderRadius: '4px',
                        cursor: 'pointer'
                    }}
                >
                    All ({todos.length})
                </button>
                <button 
                    onClick={() => setFilter('completed')}
                    style={{ 
                        marginRight: '10px', 
                        backgroundColor: filter === 'completed' ? '#28a745' : '#f8f9fa',
                        color: filter === 'completed' ? 'white' : 'black',
                        border: '1px solid #ccc',
                        padding: '8px 16px',
                        borderRadius: '4px',
                        cursor: 'pointer'
                    }}
                >
                    Completed ({todos.filter(todo => todo.completed).length})
                </button>
                <button 
                    onClick={() => setFilter('uncompleted')}
                    style={{ 
                        backgroundColor: filter === 'uncompleted' ? '#dc3545' : '#f8f9fa',
                        color: filter === 'uncompleted' ? 'white' : 'black',
                        border: '1px solid #ccc',
                        padding: '8px 16px',
                        borderRadius: '4px',
                        cursor: 'pointer'
                    }}
                >
                    Uncompleted ({todos.filter(todo => !todo.completed).length})
                </button>
            </div>

            <div style={{ marginBottom: '20px' }}>
                <button 
                    onClick={() => setSortByTitle(!sortByTitle)}
                    style={{ 
                        backgroundColor: sortByTitle ? '#17a2b8' : '#f8f9fa',
                        color: sortByTitle ? 'white' : 'black',
                        border: '1px solid #ccc',
                        padding: '8px 16px',
                        borderRadius: '4px',
                        cursor: 'pointer'
                    }}
                >
                    {sortByTitle ? 'Unsort' : 'Sort by Title'}
                </button>
            </div>

            <div>
                {processedTodos.map(todo => (
                    <div 
                        key={todo.id} 
                        style={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            padding: '12px', 
                            margin: '8px 0', 
                            border: '1px solid #ddd', 
                            borderRadius: '4px',
                            backgroundColor: todo.completed ? '#f8f9fa' : 'white'
                        }}
                    >
                        <input 
                            type="checkbox" 
                            checked={todo.completed} 
                            readOnly
                            style={{ marginRight: '12px', transform: 'scale(1.2)' }}
                        />
                        <div style={{ flex: 1 }}>
                            <span 
                                style={{ 
                                    textDecoration: todo.completed ? 'line-through' : 'none',
                                    color: todo.completed ? '#6c757d' : 'black',
                                    fontSize: '16px'
                                }}
                            >
                                {todo.title}
                            </span>
                            <div style={{ fontSize: '12px', color: '#6c757d', marginTop: '4px' }}>
                                ID: {todo.id} | User ID: {todo.userId}
                            </div>
                        </div>
                        <span 
                            style={{ 
                                padding: '4px 8px', 
                                borderRadius: '12px', 
                                fontSize: '12px',
                                backgroundColor: todo.completed ? '#28a745' : '#dc3545',
                                color: 'white'
                            }}
                        >
                            {todo.completed ? 'Completed' : 'Pending'}
                        </span>
                    </div>
                ))}
            </div>

            {processedTodos.length === 0 && (
                <p style={{ textAlign: 'center', color: '#6c757d', marginTop: '40px' }}>
                    No todos found with current filter.
                </p>
            )}
        </div>
    );
};

export default Todo; 