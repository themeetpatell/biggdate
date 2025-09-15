import React, { useState, memo, useCallback } from 'react';
import { 
  X, Heart, MessageCircle, Star, MapPin, Calendar, Briefcase, GraduationCap, Globe, Phone, Mail, Instagram, Twitter, Linkedin, Camera, Edit3, Share2, Flag, 
  User, Activity, Award, Building2, Coffee, Clock, Crown, Eye, ExternalLink, Github, Hash, Info, MessageSquare, MoreVertical, Send, Shield, Sparkles, ThumbsUp, TrendingUp, Users, Video, Zap, Bookmark
} from 'lucide-react';

const ProfileModal = memo(({ profile, isOpen, onClose, onLike, onMessage, onSuperLike }) => {
  const [activeTab, setActiveTab] = useState('about');
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [showQuickActions, setShowQuickActions] = useState(false);

  if (!isOpen || !profile) return null;

  const photos = profile.photos || [
    { id: 1, url: profile.photo, alt: `${profile.name}'s photo` },
    ...(profile.additionalPhotos || [])
  ];

  const nextPhoto = () => {
    setCurrentPhotoIndex((prev) => (prev + 1) % photos.length);
  };

  const prevPhoto = () => {
    setCurrentPhotoIndex((prev) => (prev - 1 + photos.length) % photos.length);
  };

  const tabs = [
    { id: 'about', label: 'About', icon: User, count: null },
    { id: 'photos', label: 'Photos', icon: Camera, count: photos.length },
    { id: 'interests', label: 'Interests', icon: Heart, count: profile.interests?.length || 0 },
    { id: 'lifestyle', label: 'Lifestyle', icon: Globe, count: null },
    { id: 'compatibility', label: 'Compatibility', icon: Star, count: null },
    { id: 'activity', label: 'Activity', icon: Activity, count: profile.recentPosts?.length || 0 }
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative min-h-screen flex items-center justify-center p-4">
        <div className="relative bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden animate-scale-in">
          {/* Enhanced Header */}
          <div className="relative h-96 bg-gradient-to-br from-purple-500 via-pink-500 to-blue-500 overflow-hidden">
            {/* Cover Photo */}
            <div className="absolute inset-0">
              {profile.coverImage ? (
                <img 
                  src={profile.coverImage} 
                  alt={`${profile.name}'s cover photo`}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-purple-500 via-pink-500 to-blue-500"></div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
            </div>

            {/* Photo Navigation */}
            {photos.length > 1 && (
              <>
                <button
                  onClick={prevPhoto}
                  className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-white/20 backdrop-blur-sm rounded-full text-white hover:bg-white/30 transition-all"
                >
                  <X className="w-5 h-5 rotate-90" />
                </button>
                <button
                  onClick={nextPhoto}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-white/20 backdrop-blur-sm rounded-full text-white hover:bg-white/30 transition-all"
                >
                  <X className="w-5 h-5 -rotate-90" />
                </button>
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                  {photos.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentPhotoIndex(index)}
                      className={`w-2 h-2 rounded-full transition-all ${
                        index === currentPhotoIndex ? 'bg-white' : 'bg-white/50'
                      }`}
                    />
                  ))}
                </div>
              </>
            )}

            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 bg-white/20 backdrop-blur-sm rounded-full text-white hover:bg-white/30 transition-all"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Enhanced Profile Info Overlay */}
            <div className="absolute bottom-6 left-6 right-6 text-white">
              <div className="flex items-end justify-between">
                <div className="flex items-end gap-6">
                  <div className="relative">
                    <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-2xl sm:rounded-3xl border-4 border-white/30 overflow-hidden shadow-2xl">
                      {profile.profileImage ? (
                        <img 
                          src={profile.profileImage} 
                          alt={profile.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-lg sm:text-2xl font-bold">
                          {profile.avatar || profile.name?.charAt(0)}
                        </div>
                      )}
                    </div>
                    {profile.online && (
                      <div className="absolute -bottom-1 -right-1 sm:-bottom-2 sm:-right-2 w-6 h-6 sm:w-8 sm:h-8 bg-green-500 border-2 sm:border-4 border-white rounded-full flex items-center justify-center">
                        <div className="w-2 h-2 sm:w-3 sm:h-3 bg-white rounded-full animate-pulse"></div>
                      </div>
                    )}
                    {profile.verified && (
                      <div className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 w-6 h-6 sm:w-8 sm:h-8 bg-blue-500 border-2 sm:border-4 border-white rounded-full flex items-center justify-center">
                        <Shield className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                      </div>
                    )}
                  </div>
                  <div className="pb-4">
                    <h1 className="text-xl sm:text-3xl font-bold mb-2">{profile.name}</h1>
                    <p className="text-sm sm:text-xl text-white/90 mb-2">{profile.title} at {profile.company}</p>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-white/80 mb-3">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 sm:w-4 sm:h-4" />
                        <span className="text-xs sm:text-sm">{profile.location}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="w-3 h-3 sm:w-4 sm:h-4" />
                        <span className="text-xs sm:text-sm">{profile.mutualConnections} mutual</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-400" />
                        <span className="text-xs sm:text-sm">{profile.compatibility}% match</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium">
                        {profile.status}
                      </span>
                      {profile.priority === 'high' && (
                        <span className="px-3 py-1 bg-red-500/80 backdrop-blur-sm rounded-full text-sm font-medium">
                          High Priority
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                
                {/* Quick Stats */}
                <div className="text-right pb-4 hidden sm:block">
                  <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 mb-3">
                    <div className="text-2xl font-bold">{profile.compatibility}%</div>
                    <div className="text-sm text-white/80">Compatibility</div>
                  </div>
                  <div className="text-sm text-white/80">
                    <div>Last active: {profile.lastActive}</div>
                    <div>Connected: {new Date(profile.connectionDate).toLocaleDateString()}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced Action Buttons */}
          <div className="absolute top-4 left-4 sm:top-6 sm:left-6 flex gap-2 sm:gap-3">
            <button
              onClick={() => onLike(profile)}
              className="group p-2 sm:p-4 bg-white/20 backdrop-blur-sm rounded-xl sm:rounded-2xl text-white hover:bg-white/30 transition-all duration-200 hover:scale-105 shadow-lg"
              title="Like"
            >
              <Heart className="w-4 h-4 sm:w-6 sm:h-6 group-hover:scale-110 transition-transform" />
            </button>
            <button
              onClick={() => onMessage(profile)}
              className="group p-2 sm:p-4 bg-white/20 backdrop-blur-sm rounded-xl sm:rounded-2xl text-white hover:bg-white/30 transition-all duration-200 hover:scale-105 shadow-lg"
              title="Send Message"
            >
              <MessageCircle className="w-4 h-4 sm:w-6 sm:h-6 group-hover:scale-110 transition-transform" />
            </button>
            <button
              onClick={() => onSuperLike(profile)}
              className="group p-2 sm:p-4 bg-white/20 backdrop-blur-sm rounded-xl sm:rounded-2xl text-white hover:bg-white/30 transition-all duration-200 hover:scale-105 shadow-lg"
              title="Super Like"
            >
              <Star className="w-4 h-4 sm:w-6 sm:h-6 group-hover:scale-110 transition-transform" />
            </button>
            <button className="group p-2 sm:p-4 bg-white/20 backdrop-blur-sm rounded-xl sm:rounded-2xl text-white hover:bg-white/30 transition-all duration-200 hover:scale-105 shadow-lg" title="Video Call">
              <Video className="w-4 h-4 sm:w-6 sm:h-6 group-hover:scale-110 transition-transform" />
            </button>
            <button className="group p-4 bg-white/20 backdrop-blur-sm rounded-2xl text-white hover:bg-white/30 transition-all duration-200 hover:scale-105 shadow-lg" title="Share">
              <Share2 className="w-6 h-6 group-hover:scale-110 transition-transform" />
            </button>
            <div className="relative">
              <button 
                onClick={() => setShowQuickActions(!showQuickActions)}
                className="group p-4 bg-white/20 backdrop-blur-sm rounded-2xl text-white hover:bg-white/30 transition-all duration-200 hover:scale-105 shadow-lg"
                title="More Options"
              >
                <MoreVertical className="w-6 h-6 group-hover:scale-110 transition-transform" />
              </button>
              
              {showQuickActions && (
                <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-200 py-2 z-10">
                  <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2">
                    <Phone className="w-4 h-4" />
                    <span>Call</span>
                  </button>
                  <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2">
                    <Mail className="w-4 h-4" />
                    <span>Email</span>
                  </button>
                  <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2">
                    <ExternalLink className="w-4 h-4" />
                    <span>View LinkedIn</span>
                  </button>
                  <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2">
                    <Bookmark className="w-4 h-4" />
                    <span>Save Contact</span>
                  </button>
                  <hr className="my-2" />
                  <button className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2">
                    <Flag className="w-4 h-4" />
                    <span>Report</span>
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            {/* Enhanced Tabs */}
            <div className="flex border-b border-gray-200 mb-8 overflow-x-auto">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-6 py-4 text-sm font-medium border-b-2 transition-all duration-200 whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'border-purple-500 text-purple-600 bg-purple-50'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <tab.icon className="w-5 h-5" />
                  <span>{tab.label}</span>
                  {tab.count !== null && (
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      activeTab === tab.id 
                        ? 'bg-purple-100 text-purple-700' 
                        : 'bg-gray-100 text-gray-600'
                    }`}>
                      {tab.count}
                    </span>
                  )}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div className="min-h-[400px]">
              {activeTab === 'about' && (
                <div className="space-y-6">
                  {/* Basic Info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-3">Basic Information</h3>
                      <div className="space-y-3">
                        <div className="flex items-center gap-3">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-600">Age: {profile.age}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <MapPin className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-600">{profile.location}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <Briefcase className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-600">{profile.occupation || 'Not specified'}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <GraduationCap className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-600">{profile.education || 'Not specified'}</span>
                        </div>
                      </div>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-3">Contact</h3>
                      <div className="space-y-3">
                        {profile.email && (
                          <div className="flex items-center gap-3">
                            <Mail className="w-4 h-4 text-gray-400" />
                            <span className="text-gray-600">{profile.email}</span>
                          </div>
                        )}
                        {profile.phone && (
                          <div className="flex items-center gap-3">
                            <Phone className="w-4 h-4 text-gray-400" />
                            <span className="text-gray-600">{profile.phone}</span>
                          </div>
                        )}
                        {profile.website && (
                          <div className="flex items-center gap-3">
                            <Globe className="w-4 h-4 text-gray-400" />
                            <a href={profile.website} className="text-blue-600 hover:underline">{profile.website}</a>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Bio */}
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3">About</h3>
                    <p className="text-gray-600 leading-relaxed">{profile.bio || 'No bio available'}</p>
                  </div>

                  {/* Social Links */}
                  {(profile.instagram || profile.twitter || profile.linkedin) && (
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-3">Social Media</h3>
                      <div className="flex gap-4">
                        {profile.instagram && (
                          <a href={profile.instagram} className="flex items-center gap-2 text-pink-600 hover:text-pink-700">
                            <Instagram className="w-5 h-5" />
                            <span>Instagram</span>
                          </a>
                        )}
                        {profile.twitter && (
                          <a href={profile.twitter} className="flex items-center gap-2 text-blue-600 hover:text-blue-700">
                            <Twitter className="w-5 h-5" />
                            <span>Twitter</span>
                          </a>
                        )}
                        {profile.linkedin && (
                          <a href={profile.linkedin} className="flex items-center gap-2 text-blue-700 hover:text-blue-800">
                            <Linkedin className="w-5 h-5" />
                            <span>LinkedIn</span>
                          </a>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'photos' && (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {photos.map((photo, index) => (
                    <div
                      key={photo.id || index}
                      className="aspect-square rounded-lg overflow-hidden cursor-pointer hover:scale-105 transition-transform"
                      onClick={() => setCurrentPhotoIndex(index)}
                    >
                      <img
                        src={photo.url}
                        alt={photo.alt || `${profile.name}'s photo ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'interests' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3">Hobbies & Interests</h3>
                    <div className="flex flex-wrap gap-2">
                      {(profile.interests || []).map((interest, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                        >
                          {interest}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3">Skills</h3>
                    <div className="flex flex-wrap gap-2">
                      {(profile.skills || []).map((skill, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'lifestyle' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-3">Lifestyle</h3>
                      <div className="space-y-3">
                        <div>
                          <span className="text-sm text-gray-500">Daily Routine</span>
                          <p className="text-gray-700">{profile.lifestyle?.dailyRoutine || 'Not specified'}</p>
                        </div>
                        <div>
                          <span className="text-sm text-gray-500">Social Preferences</span>
                          <p className="text-gray-700">{profile.lifestyle?.socialPreferences || 'Not specified'}</p>
                        </div>
                        <div>
                          <span className="text-sm text-gray-500">Travel Style</span>
                          <p className="text-gray-700">{profile.lifestyle?.travelStyle || 'Not specified'}</p>
                        </div>
                      </div>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-3">Values</h3>
                      <div className="space-y-3">
                        <div>
                          <span className="text-sm text-gray-500">Work-Life Balance</span>
                          <p className="text-gray-700">{profile.lifestyle?.workLifeBalance || 'Not specified'}</p>
                        </div>
                        <div>
                          <span className="text-sm text-gray-500">Financial Values</span>
                          <p className="text-gray-700">{profile.lifestyle?.financialValues || 'Not specified'}</p>
                        </div>
                        <div>
                          <span className="text-sm text-gray-500">Family Values</span>
                          <p className="text-gray-700">{profile.lifestyle?.familyValues || 'Not specified'}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'compatibility' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3">Compatibility Score</h3>
                    <div className="flex items-center gap-4">
                      <div className="text-4xl font-bold text-blue-600">{profile.compatibilityScore || 85}%</div>
                      <div className="flex-1">
                        <div className="w-full bg-gray-200 rounded-full h-3">
                          <div 
                            className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all duration-1000"
                            style={{ width: `${profile.compatibilityScore || 85}%` }}
                          />
                        </div>
                        <p className="text-sm text-gray-600 mt-2">Based on shared interests, values, and lifestyle</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-3">Shared Interests</h3>
                      <div className="flex flex-wrap gap-2">
                        {(profile.sharedInterests || []).map((interest, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm"
                          >
                            {interest}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-3">Match Insights</h3>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Personality Match</span>
                          <span className="text-sm font-medium">{profile.personalityMatch || '85%'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Lifestyle Match</span>
                          <span className="text-sm font-medium">{profile.lifestyleMatch || '78%'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Values Match</span>
                          <span className="text-sm font-medium">{profile.valuesMatch || '92%'}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'activity' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-4">Recent Activity</h3>
                    <div className="space-y-4">
                      {(profile.recentPosts || []).map((post, index) => (
                        <div key={index} className="bg-gray-50 rounded-xl p-4">
                          <div className="flex items-start gap-3">
                            <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                              {profile.name?.charAt(0)}
                            </div>
                            <div className="flex-1">
                              <p className="text-gray-700 mb-2">{post}</p>
                              <div className="flex items-center gap-4 text-sm text-gray-500">
                                <span>{profile.lastActive}</span>
                                <div className="flex items-center gap-1">
                                  <ThumbsUp className="w-4 h-4" />
                                  <span>12 likes</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <MessageSquare className="w-4 h-4" />
                                  <span>3 comments</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-4">Achievements</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {(profile.achievements || []).map((achievement, index) => (
                        <div key={index} className="flex items-center gap-3 p-3 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl border border-yellow-200">
                          <Award className="w-6 h-6 text-yellow-600" />
                          <span className="text-gray-700 font-medium">{achievement}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

export default ProfileModal;
