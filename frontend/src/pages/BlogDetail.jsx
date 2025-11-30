import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  isAuthenticated, 
  getCurrentUser,
  adminDeleteBlog
} from '../utils/api';
import { 
  FileText,
  ArrowLeft,
  Edit3,
  Trash2,
  Eye,
  Clock,
  Calendar,
  Tag,
  User,
  TrendingUp,
  Heart,
  Share2,
  Globe,
  AlertTriangle
} from 'lucide-react';

const BlogDetail = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const blog = location.state?.blog;
  
  // Authentication check
  useEffect(() => {
    if (!isAuthenticated()) {
      navigate('/admin/login');
      return;
    }

    const currentUser = getCurrentUser();
    if (!currentUser || currentUser.role !== 'admin') {
      navigate('/admin/login');
      return;
    }

    // If no blog data, redirect back
    if (!blog) {
      navigate('/admin/dashboard', { state: { activeTab: 'blogs' } });
      return;
    }
  }, [navigate, blog]);

  const [loading, setLoading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleBack = () => {
    navigate('/admin/dashboard', { state: { activeTab: 'blogs' } });
  };

  const handleEdit = () => {
    navigate('/admin/blog-management', { 
      state: { 
        blog: blog 
      } 
    });
  };

  const handleDelete = async () => {
    setLoading(true);
    try {
      await adminDeleteBlog(blog._id);
      alert('Blog deleted successfully!');
      navigate('/admin/dashboard', { state: { activeTab: 'blogs' } });
    } catch (error) {
      console.error('Error deleting blog:', error);
      alert(error.response?.data?.message || 'Error deleting blog. Please try again.');
    } finally {
      setLoading(false);
      setShowDeleteModal(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getReadingTime = (content) => {
    const wordsPerMinute = 200;
    const words = content?.split(' ').length || 0;
    return Math.ceil(words / wordsPerMinute) || 1;
  };

  if (!blog) {
    return (
      <div className="min-h-screen bg-[#121212] text-white flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
          <h2 className="text-xl font-bold mb-2">Blog Not Found</h2>
          <p className="text-gray-400 mb-4">The blog you're looking for doesn't exist or couldn't be loaded.</p>
          <button
            onClick={handleBack}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#121212] text-white">
      {/* Header */}
      <header className="bg-[#1E1E1E] border-b border-[#333333] px-6 py-4 sticky top-0 z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={handleBack}
              className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              Back to Dashboard
            </button>
            <div>
              <h1 className="text-xl font-bold text-blue-400">Blog Details</h1>
              <p className="text-gray-400 text-sm">View and manage blog post</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <button
              onClick={handleEdit}
              className="flex items-center gap-2 px-4 py-2 bg-yellow-600 hover:bg-yellow-700 rounded-lg transition-colors"
            >
              <Edit3 className="w-4 h-4" />
              Edit Blog
            </button>
            
            <button
              onClick={() => setShowDeleteModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              Delete
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Article */}
          <article className="lg:col-span-3">
            <div className="bg-[#1E1E1E] rounded-lg overflow-hidden">
              {/* Featured Image */}
              {blog.featuredImage && (
                <div className="aspect-video w-full overflow-hidden">
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
                {/* Article Header */}
                <header className="mb-8">
                  {/* Status Badge */}
                  <div className="mb-4">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                      blog.published 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      <Globe className="w-4 h-4 mr-2" />
                      {blog.published ? 'Published' : 'Draft'}
                    </span>
                  </div>

                  {/* Title */}
                  <h1 className="text-4xl font-bold text-white mb-6 leading-tight">
                    {blog.title}
                  </h1>

                  {/* Meta Information */}
                  <div className="flex flex-wrap items-center gap-6 text-sm text-gray-400 mb-6 pb-6 border-b border-[#333333]">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4" />
                      <span>{blog.author || 'Unknown Author'}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <span>{formatDate(blog.publishedAt || blog.createdAt)}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      <span>{blog.readTime || getReadingTime(blog.content)} min read</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Eye className="w-4 h-4" />
                      <span>{blog.views || 0} views</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Heart className="w-4 h-4" />
                      <span>{blog.likes || 0} likes</span>
                    </div>
                  </div>

                  {/* Excerpt */}
                  {blog.excerpt && (
                    <div className="mb-8 p-4 bg-[#333333] rounded-lg border-l-4 border-blue-500">
                      <p className="text-lg text-gray-300 leading-relaxed font-light italic">
                        {blog.excerpt}
                      </p>
                    </div>
                  )}

                  {/* Tags */}
                  {blog.tags && blog.tags.length > 0 && (
                    <div className="mb-8">
                      <h3 className="text-sm font-semibold text-gray-400 mb-3 flex items-center gap-2">
                        <Tag className="w-4 h-4" />
                        Tags
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {blog.tags.map((tag, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </header>

                {/* Article Content */}
                <div className="prose prose-lg prose-invert max-w-none">
                  <div className="text-gray-300 leading-relaxed whitespace-pre-wrap text-base">
                    {blog.content || 'No content available for this blog post.'}
                  </div>
                </div>

                {/* Article Footer */}
                <footer className="mt-12 pt-8 border-t border-[#333333]">
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-400">
                      <p>Last updated: {formatDate(blog.updatedAt || blog.createdAt)}</p>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <button className="flex items-center gap-2 px-3 py-1 text-gray-400 hover:text-white transition-colors">
                        <Share2 className="w-4 h-4" />
                        Share
                      </button>
                    </div>
                  </div>
                </footer>
              </div>
            </div>
          </article>

          {/* Sidebar */}
          <aside className="space-y-6">
            {/* Blog Stats */}
            <div className="bg-[#1E1E1E] rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Performance
              </h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Views</span>
                  <span className="text-white font-semibold">{blog.views || 0}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Likes</span>
                  <span className="text-white font-semibold">{blog.likes || 0}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Read Time</span>
                  <span className="text-white font-semibold">{blog.readTime || getReadingTime(blog.content)} min</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Word Count</span>
                  <span className="text-white font-semibold">
                    {blog.content ? blog.content.split(' ').length : 0}
                  </span>
                </div>
              </div>
            </div>

            {/* Blog Meta */}
            <div className="bg-[#1E1E1E] rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Details
              </h3>
              
              <div className="space-y-3">
                <div>
                  <span className="text-gray-400 text-sm block">Category</span>
                  <span className="text-white">{blog.category || 'Uncategorized'}</span>
                </div>
                
                <div>
                  <span className="text-gray-400 text-sm block">Author</span>
                  <span className="text-white">{blog.author || 'Unknown'}</span>
                </div>
                
                <div>
                  <span className="text-gray-400 text-sm block">Slug</span>
                  <span className="text-white text-sm font-mono bg-[#333333] px-2 py-1 rounded">
                    {blog.slug || 'no-slug'}
                  </span>
                </div>
                
                <div>
                  <span className="text-gray-400 text-sm block">Status</span>
                  <span className={`text-sm font-medium ${
                    blog.published ? 'text-green-400' : 'text-yellow-400'
                  }`}>
                    {blog.published ? 'Published' : 'Draft'}
                  </span>
                </div>
              </div>
            </div>

            {/* SEO Info */}
            {(blog.metaTitle || blog.metaDescription) && (
              <div className="bg-[#1E1E1E] rounded-lg p-6">
                <h3 className="text-lg font-semibold text-white mb-4">SEO Information</h3>
                
                <div className="space-y-3">
                  {blog.metaTitle && (
                    <div>
                      <span className="text-gray-400 text-sm block">Meta Title</span>
                      <p className="text-white text-sm">{blog.metaTitle}</p>
                    </div>
                  )}
                  
                  {blog.metaDescription && (
                    <div>
                      <span className="text-gray-400 text-sm block">Meta Description</span>
                      <p className="text-white text-sm">{blog.metaDescription}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Quick Actions */}
            <div className="bg-[#1E1E1E] rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Quick Actions</h3>
              
              <div className="space-y-3">
                <button
                  onClick={handleEdit}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-yellow-600 hover:bg-yellow-700 rounded-lg transition-colors"
                >
                  <Edit3 className="w-4 h-4" />
                  Edit Blog
                </button>
                
                <button
                  onClick={() => setShowDeleteModal(true)}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete Blog
                </button>
                
                <button
                  onClick={handleBack}
                  className="w-full px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded-lg transition-colors"
                >
                  Back to Dashboard
                </button>
              </div>
            </div>
          </aside>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-[#1E1E1E] rounded-lg max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-red-100 rounded-full">
                  <AlertTriangle className="w-6 h-6 text-red-600" />
                </div>
                <h3 className="text-xl font-bold text-white">Delete Blog Post</h3>
              </div>
              
              <p className="text-gray-300 mb-6">
                Are you sure you want to delete "<strong>{blog.title}</strong>"? 
                This action cannot be undone and will permanently remove the blog post.
              </p>
              
              <div className="flex gap-3">
                <button
                  onClick={handleDelete}
                  disabled={loading}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-red-800 disabled:cursor-not-allowed rounded-lg transition-colors text-white"
                >
                  <Trash2 className="w-4 h-4" />
                  {loading ? 'Deleting...' : 'Delete Blog'}
                </button>
                
                <button
                  onClick={() => setShowDeleteModal(false)}
                  disabled={loading}
                  className="flex-1 px-4 py-2 bg-gray-600 hover:bg-gray-700 disabled:bg-gray-800 disabled:cursor-not-allowed rounded-lg transition-colors text-white"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BlogDetail;
