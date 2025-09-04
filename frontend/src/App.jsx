import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'
import Sidebar from './components/Sidebar'
import BlogNavbar from './components/BlogNavbar'
import Home from './pages/Home'
import About from './pages/About'
import Features from './pages/Features'
import Blog from './pages/Blog'
import BlogPost from './pages/BlogPost'
import Contact from './pages/Contact'
import EyeHealthInsights from './pages/EyeHealthInsights'
import DoctorLogin from './pages/DoctorLogin'
import DoctorSignup from './pages/DoctorSignup'
import DoctorDashboard from './pages/DoctorDashboard'
import BlogPreview from './pages/BlogPreview'
import AdminLogin from './pages/AdminLogin'
import AdminDashboard from './pages/AdminDashboard'
import BlogManagement from './pages/BlogManagement'
import BlogDetail from './pages/BlogDetail'
import './App.css'

function AppContent() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [currentSection, setCurrentSection] = useState('hero')
  const location = useLocation()
  const isHomePage = location.pathname === '/'
  
  // Check if current path is an auth/dashboard page
  const isAuthPage = location.pathname.startsWith('/doctor/') || location.pathname.startsWith('/admin/')
  
  // Check if current path should show blog navbar (blog and insights pages)
  const isBlogPage = location.pathname.startsWith('/blog') || location.pathname.startsWith('/insights')
  
  // Determine which layout to use
  const isMainWebsite = !isAuthPage && !isBlogPage
  const showBlogNavbar = isBlogPage && !isAuthPage

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setIsSidebarOpen(false)
      } else {
        setIsSidebarOpen(true)
      }
    }

    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth'
    })
  }, [location.pathname])

  return (
    <div className="min-h-screen bg-[#121212] relative flex flex-col">
      {/* Show header and sidebar only on main website pages */}
      {isMainWebsite && <Header />}
      
      {/* Show blog navbar on blog and insights pages */}
      {showBlogNavbar && <BlogNavbar />}

      {/* Show sidebar on all non-auth pages */}
      {(isMainWebsite || showBlogNavbar) && (
        <Sidebar 
          isOpen={isSidebarOpen} 
          setIsOpen={setIsSidebarOpen} 
          currentSection={currentSection}
          onSectionChange={setCurrentSection}
        />
      )}

      {/* Conditionally apply margin based on whether sidebar is shown */}
      <div className={`flex-1 transition-all duration-300 ease-in-out ${
        (isMainWebsite || showBlogNavbar) && isSidebarOpen
          ? 'lg:ml-80' 
          : (isMainWebsite || showBlogNavbar)
          ? 'lg:ml-20'
          : ''
      }`}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/features" element={<Features />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:slug" element={<BlogPost />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/insights" element={<EyeHealthInsights />} />
          <Route path="/insights/:id" element={<BlogPost />} />
          
          {/* Authentication Routes */}
          <Route path="/doctor/login" element={<DoctorLogin />} />
          <Route path="/doctor/signup" element={<DoctorSignup />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          
          {/* Legacy route for backward compatibility */}
          <Route path="/doctor/register" element={<DoctorSignup />} />
          
          {/* Dashboard Routes */}
          <Route path="/doctor/dashboard" element={<DoctorDashboard />} />
          <Route path="/doctor/blog/preview/:id" element={<BlogPreview />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          
          {/* Doctor Blog Management Routes */}
          <Route path="/doctor/blogs/create" element={<BlogManagement />} />
          <Route path="/doctor/blogs/edit/:id" element={<BlogManagement />} />
          <Route path="/doctor/blogs/manage" element={<BlogManagement />} />
          <Route path="/doctor/blog-management" element={<BlogManagement />} />
          
          {/* Protected Admin Blog Management Routes */}
          <Route path="/admin/blog-management" element={<BlogManagement />} />
          <Route path="/admin/blog-detail" element={<BlogDetail />} />
        </Routes>

        {/* Show footer on main website pages and blog pages */}
        {(isMainWebsite || showBlogNavbar) && <Footer />}
      </div>
    </div>
  )
}

function App() {
  return (
    <Router 
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true
      }}
    >
      <AppContent />
    </Router>
  )
}

export default App
