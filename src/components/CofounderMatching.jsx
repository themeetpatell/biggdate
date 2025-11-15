import React, { useState, useEffect, useMemo } from 'react';
import { 
  Heart, X, Star, Eye, RefreshCw, Filter, Settings, 
  ChevronLeft, ChevronRight, MapPin, CheckCircle, Brain,
  Zap, Target, Users, Sparkles, AlertCircle, MessageCircle,
  Phone, Video, Send, ThumbsUp, ThumbsDown, Bookmark, Share2,
  MoreHorizontal, Clock, TrendingUp, Award, Flame, Diamond,
  Crown, Shield, Lock, Unlock, Volume2, VolumeX, Camera,
  Mic, MicOff, Play, Pause, SkipForward, RotateCcw,
  Maximize2, Minimize2, Info, HelpCircle, ChevronDown,
  ChevronUp, ArrowRight, ArrowLeft, ArrowUp, ArrowDown,
  Maximize, Minimize, RotateCw, ZoomIn, ZoomOut, Move,
  Copy, Scissors, Trash2, Save, Upload, Download, Link,
  Link2, Unlink, Key, KeyRound, ShieldCheck, ShieldAlert,
  AlertTriangle, AlertOctagon, CheckCircle2, XCircle,
  PlusCircle, MinusCircle, Building2, DollarSign, Globe,
  Instagram, Twitter, Linkedin, Github, ExternalLink, Coffee,
  Plane, Gamepad2, BookOpen, BarChart3, Activity, Compass,
  Badge, Gift, Bell, BellOff, EyeOff, Search, SortAsc, SortDesc,
  Grid3x3, List, FileText, Briefcase, GraduationCap, Calendar,
  TrendingDown, BarChart2, Percent, UserCheck, Mail, Tag
} from 'lucide-react';

