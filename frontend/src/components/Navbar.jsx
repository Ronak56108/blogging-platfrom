import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { FiSun, FiMoon } from 'react-icons/fi';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <nav className="bg-surface dark:bg-darkSurface shadow-sm border-b border-gray-100 dark:border-gray-800 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-primary tracking-tight">BlogUI</Link>

        <div className="flex items-center space-x-6">
          <button onClick={toggleTheme} className="text-gray-600 dark:text-gray-300 hover:text-primary transition-colors">
            {theme === 'light' ? <FiMoon size={20} /> : <FiSun size={20} />}
          </button>

          {user ? (
            <div className="flex items-center space-x-4">
              <Link to="/create-post" className="hidden md:block px-4 py-2 bg-primary text-white font-medium rounded-full hover:bg-blue-600 shadow-sm transition-all transform hover:-translate-y-0.5">
                Write a Story
              </Link>
              <div className="relative group">
                <button className="flex items-center space-x-2 text-text dark:text-darkText font-medium focus:outline-none">
                  <img 
                    src={user.profilePicture || `https://ui-avatars.com/api/?name=${user.username}&background=random`} 
                    alt="profile" 
                    className="w-10 h-10 rounded-full object-cover border-2 border-primary"
                  />
                  <span className="hidden sm:block">{user.username}</span>
                </button>
                {/* Dropdown menu */}
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-xl shadow-xl py-2 z-10 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 border border-gray-100 dark:border-gray-700 origin-top-right transform scale-95 group-hover:scale-100">
                  {user.role === 'admin' && (
                    <Link to="/admin" className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-primary hover:text-white transition-colors">Admin Dashboard</Link>
                  )}
                  <Link to="/profile" className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-primary hover:text-white transition-colors">Profile</Link>
                  <div className="border-t border-gray-100 dark:border-gray-700 my-1"></div>
                  <button onClick={handleLogout} className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">Sign out</button>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center space-x-4">
              <Link to="/login" className="text-gray-600 dark:text-gray-300 font-medium hover:text-primary transition-colors">Sign in</Link>
              <Link to="/register" className="px-5 py-2 bg-text text-white dark:bg-white dark:text-black font-medium rounded-full hover:bg-gray-800 dark:hover:bg-gray-200 shadow-sm transition-all transform hover:-translate-y-0.5">Get started</Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
