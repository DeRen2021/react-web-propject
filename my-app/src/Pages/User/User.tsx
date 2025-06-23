import React ,{useState, useMemo}from 'react';
import { useData } from '../../Context/DataContext';
import { useNavigate } from 'react-router-dom';
import {type UserType} from '../../Type/Types'
import './User.css';

const User: React.FC = () =>{
    const {users} = useData();
    const navigate = useNavigate();
    const [searchTerm,setSearchTerm] = useState('')
    const [sortById,setSortById] = useState<boolean>(false);
    const [viewMode,setViewMode] = useState<'grid'|'list'>('list');

    const processedUsers = useMemo(()=>{
        let filtered = users.filter(user=>
            user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.username.toLocaleLowerCase().includes(searchTerm.toLocaleLowerCase())
        );
        
        if (sortById) {
            filtered = filtered.sort((a, b) => a.username.localeCompare(b.username));
        }
        
        return filtered;
    }, [users, searchTerm, sortById]);

    return (
        <div>
            <h2 className="page-title">Users</h2>
            
            <div className="user-controls">
                <input 
                    type="text" 
                    className="search-input"
                    placeholder="Search users..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button 
                    className={`control-button ${sortById ? 'active' : ''}`}
                    onClick={() => setSortById(!sortById)}
                >
                    {sortById ? 'Unsort' : 'Sort by Username'}
                </button>
                <button 
                    className="control-button"
                    onClick={()=>setViewMode(vm => (vm === 'grid' ? 'list' : 'grid'))}
                >
                    {viewMode === 'grid' ? 'List View' : 'Grid View'}
                </button>
            </div>
            
            <div className={`user-container ${viewMode}`}>
                {processedUsers.map((user: UserType) => (
                <div
                    key={user.id}
                    className="user-card"
                    onClick={() => navigate(`/users/${user.id}`)}
                >
                    <h3>{user.name}</h3>
                    <p>@{user.username}</p>
                </div>
                ))}
            </div>
        </div>
    );
}

export default User;