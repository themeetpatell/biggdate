import React, { useState, useEffect } from 'react';
import { 
  Search, Filter, SortAsc, SortDesc, Play, Pause, 
  Heart, MessageCircle, Share2, Bookmark, Eye, 
  MapPin, Calendar, Users, DollarSign, Target, 
  TrendingUp, Star, Award, Clock, Video, Mic,
  ChevronDown, ChevronUp, X, CheckCircle, 
  Building2, Zap, Lightbulb, Rocket, BarChart3,
  Globe, Tag, User, Briefcase, Award as AwardIcon,
  FileText, Send, Plus, Edit3, Trash2, Download,
  Upload, ExternalLink, ArrowRight, ArrowLeft,
  MoreHorizontal, Settings, Bell, Star as StarIcon,
  Heart as HeartIcon, MessageCircle as MessageCircleIcon,
  Share2 as Share2Icon, Bookmark as BookmarkIcon,
  Eye as EyeIcon, MapPin as MapPinIcon, Calendar as CalendarIcon,
  Users as UsersIcon, DollarSign as DollarSignIcon,
  Target as TargetIcon, TrendingUp as TrendingUpIcon,
  Award as AwardIcon2, Clock as ClockIcon, Video as VideoIcon,
  Mic as MicIcon, ChevronDown as ChevronDownIcon,
  ChevronUp as ChevronUpIcon, X as XIcon, CheckCircle as CheckCircleIcon,
  Building2 as Building2Icon, Zap as ZapIcon, Lightbulb as LightbulbIcon,
  Rocket as RocketIcon, BarChart3 as BarChart3Icon,
  Globe as GlobeIcon, Tag as TagIcon, User as UserIcon,
  Briefcase as BriefcaseIcon, FileText as FileTextIcon,
  Send as SendIcon, Plus as PlusIcon, Edit3 as Edit3Icon,
  Trash2 as Trash2Icon, Download as DownloadIcon,
  Upload as UploadIcon, ExternalLink as ExternalLinkIcon,
  ArrowRight as ArrowRightIcon, ArrowLeft as ArrowLeftIcon,
  MoreHorizontal as MoreHorizontalIcon, Settings as SettingsIcon,
  Bell as BellIcon
} from 'lucide-react';

