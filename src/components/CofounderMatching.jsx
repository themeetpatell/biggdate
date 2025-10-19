import React, { useState, useEffect } from 'react';
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
  Badge, Gift, Bell, BellOff, EyeOff, Search, SortAsc, SortDesc
} from 'lucide-react';

const CofounderMatching = ({ currentUser, matches, onConnect, onPass, onPitch, onViewProfile, onRefresh }) => {
  const [currentMatchIndex, setCurrentMatchIndex] = useState(0);
  const [isMatched, setIsMatched] = useState(false);
  const [matchedCofounder, setMatchedCofounder] = useState(null);
  const [showMatchModal, setShowMatchModal] = useState(false);
  const [showPitchModal, setShowPitchModal] = useState(false);
  const [pitchMessage, setPitchMessage] = useState('');

  const currentMatch = matches[currentMatchIndex];

  const handleConnect = () => {
    if (currentMatch) {
      // Simulate match acceptance
      setIsMatched(true);
      setMatchedCofounder(currentMatch);
      setShowMatchModal(true);
      onConnect(currentMatch.id);
    }
  };

  const handlePass = () => {
    if (currentMatch) {
      onPass(currentMatch.id);
      setCurrentMatchIndex(prev => (prev + 1) % matches.length);
    }
  };

  const handlePitch = () => {
    if (currentMatch) {
      setShowPitchModal(true);
    }
  };

  const handleSendPitch = () => {
    if (currentMatch && pitchMessage.trim()) {
      onPitch(currentMatch.id, pitchMessage);
      setShowPitchModal(false);
      setPitchMessage('');
      // Move to next match after pitching
      setCurrentMatchIndex(prev => (prev + 1) % matches.length);
    }
  };

  const handleStartJourney = () => {
    setShowMatchModal(false);
    // Navigate to startup workspace
    window.location.href = '/startup-workspace';
  };

  if (isMatched && showMatchModal) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-white rounded-3xl p-8 max-w-md mx-auto text-center">
          <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <Heart className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">🎉 It's a Match!</h2>
          <p className="text-gray-600 mb-6">
            You and {matchedCofounder?.name} have accepted each other as cofounders!
          </p>
          <div className="space-y-3">
            <button
              onClick={handleStartJourney}
              className="w-full py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-semibold hover:from-purple-600 hover:to-pink-600 transition-all duration-300"
            >
              Start Your Startup Journey
            </button>
            <button
              onClick={() => setShowMatchModal(false)}
              className="w-full py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-all duration-300"
            >
              Continue Matching
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (showPitchModal) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-white rounded-3xl p-8 max-w-2xl mx-auto">
          {/* Header with cofounder info */}
          <div className="flex items-center gap-4 mb-6 p-4 bg-gray-50 rounded-2xl">
            <img
              src={currentMatch?.avatar}
              alt={currentMatch?.name}
              className="w-16 h-16 rounded-full object-cover"
            />
            <div>
              <h2 className="text-xl font-bold text-gray-900">{currentMatch?.name}</h2>
              <p className="text-gray-600">{currentMatch?.role} • {currentMatch?.location}</p>
              <div className="flex flex-wrap gap-1 mt-2">
                {currentMatch?.skills?.slice(0, 3).map((skill, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Pitch form */}
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
                  Startup Idea
                </label>
                <textarea
                  value={pitchMessage}
                  onChange={(e) => setPitchMessage(e.target.value)}
                  placeholder="I'm building [your startup idea] - a [brief description]. We're solving [problem] for [target market]..."
                  className="w-full h-24 p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent resize-none"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Your Role
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., Technical Co-founder, CEO, CTO"
                    className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Looking For
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., Business Co-founder, Marketing Lead"
                    className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Why We'd Make Great Cofounders
                </label>
                <textarea
                  placeholder="I have [your experience/skills] and I think we'd complement each other because [reasons]. I'm looking for someone who [what you need]..."
                  className="w-full h-20 p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent resize-none"
                />
              </div>
            </div>

            <div className="flex items-center justify-between text-sm text-gray-500">
              <span>{pitchMessage.length}/500 characters</span>
              <span>This will be sent anonymously until accepted</span>
            </div>
          </div>

          <div className="flex gap-3 mt-8">
            <button
              onClick={() => setShowPitchModal(false)}
              className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-all duration-300"
            >
              Cancel
            </button>
            <button
              onClick={handleSendPitch}
              disabled={!pitchMessage.trim()}
              className="flex-1 py-3 bg-black text-white rounded-xl font-semibold hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
            >
              Send Pitch
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!currentMatch) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-24 h-24 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <Heart className="w-12 h-12 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">No More Matches</h2>
          <p className="text-gray-600 mb-6">Check back later for new cofounder opportunities!</p>
          <button
            onClick={onRefresh}
            className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-semibold hover:from-purple-600 hover:to-pink-600 transition-all duration-300"
          >
            Refresh Matches
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto p-6">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Find Your Cofounder</h1>
          <p className="text-gray-600">Swipe through potential cofounders and build your startup together</p>
        </div>

        {/* Match Card */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden max-w-md mx-auto">
          {/* Profile Image */}
          <div className="relative h-48 bg-gray-200">
            <img
              src={currentMatch.avatar}
              alt={currentMatch.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-4 right-4">
              <div className="bg-white/20 backdrop-blur-sm rounded-full p-2">
                <Heart className="w-6 h-6 text-white" />
              </div>
            </div>
            <div className="absolute bottom-4 left-4 right-4">
              <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-4">
                <h3 className="text-xl font-bold text-gray-900">{currentMatch.name}</h3>
                <p className="text-gray-600 font-semibold">{currentMatch.role}</p>
                <div className="flex items-center gap-2 mt-2">
                  <MapPin className="w-4 h-4 text-black" />
                  <span className="text-sm text-gray-600">{currentMatch.location}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Profile Details */}
          <div className="p-4">
            <div className="mb-4">
              <h4 className="font-semibold text-gray-900 mb-2">About</h4>
              <p className="text-gray-600 text-sm leading-relaxed">{currentMatch.bio}</p>
            </div>

            <div className="mb-4">
              <h4 className="font-semibold text-gray-900 mb-2">Startup Experience</h4>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Award className="w-4 h-4 text-black" />
                  <span className="text-sm text-gray-600">5+ years in startups</span>
                </div>
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-black" />
                  <span className="text-sm text-gray-600">Led 3 successful product launches</span>
                </div>
                <div className="flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-black" />
                  <span className="text-sm text-gray-600">Raised $2M+ in funding</span>
                </div>
              </div>
            </div>

            <div className="mb-4">
              <h4 className="font-semibold text-gray-900 mb-2">Skills</h4>
              <div className="flex flex-wrap gap-2">
                {currentMatch.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            <div className="mb-4">
              <h4 className="font-semibold text-gray-900 mb-2">Previous Startups</h4>
              <div className="space-y-1">
                {currentMatch.previousStartups.map((startup, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-black" />
                    <span className="text-sm text-gray-600">{startup}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mb-4">
              <h4 className="font-semibold text-gray-900 mb-2">Looking For</h4>
              <div className="flex flex-wrap gap-2">
                {currentMatch.lookingFor.map((role, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full"
                  >
                    {role}
                  </span>
                ))}
              </div>
            </div>

            <div className="mb-4">
              <h4 className="font-semibold text-gray-900 mb-3">Compatibility Analysis</h4>
              
              {/* Overall Compatibility */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Overall Match</span>
                  <span className="text-sm font-semibold text-gray-900">
                    {currentMatch.compatibility}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-black h-3 rounded-full transition-all duration-300"
                    style={{ width: `${currentMatch.compatibility}%` }}
                  ></div>
                </div>
              </div>

              {/* Detailed Compatibility Metrics */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Target className="w-4 h-4 text-black" />
                    <span className="text-sm text-gray-600">Vision Alignment</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-16 bg-gray-200 rounded-full h-2">
                      <div className="bg-gray-600 h-2 rounded-full" style={{ width: '85%' }}></div>
                    </div>
                    <span className="text-xs font-semibold text-gray-700">85%</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-black" />
                    <span className="text-sm text-gray-600">Skill Complement</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-16 bg-gray-200 rounded-full h-2">
                      <div className="bg-gray-700 h-2 rounded-full" style={{ width: '92%' }}></div>
                    </div>
                    <span className="text-xs font-semibold text-gray-700">92%</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-black" />
                    <span className="text-sm text-gray-600">Work Style</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-16 bg-gray-200 rounded-full h-2">
                      <div className="bg-gray-800 h-2 rounded-full" style={{ width: '78%' }}></div>
                    </div>
                    <span className="text-xs font-semibold text-gray-700">78%</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-black" />
                    <span className="text-sm text-gray-600">Location Match</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-16 bg-gray-200 rounded-full h-2">
                      <div className="bg-gray-900 h-2 rounded-full" style={{ width: '95%' }}></div>
                    </div>
                    <span className="text-xs font-semibold text-gray-700">95%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="p-4 pt-0">
            <div className="flex gap-3">
              <button
                onClick={handlePass}
                className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-all duration-300 flex items-center justify-center gap-2"
              >
                <X className="w-5 h-5" />
                Pass
              </button>
              <button
                onClick={handlePitch}
                className="flex-1 py-3 bg-black text-white rounded-xl font-semibold hover:bg-gray-800 transition-all duration-300 flex items-center justify-center gap-2"
              >
                <Send className="w-5 h-5" />
                Pitch
              </button>
            </div>
          </div>
        </div>

        {/* Match Counter */}
        <div className="text-center mt-6">
          <p className="text-gray-500 text-sm">
            {currentMatchIndex + 1} of {matches.length} matches
          </p>
        </div>
      </div>
    </div>
  );
};

export default CofounderMatching;