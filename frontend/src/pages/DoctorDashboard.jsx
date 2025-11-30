import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  getManageBlogs, 
  deleteBlog, 
  logout, 
  isAuthenticated, 
  getCurrentUser 
} from '../utils/api';

const DoctorDashboard = () => {
  const [blogs, setBlogs] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();
  const currentUser = getCurrentUser();

  useEffect(() => {
    // Check authentication and role
    const user = getCurrentUser();
    
    if (!isAuthenticated() || user?.role !== 'doctor') {
      navigate('/doctor/login');
      return;
    }
    if (!user?.emailVerified) {
      setError('Your account is pending verification. Please wait for approval.');
      return;
    }

    loadBlogs();
  }, []); // Empty dependency array - only run once on mount

  const loadBlogs = async () => {
    setIsLoading(true);
    setError(''); // Clear previous errors
    
    try {
      const response = await getManageBlogs();
      
      // Check if response has the expected structure
      if (response && response.data && response.data.blogs) {
        setBlogs(response.data.blogs);
      } else {
        setError('Unexpected response format from server');
        setBlogs([]);
      }
      
    } catch (error) {
      console.error('❌ Error loading blogs:', error);
      
      let errorMessage = 'Failed to load blogs';
      
      if (error.response) {
        // Server responded with error status
        console.error('Server error status:', error.response.status);
        console.error('Server error data:', error.response.data);
        
        if (error.response.status === 401) {
          errorMessage = 'Authentication failed. Please login again.';
          // Logout and redirect to login
          logout();
          navigate('/doctor/login');
          return;
        } else if (error.response.status === 403) {
          errorMessage = 'Access denied. Your account may not be verified.';
        } else if (error.response.data?.message) {
          errorMessage = error.response.data.message;
        }
      } else if (error.request) {
        // Network error
        console.error('Network error:', error.request);
        errorMessage = 'Network error. Please check your connection.';
      } else {
        // Other error
        console.error('Other error:', error.message);
        errorMessage = error.message;
      }
      
      setError(errorMessage);
      setBlogs([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/doctor/login');
  };

  const handlePreviewBlog = async (blogId) => {
    try {
      // Create a secure preview URL that opens in a new window
      const previewUrl = `/doctor/blog/preview/${blogId}`;
      window.open(previewUrl, '_blank', 'noopener,noreferrer');
    } catch (error) {
      console.error('Error opening blog preview:', error);
      setError('Failed to open blog preview');
      setTimeout(() => setError(''), 5000);
    }
  };

  const handleDeleteBlog = async (blogId, blogTitle) => {
    if (!window.confirm(`Are you sure you want to delete "${blogTitle}"?`)) {
      return;
    }

    try {
      await deleteBlog(blogId);
      setSuccess('Blog deleted successfully');
      setTimeout(() => setSuccess(''), 3000); // Clear success message after 3 seconds
      loadBlogs(); // Reload blogs
    } catch (error) {
      console.error('Error deleting blog:', error);
      setError('Failed to delete blog');
      setTimeout(() => setError(''), 5000); // Clear error message after 5 seconds
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Show pending verification message
  if (currentUser && !currentUser.emailVerified) {
    return (
      <div className="min-h-screen bg-[#121212] flex items-center justify-center">
        <div className="max-w-md w-full bg-gray-900 rounded-lg p-8 text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-yellow-900/50 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 18.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-white mb-2">Account Pending Verification</h2>
          <p className="text-gray-400 mb-6">
            Your doctor account is currently being verified. 
            You will be notified once your account is verified and you can start creating blogs.
          </p>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition duration-200"
          >
            Logout
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#121212]">
      {/* Header */}
      <div className="bg-gray-900 border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-white">Doctor Dashboard</h1>
              <p className="text-gray-400">Welcome, Dr. {currentUser?.name}</p>
              {currentUser?.profile?.specialization && (
                <p className="text-sm text-blue-400">{currentUser.profile.specialization}</p>
              )}
            </div>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition duration-200"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gray-900 p-6 rounded-lg">
            <h3 className="text-sm font-medium text-gray-400 uppercase">Total Blogs</h3>
            <p className="text-3xl font-bold text-white mt-2">{blogs.length}</p>
          </div>
          <div className="bg-gray-900 p-6 rounded-lg">
            <h3 className="text-sm font-medium text-gray-400 uppercase">Published</h3>
            <p className="text-3xl font-bold text-green-400 mt-2">
              {blogs.filter(blog => blog.published).length}
            </p>
          </div>
          <div className="bg-gray-900 p-6 rounded-lg">
            <h3 className="text-sm font-medium text-gray-400 uppercase">Total Views</h3>
            <p className="text-3xl font-bold text-blue-400 mt-2">
              {blogs.reduce((total, blog) => total + (blog.views || 0), 0)}
            </p>
          </div>
        </div>

        {/* Alerts */}
        {error && (
          <div className="mb-6 bg-red-900/50 border border-red-700 text-red-300 px-4 py-3 rounded">
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {error}
            </div>
          </div>
        )}
        
        {success && (
          <div className="mb-6 bg-green-900/50 border border-green-700 text-green-300 px-4 py-3 rounded">
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              {success}
            </div>
          </div>
        )}

        {/* Blogs Section */}
        <div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-white">My Blogs</h2>
            <button
              onClick={() => navigate('/doctor/blogs/create')}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-200 flex items-center"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Create New Blog
            </button>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <div className="flex flex-col items-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mb-4"></div>
                <p className="text-gray-400">Loading your blogs...</p>
              </div>
            </div>
          ) : (
            <div className="bg-gray-900 rounded-lg overflow-hidden">
              {blogs.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-800">
                    <thead className="bg-gray-800">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                          Title
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                          Category
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                          Views
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                          Date
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-gray-900 divide-y divide-gray-800">
                      {blogs.map((blog) => (
                        <tr key={blog._id} className="hover:bg-gray-800 transition-colors">
                          <td className="px-6 py-4">
                            <div className="text-sm font-medium text-white truncate max-w-xs" title={blog.title}>
                              {blog.title}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className="px-2 py-1 text-xs bg-blue-900 text-blue-300 rounded-full">
                              {blog.category}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`px-2 py-1 text-xs rounded-full ${
                              blog.published 
                                ? 'bg-green-900 text-green-300' 
                                : 'bg-yellow-900 text-yellow-300'
                            }`}>
                              {blog.published ? 'Published' : 'Draft'}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-300">
                            {blog.views || 0}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-300">
                            {formatDate(blog.createdAt)}
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex space-x-2">
                              <button
                                onClick={() => navigate(`/doctor/blogs/edit/${blog._id}`)}
                                className="text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => handleDeleteBlog(blog._id, blog.title)}
                                className="text-red-400 hover:text-red-300 text-sm font-medium transition-colors"
                              >
                                Delete
                              </button>
                              {blog.published && (
                                <button
                                  onClick={() => handlePreviewBlog(blog._id)}
                                  className="text-green-400 hover:text-green-300 text-sm font-medium transition-colors"
                                >
                                  Preview
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="w-16 h-16 mx-auto mb-4 bg-gray-800 rounded-full flex items-center justify-center">
                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-white mb-2">No blogs yet</h3>
                  <p className="text-gray-400 mb-6">
                    Start sharing your medical expertise by creating your first blog post.
                  </p>
                  <button
                    onClick={() => navigate('/doctor/blogs/create')}
                    className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-200 font-medium"
                  >
                    Create Your First Blog
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Profile Section */}
        <div className="mt-12">
          <h2 className="text-xl font-semibold text-white mb-6">Profile Information</h2>
          <div className="bg-gray-900 rounded-lg p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Name</label>
                <p className="text-white">{currentUser?.name || 'Not specified'}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Email</label>
                <p className="text-white">{currentUser?.email || 'Not specified'}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Specialization</label>
                <p className="text-white">{currentUser?.profile?.specialization || 'Not specified'}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Experience</label>
                <p className="text-white">{currentUser?.profile?.experience || 0} years</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Hospital/Clinic</label>
                <p className="text-white">{currentUser?.profile?.hospital || 'Not specified'}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Member Since</label>
                <p className="text-white">{currentUser?.createdAt ? formatDate(currentUser.createdAt) : 'Unknown'}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorDashboard;
