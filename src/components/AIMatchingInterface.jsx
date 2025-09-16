import React, { useState, useEffect } from 'react';
import { 
  Heart, 
  X, 
  Star, 
  Eye, 
  RefreshCw, 
  Filter, 
  Settings, 
  ChevronLeft, 
  ChevronRight,
  MapPin,
  CheckCircle,
  Brain,
  Zap,
  Target,
  Users,
  Sparkles,
  AlertCircle,
  MessageCircle,
  Phone,
  Video,
  Send,
  ThumbsUp,
  ThumbsDown,
  Bookmark,
  Share2,
  MoreHorizontal,
  Clock,
  TrendingUp,
  Award,
  Flame,
  Diamond,
  Crown,
  Shield,
  Lock,
  Unlock,
  Volume2,
  VolumeX,
  Camera,
  Mic,
  MicOff,
  Play,
  Pause,
  SkipForward,
  RotateCcw,
  Maximize2,
  Minimize2,
  Info,
  HelpCircle,
  Bell,
  BellOff,
  Search,
  Sliders,
  BarChart3,
  PieChart,
  Activity,
  Target as TargetIcon,
  Compass,
  Navigation,
  Globe,
  Wifi,
  WifiOff,
  Battery,
  BatteryLow,
  Signal,
  SignalZero,
  SignalLow,
  SignalMedium,
  SignalHigh
} from 'lucide-react';

