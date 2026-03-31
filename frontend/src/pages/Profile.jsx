import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import PostCard from '../components/PostCard';

const Profile = () => {
  const { user, setUser } = useAuth();
  const [activeTab, setActiveTab] = useState('settings');
  const [savedPosts, setSavedPosts] = useState([]);
  const [loadingPosts, setLoadingPosts] = useState(false);

  // Settings State
  const [username, setUsername] = useState(user?.username || '');
  const [email, setEmail] = useState(user?.email || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (activeTab === 'saved') {
      fetchSavedPosts();
    }
  }, [activeTab]);

  const fetchSavedPosts = async () => {
    try {
      setLoadingPosts(true);
      const { data } = await api.get('/api/auth/bookmarks');
      setSavedPosts(data);
    } catch (err) {
      console.error('Failed to fetch saved posts');
    } finally {
      setLoadingPosts(false);
    }
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');
    try {
      const { data } = await api.put('/api/auth/profile', {
        username,
        email,
        bio,
        password
      });
      setUser(data);
      setMessage('Profile updated successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex border-b border-gray-200 dark:border-gray-800 mb-8">
        <button 
          className={`px-6 py-3 font-medium text-lg transition-colors border-b-2 ${activeTab === 'settings' ? 'border-primary text-primary' : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary'}`}
          onClick={() => setActiveTab('settings')}
        >
          Profile Settings
        </button>
        <button 
          className={`px-6 py-3 font-medium text-lg transition-colors border-b-2 ${activeTab === 'saved' ? 'border-primary text-primary' : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary'}`}
          onClick={() => setActiveTab('saved')}
        >
          Saved Posts
        </button>
      </div>

      {activeTab === 'settings' && (
        <div className="bg-surface dark:bg-darkSurface p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
          {message && <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg mb-6 shadow-sm">{message}</div>}
          {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6 shadow-sm">{error}</div>}

          <div className="flex flex-col md:flex-row gap-10">
            <div className="w-full md:w-1/3 flex flex-col items-center">
              <img 
                src={user?.profilePicture || `https://ui-avatars.com/api/?name=${user?.username}&background=random&size=150`} 
                alt="profile" 
                className="w-32 h-32 rounded-full object-cover border-4 border-gray-100 dark:border-gray-800 shadow-md mb-4"
              />
            </div>

            <div className="w-full md:w-2/3">
              <form onSubmit={submitHandler} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Username</label>
                  <input 
                    type="text" 
                    className="w-full px-5 py-3 border rounded-xl bg-gray-50 dark:bg-gray-800 dark:border-gray-700 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent transition-all shadow-sm"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email</label>
                  <input 
                    type="email" 
                    className="w-full px-5 py-3 border rounded-xl bg-gray-50 dark:bg-gray-800 dark:border-gray-700 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent transition-all shadow-sm"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Bio</label>
                  <textarea 
                    rows="4"
                    className="w-full px-5 py-3 border rounded-xl bg-gray-50 dark:bg-gray-800 dark:border-gray-700 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent transition-all h-32 shadow-sm"
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="Tell us about yourself..."
                  ></textarea>
                </div>
                <div className="pt-6 border-t border-gray-100 dark:border-gray-800">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">New Password (leave blank to keep current)</label>
                  <input 
                    type="password" 
                    className="w-full px-5 py-3 border rounded-xl bg-gray-50 dark:bg-gray-800 dark:border-gray-700 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent transition-all shadow-sm"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                
                <div className="pt-4 flex justify-end">
                  <button type="submit" disabled={loading} className="px-8 py-3 bg-primary text-white font-medium rounded-full hover:bg-blue-600 transition-colors shadow-md disabled:opacity-50">
                    {loading ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'saved' && (
        <div>
          {loadingPosts ? (
            <div className="text-center py-20 text-gray-500">Loading saved posts...</div>
          ) : savedPosts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {savedPosts.map(post => <PostCard key={post._id} post={post} />)}
            </div>
          ) : (
            <div className="text-center py-20 bg-gray-50 dark:bg-gray-800/50 rounded-2xl border border-dashed border-gray-200 dark:border-gray-700">
              <h3 className="text-xl font-bold text-gray-700 dark:text-gray-300 mb-2">No saved posts yet</h3>
              <p className="text-gray-500">When you bookmark stories, they will appear here.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Profile;
