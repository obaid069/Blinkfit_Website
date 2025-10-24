import axios from 'axios';

const runtimeOrigin = typeof window !== 'undefined' ? window.location.origin : '';
const apiBaseURL = import.meta.env.VITE_API_URL || (runtimeOrigin ? `${runtimeOrigin}/api` : '/api');

const api = axios.create({
  baseURL: apiBaseURL,
  timeout: 30000,
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
    
    // If the data is FormData, don't set Content-Type header
    // The browser will set it automatically with the boundary
    if (config.data instanceof FormData) {
      delete config.headers['Content-Type'];
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


export const blogAPI = {

  getBlogs: async (params = {}) => {
    const response = await api.get('/blogs', { params });
    return response.data;
  },

  getFeaturedBlogs: async () => {
    const response = await api.get('/blogs/featured');
    return response.data;
  },

  getCategories: async () => {
    const response = await api.get('/blogs/categories');
    return response.data;
  },

  getBlogBySlug: async (slug) => {
    const response = await api.get(`/blogs/${slug}`);
    return response.data;
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

  // Preview blog (doctor only, secure)
  previewBlog: async (id) => {
    const response = await api.get(`/blogs/preview/${id}`);
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
  previewBlog,
  createBlog,
  updateBlog,
  deleteBlog,
} = blogManagementAPI;

export default api;