const AIMatchingInterface = ({
  currentUser,
  matches = [],
  onLike,
  onPass,
  onSuperLike,
  onViewProfile,
  onRefresh
}) => {
  const [currentMatchIndex, setCurrentMatchIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [matchTypes, setMatchTypes] = useState('all');
  const [filters, setFilters] = useState({
    ageRange: [18, 50],
    distance: 50,
    interests: [],
    verified: false,
    online: false,
    compatibility: 70,
    education: [],
    profession: [],
    lifestyle: [],
    personality: [],
    relationshipGoals: [],
    hasPhotos: true,
    hasBio: true,
    isVerified: false,
    isOnline: false,
    lastActive: 'any', // any, today, week, month
    height: { min: 0, max: 200 },
    bodyType: [],
    ethnicity: [],
    religion: [],
    politics: [],
    smoking: 'any', // any, never, occasionally, regularly
    drinking: 'any', // any, never, occasionally, regularly
    exercise: 'any', // any, never, occasionally, regularly
    diet: [],
    pets: [],
    children: 'any', // any, want, have, don't want
    zodiac: [],
    languages: []
  });
  const [settings, setSettings] = useState({
    notifications: true,
    autoAdvance: false,
    showDistance: true,
    showLastActive: true,
    theme: 'light',
    soundEffects: true,
    hapticFeedback: true,
    autoPlay: false,
    voiceNotes: true,
    videoCalls: true,
    smartSuggestions: true,
    aiInsights: true,
    compatibilityAlerts: true,
    matchReminders: true,
    privacyMode: false,
    incognitoMode: false
  });
  
  // Enhanced state for advanced features
  const [viewMode, setViewMode] = useState('card'); // card, grid, list
  const [isVideoMode, setIsVideoMode] = useState(false);
  const [isVoiceMode, setIsVoiceMode] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentAudio, setCurrentAudio] = useState(null);
  const [showInsights, setShowInsights] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [showConversationStarters, setShowConversationStarters] = useState(false);
  const [showDateIdeas, setShowDateIdeas] = useState(false);
  const [showCompatibilityBreakdown, setShowCompatibilityBreakdown] = useState(false);
  const [activeTab, setActiveTab] = useState('matches'); // matches, liked, passed, superliked
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('compatibility'); // compatibility, distance, age, activity
  const [showPitchModal, setShowPitchModal] = useState(false);
  const [pitchMessage, setPitchMessage] = useState('');
  const [isSendingPitch, setIsSendingPitch] = useState(false);
  const [stats, setStats] = useState({
    totalMatches: 0,
    likes: 0,
    superLikes: 0,
    passes: 0
  });

  // Transform matches data to a consistent format
  const transformMatch = (match) => {
    if (!match) return null;
    
    return {
      id: match.id || 'unknown',
      name: match.name || 'Unknown User',
      age: match.age || 25,
      location: match.location || 'Unknown Location',
      distance: match.distance || 'Unknown',
      photo: match.photo || 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=400&fit=crop&crop=face',
      additionalPhotos: match.additionalPhotos || [],
      bio: match.bio || 'No bio available',
      occupation: match.occupation || 'Unknown',
      company: match.company || 'Unknown',
      education: match.education || 'Unknown',
      interests: match.interests || [],
      skills: match.skills || [],
      verified: match.verified || false,
      isOnline: match.isOnline || false,
      lastActive: match.lastActive || 'Unknown',
      lifestyle: match.lifestyle || {},
      contact: match.contact || {},
      social: match.social || {},
      compatibilityScore: match.overallScore || match.aiCompatibility?.overall || 0,
      matchType: match.matchType || 'potential',
      psychologicalProfile: match.psychologicalMatch || {},
      cosmicAlignment: match.cosmicAlignment || {},
      aiInsights: {
        personalityMatch: match.matchInsights?.[0]?.insight || 'No insights available',
        energyAlignment: match.energyVibe?.overallVibe ? `${match.energyVibe.overallVibe}% energy match` : 'No insights available',
        growthPotential: match.growthPotential?.mutualGrowth ? `${match.growthPotential.mutualGrowth}% growth potential` : 'No insights available'
      },
      sharedInterests: match.sharedInterests || [],
      personalityMatch: `${match.aiCompatibility?.personality || 0}%`,
      lifestyleMatch: `${match.aiCompatibility?.lifestyle || 0}%`,
      valuesMatch: `${match.aiCompatibility?.values || 0}%`,
      conversationStarters: match.conversationStarters || [],
      dateIdeas: match.dateIdeas || []
    };
  };

  const displayMatches = matches.map(transformMatch).filter(Boolean);
  const currentMatch = displayMatches[currentMatchIndex] || null;

  // Update stats
  useEffect(() => {
    setStats({
      totalMatches: displayMatches.length,
      likes: 0, // This would come from state management
      superLikes: 0,
      passes: 0
    });
  }, [displayMatches]);

  // Handle actions
  const handleAction = (action, match) => {
    if (!match) return;
    
    setLoading(true);
    
    try {
      switch (action) {
        case 'like':
          onLike?.(match);
          break;
        case 'pass':
          onPass?.(match);
          break;
        case 'superLike':
          onSuperLike?.(match);
          break;
        case 'viewProfile':
          setSelectedMatch(match);
          setShowProfileModal(true);
          onViewProfile?.(match);
          break;
        default:
          break;
      }
      
      // Move to next match
      if (action !== 'viewProfile') {
        setTimeout(() => {
          setCurrentMatchIndex(prev => 
            prev + 1 >= displayMatches.length ? 0 : prev + 1
          );
          setLoading(false);
        }, 1000);
      } else {
        setLoading(false);
      }
    } catch (error) {
      console.error('Error handling action:', error);
      setLoading(false);
    }
  };

  const handleNext = () => {
    setCurrentMatchIndex(prev => 
      prev + 1 >= displayMatches.length ? 0 : prev + 1
    );
  };

  const handlePrevious = () => {
    setCurrentMatchIndex(prev => 
      prev - 1 < 0 ? displayMatches.length - 1 : prev - 1
    );
  };

  const handleRefresh = () => {
    setCurrentMatchIndex(0);
    onRefresh?.();
  };

  const handleSendPitch = async () => {
    if (!pitchMessage.trim() || isSendingPitch) return;
    
    setIsSendingPitch(true);
    try {
      // Simulate sending pitch
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setPitchMessage('');
      setShowPitchModal(false);
      
      // Show success message
      alert('Pitch sent successfully! 🚀');
    } catch (error) {
      console.error('Error sending pitch:', error);
      alert('Failed to send pitch. Please try again.');
    } finally {
      setIsSendingPitch(false);
    }
  };

  // Helper function to extract numeric value from percentage string
  const getNumericValue = (value) => {
    if (typeof value === 'number') return value;
    if (typeof value === 'string') {
      const num = parseFloat(value.replace('%', ''));
      return isNaN(num) ? 0 : num;
    }
    return 0;
  };

  // Helper function to safely render values
  const safeRender = (value) => {
    if (value === null || value === undefined) return '';
    if (typeof value === 'object') return JSON.stringify(value);
    return String(value);
  };

  // Debug logging
  console.log('AIMatchingInterface Debug:', {
    currentUser: !!currentUser,
    matchesCount: matches.length,
    displayMatchesCount: displayMatches.length,
    currentMatchIndex,
    currentMatch: !!currentMatch
  });

  if (!currentUser) {
    return (
      <div className="main-content">
        <div className="container">
          <div className="section">
            <div className="text-center py-20">
              <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
                <Users className="w-12 h-12 text-gray-400" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Please log in</h2>
              <p className="text-gray-600">You need to be logged in to use AI Matching.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (displayMatches.length === 0) {
    return (
      <div className="main-content">
        <div className="container">
          <div className="section">
            <div className="text-center py-20">
              <div className="w-24 h-24 mx-auto mb-6 bg-blue-100 rounded-full flex items-center justify-center">
                <Sparkles className="w-12 h-12 text-blue-500" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">No matches found</h2>
              <p className="text-gray-600 mb-8">We're working on finding you the perfect matches!</p>
              <button 
                onClick={handleRefresh}
                className="btn btn-primary"
              >
                <RefreshCw className="w-5 h-5" />
                Refresh Matches
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!currentMatch) {
    return (
      <div className="main-content">
        <div className="container">
          <div className="section">
            <div className="text-center py-20">
              <div className="w-24 h-24 mx-auto mb-6 bg-red-100 rounded-full flex items-center justify-center">
                <AlertCircle className="w-12 h-12 text-red-500" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Something went wrong</h2>
              <p className="text-gray-600 mb-8">We're sorry, but there was an error loading the match.</p>
              <button 
                onClick={handleRefresh}
                className="btn btn-primary"
              >
                <RefreshCw className="w-5 h-5" />
                Reload Page
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6 gap-4">
            <div className="flex-1">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900">AI Matching</h1>
              <p className="text-sm sm:text-base text-gray-600 mt-1 sm:mt-2">Find your perfect match with AI-powered compatibility</p>
            </div>
            <div className="flex items-center gap-2 sm:gap-4 overflow-x-auto scrollbar-hide">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="btn btn-outline text-xs sm:text-sm whitespace-nowrap px-3 py-2"
              >
                <Filter className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="hidden xs:inline">Filters</span>
              </button>
              <button
                onClick={() => setShowSettings(!showSettings)}
                className="btn btn-outline text-xs sm:text-sm whitespace-nowrap px-3 py-2"
              >
                <Settings className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="hidden xs:inline">Settings</span>
              </button>
              <button
                onClick={handleRefresh}
                className="btn btn-outline text-xs sm:text-sm whitespace-nowrap px-3 py-2"
              >
                <RefreshCw className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="hidden xs:inline">Refresh</span>
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="mb-6 sm:mb-8">
            {/* Mobile: Horizontal scrollable stats */}
            <div className="flex space-x-3 overflow-x-auto scrollbar-hide sm:hidden pb-2 -mx-4 px-4">
              <div className="flex-shrink-0 bg-white p-4 rounded-xl shadow-sm border min-w-[100px] text-center">
                <div className="text-2xl font-bold text-blue-600">{stats.totalMatches}</div>
                <div className="text-xs text-gray-600">Total</div>
              </div>
              <div className="flex-shrink-0 bg-white p-4 rounded-xl shadow-sm border min-w-[100px] text-center">
                <div className="text-2xl font-bold text-green-600">{stats.likes}</div>
                <div className="text-xs text-gray-600">Likes</div>
              </div>
              <div className="flex-shrink-0 bg-white p-4 rounded-xl shadow-sm border min-w-[100px] text-center">
                <div className="text-2xl font-bold text-yellow-600">{stats.superLikes}</div>
                <div className="text-xs text-gray-600">Super</div>
              </div>
              <div className="flex-shrink-0 bg-white p-4 rounded-xl shadow-sm border min-w-[100px] text-center">
                <div className="text-2xl font-bold text-red-600">{stats.passes}</div>
                <div className="text-xs text-gray-600">Passes</div>
              </div>
            </div>
            
            {/* Desktop: Grid layout */}
            <div className="hidden sm:grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white p-6 rounded-xl shadow-sm border">
                <div className="text-3xl font-bold text-blue-600">{stats.totalMatches}</div>
                <div className="text-sm text-gray-600">Total Matches</div>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm border">
                <div className="text-3xl font-bold text-green-600">{stats.likes}</div>
                <div className="text-sm text-gray-600">Likes</div>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm border">
                <div className="text-3xl font-bold text-yellow-600">{stats.superLikes}</div>
                <div className="text-sm text-gray-600">Super Likes</div>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm border">
                <div className="text-3xl font-bold text-red-600">{stats.passes}</div>
                <div className="text-sm text-gray-600">Passes</div>
              </div>
            </div>
          </div>

          {/* Filters Modal */}
          {showFilters && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
              <div className="bg-white rounded-2xl p-6 w-full max-w-md mx-4 modal-enter">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-gray-900">Filters</h3>
                  <button
                    onClick={() => setShowFilters(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
                
                <div className="space-y-6">
                  {/* Age Range */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Age Range: {filters.ageRange[0]} - {filters.ageRange[1]}
                    </label>
                    <div className="flex gap-4">
                      <input
                        type="range"
                        min="18"
                        max="50"
                        value={filters.ageRange[0]}
                        onChange={(e) => setFilters(prev => ({
                          ...prev,
                          ageRange: [parseInt(e.target.value), prev.ageRange[1]]
                        }))}
                        className="flex-1"
                      />
                      <input
                        type="range"
                        min="18"
                        max="50"
                        value={filters.ageRange[1]}
                        onChange={(e) => setFilters(prev => ({
                          ...prev,
                          ageRange: [prev.ageRange[0], parseInt(e.target.value)]
                        }))}
                        className="flex-1"
                      />
                    </div>
                  </div>

                  {/* Distance */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Distance: {filters.distance} miles
                    </label>
                    <input
                      type="range"
                      min="1"
                      max="100"
                      value={filters.distance}
                      onChange={(e) => setFilters(prev => ({
                        ...prev,
                        distance: parseInt(e.target.value)
                      }))}
                      className="w-full"
                    />
                  </div>

                  {/* Compatibility */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Min Compatibility: {filters.compatibility}%
                    </label>
                    <input
                      type="range"
                      min="50"
                      max="100"
                      value={filters.compatibility}
                      onChange={(e) => setFilters(prev => ({
                        ...prev,
                        compatibility: parseInt(e.target.value)
                      }))}
                      className="w-full"
                    />
                  </div>

                  {/* Checkboxes */}
                  <div className="space-y-3">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={filters.verified}
                        onChange={(e) => setFilters(prev => ({
                          ...prev,
                          verified: e.target.checked
                        }))}
                        className="mr-3"
                      />
                      <span className="text-sm text-gray-700">Verified only</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={filters.online}
                        onChange={(e) => setFilters(prev => ({
                          ...prev,
                          online: e.target.checked
                        }))}
                        className="mr-3"
                      />
                      <span className="text-sm text-gray-700">Online now</span>
                    </label>
                  </div>
                </div>

                <div className="flex gap-3 mt-6">
                  <button
                    onClick={() => setShowFilters(false)}
                    className="flex-1 btn btn-outline"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => setShowFilters(false)}
                    className="flex-1 btn btn-primary"
                  >
                    Apply Filters
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Settings Modal */}
          {showSettings && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
              <div className="bg-white rounded-2xl p-6 w-full max-w-md mx-4 modal-enter">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-gray-900">Settings</h3>
                  <button
                    onClick={() => setShowSettings(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
                
                <div className="space-y-4">
                  <label className="flex items-center justify-between">
                    <span className="text-sm text-gray-700">Notifications</span>
                    <input
                      type="checkbox"
                      checked={settings.notifications}
                      onChange={(e) => setSettings(prev => ({
                        ...prev,
                        notifications: e.target.checked
                      }))}
                      className="toggle"
                    />
                  </label>
                  
                  <label className="flex items-center justify-between">
                    <span className="text-sm text-gray-700">Auto Advance</span>
                    <input
                      type="checkbox"
                      checked={settings.autoAdvance}
                      onChange={(e) => setSettings(prev => ({
                        ...prev,
                        autoAdvance: e.target.checked
                      }))}
                      className="toggle"
                    />
                  </label>
                  
                  <label className="flex items-center justify-between">
                    <span className="text-sm text-gray-700">Show Distance</span>
                    <input
                      type="checkbox"
                      checked={settings.showDistance}
                      onChange={(e) => setSettings(prev => ({
                        ...prev,
                        showDistance: e.target.checked
                      }))}
                      className="toggle"
                    />
                  </label>
                  
                  <label className="flex items-center justify-between">
                    <span className="text-sm text-gray-700">Show Last Active</span>
                    <input
                      type="checkbox"
                      checked={settings.showLastActive}
                      onChange={(e) => setSettings(prev => ({
                        ...prev,
                        showLastActive: e.target.checked
                      }))}
                      className="toggle"
                    />
                  </label>
                </div>

                <div className="flex gap-3 mt-6">
                  <button
                    onClick={() => setShowSettings(false)}
                    className="flex-1 btn btn-outline"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => setShowSettings(false)}
                    className="flex-1 btn btn-primary"
                  >
                    Save Settings
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Match Card */}
        <div className="section">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
              {/* Match Header */}
              <div className="relative h-64 sm:h-80 lg:h-96 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500">
                <div className="absolute inset-0 bg-black/20"></div>
                <div className="absolute top-4 right-4 flex gap-2">
                  <button
                    onClick={() => handleAction('viewProfile', currentMatch)}
                    className="p-2 bg-white/20 backdrop-blur-sm rounded-full text-white hover:bg-white/30 transition-all"
                  >
                    <Eye className="w-4 h-4 sm:w-5 sm:h-5" />
                  </button>
                </div>
                
                <div className="absolute bottom-4 sm:bottom-6 left-4 sm:left-6 right-4 sm:right-6">
                  <div className="flex items-end gap-3 sm:gap-4">
                    <div className="relative">
                      <img
                        src={currentMatch.photo}
                        alt={currentMatch.name}
                        className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 rounded-full border-2 sm:border-4 border-white object-cover"
                      />
                      {currentMatch.isOnline && (
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 sm:w-6 sm:h-6 bg-green-500 border-2 border-white rounded-full" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-white truncate">
                        {safeRender(currentMatch.name)}, {safeRender(currentMatch.age)}
                      </h2>
                      <div className="flex items-center gap-2 text-white/80 mt-1">
                        <MapPin className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                        <span className="text-xs sm:text-sm truncate">{safeRender(currentMatch.location)} • {safeRender(currentMatch.distance)} away</span>
                      </div>
                      {currentMatch.verified && (
                        <div className="flex items-center gap-1 mt-1">
                          <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-400 fill-current flex-shrink-0" />
                          <span className="text-xs sm:text-sm text-yellow-400">Verified</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Match Content */}
              <div className="p-4 sm:p-6 lg:p-8">
                {/* Compatibility Scores */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
                  <div className="text-center bg-gray-50 rounded-xl p-4 sm:p-6">
                    <div className="text-2xl sm:text-3xl font-bold text-blue-600">{currentMatch.compatibilityScore}%</div>
                    <div className="text-xs sm:text-sm text-gray-600">Overall Match</div>
                  </div>
                  <div className="text-center bg-gray-50 rounded-xl p-4 sm:p-6">
                    <div className="text-2xl sm:text-3xl font-bold text-purple-600">{currentMatch.personalityMatch}</div>
                    <div className="text-xs sm:text-sm text-gray-600">Personality</div>
                  </div>
                  <div className="text-center bg-gray-50 rounded-xl p-4 sm:p-6">
                    <div className="text-2xl sm:text-3xl font-bold text-green-600">{currentMatch.lifestyleMatch}</div>
                    <div className="text-xs sm:text-sm text-gray-600">Lifestyle</div>
                  </div>
                </div>

                {/* Bio */}
                <div className="mb-6">
                  <p className="text-gray-700 leading-relaxed">{safeRender(currentMatch.bio)}</p>
                </div>

                {/* Interests */}
                {currentMatch.interests && currentMatch.interests.length > 0 && (
                  <div className="mb-6">
                    <h3 className="font-semibold text-gray-900 mb-3">Interests</h3>
                    <div className="flex flex-wrap gap-2">
                      {currentMatch.interests.map((interest, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                        >
                          {safeRender(interest)}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* AI Insights */}
                <div className="mb-8">
                  <h3 className="font-semibold text-gray-900 mb-4">AI Insights</h3>
                  <div className="space-y-4">
                    <div className="p-4 bg-blue-50 rounded-lg">
                      <div className="flex items-start gap-3">
                        <Brain className="w-5 h-5 text-blue-600 mt-0.5" />
                        <div>
                          <h4 className="font-medium text-blue-900 mb-1">Personality Match</h4>
                          <p className="text-sm text-blue-700">{safeRender(currentMatch.aiInsights.personalityMatch)}</p>
                        </div>
                      </div>
                    </div>
                    <div className="p-4 bg-purple-50 rounded-lg">
                      <div className="flex items-start gap-3">
                        <Zap className="w-5 h-5 text-purple-600 mt-0.5" />
                        <div>
                          <h4 className="font-medium text-purple-900 mb-1">Energy Alignment</h4>
                          <p className="text-sm text-purple-700">{safeRender(currentMatch.aiInsights.energyAlignment)}</p>
                        </div>
                      </div>
                    </div>
                    <div className="p-4 bg-green-50 rounded-lg">
                      <div className="flex items-start gap-3">
                        <Target className="w-5 h-5 text-green-600 mt-0.5" />
                        <div>
                          <h4 className="font-medium text-green-900 mb-1">Growth Potential</h4>
                          <p className="text-sm text-green-700">{safeRender(currentMatch.aiInsights.growthPotential)}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-center gap-3 sm:gap-4">
                  <button
                    onClick={() => handleAction('pass', currentMatch)}
                    disabled={loading}
                    className="w-14 h-14 sm:w-16 sm:h-16 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center transition-all disabled:opacity-50"
                  >
                    <X className="w-6 h-6 sm:w-8 sm:h-8" />
                  </button>
                  
                  <button
                    onClick={() => setShowPitchModal(true)}
                    disabled={loading}
                    className="w-14 h-14 sm:w-16 sm:h-16 bg-purple-500 hover:bg-purple-600 text-white rounded-full flex items-center justify-center transition-all disabled:opacity-50"
                  >
                    <Target className="w-6 h-6 sm:w-8 sm:h-8" />
                  </button>
                  
                  <button
                    onClick={() => handleAction('superLike', currentMatch)}
                    disabled={loading}
                    className="w-14 h-14 sm:w-16 sm:h-16 bg-yellow-500 hover:bg-yellow-600 text-white rounded-full flex items-center justify-center transition-all disabled:opacity-50"
                  >
                    <Star className="w-6 h-6 sm:w-8 sm:h-8" />
                  </button>
                  
                  <button
                    onClick={() => handleAction('like', currentMatch)}
                    disabled={loading}
                    className="w-14 h-14 sm:w-16 sm:h-16 bg-green-500 hover:bg-green-600 text-white rounded-full flex items-center justify-center transition-all disabled:opacity-50"
                  >
                    <Heart className="w-6 h-6 sm:w-8 sm:h-8" />
                  </button>
                </div>

                {/* Navigation */}
                <div className="flex items-center justify-between mt-6">
                  <button
                    onClick={handlePrevious}
                    className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    <ChevronLeft className="w-5 h-5" />
                    Previous
                  </button>
                  
                  <div className="text-sm text-gray-500">
                    {currentMatchIndex + 1} of {displayMatches.length}
                  </div>
                  
                  <button
                    onClick={handleNext}
                    className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    Next
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Pitch Modal */}
      {showPitchModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900">
                Pitch {currentMatch?.name?.split(' ')[0] || 'them'}
              </h2>
              <button
                onClick={() => setShowPitchModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Your Pitch
              </label>
              <textarea
                value={pitchMessage}
                onChange={(e) => setPitchMessage(e.target.value)}
                placeholder="Share your vision, ideas, or what you'd like to collaborate on..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none text-sm"
                rows={4}
                disabled={isSendingPitch}
              />
              <p className="text-xs text-gray-500 mt-1">
                Be specific about what you're looking for and what you can offer.
              </p>
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={() => setShowPitchModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
                disabled={isSendingPitch}
              >
                Cancel
              </button>
              <button
                onClick={handleSendPitch}
                disabled={isSendingPitch || !pitchMessage.trim()}
                className="flex-1 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
              >
                {isSendingPitch ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Sending...
                  </div>
                ) : (
                  'Send Pitch'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AIMatchingInterface;