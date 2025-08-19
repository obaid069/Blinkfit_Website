import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  Eye,
  Shield,
  Zap,
  BarChart3,
  Play,
  CheckCircle,
  Star,
  Clock,
  Download,
  Bell,
  Brain,
  ChevronRight
} from 'lucide-react';
import { getFeaturedBlogs } from '../utils/api';
import Particles from '../components/Particles';
import FallbackParticles from '../components/FallbackParticles';

const Home = () => {
  const [featuredBlogs, setFeaturedBlogs] = useState([]);
  const [stats, setStats] = useState({
    downloads: '50K+',
    users: '25K+',
    satisfaction: '98%'
  });

  useEffect(() => {
    const fetchFeaturedBlogs = async () => {
      try {
        const response = await getFeaturedBlogs();
        setFeaturedBlogs(response.data.slice(0, 3));
      } catch (error) {
        console.error('Error fetching featured blogs:', error);
      }
    };

    fetchFeaturedBlogs();
  }, []);

  const features = [
    {
      icon: Eye,
      title: 'AI Eye Monitoring',
      description: 'Advanced AI tracks your blinking patterns, eye strain, and fatigue in real-time.',
      color: 'bg-blue-100 text-blue-600'
    },
    {
      icon: Brain,
      title: 'Smart Alerts',
      description: 'Intelligent notifications remind you to take breaks and perform eye exercises.',
      color: 'bg-green-100 text-green-600'
    },
    {
      icon: Shield,
      title: 'Proactive Protection',
      description: 'Prevent eye problems before they start with personalized recommendations.',
      color: 'bg-purple-100 text-purple-600'
    },
    {
      icon: Clock,
      title: '24/7 Monitoring',
      description: 'Continuous background monitoring without affecting device performance.',
      color: 'bg-orange-100 text-orange-600'
    }
  ];

  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'Software Developer',
      content: 'BlinkFit has completely changed how I work. No more eye strain headaches!',
      rating: 5
    },
    {
      name: 'Michael Chen',
      role: 'Graphic Designer',
      content: 'The AI detection is incredibly accurate. It reminds me to blink when I need it most.',
      rating: 5
    },
    {
      name: 'Emily Rodriguez',
      role: 'Content Creator',
      content: 'My eye health has improved dramatically since using BlinkFit. Highly recommended!',
      rating: 5
    }
  ];

  return (
    <div className="w-full bg-[#121212] min-h-screen relative">
        {}
        <section id="hero" className="relative bg-gradient-to-br from-[#1E1E1E] to-[#121212] overflow-hidden w-full min-h-screen flex items-center">
          {}
          <div className="absolute inset-0 w-full h-full">
          <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none">
            <FallbackParticles particleCount={80} className="" />
          </div>
          </div>

          <div className="relative px-4 sm:px-6 lg:px-8 py-16 sm:py-24 w-full z-10">
            <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <h1 className="text-3xl xs:text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-white leading-tight mb-4 sm:mb-6">
                  Protect Your Eyes with{' '}
                  <span className="text-[#4CAF50]">AI-Powered</span>{' '}
                  Monitoring
                </h1>
                <p className="text-lg sm:text-xl text-[#B3B3B3] mb-6 sm:mb-8 leading-relaxed px-2 sm:px-0">
                  BlinkFit uses advanced artificial intelligence to monitor your eye health in real-time, 
                  preventing digital eye strain before it happens. Smart, proactive, and personalized.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 mb-8">
                  <button className="inline-flex items-center px-8 py-4 text-lg font-semibold text-white bg-[#4CAF50] rounded-lg hover:bg-[#45a049] transition-colors duration-200 group">
                    <Download className="w-5 h-5 mr-2" />
                    Download Free
                    <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-200" />
                  </button>
                  <button className="inline-flex items-center px-8 py-4 text-lg font-semibold text-[#4CAF50] bg-[#1E1E1E] border-2 border-[#4CAF50] rounded-lg hover:bg-[#333333] transition-colors duration-200">
                    <Play className="w-5 h-5 mr-2" />
                    Watch Demo
                  </button>
                </div>

                {}
                <div className="grid grid-cols-3 gap-6 pt-8 border-t border-[#333333]">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white">{stats.downloads}</div>
                    <div className="text-sm text-[#B3B3B3]">Downloads</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white">{stats.users}</div>
                    <div className="text-sm text-[#B3B3B3]">Active Users</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white">{stats.satisfaction}</div>
                    <div className="text-sm text-[#B3B3B3]">Satisfaction</div>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="relative flex justify-center"
              >
                {}
                <div className="relative w-80 sm:w-96 h-[24rem] sm:h-[28rem] bg-[#333333] rounded-3xl p-3 max-w-full">
                  <div className="w-full h-full bg-gradient-to-b from-[#4CAF50] to-[#45a049] rounded-2xl flex items-center justify-center">
                    <div className="text-center text-white">
                      <Eye className="w-16 h-16 mx-auto mb-4 animate-pulse" />
                      <h3 className="text-xl font-semibold mb-2">BlinkFit Active</h3>
                      <p className="text-green-100">Monitoring your eye health...</p>
                    </div>
                  </div>
                </div>

                {}
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="absolute -top-4 -right-4 bg-white rounded-lg shadow-lg p-3"
                >
                  <div className="flex items-center space-x-2 text-sm">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="font-medium">Eyes Protected</span>
                  </div>
                </motion.div>

                <motion.div
                  animate={{ y: [0, 10, 0] }}
                  transition={{ duration: 2.5, repeat: Infinity }}
                  className="absolute -bottom-4 -left-4 bg-white rounded-lg shadow-lg p-3"
                >
                  <div className="flex items-center space-x-2 text-sm">
                    <Clock className="w-4 h-4 text-[#4CAF50]" />
                    <span className="font-medium">24/7 Monitoring</span>
                  </div>
                </motion.div>
              </motion.div>
            </div>
          </div>
          </div>
        </section>

        {}
        <section id="features" className="py-24 bg-[#121212] w-full">
          <div className="px-6 w-full max-w-7xl mx-auto">
            <div className="text-center mb-20">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Advanced AI Technology for Your Eyes
              </h2>
              <p className="text-xl text-[#B3B3B3]">
                BlinkFit combines cutting-edge artificial intelligence with proven eye care techniques 
                to provide personalized protection for your vision.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    className="text-center group"
                  >
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#4CAF50] bg-opacity-20 mb-6 group-hover:scale-110 transition-transform duration-200">
                      <Icon className="w-8 h-8 text-[#4CAF50]" />
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-3">
                      {feature.title}
                    </h3>
                    <p className="text-[#B3B3B3] leading-relaxed">
                      {feature.description}
                    </p>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {}
        <section id="how-it-works" className="py-24 bg-[#1E1E1E] w-full">
          <div className="px-6 w-full max-w-7xl mx-auto">
            <div className="text-center mb-20">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                How BlinkFit Works
              </h2>
              <p className="text-xl text-[#B3B3B3]">
                Simple, smart, and effective eye protection in three steps
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              {[
                {
                  step: '01',
                  title: 'AI Monitoring',
                  description: 'Our AI analyzes your eye movements, blinking patterns, and screen habits in real-time.'
                },
                {
                  step: '02',
                  title: 'Smart Detection',
                  description: 'Advanced algorithms detect early signs of eye strain and fatigue before you feel them.'
                },
                {
                  step: '03',
                  title: 'Personalized Care',
                  description: 'Receive customized alerts, exercises, and recommendations based on your unique patterns.'
                }
              ].map((step, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
                  className="text-center relative"
                >
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-[#4CAF50] text-white rounded-full text-xl font-bold mb-6">
                    {step.step}
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-4">
                    {step.title}
                  </h3>
                  <p className="text-[#B3B3B3] leading-relaxed">
                    {step.description}
                  </p>

                  {index < 2 && (
                    <ChevronRight className="hidden md:block absolute top-8 -right-6 w-6 h-6 text-[#4CAF50]" />
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {}
        <section id="testimonials" className="py-24 bg-[#121212] w-full">
          <div className="px-6 w-full max-w-7xl mx-auto">
            <div className="text-center mb-20">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                What Our Users Say
              </h2>
              <p className="text-xl text-[#B3B3B3]">
                Join thousands of satisfied users protecting their vision with BlinkFit
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {testimonials.map((testimonial, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="bg-[#1E1E1E] border border-[#333333] rounded-xl p-8 hover:bg-[#252525] hover:border-[#4CAF50] hover:shadow-lg transition-all duration-300 group"
                >
                  <div className="flex items-center mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 text-[#4CAF50] fill-current" />
                    ))}
                  </div>
                  <p className="text-[#B3B3B3] mb-6 text-lg leading-relaxed group-hover:text-[#CCCCCC] transition-colors duration-300">"{testimonial.content}"</p>
                  <div>
                    <div className="font-semibold text-white text-lg group-hover:text-[#4CAF50] transition-colors duration-300">{testimonial.name}</div>
                    <div className="text-sm text-[#B3B3B3] group-hover:text-[#CCCCCC] transition-colors duration-300">{testimonial.role}</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {}
        {featuredBlogs.length > 0 && (
          <section id="insights" className="py-24 bg-[#1E1E1E] w-full">
            <div className="px-6 w-full max-w-7xl mx-auto">
              <div className="text-center mb-20">
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                  Eye Health Insights
                </h2>
                <p className="text-xl text-[#B3B3B3]">
                  Latest tips and research on digital eye health
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {featuredBlogs.map((blog, index) => (
                  <motion.article
                    key={blog._id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    className="bg-[#121212] border border-[#333333] rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-200"
                  >
                    <img 
                      src={blog.featuredImage} 
                      alt={blog.title}
                      className="w-full h-48 object-cover"
                    />
                    <div className="p-6">
                      <div className="text-sm text-[#4CAF50] font-medium mb-2">
                        {blog.category}
                      </div>
                      <h3 className="text-xl font-semibold text-white mb-3 line-clamp-2">
                        {blog.title}
                      </h3>
                      <p className="text-[#B3B3B3] mb-4 line-clamp-3">
                        {blog.excerpt}
                      </p>
                      <Link 
                        to={`/blog/${blog.slug}`}
                        className="inline-flex items-center text-[#4CAF50] hover:text-[#45a049] font-medium"
                      >
                        Read More
                        <ArrowRight className="w-4 h-4 ml-1" />
                      </Link>
                    </div>
                  </motion.article>
                ))}
              </div>

              <div className="text-center mt-12">
                <Link 
                  to="/blog"
                  className="inline-flex items-center px-6 py-3 text-[#4CAF50] border-2 border-[#4CAF50] rounded-lg hover:bg-[#333333] transition-colors duration-200"
                >
                  View All Articles
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </div>
            </div>
          </section>
        )}

        {}
        <section id="download" className="py-24 bg-[#4CAF50] w-full">
          <div className="text-center px-6 w-full max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                Ready to Protect Your Eyes?
              </h2>
              <p className="text-xl text-green-100 mb-8 leading-relaxed">
                Join thousands of users who have already improved their eye health with BlinkFit. 
                Download the app today and start your journey to better vision.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="inline-flex items-center px-8 py-4 text-lg font-semibold text-[#121212] bg-white rounded-lg hover:bg-gray-50 transition-colors duration-200">
                  <Download className="w-5 h-5 mr-2" />
                  Download for iOS
                </button>
                <button className="inline-flex items-center px-8 py-4 text-lg font-semibold text-blue-600 bg-white rounded-lg hover:bg-gray-50 transition-colors duration-200">
                  <Download className="w-5 h-5 mr-2" />
                  Download for Android
                </button>
              </div>
            </motion.div>
          </div>
        </section>
    </div>
  );
};

export default Home;
