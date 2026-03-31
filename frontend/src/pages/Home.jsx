import React, { useState, useEffect } from 'react';
import api from '../services/api';
import PostCard from '../components/PostCard';

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchPosts = async (keyword = '') => {
    try {
      setLoading(true);
      const url = keyword ? `/api/posts?keyword=${keyword}` : '/api/posts';
      const { data } = await api.get(url);
      setPosts(data.posts || []);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch posts');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchPosts(searchTerm);
  };

  if (loading) return <div className="text-center py-20 text-gray-500">Loading stories...</div>;
  if (error) return <div className="text-center py-20 text-red-500">{error}</div>;

  return (
    <div>
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-10 gap-6">
        <h1 className="text-4xl font-extrabold text-text dark:text-darkText tracking-tight">Latest Stories</h1>
        <form onSubmit={handleSearch} className="flex relative w-full md:w-1/3">
          <input 
            type="text" 
            placeholder="Search titles or content..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-5 pr-24 py-3 rounded-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent dark:text-white transition-all shadow-sm"
          />
          <button type="submit" className="absolute right-1.5 top-1.5 bottom-1.5 bg-primary text-white rounded-full px-5 font-medium hover:bg-blue-600 transition-colors shadow-sm">
            Search
          </button>
        </form>
      </div>
      {posts.length === 0 ? (
        <div className="text-center text-gray-500 py-10 bg-gray-50 dark:bg-gray-800/50 rounded-xl">No posts available right now.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map(post => <PostCard key={post._id} post={post} />)}
        </div>
      )}
    </div>
  );
};

export default Home;
