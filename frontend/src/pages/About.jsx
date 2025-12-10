import React from 'react';
import { motion } from 'framer-motion';
import {
  Eye,
  Heart,
  Users,
  Award,
  Target,
  Lightbulb,
  Shield,
  Globe,
  Zap,
  CheckCircle
} from 'lucide-react';

const About = () => {
  const stats = [
    { label: 'Happy Users', value: '100K+', icon: Users },
    { label: 'Eye Breaks Taken', value: '5M+', icon: Eye },
    { label: 'Countries', value: '50+', icon: Globe },
    { label: 'Expert Reviews', value: '4.8/5', icon: Award }
  ];

  const values = [
    {
      icon: Heart,
      title: 'Health First',
      description: 'We prioritize your eye health and overall well-being above all else.'
    },
    {
      icon: Lightbulb,
      title: 'Innovation',
      description: 'Cutting-edge AI technology to provide personalized eye care solutions.'
    },
    {
      icon: Shield,
      title: 'Privacy',
      description: 'Your data is secure and private. We never share your information.'
    },
    {
      icon: Target,
      title: 'Precision',
      description: 'Accurate eye tracking and personalized recommendations for better results.'
    }
  ];

  const timeline = [
    {
      year: '2025',
      title: 'The Vision',
      description: 'Founded with a mission to combat digital eye strain in our increasingly digital world.'
    },
    {
      year: '2025',
      title: 'AI Development',
      description: 'Developed our proprietary AI algorithm for real-time blink detection and eye tracking.'
    },
    {
      year: '2025',
      title: 'Beta Launch',
      description: 'Successfully launched beta version with 1,000+ early adopters providing valuable feedback.'
    },
    {
      year: '2026',
      title: 'Global Expansion',
      description: 'Reached 100,000+ users worldwide and expanded to 50+ countries.'
    }
  ];

  const team = [
    {
      name: 'Dr. Sarah Chen',
      role: 'Co-Founder & Chief Medical Officer',
      image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
      bio: 'Ophthalmologist with 15+ years of experience in digital eye health research.'
    },
    {
      name: 'Michael Rodriguez',
      role: 'Co-Founder & CEO',
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
      bio: 'Tech entrepreneur passionate about using AI to improve health outcomes.'
    },
    {
      name: 'Dr. Aisha Patel',
      role: 'Head of AI Research',
      image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
      bio: 'Computer vision expert with PhD in Machine Learning and AI applications in healthcare.'
    },
    {
      name: 'James Wilson',
      role: 'Head of Product',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
      bio: 'Product strategist focused on creating intuitive and effective health applications.'
    }
  ];

  return (
    <div className="pt-16 bg-[#121212] min-h-screen">
      {}
      <section className="bg-gradient-to-r from-[#1E1E1E] to-[#121212] py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-3xl md:text-4xl font-bold text-white mb-6"
            >
              About <span className="text-[#4CAF50]">BlinkFit</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-lg text-[#B3B3B3] max-w-3xl mx-auto"
            >
              We're on a mission to protect and improve the eye health of millions 
              of people worldwide through innovative AI-powered solutions.
            </motion.p>
          </div>
        </div>
      </section>

      {}
      <section className="py-16 bg-[#1E1E1E]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => {
              const IconComponent = stat.icon;
              return (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="text-center"
                >
                  <div
                    className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4"
                    style={{ backgroundColor: '#49a74f' }}
                  >
                    {IconComponent && <IconComponent className="w-8 h-8 text-white" strokeWidth={2} style={{ strokeWidth: 2 }} />}
                  </div>
                  <div className="text-3xl md:text-4xl font-bold text-white mb-2">
                    {stat.value}
                  </div>
                  <div className="text-[#B3B3B3]">{stat.label}</div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {}
      <section className="py-16 bg-[#121212]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-2 lg:gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                Our Mission
              </h2>
              <p className="text-lg text-gray-700 mb-6">
                In today's digital world, we spend an average of 7+ hours daily looking at screens. 
                This unprecedented level of digital exposure is causing widespread eye strain, 
                dry eyes, and long-term vision problems.
              </p>
              <p className="text-lg text-[#B3B3B3] mb-6">

                BlinkFit was created to address this growing health crisis. Using advanced AI 
                and computer vision technology, we provide real-time monitoring and personalized 
                recommendations to help you maintain healthy vision habits.
              </p>
              <div className="space-y-4">
                {[
                  'Real-time blink rate monitoring',
                  'Personalized break reminders',
                  'AI-powered eye exercise recommendations',
                  'Long-term eye health tracking'
                ].map((feature, index) => (
                  <motion.div
                    key={feature}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
                    className="flex items-center"
                  >
                    <CheckCircle className="w-5 h-5 text-[#4CAF50] mr-3" />
                    <span className="text-[#B3B3B3]">{feature}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="mt-12 lg:mt-0"
            >
              <img
                src="https://images.unsplash.com/photo-1551650975-87deedd944c3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
                alt="Person using computer"
                className="rounded-lg shadow-lg w-full"
              />
            </motion.div>
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
              Our Values
            </h2>
            <p className="text-xl text-[#B3B3B3] max-w-3xl mx-auto">
              The principles that guide everything we do at BlinkFit
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => {
              const IconComponent = value.icon;
              return (
                <motion.div
                  key={value.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="text-center"
                >
                  <div
                    className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-6"
                    style={{ backgroundColor: '#49a74f' }}
                  >
                    {IconComponent && <IconComponent className="w-8 h-8 text-white" strokeWidth={2} style={{ strokeWidth: 2 }} />}
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-4">
                    {value.title}
                  </h3>
                  <p className="text-[#B3B3B3]">
                    {value.description}
                  </p>
                </motion.div>
              );
            })}
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
              Our Journey
            </h2>
            <p className="text-xl text-[#B3B3B3] max-w-3xl mx-auto">
              From vision to reality - the BlinkFit story
            </p>
          </motion.div>

          <div className="relative">
            {}
            <div className="absolute left-1/2 transform -translate-x-1/2 w-px h-full bg-[#4CAF50] bg-opacity-30"></div>

            <div className="space-y-12">
              {timeline.map((item, index) => (
                <motion.div
                  key={item.year}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
                  className={`relative flex items-center ${
                    index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'
                  }`}
                >
                  {}
                  <div className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 bg-[#4CAF50] rounded-full z-10"></div>

                  {}
                  <div className={`w-full lg:w-1/2 ${
                    index % 2 === 0 ? 'lg:pr-12' : 'lg:pl-12'
                  }`}>
                    <div className="bg-[#1E1E1E] border border-[#333333] p-6 rounded-lg shadow-sm">
                      <div className="text-[#4CAF50] font-bold text-lg mb-2">
                        {item.year}
                      </div>
                      <h3 className="text-xl font-semibold text-white mb-3">
                        {item.title}
                      </h3>
                      <p className="text-[#B3B3B3]">
                        {item.description}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
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
              Ready to Transform Your Eye Health?
            </h2>
            <p className="text-xl text-green-100 mb-8 max-w-3xl mx-auto">
              Join thousands of users who have already improved their digital wellness 
              with BlinkFit's AI-powered eye care solutions.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-white text-[#121212] px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-colors duration-200 flex items-center justify-center">
                <Zap className="w-5 h-5 mr-2" />
                Download App
              </button>
              <button className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-[#121212] transition-colors duration-200">
                Learn More
              </button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default About;
