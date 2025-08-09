import axios from 'axios';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Add any auth tokens here if needed
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 429) {
      throw new Error('Too many requests. Please try again later.');
    }
    return Promise.reject(error);
  }
);

// Mock data for development
const mockBlogs = [
  {
    _id: '1',
    title: 'The Science Behind Digital Eye Strain: What You Need to Know',
    slug: 'science-behind-digital-eye-strain',
    excerpt: 'Explore the latest research on how screens affect our eyes and learn evidence-based strategies to protect your vision in the digital age.',
    content: 'Digital eye strain has become increasingly common...',
    author: 'Dr. Sarah Martinez',
    category: 'Research',
    featuredImage: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
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
    featuredImage: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
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
    featuredImage: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
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
    featuredImage: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
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
    featuredImage: 'https://images.unsplash.com/photo-1559757175-0b4b98ba6649?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
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
    featuredImage: 'https://images.unsplash.com/photo-1490818387583-1baba5e638af?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
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

// Blog API functions
export const blogAPI = {
  // Get all blogs with pagination and filtering
  getBlogs: async (params = {}) => {
    try {
      const response = await api.get('/blogs', { params });
      return response.data;
    } catch (error) {
      console.warn('API not available, using mock data');
      // Return mock data with pagination
      let filteredBlogs = [...mockBlogs];
      
      // Apply category filter
      if (params.category) {
        filteredBlogs = filteredBlogs.filter(blog => blog.category === params.category);
      }
      
      // Apply search filter
      if (params.search) {
        const searchTerm = params.search.toLowerCase();
        filteredBlogs = filteredBlogs.filter(blog => 
          blog.title.toLowerCase().includes(searchTerm) ||
          blog.excerpt.toLowerCase().includes(searchTerm) ||
          blog.category.toLowerCase().includes(searchTerm)
        );
      }
      
      // Apply sorting
      if (params.sort === 'popular') {
        filteredBlogs.sort((a, b) => b.views - a.views);
      } else if (params.sort === 'oldest') {
        filteredBlogs.sort((a, b) => new Date(a.publishedAt) - new Date(b.publishedAt));
      } else {
        // Default: latest
        filteredBlogs.sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));
      }
      
      // Apply pagination
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

  // Get featured blogs
  getFeaturedBlogs: async () => {
    try {
      const response = await api.get('/blogs/featured');
      return response.data;
    } catch (error) {
      console.warn('API not available, using mock data');
      return mockBlogs.filter(blog => blog.featured).slice(0, 3);
    }
  },

  // Get blog categories
  getCategories: async () => {
    try {
      const response = await api.get('/blogs/categories');
      return response.data;
    } catch (error) {
      console.warn('API not available, using mock data');
      return mockCategories;
    }
  },

  // Get single blog by slug
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

  // Like a blog post
  likeBlog: async (id) => {
    const response = await api.post(`/blogs/${id}/like`);
    return response.data;
  },
};

// Contact API functions
export const contactAPI = {
  // Submit contact form
  submitContact: async (contactData) => {
    const response = await api.post('/contact', contactData);
    return response.data;
  },

  // Get contact statistics (admin only)
  getContactStats: async () => {
    const response = await api.get('/contact/stats');
    return response.data;
  },
};

// User/Newsletter API functions
export const userAPI = {
  // Subscribe to newsletter
  subscribeNewsletter: async (email, name, interests) => {
    const response = await api.post('/users/newsletter/subscribe', {
      email,
      name,
      interests,
    });
    return response.data;
  },

  // Unsubscribe from newsletter
  unsubscribeNewsletter: async (email) => {
    const response = await api.post('/users/newsletter/unsubscribe', {
      email,
    });
    return response.data;
  },

  // Get newsletter statistics
  getNewsletterStats: async () => {
    const response = await api.get('/users/newsletter/stats');
    return response.data;
  },
};

// Convenience functions for direct use in components
export const getBlogs = blogAPI.getBlogs;
export const getFeaturedBlogs = blogAPI.getFeaturedBlogs;
export const getBlogBySlug = blogAPI.getBlogBySlug;
export const getBlogCategories = blogAPI.getCategories;
export const likeBlog = blogAPI.likeBlog;

export const submitContactForm = contactAPI.submitContact;
export const subscribeToNewsletter = userAPI.subscribeNewsletter;
export const unsubscribeFromNewsletter = userAPI.unsubscribeNewsletter;

export default api;
