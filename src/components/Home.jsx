import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { 
  Users, 
  Search, 
  Heart,
  MessageCircle,
  Calendar,
  Star,
  CheckCircle,
  Eye,
  Trophy,
  Mountain,
  X,
  Brain,
  Sparkles,
  Zap,
  Crown,
  Shield,
  Globe,
  Target,
  Plus,
  Send,
  ThumbsUp,
  User,
  Clock,
  AlertCircle,
  TrendingUp,
  FileText,
  MapPin,
  Bell
} from 'lucide-react';

const Home = () => {
  const [activeTab, setActiveTab] = useState('discover');
  const [showProfileModal, setShowProfileModal] = useState(false);
  
  // Get user data from Redux store
  const { user } = useSelector((state) => state.auth);
  const { profile } = useSelector((state) => state.profile);
  
  // Use Redux data or fallback to default values
  const userProfile = {
    name: user?.firstName && user?.lastName ? `${user.firstName} ${user.lastName}` : 'Alex Chen',
    title: profile?.title || 'CEO & Co-Founder',
    company: profile?.company || 'TechFlow Solutions',
    location: profile?.location || 'San Francisco, CA',
    bio: profile?.bio || 'Passionate about building products that matter. Love hiking, cooking, and connecting with like-minded entrepreneurs.',
    avatar: user?.firstName && user?.lastName ? `${user.firstName[0]}${user.lastName[0]}` : 'AC',
    verified: true,
    points: 1250,
    level: 'Expert',
    badges: ['Early Adopter', 'Networker', 'Visionary'],
    interests: profile?.values || ['Hiking', 'Cooking', 'Photography', 'Startups', 'AI/ML'],
    achievements: [
      { title: 'Raised $15M Series A', year: 2023, icon: Trophy },
      { title: 'Built 50+ person team', year: 2022, icon: Users },
      { title: 'Hiked 20+ 14ers', year: 2023, icon: Mountain }
    ]
  };

  // Get matches from Redux store or use defaults
  const { profiles } = useSelector((state) => state.discovery);
  const matches = profiles?.length > 0 ? profiles.slice(0, 6).map(profile => ({
    id: profile.founder.id,
    name: `${profile.founder.title} at ${profile.founder.company}`,
    title: profile.founder.title,
    company: profile.founder.company,
    location: profile.founder.location,
    bio: profile.founder.bio,
    avatar: profile.founder.title[0] + profile.founder.company[0],
    compatibility: Math.round(profile.compatibilityScore),
    lastActive: '2 hours ago',
    verified: profile.founder.verification.overallScore > 0.7,
    interests: profile.founder.values || [],
    online: true
  })) : [
    {
      id: 1,
      name: 'Sarah Johnson',
      title: 'CTO & Co-Founder',
      company: 'HealthAI',
      location: 'Boston, MA',
      bio: 'AI researcher turned entrepreneur. Love music, cooking, and building healthcare solutions.',
      avatar: 'SJ',
      compatibility: 92,
      lastActive: '2 hours ago',
      verified: true,
      interests: ['Music', 'Cooking', 'AI/ML', 'Healthcare'],
      online: true
    },
    {
      id: 2,
      name: 'Mike Rodriguez',
      title: 'CEO & Founder',
      company: 'EcoTech',
      location: 'Austin, TX',
      bio: 'Environmentalist turned entrepreneur. Rock climbing, yoga, and sustainable living enthusiast.',
      avatar: 'MR',
      compatibility: 88,
      lastActive: '1 day ago',
      verified: true,
      interests: ['Rock Climbing', 'Yoga', 'Sustainability', 'Adventure'],
      online: false
    }
  ];

  // Get stats from Redux store or use defaults
  const { connections } = useSelector((state) => state.connections);
  const stats = {
    totalMatches: connections?.length || 24,
    newMatches: connections?.filter(c => c.status === 'pending')?.length || 3,
    newPitches: 12,
    profileViews: 89
  };

  // Quick actions data
  const quickActions = [
    {
      id: 'profile-completion',
      title: 'Complete Profile',
      description: 'Add missing information to boost your visibility',
      icon: User,
      color: 'blue',
      status: 'incomplete',
      progress: 75,
      action: () => console.log('Navigate to profile completion'),
      urgent: true
    },
    {
      id: 'pending-pitches',
      title: 'Respond to Pitches',
      description: '3 pitches waiting for your response',
      icon: Send,
      color: 'orange',
      status: 'pending',
      count: 3,
      action: () => console.log('Navigate to pending pitches'),
      urgent: true
    },
    {
      id: 'upcoming-events',
      title: 'Join Event',
      description: 'TechCrunch Disrupt starts in 2 days',
      icon: Calendar,
      color: 'green',
      status: 'upcoming',
      timeLeft: '2 days',
      action: () => console.log('Navigate to events'),
      urgent: false
    },
    {
      id: 'network-growth',
      title: 'Expand Network',
      description: 'Connect with 5 new people this week',
      icon: TrendingUp,
      color: 'purple',
      status: 'goal',
      progress: 60,
      target: 5,
      current: 3,
      action: () => console.log('Navigate to discovery'),
      urgent: false
    }
  ];

  return (
    <div className="main-content">
      <div className="container">
        {/* Welcome Section */}
        <div className="section">
        <div className="mb-8 animate-fade-in">
            <h1 className="text-4xl font-bold text-gray-900 mb-4 animate-slide-up">
            Welcome back, {userProfile.name.split(' ')[0]}! 👋
          </h1>
            <p className="text-lg text-gray-600 animate-slide-up" style={{ animationDelay: '0.1s' }}>
            Discover amazing people, connect with like-minded individuals, and grow your network.
          </p>
        </div>

        {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="card p-6 animate-scale-in" style={{ animationDelay: '0.2s' }}>
            <div className="flex items-center justify-between mb-4">
                <div className="p-3 rounded-lg bg-pink-500">
                <Heart className="w-6 h-6 text-white" />
                </div>
                <span className="text-2xl font-bold text-gray-900">{stats.totalMatches}</span>
              </div>
              <h3 className="text-sm text-gray-600">Total Matches</h3>
          </div>

            <div className="card p-6 animate-scale-in" style={{ animationDelay: '0.3s' }}>
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 rounded-lg bg-orange-500">
                  <Star className="w-6 h-6 text-white" />
                </div>
                <span className="text-2xl font-bold text-gray-900">{stats.newMatches}</span>
              </div>
              <h3 className="text-sm text-gray-600">New Matches</h3>
            </div>

            <div className="card p-6 animate-scale-in" style={{ animationDelay: '0.4s' }}>
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 rounded-lg bg-blue-500">
                  <Send className="w-6 h-6 text-white" />
                </div>
                <span className="text-2xl font-bold text-gray-900">{stats.newPitches}</span>
              </div>
              <h3 className="text-sm text-gray-600">New Pitches</h3>
            </div>

            <div className="card p-6 animate-scale-in" style={{ animationDelay: '0.5s' }}>
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 rounded-lg bg-green-500">
                  <Eye className="w-6 h-6 text-white" />
                </div>
                <span className="text-2xl font-bold text-gray-900">{stats.profileViews}</span>
              </div>
              <h3 className="text-sm text-gray-600">Profile Views</h3>
            </div>
          </div>

          {/* AI-Powered Dating Revolution Card */}
          <div className="card-elevated p-8 mb-8 animate-slide-up" style={{ background: 'linear-gradient(135deg, #8B5CF6, #3B82F6)', animationDelay: '0.6s' }}>
            <div className="flex items-center mb-6">
              <div className="p-3 rounded-lg bg-white/20 mr-4">
                <Brain className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-white">AI-Powered Dating Revolution</h2>
        </div>
            <p className="text-white/90 text-lg mb-6">
              Experience the future of dating with deep psychological profiling and cosmic compatibility
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="flex items-start space-x-3">
                <div className="p-2 rounded-lg bg-white/20">
                  <Brain className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-white mb-1">Deep Psychology</h3>
                  <p className="text-white/80 text-sm">Advanced AI analyzes personality traits, attachment styles, and emotional intelligence</p>
          </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="p-2 rounded-lg bg-white/20">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-white mb-1">Cosmic Alignment</h3>
                  <p className="text-white/80 text-sm">Discover soulmate connections through zodiac compatibility and energy matching</p>
            </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="p-2 rounded-lg bg-white/20">
                  <Zap className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-white mb-1">Unique Matching</h3>
                  <p className="text-white/80 text-sm">Beyond typical dating apps - find twin flames, growth partners, and karmic connections</p>
            </div>
              </div>
            </div>
            <button className="btn btn-primary btn-lg">
              <Brain className="w-5 h-5" />
              Start AI Matching
            </button>
        </div>

        {/* Quick Actions */}
          <div className="mb-8 animate-fade-in" style={{ animationDelay: '0.7s' }}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900 animate-slide-up">Quick Actions</h2>
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <Bell className="w-4 h-4" />
                <span>2 urgent tasks</span>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {quickActions.map((action, index) => {
                const IconComponent = action.icon;
                const colorClasses = {
                  blue: 'bg-blue-100 text-blue-600',
                  orange: 'bg-orange-100 text-orange-600',
                  green: 'bg-green-100 text-green-600',
                  purple: 'bg-purple-100 text-purple-600'
                };
                
                return (
                  <div 
                    key={action.id}
                    className={`card p-6 hover:shadow-lg transition-all duration-200 cursor-pointer animate-scale-in ${
                      action.urgent ? 'ring-2 ring-orange-200 bg-orange-50/30' : ''
                    }`}
                    style={{ animationDelay: `${0.8 + index * 0.1}s` }}
                    onClick={action.action}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className={`p-3 rounded-lg ${colorClasses[action.color]}`}>
                        <IconComponent className="w-6 h-6" />
                      </div>
                      {action.urgent && (
                        <div className="flex items-center space-x-1 text-orange-600">
                          <AlertCircle className="w-4 h-4" />
                          <span className="text-xs font-medium">Urgent</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="mb-3">
                      <h3 className="font-semibold text-gray-900 mb-1">{action.title}</h3>
                      <p className="text-sm text-gray-600">{action.description}</p>
                    </div>
                    
                    {/* Progress or Status Indicators */}
                    {action.status === 'incomplete' && (
                      <div className="mb-3">
                        <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                          <span>Profile Completion</span>
                          <span>{action.progress}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${action.progress}%` }}
                          ></div>
                        </div>
                      </div>
                    )}
                    
                    {action.status === 'pending' && (
                      <div className="mb-3">
                        <div className="flex items-center space-x-2 text-orange-600">
                          <Clock className="w-4 h-4" />
                          <span className="text-sm font-medium">{action.count} pending</span>
                        </div>
                      </div>
                    )}
                    
                    {action.status === 'upcoming' && (
                      <div className="mb-3">
                        <div className="flex items-center space-x-2 text-green-600">
                          <Calendar className="w-4 h-4" />
                          <span className="text-sm font-medium">Starts in {action.timeLeft}</span>
                        </div>
                      </div>
                    )}
                    
                    {action.status === 'goal' && (
                      <div className="mb-3">
                        <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                          <span>Weekly Goal</span>
                          <span>{action.current}/{action.target} connections</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-purple-500 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${action.progress}%` }}
                          ></div>
                        </div>
                      </div>
                    )}
                    
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500">
                        {action.urgent ? 'Click to take action' : 'Click to view details'}
                      </span>
                      <div className="flex items-center space-x-1 text-gray-400">
                        <span className="text-xs">View</span>
                        <Target className="w-3 h-3" />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Recent Matches */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Recent Matches</h2>
              <Link to="/matching" className="text-primary-blue hover:text-primary-purple font-medium">
                View All
              </Link>
                </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {matches.map((match) => (
                <div key={match.id} className="card p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="avatar avatar-lg">
                      <span>{match.avatar}</span>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                        <h3 className="font-semibold text-gray-900">{match.name}</h3>
                        {match.verified && (
                          <CheckCircle className="w-4 h-4 text-blue-500" />
                        )}
                      </div>
                      <p className="text-sm text-gray-600">{match.location}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-semibold text-green-600">{match.compatibility}%</div>
                      <div className="text-xs text-gray-500">Match</div>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mb-4">{match.bio}</p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {match.interests.slice(0, 3).map((interest, index) => (
                      <span key={index} className="badge badge-secondary text-xs">
                        {interest}
                      </span>
                    ))}
                  </div>
                  <div className="flex space-x-2">
                    <button className="btn btn-primary btn-sm flex-1">
                      <Heart className="w-4 h-4" />
                      Like
                    </button>
                    <button className="btn btn-secondary btn-sm flex-1">
                      <MessageCircle className="w-4 h-4" />
                      Message
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;