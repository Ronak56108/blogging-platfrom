import React from 'react';
import Navbar from './Navbar';

const Layout = ({ children }) => {
  return (
    <>
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8 max-w-7xl">
        {children}
      </main>
      <footer className="bg-surface dark:bg-darkSurface border-t border-gray-200 dark:border-gray-800 py-8 mt-auto">
        <div className="container mx-auto px-4 text-center text-gray-500 dark:text-gray-400 text-sm">
          <p>&copy; {new Date().getFullYear()} MERN Blog Platform. All rights reserved.</p>
        </div>
      </footer>
    </>
  );
};

export default Layout;
