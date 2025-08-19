import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Eye, 
  Clock, 
  BookOpen, 
  Search, 
  Calendar,
  User,
  ArrowRight,
  Filter,
  Star,
  Heart,
  Shield,
  Lightbulb,
  Zap,
  Target
} from 'lucide-react';

const EyeHealthInsights = () => {
  const [articles, setArticles] = useState([]);
  const [filteredArticles, setFilteredArticles] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [loading, setLoading] = useState(true);

  const sampleArticles = [
    {
      id: 1,
      title: "Understanding Digital Eye Strain: Causes and Solutions",
      excerpt: "Learn about the causes of digital eye strain and discover effective ways to protect your eyes in the digital age.",
      content: "Digital eye strain affects millions of people worldwide...",
      category: "Digital Health",
      author: "Dr. Sarah Johnson",
      publishedAt: "2024-01-15",
      readTime: "5 min read",
      image: "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      tags: ["Digital Strain", "Prevention", "Computer Vision"],
      featured: true
    },
    {
      id: 2,
      title: "The 20-20-20 Rule: Your Shield Against Eye Fatigue",
      excerpt: "Discover how this simple rule can dramatically reduce eye fatigue and improve your overall eye health.",
      content: "The 20-20-20 rule is one of the most effective techniques...",
      category: "Prevention",
      author: "Dr. Michael Chen",
      publishedAt: "2024-01-12",
      readTime: "3 min read",
      image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      tags: ["20-20-20 Rule", "Eye Exercises", "Workplace Health"],
      featured: true
    },
    {
      id: 3,
      title: "Blue Light and Your Eyes: Separating Fact from Fiction",
      excerpt: "Get the real facts about blue light exposure and learn what science says about protecting your vision.",
      content: "Blue light has become a major concern in our digital world...",
      category: "Research",
      author: "Dr. Emily Rodriguez",
      publishedAt: "2024-01-10",
      readTime: "7 min read",
      image: "https://images.unsplash.com/photo-1551650975-87deedd944c3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      tags: ["Blue Light", "Research", "Sleep Health"],
      featured: false
    },
    {
      id: 4,
      title: "Nutrition for Better Eye Health: Foods That Protect Your Vision",
      excerpt: "Discover the power of nutrition in maintaining healthy eyes and preventing age-related eye conditions.",
      content: "What you eat can significantly impact your eye health...",
      category: "Nutrition",
      author: "Dr. Robert Kim",
      publishedAt: "2024-01-08",
      readTime: "6 min read",
      image: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      tags: ["Nutrition", "Vitamins", "Eye Health"],
      featured: false
    },
    {
      id: 5,
      title: "Simple Eye Exercises for Daily Relief",
      excerpt: "Learn easy-to-follow eye exercises that you can do anywhere to reduce strain and improve focus.",
      content: "Regular eye exercises can help maintain good vision...",
      category: "Exercises",
      author: "Dr. Lisa Wang",
      publishedAt: "2024-01-05",
      readTime: "4 min read",
      image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      tags: ["Eye Exercises", "Daily Routine", "Vision Care"],
      featured: true
    },
    {
      id: 6,
      title: "Creating the Perfect Ergonomic Workspace for Eye Health",
      excerpt: "Set up your workspace to minimize eye strain and maximize productivity with these expert tips.",
      content: "Your workspace setup plays a crucial role in eye health...",
      category: "Ergonomics",
      author: "Dr. James Wilson",
      publishedAt: "2024-01-03",
      readTime: "5 min read",
      image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      tags: ["Ergonomics", "Workspace", "Computer Setup"],
      featured: false
    }
  ];

  const categories = [
    { id: 'all', name: 'All Articles', icon: BookOpen, count: sampleArticles.length },
    { id: 'Digital Health', name: 'Digital Health', icon: Eye, count: 1 },
    { id: 'Prevention', name: 'Prevention', icon: Shield, count: 1 },
    { id: 'Research', name: 'Research', icon: Target, count: 1 },
    { id: 'Nutrition', name: 'Nutrition', icon: Heart, count: 1 },
    { id: 'Exercises', name: 'Exercises', icon: Zap, count: 1 },
    { id: 'Ergonomics', name: 'Ergonomics', icon: Lightbulb, count: 1 }
  ];

  const tips = [
    {
      title: "Take Regular Breaks",
      description: "Follow the 20-20-20 rule: every 20 minutes, look at something 20 feet away for 20 seconds.",
      icon: Clock
    },
    {
      title: "Proper Lighting",
      description: "Ensure your screen brightness matches your surroundings to reduce strain.",
      icon: Lightbulb
    },
    {
      title: "Blink More Often",
      description: "Conscious blinking helps keep your eyes moist and reduces dryness.",
      icon: Eye
    },
    {
      title: "Stay Hydrated",
      description: "Drinking plenty of water helps maintain eye moisture and overall health.",
      icon: Heart
    }
  ];

  useEffect(() => {

    setTimeout(() => {
      setArticles(sampleArticles);
      setFilteredArticles(sampleArticles);
      setLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    let filtered = articles;

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(article => article.category === selectedCategory);
    }

    if (searchTerm) {
      filtered = filtered.filter(article =>
        article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        article.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
        article.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    setFilteredArticles(filtered);
  }, [articles, selectedCategory, searchTerm]);

  const featuredArticles = articles.filter(article => article.featured);

  return (
    <div className="pt-16 bg-[#121212] min-h-screen">
      {}
      <section className="bg-gradient-to-br from-[#1E1E1E] to-[#121212] text-white">
        <div className="max-w-7xl mx-auto px-6 py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Eye Health Insights
            </h1>
            <p className="text-xl text-[#B3B3B3] mb-8 max-w-3xl mx-auto">
              Discover expert advice, research-backed tips, and practical solutions to protect 
              and improve your eye health in the digital age.
            </p>

            {}
            <div className="max-w-2xl mx-auto relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search articles, tips, and insights..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-4 rounded-xl *: text-white bg-[#121212] border border-[#333333] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#4CAF50]/20"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {}
      <section className="py-16 bg-[#1E1E1E]">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-white mb-4">Quick Eye Health Tips</h2>
            <p className="text-xl text-[#B3B3B3]">Simple practices for better eye health</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {tips.map((tip, index) => {
              const Icon = tip.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="bg-[#121212] border border-[#333333] rounded-xl p-6 hover:shadow-lg transition-shadow duration-300"
                >
                  <div className="bg-[#4CAF50] bg-opacity-20 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-[#4CAF50]" />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">{tip.title}</h3>
                  <p className="text-[#B3B3B3] text-sm">{tip.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {}
      <section className="py-16 bg-[#121212]">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-white mb-4">Featured Articles</h2>
            <p className="text-xl text-[#B3B3B3]">Must-read insights from our experts</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredArticles.map((article, index) => (
              <motion.article
                key={article.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-[#1E1E1E] border border-[#333333] rounded-xl shadow-sm overflow-hidden hover:shadow-lg transition-shadow duration-300 group"
              >
                <div className="relative">
                  <img
                    src={article.image}
                    alt={article.title}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="bg-[#4CAF50] text-white px-3 py-1 rounded-full text-sm font-medium">
                      {article.category}
                    </span>
                  </div>
                  <div className="absolute top-4 right-4">
                    <Star className="w-5 h-5 text-yellow-400 fill-current" />
                  </div>
                </div>

                <div className="p-6">
                  <div className="flex items-center text-sm text-[#B3B3B3] mb-3">
                    <User className="w-4 h-4 mr-1" />
                    <span className="mr-4">{article.author}</span>
                    <Calendar className="w-4 h-4 mr-1" />
                    <span className="mr-4">{new Date(article.publishedAt).toLocaleDateString()}</span>
                    <Clock className="w-4 h-4 mr-1" />
                    <span>{article.readTime}</span>
                  </div>

                  <h3 className="text-xl font-semibold text-white mb-3 group-hover:text-[#4CAF50] transition-colors duration-200">
                    {article.title}
                  </h3>

                  <p className="text-[#B3B3B3] mb-4 line-clamp-3">
                    {article.excerpt}
                  </p>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {article.tags.slice(0, 2).map((tag) => (
                      <span
                        key={tag}
                        className="bg-[#121212] text-[#B3B3B3] px-2 py-1 rounded text-sm"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <Link
                    to={`/insights/${article.id}`}
                    className="inline-flex items-center text-[#4CAF50] hover:text-[#45a049] font-medium group-hover:translate-x-1 transition-transform duration-200"
                  >
                    Read More
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </Link>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {}
      <section className="py-16 bg-[#1E1E1E]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col lg:flex-row gap-8">
            {}
            <aside className="lg:w-1/4">
              <div className="bg-[#121212] border border-[#333333] rounded-xl p-6 sticky top-24">
                <h3 className="text-lg font-semibold text-white mb-6 flex items-center">
                  <Filter className="w-5 h-5 mr-2" />
                  Categories
                </h3>

                <nav className="space-y-2">
                  {categories.map((category) => {
                    const Icon = category.icon;
                    return (
                      <button
                        key={category.id}
                        onClick={() => setSelectedCategory(category.id)}
                        className={`w-full flex items-center justify-between px-4 py-3 rounded-lg text-left transition-colors duration-200 ${
                          selectedCategory === category.id
                            ? 'bg-[#4CAF50] text-white'
                            : 'text-[#B3B3B3] hover:bg-[#333333]'
                        }`}
                      >
                        <div className="flex items-center">
                          <Icon className="w-4 h-4 mr-3" />
                          <span className="font-medium">{category.name}</span>
                        </div>
                        <span className={`text-sm ${
                          selectedCategory === category.id ? 'text-green-100' : 'text-[#666666]'
                        }`}>
                          {category.count}
                        </span>
                      </button>
                    );
                  })}
                </nav>
              </div>
            </aside>

            {}
            <main className="lg:w-3/4">
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-white mb-2">
                  {selectedCategory === 'all' ? 'All Articles' : `${selectedCategory} Articles`}
                </h2>
                <p className="text-[#B3B3B3]">
                  Found {filteredArticles.length} articles
                  {searchTerm && ` matching "${searchTerm}"`}
                </p>
              </div>

              {loading ? (
                <div className="space-y-6">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="bg-[#333333] rounded-xl h-32 animate-pulse"></div>
                  ))}
                </div>
              ) : filteredArticles.length > 0 ? (
                <div className="space-y-6">
                  {filteredArticles.map((article, index) => (
                    <motion.article
                      key={article.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: index * 0.1 }}
                      className="bg-[#121212] border border-[#333333] rounded-xl p-6 hover:shadow-md transition-shadow duration-300 group"
                    >
                      <div className="flex flex-col md:flex-row gap-6">
                        <div className="md:w-1/3">
                          <img
                            src={article.image}
                            alt={article.title}
                            className="w-full h-40 object-cover rounded-lg group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>

                        <div className="md:w-2/3">
                          <div className="flex items-center text-sm text-[#B3B3B3] mb-3">
                            <span className="bg-[#4CAF50] bg-opacity-20 text-[#4CAF50] px-2 py-1 rounded text-xs font-medium mr-3">
                              {article.category}
                            </span>
                            <User className="w-4 h-4 mr-1" />
                            <span className="mr-4">{article.author}</span>
                            <Calendar className="w-4 h-4 mr-1" />
                            <span className="mr-4">{new Date(article.publishedAt).toLocaleDateString()}</span>
                            <Clock className="w-4 h-4 mr-1" />
                            <span>{article.readTime}</span>
                          </div>

                          <h3 className="text-xl font-semibold text-white mb-3 group-hover:text-[#4CAF50] transition-colors duration-200">
                            {article.title}
                          </h3>

                          <p className="text-[#B3B3B3] mb-4">
                            {article.excerpt}
                          </p>

                          <div className="flex items-center justify-between">
                            <div className="flex flex-wrap gap-2">
                              {article.tags.slice(0, 3).map((tag) => (
                                <span
                                  key={tag}
                                  className="bg-[#1E1E1E] text-[#B3B3B3] px-2 py-1 rounded text-sm"
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>

                            <Link
                              to={`/insights/${article.id}`}
                              className="inline-flex items-center text-[#4CAF50] hover:text-[#45a049] font-medium group-hover:translate-x-1 transition-transform duration-200"
                            >
                              Read More
                              <ArrowRight className="w-4 h-4 ml-1" />
                            </Link>
                          </div>
                        </div>
                      </div>
                    </motion.article>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <BookOpen className="w-16 h-16 text-[#333333] mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-white mb-2">No articles found</h3>
                  <p className="text-[#B3B3B3] mb-6">
                    Try adjusting your search terms or category filter.
                  </p>
                  <button
                    onClick={() => {
                      setSearchTerm('');
                      setSelectedCategory('all');
                    }}
                    className="inline-flex items-center px-4 py-2 bg-[#4CAF50] text-white rounded-lg hover:bg-[#45a049] transition-colors duration-200"
                  >
                    Clear Filters
                  </button>
                </div>
              )}
            </main>
          </div>
        </div>
      </section>

      {}
      <section className="py-16 bg-gradient-to-br from-[#4CAF50] to-[#45a049]">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl font-bold text-white mb-4">
              Stay Updated with Eye Health Tips
            </h2>
            <p className="text-xl text-green-100 mb-8">
              Get weekly insights and tips delivered to your inbox
            </p>

            <div className="max-w-md mx-auto flex gap-4">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-lg border-0 focus:outline-none focus:ring-2 focus:ring-white/20"
              />
              <button className="px-6 py-3 bg-white text-[#121212] font-semibold rounded-lg hover:bg-gray-50 transition-colors duration-200">
                Subscribe
              </button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default EyeHealthInsights;
