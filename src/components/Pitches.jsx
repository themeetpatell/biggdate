import React, { useState } from 'react';
import { 
  Send, 
  MessageCircle, 
  Search, 
  CheckCircle, 
  MoreVertical, 
  Eye, 
  Check, 
  X,
  Clock,
  User
} from 'lucide-react';

const Pitches = () => {
  const [activeTab, setActiveTab] = useState('pitches');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterBy, setFilterBy] = useState('all');
  const [selectedPitch, setSelectedPitch] = useState(null);
  const [showPitchModal, setShowPitchModal] = useState(false);
  const [showResponseModal, setShowResponseModal] = useState(false);
  const [showChatModal, setShowChatModal] = useState(false);
  const [newMessage, setNewMessage] = useState('');
  const [chatMessages, setChatMessages] = useState({});

  // Initialize chat messages for accepted proposals
  const initializeChatMessages = (pitchId) => {
    if (!chatMessages[pitchId]) {
      setChatMessages(prev => ({
        ...prev,
        [pitchId]: [
          {
            id: 1,
            sender: 'Mike Rodriguez',
            message: 'Great! Let\'s discuss the investment terms and next steps. I\'m excited about this collaboration.',
            timestamp: '2 hours ago',
            isOwn: false
          },
          {
            id: 2,
            sender: 'You',
            message: 'Thank you for accepting the proposal! I\'d love to discuss the details. When would be a good time to meet?',
            timestamp: '1 hour ago',
            isOwn: true
          },
          {
            id: 3,
            sender: 'Mike Rodriguez',
            message: 'How about this Friday at 2 PM? I can share the investment terms and answer any questions you have.',
            timestamp: '30 minutes ago',
            isOwn: false
          }
        ]
      }));
    }
  };

  const handleSendMessage = (pitchId) => {
    if (newMessage.trim()) {
      const message = {
        id: Date.now(),
        sender: 'You',
        message: newMessage.trim(),
        timestamp: 'Just now',
        isOwn: true
      };
      
      setChatMessages(prev => ({
        ...prev,
        [pitchId]: [...(prev[pitchId] || []), message]
      }));
      
      setNewMessage('');
    }
  };

  const handleOpenChat = (pitch) => {
    setSelectedPitch(pitch);
    initializeChatMessages(pitch.id);
    setShowChatModal(true);
  };

  const pitches = [
    {
      id: 1,
      title: "AI-Powered Dating Revolution",
      description: "Revolutionary AI matching algorithm that analyzes 50+ compatibility factors. Looking for a technical co-founder to help scale this innovative platform.",
      type: "proposal",
      status: "pending", // pending, accepted, rejected, responded
      sender: "Sarah Johnson",
      senderAvatar: "SJ",
      sentAt: "2 hours ago",
      category: "Technology",
      budget: "$50K - $100K",
      timeline: "3-6 months",
      isVerified: true,
      isOnline: true,
      priority: "high",
      proposalDetails: {
        problem: "Current dating apps use basic algorithms that don't consider deep compatibility factors",
        solution: "AI-powered matching that analyzes 50+ psychological and behavioral factors",
        market: "Dating app market worth $8.2B globally",
        ask: "Technical co-founder with AI/ML expertise",
        equity: "15-25% equity stake"
      }
    },
    {
      id: 2,
      title: "Sustainable Business Model",
      description: "How we're building a sustainable future through innovative business practices. Seeking investment for expansion.",
      type: "proposal",
      status: "accepted",
      sender: "Mike Rodriguez",
      senderAvatar: "MR",
      sentAt: "1 day ago",
      category: "Sustainability",
      budget: "$100K - $250K",
      timeline: "6-12 months",
      isVerified: false,
      isOnline: false,
      priority: "medium",
      proposalDetails: {
        problem: "Traditional business models don't prioritize environmental sustainability",
        solution: "Circular economy business model with zero waste",
        market: "Sustainable business market growing 20% annually",
        ask: "Investment for market expansion",
        equity: "10-15% equity for $150K investment"
      }
    },
    {
      id: 3,
      title: "Creative Collaboration Proposal",
      description: "Let's collaborate on an exciting new project that combines art and technology. Looking for creative partners.",
      type: "proposal",
      status: "rejected",
      sender: "Emma Wilson",
      senderAvatar: "EW",
      sentAt: "3 days ago",
      category: "Creative",
      budget: "$10K - $25K",
      timeline: "2-4 months",
      isVerified: true,
      isOnline: true,
      priority: "low",
      proposalDetails: {
        problem: "Art and technology are often siloed, missing opportunities for innovation",
        solution: "Interactive art installations using AR/VR technology",
        market: "Digital art market worth $3.5B",
        ask: "Creative collaboration and shared resources",
        equity: "Equal partnership"
      }
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-100 pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6 sm:mb-8">
          <div className="mb-4 lg:mb-0">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
              Proposals
            </h1>
            <p className="text-gray-600 text-sm sm:text-base lg:text-lg">
              Review and respond to business proposals and collaboration opportunities
            </p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 bg-white rounded-2xl p-1.5 shadow-lg mb-6 sm:mb-8 border border-gray-100">
          {[
            { id: 'pitches', label: 'Proposals', icon: Send },
            { id: 'conversations', label: 'Conversations', icon: MessageCircle }
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-semibold text-sm transition-all duration-300 hover:scale-105 ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="text-xs sm:text-sm">{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 space-y-4 sm:space-y-0">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
            <input
              type="text"
              placeholder="Search proposals..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 sm:pl-10 pr-4 py-3 sm:py-4 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm sm:text-base shadow-sm hover:shadow-md transition-all duration-300"
            />
          </div>
          
          <div className="flex items-center space-x-2 sm:space-x-4">
            <select
              value={filterBy}
              onChange={(e) => setFilterBy(e.target.value)}
              className="px-4 sm:px-6 py-3 sm:py-4 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm sm:text-base shadow-sm hover:shadow-md transition-all duration-300 bg-white"
            >
              <option value="all">All Proposals</option>
              <option value="pending">Pending</option>
              <option value="accepted">Accepted</option>
              <option value="rejected">Rejected</option>
              <option value="responded">Responded</option>
            </select>
          </div>
        </div>

        {/* Proposals Grid */}
        {activeTab === 'pitches' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {pitches.map((pitch) => (
              <div key={pitch.id} className="proposal-card">
                {/* Header with gradient background */}
                <div className="relative h-20 sm:h-24 bg-gradient-to-br from-purple-500 via-pink-500 to-blue-500 overflow-hidden rounded-t-lg">
                  <div className="absolute inset-0 bg-black/10"></div>
                  <div className="absolute top-2 sm:top-3 right-2 sm:right-3">
                    <span className={`px-2 sm:px-3 py-1 rounded-full text-xs font-semibold shadow-lg ${
                      pitch.status === 'pending' ? 'bg-yellow-400 text-yellow-900' :
                      pitch.status === 'accepted' ? 'bg-green-400 text-green-900' :
                      pitch.status === 'rejected' ? 'bg-red-400 text-red-900' :
                      'bg-blue-400 text-blue-900'
                    }`}>
                      {pitch.status.charAt(0).toUpperCase() + pitch.status.slice(1)}
                    </span>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 h-6 sm:h-8 bg-gradient-to-t from-white to-transparent"></div>
                </div>

                <div className="p-4 sm:p-6 -mt-3 sm:-mt-4 relative">
                  {/* Proposer Info */}
                  <div className="flex items-start justify-between mb-3 sm:mb-4">
                    <div className="flex items-center space-x-2 sm:space-x-3">
                      <div className="relative">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl sm:rounded-2xl flex items-center justify-center text-white font-bold text-sm sm:text-base shadow-lg">
                          {pitch.senderAvatar}
                        </div>
                        {pitch.isOnline && (
                          <div className="absolute -bottom-1 -right-1 w-3 h-3 sm:w-4 sm:h-4 bg-green-500 border-2 border-white rounded-full flex items-center justify-center">
                            <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-white rounded-full animate-pulse"></div>
                          </div>
                        )}
                        {pitch.isVerified && (
                          <div className="absolute -top-1 -right-1 w-3 h-3 sm:w-4 sm:h-4 bg-blue-500 border-2 border-white rounded-full flex items-center justify-center">
                            <CheckCircle className="w-2 h-2 sm:w-3 sm:h-3 text-white" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-gray-900 text-sm sm:text-base truncate">{pitch.sender}</h3>
                        <div className="flex items-center space-x-2">
                          <span className="text-xs sm:text-sm text-gray-500">{pitch.sentAt}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Proposal Title */}
                  <h4 className="font-bold text-base sm:text-lg text-gray-900 mb-2 sm:mb-3 leading-tight line-clamp-2">{pitch.title}</h4>
                  
                  {/* Description */}
                  <p className="text-gray-600 mb-3 sm:mb-4 line-clamp-2 sm:line-clamp-3 leading-relaxed text-sm sm:text-base">{pitch.description}</p>
                  
                  {/* Category and Budget */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4 mb-3 sm:mb-4">
                    <div className="bg-gray-50 rounded-lg sm:rounded-xl p-2 sm:p-3">
                      <div className="flex items-center space-x-1 sm:space-x-2 mb-1">
                        <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-purple-500 rounded-full"></div>
                        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Category</span>
                      </div>
                      <span className="text-xs sm:text-sm font-medium text-gray-900 truncate block">{pitch.category}</span>
                    </div>
                    <div className="bg-gray-50 rounded-lg sm:rounded-xl p-2 sm:p-3">
                      <div className="flex items-center space-x-1 sm:space-x-2 mb-1">
                        <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-green-500 rounded-full"></div>
                        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Budget</span>
                      </div>
                      <span className="text-xs sm:text-sm font-medium text-gray-900 truncate block">{pitch.budget}</span>
                    </div>
                  </div>
                  
                  {/* Tags */}
                  <div className="flex items-center space-x-2 mb-4 sm:mb-6">
                    <span className="px-2 sm:px-3 py-1 bg-purple-100 text-purple-800 text-xs font-semibold rounded-full">
                      {pitch.timeline}
                    </span>
                    <span className={`px-2 sm:px-3 py-1 text-xs font-semibold rounded-full ${
                      pitch.priority === 'high' ? 'bg-red-100 text-red-800' :
                      pitch.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {pitch.priority} priority
                    </span>
                  </div>
                  
                  {/* CTA Buttons */}
                  <div className="space-y-2 sm:space-y-3">
                    {/* View Button - Always visible */}
                    <button 
                      onClick={() => {
                        setSelectedPitch(pitch);
                        setShowPitchModal(true);
                      }}
                      className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold text-sm transition-all duration-300 hover:bg-gray-200 hover:scale-105"
                    >
                      <Eye className="w-4 h-4" />
                      <span>View Details</span>
                    </button>
                    
                    {/* Status-specific CTAs */}
                    {pitch.status === 'pending' && (
                      <div className="grid grid-cols-2 gap-2 sm:gap-3">
                        <button 
                          onClick={() => {
                            setSelectedPitch(pitch);
                            setShowResponseModal(true);
                          }}
                          className="flex-1 flex items-center justify-center gap-2 px-3 py-2.5 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl font-semibold text-sm transition-all duration-300 hover:scale-105 hover:shadow-lg"
                        >
                          <Check className="w-4 h-4" />
                          <span>Accept</span>
                        </button>
                        <button className="flex-1 flex items-center justify-center gap-2 px-3 py-2.5 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-xl font-semibold text-sm transition-all duration-300 hover:scale-105 hover:shadow-lg">
                          <X className="w-4 h-4" />
                          <span>Reject</span>
                        </button>
                      </div>
                    )}
                    
                    {pitch.status === 'accepted' && (
                      <div className="space-y-2">
                        <div className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 rounded-xl font-semibold text-sm border border-green-200">
                          <Check className="w-4 h-4" />
                          <span>Accepted</span>
                        </div>
                        <button className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl font-semibold text-sm transition-all duration-300 hover:scale-105 hover:shadow-lg">
                          <MessageCircle className="w-4 h-4" />
                          <span>Continue Chat</span>
                        </button>
                      </div>
                    )}
                    
                    {pitch.status === 'rejected' && (
                      <div className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-red-100 to-pink-100 text-red-800 rounded-xl font-semibold text-sm border border-red-200">
                        <X className="w-4 h-4" />
                        <span>Rejected</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Conversations tab */}
        {activeTab === 'conversations' && (
          <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6">
            <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 sm:mb-6">Accepted Proposals - Conversations</h3>
            <div className="space-y-3 sm:space-y-4">
              {/* Conversation Card */}
              <div className="conversation-card">
                <div className="conversation-card-content">
                  <div className="conversation-card-avatar bg-gradient-to-r from-purple-500 to-pink-500">
                    MR
                  </div>
                  <div className="conversation-card-info">
                    <h4 className="conversation-card-title">Mike Rodriguez - Sustainable Business Model</h4>
                    <p className="conversation-card-preview">How about this Friday at 2 PM? I can share the investment terms...</p>
                    <span className="conversation-card-time">30 minutes ago</span>
                  </div>
                </div>
                <div className="conversation-card-actions">
                  <span className="px-3 py-1.5 bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 rounded-xl font-semibold text-sm border border-green-200">Accepted</span>
                  <button 
                    onClick={() => handleOpenChat({ id: 2, sender: 'Mike Rodriguez', title: 'Sustainable Business Model' })}
                    className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl font-semibold text-sm transition-all duration-300 hover:scale-105 hover:shadow-lg"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>Continue Chat</span>
                  </button>
                </div>
              </div>

              {/* Additional conversation cards */}
              <div className="conversation-card">
                <div className="conversation-card-content">
                  <div className="conversation-card-avatar bg-gradient-to-r from-blue-500 to-cyan-500">
                    SJ
                  </div>
                  <div className="conversation-card-info">
                    <h4 className="conversation-card-title">Sarah Johnson - AI-Powered Dating Revolution</h4>
                    <p className="conversation-card-preview">I'm ready to discuss the technical requirements and equity structure...</p>
                    <span className="conversation-card-time">1 hour ago</span>
                  </div>
                </div>
                <div className="conversation-card-actions">
                  <span className="px-3 py-1.5 bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 rounded-xl font-semibold text-sm border border-green-200">Accepted</span>
                  <button 
                    onClick={() => handleOpenChat({ id: 1, sender: 'Sarah Johnson', title: 'AI-Powered Dating Revolution' })}
                    className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl font-semibold text-sm transition-all duration-300 hover:scale-105 hover:shadow-lg"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>Continue Chat</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* View Proposal Modal */}
        {showPitchModal && selectedPitch && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold text-gray-900">Proposal Details</h3>
                  <button 
                    onClick={() => setShowPitchModal(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
                
                <div className="space-y-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-xl">
                      {selectedPitch.senderAvatar}
                    </div>
                    <div>
                      <h4 className="text-xl font-semibold text-gray-900">{selectedPitch.sender}</h4>
                      <div className="flex items-center space-x-2">
                        <span className="text-gray-500">{selectedPitch.sentAt}</span>
                        {selectedPitch.isVerified && <CheckCircle className="w-5 h-5 text-blue-500" />}
                        {selectedPitch.isOnline && <div className="w-3 h-3 bg-green-500 rounded-full"></div>}
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h5 className="text-2xl font-bold text-gray-900 mb-4">{selectedPitch.title}</h5>
                    <p className="text-gray-600 text-lg leading-relaxed">{selectedPitch.description}</p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h6 className="font-semibold text-gray-900 mb-2">Problem</h6>
                      <p className="text-gray-600">{selectedPitch.proposalDetails.problem}</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h6 className="font-semibold text-gray-900 mb-2">Solution</h6>
                      <p className="text-gray-600">{selectedPitch.proposalDetails.solution}</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h6 className="font-semibold text-gray-900 mb-2">Market</h6>
                      <p className="text-gray-600">{selectedPitch.proposalDetails.market}</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h6 className="font-semibold text-gray-900 mb-2">Ask</h6>
                      <p className="text-gray-600">{selectedPitch.proposalDetails.ask}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 bg-purple-50 rounded-lg">
                    <div>
                      <span className="font-semibold text-gray-900">Budget: </span>
                      <span className="text-gray-600">{selectedPitch.budget}</span>
                    </div>
                    <div>
                      <span className="font-semibold text-gray-900">Timeline: </span>
                      <span className="text-gray-600">{selectedPitch.timeline}</span>
                    </div>
                    <div>
                      <span className="font-semibold text-gray-900">Equity: </span>
                      <span className="text-gray-600">{selectedPitch.proposalDetails.equity}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Response Modal */}
        {showResponseModal && selectedPitch && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl max-w-lg w-full">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-gray-900">Respond to Proposal</h3>
                  <button 
                    onClick={() => setShowResponseModal(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Your Response
                    </label>
                    <textarea
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="Write your response to the proposal..."
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Proposed Terms (Optional)
                    </label>
                    <textarea
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="Any counter-proposals or modified terms..."
                    />
                  </div>
                  
                  <div className="flex items-center space-x-4 pt-4">
                    <button 
                      onClick={() => setShowResponseModal(false)}
                      className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      Cancel
                    </button>
                    <button 
                      onClick={() => {
                        // Handle accept and respond
                        setShowResponseModal(false);
                        // Update proposal status to accepted
                      }}
                      className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                      Accept & Respond
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Chat Modal */}
        {showChatModal && selectedPitch && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-3xl max-w-4xl w-full h-[85vh] flex flex-col shadow-2xl border border-gray-100 overflow-hidden">
              {/* Chat Header */}
              <div className="flex items-center justify-between p-6 bg-gradient-to-r from-purple-50 to-pink-50 border-b border-gray-100">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center text-white font-bold shadow-lg">
                    {selectedPitch.sender?.charAt(0)}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">{selectedPitch.sender}</h3>
                    <p className="text-sm text-gray-600 font-medium">{selectedPitch.title}</p>
                  </div>
                </div>
                <button 
                  onClick={() => setShowChatModal(false)}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-all duration-200"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Chat Messages */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {chatMessages[selectedPitch.id]?.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.isOwn ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-xs sm:max-w-md lg:max-w-lg px-5 py-3 rounded-2xl shadow-sm ${
                        message.isOwn
                          ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                          : 'bg-gray-50 text-gray-900 border border-gray-100'
                      }`}
                    >
                      <p className="text-sm leading-relaxed">{message.message}</p>
                      <p className={`text-xs mt-2 ${
                        message.isOwn ? 'text-purple-100' : 'text-gray-500'
                      }`}>
                        {message.timestamp}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Chat Input */}
              <div className="p-6 bg-gradient-to-r from-gray-50 to-gray-100 border-t border-gray-200">
                <div className="flex space-x-4">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage(selectedPitch.id)}
                    placeholder="Type your message..."
                    className="flex-1 px-5 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent shadow-sm hover:shadow-md transition-all duration-200"
                  />
                  <button
                    onClick={() => handleSendMessage(selectedPitch.id)}
                    className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-2xl hover:from-purple-600 hover:to-pink-600 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center gap-2 font-semibold"
                  >
                    <Send className="w-4 h-4" />
                    <span>Send</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Pitches;
