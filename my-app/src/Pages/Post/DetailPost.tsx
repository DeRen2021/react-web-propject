import React, { useState } from "react";
import {useData} from '../../Context/DataContext'
import {type PostType ,type CommentType} from '../../Type/Types'
import { useParams } from 'react-router-dom';
import './DetailPost.css';

const COMMENTS_PER_PAGE = 2;

const DetailPost: React.FC = () => {
    const {postId} = useParams<{postId:string}>();
    const postIdNumber = Number(postId);
    const {posts, comments} = useData();
    const [currentPage, setCurrentPage] = useState(1);

    const selectPost: PostType | undefined = posts.find(post => post.id === postIdNumber);

    if (!selectPost) {
        return <div className="error-message">Post not found</div>;
    }

    const selectComments:CommentType[] = comments.filter(comment => comment.postId === postIdNumber);
    
    const totalPages = Math.ceil(selectComments.length / COMMENTS_PER_PAGE);
    const startIndex = (currentPage - 1) * COMMENTS_PER_PAGE;
    const paginatedComments = selectComments.slice(startIndex, startIndex + COMMENTS_PER_PAGE);

    const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

    return (
        <div className="detail-post-container">
            {/* Post Content */}
            <div className="post-content">
                <h1 className="post-title">{selectPost.title}</h1>
                <div className="post-meta">
                    <div className="post-meta-item">
                        <span className="post-meta-label">Post ID:</span>
                        <span>{selectPost.id}</span>
                    </div>
                    <div className="post-meta-item">
                        <span className="post-meta-label">Author ID:</span>
                        <span>{selectPost.userId}</span>
                    </div>
                </div>
                <p className="post-body">{selectPost.body}</p>
            </div>

            {/* Comments Section */}
            <div className="comments-section">
                <h2 className="comments-title">Comments ({selectComments.length})</h2>
                {paginatedComments.map(comment => (
                    <div key={comment.id} className="comment">
                        <h3 className="comment-author">
                            <span className="comment-author-label">From:</span>
                            <span>{comment.name}</span>
                        </h3>
                        <p className="comment-body">{comment.body}</p>
                    </div>
                ))}

                {totalPages > 1 && (
                    <div className="pagination">
                        <button 
                            className="pagination-button"
                            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                            disabled={currentPage === 1}
                        >
                            Previous
                        </button>
                        
                        <div className="pagination-numbers">
                            {pageNumbers.map(number => (
                                <button
                                    key={number}
                                    className={`pagination-number ${currentPage === number ? 'active' : ''}`}
                                    onClick={() => setCurrentPage(number)}
                                >
                                    {number}
                                </button>
                            ))}
                        </div>

                        <button 
                            className="pagination-button"
                            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                            disabled={currentPage === totalPages}
                        >
                            Next
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DetailPost;

