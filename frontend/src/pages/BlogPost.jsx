import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  Calendar, 
  Clock, 
  Eye, 
  Heart,
  Share2,
  User,
  Facebook,
  Twitter,
  Linkedin,
  Copy,
  Check
} from 'lucide-react';
import { getBlogBySlug, likeBlog, getBlogs } from '../utils/api';

const BlogPost = () => {
  const { slug } = useParams();
  const [blog, setBlog] = useState(null);
  const [relatedBlogs, setRelatedBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(0);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (slug) {
      fetchBlogPost();
    }
  }, [slug]);

  useEffect(() => {
    if (blog) {
      fetchRelatedBlogs();
      setLikes(blog.likes || 0);

      const hasLiked = localStorage.getItem(`liked_${blog._id}`);
      setLiked(!!hasLiked);
    }
  }, [blog]);

  const fetchBlogPost = async () => {
    setLoading(true);
    try {
      const response = await getBlogBySlug(slug);
      setBlog(response.data);
    } catch (error) {
      console.error('Error fetching blog post:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRelatedBlogs = async () => {
    if (!blog) return;

    try {
      const response = await getBlogs({
        category: blog.category,
        limit: 3,
        exclude: blog._id
      });
      setRelatedBlogs(response.data.blogs);
    } catch (error) {
      console.error('Error fetching related blogs:', error);
    }
  };

  const handleLike = async () => {
    if (!blog) return;

    try {
      const response = await likeBlog(blog._id);
      setLikes(response.data.likes);
      setLiked(!liked);

      if (!liked) {
        localStorage.setItem(`liked_${blog._id}`, 'true');
      } else {
        localStorage.removeItem(`liked_${blog._id}`);
      }
    } catch (error) {
      console.error('Error liking blog post:', error);
    }
  };

  const handleShare = async (platform) => {
    const url = window.location.href;
    const title = blog?.title || '';

    switch (platform) {
      case 'facebook':
        window.open(`https:
        break;
      case 'twitter':
        window.open(`https:
        break;
      case 'linkedin':
        window.open(`https:
        break;
      case 'copy':
        try {
          await navigator.clipboard.writeText(url);
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        } catch (error) {
          console.error('Error copying to clipboard:', error);
        }
        break;
      default:
        break;
    }
    setShowShareMenu(false);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatContent = (content) => {
    if (!content) return '';

    return content
      .split('\n\n')
      .map((paragraph, index) => (
        <p key={index} className="mb-6 leading-relaxed">
          {paragraph}
        </p>
      ));
  };

  if (loading) {
  return (
    <div className="pt-16 pl-[50px] bg-white min-h-screen">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 rounded w-3/4 mb-6"></div>
            <div className="h-4 bg-gray-300 rounded w-1/2 mb-8"></div>
            <div className="h-64 bg-gray-300 rounded mb-8"></div>
            <div className="space-y-4">
              {[...Array(8)].map((_, index) => (
                <div key={index} className="h-4 bg-gray-300 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="pt-16 min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Blog post not found</h1>
          <p className="text-gray-600 mb-8">The blog post you're looking for doesn't exist.</p>
          <Link 
            to="/blog"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Blog
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-16 min-h-screen bg-white">
      {}
      <div className="bg-gray-50 py-4 border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link 
            to="/blog"
            className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Blog
          </Link>
        </div>
      </div>

      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {}
        <motion.header
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <div className="mb-6">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
              {blog.category}
            </span>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
            {blog.title}
          </h1>

          <div className="flex flex-wrap items-center text-gray-600 mb-8 gap-6">
            <div className="flex items-center">
              <User className="w-5 h-5 mr-2" />
              <span>{blog.author}</span>
            </div>
            <div className="flex items-center">
              <Calendar className="w-5 h-5 mr-2" />
              <span>{formatDate(blog.publishedAt)}</span>
            </div>
            <div className="flex items-center">
              <Clock className="w-5 h-5 mr-2" />
              <span>{blog.readTime} min read</span>
            </div>
            <div className="flex items-center">
              <Eye className="w-5 h-5 mr-2" />
              <span>{blog.views} views</span>
            </div>
          </div>

          {blog.excerpt && (
            <p className="text-xl text-gray-700 leading-relaxed">
              {blog.excerpt}
            </p>
          )}
        </motion.header>

        {}
        {blog.featuredImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-12"
          >
            <img 
              src={blog.featuredImage} 
              alt={blog.title}
              className="w-full h-auto rounded-lg shadow-lg"
            />
          </motion.div>
        )}

        {}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="prose prose-lg max-w-none mb-12"
        >
          <div className="text-gray-800 text-lg leading-relaxed">
            {formatContent(blog.content)}
          </div>
        </motion.div>

        {}
        {blog.tags && blog.tags.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mb-12"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Tags</h3>
            <div className="flex flex-wrap gap-2">
              {blog.tags.map((tag) => (
                <span 
                  key={tag}
                  className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-gray-200 transition-colors duration-200"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </motion.div>
        )}

        {}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="flex items-center justify-between border-t border-b border-gray-200 py-6 mb-12"
        >
          <button
            onClick={handleLike}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors duration-200 ${
              liked 
                ? 'bg-red-50 text-red-600 hover:bg-red-100' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <Heart className={`w-5 h-5 ${liked ? 'fill-current' : ''}`} />
            <span>{likes}</span>
          </button>

          <div className="relative">
            <button
              onClick={() => setShowShareMenu(!showShareMenu)}
              className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors duration-200"
            >
              <Share2 className="w-5 h-5" />
              <span>Share</span>
            </button>

            {showShareMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                <div className="py-1">
                  <button
                    onClick={() => handleShare('facebook')}
                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <Facebook className="w-4 h-4 mr-3" />
                    Facebook
                  </button>
                  <button
                    onClick={() => handleShare('twitter')}
                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <Twitter className="w-4 h-4 mr-3" />
                    Twitter
                  </button>
                  <button
                    onClick={() => handleShare('linkedin')}
                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <Linkedin className="w-4 h-4 mr-3" />
                    LinkedIn
                  </button>
                  <button
                    onClick={() => handleShare('copy')}
                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    {copied ? (
                      <Check className="w-4 h-4 mr-3 text-green-600" />
                    ) : (
                      <Copy className="w-4 h-4 mr-3" />
                    )}
                    {copied ? 'Copied!' : 'Copy Link'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </article>

      {}
      {relatedBlogs.length > 0 && (
        <section className="bg-gray-50 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">
              Related Articles
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {relatedBlogs.map((relatedBlog, index) => (
                <motion.article
                  key={relatedBlog._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-lg transition-shadow duration-300"
                >
                  <div className="relative">
                    <img 
                      src={relatedBlog.featuredImage} 
                      alt={relatedBlog.title}
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute top-4 left-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {relatedBlog.category}
                      </span>
                    </div>
                  </div>

                  <div className="p-6">
                    <div className="flex items-center text-sm text-gray-500 mb-3">
                      <Calendar className="w-4 h-4 mr-1" />
                      <span className="mr-4">{formatDate(relatedBlog.publishedAt)}</span>
                      <Clock className="w-4 h-4 mr-1" />
                      <span>{relatedBlog.readTime} min read</span>
                    </div>

                    <h3 className="text-xl font-semibold text-gray-900 mb-3 line-clamp-2">
                      {relatedBlog.title}
                    </h3>

                    <p className="text-gray-600 mb-4 line-clamp-3">
                      {relatedBlog.excerpt}
                    </p>

                    <Link 
                      to={`/blog/${relatedBlog.slug}`}
                      className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium"
                    >
                      Read More
                      <ArrowLeft className="w-4 h-4 ml-1 rotate-180" />
                    </Link>
                  </div>
                </motion.article>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default BlogPost;
