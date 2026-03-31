import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';
import parse from 'html-react-parser';
import { format } from 'date-fns';
import { useAuth } from '../context/AuthContext';
import { FaHeart, FaRegHeart, FaEye, FaClock } from 'react-icons/fa';
import { calculateReadingTime } from '../utils/helpers';

const PostDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [comments, setComments] = useState([]);
  const [commentContent, setCommentContent] = useState('');

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const [{ data: postData }, { data: commentsData }] = await Promise.all([
          api.get(`/api/posts/${id}`),
          api.get(`/api/comments/post/${id}`)
        ]);
        setPost(postData);
        setComments(commentsData);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [id]);

  const toggleLike = async () => {
    if (!user) {
      alert('You must be logged in to like a post');
      return;
    }
    try {
      const { data } = await api.put(`/api/posts/${id}/like`);
      setPost(data);
    } catch (error) {
      alert('Failed to like post');
    }
  };

  const submitComment = async (e) => {
    e.preventDefault();
    if (!commentContent.trim()) return;
    try {
      const { data } = await api.post(`/api/comments/post/${id}`, { content: commentContent });
      setComments([data, ...comments]);
      setCommentContent('');
    } catch (error) {
      alert('Failed to post comment');
    }
  };

  const deleteComment = async (commentId) => {
    try {
      await api.delete(`/api/comments/${commentId}`);
      setComments(comments.filter(c => c._id !== commentId));
    } catch (error) {
      alert('Failed to delete comment');
    }
  };

  if (loading) return <div className="text-center py-20 text-gray-500 font-medium">Loading post...</div>;
  if (!post) return <div className="text-center py-20 text-red-500 font-medium">Post not found.</div>;

  return (
    <div className="max-w-4xl mx-auto bg-surface dark:bg-darkSurface p-6 md:p-10 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
      {post.category && <span className="text-sm font-semibold text-primary uppercase tracking-wider">{post.category.name}</span>}
      <h1 className="text-4xl md:text-5xl font-extrabold text-text dark:text-darkText mt-3 mb-6 leading-tight">{post.title}</h1>
      
      <div className="flex items-center justify-between mb-8 pb-8 border-b border-gray-100 dark:border-gray-800">
        <div className="flex items-center space-x-4">
          <img 
            src={post.author?.profilePicture || `https://ui-avatars.com/api/?name=${post.author?.username || 'U'}&background=random`} 
            alt={post.author?.username} 
            className="w-12 h-12 rounded-full border-2 border-primary object-cover shadow-sm"
          />
          <div>
            <p className="font-medium text-text dark:text-darkText">{post.author?.username}</p>
            <p className="text-sm text-gray-500 flex items-center mt-1">
              {format(new Date(post.createdAt), 'MMMM d, yyyy')} 
              <span className="mx-2">•</span> 
              <FaClock className="mr-1.5" /> {calculateReadingTime(post.content)}
              <span className="mx-2">•</span> 
              <FaEye className="mr-1.5" /> {post.views || 0} views
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <button 
            onClick={toggleLike}
            className="flex items-center space-x-1.5 focus:outline-none bg-gray-50 hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700 px-4 py-2 rounded-full transition-colors border border-gray-200 dark:border-gray-700"
          >
            {user && post.likes?.includes(user._id) ? (
              <FaHeart className="text-red-500 text-xl" />
            ) : (
              <FaRegHeart className="text-gray-500 dark:text-gray-400 text-xl" />
            )}
            <span className="font-medium text-gray-700 dark:text-gray-300">
              {post.likes?.length || 0}
            </span>
          </button>
        </div>
      </div>

      {post.image && (
        <img 
          src={post.image.startsWith('http') ? post.image : `${import.meta.env.VITE_API_URL}${post.image}`} 
          alt={post.title} 
          className="w-full h-auto max-h-[500px] object-cover rounded-xl mb-10 shadow-md"
        />
      )}

      <div className="prose prose-lg dark:prose-invert max-w-none mb-12 text-gray-800 dark:text-gray-200">
        {parse(post.content)}
      </div>

      {/* Tags */}
      {post.tags && post.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-10">
          {post.tags.map((tag, idx) => (
            <span key={idx} className="bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 px-4 py-1.5 rounded-full text-sm font-medium">#{tag}</span>
          ))}
        </div>
      )}

      {/* Comments Section */}
      <div className="mt-16 pt-10 border-t border-gray-100 dark:border-gray-800">
        <h3 className="text-2xl font-bold mb-8 text-text dark:text-darkText">Responses ({comments.length})</h3>
        
        {user ? (
          <form onSubmit={submitComment} className="mb-10">
            <textarea 
              rows="3" 
              className="w-full p-4 border rounded-xl bg-gray-50 dark:bg-gray-800/50 dark:border-gray-700 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent transition-all shadow-inner"
              placeholder="What are your thoughts?"
              value={commentContent}
              onChange={(e) => setCommentContent(e.target.value)}
              required
            ></textarea>
            <div className="flex justify-end mt-3">
              <button type="submit" className="px-6 py-2.5 bg-primary text-white font-medium rounded-full hover:bg-blue-600 transition-colors shadow-sm">
                Respond
              </button>
            </div>
          </form>
        ) : (
          <div className="mb-10 p-6 bg-gray-50 dark:bg-gray-800/50 rounded-xl text-center border border-gray-100 dark:border-gray-700">
            <p className="text-gray-600 dark:text-gray-300 mb-3 font-medium">Want to join the discussion?</p>
            <Link to="/login" className="px-6 py-2 bg-text text-white dark:bg-white dark:text-black font-medium rounded-full transition-colors hover:bg-gray-800 dark:hover:bg-gray-200">Sign in to comment</Link>
          </div>
        )}

        <div className="space-y-6">
          {comments.map((comment) => (
            <div key={comment._id} className="bg-gray-50 dark:bg-gray-800/50 p-6 rounded-xl border border-gray-100 dark:border-gray-700">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <img 
                    src={comment.author?.profilePicture || `https://ui-avatars.com/api/?name=${comment.author?.username || 'U'}&background=random`} 
                    alt={comment.author?.username} 
                    className="w-8 h-8 rounded-full border border-gray-200"
                  />
                  <div>
                    <p className="font-medium text-sm text-text dark:text-darkText">{comment.author?.username}</p>
                    <p className="text-xs text-gray-500">{format(new Date(comment.createdAt), 'MMM d, yyyy')}</p>
                  </div>
                </div>
                {user && (user._id === comment.author?._id || user.role === 'admin') && (
                  <button onClick={() => deleteComment(comment._id)} className="text-red-500 hover:text-red-700 text-sm font-medium transition-colors">Delete</button>
                )}
              </div>
              <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line leading-relaxed">{comment.content}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PostDetails;
