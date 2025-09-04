import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { registerDoctor } from '../utils/api';
import logo from '../assets/logo.png';

const DoctorSignup = () => {
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
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordsMatch, setPasswordsMatch] = useState(true);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Check password match in real-time
    if (name === 'confirmPassword' || name === 'password') {
      const newFormData = { ...formData, [name]: value };
      setPasswordsMatch(
        newFormData.password === newFormData.confirmPassword || 
        newFormData.confirmPassword === ''
      );
    }
    
    setError('');
    setSuccess('');
  };

  const validatePasswordStrength = (password) => {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    if (password.length < minLength) {
      return 'Password must be at least 8 characters long';
    }
    if (!hasUpperCase) {
      return 'Password must contain at least one uppercase letter (A-Z)';
    }
    if (!hasLowerCase) {
      return 'Password must contain at least one lowercase letter (a-z)';
    }
    if (!hasNumbers) {
      return 'Password must contain at least one number (0-9)';
    }
    if (!hasSpecialChar) {
      return 'Password must contain at least one special character (!@#$%^&*)';
    }
    return null;
  };

  const validateForm = () => {
    // Check if passwords match
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }

    // Check password strength
    const passwordError = validatePasswordStrength(formData.password);
    if (passwordError) {
      setError(passwordError);
      return false;
    }

    // Check required fields
    const requiredFields = ['name', 'email', 'password', 'specialization', 'licenseNumber'];
    for (const field of requiredFields) {
      if (!formData[field].trim()) {
        setError(`${field.charAt(0).toUpperCase() + field.slice(1)} is required`);
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setError('');

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
          navigate('/doctor/login');
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
      <div className="max-w-6xl w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <Link to="/" className="inline-block">
            <div className="flex flex-col items-center space-y-4 mb-4">
              <img 
                src={logo} 
                alt="BlinkFit Logo" 
                className="w-24 h-24 object-contain"
              />
              <div>
                <h1 className="text-3xl font-bold text-white mb-1">
                  BlinkFit
                </h1>
                <p className="text-white text-sm">AI-Powered Eye Health</p>
              </div>
            </div>
          </Link>
          <h2 className="mt-6 text-2xl font-bold text-white">
            Doctor Sign Up
          </h2>
          <p className="mt-2 text-sm text-gray-400">
            Join our platform to share your expertise
          </p>
        </div>

        {/* Form */}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {/* Two Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column - Personal Information */}
            <div className="space-y-4">
              <div className="border-b border-gray-700 pb-3 mb-4">
                <h3 className="text-lg font-semibold text-white flex items-center">
                  <span className="mr-2">👤</span>
                  Personal Information
                </h3>
                <p className="text-sm text-gray-400 mt-1">Basic account details</p>
              </div>
              
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">
                  Full Name *
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  className="appearance-none relative block w-full px-3 py-3 bg-gray-800 border border-gray-700 placeholder-gray-500 text-white rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
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
                  className="appearance-none relative block w-full px-3 py-3 bg-gray-800 border border-gray-700 placeholder-gray-500 text-white rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                  placeholder="john.smith@example.com"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1">
                  Password *
                </label>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    required
                    className="appearance-none relative block w-full px-3 py-3 pr-12 bg-gray-800 border border-gray-700 placeholder-gray-500 text-white rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                    placeholder="Strong password required"
                    value={formData.password}
                    onChange={handleChange}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-white transition-colors duration-200"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                      </svg>
                    ) : (
                      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>
                {/* Password Strength Indicator */}
                {formData.password && (
                  <div className="mt-2 text-xs">
                    <div className="space-y-1">
                      <div className={`flex items-center space-x-2 ${
                        formData.password.length >= 8 ? 'text-green-400' : 'text-red-400'
                      }`}>
                        <span>{formData.password.length >= 8 ? '✓' : '✗'}</span>
                        <span>At least 8 characters</span>
                      </div>
                      <div className={`flex items-center space-x-2 ${
                        /[A-Z]/.test(formData.password) ? 'text-green-400' : 'text-red-400'
                      }`}>
                        <span>{/[A-Z]/.test(formData.password) ? '✓' : '✗'}</span>
                        <span>Uppercase letter (A-Z)</span>
                      </div>
                      <div className={`flex items-center space-x-2 ${
                        /[a-z]/.test(formData.password) ? 'text-green-400' : 'text-red-400'
                      }`}>
                        <span>{/[a-z]/.test(formData.password) ? '✓' : '✗'}</span>
                        <span>Lowercase letter (a-z)</span>
                      </div>
                      <div className={`flex items-center space-x-2 ${
                        /\d/.test(formData.password) ? 'text-green-400' : 'text-red-400'
                      }`}>
                        <span>{/\d/.test(formData.password) ? '✓' : '✗'}</span>
                        <span>Number (0-9)</span>
                      </div>
                      <div className={`flex items-center space-x-2 ${
                        /[!@#$%^&*(),.?":{}|<>]/.test(formData.password) ? 'text-green-400' : 'text-red-400'
                      }`}>
                        <span>{/[!@#$%^&*(),.?":{}|<>]/.test(formData.password) ? '✓' : '✗'}</span>
                        <span>Special character (!@#$%^&*)</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300 mb-1">
                  Confirm Password *
                </label>
                <div className="relative">
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    required
                    className={`appearance-none relative block w-full px-3 py-3 pr-12 bg-gray-800 border ${
                      !passwordsMatch ? 'border-red-500' : 'border-gray-700'
                    } placeholder-gray-500 text-white rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm`}
                    placeholder="Confirm your password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-white transition-colors duration-200"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                      </svg>
                    ) : (
                      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>
                {!passwordsMatch && formData.confirmPassword && (
                  <p className="text-red-400 text-xs mt-1">Passwords do not match</p>
                )}
              </div>
            </div>

            {/* Right Column - Professional Information */}
            <div className="space-y-4">
              <div className="border-b border-gray-700 pb-3 mb-4">
                <h3 className="text-lg font-semibold text-white flex items-center">
                  <span className="mr-2">👨‍⚕️</span>
                  Professional Information
                </h3>
                <p className="text-sm text-gray-400 mt-1">Medical credentials & details</p>
              </div>
              
              <div>
                <label htmlFor="specialization" className="block text-sm font-medium text-gray-300 mb-1">
                  Specialization *
                </label>
                <input
                  id="specialization"
                  name="specialization"
                  type="text"
                  required
                  className="appearance-none relative block w-full px-3 py-3 bg-gray-800 border border-gray-700 placeholder-gray-500 text-white rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                  placeholder="Ophthalmology, Optometry, etc."
                  value={formData.specialization}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label htmlFor="licenseNumber" className="block text-sm font-medium text-gray-300 mb-1">
                  Medical License Number *
                </label>
                <input
                  id="licenseNumber"
                  name="licenseNumber"
                  type="text"
                  required
                  className="appearance-none relative block w-full px-3 py-3 bg-gray-800 border border-gray-700 placeholder-gray-500 text-white rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
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
                  className="appearance-none relative block w-full px-3 py-3 bg-gray-800 border border-gray-700 placeholder-gray-500 text-white rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
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
                  className="appearance-none relative block w-full px-3 py-3 bg-gray-800 border border-gray-700 placeholder-gray-500 text-white rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                  placeholder="City General Hospital"
                  value={formData.hospital}
                  onChange={handleChange}
                />
              </div>
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

          {/* Centered Submit Button */}
          <div className="flex justify-center">
            <button
              type="submit"
              disabled={isLoading || !passwordsMatch}
              className="group relative px-8 py-3 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition duration-200 min-w-[200px]"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating Account...
                </div>
              ) : (
                'Create Doctor Account'
              )}
            </button>
          </div>

          <div className="text-center space-y-3">
            <div className="text-sm">
              <span className="text-gray-400">Already have an account? </span>
              <Link
                to="/doctor/login"
                className="font-medium text-green-600 hover:text-green-500"
              >
                Sign in here
              </Link>
            </div>
            
            
            <div className="text-sm">
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

export default DoctorSignup;
