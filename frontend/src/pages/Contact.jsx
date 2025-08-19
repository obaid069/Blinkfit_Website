import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  CheckCircle,
  AlertCircle,
  MessageSquare,
  HelpCircle,
  Bug,
  Lightbulb,
  Star,
  User
} from 'lucide-react';
import { submitContactForm } from '../utils/api';

const Contact = () => {
  const [submitStatus, setSubmitStatus] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch
  } = useForm();

  const watchedType = watch('type', 'general');

  const contactTypes = [
    { value: 'general', label: 'General Inquiry', icon: MessageSquare },
    { value: 'support', label: 'Technical Support', icon: HelpCircle },
    { value: 'bug', label: 'Bug Report', icon: Bug },
    { value: 'feature', label: 'Feature Request', icon: Lightbulb },
    { value: 'feedback', label: 'Feedback', icon: Star }
  ];

  const contactInfo = [
    {
      icon: Mail,
      title: 'Email',
      details: 'support@blinkfit.com',
      description: 'Send us an email anytime!'
    },
    {
      icon: Phone,
      title: 'Phone',
      details: '+1 (555) 123-4567',
      description: 'Mon-Fri from 8am to 5pm.'
    },
    {
      icon: MapPin,
      title: 'Address',
      details: '123 Health Tech Ave, San Francisco, CA 94102',
      description: 'Come say hello at our HQ.'
    },
    {
      icon: Clock,
      title: 'Working Hours',
      details: 'Monday - Friday: 8am - 5pm PST',
      description: 'Saturday - Sunday: Closed'
    }
  ];

  const faqItems = [
    {
      question: 'How does BlinkFit detect my blink rate?',
      answer: 'BlinkFit uses advanced computer vision and AI technology to analyze your eye movements through your device camera. All processing is done locally for privacy.'
    },
    {
      question: 'Is my camera data stored or shared?',
      answer: 'No, absolutely not. All camera processing happens locally on your device. We never store, transmit, or share any camera data.'
    },
    {
      question: 'What devices does BlinkFit support?',
      answer: 'BlinkFit works on Windows, Mac, Linux, iOS, and Android devices. We also have browser extensions for Chrome, Firefox, and Safari.'
    },
    {
      question: 'How much does BlinkFit cost?',
      answer: 'BlinkFit offers a free tier with basic features. Premium plans start at $9.99/month with advanced analytics and personalized recommendations.'
    },
    {
      question: 'Can I use BlinkFit without a camera?',
      answer: 'Some features like break reminders and eye exercises work without a camera, but real-time blink detection requires camera access for optimal functionality.'
    },
    {
      question: 'How accurate is the blink detection?',
      answer: 'Our AI achieves 99.5% accuracy in blink detection under normal lighting conditions. Accuracy may vary in very low light or with certain webcam models.'
    }
  ];

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      await submitContactForm(data);
      setSubmitStatus('success');
      reset();
    } catch (error) {
      setSubmitStatus('error');
      console.error('Error submitting form:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

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
              className="text-4xl md:text-5xl font-bold text-white mb-6"
            >
              Get in <span className="text-[#4CAF50]">Touch</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-xl text-[#B3B3B3] max-w-3xl mx-auto"
            >
              Have questions about BlinkFit? Need help with the app? 
              We're here to help you on your eye health journey.
            </motion.p>
          </div>
        </div>
      </section>

      {}
      <section className="py-16 bg-[#121212]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-3 lg:gap-16">
            {}
            <div className="lg:col-span-2">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                className="bg-[#1E1E1E] border border-[#333333] rounded-lg shadow-lg p-8"
              >
                <h2 className="text-2xl font-bold text-white mb-8">Send us a message</h2>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  {}
                  <div>
                    <label className="block text-sm font-medium text-white mb-3">
                      What can we help you with?
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {contactTypes.map((type) => {
                        const IconComponent = type.icon;
                        return (
                          <label
                            key={type.value}
                            className={`relative flex items-center p-3 border rounded-lg cursor-pointer transition-all duration-200 ${
                              watchedType === type.value
                                ? 'border-[#4CAF50] bg-[#4CAF50] bg-opacity-20'
                                : 'border-[#333333] hover:border-[#4CAF50]'
                            }`}
                          >
                            <input
                              type="radio"
                              value={type.value}
                              {...register('type', { required: 'Please select a contact type' })}
                              className="sr-only"
                            />
                            <IconComponent className="w-5 h-5 text-[#B3B3B3] mr-2" />
                            <span className="text-sm font-medium text-white">
                              {type.label}
                            </span>
                          </label>
                        );
                      })}
                    </div>
                    {errors.type && (
                      <p className="mt-2 text-sm text-red-600">{errors.type.message}</p>
                    )}
                  </div>

                  {}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-white mb-2">
                        Full Name
                      </label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="text"
                          id="name"
                          {...register('name', { 
                            required: 'Name is required',
                            minLength: { value: 2, message: 'Name must be at least 2 characters' }
                          })}
                          className="w-full pl-10 pr-4 py-3 border border-[#333333] bg-[#121212] text-white rounded-lg focus:ring-2 focus:ring-[#4CAF50] focus:border-transparent"
                          placeholder="Your full name"
                        />
                      </div>
                      {errors.name && (
                        <p className="mt-2 text-sm text-red-600">{errors.name.message}</p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-white mb-2">
                        Email Address
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="email"
                          id="email"
                          {...register('email', {
                            required: 'Email is required',
                            pattern: {
                              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                              message: 'Invalid email address'
                            }
                          })}
                          className="w-full pl-10 pr-4 py-3 border border-[#333333] bg-[#121212] text-white rounded-lg focus:ring-2 focus:ring-[#4CAF50] focus:border-transparent"
                          placeholder="your@email.com"
                        />
                      </div>
                      {errors.email && (
                        <p className="mt-2 text-sm text-red-600">{errors.email.message}</p>
                      )}
                    </div>
                  </div>

                  {}
                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-white mb-2">
                      Subject
                    </label>
                    <input
                      type="text"
                      id="subject"
                      {...register('subject', { 
                        required: 'Subject is required',
                        minLength: { value: 5, message: 'Subject must be at least 5 characters' }
                      })}
                      className="w-full px-4 py-3 border border-[#333333] bg-[#121212] text-white rounded-lg focus:ring-2 focus:ring-[#4CAF50] focus:border-transparent"
                      placeholder="Brief description of your message"
                    />
                    {errors.subject && (
                      <p className="mt-2 text-sm text-red-600">{errors.subject.message}</p>
                    )}
                  </div>

                  {}
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-white mb-2">
                      Message
                    </label>
                    <textarea
                      id="message"
                      rows={6}
                      {...register('message', { 
                        required: 'Message is required',
                        minLength: { value: 10, message: 'Message must be at least 10 characters' }
                      })}
                      className="w-full px-4 py-3 border border-[#333333] bg-[#121212] text-white rounded-lg focus:ring-2 focus:ring-[#4CAF50] focus:border-transparent"
                      placeholder="Tell us more about your inquiry..."
                    />
                    {errors.message && (
                      <p className="mt-2 text-sm text-red-600">{errors.message.message}</p>
                    )}
                  </div>

                  {}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-[#4CAF50] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#45a049] focus:outline-none focus:ring-2 focus:ring-[#4CAF50] disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 flex items-center justify-center"
                  >
                    {isSubmitting ? (
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    ) : (
                      <Send className="w-5 h-5 mr-2" />
                    )}
                    {isSubmitting ? 'Sending...' : 'Send Message'}
                  </button>

                  {}
                  {submitStatus === 'success' && (
                    <div className="flex items-center p-4 bg-green-50 border border-green-200 rounded-lg">
                      <CheckCircle className="w-5 h-5 text-green-600 mr-3" />
                      <p className="text-green-700">
                        Thank you! Your message has been sent successfully. We'll get back to you within 24 hours.
                      </p>
                    </div>
                  )}

                  {submitStatus === 'error' && (
                    <div className="flex items-center p-4 bg-red-50 border border-red-200 rounded-lg">
                      <AlertCircle className="w-5 h-5 text-red-600 mr-3" />
                      <p className="text-red-700">
                        Sorry, there was an error sending your message. Please try again or contact us directly.
                      </p>
                    </div>
                  )}
                </form>
              </motion.div>
            </div>

            {}
            <div className="mt-12 lg:mt-0">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="space-y-8"
              >
                <div>
                  <h3 className="text-xl font-semibold text-white mb-6">
                    Get in touch
                  </h3>
                  <div className="space-y-6">
                    {contactInfo.map((item, index) => {
                      const IconComponent = item.icon;
                      return (
                        <motion.div
                          key={item.title}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
                          className="flex items-start"
                        >
                          <div className="w-10 h-10 bg-[#4CAF50] bg-opacity-20 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                            <IconComponent className="w-5 h-5 text-[#4CAF50]" />
                          </div>
                          <div>
                            <h4 className="font-semibold text-white mb-1">
                              {item.title}
                            </h4>
                            <p className="text-[#B3B3B3] mb-1">
                              {item.details}
                            </p>
                            <p className="text-[#B3B3B3] text-sm">
                              {item.description}
                            </p>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>

                {}
                <div className="bg-[#1E1E1E] border border-[#333333] rounded-lg p-6">
                  <h4 className="font-semibold text-white mb-4">Need quick help?</h4>
                  <div className="space-y-3">
                    <a
                      href="#faq"
                      className="block text-[#4CAF50] hover:text-[#45a049] font-medium"
                    >
                      Check our FAQ â†’
                    </a>
                    <a
                      href="/blog"
                      className="block text-[#4CAF50] hover:text-[#45a049] font-medium"
                    >
                      Browse help articles â†’
                    </a>
                    <a
                      href="https:
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block text-[#4CAF50] hover:text-[#45a049] font-medium"
                    >
                      View documentation â†’
                    </a>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {}
      <section id="faq" className="py-16 bg-[#1E1E1E]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-[#B3B3B3]">
              Find answers to common questions about BlinkFit
            </p>
          </motion.div>

          <div className="space-y-6">
            {faqItems.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-[#121212] border border-[#333333] rounded-lg shadow-sm p-6"
              >
                <h3 className="text-lg font-semibold text-white mb-3">
                  {item.question}
                </h3>
                <p className="text-[#B3B3B3] leading-relaxed">
                  {item.answer}
                </p>
              </motion.div>
            ))}
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
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-white mb-4">
              Visit Our Office
            </h2>
            <p className="text-[#B3B3B3]">
              Located in the heart of San Francisco's tech district
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="bg-[#1E1E1E] border border-[#333333] rounded-lg h-96 flex items-center justify-center"
          >
            <div className="text-center">
              <MapPin className="w-16 h-16 text-[#333333] mx-auto mb-4" />
              <p className="text-[#B3B3B3]">Interactive map coming soon</p>
              <p className="text-sm text-[#B3B3B3] mt-2">
                123 Health Tech Ave, San Francisco, CA 94102
              </p>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
