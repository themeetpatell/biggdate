import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  Eye, 
  EyeOff, 
  Mail, 
  Lock, 
  User, 
  Building2, 
  MapPin,
  Heart,
  ArrowRight,
  XCircle,
  Brain,
  Sparkles,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { loginUser, registerUser, clearError } from '../store/slices/authSlice.js';

const Auth = ({ onAuthSuccess }) => {
  const dispatch = useDispatch();
  const { isLoading, error } = useSelector((state) => state.auth);
  
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [showResetPassword, setShowResetPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    company: '',
    title: '',
    location: '',
    birthDate: '',
    bio: ''
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    setIsVisible(true);
  }, []);


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (isSignUp) {
      if (!formData.firstName) {
        newErrors.firstName = 'First name is required';
      }
      if (!formData.lastName) {
        newErrors.lastName = 'Last name is required';
      }
      if (!formData.company) {
        newErrors.company = 'Company is required';
      }
      if (!formData.title) {
        newErrors.title = 'Title is required';
      }
      if (!formData.location) {
        newErrors.location = 'Location is required';
      }
      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    // Clear any previous errors
    dispatch(clearError());
    
    try {
      if (isSignUp) {
        await dispatch(registerUser({
          email: formData.email,
          password: formData.password,
          firstName: formData.firstName,
          lastName: formData.lastName
        })).unwrap();
      } else {
        await dispatch(loginUser({
          email: formData.email,
          password: formData.password
        })).unwrap();
      }
      
      // If successful, call the success callback
      if (onAuthSuccess) {
        onAuthSuccess();
      }
    } catch (error) {
      // Error is handled by Redux
      console.error('Authentication error:', error);
    }
  };

  // Handle forgot password
  const handleForgotPassword = async (e) => {
    e.preventDefault();
    if (!resetEmail) {
      setErrors({ email: 'Email is required' });
      return;
    }
    
    try {
      // Mock forgot password API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      alert('Password reset link sent to your email!');
      setShowForgotPassword(false);
      setResetEmail('');
    } catch (error) {
      console.error('Forgot password failed:', error);
    }
  };

  // Handle reset password
  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!formData.password || !formData.confirmPassword) {
      setErrors({ password: 'Password is required', confirmPassword: 'Confirm password is required' });
      return;
    }
    
    if (formData.password !== formData.confirmPassword) {
      setErrors({ confirmPassword: 'Passwords do not match' });
      return;
    }
    
    try {
      // Mock reset password API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      alert('Password reset successfully! Please sign in with your new password.');
      setShowResetPassword(false);
      setFormData(prev => ({ ...prev, password: '', confirmPassword: '' }));
    } catch (error) {
      console.error('Reset password failed:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-float"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-50 animate-float" style={{ animationDelay: '4s' }}></div>
      </div>

      <div className={`w-full max-w-md relative z-10 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        {/* Logo Section */}
        <div className="text-center mb-8">
          <div className="relative inline-block">
            <div className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-4 bg-gradient-to-br from-purple-600 to-pink-600 shadow-lg animate-pulse">
              <Brain className="w-10 h-10 text-white" />
            </div>
            <div className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center animate-bounce">
              <Sparkles className="w-3 h-3 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
            BiggDate
          </h1>
          <p className="text-gray-600 text-lg">
            AI-powered dating for meaningful connections
          </p>
        </div>

        {/* Auth Card */}
        <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/20 p-8 relative overflow-hidden">
          {/* Card Background Pattern */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-purple-400 to-pink-400"></div>
          </div>

          {/* Tab Switcher */}
          <div className="flex bg-gray-100 rounded-2xl p-1 mb-8 relative">
            <div 
              className={`absolute top-1 bottom-1 w-1/2 bg-white rounded-xl shadow-md transition-all duration-300 ${
                isSignUp ? 'translate-x-full' : 'translate-x-0'
              }`}
            ></div>
            <button
              onClick={() => setIsSignUp(false)}
              className={`relative z-10 flex-1 py-3 px-4 rounded-xl font-semibold transition-colors duration-200 ${
                !isSignUp ? 'text-purple-600' : 'text-gray-600'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => setIsSignUp(true)}
              className={`relative z-10 flex-1 py-3 px-4 rounded-xl font-semibold transition-colors duration-200 ${
                isSignUp ? 'text-purple-600' : 'text-gray-600'
              }`}
            >
              Sign Up
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className={`w-5 h-5 transition-colors duration-200 ${
                    formData.email ? 'text-purple-500' : 'text-gray-400'
                  }`} />
                </div>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`w-full pl-12 pr-4 py-4 border-2 rounded-xl transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-purple-100 ${
                    errors.email 
                      ? 'border-red-300 bg-red-50' 
                      : formData.email 
                        ? 'border-purple-300 bg-purple-50' 
                        : 'border-gray-200 hover:border-gray-300'
                  }`}
                  placeholder="Enter your email"
                />
                {formData.email && !errors.email && (
                  <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  </div>
                )}
              </div>
              {errors.email && (
                <p className="text-red-500 text-sm mt-2 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.email}
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Password
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className={`w-5 h-5 transition-colors duration-200 ${
                    formData.password ? 'text-purple-500' : 'text-gray-400'
                  }`} />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className={`w-full pl-12 pr-12 py-4 border-2 rounded-xl transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-purple-100 ${
                    errors.password 
                      ? 'border-red-300 bg-red-50' 
                      : formData.password 
                        ? 'border-purple-300 bg-purple-50' 
                        : 'border-gray-200 hover:border-gray-300'
                  }`}
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors duration-200"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-500 text-sm mt-2 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.password}
                </p>
              )}
              {!isSignUp && (
                <div className="text-right mt-2">
                  <button
                    type="button"
                    onClick={() => setShowForgotPassword(true)}
                    className="text-sm text-purple-600 hover:text-purple-700 transition-colors duration-200"
                  >
                    Forgot Password?
                  </button>
                </div>
              )}
            </div>

            {/* Sign Up Fields */}
            {isSignUp && (
              <>
                {/* Name Fields */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      First Name
                    </label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <User className={`w-5 h-5 transition-colors duration-200 ${
                          formData.firstName ? 'text-purple-500' : 'text-gray-400'
                        }`} />
                      </div>
                      <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        className={`w-full pl-12 pr-4 py-4 border-2 rounded-xl transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-purple-100 ${
                          errors.firstName 
                            ? 'border-red-300 bg-red-50' 
                            : formData.firstName 
                              ? 'border-purple-300 bg-purple-50' 
                              : 'border-gray-200 hover:border-gray-300'
                        }`}
                        placeholder="First name"
                      />
                      {formData.firstName && !errors.firstName && (
                        <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
                          <CheckCircle className="w-5 h-5 text-green-500" />
                        </div>
                      )}
                    </div>
                    {errors.firstName && (
                      <p className="text-red-500 text-sm mt-2 flex items-center">
                        <AlertCircle className="w-4 h-4 mr-1" />
                        {errors.firstName}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Last Name
                    </label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <User className={`w-5 h-5 transition-colors duration-200 ${
                          formData.lastName ? 'text-purple-500' : 'text-gray-400'
                        }`} />
                      </div>
                      <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        className={`w-full pl-12 pr-4 py-4 border-2 rounded-xl transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-purple-100 ${
                          errors.lastName 
                            ? 'border-red-300 bg-red-50' 
                            : formData.lastName 
                              ? 'border-purple-300 bg-purple-50' 
                              : 'border-gray-200 hover:border-gray-300'
                        }`}
                        placeholder="Last name"
                      />
                      {formData.lastName && !errors.lastName && (
                        <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
                          <CheckCircle className="w-5 h-5 text-green-500" />
                        </div>
                      )}
                    </div>
                    {errors.lastName && (
                      <p className="text-red-500 text-sm mt-2 flex items-center">
                        <AlertCircle className="w-4 h-4 mr-1" />
                        {errors.lastName}
                      </p>
                    )}
                  </div>
                </div>

                {/* Company & Title */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Company
                    </label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Building2 className={`w-5 h-5 transition-colors duration-200 ${
                          formData.company ? 'text-purple-500' : 'text-gray-400'
                        }`} />
                      </div>
                      <input
                        type="text"
                        name="company"
                        value={formData.company}
                        onChange={handleInputChange}
                        className={`w-full pl-12 pr-4 py-4 border-2 rounded-xl transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-purple-100 ${
                          errors.company 
                            ? 'border-red-300 bg-red-50' 
                            : formData.company 
                              ? 'border-purple-300 bg-purple-50' 
                              : 'border-gray-200 hover:border-gray-300'
                        }`}
                        placeholder="Your company"
                      />
                      {formData.company && !errors.company && (
                        <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
                          <CheckCircle className="w-5 h-5 text-green-500" />
                        </div>
                      )}
                    </div>
                    {errors.company && (
                      <p className="text-red-500 text-sm mt-2 flex items-center">
                        <AlertCircle className="w-4 h-4 mr-1" />
                        {errors.company}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Title
                    </label>
                    <div className="relative group">
                      <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-4 border-2 rounded-xl transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-purple-100 ${
                          errors.title 
                            ? 'border-red-300 bg-red-50' 
                            : formData.title 
                              ? 'border-purple-300 bg-purple-50' 
                              : 'border-gray-200 hover:border-gray-300'
                        }`}
                        placeholder="CEO, CTO, etc."
                      />
                      {formData.title && !errors.title && (
                        <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
                          <CheckCircle className="w-5 h-5 text-green-500" />
                        </div>
                      )}
                    </div>
                    {errors.title && (
                      <p className="text-red-500 text-sm mt-2 flex items-center">
                        <AlertCircle className="w-4 h-4 mr-1" />
                        {errors.title}
                      </p>
                    )}
                  </div>
                </div>

                {/* Location */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Location
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <MapPin className={`w-5 h-5 transition-colors duration-200 ${
                        formData.location ? 'text-purple-500' : 'text-gray-400'
                      }`} />
                    </div>
                    <input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleInputChange}
                      className={`w-full pl-12 pr-4 py-4 border-2 rounded-xl transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-purple-100 ${
                        errors.location 
                          ? 'border-red-300 bg-red-50' 
                          : formData.location 
                            ? 'border-purple-300 bg-purple-50' 
                            : 'border-gray-200 hover:border-gray-300'
                      }`}
                      placeholder="City, Country"
                    />
                    {formData.location && !errors.location && (
                      <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
                        <CheckCircle className="w-5 h-5 text-green-500" />
                      </div>
                    )}
                  </div>
                  {errors.location && (
                    <p className="text-red-500 text-sm mt-2 flex items-center">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {errors.location}
                    </p>
                  )}
                </div>

                {/* Bio */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Bio
                  </label>
                  <div className="relative group">
                    <textarea
                      name="bio"
                      value={formData.bio}
                      onChange={handleInputChange}
                      rows={3}
                      className={`w-full px-4 py-4 border-2 rounded-xl transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-purple-100 resize-vertical ${
                        errors.bio 
                          ? 'border-red-300 bg-red-50' 
                          : formData.bio 
                            ? 'border-purple-300 bg-purple-50' 
                            : 'border-gray-200 hover:border-gray-300'
                      }`}
                      placeholder="Tell us about yourself..."
                    />
                    {formData.bio && !errors.bio && (
                      <div className="absolute top-4 right-4">
                        <CheckCircle className="w-5 h-5 text-green-500" />
                      </div>
                    )}
                  </div>
                  {errors.bio && (
                    <p className="text-red-500 text-sm mt-2 flex items-center">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {errors.bio}
                    </p>
                  )}
                </div>

                {/* Confirm Password */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Confirm Password
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Lock className={`w-5 h-5 transition-colors duration-200 ${
                        formData.confirmPassword ? 'text-purple-500' : 'text-gray-400'
                      }`} />
                    </div>
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      className={`w-full pl-12 pr-12 py-4 border-2 rounded-xl transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-purple-100 ${
                        errors.confirmPassword 
                          ? 'border-red-300 bg-red-50' 
                          : formData.confirmPassword 
                            ? 'border-purple-300 bg-purple-50' 
                            : 'border-gray-200 hover:border-gray-300'
                      }`}
                      placeholder="Confirm your password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors duration-200"
                    >
                      {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <p className="text-red-500 text-sm mt-2 flex items-center">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {errors.confirmPassword}
                    </p>
                  )}
                </div>
              </>
            )}

            {/* Error Display */}
            {error && (
              <div 
                className="p-4 rounded-lg flex items-center"
                style={{ 
                  backgroundColor: 'var(--apple-red)',
                  opacity: 0.1,
                  border: '1px solid var(--apple-red)'
                }}
              >
                <XCircle className="w-5 h-5 mr-2" style={{ color: 'var(--apple-red)' }} />
                <span className="apple-text-callout" style={{ color: 'var(--apple-red)' }}>{error}</span>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-4 px-6 rounded-xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-purple-100 ${
                isLoading 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg hover:shadow-xl'
              }`}
            >
              {isLoading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Processing...</span>
                </div>
              ) : (
                <div className="flex items-center justify-center space-x-2">
                  <span>{isSignUp ? 'Create Account' : 'Sign In'}</span>
                  <ArrowRight className="w-5 h-5" />
                </div>
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-8 text-center">
            <p className="text-gray-600">
              {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
              <button
                onClick={() => setIsSignUp(!isSignUp)}
                className="font-semibold text-purple-600 hover:text-purple-700 transition-colors duration-200"
              >
                {isSignUp ? 'Sign In' : 'Sign Up'}
              </button>
            </p>
          </div>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {showForgotPassword && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowForgotPassword(false);
            }
          }}
        >
          <div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-md relative">
            <button
              onClick={() => setShowForgotPassword(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors duration-200"
            >
              <XCircle className="w-6 h-6" />
            </button>
            
            <div className="text-center mb-6">
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 bg-gradient-to-br from-purple-600 to-pink-600">
                <Lock className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Forgot Password?</h2>
              <p className="text-gray-600">Enter your email address and we'll send you a link to reset your password.</p>
            </div>

            <form onSubmit={handleForgotPassword} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Email Address
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Mail className="w-5 h-5 text-gray-400" />
                  </div>
                  <input
                    type="email"
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-purple-100 hover:border-gray-300"
                    placeholder="Enter your email"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-4 px-6 rounded-xl font-semibold text-lg bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                Send Reset Link
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Reset Password Modal */}
      {showResetPassword && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowResetPassword(false);
            }
          }}
        >
          <div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-md relative">
            <button
              onClick={() => setShowResetPassword(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors duration-200"
            >
              <XCircle className="w-6 h-6" />
            </button>
            
            <div className="text-center mb-6">
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 bg-gradient-to-br from-purple-600 to-pink-600">
                <Lock className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Reset Password</h2>
              <p className="text-gray-600">Enter your new password below.</p>
            </div>

            <form onSubmit={handleResetPassword} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  New Password
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock className="w-5 h-5 text-gray-400" />
                  </div>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-purple-100 hover:border-gray-300"
                    placeholder="Enter new password"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Confirm New Password
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock className="w-5 h-5 text-gray-400" />
                  </div>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-purple-100 hover:border-gray-300"
                    placeholder="Confirm new password"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-4 px-6 rounded-xl font-semibold text-lg bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                Reset Password
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Auth;