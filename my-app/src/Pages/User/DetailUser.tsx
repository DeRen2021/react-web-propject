import React ,{useState, useMemo}from 'react';
import {useData} from '../../Context/DataContext'
import {type PostType ,type UserType} from '../../Type/Types'
import { useParams } from 'react-router-dom';
import './DetailUser.css';

const DetailUser:React.FC = () => {
    const {userId} =  useParams<{userId:string}>();
    const userIdNumber = Number(userId);
    const{users,posts} = useData();
    const [sortById,setSortById] = useState<boolean>(false);

    const userPosts = posts.filter(post => post.userId === userIdNumber);
    const sortedPosts = useMemo(()=>{
        // 需要浅拷贝么
        let sorted = [...userPosts];
        if(sortById){
            sorted = sorted.sort((a,b)=>b.id-a.id);
        }
        return sorted;
    }, [userPosts, sortById]);

    if (!userId) {
        return <div className="error-message">User ID not found</div>;
    }

    const selectUser:UserType | undefined = users.find(user => user.id === userIdNumber);
    
    if (!selectUser) {
        return <div className="error-message">User not found</div>;
    }

    return (
        <div className="detail-user-container">
            <div className="user-profile">
                <h3>{selectUser.name}</h3>
                <p className="user-info">
                    <span>Username:</span> {selectUser.username}
                </p>
                <p className="user-info">
                    <span>Email:</span> {selectUser.email}
                </p>
            </div>

            <div className="posts-section">
                <div className="posts-header">
                    <h4>Posts by this user</h4>
                    <button 
                        className={`sort-button ${sortById ? 'active' : ''}`}
                        onClick={() => setSortById(!sortById)}
                    >
                        {sortById ? 'Unsort' : 'Sort Posts by ID'}
                    </button>
                </div>
                
                <ul className="posts-list">
                    {sortedPosts.map(post => (
                        <li key={post.id} className="post-item">
                            <div className="post-title">{post.title}</div>
                            <div className="post-id">#{post.id}</div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}

export default DetailUser;
