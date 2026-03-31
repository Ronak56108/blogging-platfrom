import React, { useState, useEffect } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';

const CreatePost = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [image, setImage] = useState(null);
  const [tags, setTags] = useState('');
  const [categories, setCategories] = useState([]);
  const [category, setCategory] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await api.get('/api/categories');
        setCategories(data);
        if (data.length > 0) setCategory(data[0]._id);
      } catch (error) {
        console.error('Failed to fetch categories');
      }
    };
    fetchCategories();
  }, []);

  const submitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData();
    formData.append('title', title);
    formData.append('content', content);
    formData.append('category', category);
    formData.append('tags', tags);
    if (image) {
      formData.append('image', image);
    }

    try {
      const { data } = await api.post('/api/posts', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      navigate(`/post/${data._id}`);
    } catch (error) {
      alert('Failed to publish post');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-surface dark:bg-darkSurface p-6 md:p-10 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
      <h1 className="text-3xl font-bold text-text dark:text-darkText mb-8">Write a Story</h1>
      <form onSubmit={submitHandler} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Title</label>
          <input 
            type="text" 
            className="w-full px-4 py-3 border rounded-xl bg-gray-50 dark:bg-gray-800 dark:border-gray-700 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent text-xl font-medium transition-all"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            placeholder="Title of your exciting post..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Category & Tags</label>
          <div className="flex flex-col md:flex-row gap-4">
            <select 
              className="w-full md:w-1/3 px-4 py-3 border rounded-xl bg-gray-50 dark:bg-gray-800 dark:border-gray-700 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
            >
              <option value="">Select Category</option>
              {categories.map(cat => (
                <option key={cat._id} value={cat._id}>{cat.name}</option>
              ))}
            </select>
            <input 
              type="text" 
              className="w-full md:w-2/3 px-4 py-3 border rounded-xl bg-gray-50 dark:bg-gray-800 dark:border-gray-700 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="Tags (comma separated, e.g. react, nodejs)"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Cover Image</label>
          <div className="w-full p-4 border border-dashed rounded-xl bg-gray-50 dark:bg-gray-800 dark:border-gray-700 text-center">
            <input 
              type="file" 
              onChange={(e) => setImage(e.target.files[0])}
              className="w-full text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-white hover:file:bg-blue-600 transition-colors cursor-pointer"
            />
          </div>
        </div>

        <div>
           <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Content</label>
           <div className="bg-white dark:bg-gray-800 text-black dark:text-white rounded-xl overflow-hidden border dark:border-gray-700 focus-within:ring-2 focus-within:ring-primary transition-all">
             <ReactQuill 
               theme="snow" 
               value={content} 
               onChange={setContent} 
               className="h-72 mb-10 dark:text-white dark-quill"
             />
           </div>
        </div>

        <div className="pt-6 flex justify-end">
          <button 
            type="submit" 
            className="px-8 py-3 bg-primary text-white font-medium rounded-full hover:bg-blue-600 transition-all transform hover:-translate-y-0.5 shadow-md disabled:opacity-50"
            disabled={loading}
          >
            {loading ? 'Publishing...' : 'Publish Post'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreatePost;
