import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'
import Sidebar from './components/Sidebar'
import Home from './pages/Home'
import About from './pages/About'
import Features from './pages/Features'
import Blog from './pages/Blog'
import BlogPost from './pages/BlogPost'
import Contact from './pages/Contact'
import EyeHealthInsights from './pages/EyeHealthInsights'
import './App.css'

function AppContent() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [currentSection, setCurrentSection] = useState('hero')
  const location = useLocation()
  const isHomePage = location.pathname === '/'

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
      <Header />

      {}
      <Sidebar 
        isOpen={isSidebarOpen} 
        setIsOpen={setIsSidebarOpen} 
        currentSection={currentSection}
        onSectionChange={setCurrentSection}
      />

      {}
      <div className={`flex-1 transition-all duration-300 ease-in-out ${
        isSidebarOpen
          ? 'lg:ml-80' 
          : 'lg:ml-20'
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
        </Routes>

        {}
        <Footer />
      </div>
    </div>
  )
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  )
}

export default App
