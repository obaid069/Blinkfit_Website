import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Auth token management
const getToken = () => localStorage.getItem('authToken');
const setToken = (token) => localStorage.setItem('authToken', token);
const removeToken = () => localStorage.removeItem('authToken');
const getUser = () => {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};
const setUser = (user) => localStorage.setItem('user', JSON.stringify(user));
const removeUser = () => localStorage.removeItem('user');

api.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Unauthorized - clear auth data
      removeToken();
      removeUser();
      window.location.href = '/doctor/login';
    }
    if (error.response?.status === 429) {
      throw new Error('Too many requests. Please try again later.');
    }
    return Promise.reject(error);
  }
);

const mockBlogs = [
  {
    _id: '1',
    title: 'The Science Behind Digital Eye Strain: What You Need to Know',
    slug: 'science-behind-digital-eye-strain',
    excerpt: 'Explore the latest research on how screens affect our eyes and learn evidence-based strategies to protect your vision in the digital age.',
    content: 'Digital eye strain has become increasingly common...',
    author: 'Dr. Sarah Martinez',
    category: 'Research',
    featuredImage: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1950&q=80',
    publishedAt: '2024-01-15T10:00:00Z',
    readTime: 8,
    views: 1245,
    featured: true
  },
  {
    _id: '2',
    title: 'Top 10 Eye Exercises to Combat Screen Fatigue',
    slug: 'top-10-eye-exercises-screen-fatigue',
    excerpt: 'Simple yet effective exercises you can do throughout your workday to keep your eyes healthy and reduce strain from prolonged screen use.',
    content: 'Eye exercises are crucial for maintaining...',
    author: 'Dr. Michael Chen',
    category: 'Tips & Tricks',
    featuredImage: 'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
    publishedAt: '2024-01-10T14:30:00Z',
    readTime: 6,
    views: 892,
    featured: true
  },
  {
    _id: '3',
    title: 'How Blue Light Affects Your Sleep and Eye Health',
    slug: 'blue-light-effects-sleep-eye-health',
    excerpt: 'Understanding the impact of blue light exposure from devices and practical tips for minimizing its effects on your circadian rhythm and vision.',
    content: 'Blue light exposure has been linked to...',
    author: 'Dr. Emily Rodriguez',
    category: 'Health',
    featuredImage: 'https://images.unsplash.com/photo-1527613426441-4da17471b66d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1952&q=80',
    publishedAt: '2024-01-05T09:15:00Z',
    readTime: 7,
    views: 1567,
    featured: true
  },
  {
    _id: '4',
    title: 'Creating the Perfect Ergonomic Workstation for Eye Health',
    slug: 'ergonomic-workstation-eye-health',
    excerpt: 'Learn how to set up your workspace to minimize eye strain and improve overall comfort during long work sessions.',
    content: 'Proper ergonomics play a crucial role...',
    author: 'Dr. James Wilson',
    category: 'Workplace Health',
    featuredImage: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
    publishedAt: '2023-12-28T16:20:00Z',
    readTime: 9,
    views: 743,
    featured: false
  },
  {
    _id: '5',
    title: 'Understanding Dry Eyes in the Digital Age',
    slug: 'understanding-dry-eyes-digital-age',
    excerpt: 'Why dry eyes are becoming more common and what you can do to maintain proper eye moisture throughout your day.',
    content: 'Dry eye syndrome is increasingly common...',
    author: 'Dr. Lisa Zhang',
    category: 'Health',
    featuredImage: 'https://images.unsplash.com/photo-1559757175-0eb30cd8c063?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1887&q=80',
    publishedAt: '2023-12-20T11:45:00Z',
    readTime: 5,
    views: 634,
    featured: false
  },
  {
    _id: '6',
    title: 'The Role of Nutrition in Eye Health',
    slug: 'role-of-nutrition-eye-health',
    excerpt: 'Discover which foods can help protect and improve your vision, and learn about the nutrients your eyes need most.',
    content: 'Proper nutrition is essential for maintaining...',
    author: 'Dr. Amanda Foster',
    category: 'Nutrition',
    featuredImage: 'https://images.unsplash.com/photo-1622597467836-f3285f2131b8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
    publishedAt: '2023-12-15T13:30:00Z',
    readTime: 6,
    views: 456,
    featured: false
  }
];

