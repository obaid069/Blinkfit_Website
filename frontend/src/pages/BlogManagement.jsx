import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { 
  isAuthenticated, 
  getCurrentUser,
  adminCreateBlog,
  adminUpdateBlog,
  getAdminBlogs,
  createBlog,
  updateBlog,
  getBlogForEdit
} from '../utils/api';
import { 
  FileText,
  Save,
  ArrowLeft,
  Eye,
  Upload,
  Tag,
  Clock,
  Globe,
  AlertCircle,
  Image,
  X
} from 'lucide-react';

const BlogManagement = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const params = useParams();
  const blogId = params.id; // Blog ID from URL params
  
  // State for blog being edited
  const [editBlog, setEditBlog] = useState(location.state?.blog || null);
  const [blogLoading, setBlogLoading] = useState(false);
  
  // Get current user for role-based functionality
  const [currentUser, setCurrentUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isDoctor, setIsDoctor] = useState(false);
  
  // Authentication check
  useEffect(() => {
    if (!isAuthenticated()) {
      navigate('/doctor/login');
      return;
    }

    const user = getCurrentUser();
    if (!user || (user.role !== 'admin' && user.role !== 'doctor')) {
      navigate('/doctor/login');
      return;
    }
    
    setCurrentUser(user);
    setIsAdmin(user.role === 'admin');
    setIsDoctor(user.role === 'doctor');
  }, [navigate]);

  // Load blog data for editing
  useEffect(() => {
    if (blogId && !editBlog && currentUser) {
      loadBlogForEdit();
    }
  }, [blogId, currentUser]); // Removed editBlog from dependencies to prevent infinite loop

  const loadBlogForEdit = async () => {
    setBlogLoading(true);
    try {
      console.log('🔄 Loading blog for edit:', blogId);
      const response = await getBlogForEdit(blogId);
      console.log('✅ Blog loaded for edit:', response);
      
      if (response && response.data) {
        const blog = response.data;
        setEditBlog(blog);
        
        // Update form data
        setFormData({
          title: blog.title || '',
          excerpt: blog.excerpt || '',
          content: blog.content || '',
          category: blog.category || 'Eye Health',
          tags: Array.isArray(blog.tags) ? blog.tags.join(', ') : '',
          featuredImage: blog.featuredImage || '',
          readTime: blog.readTime || 5,
          published: blog.published ?? true,
          metaTitle: blog.metaTitle || '',
          metaDescription: blog.metaDescription || ''
        });
        
        // Set image preview
        if (blog.featuredImage && blog.featuredImage !== '/api/placeholder/600/400') {
          setImagePreview(blog.featuredImage);
        }
      }
    } catch (error) {
      console.error('❌ Error loading blog for edit:', error);
      alert('Failed to load blog data. Please try again.');
      navigate('/doctor/dashboard');
    } finally {
      setBlogLoading(false);
    }
  };

  // Form state
  const [formData, setFormData] = useState({
    title: editBlog?.title ?? '',
    excerpt: editBlog?.excerpt ?? '',
    content: editBlog?.content ?? '',
    category: editBlog?.category ?? 'Eye Health',
    tags: editBlog?.tags?.join(', ') ?? '',
    featuredImage: editBlog?.featuredImage ?? '',
    readTime: editBlog?.readTime ?? 5,
    published: editBlog?.published ?? true,
    metaTitle: editBlog?.metaTitle ?? '',
    metaDescription: editBlog?.metaDescription ?? ''
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [previewMode, setPreviewMode] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(editBlog?.featuredImage ?? null);
  const fileInputRef = React.useRef(null);

  const categories = [
    'Eye Health',
    'Technology', 
    'Lifestyle',
    'Tips & Tricks',
    'App Features'
  ];

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please select a valid image file');
        return;
      }
      
      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        alert('Image size should be less than 5MB');
        return;
      }
      
      setImageFile(file);
      
      // Create preview URL
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
      
      // Clear the URL input when uploading file
      setFormData(prev => ({ ...prev, featuredImage: '' }));
    }
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview(null);
    setFormData(prev => ({ ...prev, featuredImage: '' }));
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleImageUrlChange = (e) => {
    const url = e.target.value;
    setFormData(prev => ({ ...prev, featuredImage: url }));
    if (url) {
      setImagePreview(url);
      setImageFile(null); // Clear file when using URL
    } else {
      setImagePreview(null);
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    } else if (formData.title.length < 5) {
      newErrors.title = 'Title must be at least 5 characters';
    } else if (formData.title.length > 200) {
      newErrors.title = 'Title cannot exceed 200 characters';
    }

    if (!formData.excerpt.trim()) {
      newErrors.excerpt = 'Excerpt is required';
    } else if (formData.excerpt.length < 10) {
      newErrors.excerpt = 'Excerpt must be at least 10 characters';
    } else if (formData.excerpt.length > 300) {
      newErrors.excerpt = 'Excerpt cannot exceed 300 characters';
    }

    if (!formData.content.trim()) {
      newErrors.content = 'Content is required';
    } else if (formData.content.length < 50) {
      newErrors.content = 'Content must be at least 50 characters';
    }

    if (!formData.category) {
      newErrors.category = 'Category is required';
    }

    if (formData.readTime < 1 || formData.readTime > 60) {
      newErrors.readTime = 'Read time must be between 1 and 60 minutes';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      let blogData;
      
      // Check if we have a file to upload
      if (imageFile) {
        // Create FormData for file upload
        blogData = new FormData();
        blogData.append('title', formData.title || '');
        blogData.append('excerpt', formData.excerpt || '');
        blogData.append('content', formData.content || '');
        blogData.append('category', formData.category || 'Eye Health');
        blogData.append('published', String(formData.published));
        blogData.append('readTime', String(formData.readTime || 5));
        blogData.append('metaTitle', formData.metaTitle || '');
        blogData.append('metaDescription', formData.metaDescription || '');
        
        // Handle tags
        const tags = (formData.tags || '').split(',').map(tag => tag.trim()).filter(tag => tag);
        blogData.append('tags', tags.join(','));
        
        // Append the image file
        blogData.append('featuredImage', imageFile);
      } else {
        // Regular JSON data
        blogData = {
          ...formData,
          tags: (formData.tags || '').split(',').map(tag => tag.trim()).filter(tag => tag)
        };
      }

      if (editBlog) {
        // Update existing blog
        if (isAdmin) {
          await adminUpdateBlog(editBlog._id, blogData);
        } else {
          await updateBlog(editBlog._id, blogData);
        }
        alert('Blog updated successfully!');
      } else {
        // Create new blog
        if (isAdmin) {
          await adminCreateBlog(blogData);
        } else {
          await createBlog(blogData);
        }
        alert('Blog created successfully!');
      }

      // Navigate back to appropriate dashboard
      const dashboardPath = isAdmin ? '/admin/dashboard' : '/doctor/dashboard';
      navigate(dashboardPath, { state: { activeTab: 'blogs' } });
    } catch (error) {
      console.error('Error saving blog:', error);
      alert(error.response?.data?.message || 'Error saving blog. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    if (window.confirm('Are you sure you want to go back? Any unsaved changes will be lost.')) {
      const dashboardPath = isAdmin ? '/admin/dashboard' : '/doctor/dashboard';
      navigate(dashboardPath, { state: { activeTab: 'blogs' } });
    }
  };

  return (
    <div className="min-h-screen bg-[#121212] text-white">
      {/* Header */}
      <header className="bg-[#1E1E1E] border-b border-[#333333] px-6 py-4">
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
              <h1 className="text-2xl font-bold text-blue-400">
                {editBlog ? 'Edit Blog' : 'Add New Blog'}
              </h1>
              <p className="text-gray-400">
                {editBlog ? `Editing: ${editBlog.title}` : 'Create a new blog post'}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setPreviewMode(!previewMode)}
              className="flex items-center gap-2 px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded-lg transition-colors"
            >
              <Eye className="w-4 h-4" />
              {previewMode ? 'Edit Mode' : 'Preview'}
            </button>
            
            <button
              type="submit"
              form="blog-form"
              disabled={loading}
              className="flex items-center gap-2 px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 disabled:cursor-not-allowed rounded-lg transition-colors"
            >
              <Save className="w-4 h-4" />
              {loading ? 'Saving...' : 'Save Blog'}
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto p-6">
        {blogLoading ? (
          // Loading state
          <div className="flex justify-center items-center py-12">
            <div className="flex flex-col items-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
              <p className="text-gray-400">Loading blog data...</p>
            </div>
          </div>
        ) : previewMode ? (
          // Preview Mode
          <div className="bg-[#1E1E1E] rounded-lg p-8">
            <div className="max-w-4xl mx-auto">
              {/* Blog Header */}
              <div className="mb-8">
                {imagePreview && (
                  <img 
                    src={imagePreview} 
                    alt={formData.title}
                    className="w-full h-64 object-cover rounded-lg mb-6"
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                )}
                
                <h1 className="text-4xl font-bold text-white mb-4">{formData.title || 'Blog Title'}</h1>
                
                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400 mb-6">
                  <span className="flex items-center gap-1">
                    <FileText className="w-4 h-4" />
                    {formData.category}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {formData.readTime} min read
                  </span>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    formData.published 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {formData.published ? 'Published' : 'Draft'}
                  </span>
                </div>

                {formData.excerpt && (
                  <p className="text-xl text-gray-300 leading-relaxed mb-6 font-light">
                    {formData.excerpt}
                  </p>
                )}

                {formData.tags && (
                  <div className="flex flex-wrap gap-2 mb-6">
                    {formData.tags.split(',').map((tag, index) => (
                      tag.trim() && (
                        <span
                          key={index}
                          className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
                        >
                          #{tag.trim()}
                        </span>
                      )
                    ))}
                  </div>
                )}
              </div>

              {/* Blog Content */}
              <div className="prose prose-lg prose-invert max-w-none">
                <div className="text-gray-300 leading-relaxed whitespace-pre-wrap">
                  {formData.content || 'Blog content will appear here...'}
                </div>
              </div>
            </div>
          </div>
        ) : (
          // Edit Mode
          <form id="blog-form" onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Main Content */}
              <div className="lg:col-span-2 space-y-6">
                {/* Title */}
                <div className="bg-[#1E1E1E] rounded-lg p-6">
                  <label htmlFor="title" className="block text-sm font-medium text-gray-300 mb-2">
                    Blog Title <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-[#333333] border border-[#444444] rounded-lg text-white placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
                    placeholder="Enter an engaging blog title..."
                    maxLength={200}
                  />
                  {errors.title && (
                    <p className="text-red-400 text-sm mt-1 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.title}
                    </p>
                  )}
                  <p className="text-gray-500 text-sm mt-1">{formData.title.length}/200 characters</p>
                </div>

                {/* Excerpt */}
                <div className="bg-[#1E1E1E] rounded-lg p-6">
                  <label htmlFor="excerpt" className="block text-sm font-medium text-gray-300 mb-2">
                    Blog Excerpt <span className="text-red-400">*</span>
                  </label>
                  <textarea
                    id="excerpt"
                    name="excerpt"
                    value={formData.excerpt}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-4 py-3 bg-[#333333] border border-[#444444] rounded-lg text-white placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none resize-none"
                    placeholder="Write a compelling excerpt that summarizes your blog..."
                    maxLength={300}
                  />
                  {errors.excerpt && (
                    <p className="text-red-400 text-sm mt-1 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.excerpt}
                    </p>
                  )}
                  <p className="text-gray-500 text-sm mt-1">{formData.excerpt.length}/300 characters</p>
                </div>

                {/* Content */}
                <div className="bg-[#1E1E1E] rounded-lg p-6">
                  <label htmlFor="content" className="block text-sm font-medium text-gray-300 mb-2">
                    Blog Content <span className="text-red-400">*</span>
                  </label>
                  <textarea
                    id="content"
                    name="content"
                    value={formData.content}
                    onChange={handleInputChange}
                    rows={20}
                    className="w-full px-4 py-3 bg-[#333333] border border-[#444444] rounded-lg text-white placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none resize-y"
                    placeholder="Write your blog content here... You can use Markdown formatting."
                  />
                  {errors.content && (
                    <p className="text-red-400 text-sm mt-1 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.content}
                    </p>
                  )}
                  <p className="text-gray-500 text-sm mt-1">{formData.content.length} characters</p>
                </div>
              </div>

              {/* Sidebar Settings */}
              <div className="space-y-6">
                {/* Publish Settings */}
                <div className="bg-[#1E1E1E] rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <Globe className="w-5 h-5" />
                    Publish Settings
                  </h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="published" className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          id="published"
                          name="published"
                          checked={formData.published}
                          onChange={handleInputChange}
                          className="w-4 h-4 text-blue-600 bg-[#333333] border-[#444444] rounded focus:ring-blue-500"
                        />
                        <span className="text-gray-300">Publish immediately</span>
                      </label>
                    </div>

                    <div>
                      <label htmlFor="category" className="block text-sm font-medium text-gray-300 mb-2">
                        Category <span className="text-red-400">*</span>
                      </label>
                      <select
                        id="category"
                        name="category"
                        value={formData.category}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 bg-[#333333] border border-[#444444] rounded-lg text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
                      >
                        {categories.map(cat => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                      {errors.category && (
                        <p className="text-red-400 text-sm mt-1">{errors.category}</p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="readTime" className="block text-sm font-medium text-gray-300 mb-2">
                        Read Time (minutes)
                      </label>
                      <input
                        type="number"
                        id="readTime"
                        name="readTime"
                        value={formData.readTime}
                        onChange={handleInputChange}
                        min={1}
                        max={60}
                        className="w-full px-3 py-2 bg-[#333333] border border-[#444444] rounded-lg text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
                      />
                      {errors.readTime && (
                        <p className="text-red-400 text-sm mt-1">{errors.readTime}</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Tags */}
                <div className="bg-[#1E1E1E] rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <Tag className="w-5 h-5" />
                    Tags & SEO
                  </h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="tags" className="block text-sm font-medium text-gray-300 mb-2">
                        Tags (comma separated)
                      </label>
                      <input
                        type="text"
                        id="tags"
                        name="tags"
                        value={formData.tags}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 bg-[#333333] border border-[#444444] rounded-lg text-white placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
                        placeholder="eye health, tips, wellness"
                      />
                    </div>

                    <div>
                      <label htmlFor="metaTitle" className="block text-sm font-medium text-gray-300 mb-2">
                        Meta Title (for SEO)
                      </label>
                      <input
                        type="text"
                        id="metaTitle"
                        name="metaTitle"
                        value={formData.metaTitle}
                        onChange={handleInputChange}
                        maxLength={60}
                        className="w-full px-3 py-2 bg-[#333333] border border-[#444444] rounded-lg text-white placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
                        placeholder="SEO optimized title..."
                      />
                      <p className="text-gray-500 text-sm mt-1">{formData.metaTitle.length}/60 characters</p>
                    </div>

                    <div>
                      <label htmlFor="metaDescription" className="block text-sm font-medium text-gray-300 mb-2">
                        Meta Description (for SEO)
                      </label>
                      <textarea
                        id="metaDescription"
                        name="metaDescription"
                        value={formData.metaDescription}
                        onChange={handleInputChange}
                        rows={3}
                        maxLength={160}
                        className="w-full px-3 py-2 bg-[#333333] border border-[#444444] rounded-lg text-white placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none resize-none"
                        placeholder="SEO description for search engines..."
                      />
                      <p className="text-gray-500 text-sm mt-1">{formData.metaDescription.length}/160 characters</p>
                    </div>
                  </div>
                </div>

                {/* Featured Image */}
                <div className="bg-[#1E1E1E] rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <Image className="w-5 h-5" />
                    Featured Image
                  </h3>
                  
                  <div className="space-y-4">
                    {/* Image Upload Section */}
                    {!imagePreview ? (
                      <div className="space-y-3">
                        {/* File Upload */}
                        <div>
                          <div 
                            className="border-2 border-dashed border-gray-600 rounded-lg p-6 text-center hover:border-gray-500 transition-colors cursor-pointer"
                            onClick={() => fileInputRef.current?.click()}
                          >
                            <Upload className="w-8 h-8 mx-auto mb-3 text-gray-400" />
                            <p className="text-gray-400 mb-1">Click to upload an image</p>
                            <p className="text-sm text-gray-500">PNG, JPG, GIF up to 5MB</p>
                            <input
                              ref={fileInputRef}
                              type="file"
                              accept="image/*"
                              onChange={handleImageUpload}
                              className="hidden"
                            />
                          </div>
                        </div>
                        
                        {/* Divider */}
                        <div className="flex items-center gap-3">
                          <div className="flex-1 h-px bg-gray-600"></div>
                          <span className="text-gray-400 text-sm">or</span>
                          <div className="flex-1 h-px bg-gray-600"></div>
                        </div>
                        
                        {/* URL Input */}
                        <div>
                          <label htmlFor="featuredImage" className="block text-sm font-medium text-gray-300 mb-2">
                            Image URL
                          </label>
                          <input
                            type="url"
                            id="featuredImage"
                            name="featuredImage"
                            value={formData.featuredImage}
                            onChange={handleImageUrlChange}
                            className="w-full px-3 py-2 bg-[#333333] border border-[#444444] rounded-lg text-white placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
                            placeholder="https://example.com/image.jpg"
                          />
                        </div>
                      </div>
                    ) : (
                      /* Image Preview */
                      <div className="relative">
                        <img 
                          src={imagePreview} 
                          alt="Featured image preview" 
                          className="w-full h-40 object-cover rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={handleRemoveImage}
                          className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white rounded-full p-1 transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                        <div className="mt-3 flex gap-2">
                          <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="flex-1 text-blue-400 hover:text-blue-300 text-sm underline text-center py-2"
                          >
                            Change Image
                          </button>
                          <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            className="hidden"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-[#1E1E1E] rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">Quick Actions</h3>
                  
                  <div className="space-y-3">
                    <button
                      type="submit"
                      form="blog-form"
                      disabled={loading}
                      className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 disabled:cursor-not-allowed rounded-lg transition-colors"
                    >
                      <Save className="w-4 h-4" />
                      {loading ? 'Saving...' : `${editBlog ? 'Update' : 'Create'} Blog`}
                    </button>
                    
                    <button
                      type="button"
                      onClick={handleBack}
                      className="w-full px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded-lg transition-colors"
                    >
                      Cancel & Go Back
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default BlogManagement;