const PitchDiscovery = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilters, setSelectedFilters] = useState({
    industries: [],
    stages: [],
    skills: [],
    locations: [],
    funding: [],
    timeRange: 'all'
  });
  const [sortBy, setSortBy] = useState('recent');
  const [viewMode, setViewMode] = useState('grid'); // grid or list
  const [showFilters, setShowFilters] = useState(false);
  const [pitches, setPitches] = useState([]);
  const [filteredPitches, setFilteredPitches] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPitch, setSelectedPitch] = useState(null);
  const [showPitchModal, setShowPitchModal] = useState(false);

  const industries = [
    'Fintech', 'AI/ML', 'SaaS', 'E-commerce', 'Healthcare', 'EdTech',
    'PropTech', 'CleanTech', 'FoodTech', 'Gaming', 'Social', 'Enterprise'
  ];

  const stages = [
    { value: 'idea', label: 'Idea Stage', color: 'bg-gray-100 text-gray-700' },
    { value: 'mvp', label: 'MVP Stage', color: 'bg-gray-100 text-gray-700' },
    { value: 'early', label: 'Early Stage', color: 'bg-gray-100 text-gray-700' },
    { value: 'growth', label: 'Growth Stage', color: 'bg-gray-100 text-gray-700' }
  ];

  const skills = [
    'Technical Co-founder', 'Business Co-founder', 'Marketing Expert',
    'Product Manager', 'UI/UX Designer', 'Sales Lead', 'Operations Manager',
    'Data Scientist', 'DevOps Engineer', 'Content Creator', 'Legal Advisor'
  ];

  const locations = [
    'San Francisco, CA', 'New York, NY', 'Austin, TX', 'Seattle, WA',
    'Boston, MA', 'Los Angeles, CA', 'Chicago, IL', 'Remote'
  ];

  const fundingRanges = [
    { value: '0-50k', label: '$0 - $50K' },
    { value: '50k-250k', label: '$50K - $250K' },
    { value: '250k-1m', label: '$250K - $1M' },
    { value: '1m+', label: '$1M+' }
  ];

  useEffect(() => {
    loadPitches();
  }, []);

  useEffect(() => {
    filterPitches();
  }, [pitches, searchQuery, selectedFilters, sortBy]);

  const loadPitches = async () => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockPitches = [
        {
          id: 1,
          title: "EcoTrack AI",
          tagline: "AI-powered carbon footprint tracking for businesses",
          description: "Revolutionary platform that helps companies track and reduce their carbon footprint using advanced AI algorithms.",
          author: {
            name: "Sarah Martinez",
            role: "Business Co-founder",
            avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=400&fit=crop&crop=face",
            location: "San Francisco, CA",
            experience: "6 years"
          },
          industries: ["CleanTech", "AI/ML"],
          stage: "mvp",
          skillsNeeded: ["Technical Co-founder", "UI/UX Designer"],
          fundingNeeds: "$500K seed round",
          marketSize: "$50B TAM",
          team: ["Sarah Martinez (CEO)", "John Chen (CTO)"],
          createdAt: "2024-01-15",
          views: 245,
          likes: 18,
          pitchBacks: 12,
          hasVideo: true,
          hasAudio: false,
          hasDeck: true,
          tags: ["AI", "Sustainability", "B2B"],
          compatibility: 92
        },
        {
          id: 2,
          title: "HealthConnect",
          tagline: "Telemedicine platform connecting patients with specialists",
          description: "Comprehensive telemedicine solution that connects patients with specialized healthcare providers through AI-powered matching.",
          author: {
            name: "Dr. Michael Chen",
            role: "Medical Co-founder",
            avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face",
            location: "Boston, MA",
            experience: "10 years"
          },
          industries: ["Healthcare", "AI/ML"],
          stage: "early",
          skillsNeeded: ["Technical Co-founder", "Product Manager", "Marketing Expert"],
          fundingNeeds: "$2M Series A",
          marketSize: "$200B TAM",
          team: ["Dr. Michael Chen (CMO)", "Lisa Wang (COO)"],
          createdAt: "2024-01-12",
          views: 189,
          likes: 25,
          pitchBacks: 8,
          hasVideo: true,
          hasAudio: true,
          hasDeck: true,
          tags: ["Healthcare", "Telemedicine", "AI"],
          compatibility: 88
        },
        {
          id: 3,
          title: "EduFlow",
          tagline: "Personalized learning platform for K-12 education",
          description: "Adaptive learning platform that personalizes education for each student using machine learning and gamification.",
          author: {
            name: "Emily Rodriguez",
            role: "Education Co-founder",
            avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face",
            location: "Austin, TX",
            experience: "8 years"
          },
          industries: ["EdTech", "AI/ML"],
          stage: "idea",
          skillsNeeded: ["Technical Co-founder", "UI/UX Designer", "Content Creator"],
          fundingNeeds: "$300K pre-seed",
          marketSize: "$100B TAM",
          team: ["Emily Rodriguez (CEO)"],
          createdAt: "2024-01-10",
          views: 156,
          likes: 14,
          pitchBacks: 6,
          hasVideo: false,
          hasAudio: true,
          hasDeck: false,
          tags: ["Education", "AI", "Gamification"],
          compatibility: 85
        }
      ];
      
      setPitches(mockPitches);
    } catch (error) {
      console.error('Error loading pitches:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filterPitches = () => {
    let filtered = [...pitches];

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(pitch => 
        pitch.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        pitch.tagline.toLowerCase().includes(searchQuery.toLowerCase()) ||
        pitch.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        pitch.author.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Industry filter
    if (selectedFilters.industries.length > 0) {
      filtered = filtered.filter(pitch =>
        pitch.industries.some(industry => selectedFilters.industries.includes(industry))
      );
    }

    // Stage filter
    if (selectedFilters.stages.length > 0) {
      filtered = filtered.filter(pitch =>
        selectedFilters.stages.includes(pitch.stage)
      );
    }

    // Skills filter
    if (selectedFilters.skills.length > 0) {
      filtered = filtered.filter(pitch =>
        pitch.skillsNeeded.some(skill => selectedFilters.skills.includes(skill))
      );
    }

    // Location filter
    if (selectedFilters.locations.length > 0) {
      filtered = filtered.filter(pitch =>
        selectedFilters.locations.includes(pitch.author.location)
      );
    }

    // Sort
    switch (sortBy) {
      case 'recent':
        filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      case 'popular':
        filtered.sort((a, b) => b.views - a.views);
        break;
      case 'likes':
        filtered.sort((a, b) => b.likes - a.likes);
        break;
      case 'compatibility':
        filtered.sort((a, b) => b.compatibility - a.compatibility);
        break;
      default:
        break;
    }

    setFilteredPitches(filtered);
  };

  const handleFilterChange = (category, value) => {
    setSelectedFilters(prev => ({
      ...prev,
      [category]: prev[category].includes(value)
        ? prev[category].filter(item => item !== value)
        : [...prev[category], value]
    }));
  };

  const clearFilters = () => {
    setSelectedFilters({
      industries: [],
      stages: [],
      skills: [],
      locations: [],
      funding: [],
      timeRange: 'all'
    });
  };

  const getActiveFiltersCount = () => {
    return Object.values(selectedFilters).reduce((count, filter) => {
      return count + (Array.isArray(filter) ? filter.length : 0);
    }, 0);
  };

  const renderPitchCard = (pitch) => {
    const stageInfo = stages.find(s => s.value === pitch.stage);
    
    return (
      <div key={pitch.id} className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300">
        {/* Header */}
        <div className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h3 className="text-xl font-bold text-gray-900">{pitch.title}</h3>
                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${stageInfo?.color}`}>
                  {stageInfo?.label}
                </span>
              </div>
              <p className="text-gray-600 text-sm mb-3">{pitch.tagline}</p>
            </div>
            <div className="flex items-center gap-2">
              <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                <Heart className="w-5 h-5" />
              </button>
              <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                <Bookmark className="w-5 h-5" />
              </button>
              <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                <Share2 className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Author */}
          <div className="flex items-center gap-3 mb-4">
            <img
              src={pitch.author.avatar}
              alt={pitch.author.name}
              className="w-10 h-10 rounded-full object-cover"
            />
            <div>
              <div className="font-semibold text-gray-900">{pitch.author.name}</div>
              <div className="text-sm text-gray-600">{pitch.author.role} • {pitch.author.location}</div>
            </div>
            <div className="ml-auto text-right">
              <div className="text-sm font-semibold text-gray-600">{pitch.compatibility}% match</div>
              <div className="text-xs text-gray-500">Compatibility</div>
            </div>
          </div>

          {/* Description */}
          <p className="text-gray-700 text-sm mb-4 line-clamp-3">{pitch.description}</p>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-4">
            {pitch.tags.map((tag, index) => (
              <span key={index} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                {tag}
              </span>
            ))}
          </div>

          {/* Stats */}
          <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <Eye className="w-4 h-4" />
                <span>{pitch.views}</span>
              </div>
              <div className="flex items-center gap-1">
                <Heart className="w-4 h-4" />
                <span>{pitch.likes}</span>
              </div>
              <div className="flex items-center gap-1">
                <MessageCircle className="w-4 h-4" />
                <span>{pitch.pitchBacks}</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {pitch.hasVideo && <Video className="w-4 h-4 text-black" />}
              {pitch.hasAudio && <Mic className="w-4 h-4 text-black" />}
              {pitch.hasDeck && <FileText className="w-4 h-4 text-black" />}
            </div>
          </div>

          {/* Skills Needed */}
          <div className="mb-4">
            <div className="text-sm font-semibold text-gray-700 mb-2">Looking for:</div>
            <div className="flex flex-wrap gap-2">
              {pitch.skillsNeeded.slice(0, 3).map((skill, index) => (
                <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                  {skill}
                </span>
              ))}
              {pitch.skillsNeeded.length > 3 && (
                <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                  +{pitch.skillsNeeded.length - 3} more
                </span>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={() => {
                setSelectedPitch(pitch);
                setShowPitchModal(true);
              }}
              className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors font-semibold"
            >
              View Details
            </button>
            <button className="flex-1 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all font-semibold">
              Send Pitch-Back
            </button>
          </div>
        </div>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium text-lg">Loading pitches...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Discover Startup Pitches</h1>
            <p className="text-gray-600">Find amazing startup ideas and connect with potential cofounders</p>
          </div>

          {/* Search and Filters */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-8">
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Search */}
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search pitches, founders, or keywords..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                />
              </div>

              {/* Filter Toggle */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors"
              >
                <Filter className="w-5 h-5" />
                Filters
                {getActiveFiltersCount() > 0 && (
                  <span className="px-2 py-1 bg-black text-white text-xs rounded-full">
                    {getActiveFiltersCount()}
                  </span>
                )}
                {showFilters ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>

              {/* Sort */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-gray-500 focus:border-transparent"
              >
                <option value="recent">Most Recent</option>
                <option value="popular">Most Popular</option>
                <option value="likes">Most Liked</option>
                <option value="compatibility">Best Match</option>
              </select>
            </div>

            {/* Filters Panel */}
            {showFilters && (
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {/* Industries */}
                  <div>
                    <h4 className="font-semibold text-gray-700 mb-3">Industries</h4>
                    <div className="space-y-2 max-h-32 overflow-y-auto">
                      {industries.map(industry => (
                        <label key={industry} className="flex items-center gap-2 text-sm">
                          <input
                            type="checkbox"
                            checked={selectedFilters.industries.includes(industry)}
                            onChange={() => handleFilterChange('industries', industry)}
                            className="rounded border-gray-300 text-gray-600 focus:ring-gray-500"
                          />
                          <span>{industry}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Stages */}
                  <div>
                    <h4 className="font-semibold text-gray-700 mb-3">Stage</h4>
                    <div className="space-y-2">
                      {stages.map(stage => (
                        <label key={stage.value} className="flex items-center gap-2 text-sm">
                          <input
                            type="checkbox"
                            checked={selectedFilters.stages.includes(stage.value)}
                            onChange={() => handleFilterChange('stages', stage.value)}
                            className="rounded border-gray-300 text-gray-600 focus:ring-gray-500"
                          />
                          <span>{stage.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Skills */}
                  <div>
                    <h4 className="font-semibold text-gray-700 mb-3">Skills Needed</h4>
                    <div className="space-y-2 max-h-32 overflow-y-auto">
                      {skills.map(skill => (
                        <label key={skill} className="flex items-center gap-2 text-sm">
                          <input
                            type="checkbox"
                            checked={selectedFilters.skills.includes(skill)}
                            onChange={() => handleFilterChange('skills', skill)}
                            className="rounded border-gray-300 text-gray-600 focus:ring-gray-500"
                          />
                          <span>{skill}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Locations */}
                  <div>
                    <h4 className="font-semibold text-gray-700 mb-3">Location</h4>
                    <div className="space-y-2 max-h-32 overflow-y-auto">
                      {locations.map(location => (
                        <label key={location} className="flex items-center gap-2 text-sm">
                          <input
                            type="checkbox"
                            checked={selectedFilters.locations.includes(location)}
                            onChange={() => handleFilterChange('locations', location)}
                            className="rounded border-gray-300 text-gray-600 focus:ring-gray-500"
                          />
                          <span>{location}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex justify-between items-center mt-6 pt-4 border-t border-gray-200">
                  <button
                    onClick={clearFilters}
                    className="text-gray-500 hover:text-gray-700 text-sm"
                  >
                    Clear all filters
                  </button>
                  <div className="text-sm text-gray-500">
                    {filteredPitches.length} pitch{filteredPitches.length !== 1 ? 'es' : ''} found
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Results */}
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredPitches.map(renderPitchCard)}
          </div>

          {filteredPitches.length === 0 && (
            <div className="text-center py-12">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-12 h-12 text-black" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No pitches found</h3>
              <p className="text-gray-600 mb-6">Try adjusting your filters or search terms</p>
              <button
                onClick={clearFilters}
                className="px-6 py-3 bg-black text-white rounded-xl hover:bg-gray-800 transition-colors"
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Pitch Detail Modal */}
      {showPitchModal && selectedPitch && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">{selectedPitch.title}</h2>
                <button
                  onClick={() => setShowPitchModal(false)}
                  className="p-2 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">Tagline</h3>
                  <p className="text-gray-600">{selectedPitch.tagline}</p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">Description</h3>
                  <p className="text-gray-600">{selectedPitch.description}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-700 mb-2">Author</h3>
                    <div className="flex items-center gap-3">
                      <img
                        src={selectedPitch.author.avatar}
                        alt={selectedPitch.author.name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      <div>
                        <div className="font-semibold text-gray-900">{selectedPitch.author.name}</div>
                        <div className="text-sm text-gray-600">{selectedPitch.author.role}</div>
                        <div className="text-sm text-gray-500">{selectedPitch.author.location}</div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-700 mb-2">Details</h3>
                    <div className="space-y-2 text-sm">
                      <div><span className="font-medium">Stage:</span> {stages.find(s => s.value === selectedPitch.stage)?.label}</div>
                      <div><span className="font-medium">Funding Needs:</span> {selectedPitch.fundingNeeds}</div>
                      <div><span className="font-medium">Market Size:</span> {selectedPitch.marketSize}</div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">Skills Needed</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedPitch.skillsNeeded.map((skill, index) => (
                      <span key={index} className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex gap-4">
                  <button className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all font-semibold">
                    Send Pitch-Back
                  </button>
                  <button className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors font-semibold">
                    Connect
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PitchDiscovery;
