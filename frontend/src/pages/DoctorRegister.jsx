import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { registerDoctor } from '../utils/api';

const DoctorRegister = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    specialization: '',
    licenseNumber: '',
    experience: '',
    hospital: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
    setSuccess('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setIsLoading(false);
      return;
    }

    // Validate password length
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      setIsLoading(false);
      return;
    }

    try {
      const doctorData = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        specialization: formData.specialization,
        licenseNumber: formData.licenseNumber,
        experience: formData.experience ? parseInt(formData.experience) : 0,
        hospital: formData.hospital
      };

      const response = await registerDoctor(doctorData);
      
      if (response.success) {
        setSuccess('Registration successful! Your account is awaiting admin verification. You will be notified once approved.');
        
        // Clear form
        setFormData({
          name: '',
          email: '',
          password: '',
          confirmPassword: '',
          specialization: '',
          licenseNumber: '',
          experience: '',
          hospital: ''
        });

        // Redirect to login after 3 seconds
        setTimeout(() => {
          navigate('/admin/login');
        }, 3000);
      }
    } catch (error) {
      setError(
        error.response?.data?.message || 
        'Registration failed. Please check your information and try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#121212] to-[#1a1a1a] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <Link to="/" className="inline-block">
            <h1 className="text-3xl font-bold text-white mb-2">BlinkFit</h1>
            <p className="text-blue-400 text-sm">AI-Powered Eye Health</p>
          </Link>
          <h2 className="mt-8 text-2xl font-bold text-white">
            Doctor Registration
          </h2>
          <p className="mt-2 text-sm text-gray-400">
            Join our platform to share your expertise
          </p>
        </div>

        {/* Form */}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            {/* Personal Information */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">
                Full Name *
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                className="appearance-none relative block w-full px-3 py-3 bg-gray-800 border border-gray-700 placeholder-gray-500 text-white rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Dr. John Smith"
                value={formData.name}
                onChange={handleChange}
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
                Email Address *
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="appearance-none relative block w-full px-3 py-3 bg-gray-800 border border-gray-700 placeholder-gray-500 text-white rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="john.smith@example.com"
                value={formData.email}
                onChange={handleChange}
              />
            </div>

            {/* Password Fields */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1">
                Password *
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="appearance-none relative block w-full px-3 py-3 bg-gray-800 border border-gray-700 placeholder-gray-500 text-white rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Enter password (min. 6 characters)"
                value={formData.password}
                onChange={handleChange}
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300 mb-1">
                Confirm Password *
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                className="appearance-none relative block w-full px-3 py-3 bg-gray-800 border border-gray-700 placeholder-gray-500 text-white rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Confirm your password"
                value={formData.confirmPassword}
                onChange={handleChange}
              />
            </div>

            {/* Professional Information */}
            <div>
              <label htmlFor="specialization" className="block text-sm font-medium text-gray-300 mb-1">
                Specialization *
              </label>
              <input
                id="specialization"
                name="specialization"
                type="text"
                required
                className="appearance-none relative block w-full px-3 py-3 bg-gray-800 border border-gray-700 placeholder-gray-500 text-white rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Ophthalmology, Optometry, etc."
                value={formData.specialization}
                onChange={handleChange}
              />
            </div>

            <div>
              <label htmlFor="licenseNumber" className="block text-sm font-medium text-gray-300 mb-1">
                License Number *
              </label>
              <input
                id="licenseNumber"
                name="licenseNumber"
                type="text"
                required
                className="appearance-none relative block w-full px-3 py-3 bg-gray-800 border border-gray-700 placeholder-gray-500 text-white rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Your medical license number"
                value={formData.licenseNumber}
                onChange={handleChange}
              />
            </div>

            <div>
              <label htmlFor="experience" className="block text-sm font-medium text-gray-300 mb-1">
                Years of Experience
              </label>
              <input
                id="experience"
                name="experience"
                type="number"
                min="0"
                max="50"
                className="appearance-none relative block w-full px-3 py-3 bg-gray-800 border border-gray-700 placeholder-gray-500 text-white rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="5"
                value={formData.experience}
                onChange={handleChange}
              />
            </div>

            <div>
              <label htmlFor="hospital" className="block text-sm font-medium text-gray-300 mb-1">
                Hospital/Clinic
              </label>
              <input
                id="hospital"
                name="hospital"
                type="text"
                className="appearance-none relative block w-full px-3 py-3 bg-gray-800 border border-gray-700 placeholder-gray-500 text-white rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="City General Hospital"
                value={formData.hospital}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="rounded-md bg-red-900/50 border border-red-700 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-300">{error}</p>
                </div>
              </div>
            </div>
          )}

          {/* Success Message */}
          {success && (
            <div className="rounded-md bg-green-900/50 border border-green-700 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-green-300">{success}</p>
                </div>
              </div>
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition duration-200"
            >
              {isLoading ? (
                <div className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Registering...
                </div>
              ) : (
                'Register as Doctor'
              )}
            </button>
          </div>

          <div className="text-center">
            <div className="text-sm">
              <span className="text-gray-400">Already have an account? </span>
              <Link
                to="/admin/login"
                className="font-medium text-blue-600 hover:text-blue-500"
              >
                Sign in here
              </Link>
            </div>
            <div className="mt-2 text-sm">
              <Link
                to="/"
                className="font-medium text-gray-600 hover:text-gray-500"
              >
                ← Back to website
              </Link>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DoctorRegister;
