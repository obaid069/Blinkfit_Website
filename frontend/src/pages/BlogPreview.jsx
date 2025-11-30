import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { previewBlog, isAuthenticated, getCurrentUser, logout } from '../utils/api';

const BlogPreview = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [blog, setBlog] = useState(null);
  const [relatedBlogs, setRelatedBlogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const currentUser = getCurrentUser();

  useEffect(() => {
    // Check authentication
    if (!isAuthenticated() || currentUser?.role !== 'doctor') {
      navigate('/doctor/login');
      return;
    }

    loadBlogPreview();
  }, [id, navigate]); // Removed currentUser from dependencies to prevent infinite loop

  const loadBlogPreview = async () => {
    try {
      setIsLoading(true);
      
      const response = await previewBlog(id);
      
      if (response && response.data) {
        setBlog(response.data.blog);
        setRelatedBlogs(response.data.relatedBlogs || []);
      } else {
        setError('Invalid response format');
      }
    } catch (error) {
      console.error('Error loading blog preview:', error);
      
      if (error.response?.status === 401) {
        logout();
        navigate('/doctor/login');
      } else if (error.response?.status === 403) {
        setError('You can only preview your own blogs.');
      } else if (error.response?.status === 404) {
        setError('Blog not found.');
      } else {
        setError(error.response?.data?.message || 'Failed to load blog preview');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatReadTime = (minutes) => {
    return minutes <= 1 ? '1 min read' : `${minutes} min read`;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#121212] flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
          <p className="text-gray-400">Loading blog preview...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#121212] flex items-center justify-center">
        <div className="max-w-md w-full bg-gray-900 rounded-lg p-8 text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-red-900/50 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-white mb-2">Preview Error</h2>
          <p className="text-red-300 mb-6">{error}</p>
          <button
            onClick={() => navigate('/doctor/dashboard')}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-200"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="min-h-screen bg-[#121212] flex items-center justify-center">
        <div className="text-white">Blog not found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#121212]">
      {/* Header */}
      <div className="bg-gray-900 border-b border-gray-800 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/doctor/dashboard')}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
              </button>
              <div>
                <h1 className="text-lg font-semibold text-white">Blog Preview</h1>
                <p className="text-sm text-gray-400">Dr. {currentUser?.name}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <span className={`px-2 py-1 text-xs rounded-full ${
                blog.published 
                  ? 'bg-green-900 text-green-300' 
                  : 'bg-yellow-900 text-yellow-300'
              }`}>
                {blog.published ? 'Published' : 'Draft'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <article className="bg-gray-900 rounded-lg overflow-hidden">
          {/* Featured Image */}
          {blog.featuredImage && (
            <div className="aspect-video w-full">
              <img
                src={blog.featuredImage}
                alt={blog.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=600&h=400&fit=crop';
                }}
              />
            </div>
          )}

          <div className="p-8">
            {/* Category */}
            <div className="mb-4">
              <span className="px-3 py-1 text-sm bg-blue-900 text-blue-300 rounded-full">
                {blog.category}
              </span>
            </div>

            {/* Title */}
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-4 leading-tight">
              {blog.title}
            </h1>

            {/* Meta Information */}
            <div className="flex items-center text-gray-400 text-sm mb-6 space-x-6">
              <div className="flex items-center">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                By {blog.author}
              </div>
              <div className="flex items-center">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                {formatDate(blog.createdAt)}
              </div>
              <div className="flex items-center">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {formatReadTime(blog.readTime)}
              </div>
              <div className="flex items-center">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                {blog.views} views
              </div>
            </div>

            {/* Excerpt */}
            {blog.excerpt && (
              <div className="text-gray-300 text-lg mb-8 border-l-4 border-blue-500 pl-4 italic">
                {blog.excerpt}
              </div>
            )}

            {/* Content */}
            <div 
              className="prose prose-invert prose-lg max-w-none text-gray-300"
              dangerouslySetInnerHTML={{ __html: blog.content }}
              style={{
                lineHeight: '1.8',
                fontSize: '1.1rem'
              }}
            />

            {/* Tags */}
            {blog.tags && blog.tags.length > 0 && (
              <div className="mt-8 pt-8 border-t border-gray-700">
                <h3 className="text-sm font-semibold text-gray-400 mb-3">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {blog.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 text-sm bg-gray-800 text-gray-300 rounded-full"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </article>

        {/* Related Blogs */}
        {relatedBlogs && relatedBlogs.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-white mb-6">Your Other Blogs</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedBlogs.map((relatedBlog) => (
                <div key={relatedBlog._id} className="bg-gray-900 rounded-lg overflow-hidden hover:bg-gray-800 transition-colors">
                  {relatedBlog.featuredImage && (
                    <div className="aspect-video w-full">
                      <img
                        src={relatedBlog.featuredImage}
                        alt={relatedBlog.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=600&h=400&fit=crop';
                        }}
                      />
                    </div>
                  )}
                  <div className="p-4">
                    <span className="px-2 py-1 text-xs bg-blue-900 text-blue-300 rounded-full">
                      {relatedBlog.category}
                    </span>
                    <h3 className="text-white font-semibold mt-2 mb-2 line-clamp-2">
                      {relatedBlog.title}
                    </h3>
                    <p className="text-gray-400 text-sm mb-3 line-clamp-2">
                      {relatedBlog.excerpt}
                    </p>
                    <div className="text-xs text-gray-500">
                      {formatDate(relatedBlog.publishedAt || relatedBlog.createdAt)} • {relatedBlog.views} views
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BlogPreview;
