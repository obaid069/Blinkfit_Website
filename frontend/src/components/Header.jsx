import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Eye, Download, Home, Zap, Info, BookOpen, Mail, Lightbulb } from 'lucide-react';
import logo from '../assets/logo.png';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isCurrentPath = (path) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <header className={`fixed top-0 left-0 w-full right-0 z-40 transition-all duration-300 ${
      isScrolled 
        ? 'bg-[#1E1E1E]/95 backdrop-blur-lg border-b border-[#333333]/50' 
        : 'bg-[#1E1E1E]/80 backdrop-blur-sm'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 lg:h-20">
          {}
          <Link to="/" className="flex items-center space-x-3 z-50">
            <div className="relative">
              <img 
                src={logo} 
                alt="BlinkFit Logo" 
                className="w-10 h-10 object-contain drop-shadow-lg"
              />
            </div>
            <span className="text-xl font-bold text-white tracking-tight">BlinkFit</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            <Link 
              to="/" 
              className={`text-sm font-medium transition-colors duration-200 ${
                isCurrentPath('/') 
                  ? 'text-[#4CAF50]' 
                  : 'text-[#B3B3B3] hover:text-white'
              }`}
            >
              <div className="flex items-center space-x-2">
                <Home className="w-4 h-4" />
                <span>Home</span>
              </div>
            </Link>
            
            <Link 
              to="/about" 
              className={`text-sm font-medium transition-colors duration-200 ${
                isCurrentPath('/about') 
                  ? 'text-[#4CAF50]' 
                  : 'text-[#B3B3B3] hover:text-white'
              }`}
            >
              <div className="flex items-center space-x-2">
                <Info className="w-4 h-4" />
                <span>About</span>
              </div>
            </Link>
            
            <Link 
              to="/features" 
              className={`text-sm font-medium transition-colors duration-200 ${
                isCurrentPath('/features') 
                  ? 'text-[#4CAF50]' 
                  : 'text-[#B3B3B3] hover:text-white'
              }`}
            >
              <div className="flex items-center space-x-2">
                <Zap className="w-4 h-4" />
                <span>Features</span>
              </div>
            </Link>
            
            <Link 
              to="/blog" 
              className={`text-sm font-medium transition-colors duration-200 ${
                isCurrentPath('/blog') 
                  ? 'text-[#4CAF50]' 
                  : 'text-[#B3B3B3] hover:text-white'
              }`}
            >
              <div className="flex items-center space-x-2">
                <BookOpen className="w-4 h-4" />
                <span>Blog</span>
              </div>
            </Link>
            
            <Link 
              to="/contact" 
              className={`text-sm font-medium transition-colors duration-200 ${
                isCurrentPath('/contact') 
                  ? 'text-[#4CAF50]' 
                  : 'text-[#B3B3B3] hover:text-white'
              }`}
            >
              <div className="flex items-center space-x-2">
                <Mail className="w-4 h-4" />
                <span>Contact</span>
              </div>
            </Link>
          </nav>

          {/* Actions */}
          <div className="flex items-center space-x-4">
            <button className="hidden sm:inline-flex items-center px-6 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-[#4CAF50] to-[#45a049] rounded-lg hover:from-[#45a049] hover:to-[#4CAF50] transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105">
              <Download className="w-4 h-4 mr-2" />
              <span>Download App</span>
            </button>

            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-[#B3B3B3] hover:text-white hover:bg-[#333333]/60 transition-colors duration-200"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className={`lg:hidden fixed inset-x-0 top-16 bg-[#1E1E1E]/95 backdrop-blur-lg border-b border-[#333333]/50 transition-all duration-300 ${
        isMenuOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4 pointer-events-none'
      }`}>
        <nav className="px-4 py-4 space-y-3">
          <Link 
            to="/" 
            onClick={() => setIsMenuOpen(false)}
            className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors duration-200 ${
              isCurrentPath('/') 
                ? 'bg-[#4CAF50]/20 text-[#4CAF50]' 
                : 'text-[#B3B3B3] hover:text-white hover:bg-[#333333]/60'
            }`}
          >
            <Home className="w-5 h-5" />
            <span className="font-medium">Home</span>
          </Link>
          
          <Link 
            to="/about" 
            onClick={() => setIsMenuOpen(false)}
            className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors duration-200 ${
              isCurrentPath('/about') 
                ? 'bg-[#4CAF50]/20 text-[#4CAF50]' 
                : 'text-[#B3B3B3] hover:text-white hover:bg-[#333333]/60'
            }`}
          >
            <Info className="w-5 h-5" />
            <span className="font-medium">About</span>
          </Link>
          
          <Link 
            to="/features" 
            onClick={() => setIsMenuOpen(false)}
            className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors duration-200 ${
              isCurrentPath('/features') 
                ? 'bg-[#4CAF50]/20 text-[#4CAF50]' 
                : 'text-[#B3B3B3] hover:text-white hover:bg-[#333333]/60'
            }`}
          >
            <Zap className="w-5 h-5" />
            <span className="font-medium">Features</span>
          </Link>
          
          <Link 
            to="/blog" 
            onClick={() => setIsMenuOpen(false)}
            className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors duration-200 ${
              isCurrentPath('/blog') 
                ? 'bg-[#4CAF50]/20 text-[#4CAF50]' 
                : 'text-[#B3B3B3] hover:text-white hover:bg-[#333333]/60'
            }`}
          >
            <BookOpen className="w-5 h-5" />
            <span className="font-medium">Blog</span>
          </Link>
          
          <Link 
            to="/contact" 
            onClick={() => setIsMenuOpen(false)}
            className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors duration-200 ${
              isCurrentPath('/contact') 
                ? 'bg-[#4CAF50]/20 text-[#4CAF50]' 
                : 'text-[#B3B3B3] hover:text-white hover:bg-[#333333]/60'
            }`}
          >
            <Mail className="w-5 h-5" />
            <span className="font-medium">Contact</span>
          </Link>
          
          <div className="pt-4 mt-4 border-t border-[#333333]/50">
            <button 
              onClick={() => setIsMenuOpen(false)}
              className="w-full flex items-center justify-center px-6 py-3 text-sm font-semibold text-white bg-gradient-to-r from-[#4CAF50] to-[#45a049] rounded-lg hover:from-[#45a049] hover:to-[#4CAF50] transition-all duration-200"
            >
              <Download className="w-4 h-4 mr-2" />
              Download App
            </button>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;