const CofounderMatching = ({ currentUser, matches, onConnect, onPass, onPitch, onViewProfile, onRefresh }) => {
  const [viewMode, setViewMode] = useState('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [showPitchModal, setShowPitchModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(null);
  const [selectedCofounder, setSelectedCofounder] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('compatibility');
  const [bookmarkedIds, setBookmarkedIds] = useState(() => {
    return JSON.parse(localStorage.getItem('bookmarkedCofounders') || '[]');
  });
  const [filters, setFilters] = useState({
    role: '',
    location: '',
    minCompatibility: 0,
    skills: [],
    industries: [],
    experienceLevel: ''
  });

  const [pitchForm, setPitchForm] = useState({
    startupIdea: '',
    yourRole: '',
    lookingFor: '',
    whyGreatCofounders: '',
    equityOffer: '',
    timeline: ''
  });

  const calculateDetailedVisionMatch = (cofounder) => {
    const breakdown = {
      industryAlignment: 0,
      roleMatch: 0,
      skillComplement: 0,
      locationMatch: 0,
      experienceMatch: 0,
      visionAlignment: 0
    };

    if (currentUser?.industries && cofounder?.industries) {
      const commonIndustries = currentUser.industries.filter(ind => 
        cofounder.industries.includes(ind)
      );
      breakdown.industryAlignment = Math.round(
        (commonIndustries.length / Math.max(currentUser.industries.length, cofounder.industries.length)) * 100
      );
    }

    if (currentUser?.lookingFor && cofounder?.role) {
      const roleMatch = currentUser.lookingFor.some(role => 
        role.toLowerCase().includes(cofounder.role.toLowerCase())
      );
      breakdown.roleMatch = roleMatch ? 100 : 0;
    }

    if (cofounder?.lookingFor && currentUser?.role) {
      const mutualMatch = cofounder.lookingFor.some(role => 
        role.toLowerCase().includes(currentUser.role.toLowerCase())
      );
      breakdown.visionAlignment = mutualMatch ? 100 : 0;
    }

    if (currentUser?.skills && cofounder?.skills) {
      const commonSkills = currentUser.skills.filter(skill => 
        cofounder.skills.includes(skill)
      );
      const uniqueSkills = new Set([...currentUser.skills, ...cofounder.skills]);
      breakdown.skillComplement = Math.round(
        (commonSkills.length / uniqueSkills.size) * 100
      );
    }

    if (currentUser?.location && cofounder?.location) {
      const currentCity = currentUser.location.split(',')[0].toLowerCase();
      const cofounderCity = cofounder.location.split(',')[0].toLowerCase();
      breakdown.locationMatch = currentCity === cofounderCity ? 100 : 50;
    }

    if (currentUser?.experience && cofounder?.experience) {
      const currentExp = parseInt(currentUser.experience) || 0;
      const cofounderExp = parseInt(cofounder.experience) || 0;
      const diff = Math.abs(currentExp - cofounderExp);
      breakdown.experienceMatch = Math.max(0, 100 - (diff * 10));
    }

    const weights = {
      industryAlignment: 0.20,
      roleMatch: 0.25,
      skillComplement: 0.20,
      locationMatch: 0.10,
      experienceMatch: 0.10,
      visionAlignment: 0.15
    };

    const overallScore = Math.round(
      breakdown.industryAlignment * weights.industryAlignment +
      breakdown.roleMatch * weights.roleMatch +
      breakdown.skillComplement * weights.skillComplement +
      breakdown.locationMatch * weights.locationMatch +
      breakdown.experienceMatch * weights.experienceMatch +
      breakdown.visionAlignment * weights.visionAlignment
    );

    return {
      overall: overallScore,
      breakdown
    };
  };

  const filteredAndSortedMatches = useMemo(() => {
    return matches
      .map(match => {
        const matchDetails = calculateDetailedVisionMatch(match);
        return {
          ...match,
          visionMatch: matchDetails.overall,
          compatibility: match.compatibility || matchDetails.overall,
          matchBreakdown: matchDetails.breakdown
        };
      })
      .filter(match => {
        if (searchQuery) {
          const query = searchQuery.toLowerCase();
          const matchesSearch = 
            match.name.toLowerCase().includes(query) ||
            match.role.toLowerCase().includes(query) ||
            match.bio.toLowerCase().includes(query) ||
            match.skills?.some(skill => skill.toLowerCase().includes(query)) ||
            match.location.toLowerCase().includes(query);
          if (!matchesSearch) return false;
        }
        if (filters.role && !match.role.toLowerCase().includes(filters.role.toLowerCase())) {
          return false;
        }
        if (filters.location && !match.location.toLowerCase().includes(filters.location.toLowerCase())) {
          return false;
        }
        if (match.compatibility < filters.minCompatibility) {
          return false;
        }
        if (filters.skills.length > 0) {
          const hasSkill = filters.skills.some(skill => 
            match.skills?.some(matchSkill => matchSkill.toLowerCase().includes(skill.toLowerCase()))
          );
          if (!hasSkill) return false;
        }
        if (filters.industries.length > 0 && match.industries) {
          const hasIndustry = filters.industries.some(ind => 
            match.industries.some(matchInd => matchInd.toLowerCase().includes(ind.toLowerCase()))
          );
          if (!hasIndustry) return false;
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'compatibility') {
          return b.compatibility - a.compatibility;
        }
        if (sortBy === 'name') {
          return a.name.localeCompare(b.name);
        }
        if (sortBy === 'experience') {
          const aExp = parseInt(a.experience) || 0;
          const bExp = parseInt(b.experience) || 0;
          return bExp - aExp;
        }
        return 0;
      });
  }, [matches, searchQuery, filters, sortBy, currentUser]);

  const handleSendPitch = () => {
    if (selectedCofounder && pitchForm.startupIdea.trim()) {
      const pitchData = {
        id: Date.now(),
        pitchId: selectedCofounder.id,
        title: pitchForm.startupIdea.split('.')[0].substring(0, 50) || 'My Startup Idea',
        description: pitchForm.startupIdea,
        author: selectedCofounder.name,
        status: 'pending',
        sentAt: new Date().toISOString(),
        message: `${pitchForm.startupIdea}\n\nMy Role: ${pitchForm.yourRole}\nLooking For: ${pitchForm.lookingFor}\nEquity Offer: ${pitchForm.equityOffer}\nTimeline: ${pitchForm.timeline}\n\n${pitchForm.whyGreatCofounders}`,
        response: null,
        compatibility: selectedCofounder.compatibility,
        cofounderDetails: {
          id: selectedCofounder.id,
          name: selectedCofounder.name,
          role: selectedCofounder.role,
          avatar: selectedCofounder.avatar
        }
      };

      const existingPitches = JSON.parse(localStorage.getItem('sentPitches') || '[]');
      existingPitches.push(pitchData);
      localStorage.setItem('sentPitches', JSON.stringify(existingPitches));

      if (onPitch) {
        onPitch(selectedCofounder.id, pitchData.message);
      }

      setShowPitchModal(false);
      setPitchForm({
        startupIdea: '',
        yourRole: '',
        lookingFor: '',
        whyGreatCofounders: '',
        equityOffer: '',
        timeline: ''
      });
      setSelectedCofounder(null);
    }
  };

  const handleBookmark = (cofounderId) => {
    const newBookmarks = bookmarkedIds.includes(cofounderId)
      ? bookmarkedIds.filter(id => id !== cofounderId)
      : [...bookmarkedIds, cofounderId];
    setBookmarkedIds(newBookmarks);
    localStorage.setItem('bookmarkedCofounders', JSON.stringify(newBookmarks));
  };

  const getSentPitchStatus = (cofounderId) => {
    const sentPitches = JSON.parse(localStorage.getItem('sentPitches') || '[]');
    const pitch = sentPitches.find(p => p.cofounderDetails?.id === cofounderId);
    return pitch ? pitch.status : null;
  };

  const pitchTemplates = [
    {
      name: 'Technical Co-founder',
      template: `I'm building [startup name] - a [brief description] that solves [problem] for [target market].

My Role: Technical Co-founder/CTO
Looking For: Business Co-founder with experience in [industry]

I have [X] years of experience in [technologies] and have [achievements]. I think we'd make great cofounders because [reasons].`
    },
    {
      name: 'Business Co-founder',
      template: `I'm building [startup name] - a [brief description] that addresses [market need].

My Role: Business Co-founder/CEO
Looking For: Technical Co-founder with expertise in [tech stack]

I bring [business experience] and have [achievements]. Together, we could [vision].`
    }
  ];

  const applyTemplate = (template) => {
    setPitchForm({...pitchForm, startupIdea: template});
  };

  if (showPitchModal && selectedCofounder) {
    return (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
        <div className="bg-white rounded-3xl p-8 max-w-3xl w-full mx-auto max-h-[90vh] overflow-y-auto shadow-2xl">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <img
                src={selectedCofounder.avatar}
                alt={selectedCofounder.name}
                className="w-16 h-16 rounded-full object-cover border-2 border-gray-200"
              />
              <div>
                <h2 className="text-xl font-bold text-gray-900">{selectedCofounder.name}</h2>
                <p className="text-gray-600">{selectedCofounder.role} • {selectedCofounder.location}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-sm font-semibold text-gray-700">{selectedCofounder.compatibility}% Match</span>
                  <div className="w-16 bg-gray-200 rounded-full h-1.5">
                    <div
                      className="bg-black h-1.5 rounded-full"
                      style={{ width: `${selectedCofounder.compatibility}%` }}
                    ></div>
                  </div>
                </div>
              </div>
          </div>
            <button
              onClick={() => {
                setShowPitchModal(false);
                setSelectedCofounder(null);
                setPitchForm({
                  startupIdea: '',
                  yourRole: '',
                  lookingFor: '',
                  whyGreatCofounders: '',
                  equityOffer: '',
                  timeline: ''
                });
              }}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          <div className="mb-6 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl border border-purple-100">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-5 h-5 text-purple-600" />
              <h3 className="font-semibold text-gray-900">Pitch Templates</h3>
        </div>
            <div className="flex gap-2 flex-wrap">
              {pitchTemplates.map((template, idx) => (
                <button
                  key={idx}
                  onClick={() => applyTemplate(template.template)}
                  className="px-3 py-1.5 text-sm bg-white border border-purple-200 rounded-lg hover:bg-purple-50 transition-colors"
                >
                  {template.name}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Your Cofounder Pitch</h3>
              <p className="text-gray-600 text-sm mb-4">
                Share your startup idea, your background, and why you'd make great cofounders
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Startup Idea * <span className="text-gray-400 font-normal">(500 chars max)</span>
                </label>
                <textarea
                  value={pitchForm.startupIdea}
                  onChange={(e) => {
                    if (e.target.value.length <= 500) {
                      setPitchForm({...pitchForm, startupIdea: e.target.value});
                    }
                  }}
                  placeholder="I'm building [your startup idea] - a [brief description]. We're solving [problem] for [target market]..."
                  className="w-full h-32 p-4 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent resize-none transition-all"
                />
                <div className="flex justify-between mt-1">
                  <span className={`text-xs ${pitchForm.startupIdea.length > 450 ? 'text-red-500' : 'text-gray-500'}`}>
                    {pitchForm.startupIdea.length}/500 characters
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Your Role
                  </label>
                  <input
                    type="text"
                    value={pitchForm.yourRole}
                    onChange={(e) => setPitchForm({...pitchForm, yourRole: e.target.value})}
                    placeholder="e.g., Technical Co-founder, CEO, CTO"
                    className="w-full p-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Looking For
                  </label>
                  <input
                    type="text"
                    value={pitchForm.lookingFor}
                    onChange={(e) => setPitchForm({...pitchForm, lookingFor: e.target.value})}
                    placeholder="e.g., Business Co-founder, Marketing Lead"
                    className="w-full p-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Equity Offer (Optional)
                  </label>
                  <input
                    type="text"
                    value={pitchForm.equityOffer}
                    onChange={(e) => setPitchForm({...pitchForm, equityOffer: e.target.value})}
                    placeholder="e.g., 20-30% equity"
                    className="w-full p-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Timeline (Optional)
                  </label>
                  <input
                    type="text"
                    value={pitchForm.timeline}
                    onChange={(e) => setPitchForm({...pitchForm, timeline: e.target.value})}
                    placeholder="e.g., 6-12 months to launch"
                    className="w-full p-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Why We'd Make Great Cofounders
                </label>
                <textarea
                  value={pitchForm.whyGreatCofounders}
                  onChange={(e) => setPitchForm({...pitchForm, whyGreatCofounders: e.target.value})}
                  placeholder="I have [your experience/skills] and I think we'd complement each other because [reasons]. I'm looking for someone who [what you need]..."
                  className="w-full h-24 p-4 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent resize-none"
                />
              </div>
            </div>

            <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
              <div className="flex items-start gap-2">
                <Info className="w-5 h-5 text-blue-600 mt-0.5" />
                <p className="text-sm text-blue-800">
                  This pitch will be sent anonymously. Your identity will only be revealed if the co-founder accepts your pitch.
                </p>
              </div>
            </div>
          </div>

          <div className="flex gap-3 mt-8">
            <button
              onClick={() => {
                setShowPitchModal(false);
                setSelectedCofounder(null);
                setPitchForm({
                  startupIdea: '',
                  yourRole: '',
                  lookingFor: '',
                  whyGreatCofounders: '',
                  equityOffer: '',
                  timeline: ''
                });
              }}
              className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-all duration-300"
            >
              Cancel
            </button>
            <button
              onClick={handleSendPitch}
              disabled={!pitchForm.startupIdea.trim()}
              className="flex-1 py-3 bg-black text-white rounded-xl font-semibold hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4" />
              Send Pitch
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (showProfileModal) {
    const match = filteredAndSortedMatches.find(m => m.id === showProfileModal);
    if (!match) return null;

    return (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn overflow-y-auto">
        <div className="bg-white rounded-3xl p-8 max-w-4xl w-full mx-auto my-8 shadow-2xl">
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-start gap-6">
              <img
                src={match.avatar || 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=200&h=200&fit=crop&crop=face'}
                alt={match.name}
                className="w-24 h-24 rounded-2xl object-cover border-4 border-white shadow-lg"
              />
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-1">{match.name}</h2>
                <p className="text-lg text-gray-600 font-semibold mb-2">{match.role}</p>
                <div className="flex items-center gap-2 text-gray-500 mb-3">
                  <MapPin className="w-4 h-4" />
                  <span>{match.location}</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-gray-700">Match Score:</span>
                    <span className="text-lg font-bold text-gray-900">{match.compatibility}%</span>
                  </div>
                  <div className="w-24 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-black h-2 rounded-full transition-all duration-300"
                      style={{ width: `${match.compatibility}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
            <button
              onClick={() => setShowProfileModal(null)}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="bg-gray-50 rounded-2xl p-6">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Target className="w-5 h-5" />
                Compatibility Breakdown
              </h3>
              <div className="space-y-3">
                {Object.entries(match.matchBreakdown || {}).map(([key, value]) => (
                  <div key={key}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-gray-600 capitalize">
                        {key.replace(/([A-Z])/g, ' $1').trim()}
                      </span>
                      <span className="text-sm font-semibold text-gray-900">{value}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-1.5">
                      <div
                        className="bg-black h-1.5 rounded-full transition-all duration-300"
                        style={{ width: `${value}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gray-50 rounded-2xl p-6">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <UserCheck className="w-5 h-5" />
                Quick Stats
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Experience</span>
                  <span className="text-sm font-semibold text-gray-900">{match.experience || 'N/A'}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Previous Startups</span>
                  <span className="text-sm font-semibold text-gray-900">{match.previousStartups?.length || 0}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Skills</span>
                  <span className="text-sm font-semibold text-gray-900">{match.skills?.length || 0}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="font-semibold text-gray-900 mb-3">About</h3>
            <p className="text-gray-700 leading-relaxed">{match.bio}</p>
            </div>

          <div className="mb-6">
            <h3 className="font-semibold text-gray-900 mb-3">Skills</h3>
              <div className="flex flex-wrap gap-2">
              {match.skills?.map((skill, index) => (
                  <span
                    key={index}
                  className="px-3 py-1.5 bg-gray-100 text-gray-700 text-sm rounded-full font-medium"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

          <div className="mb-6">
            <h3 className="font-semibold text-gray-900 mb-3">Looking For</h3>
              <div className="flex flex-wrap gap-2">
              {match.lookingFor?.map((role, index) => (
                  <span
                    key={index}
                  className="px-3 py-1.5 bg-purple-100 text-purple-700 text-sm rounded-full font-medium"
                  >
                    {role}
                  </span>
                ))}
              </div>
            </div>

          {match.previousStartups && match.previousStartups.length > 0 && (
            <div className="mb-6">
              <h3 className="font-semibold text-gray-900 mb-3">Previous Startups</h3>
              <div className="space-y-2">
                {match.previousStartups.map((startup, index) => (
                  <div key={index} className="flex items-center gap-2 text-gray-700">
                    <CheckCircle className="w-4 h-4 text-black" />
                    <span>{startup}</span>
                  </div>
                ))}
                  </div>
                </div>
          )}

          <div className="flex gap-3 pt-6 border-t border-gray-200">
            <button
              onClick={() => {
                setSelectedCofounder(match);
                setShowProfileModal(null);
                setShowPitchModal(true);
              }}
              className="flex-1 py-3 bg-black text-white rounded-xl font-semibold hover:bg-gray-800 transition-all duration-300 flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4" />
              Send Pitch
            </button>
            <button
              onClick={() => handleBookmark(match.id)}
              className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center gap-2 ${
                bookmarkedIds.includes(match.id)
                  ? 'bg-yellow-100 text-yellow-700 border-2 border-yellow-300'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <Bookmark className={`w-4 h-4 ${bookmarkedIds.includes(match.id) ? 'fill-current' : ''}`} />
              {bookmarkedIds.includes(match.id) ? 'Bookmarked' : 'Bookmark'}
            </button>
                    </div>
                  </div>
                </div>
    );
  }

  const stats = {
    total: matches.length,
    filtered: filteredAndSortedMatches.length,
    avgCompatibility: filteredAndSortedMatches.length > 0
      ? Math.round(filteredAndSortedMatches.reduce((sum, m) => sum + m.compatibility, 0) / filteredAndSortedMatches.length)
      : 0,
    bookmarked: bookmarkedIds.length
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      <div className="max-w-7xl mx-auto p-6">

        <div className="mb-6 flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="flex-1 w-full sm:w-auto">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by name, role, skills, location..."
                className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent bg-white shadow-sm"
              />
            </div>
          </div>

            <div className="flex gap-3">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`px-4 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center gap-2 ${
                showFilters ? 'bg-black text-white shadow-lg' : 'bg-white text-gray-700 border-2 border-gray-300 hover:bg-gray-50'
              }`}
            >
              <Filter className="w-4 h-4" />
              Filters
              {Object.values(filters).some(v => v !== '' && v !== 0 && (!Array.isArray(v) || v.length > 0)) && (
                <span className="ml-1 px-2 py-0.5 bg-black text-white text-xs rounded-full">
                  {Object.values(filters).filter(v => v !== '' && v !== 0 && (!Array.isArray(v) || v.length > 0)).length}
                </span>
              )}
            </button>
            <div className="flex bg-white border-2 border-gray-300 rounded-xl overflow-hidden shadow-sm">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-3 transition-colors ${viewMode === 'grid' ? 'bg-black text-white' : 'text-gray-700 hover:bg-gray-50'}`}
              >
                <Grid3x3 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-3 transition-colors ${viewMode === 'list' ? 'bg-black text-white' : 'text-gray-700 hover:bg-gray-50'}`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent bg-white shadow-sm"
            >
              <option value="compatibility">Sort by Match</option>
              <option value="name">Sort by Name</option>
              <option value="experience">Sort by Experience</option>
            </select>
          </div>
        </div>

        {showFilters && (
          <div className="mb-6 bg-white rounded-2xl p-6 shadow-lg border-2 border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
                <input
                  type="text"
                  value={filters.role}
                  onChange={(e) => setFilters({...filters, role: e.target.value})}
                  placeholder="e.g., Technical Co-founder"
                  className="w-full p-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                <input
                  type="text"
                  value={filters.location}
                  onChange={(e) => setFilters({...filters, location: e.target.value})}
                  placeholder="e.g., San Francisco"
                  className="w-full p-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Min Compatibility: {filters.minCompatibility}%
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={filters.minCompatibility}
                  onChange={(e) => setFilters({...filters, minCompatibility: parseInt(e.target.value)})}
                  className="w-full"
                />
              </div>
              <div className="flex items-end">
                <button
                  onClick={() => setFilters({role: '', location: '', minCompatibility: 0, skills: [], industries: [], experienceLevel: ''})}
                  className="w-full py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-all duration-300"
                >
                  Clear All
                </button>
              </div>
            </div>
          </div>
        )}

        {filteredAndSortedMatches.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl shadow-lg border-2 border-gray-200">
            <div className="w-32 h-32 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <Heart className="w-16 h-16 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-3">No Matches Found</h2>
            <p className="text-gray-600 mb-8 text-lg">Try adjusting your filters or search query to find more co-founders</p>
            <button
              onClick={() => {
                setSearchQuery('');
                setFilters({role: '', location: '', minCompatibility: 0, skills: [], industries: [], experienceLevel: ''});
              }}
              className="px-8 py-4 bg-black text-white rounded-xl font-semibold hover:bg-gray-800 transition-all duration-300 text-lg"
            >
              Clear All Filters
            </button>
          </div>
        ) : (
          <div className={`${
            viewMode === 'grid' 
              ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' 
              : 'space-y-4'
          }`}>
            {filteredAndSortedMatches.map((match) => {
              const sentStatus = getSentPitchStatus(match.id);
              const isBookmarked = bookmarkedIds.includes(match.id);
              
              return (
                <div
                  key={match.id}
                  className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 border-2 border-transparent hover:border-gray-200 group"
                >
                  <div className="relative h-40 bg-gradient-to-br from-purple-400 via-pink-500 to-red-500">
                    {match.coverImage && (
                      <img
                        src={match.coverImage}
                        alt={`${match.name} cover`}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.style.display = 'none';
                        }}
                      />
                    )}
                    <div className="absolute top-3 right-3 flex gap-2">
                      <button
                        onClick={() => handleBookmark(match.id)}
                        className={`p-2 rounded-full backdrop-blur-sm transition-all ${
                          isBookmarked 
                            ? 'bg-yellow-500/90 text-white' 
                            : 'bg-white/20 text-white hover:bg-white/30'
                        }`}
                      >
                        <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} />
                      </button>
                      <div className="p-2 bg-white/20 backdrop-blur-sm rounded-full">
                        <Heart className="w-4 h-4 text-white" />
                      </div>
                    </div>
                    {sentStatus && (
                      <div className="absolute top-3 left-3">
                        <span className={`px-3 py-1.5 text-xs font-semibold rounded-full shadow-lg ${
                          sentStatus === 'accepted' ? 'bg-green-500 text-white' :
                          sentStatus === 'rejected' ? 'bg-red-500 text-white' :
                          'bg-yellow-500 text-white'
                        }`}>
                          {sentStatus === 'accepted' ? '✓ Accepted' : sentStatus === 'rejected' ? '✗ Rejected' : '📤 Sent'}
                        </span>
                      </div>
                    )}
                    <div className="absolute bottom-3 left-3 right-3">
                      <div className="bg-white/90 backdrop-blur-sm rounded-xl px-3 py-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-medium text-gray-600">Vision Match</span>
                          <span className="text-lg font-bold text-gray-900">{match.compatibility}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                          <div
                            className={`h-2 rounded-full transition-all duration-500 ${
                              match.compatibility >= 80 ? 'bg-green-500' :
                              match.compatibility >= 60 ? 'bg-yellow-500' :
                              'bg-orange-500'
                            }`}
                            style={{ width: `${match.compatibility}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="relative px-6 pt-2 pb-4">
                    <div className="flex items-start gap-4 -mt-16">
                      <img
                        src={match.avatar || 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=200&h=200&fit=crop&crop=face'}
                        alt={match.name}
                        className="w-24 h-24 rounded-2xl object-cover border-4 border-white shadow-xl"
                        onError={(e) => {
                          e.target.src = 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=200&h=200&fit=crop&crop=face';
                        }}
                      />
                      <div className="flex-1 mt-16">
                        <h3 className="text-xl font-bold text-gray-900 mb-1">{match.name}</h3>
                        <p className="text-gray-600 font-semibold">{match.role}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <MapPin className="w-3 h-3 text-gray-500" />
                          <span className="text-xs text-gray-600">{match.location}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="px-6 pb-6">
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2 min-h-[2.5rem]">{match.bio}</p>

                    <div className="mb-4">
                      <h4 className="text-sm font-semibold text-gray-900 mb-2 flex items-center gap-1">
                        <Zap className="w-3 h-3" />
                        Top Skills
                      </h4>
                      <div className="flex flex-wrap gap-1">
                        {match.skills?.slice(0, 4).map((skill, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full font-medium"
                          >
                            {skill}
                          </span>
                        ))}
                        {match.skills?.length > 4 && (
                          <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full font-medium">
                            +{match.skills.length - 4}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="mb-4">
                      <h4 className="text-sm font-semibold text-gray-900 mb-2 flex items-center gap-1">
                        <Target className="w-3 h-3" />
                        Looking For
                      </h4>
                      <div className="flex flex-wrap gap-1">
                        {match.lookingFor?.slice(0, 2).map((role, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full font-medium"
                          >
                            {role}
                          </span>
                        ))}
                      </div>
                    </div>

                    {match.experience && (
                      <div className="mb-4 flex items-center gap-2 text-sm text-gray-600">
                        <Briefcase className="w-4 h-4" />
                        <span>{match.experience} years experience</span>
                      </div>
                    )}

                    <div className="flex gap-2 pt-4 border-t border-gray-100">
                      <button
                        onClick={() => setShowProfileModal(match.id)}
                        className="flex-1 py-2.5 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-all duration-300 text-sm flex items-center justify-center gap-2"
                      >
                        <Eye className="w-4 h-4" />
                        View Profile
                      </button>
                      {!sentStatus ? (
                        <button
                          onClick={() => handlePitchClick(match)}
                          className="flex-1 py-2.5 bg-black text-white rounded-xl font-semibold hover:bg-gray-800 transition-all duration-300 text-sm flex items-center justify-center gap-2"
                        >
                          <Send className="w-4 h-4" />
                          Send Pitch
                        </button>
                      ) : (
                        <button
                          onClick={() => window.location.href = '/my-pitches'}
                          className="flex-1 py-2.5 bg-gray-600 text-white rounded-xl font-semibold hover:bg-gray-700 transition-all duration-300 text-sm flex items-center justify-center gap-2"
                        >
                          <MessageCircle className="w-4 h-4" />
                          View Pitch
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <div className="mt-8 text-center">
          <p className="text-gray-500 text-sm">
            Showing <span className="font-semibold text-gray-700">{filteredAndSortedMatches.length}</span> of{' '}
            <span className="font-semibold text-gray-700">{matches.length}</span> co-founders
          </p>
        </div>
      </div>
    </div>
  );
};

export default CofounderMatching;