const mockCategories = [
  { name: 'Research', count: 3 },
  { name: 'Tips & Tricks', count: 5 },
  { name: 'Health', count: 4 },
  { name: 'Workplace Health', count: 2 },
  { name: 'Nutrition', count: 3 }
];

export const blogAPI = {

  getBlogs: async (params = {}) => {
    try {
      const response = await api.get('/blogs', { params });
      return response.data;
    } catch (error) {
      console.warn('API not available, using mock data');

      let filteredBlogs = [...mockBlogs];

      if (params.category) {
        filteredBlogs = filteredBlogs.filter(blog => blog.category === params.category);
      }

      if (params.search) {
        const searchTerm = params.search.toLowerCase();
        filteredBlogs = filteredBlogs.filter(blog => 
          blog.title.toLowerCase().includes(searchTerm) ||
          blog.excerpt.toLowerCase().includes(searchTerm) ||
          blog.category.toLowerCase().includes(searchTerm)
        );
      }

      if (params.sort === 'popular') {
        filteredBlogs.sort((a, b) => b.views - a.views);
      } else if (params.sort === 'oldest') {
        filteredBlogs.sort((a, b) => new Date(a.publishedAt) - new Date(b.publishedAt));
      } else {

        filteredBlogs.sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));
      }

      const page = params.page || 1;
      const limit = params.limit || 9;
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const paginatedBlogs = filteredBlogs.slice(startIndex, endIndex);

      return {
        blogs: paginatedBlogs,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(filteredBlogs.length / limit),
          totalBlogs: filteredBlogs.length,
          hasNext: endIndex < filteredBlogs.length,
          hasPrev: page > 1
        }
      };
    }
  },

  getFeaturedBlogs: async () => {
    try {
      const response = await api.get('/blogs/featured');
      return response.data;
    } catch (error) {
      console.warn('API not available, using mock data');
      return mockBlogs.filter(blog => blog.featured).slice(0, 3);
    }
  },

  getCategories: async () => {
    try {
      const response = await api.get('/blogs/categories');
      return response.data;
    } catch (error) {
      console.warn('API not available, using mock data');
      return mockCategories;
    }
  },

  getBlogBySlug: async (slug) => {
    try {
      const response = await api.get(`/blogs/${slug}`);
      return response.data;
    } catch (error) {
      console.warn('API not available, using mock data');
      const blog = mockBlogs.find(b => b.slug === slug);
      if (!blog) {
        throw new Error('Blog not found');
      }
      return blog;
    }
  },

  likeBlog: async (id) => {
    const response = await api.post(`/blogs/${id}/like`);
    return response.data;
  },
};

export const contactAPI = {

  submitContact: async (contactData) => {
    const response = await api.post('/contact', contactData);
    return response.data;
  },
  
  // Admin contact stats
  getContactStats: async () => {
    const response = await api.get('/contact/admin/stats');
    return response.data;
  },

  getContacts: async (params = {}) => {
    const response = await api.get('/contact/admin/contacts', { params });
    return response.data;
  },

  updateContactStatus: async (contactId, status) => {
    const response = await api.patch(`/contact/admin/contacts/${contactId}/status`, { status });
    return response.data;
  },
};

export const userAPI = {

  subscribeNewsletter: async (email, name, interests) => {
    const response = await api.post('/users/newsletter/subscribe', {
      email,
      name,
      interests,
    });
    return response.data;
  },

  unsubscribeNewsletter: async (email) => {
    const response = await api.post('/users/newsletter/unsubscribe', {
      email,
    });
    return response.data;
  },

  getNewsletterStats: async () => {
    const response = await api.get('/users/newsletter/stats');
    return response.data;
  },
};

export const getBlogs = blogAPI.getBlogs;
export const getFeaturedBlogs = blogAPI.getFeaturedBlogs;
export const getBlogBySlug = blogAPI.getBlogBySlug;
export const getBlogCategories = blogAPI.getCategories;
export const likeBlog = blogAPI.likeBlog;

export const submitContactForm = contactAPI.submitContact;
export const subscribeToNewsletter = userAPI.subscribeNewsletter;
export const unsubscribeFromNewsletter = userAPI.unsubscribeNewsletter;

