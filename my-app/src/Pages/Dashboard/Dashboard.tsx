import React from 'react';
import { useData } from '../../Context/DataContext';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';
import {
    PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend
} from 'recharts';

const Dashboard: React.FC = () => {
    const data = useData();
    const { postCount, userCount, todoCount, commentCount, todos } = data;
    const navigate = useNavigate();

    const completedTodos = todos.filter(todo => todo.completed).length;
    const incompleteTodos = todoCount - completedTodos;
    
    const todoData = [
        { name: 'Completed', value: completedTodos, color: '#4caf50' },
        { name: 'Incomplete', value: incompleteTodos, color: '#f44336' }
    ];
    
    const statsData = [
        { 
            label: 'Posts', 
            value: postCount, 
            path: '/posts'
        },
        { 
            label: 'Users', 
            value: userCount, 
            path: '/users'
        },
        { 
            label: 'Todos', 
            value: todoCount, 
            path: '/todos'
        },
        { 
            label: 'Comments', 
            value: commentCount, 
            path: null
        }
    ];

    const handleCardClick = (path: string | null) => {
        if (path) {
            navigate(path);
        }
    };

    return (
        <div className="dashboard">
            <h1>Dashboard</h1>
            
            <div className="stats-section">
                {statsData.map((stat, index) => (
                    <div 
                        key={index} 
                        className={`stat-card ${stat.path ? 'clickable' : ''}`}
                        onClick={() => handleCardClick(stat.path)}
                    >
                        <div className="stat-info">
                            <div className="stat-value">
                                {stat.value}
                            </div>
                            <div className="stat-label">{stat.label}</div>
                        </div>
                    </div>
                ))}
            </div>
            
            <div className="chart-section">
                <h2>Todo Status</h2>
                <div className="todo-chart">
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                data={todoData}
                                cx="50%"
                                cy="50%"
                                outerRadius={80}
                                dataKey="value"
                                label={({name, value}) => `${name}: ${value}`}
                            >
                                {todoData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Pie>
                            <Tooltip />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;