import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Eye, LogIn, UserPlus, Home, Zap, Info, BookOpen, Mail, Lightbulb } from 'lucide-react';
import logo from '../assets/logo.png';

const BlogNavbar = () => {
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
          {/* Logo */}
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

          {/* Right side - Auth Buttons */}
          <div className="flex items-center space-x-3">
            <Link
              to="/doctor/login"
              className="hidden sm:inline-flex items-center px-4 py-2 text-sm font-medium text-[#B3B3B3] hover:text-white border border-[#333333] hover:border-[#4CAF50] rounded-lg transition-all duration-200 hover:bg-[#333333]/60"
            >
              <LogIn className="w-4 h-4 mr-2" />
              <span>Login</span>
            </Link>
            
            <Link
              to="/doctor/signup"
              className="hidden sm:inline-flex items-center px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-[#4CAF50] to-[#45a049] rounded-lg hover:from-[#45a049] hover:to-[#4CAF50] transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              <UserPlus className="w-4 h-4 mr-2" />
              <span>Sign Up</span>
            </Link>

            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-[#B3B3B3] hover:text-white hover:bg-[#333333]/60 transition-colors duration-200"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`lg:hidden fixed inset-x-0 top-16 bg-[#1E1E1E]/95 backdrop-blur-lg border-b border-[#333333]/50 transition-all duration-300 ${
        isMenuOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4 pointer-events-none'
      }`}>
        <nav className="px-4 py-4 space-y-2">
          <div className="text-center py-8">
            <p className="text-[#B3B3B3] text-sm mb-4">Access your account</p>
            <div className="space-y-3">
              <Link
                to="/doctor/login"
                className="w-full flex items-center justify-center px-6 py-3 text-sm font-medium text-[#B3B3B3] hover:text-white border border-[#333333] hover:border-[#4CAF50] rounded-lg transition-all duration-200 hover:bg-[#333333]/60"
                onClick={() => setIsMenuOpen(false)}
              >
                <LogIn className="w-4 h-4 mr-2" />
                Login
              </Link>
              <Link
                to="/doctor/signup"
                className="w-full flex items-center justify-center px-6 py-3 text-sm font-semibold text-white bg-gradient-to-r from-[#4CAF50] to-[#45a049] rounded-lg hover:from-[#45a049] hover:to-[#4CAF50] transition-all duration-200"
                onClick={() => setIsMenuOpen(false)}
              >
                <UserPlus className="w-4 h-4 mr-2" />
                Sign Up
              </Link>
            </div>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default BlogNavbar;
