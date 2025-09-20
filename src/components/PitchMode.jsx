import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Send,
  Heart,
  Eye,
  Zap,
  Search,
  Bookmark,
  MessageCircle,
  Share2,
  Copy,
  CheckCircle,
  Plus,
  Target,
  MapPin,
  Calendar,
  Ruler
} from 'lucide-react';

const PitchMode = () => {
  const [activeView, setActiveView] = useState('received');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [filterStage, setFilterStage] = useState('all');
  const [tokens, setTokens] = useState(5);
  const [showNewPitchModal, setShowNewPitchModal] = useState(false);
  const [showPitchBackModal, setShowPitchBackModal] = useState(false);
  const [selectedPitch, setSelectedPitch] = useState(null);
  const [pitchBackMessage, setPitchBackMessage] = useState('');
  const [newPitch, setNewPitch] = useState('');
  const [savedPitches, setSavedPitches] = useState([]);
  const [incomingPitches, setIncomingPitches] = useState([]);
  const [outgoingPitches, setOutgoingPitches] = useState([]);
  const [acceptedPitches, setAcceptedPitches] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState({});
  const navigate = useNavigate();

  // Load data on component mount
  useEffect(() => {
    loadPitchesData();
  }, []);

  const loadPitchesData = async () => {
    setIsLoading(true);
    try {
      // Simulate API calls
      const [incomingData, outgoingData, acceptedData] = await Promise.all([
        loadIncomingPitches(),
        loadOutgoingPitches(),
        loadAcceptedPitches()
      ]);
      
      setIncomingPitches(incomingData);
      setOutgoingPitches(outgoingData);
      setAcceptedPitches(acceptedData);
    } catch (error) {
      console.error('Error loading pitches:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadIncomingPitches = async () => {
    await new Promise(resolve => setTimeout(resolve, 800));
    return [
      {
        id: 1,
        pitch: "I'm a passionate entrepreneur who believes in building meaningful connections, both in business and life. I love deep conversations about ideas, late-night coding sessions, and exploring new cities. I'm looking for someone who shares my curiosity about the world and isn't afraid to challenge my thinking. Let's build something beautiful together, whether it's a startup or a relationship.",
        personality: "Curious, ambitious, loves deep conversations",
        interests: "Entrepreneurship, technology, travel, philosophy",
        lifestyle: "Busy but balanced, values quality time",
        goals: "Build meaningful connections and create impact",
        lookingFor: "Someone who challenges and inspires me",
        role: "Founder",
        stage: "Seed",
        timeAgo: "2 hours ago",
        values: ["Growth", "Authenticity", "Adventure"],
        views: 12,
        responses: 3,
        isBookmarked: false,
        age: "28",
        height: "5'10\"",
        location: "San Francisco, CA"
      },
      {
        id: 2,
        pitch: "I'm an investor by day, but my real passion is discovering hidden gems - whether it's a promising startup or a person with an incredible story. I love mentoring others and believe the best relationships are built on mutual growth. I'm seeking someone who's not just looking for a partner, but a teammate for life's adventures.",
        personality: "Mentor, curious, values growth",
        interests: "Investing, mentoring, wine tasting, hiking",
        lifestyle: "Travels frequently, enjoys fine dining",
        goals: "Find a life partner and continue growing together",
        lookingFor: "Someone ambitious with a great story",
        role: "Investor", 
        stage: "Series A",
        timeAgo: "4 hours ago",
        values: ["Mentorship", "Growth", "Adventure"],
        views: 8,
        responses: 1,
        isBookmarked: true,
        age: "35",
        height: "6'1\"",
        location: "Austin, TX"
      },
      {
        id: 3,
        pitch: "I'm a builder at heart - I love creating things that matter. Whether it's crafting beautiful code or building meaningful relationships, I believe in the power of intention and hard work. I'm looking for someone who appreciates the process as much as the outcome, someone who wants to grow together and build a life filled with purpose and joy.",
        personality: "Creative, intentional, loves building things",
        interests: "Coding, art, cooking, outdoor adventures",
        lifestyle: "Works hard, plays harder, values work-life balance",
        goals: "Build meaningful things and relationships",
        lookingFor: "Someone who values the journey as much as the destination",
        role: "Builder",
        stage: "Pre-seed",
        timeAgo: "6 hours ago",
        values: ["Creativity", "Purpose", "Joy"],
        views: 15,
        responses: 5,
        isBookmarked: false,
        age: "26",
        height: "5'8\"",
        location: "Mumbai, India"
      },
      {
        id: 4,
        pitch: "I'm a serial entrepreneur who's learned that the best partnerships - in business and life - are built on trust, communication, and shared values. I love solving complex problems and believe that the right person can make any challenge feel like an adventure. Looking for someone who's ready to be my co-pilot in this crazy journey called life.",
        personality: "Problem-solver, adventurous, values trust",
        interests: "Startups, rock climbing, reading, board games",
        lifestyle: "High-energy, loves trying new things",
        goals: "Find a life partner and build something amazing together",
        lookingFor: "A co-pilot for life's adventures",
        role: "Founder",
        stage: "Seed",
        timeAgo: "8 hours ago",
        values: ["Trust", "Adventure", "Partnership"],
        views: 6,
        responses: 2,
        isBookmarked: false,
        age: "31",
        height: "5'11\"",
        location: "New York, NY"
      },
      {
        id: 5,
        pitch: "I'm an investor who believes that the best investments are in people, not just companies. I'm looking for someone who's not afraid to dream big and work hard to make those dreams reality. I value authenticity, intelligence, and a good sense of humor. Let's build something beautiful together - both in our careers and our relationship.",
        personality: "Intelligent, authentic, great sense of humor",
        interests: "Investing, tennis, fine dining, art galleries",
        lifestyle: "Sophisticated but down-to-earth",
        goals: "Find a life partner who shares my values",
        lookingFor: "Someone who dreams big and works hard",
        role: "Investor",
        stage: "Series A",
        timeAgo: "1 day ago",
        values: ["Authenticity", "Intelligence", "Humor"],
        views: 24,
        responses: 8,
        isBookmarked: true,
        age: "33",
        height: "6'0\"",
        location: "Boston, MA"
      }
    ];
  };

  const loadOutgoingPitches = async () => {
    await new Promise(resolve => setTimeout(resolve, 600));
    return [
      {
        id: 1,
        pitch: "I'm a passionate entrepreneur who believes in building meaningful connections, both in business and life. I love deep conversations about ideas, late-night coding sessions, and exploring new cities. I'm looking for someone who shares my curiosity about the world and isn't afraid to challenge my thinking. Let's build something beautiful together, whether it's a startup or a relationship.",
        personality: "Curious, ambitious, loves deep conversations",
        interests: "Entrepreneurship, technology, travel, philosophy",
        lifestyle: "Busy but balanced, values quality time",
        goals: "Build meaningful connections and create impact",
        lookingFor: "Someone who challenges and inspires me",
        role: "Founder",
        status: "sent",
        timeAgo: "1 hour ago",
        responses: 2,
        views: 12,
        likes: 1,
        age: "28",
        height: "5'10\"",
        location: "Seattle, WA"
      },
      {
        id: 2,
        pitch: "I'm a builder at heart - I love creating things that matter. Whether it's crafting beautiful code or building meaningful relationships, I believe in the power of intention and hard work. I'm looking for someone who appreciates the process as much as the outcome, someone who wants to grow together and build a life filled with purpose and joy.",
        personality: "Creative, intentional, loves building things",
        interests: "Coding, art, cooking, outdoor adventures",
        lifestyle: "Works hard, plays harder, values work-life balance",
        goals: "Build meaningful things and relationships",
        lookingFor: "Someone who values the journey as much as the destination",
        role: "Builder",
        status: "pending",
        timeAgo: "3 hours ago",
        responses: 0,
        views: 8,
        likes: 0,
        age: "26",
        height: "5'8\"",
        location: "Denver, CO"
      },
      {
        id: 3,
        pitch: "I'm an investor who believes that the best investments are in people, not just companies. I'm looking for someone who's not afraid to dream big and work hard to make those dreams reality. I value authenticity, intelligence, and a good sense of humor. Let's build something beautiful together - both in our careers and our relationship.",
        personality: "Intelligent, authentic, great sense of humor",
        interests: "Investing, tennis, fine dining, art galleries",
        lifestyle: "Sophisticated but down-to-earth",
        goals: "Find a life partner who shares my values",
        lookingFor: "Someone who dreams big and works hard",
        role: "Investor",
        status: "sent",
        timeAgo: "1 day ago",
        responses: 4,
        views: 20,
        likes: 3,
        age: "33",
        height: "6'0\"",
        location: "Portland, OR"
      }
    ];
  };

  const roles = ['all', 'Founder', 'Builder', 'Investor'];
  const stages = ['all', 'Pre-seed', 'Seed', 'Series A', 'Series B', 'Growth', 'Exit'];

  const loadAcceptedPitches = async () => {
    await new Promise(resolve => setTimeout(resolve, 600));
    return [
      {
        id: 'accepted-1',
        name: 'Sarah Chen',
        role: 'Founder',
        company: 'EcoTech Solutions',
        stage: 'Seed',
        timeAgo: '1 day ago',
        location: 'San Francisco, CA',
        age: 28,
        height: "5'10\"",
        views: 15,
        messages: 8,
        personality: 'Curious, ambitious, loves deep conversations',
        interests: 'Entrepreneurship, technology, travel, philosophy',
        lifestyle: 'Busy but balanced, values quality time',
        goals: 'Build meaningful connections and create impact',
        lookingFor: 'Someone who challenges and inspires me',
        tags: ['Growth', 'Authenticity', 'Adventure'],
        values: ['Growth', 'Authenticity', 'Adventure'],
        status: 'accepted',
        acceptedAt: '1 day ago',
        photo: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
        pitch: "I'm a passionate entrepreneur who believes in building meaningful connections, both in business and life. I love deep conversations about ideas, late-night coding sessions, and exploring new cities. I'm looking for someone who shares my curiosity about the world and isn't afraid to challenge my thinking. Let's build something beautiful together, whether it's a startup or a relationship."
      },
      {
        id: 'accepted-2',
        name: 'Michael Rodriguez',
        role: 'Investor',
        company: 'Venture Capital Partners',
        stage: 'Series A',
        timeAgo: '2 days ago',
        location: 'Austin, TX',
        age: 35,
        height: "6'1\"",
        views: 12,
        messages: 5,
        personality: 'Mentor, curious, values growth',
        interests: 'Investing, mentoring, wine tasting, hiking',
        lifestyle: 'Travels frequently, enjoys fine dining',
        goals: 'Find a life partner and continue growing together',
        lookingFor: 'Someone ambitious with a great story',
        tags: ['Mentorship', 'Growth', 'Adventure'],
        values: ['Mentorship', 'Growth', 'Adventure'],
        status: 'accepted',
        acceptedAt: '2 days ago',
        photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
        pitch: "I'm an investor by day, but my real passion is discovering hidden gems in both startups and people. I believe the best relationships are built on mutual respect, shared values, and the willingness to grow together. I'm seeking someone who's not just looking for a partner, but a teammate for life's adventures."
      }
    ];
  };

  const handleAcceptPitch = async (pitchId) => {
    console.log('Accepted pitch:', pitchId);
    
    // Find the accepted pitch
    const acceptedPitch = acceptedPitches.find(pitch => pitch.id === pitchId);
    if (!acceptedPitch) return;
    
    // Show loading state
    setActionLoading(prev => ({ ...prev, [pitchId]: true }));
    
    try {
      // Simulate API call to add to journey
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Store the match in localStorage for JourneyMode to pick up
      const journeyMatch = {
        id: `journey_${Date.now()}`,
        name: acceptedPitch.name,
        role: acceptedPitch.role,
        company: acceptedPitch.company,
        photo: acceptedPitch.photo,
        avatar: acceptedPitch.photo,
        status: "online",
        isOnline: true,
        lastSeen: "just now",
        compatibility: 92,
        sharedInterests: acceptedPitch.values || ["Startups", "Innovation", "Technology"],
        interests: acceptedPitch.interests ? acceptedPitch.interests.split(', ') : ["Startups", "Innovation", "Technology", "Networking", "Growth"],
        mutualConnections: 8,
        location: acceptedPitch.location,
        age: acceptedPitch.age,
        bio: acceptedPitch.pitch,
        currentMilestone: "Getting to Know Each Other",
        progress: 25,
        addedFrom: "pitch_mode",
        addedAt: new Date().toISOString()
      };
      
      // Get existing journey matches from localStorage
      const existingMatches = JSON.parse(localStorage.getItem('journeyMatches') || '[]');
      existingMatches.push(journeyMatch);
      localStorage.setItem('journeyMatches', JSON.stringify(existingMatches));
      
      // Remove from accepted pitches
      setAcceptedPitches(prev => prev.filter(pitch => pitch.id !== pitchId));
      
      // Show success message
      alert('Match added to Journey Mode! 🚀');
      
      // Navigate to Journey Mode
      navigate('/journey');
    } catch (error) {
      console.error('Error adding to journey:', error);
      alert('Failed to add to journey. Please try again.');
    } finally {
      setActionLoading(prev => ({ ...prev, [pitchId]: false }));
    }
  };

  const handlePitchBack = (pitch) => {
    setSelectedPitch(pitch);
    setShowPitchBackModal(true);
  };

  const handleSendPitchBack = async () => {
    if (!pitchBackMessage.trim()) return;
    
    // Simulate sending pitch back
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setPitchBackMessage('');
    setShowPitchBackModal(false);
    setSelectedPitch(null);
    
    alert('Pitch sent back successfully! 🚀');
  };

  const handlePassPitch = (pitchId) => {
    console.log('Passed on pitch:', pitchId);
    // Remove from view
  };

  const handleBookmarkPitch = (pitchId) => {
    console.log('Bookmarked pitch:', pitchId);
    // Toggle bookmark
  };

  const handleSendPitch = () => {
    if (newPitch.trim() && tokens > 0) {
      // Send pitch logic
      setTokens(tokens - 1);
      setNewPitch('');
      setShowNewPitchModal(false);
    }
  };

  const handleBoostPitch = (pitchId) => {
    if (tokens >= 2) {
      setTokens(tokens - 2);
      console.log('Boosted pitch:', pitchId);
    }
  };

  const filteredPitches = incomingPitches.filter(pitch => {
    const matchesSearch = pitch.pitch.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = filterRole === 'all' || pitch.role === filterRole;
    const matchesStage = filterStage === 'all' || pitch.stage === filterStage;
    return matchesSearch && matchesRole && matchesStage;
  });

  const renderIncomingPitches = () => (
    <div className="space-y-6">
      {/* Filters */}
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search pitches..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          <div className="flex gap-4">
            <select
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
              className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {roles.map(role => (
                <option key={role} value={role}>
                  {role === 'all' ? 'All Roles' : role}
                </option>
              ))}
            </select>
            <select
              value={filterStage}
              onChange={(e) => setFilterStage(e.target.value)}
              className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {stages.map(stage => (
                <option key={stage} value={stage}>
                  {stage === 'all' ? 'All Stages' : stage}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Pitches List */}
      <div className="space-y-4">
        {filteredPitches.map((pitch) => (
          <div key={pitch.id} className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center">
                  <Send className="w-8 h-8 text-white" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-lg font-semibold text-gray-900">{pitch.role}</span>
                    <span className="text-gray-400">•</span>
                    <span className="text-gray-600 text-sm">{pitch.stage}</span>
                    <span className="text-gray-400">•</span>
                    <span className="text-xs text-gray-500">{pitch.timeAgo}</span>
                  </div>
                  <div className="flex items-center gap-6 text-sm text-gray-500 mb-3">
                    <span>📍 {pitch.location}</span>
                    <span>🎂 {pitch.age}</span>
                    <span>📏 {pitch.height}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      <Eye className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-500">{pitch.views}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MessageCircle className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-500">{pitch.responses}</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleBookmarkPitch(pitch.id)}
                  className={`p-2 rounded-xl transition-colors ${
                    pitch.isBookmarked 
                      ? 'text-yellow-500 bg-yellow-50' 
                      : 'text-gray-400 hover:bg-gray-50'
                  }`}
                >
                  <Bookmark className={`w-5 h-5 ${pitch.isBookmarked ? 'fill-current' : ''}`} />
                </button>
                <button className="p-2 text-gray-400 hover:bg-gray-50 rounded-xl transition-colors">
                  <Share2 className="w-5 h-5" />
                </button>
              </div>
            </div>
            
            <div className="mb-6">
              <p className="text-gray-800 mb-4 leading-relaxed text-base">{pitch.pitch}</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="bg-blue-50 p-4 rounded-xl">
                  <h4 className="font-medium text-blue-900 mb-1 text-sm">Personality</h4>
                  <p className="text-blue-800 text-xs">{pitch.personality}</p>
                </div>
                <div className="bg-green-50 p-4 rounded-xl">
                  <h4 className="font-medium text-green-900 mb-1 text-sm">Interests</h4>
                  <p className="text-green-800 text-xs">{pitch.interests}</p>
                </div>
                <div className="bg-purple-50 p-4 rounded-xl">
                  <h4 className="font-medium text-purple-900 mb-1 text-sm">Lifestyle</h4>
                  <p className="text-purple-800 text-xs">{pitch.lifestyle}</p>
                </div>
                <div className="bg-orange-50 p-4 rounded-xl">
                  <h4 className="font-medium text-orange-900 mb-1 text-sm">Goals</h4>
                  <p className="text-orange-800 text-xs">{pitch.goals}</p>
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-4 rounded-xl">
                <h4 className="font-medium text-indigo-900 mb-1 text-sm">Looking for</h4>
                <p className="text-indigo-800 text-xs">{pitch.lookingFor}</p>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {pitch.values.map((value, index) => (
                  <span key={index} className="px-3 py-1 bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-700 text-sm rounded-full">
                    {value}
                  </span>
                ))}
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => handlePassPitch(pitch.id)}
                  className="px-5 py-2 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition-colors font-medium text-sm"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handlePitchBack(pitch)}
                  className="px-5 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all duration-300 font-medium text-sm"
                >
                  Pitch Back
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderOutgoingPitches = () => (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center">
              <Send className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{outgoingPitches.length}</p>
              <p className="text-gray-600">Total Pitches</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center">
              <Heart className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {outgoingPitches.reduce((sum, pitch) => sum + pitch.responses, 0)}
              </p>
              <p className="text-gray-600">Total Responses</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl flex items-center justify-center">
              <Eye className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {outgoingPitches.reduce((sum, pitch) => sum + pitch.views, 0)}
              </p>
              <p className="text-gray-600">Total Views</p>
            </div>
          </div>
        </div>
      </div>

      {/* Your Pitches */}
      <div className="space-y-4">
        {outgoingPitches.map((pitch) => (
          <div key={pitch.id} className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center">
                  <Send className="w-8 h-8 text-white" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-xl font-bold text-gray-900">{pitch.role}</span>
                    <span className="text-gray-400">•</span>
                    <span className="text-gray-600 font-medium">Your Pitch</span>
                    <span className="text-gray-400">•</span>
                    <span className="text-sm text-gray-500">{pitch.timeAgo}</span>
                  </div>
                  <div className="flex items-center gap-6 text-sm text-gray-500 mb-3">
                    <span>📍 {pitch.location}</span>
                    <span>🎂 {pitch.age}</span>
                    <span>📏 {pitch.height}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      <Eye className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-500">{pitch.views} views</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MessageCircle className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-500">{pitch.responses} responses</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Heart className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-500">{pitch.likes} likes</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  pitch.status === 'sent' 
                    ? 'bg-green-100 text-green-700' 
                    : 'bg-yellow-100 text-yellow-700'
                }`}>
                  {pitch.status === 'sent' ? 'Sent' : 'Pending'}
                </span>
                <button className="p-2 text-gray-400 hover:bg-gray-50 rounded-xl transition-colors">
                  <Copy className="w-5 h-5" />
                </button>
              </div>
            </div>
            
            <div className="mb-6">
              <p className="text-gray-800 mb-4 leading-relaxed text-base">{pitch.pitch}</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="bg-blue-50 p-4 rounded-xl">
                  <h4 className="font-medium text-blue-900 mb-1 text-sm">Personality</h4>
                  <p className="text-blue-800 text-xs">{pitch.personality}</p>
                </div>
                <div className="bg-green-50 p-4 rounded-xl">
                  <h4 className="font-medium text-green-900 mb-1 text-sm">Interests</h4>
                  <p className="text-green-800 text-xs">{pitch.interests}</p>
                </div>
                <div className="bg-purple-50 p-4 rounded-xl">
                  <h4 className="font-medium text-purple-900 mb-1 text-sm">Lifestyle</h4>
                  <p className="text-purple-800 text-xs">{pitch.lifestyle}</p>
                </div>
                <div className="bg-orange-50 p-4 rounded-xl">
                  <h4 className="font-medium text-orange-900 mb-1 text-sm">Goals</h4>
                  <p className="text-orange-800 text-xs">{pitch.goals}</p>
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-4 rounded-xl">
                <h4 className="font-medium text-indigo-900 mb-1 text-sm">Looking for</h4>
                <p className="text-indigo-800 text-xs">{pitch.lookingFor}</p>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button className="px-5 py-2 bg-red-200 text-red-700 rounded-xl hover:bg-red-300 transition-colors font-medium text-sm">
                  Withdraw
                </button>
                <button className="px-5 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl hover:from-blue-600 hover:to-cyan-600 transition-all duration-300 font-medium text-sm">
                  Modify
                </button>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleBoostPitch(pitch.id)}
                  disabled={tokens < 2}
                  className="px-4 py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl hover:from-orange-600 hover:to-red-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                >
                  <Zap className="w-4 h-4 inline mr-2" />
                  Boost (2 tokens)
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderAcceptedPitches = () => (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{acceptedPitches.length}</p>
              <p className="text-gray-600">Accepted Matches</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
              <MessageCircle className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {acceptedPitches.reduce((sum, pitch) => sum + pitch.messages, 0)}
              </p>
              <p className="text-gray-600">Total Messages</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
              <Heart className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {acceptedPitches.reduce((sum, pitch) => sum + pitch.views, 0)}
              </p>
              <p className="text-gray-600">Total Views</p>
            </div>
          </div>
        </div>
      </div>

      {/* Accepted Pitches List */}
      <div className="space-y-6">
        {acceptedPitches.map((pitch) => (
          <div key={pitch.id} className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center">
                  <CheckCircle className="w-8 h-8 text-white" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-lg font-semibold text-gray-900">{pitch.role}</span>
                    <span className="text-sm text-gray-500">•</span>
                    <span className="text-sm text-gray-500">{pitch.stage}</span>
                    <span className="text-sm text-gray-500">•</span>
                    <span className="text-xs text-gray-400">Accepted {pitch.acceptedAt}</span>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      <span>{pitch.location}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>Age {pitch.age}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Ruler className="w-4 h-4" />
                      <span>{pitch.height}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                    <div className="flex items-center gap-1">
                      <Eye className="w-4 h-4" />
                      <span>{pitch.views}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MessageCircle className="w-4 h-4" />
                      <span>{pitch.messages}</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors">
                  <Bookmark className="w-5 h-5" />
                </button>
                <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors">
                  <Share2 className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <h4 className="font-medium text-sm text-gray-900 mb-2">Personality</h4>
                <p className="text-xs text-gray-600">{pitch.personality}</p>
              </div>
              <div>
                <h4 className="font-medium text-sm text-gray-900 mb-2">Interests</h4>
                <p className="text-xs text-gray-600">{pitch.interests}</p>
              </div>
              <div>
                <h4 className="font-medium text-sm text-gray-900 mb-2">Lifestyle</h4>
                <p className="text-xs text-gray-600">{pitch.lifestyle}</p>
              </div>
              <div>
                <h4 className="font-medium text-sm text-gray-900 mb-2">Goals</h4>
                <p className="text-xs text-gray-600">{pitch.goals}</p>
              </div>
            </div>

            <div className="mb-6">
              <h4 className="font-medium text-sm text-gray-900 mb-2">Looking for</h4>
              <p className="text-xs text-gray-600">{pitch.lookingFor}</p>
            </div>

            <div className="flex flex-wrap gap-2 mb-6">
              {pitch.tags.map((tag, index) => (
                <span key={index} className="px-3 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                  {tag}
                </span>
              ))}
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <span>Accepted {pitch.acceptedAt}</span>
                <span>•</span>
                <span>{pitch.views} views</span>
                <span>•</span>
                <span>{pitch.messages} messages</span>
              </div>
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => navigate('/journey')}
                  className="px-6 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg hover:from-green-600 hover:to-emerald-600 transition-all duration-300 text-sm font-medium"
                >
                  Add to Journey Mode
              </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Pitch Mode</h1>
            <p className="text-gray-600 text-sm">Level 1 - Seed Stage</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-gradient-to-r from-blue-50 to-cyan-50 px-4 py-2 rounded-2xl">
              <Zap className="w-5 h-5 text-blue-600" />
              <span className="font-medium text-blue-700 text-sm">{tokens} Tokens</span>
            </div>
            <button
              onClick={() => setShowNewPitchModal(true)}
              className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-4 py-2 rounded-2xl hover:from-blue-600 hover:to-cyan-600 transition-all duration-300"
            >
              <Plus className="w-4 h-4" />
              <span className="text-sm">New Pitch</span>
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex justify-center mb-8">
          <div className="bg-white rounded-2xl p-2 shadow-lg border border-gray-100">
            <div className="flex space-x-2">
              <button
                onClick={() => setActiveView('received')}
                className={`flex items-center gap-3 px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                  activeView === 'received'
                    ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <Send className="w-5 h-5" />
                Received
              </button>
              <button
                onClick={() => setActiveView('sent')}
                className={`flex items-center gap-3 px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                  activeView === 'sent'
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <Target className="w-5 h-5" />
                Sent
              </button>
              <button
                onClick={() => setActiveView('accepted')}
                className={`flex items-center gap-3 px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                  activeView === 'accepted'
                    ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <CheckCircle className="w-5 h-5" />
                Accepted
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-6xl mx-auto">
          {activeView === 'received' ? renderIncomingPitches() : 
           activeView === 'sent' ? renderOutgoingPitches() : 
           renderAcceptedPitches()}
        </div>

        {/* New Pitch Modal */}
        {showNewPitchModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-3xl p-8 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Create New Pitch</h2>
                <button
                  onClick={() => setShowNewPitchModal(false)}
                  className="p-2 text-gray-400 hover:bg-gray-50 rounded-xl transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-2">
                    Your Pitch (140 characters max)
                  </label>
                  <textarea
                    value={newPitch}
                    onChange={(e) => setNewPitch(e.target.value)}
                    placeholder="Looking for a co-founder who..."
                    className="w-full h-32 p-4 border border-gray-200 rounded-2xl resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base"
                    maxLength={140}
                  />
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-xs text-gray-500">
                      {newPitch.length}/140 characters
                    </span>
                    <span className="text-xs text-blue-600 font-medium">
                      This is your first impression!
                    </span>
                  </div>
                </div>
                
                <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-4 rounded-2xl">
                  <div className="flex items-center gap-2 mb-2">
                    <Zap className="w-5 h-5 text-blue-600" />
                    <span className="font-medium text-blue-700 text-sm">Cost: 1 Token</span>
                  </div>
                  <p className="text-xs text-blue-600">
                    You have {tokens} tokens remaining. Use them wisely!
                  </p>
                </div>
                
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setShowNewPitchModal(false)}
                    className="flex-1 px-4 py-3 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSendPitch}
                    disabled={!newPitch.trim() || tokens < 1}
                    className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl hover:from-blue-600 hover:to-cyan-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Send Pitch
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Pitch Back Modal */}
        {showPitchBackModal && selectedPitch && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900">
                  Pitch Back to {selectedPitch.role}
                </h2>
                <button
                  onClick={() => setShowPitchBackModal(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Your Response Pitch
                </label>
                <textarea
                  value={pitchBackMessage}
                  onChange={(e) => setPitchBackMessage(e.target.value)}
                  placeholder="Share your thoughts, ask questions, or propose collaboration..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none text-sm"
                  rows={4}
                />
                <p className="text-xs text-gray-500 mt-1">
                  Be genuine and specific about what interests you about their pitch.
                </p>
              </div>
              
              <div className="flex gap-3">
                <button
                  onClick={() => setShowPitchBackModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSendPitchBack}
                  disabled={!pitchBackMessage.trim()}
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
                >
                  Send Pitch Back
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PitchMode;
