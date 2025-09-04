import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  isAuthenticated, 
  getCurrentUser, 
  logout,
  getDoctors,
  verifyDoctor,
  unverifyDoctor,
  deleteDoctor,
  getContactStats,
  getContacts,
  updateContactStatus,
  getAdminBlogAnalytics,
  getAdminBlogs
} from '../utils/api';
import { 
  Users, 
  FileText, 
  Mail, 
  BarChart3, 
  Settings,
  LogOut,
  UserCheck,
  UserX,
  Trash2,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  TrendingUp,
  MessageSquare
} from 'lucide-react';

const AdminDashboard = () => {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [doctors, setDoctors] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [contactStats, setContactStats] = useState(null);
  const [blogAnalytics, setBlogAnalytics] = useState(null);
  const [allBlogs, setAllBlogs] = useState([]);
  const [blogsPagination, setBlogsPagination] = useState(null);
  const [showAddBlog, setShowAddBlog] = useState(false);
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [showBlogModal, setShowBlogModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check authentication and admin role
    if (!isAuthenticated()) {
      navigate('/admin/login');
      return;
    }

    const currentUser = getCurrentUser();
    if (!currentUser || currentUser.role !== 'admin') {
      navigate('/admin/login');
      return;
    }

    setUser(currentUser);
    loadDashboardData();
  }, [navigate]);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      // Load all data in parallel
      const [doctorsRes, contactsRes, contactStatsRes, analyticsRes, allBlogsRes] = await Promise.allSettled([
        getDoctors({ limit: 10 }),
        getContacts({ limit: 10 }),
        getContactStats(),
        getAdminBlogAnalytics(),
        getAdminBlogs({ limit: 50 }) // Fetch up to 50 blogs for admin dashboard
      ]);

      if (doctorsRes.status === 'fulfilled') {
        setDoctors(doctorsRes.value?.data?.doctors || []);
      }
      
      if (contactsRes.status === 'fulfilled') {
        setContacts(contactsRes.value?.data?.contacts || []);
      }
      
      if (contactStatsRes.status === 'fulfilled') {
        setContactStats(contactStatsRes.value?.data || null);
      }
      
              if (analyticsRes.status === 'fulfilled') {
                const analytics = analyticsRes.value?.data;
                if (analytics) {
                  // Transform the analytics data to match expected structure
                  setBlogAnalytics({
                    totalBlogs: analytics.overview?.total || 0,
                    publishedBlogs: analytics.overview?.published || 0,
                    totalViews: analytics.topBlogs?.reduce((sum, blog) => sum + (blog.views || 0), 0) || 0,
                    overview: analytics.overview,
                    topBlogs: analytics.topBlogs || [],
                    categoryStats: analytics.categoryStats || [],
                    authorStats: analytics.authorStats || []
                  });
                } else {
                  setBlogAnalytics(null);
                }
              } else {
                // Fallback: Use public blog API to get basic statistics
                console.log('Admin analytics failed, using fallback public API');
                try {
                  const { blogAPI } = await import('../utils/api');
                  const publicBlogsResponse = await blogAPI.getBlogs({ limit: 100 });
                  if (publicBlogsResponse && publicBlogsResponse.blogs) {
                    const blogs = publicBlogsResponse.blogs;
                    const totalViews = blogs.reduce((sum, blog) => sum + (blog.views || 0), 0);
                    setBlogAnalytics({
                      totalBlogs: publicBlogsResponse.pagination?.totalBlogs || blogs.length,
                      publishedBlogs: blogs.filter(b => b.published !== false).length,
                      totalViews: totalViews,
                      overview: {
                        total: publicBlogsResponse.pagination?.totalBlogs || blogs.length,
                        published: blogs.filter(b => b.published !== false).length,
                        drafts: 0
                      },
                      topBlogs: blogs.sort((a, b) => (b.views || 0) - (a.views || 0)).slice(0, 5),
                      categoryStats: [],
                      authorStats: []
                    });
                  }
                } catch (fallbackError) {
                  console.error('Fallback blog stats failed:', fallbackError);
                  setBlogAnalytics(null);
                }
              }
              
              // Load all blogs for the blogs tab
              if (allBlogsRes.status === 'fulfilled') {
                setAllBlogs(allBlogsRes.value?.data?.blogs || []);
                setBlogsPagination(allBlogsRes.value?.data?.pagination || null);
              } else {
                console.error('Failed to fetch all blogs:', allBlogsRes.reason);
                setAllBlogs([]);
                setBlogsPagination(null);
              }
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const handleVerifyDoctor = async (doctorId) => {
    try {
      await verifyDoctor(doctorId);
      loadDashboardData(); // Refresh data
    } catch (error) {
      console.error('Error verifying doctor:', error);
      alert('Error verifying doctor');
    }
  };

  const handleUnverifyDoctor = async (doctorId) => {
    try {
      await unverifyDoctor(doctorId);
      loadDashboardData(); // Refresh data
    } catch (error) {
      console.error('Error unverifying doctor:', error);
      alert('Error unverifying doctor');
    }
  };

  const handleDeleteDoctor = async (doctorId) => {
    if (!confirm('Are you sure you want to delete this doctor?')) {
      return;
    }
    
    try {
      await deleteDoctor(doctorId);
      loadDashboardData(); // Refresh data
    } catch (error) {
      console.error('Error deleting doctor:', error);
      alert('Error deleting doctor');
    }
  };

  const handleUpdateContactStatus = async (contactId, status) => {
    try {
      await updateContactStatus(contactId, status);
      loadDashboardData(); // Refresh data
    } catch (error) {
      console.error('Error updating contact status:', error);
      alert('Error updating contact status');
    }
  };

  // Blog management handlers
  const handleViewBlog = (blog) => {
    // Navigate to blog detail page with blog data
    navigate('/admin/blog-detail', { state: { blog } });
  };

  const handleEditBlog = (blog) => {
    // Navigate to blog management page with blog data for editing
    navigate('/admin/blog-management', { state: { blog } });
  };

  const handleDeleteBlog = async (blogId) => {
    if (!confirm('Are you sure you want to delete this blog? This action cannot be undone.')) {
      return;
    }
    
    try {
      const { adminDeleteBlog } = await import('../utils/api');
      await adminDeleteBlog(blogId);
      alert('Blog deleted successfully!');
      loadDashboardData(); // Refresh data
    } catch (error) {
      console.error('Error deleting blog:', error);
      alert(error.response?.data?.message || 'Error deleting blog. Please try again.');
    }
  };

  const handleAddBlog = () => {
    // Navigate to blog management page for adding new blog
    navigate('/admin/blog-management');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#121212] flex items-center justify-center">
        <div className="text-white text-xl">Loading Admin Dashboard...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#121212] text-white">
      {/* Header */}
      <header className="bg-[#1E1E1E] border-b border-[#333333] px-6 py-4">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-blue-400">Admin Dashboard</h1>
            <p className="text-gray-400">Welcome back, {user?.name}</p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-[#1A1A1A] min-h-screen p-6">
          <nav className="space-y-2">
            <button
              onClick={() => setActiveTab('overview')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                activeTab === 'overview' ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-[#333333]'
              }`}
            >
              <BarChart3 className="w-5 h-5" />
              Overview
            </button>
            <button
              onClick={() => setActiveTab('doctors')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                activeTab === 'doctors' ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-[#333333]'
              }`}
            >
              <Users className="w-5 h-5" />
              Doctors ({doctors.length})
            </button>
            <button
              onClick={() => setActiveTab('blogs')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                activeTab === 'blogs' ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-[#333333]'
              }`}
            >
              <FileText className="w-5 h-5" />
              Blog Management ({allBlogs.length})
            </button>
            <button
              onClick={() => setActiveTab('contacts')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                activeTab === 'contacts' ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-[#333333]'
              }`}
            >
              <Mail className="w-5 h-5" />
              Contacts ({contacts.length})
            </button>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          {activeTab === 'overview' && (
            <div>
              <h2 className="text-xl font-bold mb-6">Dashboard Overview</h2>
              
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-[#1E1E1E] rounded-lg p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">Total Blogs</p>
                      <p className="text-2xl font-bold text-blue-400">{blogAnalytics?.totalBlogs || 0}</p>
                    </div>
                    <FileText className="w-8 h-8 text-blue-400" />
                  </div>
                </div>

                <div className="bg-[#1E1E1E] rounded-lg p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">Published</p>
                      <p className="text-2xl font-bold text-green-400">
                        {blogAnalytics?.publishedBlogs || 0}
                      </p>
                    </div>
                    <CheckCircle className="w-8 h-8 text-green-400" />
                  </div>
                </div>

                <div className="bg-[#1E1E1E] rounded-lg p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">Total Views</p>
                      <p className="text-2xl font-bold text-purple-400">
                        {blogAnalytics?.totalViews || 0}
                      </p>
                    </div>
                    <TrendingUp className="w-8 h-8 text-purple-400" />
                  </div>
                </div>

                <div className="bg-[#1E1E1E] rounded-lg p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">Total Doctors</p>
                      <p className="text-2xl font-bold text-yellow-400">{doctors.length}</p>
                    </div>
                    <Users className="w-8 h-8 text-yellow-400" />
                  </div>
                </div>
              </div>

              {/* Secondary Stats */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-[#1E1E1E] rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">Pending Verification</p>
                      <p className="text-xl font-bold text-orange-400">
                        {doctors.filter(d => !d.emailVerified).length}
                      </p>
                    </div>
                    <Clock className="w-6 h-6 text-orange-400" />
                  </div>
                </div>

                <div className="bg-[#1E1E1E] rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">Total Contacts</p>
                      <p className="text-xl font-bold text-green-400">
                        {contactStats?.total || 0}
                      </p>
                    </div>
                    <MessageSquare className="w-6 h-6 text-green-400" />
                  </div>
                </div>

                <div className="bg-[#1E1E1E] rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">Unread Contacts</p>
                      <p className="text-xl font-bold text-red-400">
                        {contactStats?.unread || 0}
                      </p>
                    </div>
                    <Mail className="w-6 h-6 text-red-400" />
                  </div>
                </div>

                <div className="bg-[#1E1E1E] rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">Categories</p>
                      <p className="text-xl font-bold text-cyan-400">
                        {blogAnalytics?.categoryStats?.length || 0}
                      </p>
                    </div>
                    <BarChart3 className="w-6 h-6 text-cyan-400" />
                  </div>
                </div>
              </div>

              {/* Recent Activities */}
              <div className="bg-[#1E1E1E] rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4">Recent Activities</h3>
                <div className="space-y-3">
                  {doctors.slice(0, 5).map((doctor) => (
                    <div key={doctor._id} className="flex items-center gap-3 py-2">
                      <div className={`w-2 h-2 rounded-full ${doctor.emailVerified ? 'bg-green-400' : 'bg-yellow-400'}`} />
                      <span className="text-gray-300">
                        {doctor.name} ({doctor.email}) - {doctor.emailVerified ? 'Verified' : 'Pending'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'doctors' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold">Doctor Management</h2>
                <button 
                  onClick={loadDashboardData}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
                >
                  Refresh
                </button>
              </div>

              <div className="bg-[#1E1E1E] rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-[#333333]">
                      <tr>
                        <th className="px-6 py-3 text-left text-sm font-medium text-gray-300">Name</th>
                        <th className="px-6 py-3 text-left text-sm font-medium text-gray-300">Email</th>
                        <th className="px-6 py-3 text-left text-sm font-medium text-gray-300">Specialization</th>
                        <th className="px-6 py-3 text-left text-sm font-medium text-gray-300">Status</th>
                        <th className="px-6 py-3 text-left text-sm font-medium text-gray-300">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#333333]">
                      {doctors.map((doctor) => (
                        <tr key={doctor._id}>
                          <td className="px-6 py-4 text-sm text-white">{doctor.name}</td>
                          <td className="px-6 py-4 text-sm text-gray-300">{doctor.email}</td>
                          <td className="px-6 py-4 text-sm text-gray-300">
                            {doctor.profile?.specialization || 'N/A'}
                          </td>
                          <td className="px-6 py-4">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              doctor.emailVerified 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {doctor.emailVerified ? 'Verified' : 'Pending'}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              {doctor.emailVerified ? (
                                <button
                                  onClick={() => handleUnverifyDoctor(doctor._id)}
                                  className="p-1 text-yellow-400 hover:text-yellow-300"
                                  title="Unverify Doctor"
                                >
                                  <UserX className="w-4 h-4" />
                                </button>
                              ) : (
                                <button
                                  onClick={() => handleVerifyDoctor(doctor._id)}
                                  className="p-1 text-green-400 hover:text-green-300"
                                  title="Verify Doctor"
                                >
                                  <UserCheck className="w-4 h-4" />
                                </button>
                              )}
                              <button
                                onClick={() => handleDeleteDoctor(doctor._id)}
                                className="p-1 text-red-400 hover:text-red-300"
                                title="Delete Doctor"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'blogs' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold">Blog Management</h2>
                <div className="flex gap-3">
                  <button 
                    onClick={handleAddBlog}
                    className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg transition-colors flex items-center gap-2"
                  >
                    <FileText className="w-4 h-4" />
                    Add New Blog
                  </button>
                  <button 
                    onClick={loadDashboardData}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
                  >
                    Refresh
                  </button>
                </div>
              </div>

              {/* Blog Analytics Cards */}
              {blogAnalytics && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="bg-[#1E1E1E] rounded-lg p-4">
                    <p className="text-gray-400 text-sm">Total Blogs</p>
                    <p className="text-xl font-bold text-blue-400">{blogAnalytics.totalBlogs || 0}</p>
                  </div>
                  <div className="bg-[#1E1E1E] rounded-lg p-4">
                    <p className="text-gray-400 text-sm">Published</p>
                    <p className="text-xl font-bold text-green-400">{blogAnalytics.publishedBlogs || 0}</p>
                  </div>
                  <div className="bg-[#1E1E1E] rounded-lg p-4">
                    <p className="text-gray-400 text-sm">Total Views</p>
                    <p className="text-xl font-bold text-purple-400">{blogAnalytics.totalViews || 0}</p>
                  </div>
                </div>
              )}

              {/* Show total count */}
              {blogsPagination && (
                <div className="mb-4">
                  <p className="text-gray-400 text-sm">
                    Showing {allBlogs.length} of {blogsPagination.totalBlogs} blogs
                    {blogsPagination.totalPages > 1 && (
                      <span className="ml-2 text-blue-400">
                        (Page {blogsPagination.currentPage} of {blogsPagination.totalPages})
                      </span>
                    )}
                  </p>
                </div>
              )}

              {/* Blogs List */}
              <div className="bg-[#1E1E1E] rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-[#333333]">
                      <tr>
                        <th className="px-6 py-3 text-left text-sm font-medium text-gray-300">Title</th>
                        <th className="px-6 py-3 text-left text-sm font-medium text-gray-300">Category</th>
                        <th className="px-6 py-3 text-left text-sm font-medium text-gray-300">Author</th>
                        <th className="px-6 py-3 text-left text-sm font-medium text-gray-300">Views</th>
                        <th className="px-6 py-3 text-left text-sm font-medium text-gray-300">Status</th>
                        <th className="px-6 py-3 text-left text-sm font-medium text-gray-300">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#333333]">
                      {allBlogs?.length > 0 ? (
                        allBlogs.map((blog) => (
                          <tr key={blog._id}>
                            <td className="px-6 py-4 text-sm text-white max-w-xs">
                              <div className="truncate" title={blog.title}>
                                {blog.title}
                              </div>
                              <div className="text-xs text-gray-400 mt-1">
                                {blog.readTime || 5} min read
                              </div>
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-300">
                              <span className="inline-flex px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                                {blog.category}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-300">{blog.author || 'Unknown'}</td>
                            <td className="px-6 py-4 text-sm text-gray-300">
                              <div className="flex items-center gap-1">
                                <Eye className="w-4 h-4" />
                                {blog.views || 0}
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                blog.published !== false 
                                  ? 'bg-green-100 text-green-800' 
                                  : 'bg-yellow-100 text-yellow-800'
                              }`}>
                                {blog.published !== false ? 'Published' : 'Draft'}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => handleViewBlog(blog)}
                                  className="p-1 text-blue-400 hover:text-blue-300"
                                  title="View Blog"
                                >
                                  <Eye className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => handleEditBlog(blog)}
                                  className="p-1 text-yellow-400 hover:text-yellow-300"
                                  title="Edit Blog"
                                >
                                  <FileText className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => handleDeleteBlog(blog._id)}
                                  className="p-1 text-red-400 hover:text-red-300"
                                  title="Delete Blog"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={6} className="px-6 py-8 text-center text-gray-400">
                            <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
                            <p>No blogs found. Click "Add New Blog" to create your first blog post.</p>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'contacts' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold">Contact Management</h2>
                <button 
                  onClick={loadDashboardData}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
                >
                  Refresh
                </button>
              </div>

              <div className="bg-[#1E1E1E] rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-[#333333]">
                      <tr>
                        <th className="px-6 py-3 text-left text-sm font-medium text-gray-300">Name</th>
                        <th className="px-6 py-3 text-left text-sm font-medium text-gray-300">Email</th>
                        <th className="px-6 py-3 text-left text-sm font-medium text-gray-300">Subject</th>
                        <th className="px-6 py-3 text-left text-sm font-medium text-gray-300">Type</th>
                        <th className="px-6 py-3 text-left text-sm font-medium text-gray-300">Status</th>
                        <th className="px-6 py-3 text-left text-sm font-medium text-gray-300">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#333333]">
                      {contacts.map((contact) => (
                        <tr key={contact._id}>
                          <td className="px-6 py-4 text-sm text-white">{contact.name}</td>
                          <td className="px-6 py-4 text-sm text-gray-300">{contact.email}</td>
                          <td className="px-6 py-4 text-sm text-gray-300">
                            {contact.subject?.substring(0, 30) + (contact.subject?.length > 30 ? '...' : '')}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-300 capitalize">{contact.type}</td>
                          <td className="px-6 py-4">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              contact.status === 'new' 
                                ? 'bg-red-100 text-red-800'
                                : contact.status === 'read'
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-green-100 text-green-800'
                            }`}>
                              {contact.status}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              {contact.status === 'new' && (
                                <button
                                  onClick={() => handleUpdateContactStatus(contact._id, 'read')}
                                  className="p-1 text-blue-400 hover:text-blue-300"
                                  title="Mark as Read"
                                >
                                  <Eye className="w-4 h-4" />
                                </button>
                              )}
                              {contact.status !== 'responded' && (
                                <button
                                  onClick={() => handleUpdateContactStatus(contact._id, 'responded')}
                                  className="p-1 text-green-400 hover:text-green-300"
                                  title="Mark as Responded"
                                >
                                  <CheckCircle className="w-4 h-4" />
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Blog View Modal */}
      {showBlogModal && selectedBlog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-[#1E1E1E] rounded-lg max-w-4xl w-full max-h-[80vh] overflow-y-auto">
            <div className="sticky top-0 bg-[#1E1E1E] border-b border-[#333333] px-6 py-4 flex justify-between items-center">
              <h3 className="text-xl font-bold text-white">Blog Details</h3>
              <button
                onClick={() => {
                  setShowBlogModal(false);
                  setSelectedBlog(null);
                }}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <XCircle className="w-6 h-6" />
              </button>
            </div>
            
            <div className="p-6">
              {/* Blog Header */}
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-white mb-2">{selectedBlog.title}</h2>
                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400">
                  <span className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    {selectedBlog.author}
                  </span>
                  <span className="flex items-center gap-1">
                    <FileText className="w-4 h-4" />
                    {selectedBlog.category}
                  </span>
                  <span className="flex items-center gap-1">
                    <Eye className="w-4 h-4" />
                    {selectedBlog.views} views
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {selectedBlog.readTime} min read
                  </span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    selectedBlog.published !== false
                      ? 'bg-green-100 text-green-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {selectedBlog.published !== false ? 'Published' : 'Draft'}
                  </span>
                </div>
              </div>

              {/* Blog Excerpt */}
              <div className="mb-6">
                <h4 className="text-lg font-semibold text-gray-300 mb-2">Excerpt</h4>
                <p className="text-gray-400 leading-relaxed">{selectedBlog.excerpt}</p>
              </div>

              {/* Blog Tags */}
              {selectedBlog.tags && selectedBlog.tags.length > 0 && (
                <div className="mb-6">
                  <h4 className="text-lg font-semibold text-gray-300 mb-2">Tags</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedBlog.tags.map((tag, index) => (
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

              {/* Blog Content Preview */}
              <div className="mb-6">
                <h4 className="text-lg font-semibold text-gray-300 mb-2">Content Preview</h4>
                <div className="bg-[#333333] rounded-lg p-4 max-h-60 overflow-y-auto">
                  <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">
                    {selectedBlog.content ? selectedBlog.content.substring(0, 500) + '...' : 'No content available'}
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4 border-t border-[#333333]">
                <button
                  onClick={() => handleEditBlog(selectedBlog)}
                  className="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 rounded-lg transition-colors flex items-center gap-2"
                >
                  <FileText className="w-4 h-4" />
                  Edit Blog
                </button>
                <button
                  onClick={() => handleDeleteBlog(selectedBlog._id)}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors flex items-center gap-2"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete Blog
                </button>
                <button
                  onClick={() => {
                    setShowBlogModal(false);
                    setSelectedBlog(null);
                  }}
                  className="px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded-lg transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Blog Modal Placeholder */}
      {showAddBlog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-[#1E1E1E] rounded-lg max-w-2xl w-full">
            <div className="border-b border-[#333333] px-6 py-4 flex justify-between items-center">
              <h3 className="text-xl font-bold text-white">Add New Blog</h3>
              <button
                onClick={() => setShowAddBlog(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <XCircle className="w-6 h-6" />
              </button>
            </div>
            
            <div className="p-6 text-center">
              <FileText className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <h4 className="text-lg font-semibold text-white mb-2">Add New Blog Feature</h4>
              <p className="text-gray-400 mb-6">
                This feature is coming soon! You'll be able to create new blog posts with a rich text editor, 
                add images, set categories, and publish directly from this interface.
              </p>
              <button
                onClick={() => setShowAddBlog(false)}
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
              >
                Got it
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
