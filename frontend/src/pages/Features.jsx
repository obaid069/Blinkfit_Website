import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Eye,
  Brain,
  Clock,
  Shield,
  Zap,
  TrendingUp,
  Bell,
  Settings,
  BarChart3,
  Target,
  Moon,
  Smartphone,
  Monitor,
  Activity,
  CheckCircle,
  Play,
  Pause,
  Heart
} from 'lucide-react';

const Features = () => {
  const [activeTab, setActiveTab] = useState('detection');
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);

  const mainFeatures = [
    {
      icon: Eye,
      title: 'AI-Powered Blink Detection',
      description: 'Advanced computer vision technology tracks your blink rate in real-time using your device camera.',
      benefits: ['Real-time monitoring', 'High accuracy rate', 'Privacy-first design', 'Works on any device']
    },
    {
      icon: Brain,
      title: 'Smart Eye Exercise Recommendations',
      description: 'Personalized exercise routines based on your usage patterns and eye health needs.',
      benefits: ['Customized workouts', 'Progress tracking', 'Expert-designed exercises', 'Adaptive difficulty']
    },
    {
      icon: Bell,
      title: 'Intelligent Break Reminders',
      description: 'Smart notifications that adapt to your work patterns and remind you to take healthy breaks.',
      benefits: ['Context-aware alerts', 'Customizable timing', 'Non-intrusive design', 'Productivity focused']
    },
    {
      icon: BarChart3,
      title: 'Comprehensive Analytics',
      description: 'Detailed insights into your digital eye health with trends, patterns, and improvement suggestions.',
      benefits: ['Weekly/monthly reports', 'Health trend analysis', 'Performance metrics', 'Goal tracking']
    }
  ];

  const detailedFeatures = {
    detection: {
      title: 'Advanced Blink Detection',
      description: 'Our AI uses cutting-edge computer vision to monitor your blink patterns',
      image: 'https://images.unsplash.com/photo-1582719371630-6dcab80043e5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
      features: [
        { icon: Target, title: 'Precision Tracking', desc: '99.5% accuracy in blink detection' },
        { icon: Shield, title: 'Privacy First', desc: 'All processing happens locally on your device' },
        { icon: Zap, title: 'Real-time Analysis', desc: 'Instant feedback on your blink patterns' },
        { icon: Activity, title: 'Continuous Monitoring', desc: 'Works seamlessly in the background' }
      ]
    },
    exercises: {
      title: 'Personalized Eye Exercises',
      description: 'Science-backed exercises tailored to your specific needs',
      image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
      features: [
        { icon: Brain, title: 'AI-Powered Recommendations', desc: 'Exercises adapted to your specific needs' },
        { icon: TrendingUp, title: 'Progressive Training', desc: 'Difficulty adjusts based on your progress' },
        { icon: Clock, title: 'Time-Efficient', desc: 'Quick 2-5 minute exercise sessions' },
        { icon: CheckCircle, title: 'Proven Results', desc: 'Based on clinical eye care research' }
      ]
    },
    analytics: {
      title: 'Comprehensive Analytics',
      description: 'Detailed insights to track and improve your eye health',
      image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
      features: [
        { icon: BarChart3, title: 'Detailed Reports', desc: 'Weekly and monthly eye health summaries' },
        { icon: TrendingUp, title: 'Trend Analysis', desc: 'Track improvements over time' },
        { icon: Target, title: 'Goal Setting', desc: 'Set and achieve personal health targets' },
        { icon: Settings, title: 'Custom Metrics', desc: 'Track what matters most to you' }
      ]
    },
    integration: {
      title: 'Seamless Integration',
      description: 'Works perfectly across all your devices and platforms',
      image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
      features: [
        { icon: Monitor, title: 'Desktop Integration', desc: 'Native apps for Windows, Mac, and Linux' },
        { icon: Smartphone, title: 'Mobile Apps', desc: 'Full-featured iOS and Android apps' },
        { icon: Moon, title: 'Dark Mode Support', desc: 'Easy on the eyes during night work' },
        { icon: Settings, title: 'System Integration', desc: 'Works with your existing workflow' }
      ]
    }
  };

  const tabs = [
    { id: 'detection', label: 'AI Detection', icon: Eye },
    { id: 'exercises', label: 'Eye Exercises', icon: Activity },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'integration', label: 'Integration', icon: Settings }
  ];

  const testimonials = [
    {
      quote: "BlinkFit completely changed how I work. No more dry eyes at the end of long coding sessions!",
      author: "Sarah M.",
      role: "Software Developer"
    },
    {
      quote: "The AI detection is incredibly accurate. I love how it adapts to my work patterns.",
      author: "Dr. James L.",
      role: "Researcher"
    },
    {
      quote: "Finally, an app that actually helps with eye strain. The exercises are quick and effective.",
      author: "Maria G.",
      role: "Designer"
    }
  ];

  return (
    <div className="pt-16 bg-[#121212] min-h-screen">
      {}
      <section className="bg-gradient-to-r from-[#1E1E1E] to-[#121212] py-16">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-4xl md:text-5xl font-bold text-white mb-6"
            >
              Powerful Features for <span className="text-[#4CAF50]">Better Eye Health</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-xl text-[#B3B3B3] max-w-3xl mx-auto"
            >
              Discover how BlinkFit's advanced AI technology and personalized approach 
              can transform your digital wellness experience.
            </motion.p>
          </div>

          {}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 mb-16">
            {mainFeatures.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="bg-[#1E1E1E] border border-[#333333] rounded-lg p-6 shadow-sm hover:shadow-lg transition-shadow duration-300"
                >
                  <div className="w-12 h-12 bg-[#4CAF50] bg-opacity-20 rounded-lg flex items-center justify-center mb-4">
                    {IconComponent ? (
                      <IconComponent className="w-6 h-6 text-[#4CAF50]" />
                    ) : (
                      <div className="w-6 h-6 bg-[#4CAF50] rounded-lg flex items-center justify-center text-white font-bold text-sm">
                        {feature.title.charAt(0)}
                      </div>
                    )}
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-[#B3B3B3] mb-4">
                    {feature.description}
                  </p>
                  <ul className="space-y-2">
                    {feature.benefits.map((benefit) => (
                      <li key={benefit} className="flex items-center text-sm text-[#B3B3B3]">
                        <CheckCircle className="w-4 h-4 text-[#4CAF50] mr-2 flex-shrink-0" />
                        {benefit}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              );
            })}
          </div>
        </div>
        </div>
      </section>

      {}
      <section className="py-16 bg-[#1E1E1E]">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Explore Features in Detail
            </h2>
            <p className="text-xl text-[#B3B3B3] max-w-3xl mx-auto">
              Dive deeper into BlinkFit's capabilities and see how each feature 
              contributes to your digital eye health.
            </p>
          </motion.div>

          {}
          <div className="flex flex-wrap justify-center mb-12 gap-2 px-4 sm:px-0">
            {tabs.map((tab) => {
              const IconComponent = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
                    activeTab === tab.id
                      ? 'bg-[#4CAF50] text-white shadow-lg'
                      : 'bg-[#121212] text-[#B3B3B3] hover:bg-[#333333] border border-[#333333]'
                  }`}
                >
                  <IconComponent className="w-5 h-5 mr-2" />
                  {tab.label}
                </button>
              );
            })}
          </div>

          {}
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="bg-[#121212] border border-[#333333] rounded-2xl p-8 lg:p-12"
          >
            <div className="lg:grid lg:grid-cols-2 lg:gap-16 items-center">
              <div>
                <h3 className="text-3xl font-bold text-white mb-6">
                  {detailedFeatures[activeTab].title}
                </h3>
                <p className="text-lg text-[#B3B3B3] mb-8">
                  {detailedFeatures[activeTab].description}
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {detailedFeatures[activeTab].features.map((item, index) => {
                    const IconComponent = item.icon;
                    return (
                      <motion.div
                        key={item.title}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4, delay: index * 0.1 }}
                        className="flex items-start"
                      >
                        <div className="w-10 h-10 bg-[#4CAF50] bg-opacity-20 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                          <IconComponent className="w-5 h-5 text-[#4CAF50]" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-white mb-1">
                            {item.title}
                          </h4>
                          <p className="text-[#B3B3B3] text-sm">
                            {item.desc}
                          </p>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>

              <div className="mt-12 lg:mt-0 relative">
                <div className="relative">
                  <img
                    src={detailedFeatures[activeTab].image}
                    alt={detailedFeatures[activeTab].title}
                    className="rounded-lg shadow-lg w-full"
                  />
                  {activeTab === 'detection' && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <button
                        onClick={() => setIsVideoPlaying(!isVideoPlaying)}
                        className="w-16 h-16 bg-white bg-opacity-90 rounded-full flex items-center justify-center shadow-lg hover:bg-opacity-100 transition-all duration-200"
                      >
                        {isVideoPlaying ? (
                          <Pause className="w-8 h-8 text-[#4CAF50]" />
                        ) : (
                          <Play className="w-8 h-8 text-[#4CAF50] ml-1" />
                        )}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
        </div>
      </section>

      {}
      <section className="py-16 bg-[#121212]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              How BlinkFit Works
            </h2>
            <p className="text-xl text-[#B3B3B3] max-w-3xl mx-auto">
              A simple three-step process to better eye health
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: '1',
                title: 'Install & Setup',
                description: 'Download the app and complete a quick 2-minute setup to calibrate the AI for your eyes.',
                icon: Settings
              },
              {
                step: '2',
                title: 'AI Monitoring',
                description: 'BlinkFit runs quietly in the background, tracking your blink patterns and screen time.',
                icon: Eye
              },
              {
                step: '3',
                title: 'Personalized Care',
                description: 'Receive smart reminders, exercise recommendations, and insights tailored to your needs.',
                icon: Heart
              }
            ].map((item, index) => {
              const IconComponent = item.icon;
              return (
                <motion.div
                  key={item.step}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
                  className="text-center"
                >
                  <div className="relative mb-8">
                    <div className="w-20 h-20 bg-[#4CAF50] rounded-full flex items-center justify-center mx-auto mb-4">
                      <IconComponent className="w-10 h-10 text-white" />
                    </div>
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-white border-2 border-[#4CAF50] rounded-full flex items-center justify-center font-bold text-[#4CAF50]">
                      {item.step}
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-4">
                    {item.title}
                  </h3>
                  <p className="text-[#B3B3B3]">
                    {item.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {}
      <section className="py-16 bg-[#1E1E1E]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              What Our Users Say
            </h2>
            <p className="text-xl text-[#B3B3B3] max-w-3xl mx-auto">
              Real feedback from people who've transformed their digital wellness
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.author}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-[#121212] border border-[#333333] rounded-lg p-6"
              >
                <p className="text-[#B3B3B3] mb-6 italic">
                  "{testimonial.quote}"
                </p>
                <div>
                  <div className="font-semibold text-white">
                    {testimonial.author}
                  </div>
                  <div className="text-[#B3B3B3] text-sm">
                    {testimonial.role}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {}
      <section className="py-16 bg-[#4CAF50]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Ready to Experience These Features?
            </h2>
            <p className="text-xl text-green-100 mb-8 max-w-3xl mx-auto">
              Join thousands of professionals who are already protecting their eyes 
              with BlinkFit's advanced technology.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-white text-[#121212] px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-colors duration-200 flex items-center justify-center">
                <Zap className="w-5 h-5 mr-2" />
                Download Free Trial
              </button>
              <button className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-[#121212] transition-colors duration-200">
                View All Features
              </button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Features;
