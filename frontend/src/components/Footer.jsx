import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Eye, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin, Send } from 'lucide-react';
import { subscribeToNewsletter } from '../utils/api';

const Footer = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleNewsletterSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;

    setIsLoading(true);
    setMessage('');

    try {
      await subscribeToNewsletter(email);
      setMessage('Thank you for subscribing to our newsletter!');
      setEmail('');
    } catch (error) {
      setMessage(error.response?.data?.message || 'Failed to subscribe. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const footerLinks = {
    product: [
      { name: 'Features', href: '/features' },
      { name: 'How it Works', href: '/features' },
      { name: 'Pricing', href: '/features' },
      { name: 'Download', href: '#' },
    ],
    company: [
      { name: 'About Us', href: '/about' },
      { name: 'Blog', href: '/blog' },
      { name: 'Contact', href: '/contact' },
      { name: 'Privacy Policy', href: '/privacy' },
    ],
    support: [
      { name: 'Help Center', href: '/contact' },
      { name: 'Community', href: '/blog' },
      { name: 'Bug Report', href: '/contact' },
      { name: 'Feature Request', href: '/contact' },
    ],
  };

  const socialLinks = [
    { name: 'Facebook', icon: Facebook, href: '#' },
    { name: 'Twitter', icon: Twitter, href: '#' },
    { name: 'Instagram', icon: Instagram, href: '#' },
    { name: 'LinkedIn', icon: Linkedin, href: '#' },
  ];

  return (
    <footer className="bg-[#1A1A1A] text-white border-t-2 border-[#4CAF50] w-full relative z-10 ">
      {/* Main Footer */}
      <div className="w-full px-6 sm:px-8 lg:px-12 py-12 lg:py-16">
        <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Company Info */}
          <div className="col-span-1 lg:col-span-1">
            <div className="flex items-center space-x-2 mb-4">
              <Eye className="w-8 h-8 text-[#4CAF50]" />
              <span className="text-xl font-bold">BlinkFit</span>
            </div>
            <p className="text-[#B3B3B3] mb-6 text-base leading-7">
              AI-powered eye health monitoring that protects your vision in the digital age. 
              Smart, proactive, and personalized eye care.
            </p>
            
            {/* Contact Info */}
            <div className="space-y-2">
              <div className="flex items-center text-sm text-[#B3B3B3]">
                <Mail className="w-4 h-4 mr-2" />
                <span>info@blinkfit.com</span>
              </div>
              <div className="flex items-center text-sm text-[#B3B3B3]">
                <Phone className="w-4 h-4 mr-2" />
                <span>+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center text-sm text-[#B3B3B3]">
                <MapPin className="w-4 h-4 mr-2" />
                <span>San Francisco, CA</span>
              </div>
            </div>
          </div>

          {/* Product Links */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-[#B3B3B3] mb-4">
              Product
            </h3>
            <ul className="space-y-2">
              {footerLinks.product.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-sm text-[#B3B3B3] hover:text-white transition-colors duration-200"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-[#B3B3B3] mb-4">
              Company
            </h3>
            <ul className="space-y-2">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-sm text-[#B3B3B3] hover:text-white transition-colors duration-200"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-[#B3B3B3] mb-4">
              Stay Updated
            </h3>
            <p className="text-sm text-[#B3B3B3] mb-4">
              Get the latest eye health tips and app updates delivered to your inbox.
            </p>
            
            <form onSubmit={handleNewsletterSubmit} className="space-y-2">
              <div className="flex">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="flex-1 px-3 py-2 text-sm bg-[#121212] border border-[#333333] rounded-l-md focus:outline-none focus:ring-2 focus:ring-[#4CAF50] focus:border-transparent text-white"
                  required
                />
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-3 py-2 bg-[#4CAF50] hover:bg-[#45a049] rounded-r-md transition-colors duration-200 disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
              {message && (
                <p className={`text-xs ${message.includes('Thank you') ? 'text-green-400' : 'text-red-400'}`}>
                  {message}
                </p>
              )}
            </form>

            {/* Social Links */}
            <div className="mt-6">
              <h4 className="text-sm font-semibold text-[#B3B3B3] mb-3">Follow Us</h4>
              <div className="flex space-x-3">
                {socialLinks.map((social) => {
                  const Icon = social.icon;
                  return (
                    <a
                      key={social.name}
                      href={social.href}
                      className="text-[#B3B3B3] hover:text-[#4CAF50] transition-colors duration-200"
                      aria-label={social.name}
                    >
                      <Icon className="w-5 h-5" />
                    </a>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-[#333333] w-full bg-[#121212]">
        <div className="max-w-7xl mx-auto w-full px-6 sm:px-8 lg:px-12 py-8">
          <div className="md:flex md:items-center md:justify-between">
            <div className="text-sm text-[#B3B3B3]">
              © {new Date().getFullYear()} BlinkFit. All rights reserved.
            </div>
            <div className="mt-4 md:mt-0">
              <div className="flex space-x-6 text-sm text-[#B3B3B3]">
                <Link to="/privacy" className="hover:text-[#4CAF50] transition-colors duration-200">
                  Privacy Policy
                </Link>
                <Link to="/terms" className="hover:text-[#4CAF50] transition-colors duration-200">
                  Terms of Service
                </Link>
                <Link to="/cookies" className="hover:text-[#4CAF50] transition-colors duration-200">
                  Cookie Policy
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
