import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Home, 
  Zap, 
  Settings, 
  Star, 
  Download, 
  BookOpen,
  Clock,
  TrendingUp,
  Eye,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
  Info,
  Mail,
  Lightbulb
} from 'lucide-react';

const Sidebar = ({ isOpen, setIsOpen, currentSection, onSectionChange }) => {
  const location = useLocation();
  const [activeSection, setActiveSection] = useState(currentSection || 'hero');
  const [hoveredItem, setHoveredItem] = useState(null);
  const [isCompact, setIsCompact] = useState(false);
  const isHomePage = location.pathname === '/';

  const sidebarItems = [
    {
      id: 'home',
      label: 'Home',
      icon: Home,
      color: 'from-blue-500 to-purple-600',
      description: 'Welcome section',
      path: '/',
      isPage: true
    },
    {
      id: 'features',
      label: 'Features',
      icon: Zap,
      color: 'from-green-500 to-teal-600',
      description: 'App capabilities',
      path: '/features',
      isPage: true
    },
    {
      id: 'about',
      label: 'About',
      icon: Info,
      color: 'from-orange-500 to-red-600',
      description: 'About us',
      path: '/about',
      isPage: true
    },
    {
      id: 'blog',
      label: 'Blog',
      icon: BookOpen,
      color: 'from-purple-500 to-pink-600',
      description: 'Latest articles',
      path: '/blog',
      isPage: true
    },
    {
      id: 'insights',
      label: 'Eye Health Tips',
      icon: Lightbulb,
      color: 'from-teal-500 to-cyan-600',
      description: 'Health insights',
      path: '/insights',
      isPage: true
    },
    {
      id: 'contact',
      label: 'Contact',
      icon: Mail,
      color: 'from-indigo-500 to-blue-600',
      description: 'Get in touch',
      path: '/contact',
      isPage: true
    }
  ];

  const stats = [
    { label: 'Users Protected', value: '50K+', icon: Eye },
    { label: 'Hours Monitored', value: '2M+', icon: Clock },
    { label: 'Health Score', value: '98%', icon: TrendingUp }
  ];

  useEffect(() => {
    setActiveSection(currentSection);
  }, [currentSection]);

  const handleSectionClick = (sectionId, isPage = false, path = null) => {
    if (isPage && path) {
      // Navigate to page - this will be handled by Link component
      return;
    }
    
    setActiveSection(sectionId);
    onSectionChange?.(sectionId);
    
    // Smooth scroll to section (only for home page sections)
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  };
  
  const isActiveItem = (item) => {
    if (item.isPage) {
      return location.pathname === item.path;
    }
    return activeSection === item.id;
  };

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const toggleCompact = () => {
    setIsCompact(!isCompact);
  };

  return (
    <>
      {/* Mobile Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="lg:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-[9998]"
            onClick={() => setIsOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Mobile Toggle Button */}
      <button
        onClick={toggleSidebar}
        className="lg:hidden fixed top-20 left-4 z-[10000] p-3 bg-gradient-to-r from-[#4CAF50] to-[#45a049] text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
      >
        {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {/* Sidebar */}
      <motion.aside
        initial={{ x: -320 }}
        animate={{ 
          x: isOpen ? 0 : (window.innerWidth >= 1024 ? (isCompact ? -240 : 0) : -320),
          width: isCompact ? 80 : 320
        }}
        transition={{ 
          type: "spring", 
          stiffness: 300, 
          damping: 30 
        }}
        className={`fixed top-0 left-0 h-screen bg-gradient-to-br from-[#1E1E1E]/95 to-[#121212]/95 backdrop-blur-xl border-r border-[#333333]/50 shadow-2xl z-[9999] overflow-hidden`}
        style={{ width: isCompact ? 80 : 320 }}
      >
        {/* Header */}
        <div className="p-4 pt-20 border-b border-[#333333]/30">
          <div className="flex items-center justify-between">
            {!isCompact && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center gap-3"
              >
                <div className="w-10 h-10 bg-gradient-to-r from-[#4CAF50] to-[#45a049] rounded-xl flex items-center justify-center shadow-lg">
                  <Eye className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white">Navigation</h2>
                  <p className="text-xs text-[#B3B3B3]">Quick access</p>
                </div>
              </motion.div>
            )}
            
        
          </div>
        </div>

        {/* Navigation Items */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {sidebarItems.map((item, index) => {
            const Icon = item.icon;
            const isActive = isActiveItem(item);
            
            const itemContent = (
              <>
                <div className="flex items-center p-4">
                  <div className={`flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-200 ${
                    isActive 
                      ? 'bg-white/20 shadow-inner' 
                      : 'bg-[#333333]/30 group-hover:bg-[#4CAF50]/20'
                  }`}>
                    <Icon className={`w-5 h-5 transition-colors duration-200 ${
                      isActive ? 'text-white' : 'text-[#B3B3B3] group-hover:text-[#4CAF50]'
                    }`} />
                  </div>
                  
                  {!isCompact && (
                    <div className="ml-4 flex-1 text-left">
                      <div className={`font-semibold transition-colors duration-200 ${
                        isActive ? 'text-white' : 'text-[#E0E0E0] group-hover:text-white'
                      }`}>
                        {item.label}
                      </div>
                      <div className={`text-xs transition-colors duration-200 ${
                        isActive ? 'text-white/80' : 'text-[#B3B3B3] group-hover:text-[#E0E0E0]'
                      }`}>
                        {item.description}
                      </div>
                    </div>
                  )}
                </div>

                {/* Hover Effect */}
                {hoveredItem === item.id && !isActive && (
                  <motion.div
                    layoutId="hoverBackground"
                    className="absolute inset-0 bg-gradient-to-r from-[#4CAF50]/10 to-[#45a049]/10 rounded-xl"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  />
                )}

                {/* Active Indicator */}
                {isActive && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-white rounded-r-full shadow-lg" />
                )}
              </>
            );
            
            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`w-full group relative overflow-hidden rounded-xl transition-all duration-300 ${
                  isActive
                    ? `bg-gradient-to-r ${item.color} shadow-lg scale-105`
                    : 'hover:bg-[#333333]/30 hover:scale-102'
                }`}
                onMouseEnter={() => setHoveredItem(item.id)}
                onMouseLeave={() => setHoveredItem(null)}
              >
                {item.isPage ? (
                  <Link to={item.path} className="block w-full">
                    {itemContent}
                  </Link>
                ) : (
                  <button 
                    onClick={() => handleSectionClick(item.id)}
                    className="block w-full"
                  >
                    {itemContent}
                  </button>
                )}
              </motion.div>
            );
          })}
        </div>

        {/* Stats Section */}
        {!isCompact && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="p-4 border-t border-[#333333]/30"
          >
            <h3 className="text-sm font-semibold text-[#B3B3B3] mb-3">Quick Stats</h3>
            <div className="space-y-3">
              {stats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <div key={index} className="flex items-center justify-between p-2 rounded-lg bg-[#333333]/20">
                    <div className="flex items-center gap-2">
                      <Icon className="w-4 h-4 text-[#4CAF50]" />
                      <span className="text-xs text-[#B3B3B3]">{stat.label}</span>
                    </div>
                    <span className="text-sm font-bold text-white">{stat.value}</span>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* Bottom Gradient */}
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-[#121212] to-transparent pointer-events-none" />
      </motion.aside>
    </>
  );
};

export default Sidebar;
