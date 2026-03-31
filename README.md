# MERN Blogging Platform

A production-ready, highly scalable blogging platform built with the MERN stack (MongoDB, Express, React, Node.js). Features a beautiful, modern UI using Tailwind CSS, rich text editing, intelligent dark mode, protected admin routes, and comprehensive API design.

## Features
- **Frontend**: React (Vite), Tailwind CSS, React Router, Context API
- **Backend**: Node.js, Express, MongoDB with Mongoose
- **Authentication**: Secure JWT-based auth with HTTP-only cookies
- **Blog Management**: Full CRUD operations for posts, categories, and tags
- **Rich Text Editor**: Integrated with `react-quill` for writing beautiful stories
- **Interactions**: Users can comment on posts
- **Admin Panel**: Role-based access control (RBAC) to manage content and categories
- **Aesthetics**: Professional dark mode toggle, skeleton loaders, and highly responsive components

## Setup Instructions

### 1. Requirements
- Node.js installed (v16+)
- MongoDB Atlas cluster (or local MongoDB)

### 2. Backend Setup
1. Navigate to backend: `cd backend`
2. Install dependencies: `npm install`
3. Configure `.env`: Use the provided `.env` template but replace `MONGO_URI` with your Atlas URI.
4. Run server: `npm run dev` (starts on port 5000)

### 3. Frontend Setup
1. Navigate to frontend: `cd frontend`
2. Install dependencies: `npm install`
3. Configure `.env`: `VITE_API_URL=http://localhost:5000`
4. Run development client: `npm run dev` (starts on port 5173)

## Deployment Recommendations
- **Frontend**: Deploy via Vercel (link to your GitHub repository and build settings: `npm run build`, output dir: `dist`)
- **Backend**: Deploy on Render or Railway
- **Database**: Host on MongoDB Atlas
