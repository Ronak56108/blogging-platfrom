import React from 'react';
import { Link } from 'react-router-dom';
import parse from 'html-react-parser';
import { format } from 'date-fns';
import { FaHeart, FaEye, FaBookmark, FaRegBookmark } from 'react-icons/fa';
import { calculateReadingTime } from '../utils/helpers';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const PostCard = ({ post }) => {
  const { user, setUser } = useAuth();

  const handleBookmark = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) return alert('Please log in to save posts.');
    try {
      const { data } = await api.post(`/api/auth/bookmarks/${post._id}`);
      setUser({ ...user, bookmarks: data });
    } catch (err) {
      console.error(err);
    }
  };

  const isBookmarked = user?.bookmarks?.includes(post._id);

  return (
    <div className="bg-surface dark:bg-darkSurface rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-100 dark:border-gray-800 overflow-hidden flex flex-col h-full relative group">
      {post.image && (
        <Link to={`/post/${post._id}`}>
          <img 
            src={post.image.startsWith('http') ? post.image : `${import.meta.env.VITE_API_URL}${post.image}`} 
            alt={post.title} 
            className="w-full h-48 object-cover"
          />
        </Link>
      )}
      
      <button 
        onClick={handleBookmark}
        className="absolute top-4 right-4 bg-white/90 dark:bg-black/70 p-2.5 rounded-full shadow-md backdrop-blur-sm hover:bg-white dark:hover:bg-black transition-all z-10 opacity-0 group-hover:opacity-100 focus:opacity-100"
        title="Save for later"
      >
        {isBookmarked ? <FaBookmark className="text-primary text-sm" /> : <FaRegBookmark className="text-gray-700 dark:text-gray-300 text-sm" />}
      </button>

      <div className="p-5 flex-grow flex flex-col">
        {post.category && (
          <span className="text-xs font-semibold text-primary uppercase tracking-wider mb-2">{post.category?.name || 'Category'}</span>
        )}
        <h2 className="text-lg font-bold text-text dark:text-darkText mb-2 line-clamp-2">
          <Link to={`/post/${post._id}`} className="hover:text-primary transition-colors">{post.title}</Link>
        </h2>
        <div className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-3">
          {parse(post.content)}
        </div>
        <div className="mt-auto pt-4 flex items-center justify-between border-t border-gray-100 dark:border-gray-800">
          <div className="flex items-center space-x-2">
            <img 
              src={post.author?.profilePicture || `https://ui-avatars.com/api/?name=${post.author?.username || 'U'}&background=random`} 
              alt={post.author?.username} 
              className="w-8 h-8 rounded-full border border-gray-200"
            />
          <div className="flex flex-col">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{post.author?.username || 'User'}</span>
            <span className="text-xs text-gray-500 dark:text-gray-500 mt-0.5">
              {format(new Date(post.createdAt), 'MMM d')} • {calculateReadingTime(post.content)}
            </span>
          </div>
        </div>
        <div className="flex items-center space-x-3 text-gray-500 dark:text-gray-400">
          <div className="flex items-center space-x-1" title="Views">
              <FaEye className="text-xs" />
              <span className="text-xs font-medium">{post.views || 0}</span>
            </div>
            <div className="flex items-center space-x-1" title="Likes">
              <FaHeart className="text-xs" />
              <span className="text-xs font-medium">{post.likes?.length || 0}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostCard;
