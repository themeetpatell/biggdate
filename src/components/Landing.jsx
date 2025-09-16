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
  Globe
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
        navigate('/onboarding/role', { replace: true });
      }
    }
  }, [isAuthenticated, navigate]);

  const handleGetStarted = () => {
    navigate('/auth');
  };

  const features = [
    {
      icon: Target,
      title: "Pitch-First Dating",
      description: "Connect through ideas, not just photos. Share your vision and find someone who gets it."
    },
    {
      icon: Users,
      title: "3-Level System",
      description: "Pitch → Reveal → Journey. Progressive connection that builds real relationships."
    },
    {
      icon: Zap,
      title: "Smart Matching",
      description: "AI-powered compatibility based on values, goals, and professional alignment."
    },
    {
      icon: Globe,
      title: "Global Community",
      description: "Connect with ambitious professionals worldwide who share your drive and vision."
    }
  ];

  const stats = [
    { number: "10K+", label: "Active Users" },
    { number: "500+", label: "Matches Made" },
    { number: "95%", label: "Success Rate" },
    { number: "50+", label: "Countries" }
  ];

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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-indigo-900">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-pink-600/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
          <div className={`text-center transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-sm px-6 py-3 rounded-full mb-8">
              <Crown className="w-6 h-6 text-yellow-400" />
              <span className="text-white font-semibold">The Future of Professional Dating</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
              Where
              <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent"> Ideas </span>
              Meet
              <span className="bg-gradient-to-r from-pink-400 to-red-400 bg-clip-text text-transparent"> Hearts</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
              The first dating app for ambitious professionals. Connect through pitches, not just photos. 
              Build relationships that matter.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <button
                onClick={handleGetStarted}
                className="px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-2xl hover:from-purple-600 hover:to-pink-600 transition-all duration-300 font-bold text-lg shadow-2xl hover:shadow-purple-500/25 hover:scale-105 flex items-center gap-3"
              >
                <span>Start Your Journey</span>
                <ArrowRight className="w-6 h-6" />
              </button>
              
              <button className="px-8 py-4 bg-white/10 text-white rounded-2xl hover:bg-white/20 transition-all duration-300 font-semibold text-lg flex items-center gap-3">
                <Play className="w-5 h-5" />
                <span>Watch Demo</span>
              </button>
            </div>
            
            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-3xl md:text-4xl font-bold text-white mb-2">{stat.number}</div>
                  <div className="text-gray-400 text-sm">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20 bg-white/5 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">Why BiggDate?</h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              We're not just another dating app. We're building the future of meaningful connections.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 border border-white/20 hover:bg-white/20 transition-all duration-300 hover:scale-105">
                  <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mb-6">
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-4">{feature.title}</h3>
                  <p className="text-gray-300">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Find Your
            <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent"> Perfect Match</span>?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Join thousands of professionals who've found meaningful connections through BiggDate.
          </p>
          <button
            onClick={handleGetStarted}
            className="px-12 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-2xl hover:from-purple-600 hover:to-pink-600 transition-all duration-300 font-bold text-lg shadow-2xl hover:shadow-purple-500/25 hover:scale-105 flex items-center gap-3 mx-auto"
          >
            <span>Get Started Now</span>
            <ArrowRight className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Footer */}
      <div className="py-12 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                <span className="text-white text-lg font-bold">B</span>
              </div>
              <span className="text-white text-xl font-bold">BiggDate</span>
            </div>
            <p className="text-gray-400 text-sm">
              © 2024 BiggDate. Building meaningful connections, one pitch at a time.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Landing;