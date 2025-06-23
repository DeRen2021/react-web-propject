import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import BasicTabs from './Pages/Tab/Tab';
import Dashboard from './Pages/Dashboard/Dashboard';
import Post from './Pages/Post/Post';
import DetailPost from './Pages/Post/DetailPost';
import User from './Pages/User/User'
import UserDetail from './Pages/User/DetailUser'
import Todo from './Pages/Todo/Todo'
import NotFound from './Pages/NotFound/NotFound'

import { ThemeContext } from './Context/ThemeContext';
import './App.css';


const App: React.FC = () => {

    const [theme, setTheme] = useState<'light' | 'dark'>('light');

    const toggleTheme = () => {
      setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
    };

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }} >
            <div className={`app-container ${theme}`}>
                <Router>
                    <BasicTabs />
                    
                    <div className="app-content">
                        <Routes>
                            <Route path="/" element={<Navigate to="/dashboard" replace />} />
                            <Route path="/dashboard" element={<Dashboard />} />

                            <Route path="/posts" element={<Post />} />
                            <Route path="/posts/:postId" element={<DetailPost />} />

                            <Route path="/users" element={<User/>} />
                            <Route path="/users/:userId" element={<UserDetail />} />

                            <Route path="/todos" element={<Todo />} />
                            

                            <Route path="*" element={<NotFound />} />
                        </Routes>
                    </div>
                </Router>
            </div>
        </ThemeContext.Provider>
  );
};

export default App; 