import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { 
  ArrowRight, 
  Heart, 
  Users, 
  Zap, 
  Star, 
  CheckCircle,
  Play,
  Sparkles,
  Crown,
  Target,
  Globe,
  UserPlus,
  TrendingUp
} from 'lucide-react';

const Landing = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((state) => state.auth);
  const [isVisible, setIsVisible] = useState(false);
  useEffect(() => {
    setIsVisible(true);
    
    if (isAuthenticated) {
      // Check if onboarding is complete
      const onboardingComplete = localStorage.getItem('onboardingComplete');
      if (onboardingComplete === 'true') {
        navigate('/home', { replace: true });
      } else {
        navigate('/onboarding/mission', { replace: true });
      }
    }
  }, [isAuthenticated, navigate]);

  const handleGetStarted = () => {
    navigate('/auth');
  };

  const features = [
    {
      icon: Target,
      title: "Find Your Perfect Cofounder",
      description: "Connect with like-minded entrepreneurs who share your vision, skills, and ambition. Build the next unicorn together."
    },
    {
      icon: Users,
      title: "Pitch & Pitch-Back System",
      description: "Share your startup ideas and find cofounders who want to join your journey. Express interest with specific role proposals."
    },
    {
      icon: TrendingUp,
      title: "AI-Powered Matching Algorithm",
      description: "Our advanced AI matches you with cofounders based on complementary skills, vision alignment, and startup compatibility."
    },
    {
      icon: Globe,
      title: "Complete Startup Journey",
      description: "From idea to IPO - get roadmap generation, project tracking, team workspace, and launch preparation tools."
    }
  ];

  const stats = [
    { number: "1000+", label: "Active Entrepreneurs", icon: "🚀" },
    { number: "500+", label: "Startups Founded", icon: "✨" },
  ];

  if (isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-pink-50">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-4 animate-pulse">
            <span className="text-white text-2xl font-bold">CB</span>
          </div>
          <p className="text-gray-600 font-medium">Redirecting...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-indigo-900">

      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Enhanced Animated Background Elements */}
        <div className="absolute inset-0">
          <div className="floating-shape shape-1"></div>
          <div className="floating-shape shape-2"></div>
          <div className="floating-shape shape-3"></div>
          <div className="floating-shape shape-4"></div>
          <div className="floating-shape shape-5"></div>
          <div className="floating-shape shape-6"></div>
        </div>
        
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-pink-600/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 sm:pt-16 lg:pt-20 pb-16 sm:pb-20 lg:pb-24">
          <div className={`text-center transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="inline-flex items-center gap-2 sm:gap-3 bg-gradient-to-r from-orange-500/20 to-yellow-500/20 backdrop-blur-sm px-4 sm:px-6 py-2 sm:py-3 rounded-full mb-6 sm:mb-8 border border-orange-400/30 hover:border-orange-400/50 transition-all duration-300 group">
              <Crown className="w-4 h-4 sm:w-6 sm:h-6 text-orange-400 group-hover:scale-110 transition-transform duration-300" />
              <span className="text-white font-semibold text-sm sm:text-base group-hover:text-orange-100 transition-colors duration-300">🚀 Build Your Startup Dream Team</span>
            </div>
            
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-white mb-4 sm:mb-6 leading-tight">
              Find Your
              <span className="shimmer-text block sm:inline"> Cofounder</span>
            </h1>
            
            <div className="mb-6 sm:mb-8">
              <p className="text-lg sm:text-xl md:text-2xl text-white font-semibold tracking-wide bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
                The Premier Platform for Startup Cofounders & Entrepreneurs
              </p>
            </div>
            
            <p className="text-base sm:text-lg md:text-xl text-gray-300 mb-6 sm:mb-8 max-w-4xl mx-auto leading-relaxed px-4">
              Co-Builders is the first platform built specifically for finding cofounders, building startups, and launching successful ventures together. Every connection begins with a pitch, every match begins with vision. Find your perfect cofounder who shares your ambition to build something meaningful together.
            </p>
            
            {/* Social Proof */}
            <div className="mb-8 sm:mb-12">
              <div className="flex items-center justify-center gap-6 sm:gap-8 text-gray-400 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span>Pitch-First Matching</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                  <span>Entrepreneur Community</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
                  <span>Startup Journey</span>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center mb-8 sm:mb-12 px-4">
              <button
                onClick={handleGetStarted}
                className="glow-button w-full sm:w-auto px-8 sm:px-10 py-4 sm:py-5 bg-gradient-to-r from-purple-500 via-pink-500 to-purple-600 text-white rounded-2xl hover:from-purple-600 hover:via-pink-600 hover:to-purple-700 transition-all duration-500 font-bold text-base sm:text-lg shadow-2xl hover:shadow-purple-500/40 hover:scale-110 flex items-center justify-center gap-2 sm:gap-3 group"
              >
                <span className="relative z-10">Get Started</span>
                <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6 group-hover:translate-x-1 transition-transform duration-300" />
              </button>
              
              <button 
                onClick={handleGetStarted}
                className="w-full sm:w-auto px-8 sm:px-10 py-4 sm:py-5 bg-white/10 backdrop-blur-sm text-white rounded-2xl hover:bg-white/20 hover:backdrop-blur-md transition-all duration-300 font-semibold text-base sm:text-lg flex items-center justify-center gap-2 sm:gap-3 group border border-white/20 hover:border-white/40"
              >
                <UserPlus className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
                <span>Find Cofounders</span>
              </button>
            </div>
            
            {/* Stats */}
            <div className="grid grid-cols-2 gap-3 sm:gap-4 max-w-2xl mx-auto px-4">
              {stats.map((stat, index) => (
                <div key={index} className="text-center bg-white/10 backdrop-blur-sm rounded-xl p-3 sm:p-4 border border-white/20 hover:bg-white/20 hover:border-white/40 transition-all duration-500 hover:scale-105 hover:shadow-xl group">
                  <div className="text-xl sm:text-2xl mb-1 group-hover:scale-110 transition-transform duration-300">{stat.icon}</div>
                  <div className="text-base sm:text-lg font-bold text-white mb-1 group-hover:text-purple-200 transition-colors duration-300">{stat.number}</div>
                  <div className="text-gray-300 text-xs font-medium group-hover:text-white transition-colors duration-300">{stat.label}</div>
                </div>
              ))}
            </div>
            
            {/* Cofounder Concept */}
            <div className="mt-8 sm:mt-12 max-w-4xl mx-auto px-4">
              <div className="text-center mb-6 sm:mb-8">
                <span className="text-white/90 text-lg sm:text-xl font-bold tracking-wide uppercase bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">What is a Cofounder?</span>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 sm:p-8 border border-white/20 hover:bg-white/15 hover:border-white/30 transition-all duration-500 group relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <p className="text-gray-300 text-center leading-relaxed text-sm sm:text-base group-hover:text-white transition-colors duration-300 relative z-10">
                  A <span className="text-purple-400 font-semibold group-hover:text-pink-400 transition-colors duration-300">Cofounder</span> is the partner who stands with you through every chapter of your startup journey, sharing your vision, complementary skills, and drive to build something meaningful. They give you strength in the hard moments, believe in your dreams, and grow with you in ambition, innovation, and success.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div id="features" className="py-16 sm:py-20 bg-white/5 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4 bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">Why Co-Builders for Entrepreneurs?</h2>
            <p className="text-lg sm:text-xl text-gray-300 max-w-3xl mx-auto">
              We're not just another networking platform. <br></br> We're building the future of cofounder matching and startup success for the entrepreneurial community.
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="bg-white/10 backdrop-blur-sm rounded-3xl p-6 sm:p-8 border border-white/20 hover:bg-white/20 hover:border-white/40 transition-all duration-500 hover:scale-105 hover:shadow-2xl group">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-purple-500 via-pink-500 to-purple-600 rounded-2xl flex items-center justify-center mb-4 sm:mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-lg">
                    <Icon className="w-6 h-6 sm:w-8 sm:h-8 text-white group-hover:scale-110 transition-transform duration-300" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-white mb-3 sm:mb-4 group-hover:text-purple-200 transition-colors duration-300">{feature.title}</h3>
                  <p className="text-gray-300 text-sm sm:text-base group-hover:text-white transition-colors duration-300 leading-relaxed">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>



      {/* CTA Section */}
      <div id="about" className="py-16 sm:py-20">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
            <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 backdrop-blur-sm rounded-3xl p-6 sm:p-8 border border-white/20 mb-8">
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-500 to-yellow-500 text-white px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-semibold mb-4">
                <Sparkles className="w-3 h-3 sm:w-4 sm:h-4" />
                Start Building Today
              </div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4 sm:mb-6">
                Ready to Find Your
                <span className="shimmer-text block sm:inline"> Perfect Cofounder</span>?
              </h2>
              <p className="text-lg sm:text-xl text-gray-300 mb-6 sm:mb-8">
                Join Co-Builders and be the first to experience the future of cofounder matching and startup success. Find your perfect cofounder and build the next unicorn together.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center">
                <button
                  onClick={handleGetStarted}
                  className="glow-button w-full sm:w-auto px-8 sm:px-12 py-4 sm:py-5 bg-gradient-to-r from-purple-500 via-pink-500 to-purple-600 text-white rounded-2xl hover:from-purple-600 hover:via-pink-600 hover:to-purple-700 transition-all duration-500 font-bold text-base sm:text-lg shadow-2xl hover:shadow-purple-500/40 hover:scale-110 flex items-center justify-center gap-2 sm:gap-3 group"
                >
                  <span className="relative z-10">Get Started</span>
                  <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6 group-hover:translate-x-1 transition-transform duration-300" />
                </button>
                <div className="text-gray-400 text-xs sm:text-sm">
                  <span className="inline-flex items-center gap-2 hover:text-white transition-colors duration-300">
                    <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-orange-400" />
                    Free to join • Startup Tools • Verified Entrepreneurs Only
                  </span>
                </div>
              </div>
            </div>
        </div>
      </div>

      {/* Footer */}
      <div className="py-8 sm:py-12 border-t border-white/10 bg-gradient-to-r from-purple-900/20 to-pink-900/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-3 sm:mb-4">
              <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center hover:scale-110 transition-transform duration-300">
                <span className="text-white text-sm sm:text-lg font-bold">CB</span>
              </div>
              <span className="text-white text-lg sm:text-xl font-bold hover:text-purple-200 transition-colors duration-300">Co-Builders</span>
            </div>
            <p className="text-gray-400 text-xs sm:text-sm hover:text-gray-300 transition-colors duration-300">
              © 2025 Co-Builders. Find your Cofounder - Building successful startups through meaningful connections and partnerships.
            </p>
            <div className="mt-4 flex justify-center gap-4 text-gray-500 text-xs">
              <span className="hover:text-purple-400 transition-colors duration-300 cursor-pointer">Privacy Policy</span>
              <span className="hover:text-purple-400 transition-colors duration-300 cursor-pointer">Terms of Service</span>
              <span className="hover:text-purple-400 transition-colors duration-300 cursor-pointer">Contact</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Landing;