// ============= AUTHENTICATION API =============
export const authAPI = {
  // Login for doctor and admin
  login: async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    if (response.data.success) {
      setToken(response.data.data.token);
      setUser(response.data.data.user);
    }
    return response.data;
  },

  // Admin login
  adminLogin: async (email, password) => {
    const response = await api.post('/auth/admin/login', { email, password });
    if (response.data.success) {
      setToken(response.data.data.token);
      setUser(response.data.data.admin);
    }
    return response.data;
  },

  // Register doctor
  registerDoctor: async (userData) => {
    const response = await api.post('/auth/register/doctor', userData);
    return response.data;
  },

  // Get current user profile
  getProfile: async () => {
    const response = await api.get('/auth/profile');
    return response.data;
  },

  // Update profile
  updateProfile: async (userData) => {
    const response = await api.put('/auth/profile', userData);
    if (response.data.success) {
      setUser(response.data.data.user);
    }
    return response.data;
  },


  // Logout
  logout: () => {
    removeToken();
    removeUser();
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    return !!getToken();
  },

  // Get current user
  getCurrentUser: () => {
    return getUser();
  },
};

// ============= ADMIN MANAGEMENT API =============
export const adminAPI = {
  // Doctor management
  getDoctors: async (params = {}) => {
    const response = await api.get('/auth/admin/doctors', { params });
    return response.data;
  },

  verifyDoctor: async (doctorId) => {
    const response = await api.put(`/auth/admin/doctors/${doctorId}/verify`);
    return response.data;
  },

  unverifyDoctor: async (doctorId) => {
    const response = await api.put(`/auth/admin/doctors/${doctorId}/unverify`);
    return response.data;
  },

  deleteDoctor: async (doctorId) => {
    const response = await api.delete(`/auth/admin/doctors/${doctorId}`);
    return response.data;
  },

  // Admin blog management (all blogs)
  getAdminBlogs: async (params = {}) => {
    const response = await api.get('/blogs/admin/manage', { params });
    return response.data;
  },

  getAdminBlogAnalytics: async () => {
    const response = await api.get('/blogs/admin/analytics');
    return response.data;
  },

  adminCreateBlog: async (blogData) => {
    const response = await api.post('/blogs/admin/manage', blogData);
    return response.data;
  },

  adminUpdateBlog: async (id, blogData) => {
    const response = await api.put(`/blogs/admin/manage/${id}`, blogData);
    return response.data;
  },

  adminDeleteBlog: async (id) => {
    const response = await api.delete(`/blogs/admin/manage/${id}`);
    return response.data;
  },
};

// ============= BLOG MANAGEMENT API =============
export const blogManagementAPI = {
  // Get blogs for management (doctor sees own)
  getManageBlogs: async (params = {}) => {
    const response = await api.get('/blogs/manage', { params });
    return response.data;
  },

  // Get single blog for editing
  getBlogForEdit: async (id) => {
    const response = await api.get(`/blogs/manage/${id}`);
    return response.data;
  },

  // Create new blog
  createBlog: async (blogData) => {
    const response = await api.post('/blogs/manage', blogData);
    return response.data;
  },

  // Update blog
  updateBlog: async (id, blogData) => {
    const response = await api.put(`/blogs/manage/${id}`, blogData);
    return response.data;
  },

  // Delete blog
  deleteBlog: async (id) => {
    const response = await api.delete(`/blogs/manage/${id}`);
    return response.data;
  },

};

// Export auth functions
export const {
  login,
  adminLogin,
  registerDoctor,
  getProfile,
  updateProfile,
  logout,
  isAuthenticated,
  getCurrentUser,
} = authAPI;

// Export contact API functions
export const {
  getContactStats,
  getContacts,
  updateContactStatus,
} = contactAPI;

// Export admin management functions
export const {
  getDoctors,
  verifyDoctor,
  unverifyDoctor,
  deleteDoctor,
  getAdminBlogs,
  getAdminBlogAnalytics,
  adminCreateBlog,
  adminUpdateBlog,
  adminDeleteBlog,
} = adminAPI;

// Export blog management functions
export const {
  getManageBlogs,
  getBlogForEdit,
  createBlog,
  updateBlog,
  deleteBlog,
} = blogManagementAPI;

export default api;
