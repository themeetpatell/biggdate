import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { 
  Edit, 
  Settings, 
  Camera, 
  MapPin, 
  Calendar, 
  Briefcase, 
  Heart, 
  MessageCircle, 
  Share,
  MoreHorizontal,
  CheckCircle,
  Star,
  Award,
  Target,
  Users,
  Globe,
  User,
  Mail,
  Phone,
  Instagram,
  Twitter,
  Linkedin,
  LogOut
} from 'lucide-react';
import { logoutUser } from '../store/slices/authSlice.js';

const Profile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const [activeTab, setActiveTab] = useState('about');

  const [userProfile, setUserProfile] = useState({
    id: 'user-1',
    name: 'Alex Chen',
    age: 28,
    title: 'CEO & Co-Founder',
    company: 'TechFlow Solutions',
    location: 'San Francisco, CA',
    bio: 'Passionate about building products that matter. Love hiking, cooking, and connecting with like-minded entrepreneurs. Always looking for new adventures and meaningful connections.',
    photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face',
    avatar: 'AC',
    verified: true,
    isOnline: true,
    points: 1250,
    level: 'Expert',
    badges: ['Early Adopter', 'Networker', 'Visionary'],
    interests: ['Hiking', 'Cooking', 'Photography', 'Startups', 'AI/ML', 'Travel', 'Music'],
    skills: ['Leadership', 'Product Management', 'Public Speaking', 'Team Building'],
    achievements: [
      { title: 'Raised $15M Series A', year: 2023, icon: Award },
      { title: 'Built 50+ person team', year: 2022, icon: Users },
      { title: 'Hiked 20+ 14ers', year: 2023, icon: Target }
    ],
    stats: {
      connections: 247,
      matches: 89,
      events: 12,
      posts: 34
    },
    contact: {
      email: 'alex@techflow.com',
      phone: '+1 (555) 123-4567',
      website: 'https://alexchen.com'
    },
    social: {
      instagram: 'https://instagram.com/alexchen',
      twitter: 'https://twitter.com/alexchen',
      linkedin: 'https://linkedin.com/in/alexchen'
    },
    lifestyle: {
      dailyRoutine: 'Early riser, morning workouts, focused work blocks',
      socialPreferences: 'Small intimate gatherings, outdoor activities',
      travelStyle: 'Adventure travel, cultural immersion',
      workLifeBalance: 'Structured work hours, weekend adventures',
      financialValues: 'Invest in experiences and growth',
      familyValues: 'Quality time, shared experiences'
    },
    additionalPhotos: [
      { id: 1, url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=400&fit=crop', alt: 'Hiking adventure' },
      { id: 2, url: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=400&fit=crop', alt: 'Cooking at home' },
      { id: 3, url: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400&h=400&fit=crop', alt: 'Nature photography' }
    ]
  });

  useEffect(() => {
    // Simulate loading user profile data
    console.log('Profile component loaded');
  }, []);

  const tabs = [
    { id: 'about', label: 'About', count: null },
    { id: 'photos', label: 'Photos', count: userProfile.additionalPhotos ? userProfile.additionalPhotos.length + 1 : 1 },
    { id: 'interests', label: 'Interests', count: userProfile.interests ? userProfile.interests.length : 0 },
    { id: 'achievements', label: 'Achievements', count: userProfile.achievements ? userProfile.achievements.length : 0 },
    { id: 'lifestyle', label: 'Lifestyle', count: null },
    { id: 'connections', label: 'Connections', count: userProfile.stats.connections }
  ];

  // Handle logout
  const handleLogout = async () => {
    try {
      await dispatch(logoutUser()).unwrap();
      navigate('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <div className="main-content">
      <div className="container">
        <div className="section">
          {/* Profile Header */}
          <div className="card-elevated p-8 mb-6">
            <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-6">
              {/* Avatar */}
              <div className="relative">
                <div className="avatar avatar-xl">
                  {userProfile.photo ? (
                    <img 
                      src={userProfile.photo} 
                      alt={userProfile.name}
                      className="w-full h-full object-cover rounded-full"
                    />
                  ) : (
                    <span>{userProfile.avatar}</span>
                  )}
                </div>
                {userProfile.isOnline && (
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 border-2 border-white rounded-full" />
                )}
                <button className="absolute -bottom-2 -right-2 btn btn-sm btn-primary rounded-full p-2">
                  <Camera className="w-4 h-4" />
                </button>
              </div>

              {/* Profile Info */}
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <h1 className="text-2xl font-bold text-gray-900">{userProfile.name}</h1>
                  {userProfile.verified && (
                    <CheckCircle className="w-6 h-6 text-blue-500" />
                  )}
                </div>
                <p className="text-lg text-gray-600 mb-2">{userProfile.title} at {userProfile.company}</p>
                <div className="flex items-center space-x-4 text-sm text-gray-500 mb-4">
                  <div className="flex items-center space-x-1">
                    <MapPin className="w-4 h-4" />
                    <span>{userProfile.location}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Calendar className="w-4 h-4" />
                    <span>Joined 2022</span>
                  </div>
                </div>
                <p className="text-gray-700 mb-4">{userProfile.bio}</p>
                
                {/* Action Buttons */}
                <div className="flex items-center space-x-3">
                  <button className="btn btn-primary">
                    <Edit className="w-4 h-4" />
                    Edit Profile
                  </button>
                  <button className="btn btn-secondary">
                    <Share className="w-4 h-4" />
                    Share
                  </button>
                  <button className="btn btn-ghost">
                    <Settings className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={handleLogout}
                    className="btn btn-ghost text-red-600 hover:bg-red-50"
                    title="Logout"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-gray-200">
              {/* Mobile: Horizontal scrollable metrics */}
              <div className="flex space-x-4 overflow-x-auto scrollbar-hide sm:hidden pb-2">
                <div className="flex-shrink-0 text-center min-w-[80px]">
                  <div className="text-xl font-bold text-gray-900">{userProfile.stats.connections}</div>
                  <div className="text-xs text-gray-600">Connections</div>
                </div>
                <div className="flex-shrink-0 text-center min-w-[80px]">
                  <div className="text-xl font-bold text-gray-900">{userProfile.stats.matches}</div>
                  <div className="text-xs text-gray-600">Matches</div>
                </div>
                <div className="flex-shrink-0 text-center min-w-[80px]">
                  <div className="text-xl font-bold text-gray-900">{userProfile.stats.events}</div>
                  <div className="text-xs text-gray-600">Events</div>
                </div>
                <div className="flex-shrink-0 text-center min-w-[80px]">
                  <div className="text-xl font-bold text-gray-900">{userProfile.stats.posts}</div>
                  <div className="text-xs text-gray-600">Posts</div>
                </div>
              </div>
              
              {/* Desktop: Grid layout */}
              <div className="hidden sm:grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">{userProfile.stats.connections}</div>
                  <div className="text-sm text-gray-600">Connections</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">{userProfile.stats.matches}</div>
                  <div className="text-sm text-gray-600">Matches</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">{userProfile.stats.events}</div>
                  <div className="text-sm text-gray-600">Events</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">{userProfile.stats.posts}</div>
                  <div className="text-sm text-gray-600">Posts</div>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="card mb-6">
            <div className="card-header">
              <div className="flex items-center space-x-8">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center space-x-2 pb-2 border-b-2 transition-colors ${
                      activeTab === tab.id
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    <span className="font-medium">{tab.label}</span>
                    {tab.count && (
                      <span className="badge badge-secondary text-xs">{tab.count}</span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Tab Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {activeTab === 'about' && (
                <div className="space-y-6">
                  {/* About Section */}
                  <div className="card">
                    <div className="card-header">
                      <h3 className="text-lg font-semibold text-gray-900">About</h3>
                    </div>
                    <div className="card-body">
                      <p className="text-gray-700 mb-4">{userProfile.bio}</p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h4 className="font-medium text-gray-900 mb-2">Work</h4>
                          <div className="flex items-center space-x-2">
                            <Briefcase className="w-4 h-4 text-gray-500" />
                            <span className="text-gray-700">{userProfile.title} at {userProfile.company}</span>
                          </div>
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900 mb-2">Location</h4>
                          <div className="flex items-center space-x-2">
                            <MapPin className="w-4 h-4 text-gray-500" />
                            <span className="text-gray-700">{userProfile.location}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Interests */}
                  <div className="card">
                    <div className="card-header">
                      <h3 className="text-lg font-semibold text-gray-900">Interests</h3>
                    </div>
                    <div className="card-body">
                      <div className="flex flex-wrap gap-2">
                        {userProfile.interests.map((interest, index) => (
                          <span key={index} className="badge badge-primary">
                            {interest}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'achievements' && (
                <div className="space-y-6">
                  <div className="card">
                    <div className="card-header">
                      <h3 className="text-lg font-semibold text-gray-900">Achievements</h3>
                    </div>
                    <div className="card-body">
                      <div className="space-y-4">
                        {userProfile.achievements.map((achievement, index) => {
                          const Icon = achievement.icon;
                          return (
                            <div key={index} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                              <div className="p-2 bg-blue-100 rounded-lg">
                                <Icon className="w-6 h-6 text-blue-600" />
                              </div>
                              <div className="flex-1">
                                <h4 className="font-medium text-gray-900">{achievement.title}</h4>
                                <p className="text-sm text-gray-600">{achievement.year}</p>
                              </div>
                              <div className="flex items-center space-x-1">
                                <Star className="w-4 h-4 text-yellow-500" />
                                <span className="text-sm font-medium text-gray-700">Verified</span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'photos' && (
                <div className="space-y-6">
                  <div className="card">
                    <div className="card-header">
                      <h3 className="text-lg font-semibold text-gray-900">Photos</h3>
                    </div>
                    <div className="card-body">
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {/* Main Photo */}
                        <div className="aspect-square rounded-lg overflow-hidden">
                          <img
                            src={userProfile.photo}
                            alt={userProfile.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        {/* Additional Photos */}
                        {userProfile.additionalPhotos && userProfile.additionalPhotos.map((photo) => (
                          <div key={photo.id} className="aspect-square rounded-lg overflow-hidden">
                            <img
                              src={photo.url}
                              alt={photo.alt}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'interests' && (
                <div className="space-y-6">
                  <div className="card">
                    <div className="card-header">
                      <h3 className="text-lg font-semibold text-gray-900">Interests & Hobbies</h3>
                    </div>
                    <div className="card-body">
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-medium text-gray-900 mb-2">Hobbies</h4>
                          <div className="flex flex-wrap gap-2">
                            {userProfile.interests.map((interest, index) => (
                              <span key={index} className="badge badge-primary">
                                {interest}
                              </span>
                            ))}
                          </div>
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900 mb-2">Skills</h4>
                          <div className="flex flex-wrap gap-2">
                            {userProfile.skills.map((skill, index) => (
                              <span key={index} className="badge badge-secondary">
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'lifestyle' && (
                <div className="space-y-6">
                  <div className="card">
                    <div className="card-header">
                      <h3 className="text-lg font-semibold text-gray-900">Lifestyle</h3>
                    </div>
                    <div className="card-body">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                          <div>
                            <h4 className="font-medium text-gray-900 mb-2">Daily Routine</h4>
                            <p className="text-gray-600">{userProfile.lifestyle.dailyRoutine}</p>
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-900 mb-2">Social Preferences</h4>
                            <p className="text-gray-600">{userProfile.lifestyle.socialPreferences}</p>
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-900 mb-2">Travel Style</h4>
                            <p className="text-gray-600">{userProfile.lifestyle.travelStyle}</p>
                          </div>
                        </div>
                        <div className="space-y-4">
                          <div>
                            <h4 className="font-medium text-gray-900 mb-2">Work-Life Balance</h4>
                            <p className="text-gray-600">{userProfile.lifestyle.workLifeBalance}</p>
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-900 mb-2">Financial Values</h4>
                            <p className="text-gray-600">{userProfile.lifestyle.financialValues}</p>
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-900 mb-2">Family Values</h4>
                            <p className="text-gray-600">{userProfile.lifestyle.familyValues}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'connections' && (
                <div className="space-y-6">
                  <div className="card">
                    <div className="card-header">
                      <h3 className="text-lg font-semibold text-gray-900">Connections</h3>
                    </div>
                    <div className="card-body">
                      <p className="text-gray-600">Your connections will appear here</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Level & Points */}
              <div className="card">
                <div className="card-header">
                  <h3 className="text-lg font-semibold text-gray-900">Your Level</h3>
                </div>
                <div className="card-body">
      <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600 mb-2">{userProfile.level}</div>
                    <div className="text-sm text-gray-600 mb-4">{userProfile.points} points</div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                      <div className="bg-blue-500 h-2 rounded-full" style={{ width: '75%' }}></div>
                    </div>
                    <p className="text-xs text-gray-500">250 points to next level</p>
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div className="card">
                <div className="card-header">
                  <h3 className="text-lg font-semibold text-gray-900">Contact</h3>
                </div>
                <div className="card-body">
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <Mail className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-700">{userProfile.contact.email}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Phone className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-700">{userProfile.contact.phone}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Globe className="w-4 h-4 text-gray-500" />
                      <a href={userProfile.contact.website} className="text-sm text-blue-600 hover:underline">
                        {userProfile.contact.website}
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              {/* Social Media */}
              <div className="card">
                <div className="card-header">
                  <h3 className="text-lg font-semibold text-gray-900">Social Media</h3>
                </div>
                <div className="card-body">
                  <div className="space-y-3">
                    <a href={userProfile.social.instagram} className="flex items-center space-x-3 text-pink-600 hover:text-pink-700">
                      <Instagram className="w-4 h-4" />
                      <span className="text-sm">Instagram</span>
                    </a>
                    <a href={userProfile.social.twitter} className="flex items-center space-x-3 text-blue-600 hover:text-blue-700">
                      <Twitter className="w-4 h-4" />
                      <span className="text-sm">Twitter</span>
                    </a>
                    <a href={userProfile.social.linkedin} className="flex items-center space-x-3 text-blue-700 hover:text-blue-800">
                      <Linkedin className="w-4 h-4" />
                      <span className="text-sm">LinkedIn</span>
                    </a>
                  </div>
                </div>
              </div>

              {/* Badges */}
              <div className="card">
                <div className="card-header">
                  <h3 className="text-lg font-semibold text-gray-900">Badges</h3>
                </div>
                <div className="card-body">
                  <div className="space-y-3">
                    {userProfile.badges.map((badge, index) => (
                      <div key={index} className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                          <Award className="w-4 h-4 text-yellow-600" />
                        </div>
                        <span className="text-sm font-medium text-gray-900">{badge}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;