import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Search, 
  Filter, 
  Clock, 
  Eye, 
  ArrowRight,
  ChevronDown,
  Calendar,
  User
} from 'lucide-react';
import { getBlogs, getBlogCategories } from '../utils/api';

const Blog = () => {
  const [blogs, setBlogs] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [sortBy, setSortBy] = useState('latest');
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({});
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchBlogs();
    fetchCategories();
  }, [currentPage, selectedCategory, sortBy, searchTerm]);

  const fetchBlogs = async () => {
    setLoading(true);
    try {
      const params = {
        page: currentPage,
        limit: 9,
        sort: sortBy
      };

      if (selectedCategory) {
        params.category = selectedCategory;
      }

      if (searchTerm) {
        params.search = searchTerm;
      }

      const response = await getBlogs(params);
      console.log('API Response:', response); 
      setBlogs(response.data?.blogs || response.blogs || response);
      setPagination(response.data?.pagination || response.pagination || {});
    } catch (error) {
      console.error('Error fetching blogs:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await getBlogCategories();
      console.log('Categories Response:', response); 
      setCategories(response.data?.data || response.data || response);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchBlogs();
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    setCurrentPage(1);
  };

  const handleSortChange = (sort) => {
    setSortBy(sort);
    setCurrentPage(1);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const sortOptions = [
    { value: 'latest', label: 'Latest Posts' },
    { value: 'popular', label: 'Most Popular' },
    { value: 'oldest', label: 'Oldest Posts' }
  ];

  return (
    <div className="pt-16 bg-[#121212] min-h-screen">
      {}
      <section className="bg-gradient-to-r from-[#1E1E1E] to-[#121212] py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-4xl md:text-5xl font-bold text-white mb-6"
            >
              Eye Health <span className="text-[#4CAF50]">Blog</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-xl text-[#B3B3B3] max-w-3xl mx-auto"
            >
              Expert insights, tips, and research on digital eye health. 
              Stay informed about the latest developments in eye care and technology.
            </motion.p>
          </div>
        </div>
      </section>

      {}
      <section className="py-8 bg-[#1E1E1E] border-b border-[#333333]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-6 items-center justify-between">
            {}
            <form onSubmit={handleSearch} className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search articles..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-[#333333] bg-[#121212] text-white rounded-lg focus:ring-2 focus:ring-[#4CAF50] focus:border-transparent"
                />
              </div>
            </form>

            {}
            <div className="flex flex-col sm:flex-row gap-4">
              {}
              <div className="relative">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="inline-flex items-center px-4 py-3 text-sm font-medium text-white bg-[#121212] border border-[#333333] rounded-lg hover:bg-[#333333] focus:outline-none focus:ring-2 focus:ring-[#4CAF50]"
                >
                  <Filter className="w-4 h-4 mr-2" />
                  {selectedCategory || 'All Categories'}
                  <ChevronDown className="w-4 h-4 ml-2" />
                </button>

                {showFilters && (
                  <div className="absolute right-0 z-10 mt-2 w-56 bg-[#1E1E1E] border border-[#333333] rounded-lg shadow-lg">
                    <div className="py-1">
                      <button
                        onClick={() => {
                          handleCategoryChange('');
                          setShowFilters(false);
                        }}
                        className="block w-full px-4 py-2 text-left text-sm text-white hover:bg-[#333333]"
                      >
                        All Categories
                      </button>
                      {categories.map((category) => (
                        <button
                          key={category.name}
                          onClick={() => {
                            handleCategoryChange(category.name);
                            setShowFilters(false);
                          }}
                          className="block w-full px-4 py-2 text-left text-sm text-white hover:bg-[#333333]"
                        >
                          {category.name} ({category.count})
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {}
              <select
                value={sortBy}
                onChange={(e) => handleSortChange(e.target.value)}
                className="px-4 py-3 text-sm font-medium text-white bg-[#121212] border border-[#333333] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4CAF50]"
              >
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </section>

      {}
      <section className="py-16 bg-[#121212]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(9)].map((_, index) => (
                <div key={index} className="bg-[#1E1E1E] border border-[#333333] rounded-lg shadow-sm overflow-hidden animate-pulse">
                  <div className="w-full h-48 bg-[#333333]"></div>
                  <div className="p-6">
                    <div className="h-4 bg-[#333333] rounded mb-2"></div>
                    <div className="h-6 bg-[#333333] rounded mb-3"></div>
                    <div className="h-4 bg-[#333333] rounded mb-4"></div>
                    <div className="h-4 bg-[#333333] rounded w-20"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : blogs.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {blogs.map((blog, index) => (
                  <motion.article
                    key={blog._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    className="bg-[#1E1E1E] border border-[#333333] rounded-lg shadow-sm overflow-hidden hover:shadow-lg transition-shadow duration-300 group"
                  >
                    <div className="relative">
                      <img 
                        src={blog.featuredImage} 
                        alt={blog.title}
                        className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute top-4 left-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#4CAF50] text-white">
                          {blog.category}
                        </span>
                      </div>
                    </div>

                    <div className="p-6">
                      <div className="flex items-center text-sm text-[#B3B3B3] mb-3">
                        <Calendar className="w-4 h-4 mr-1" />
                        <span className="mr-4">{formatDate(blog.publishedAt)}</span>
                        <Clock className="w-4 h-4 mr-1" />
                        <span className="mr-4">{blog.readTime} min read</span>
                        <Eye className="w-4 h-4 mr-1" />
                        <span>{blog.views}</span>
                      </div>

                      <h3 className="text-xl font-semibold text-white mb-3 line-clamp-2 group-hover:text-[#4CAF50] transition-colors duration-200">
                        {blog.title}
                      </h3>

                      <p className="text-[#B3B3B3] mb-4 line-clamp-3">
                        {blog.excerpt}
                      </p>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center text-sm text-[#B3B3B3]">
                          <User className="w-4 h-4 mr-1" />
                          <span>{blog.author}</span>
                        </div>

                        <Link 
                          to={`/blog/${blog.slug}`}
                          className="inline-flex items-center text-[#4CAF50] hover:text-[#45a049] font-medium group"
                        >
                          Read More
                          <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform duration-200" />
                        </Link>
                      </div>
                    </div>
                  </motion.article>
                ))}
              </div>

              {}
              {pagination.totalPages > 1 && (
                <div className="mt-12 flex justify-center">
                  <nav className="flex items-center space-x-2">
                    <button
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={!pagination.hasPrev}
                      className="px-3 py-2 text-sm font-medium text-[#B3B3B3] bg-[#1E1E1E] border border-[#333333] rounded-md hover:bg-[#333333] disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Previous
                    </button>

                    {[...Array(pagination.totalPages)].map((_, index) => {
                      const pageNumber = index + 1;
                      return (
                        <button
                          key={pageNumber}
                          onClick={() => setCurrentPage(pageNumber)}
                          className={`px-3 py-2 text-sm font-medium rounded-md ${
                            currentPage === pageNumber
                              ? 'text-white bg-[#4CAF50]'
                              : 'text-[#B3B3B3] bg-[#1E1E1E] border border-[#333333] hover:bg-[#333333]'
                          }`}
                        >
                          {pageNumber}
                        </button>
                      );
                    })}

                    <button
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, pagination.totalPages))}
                      disabled={!pagination.hasNext}
                      className="px-3 py-2 text-sm font-medium text-[#B3B3B3] bg-[#1E1E1E] border border-[#333333] rounded-md hover:bg-[#333333] disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Next
                    </button>
                  </nav>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-16">
              <div className="max-w-md mx-auto">
                <Eye className="w-16 h-16 text-[#333333] mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">No articles found</h3>
                <p className="text-[#B3B3B3] mb-6">
                  {searchTerm || selectedCategory 
                    ? 'Try adjusting your search or filter criteria.' 
                    : 'Check back soon for new articles on eye health and digital wellness.'
                  }
                </p>
                {(searchTerm || selectedCategory) && (
                  <button
                    onClick={() => {
                      setSearchTerm('');
                      setSelectedCategory('');
                      setCurrentPage(1);
                    }}
                    className="inline-flex items-center px-4 py-2 text-sm font-medium text-[#4CAF50] border border-[#4CAF50] rounded-lg hover:bg-[#333333] transition-colors duration-200"
                  >
                    Clear Filters
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Blog;
