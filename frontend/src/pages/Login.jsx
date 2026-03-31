import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to login');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-surface dark:bg-darkSurface rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
      <h2 className="text-3xl font-bold mb-6 text-center text-text dark:text-darkText">Welcome Back</h2>
      {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}
      <form onSubmit={submitHandler}>
        <div className="mb-4">
          <label className="block text-gray-700 dark:text-gray-300 mb-2">Email Address</label>
          <input 
            type="email" 
            className="w-full px-3 py-2 border rounded-md dark:bg-gray-800 dark:border-gray-600 dark:text-white focus:outline-none focus:border-primary"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="mb-6">
          <label className="block text-gray-700 dark:text-gray-300 mb-2">Password</label>
          <input 
            type="password" 
            className="w-full px-3 py-2 border rounded-md dark:bg-gray-800 dark:border-gray-600 dark:text-white focus:outline-none focus:border-primary"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="w-full bg-primary text-white py-2 rounded-md hover:bg-blue-600 transition-colors">
          Sign In
        </button>
      </form>
      <p className="mt-4 text-center text-gray-600 dark:text-gray-400">
        New here? <Link to="/register" className="text-primary hover:underline">Create an account</Link>
      </p>
    </div>
  );
};

export default Login;
