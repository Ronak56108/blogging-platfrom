import React, { useState, useEffect } from 'react';
import api from '../services/api';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('posts');
  const [posts, setPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState('');
  
  useEffect(() => {
    if (activeTab === 'categories') {
      fetchCategories();
    } else if (activeTab === 'posts') {
      fetchPosts();
    }
  }, [activeTab]);

  const fetchPosts = async () => {
    try {
      const { data } = await api.get('/api/posts');
      setPosts(data.posts || []);
    } catch (error) {
      console.error('Failed to fetch posts', error);
    }
  };

  const deletePost = async (id) => {
    if (window.confirm('Are you sure you want to delete this post? This action cannot be undone.')) {
      try {
        await api.delete(`/api/posts/${id}`);
        fetchPosts();
      } catch (error) {
        alert('Failed to delete post');
      }
    }
  };

  const fetchCategories = async () => {
    try {
      const { data } = await api.get('/api/categories');
      setCategories(data);
    } catch (error) {
      console.error(error);
    }
  };

  const createCategory = async (e) => {
    e.preventDefault();
    if (!newCategory.trim()) return;
    try {
      await api.post('/api/categories', { name: newCategory, description: '' });
      setNewCategory('');
      fetchCategories();
    } catch (error) {
      alert('Failed to create category');
    }
  };

  const deleteCategory = async (id) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      try {
        await api.delete(`/api/categories/${id}`);
        fetchCategories();
      } catch (error) {
        alert('Failed to delete category');
      }
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold text-text dark:text-darkText mb-8">Admin Dashboard</h1>
      
      <div className="flex border-b border-gray-200 dark:border-gray-800 mb-8 overflow-x-auto whitespace-nowrap">
        <button 
          className={`px-6 py-3 font-medium transition-colors border-b-2 ${activeTab === 'posts' ? 'border-primary text-primary' : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary'}`}
          onClick={() => setActiveTab('posts')}
        >
          Manage Posts
        </button>
        <button 
          className={`px-6 py-3 font-medium transition-colors border-b-2 ${activeTab === 'categories' ? 'border-primary text-primary' : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary'}`}
          onClick={() => setActiveTab('categories')}
        >
          Categories
        </button>
      </div>

      <div className="bg-surface dark:bg-darkSurface p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 min-h-[400px]">
        {activeTab === 'posts' && (
          <div>
            <h2 className="text-xl font-bold text-text dark:text-darkText mb-4">Content Moderation</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">Administrators have full access to view, edit, or delete user-generated content across the entire platform.</p>
            
            <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 overflow-hidden shadow-sm">
              <table className="w-full text-left">
                <thead className="bg-gray-50 dark:bg-gray-800/80 text-gray-700 dark:text-gray-300">
                  <tr>
                    <th className="px-6 py-4 font-semibold">Title</th>
                    <th className="px-6 py-4 font-semibold">Author</th>
                    <th className="px-6 py-4 font-semibold">Date</th>
                    <th className="px-6 py-4 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                  {posts.map((post) => (
                    <tr key={post._id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                      <td className="px-6 py-4 font-medium text-text dark:text-darkText">
                        <span className="line-clamp-1">{post.title}</span>
                      </td>
                      <td className="px-6 py-4 text-gray-600 dark:text-gray-400">{post.author?.username || 'Unknown'}</td>
                      <td className="px-6 py-4 text-gray-600 dark:text-gray-400">
                        {new Date(post.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button 
                          onClick={() => deletePost(post._id)}
                          className="text-red-500 hover:text-red-700 font-medium transition-colors bg-red-50 hover:bg-red-100 dark:bg-red-900/10 dark:hover:bg-red-900/30 px-4 py-2 rounded-lg"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                  {posts.length === 0 && (
                    <tr>
                      <td colSpan="4" className="px-6 py-12 text-center text-gray-500 font-medium">No posts found to moderate.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'categories' && (
          <div>
            <h2 className="text-xl font-bold text-text dark:text-darkText mb-4">Manage Categories</h2>
            
            <form onSubmit={createCategory} className="flex flex-col sm:flex-row gap-4 mb-8">
              <input 
                type="text" 
                className="flex-grow px-4 py-3 border rounded-xl bg-gray-50 dark:bg-gray-800 dark:border-gray-700 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                placeholder="New category name..."
                required
              />
              <button type="submit" className="px-8 py-3 bg-primary text-white font-medium rounded-xl hover:bg-blue-600 transition-colors shadow-sm whitespace-nowrap">
                Add Category
              </button>
            </form>

            <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 overflow-hidden shadow-sm">
              <table className="w-full text-left">
                <thead className="bg-gray-50 dark:bg-gray-800/80 text-gray-700 dark:text-gray-300">
                  <tr>
                    <th className="px-6 py-4 font-semibold">Name</th>
                    <th className="px-6 py-4 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                  {categories.map((cat) => (
                    <tr key={cat._id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                      <td className="px-6 py-4 font-medium text-text dark:text-darkText">{cat.name}</td>
                      <td className="px-6 py-4 text-right">
                        <button 
                          onClick={() => deleteCategory(cat._id)}
                          className="text-red-500 hover:text-red-700 font-medium transition-colors bg-red-50 hover:bg-red-100 dark:bg-red-900/10 dark:hover:bg-red-900/30 px-4 py-2 rounded-lg"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                  {categories.length === 0 && (
                    <tr>
                      <td colSpan="2" className="px-6 py-12 text-center text-gray-500 font-medium">No categories found. Start by creating one!</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
