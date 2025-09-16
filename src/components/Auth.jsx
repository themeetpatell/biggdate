import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { 
  Eye, 
  EyeOff, 
  Mail, 
  Lock, 
  User, 
  ArrowRight,
  CheckCircle,
  AlertCircle,
  Heart,
  Sparkles,
  Crown
} from 'lucide-react';
import { loginUser, registerUser, clearError } from '../store/slices/authSlice.js';

const Auth = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading, error, isAuthenticated } = useSelector((state) => state.auth);
  
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: ''
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    setIsVisible(true);
  }, []);

  // Navigate after successful authentication
  useEffect(() => {
    if (isAuthenticated) {
      const onboardingComplete = localStorage.getItem('onboardingComplete');
      if (onboardingComplete === 'true') {
        navigate('/home');
      } else {
        navigate('/onboarding/role');
      }
    }
  }, [isAuthenticated, navigate]);

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
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    dispatch(clearError());
    
      if (isSignUp) {
      dispatch(registerUser(formData));
      } else {
      dispatch(loginUser({
          email: formData.email,
          password: formData.password
      }));
    }
  };

  const toggleMode = () => {
    setIsSignUp(!isSignUp);
    setErrors({});
    dispatch(clearError());
  };

  if (isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-pink-50">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-4 animate-pulse">
            <span className="text-white text-2xl font-bold">B</span>
          </div>
          <p className="text-gray-600 font-medium">Redirecting...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-indigo-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className={`text-center mb-8 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-sm px-6 py-3 rounded-full mb-6">
            <Crown className="w-6 h-6 text-yellow-400" />
            <span className="text-white font-semibold">Welcome to BiggDate</span>
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">
            {isSignUp ? 'Join the Movement' : 'Welcome Back'}
          </h1>
          <p className="text-gray-300">
            {isSignUp 
              ? 'Start your journey to meaningful connections' 
              : 'Continue building your professional network'
            }
          </p>
        </div>

        {/* Form */}
        <div className={`bg-white/10 backdrop-blur-sm rounded-3xl p-8 border border-white/20 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <form onSubmit={handleSubmit} className="space-y-6">
            {isSignUp && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-white font-semibold mb-2">First Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className={`w-full pl-10 pr-4 py-3 bg-white/10 border rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 ${
                        errors.firstName ? 'border-red-500' : 'border-white/20'
                      }`}
                      placeholder="John"
                    />
                  </div>
                  {errors.firstName && (
                    <p className="text-red-400 text-sm mt-1 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.firstName}
                    </p>
                  )}
                </div>
                
            <div>
                  <label className="block text-white font-semibold mb-2">Last Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className={`w-full pl-10 pr-4 py-3 bg-white/10 border rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 ${
                        errors.lastName ? 'border-red-500' : 'border-white/20'
                      }`}
                      placeholder="Doe"
                    />
                  </div>
                  {errors.lastName && (
                    <p className="text-red-400 text-sm mt-1 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.lastName}
                    </p>
                  )}
                </div>
              </div>
            )}

            <div>
              <label className="block text-white font-semibold mb-2">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`w-full pl-10 pr-4 py-3 bg-white/10 border rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 ${
                    errors.email ? 'border-red-500' : 'border-white/20'
                  }`}
                  placeholder="john@example.com"
                />
              </div>
              {errors.email && (
                <p className="text-red-400 text-sm mt-1 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.email}
                </p>
              )}
            </div>

            <div>
              <label className="block text-white font-semibold mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className={`w-full pl-10 pr-12 py-3 bg-white/10 border rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 ${
                    errors.password ? 'border-red-500' : 'border-white/20'
                  }`}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-400 text-sm mt-1 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.password}
                </p>
              )}
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all duration-300 font-bold text-lg shadow-2xl hover:shadow-purple-500/25 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-3"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <span>{isSignUp ? 'Create Account' : 'Sign In'}</span>
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-300">
              {isSignUp ? 'Already have an account?' : "Don't have an account?"}
              <button
                onClick={toggleMode}
                className="ml-2 text-purple-400 hover:text-purple-300 font-semibold transition-colors"
              >
                {isSignUp ? 'Sign In' : 'Sign Up'}
              </button>
            </p>
          </div>
        </div>

        {/* Features */}
        <div className="mt-8 grid grid-cols-3 gap-4 text-center">
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
            <Heart className="w-6 h-6 text-pink-400 mx-auto mb-2" />
            <p className="text-white text-sm font-semibold">Smart Matching</p>
              </div>
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
            <Sparkles className="w-6 h-6 text-purple-400 mx-auto mb-2" />
            <p className="text-white text-sm font-semibold">AI Powered</p>
          </div>
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
            <Crown className="w-6 h-6 text-yellow-400 mx-auto mb-2" />
            <p className="text-white text-sm font-semibold">Elite Community</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;