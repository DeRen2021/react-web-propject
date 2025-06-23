import React ,{useState, useMemo,useEffect}from 'react';
import { useData } from '../../Context/DataContext';
import { useNavigate } from 'react-router-dom';
import './Post.css'

const Post: React.FC = () => {
    const { posts } = useData();
    const navigate = useNavigate();
    const [searchTerm,setSearchTerm] = useState('');
    const [sortById,setSortById] = useState<boolean>(false);


    // Paginated list
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;


    const processedPosts = useMemo(() => {
        let filtered = posts.filter(post =>
            post.title.toLowerCase().includes(searchTerm.toLowerCase())
        );


        if (sortById) {
            filtered = filtered.sort((a, b) => b.id - a.id);
        }

        return filtered;
    }, [posts, searchTerm, sortById]); 


    useEffect(() => {
        setCurrentPage(1);
      }, [searchTerm, sortById]);


    const totalPages = Math.ceil(processedPosts.length/itemsPerPage) || 1;


    const currentPosts = useMemo(() => {
        const start = (currentPage - 1) * itemsPerPage;
        return processedPosts.slice(start, start + itemsPerPage);
      }, [processedPosts, currentPage]);

    return (
        <>
            {/* 搜索框 */}
            <input 
            type="text"
            placeholder='search by title'
            value={searchTerm}
            onChange={e=>setSearchTerm(e.target.value)}
            className="search-input"
            />
            {/* filter By ID */}
            <button
                onClick={() => setSortById(!sortById)}
                className="sort-button"
            >
                {sortById ? 'unsort' : 'sortByID'}
            </button>
            
            <div className='post-container'>
                {/* POST 展示 */}
                {currentPosts.map(post =>(
                    <div 
                        key={post.id} 
                        className="card clickable-card"
                        onClick={() => navigate(`/posts/${post.id}`)}
                    >
                        <h3>{post.title}</h3>
                        <p>author:{post.userId}</p>
                        <p>id:{post.id}</p>
                    </div>
                ))}
            </div>

            {/* 分页 */}
            <div>
                <button 
                    onClick={() => setCurrentPage(p=>Math.max(p-1,1))}
                    disabled={currentPage ===1}
                >
                Prev Page
                </button>

                {
                    [...Array(totalPages)].map((_,idx)=>{
                        const pageNum = idx+1;
                        return <button 
                        key={pageNum}
                        onClick={()=>setCurrentPage(pageNum) }
                        disabled={(currentPage===pageNum)}
                        >
                        {pageNum}
                        </button>;
                    })
                }



                <button 
                    onClick={() => setCurrentPage(p=>Math.min(p+1,totalPages))}
                    disabled={currentPage ===totalPages}
                >
                Next Page
                </button>


                
            </div>
        </>
    );
};

export default Post;