import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import HowItWorks from './HowItWorks';
import { 
  Send,
  Heart,
  Calendar,
  GraduationCap,
  User,
  Plus,
  Zap,
  Star,
  Clock,
  Eye,
  MessageCircle,
  TrendingUp,
  Users,
  Sparkles,
  Target,
  Award,
  Globe,
  Bell,
  MapPin,
  ChevronRight,
  Info,
  ArrowRight,
  Crown,
  Rocket,
  Diamond,
  Flame,
  Shield
} from 'lucide-react';

const Home = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const [showHowItWorks, setShowHowItWorks] = useState(false);
  
  // State for real-time data
  const [stats, setStats] = useState({
    activePitches: 0,
    matches: 0,
    upcomingEvents: 0,
    courses: 0
  });
  
  const [recentActivity, setRecentActivity] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Get user data from localStorage (set during onboarding)
  const userRole = localStorage.getItem('userRole') || 'founder';
  const whyHere = localStorage.getItem('whyHere') || 'Building the future of technology';
  const selectedValues = JSON.parse(localStorage.getItem('selectedValues') || '[]');
  const userMask = localStorage.getItem('userMask') || 'rocket';
  const pitchSlot = localStorage.getItem('pitchSlot') || 'Looking for a co-founder who shares my vision...';

  const masks = {
    rocket: { emoji: '🚀', color: 'from-blue-500 to-cyan-500', name: 'The Innovator' },
    diamond: { emoji: '💎', color: 'from-purple-500 to-pink-500', name: 'The Rare Gem' },
    flame: { emoji: '🔥', color: 'from-orange-500 to-red-500', name: 'The Passionate' },
    crown: { emoji: '👑', color: 'from-yellow-500 to-orange-500', name: 'The Leader' },
    star: { emoji: '⭐', color: 'from-indigo-500 to-purple-500', name: 'The Shining Light' },
    shield: { emoji: '🛡️', color: 'from-green-500 to-emerald-500', name: 'The Protector' }
  };

  const currentMask = masks[userMask] || masks.rocket;

  // Load data on component mount
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      
      // Simulate API calls
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setStats({
        activePitches: 12,
        matches: 8,
        upcomingEvents: 3,
        courses: 5
      });
      
      setRecentActivity([
    {
      id: 1,
          type: 'pitch',
          title: 'New pitch received from Sarah',
          description: 'Looking for a technical co-founder...',
          time: '2 hours ago',
          icon: Send,
          color: 'from-blue-500 to-cyan-500'
    },
    {
      id: 2,
          type: 'match',
          title: 'You matched with Alex!',
          description: 'Both interested in AI and sustainability',
          time: '4 hours ago',
          icon: Heart,
          color: 'from-pink-500 to-rose-500'
        },
        {
          id: 3,
          type: 'event',
          title: 'Pitch Night tomorrow',
          description: 'TechCrunch Disrupt - San Francisco',
          time: '1 day ago',
          icon: Calendar,
          color: 'from-green-500 to-emerald-500'
        },
        {
          id: 4,
          type: 'course',
          title: 'New course available',
          description: 'Mastering the Art of Pitching',
          time: '2 days ago',
          icon: GraduationCap,
          color: 'from-purple-500 to-indigo-500'
        }
      ]);
      
      setIsLoading(false);
    };
    
    loadData();
  }, []);

  const quickActions = [
    {
      title: 'Send Pitch',
      description: 'Create and send a new pitch',
      icon: Send,
      color: 'from-blue-500 to-cyan-500',
      link: '/pitches'
    },
    {
      title: 'View Matches',
      description: 'See your current matches',
      icon: Heart,
      color: 'from-pink-500 to-rose-500',
      link: '/matching'
    },
    {
      title: 'Browse Events',
      description: 'Find networking events',
      icon: Calendar,
      color: 'from-green-500 to-emerald-500',
      link: '/events'
    },
    {
      title: 'Dating School',
      description: 'Learn and improve',
      icon: GraduationCap,
      color: 'from-purple-500 to-indigo-500',
      link: '/dating-school'
    }
  ];

  if (isLoading) {
  return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-purple-600 via-pink-600 to-indigo-600 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-4 mb-4">
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center bg-gradient-to-r ${currentMask.color}`}>
                  <span className="text-2xl">{currentMask.emoji}</span>
                </div>
                <div>
                  <h1 className="text-2xl font-bold">Welcome back!</h1>
                  <p className="text-purple-100">{currentMask.name}</p>
                </div>
              </div>
              <p className="text-xl text-purple-100 mb-6 max-w-2xl">
                {whyHere}
              </p>
              <div className="flex flex-wrap gap-2">
                {selectedValues.slice(0, 3).map((value, index) => (
                  <span key={index} className="px-3 py-1 bg-white/20 text-white text-sm rounded-full">
                    {value}
                  </span>
                ))}
              </div>
            </div>

            <div className="hidden lg:block">
              <button
                onClick={() => setShowHowItWorks(true)}
                className="px-6 py-3 bg-white/10 backdrop-blur-sm text-white rounded-xl hover:bg-white/20 transition-all duration-300 flex items-center gap-2"
              >
                <Info className="w-5 h-5" />
                How It Works
              </button>
            </div>
          </div>
        </div>
                </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between">
                <div>
                <p className="text-gray-600 text-xs font-medium">Active Pitches</p>
                <p className="text-2xl font-bold text-gray-900">{stats.activePitches}</p>
          </div>
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
                <Send className="w-6 h-6 text-white" />
              </div>
                </div>
            <div className="mt-4 flex items-center text-sm text-green-600">
              <TrendingUp className="w-4 h-4 mr-1" />
              +2 this week
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-xs font-medium">Matches</p>
                <p className="text-2xl font-bold text-gray-900">{stats.matches}</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-rose-500 rounded-xl flex items-center justify-center">
                <Heart className="w-6 h-6 text-white" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm text-green-600">
              <TrendingUp className="w-4 h-4 mr-1" />
              +3 this week
            </div>
        </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-xs font-medium">Events</p>
                <p className="text-2xl font-bold text-gray-900">{stats.upcomingEvents}</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
                <Calendar className="w-6 h-6 text-white" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm text-blue-600">
              <Clock className="w-4 h-4 mr-1" />
              Next in 2 days
                        </div>
                    </div>
                    
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-xs font-medium">Courses</p>
                <p className="text-2xl font-bold text-gray-900">{stats.courses}</p>
                    </div>
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-xl flex items-center justify-center">
                <GraduationCap className="w-6 h-6 text-white" />
                        </div>
                      </div>
            <div className="mt-4 flex items-center text-sm text-purple-600">
              <Star className="w-4 h-4 mr-1" />
              2 new this week
            </div>
                        </div>
                      </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Activity */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-gray-900">Recent Activity</h2>
                <Link to="/connections" className="text-purple-600 hover:text-purple-700 font-medium flex items-center gap-1">
                  View All
                  <ChevronRight className="w-4 h-4" />
                </Link>
                      </div>
              
              <div className="space-y-4">
                {recentActivity.map((activity) => {
                  const Icon = activity.icon;
                  return (
                    <div key={activity.id} className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center bg-gradient-to-r ${activity.color}`}>
                        <Icon className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900 text-sm">{activity.title}</h3>
                        <p className="text-gray-600 text-sm">{activity.description}</p>
                        <p className="text-gray-400 text-xs mt-1">{activity.time}</p>
                    </div>
                  </div>
                );
              })}
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div>
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <h2 className="text-lg font-bold text-gray-900 mb-6">Quick Actions</h2>
              
              <div className="space-y-4">
                {quickActions.map((action, index) => {
                  const Icon = action.icon;
                  return (
                    <Link
                      key={index}
                      to={action.link}
                      className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-all duration-300 hover:scale-105"
                    >
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center bg-gradient-to-r ${action.color}`}>
                        <Icon className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1">
                        <h3 className="font-medium text-gray-900 text-sm">{action.title}</h3>
                        <p className="text-gray-600 text-sm">{action.description}</p>
                      </div>
                      <ArrowRight className="w-5 h-5 text-gray-400" />
                    </Link>
                  );
                })}
                </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl p-8 text-white text-center">
          <h2 className="text-xl font-bold mb-4">Ready to Make Your Move?</h2>
          <p className="text-purple-100 mb-6 max-w-2xl mx-auto">
            Your next great connection is just one pitch away. Start building meaningful relationships today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/pitches"
              className="px-8 py-3 bg-white text-purple-600 rounded-xl hover:bg-gray-100 transition-all duration-300 font-semibold flex items-center justify-center gap-2"
            >
              <Send className="w-5 h-5" />
              Send Your First Pitch
            </Link>
            <Link
              to="/matching"
              className="px-8 py-3 bg-white/20 text-white rounded-xl hover:bg-white/30 transition-all duration-300 font-semibold flex items-center justify-center gap-2"
            >
              <Heart className="w-5 h-5" />
              Browse Matches
            </Link>
          </div>
        </div>
      </div>

      {/* How It Works Modal */}
      <HowItWorks
        isOpen={showHowItWorks}
        onClose={() => setShowHowItWorks(false)}
      />
    </div>
  );
};

export default Home;