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
      title: 'AI-Powered Blink Detection',
      description: 'Advanced computer vision technology tracks your blink rate in real-time using your device camera.',
      color: 'bg-blue-100 text-blue-600'
    },
    {
      icon: Zap,
      title: 'Smart Eye Exercise Recommendations',
      description: 'Personalized exercise routines based on your usage patterns and eye health needs.',
      color: 'bg-green-100 text-green-600'
    },
    {
      icon: Bell,
      title: 'Intelligent Break Reminders',
      description: 'Smart notifications that adapt to your work patterns and remind you to take healthy breaks.',
      color: 'bg-purple-100 text-purple-600'
    },
    {
      icon: BarChart3,
      title: 'Comprehensive Analytics',
      description: 'Detailed insights into your digital eye health with trends, patterns, and improvement suggestions.',
      color: 'bg-orange-100 text-orange-600'
    }
  ];



  return (
    <div className="w-full bg-[#121212] min-h-screen relative">
        {}
        <section id="hero" className="relative bg-gradient-to-br from-[#1E1E1E] to-[#121212] overflow-hidden w-full min-h-[80vh] lg:min-h-screen flex items-center">
          {}
          <div className="absolute inset-0 w-full h-full">
            <Particles
              particleColors={['#4CAF50', '#45a049', '#66BB6A']}
              particleCount={300}
              particleSpread={15}
              speed={0.08}
              particleBaseSize={120}
              moveParticlesOnHover={true}
              alphaParticles={true}
              disableRotation={false}
              className=""
            />
          </div>

          <div className="relative px-4 sm:px-6 lg:px-8 py-16 sm:py-24 w-full z-10">
            <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10 lg:gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold text-white leading-tight mb-3 sm:mb-5">
                  Protect Your Eyes with{' '}
                  <span className="text-[#4CAF50]">AI-Powered</span>{' '}
                  Monitoring
                </h1>
                <p className="text-sm sm:text-base text-[#B3B3B3] mb-5 sm:mb-6 leading-relaxed px-2 sm:px-0">
                  BlinkFit uses advanced artificial intelligence to monitor your eye health in real-time, 
                  preventing digital eye strain before it happens. Smart, proactive, and personalized.
                </p>

                <div className="flex flex-col sm:flex-row gap-3 mb-6">
                  <button className="inline-flex items-center px-6 py-3 text-base font-semibold text-white bg-[#4CAF50] rounded-lg hover:bg-[#45a049] transition-colors duration-200 group">
                    <Download className="w-4 h-4 mr-2" />
                    Download Free
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-200" />
                  </button>
                  <button className="inline-flex items-center px-6 py-3 text-base font-semibold text-[#4CAF50] bg-[#1E1E1E] border-2 border-[#4CAF50] rounded-lg hover:bg-[#333333] transition-colors duration-200">
                    <Play className="w-4 h-4 mr-2" />
                    Watch Demo
                  </button>
                </div>


              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="relative flex justify-center"
              >
                {}
                <div className="relative w-64 sm:w-80 h-80 sm:h-96 bg-[#333333] rounded-3xl p-2 max-w-full">
                  <div className="w-full h-full bg-gradient-to-b from-[#4CAF50] to-[#45a049] rounded-2xl flex items-center justify-center">
                    <div className="text-center text-white">
                      <Eye className="w-12 h-12 mx-auto mb-3 animate-pulse" />
                      <h3 className="text-lg font-semibold mb-2">BlinkFit Active</h3>
                      <p className="text-sm text-green-100">Monitoring your eye health...</p>
                    </div>
                  </div>
                </div>

                {}
                <motion.div
                  animate={{ y: [0, -8, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="hidden sm:block absolute -top-3 -right-3 bg-white rounded-lg shadow-lg p-2"
                >
                  <div className="flex items-center space-x-1 text-xs">
                    <CheckCircle className="w-3 h-3 text-green-500" />
                    <span className="font-medium">Eyes Protected</span>
                  </div>
                </motion.div>

                <motion.div
                  animate={{ y: [0, 8, 0] }}
                  transition={{ duration: 2.5, repeat: Infinity }}
                  className="hidden sm:block absolute -bottom-3 -left-3 bg-white rounded-lg shadow-lg p-2"
                >
                  <div className="flex items-center space-x-1 text-xs">
                    <Clock className="w-3 h-3 text-[#4CAF50]" />
                    <span className="font-medium">24/7 Monitoring</span>
                  </div>
                </motion.div>
              </motion.div>
            </div>
          </div>
          </div>
        </section>

        {}
        <section id="features" className="py-20 bg-[#121212] w-full">
          <div className="px-5 w-full max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-xl md:text-2xl font-bold text-white mb-3">
                Advanced AI Technology for Your Eyes
              </h2>
              <p className="text-base text-[#B3B3B3]">
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
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    className="text-center group p-4 rounded-xl hover:bg-[#1E1E1E] transition-colors duration-300"
                  >
                    <div className="inline-flex items-center justify-center w-16 h-16 md:w-20 md:h-20 rounded-full bg-gradient-to-br from-[#4CAF50] to-[#45a049] mb-5 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-lg shadow-[#4CAF50]/30">
                      {Icon && <Icon className="w-8 h-8 md:w-10 md:h-10 text-white" strokeWidth={2} style={{ strokeWidth: 2 }} />}
                    </div>
                    <h3 className="text-base md:text-lg font-semibold text-white mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-[#B3B3B3] leading-relaxed">
                      {feature.description}
                    </p>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {}
        <section id="how-it-works" className="py-20 bg-[#1E1E1E] w-full">
          <div className="px-5 w-full max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-xl md:text-2xl font-bold text-white mb-3">
                How BlinkFit Works
              </h2>
              <p className="text-base text-[#B3B3B3]">
                Simple, smart, and effective eye protection in three steps
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
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
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
                  className="text-center relative"
                >
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-[#4CAF50] text-white rounded-full text-lg font-bold mb-5">
                    {step.step}
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-3">
                    {step.title}
                  </h3>
                  <p className="text-sm text-[#B3B3B3] leading-relaxed">
                    {step.description}
                  </p>

                  {index < 2 && (
                    <ChevronRight className="hidden md:block absolute top-6 -right-5 w-5 h-5 text-[#4CAF50]" />
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </section>



        {}
        {featuredBlogs.length > 0 && (
          <section id="insights" className="py-20 bg-[#1E1E1E] w-full">
            <div className="px-5 w-full max-w-7xl mx-auto">
              <div className="text-center mb-16">
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
                  Eye Health Insights
                </h2>
                <p className="text-lg text-[#B3B3B3]">
                  Latest tips and research on digital eye health
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {featuredBlogs.map((blog, index) => (
                  <motion.article
                    key={blog._id}
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    className="bg-[#121212] border border-[#333333] rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-200"
                  >
                    <img 
                      src={blog.featuredImage} 
                      alt={blog.title}
                      className="w-full h-40 object-cover"
                    />
                    <div className="p-5">
                      <div className="text-xs text-[#4CAF50] font-medium mb-2">
                        {blog.category}
                      </div>
                      <h3 className="text-lg font-semibold text-white mb-2 line-clamp-2">
                        {blog.title}
                      </h3>
                      <p className="text-sm text-[#B3B3B3] mb-3 line-clamp-3">
                        {blog.excerpt}
                      </p>
                      <Link 
                        to={`/blog/${blog.slug}`}
                        className="inline-flex items-center text-sm text-[#4CAF50] hover:text-[#45a049] font-medium"
                      >
                        Read More
                        <ArrowRight className="w-3 h-3 ml-1" />
                      </Link>
                    </div>
                  </motion.article>
                ))}
              </div>

              <div className="text-center mt-10">
                <Link 
                  to="/blog"
                  className="inline-flex items-center px-5 py-2 text-sm text-[#4CAF50] border-2 border-[#4CAF50] rounded-lg hover:bg-[#333333] transition-colors duration-200"
                >
                  View All Articles
                  <ArrowRight className="w-3 h-3 ml-2" />
                </Link>
              </div>
            </div>
          </section>
        )}

        {}
        <section id="download" className="py-20 bg-[#4CAF50] w-full">
          <div className="text-center px-5 w-full max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-5">
                Ready to Protect Your Eyes?
              </h2>
              <p className="text-lg text-green-100 mb-6 leading-relaxed">
                Join thousands of users who have already improved their eye health with BlinkFit. 
                Download the app today and start your journey to better vision.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button className="inline-flex items-center px-6 py-3 text-base font-semibold text-black bg-white rounded-lg hover:bg-gray-50 transition-colors duration-200">
                  <Download className="w-4 h-4 mr-2" />
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
