import React, { useState, useEffect } from 'react';
import { 
  Send, MessageCircle, User, Briefcase, Target, 
  DollarSign, Calendar, MapPin, Star, CheckCircle,
  X, Edit3, Save, Plus, Trash2, Clock, Award,
  TrendingUp, BarChart3, Users, Lightbulb, Rocket,
  FileText, Video, Mic, Upload, Download, Eye,
  Heart, Bookmark, Share2, ExternalLink, ArrowRight
} from 'lucide-react';

const PitchBackSystem = () => {
  const [activeTab, setActiveTab] = useState('received');
  const [pitchBacks, setPitchBacks] = useState({
    received: [],
    sent: [],
    accepted: [],
    declined: []
  });
  const [selectedPitchBack, setSelectedPitchBack] = useState(null);
  const [showPitchBackModal, setShowPitchBackModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [newPitchBack, setNewPitchBack] = useState({
    pitchId: '',
    role: '',
    message: '',
    equity: '',
    timeCommitment: '',
    startDate: '',
    skills: [],
    experience: '',
    motivation: ''
  });

  const tabs = [
    { id: 'received', label: 'Received', count: pitchBacks.received.length, icon: MessageCircle },
    { id: 'sent', label: 'Sent', count: pitchBacks.sent.length, icon: Send },
    { id: 'accepted', label: 'Accepted', count: pitchBacks.accepted.length, icon: CheckCircle },
    { id: 'declined', label: 'Declined', count: pitchBacks.declined.length, icon: X }
  ];

  const roles = [
    'Technical Co-founder', 'Business Co-founder', 'Marketing Co-founder',
    'Product Manager', 'UI/UX Designer', 'Sales Lead', 'Operations Manager',
    'Data Scientist', 'DevOps Engineer', 'Content Creator', 'Legal Advisor',
    'Financial Advisor', 'Growth Hacker', 'Community Manager'
  ];

  const timeCommitments = [
    'Part-time (10-20 hours/week)',
    'Full-time (40+ hours/week)',
    'Weekend warrior (5-10 hours/week)',
    'Advisor (2-5 hours/week)',
    'Flexible schedule'
  ];

  useEffect(() => {
    loadPitchBacks();
  }, []);

  const loadPitchBacks = async () => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockPitchBacks = {
        received: [
          {
            id: 1,
            pitch: {
              id: 1,
              title: "EcoTrack AI",
              tagline: "AI-powered carbon footprint tracking for businesses",
              author: {
                name: "Sarah Martinez",
                avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=400&fit=crop&crop=face",
                role: "Business Co-founder"
              }
            },
            sender: {
              name: "David Kim",
              avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face",
              role: "Technical Co-founder",
              experience: "8 years",
              location: "San Francisco, CA"
            },
            role: "Technical Co-founder",
            message: "I'm excited about your EcoTrack AI idea! I have 8 years of experience building scalable web applications and I'm passionate about sustainability. I'd love to help you build the technical foundation for this platform.",
            equity: "25-30%",
            timeCommitment: "Full-time (40+ hours/week)",
            startDate: "2024-02-01",
            skills: ["React", "Node.js", "Python", "AWS", "Machine Learning"],
            experience: "8 years",
            motivation: "Passionate about sustainability and AI. Have built similar B2B platforms before.",
            status: "pending",
            createdAt: "2024-01-20",
            compatibility: 92
          },
          {
            id: 2,
            pitch: {
              id: 2,
              title: "HealthConnect",
              tagline: "Telemedicine platform connecting patients with specialists",
              author: {
                name: "Dr. Michael Chen",
                avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face",
                role: "Medical Co-founder"
              }
            },
            sender: {
              name: "Lisa Wang",
              avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face",
              role: "Product Manager",
              experience: "6 years",
              location: "Boston, MA"
            },
            role: "Product Manager",
            message: "Your HealthConnect platform addresses a real need in healthcare. I have extensive experience in healthcare product management and would love to help shape the product strategy and user experience.",
            equity: "15-20%",
            timeCommitment: "Full-time (40+ hours/week)",
            startDate: "2024-02-15",
            skills: ["Product Strategy", "Healthcare", "User Research", "Agile", "Data Analysis"],
            experience: "6 years",
            motivation: "Deep understanding of healthcare challenges and user needs.",
            status: "pending",
            createdAt: "2024-01-18",
            compatibility: 88
          }
        ],
        sent: [
          {
            id: 3,
            pitch: {
              id: 3,
              title: "EduFlow",
              tagline: "Personalized learning platform for K-12 education",
              author: {
                name: "Emily Rodriguez",
                avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face",
                role: "Education Co-founder"
              }
            },
            role: "Technical Co-founder",
            message: "I'm very interested in your EduFlow platform! As a technical co-founder, I can help build the AI-powered learning engine and scalable infrastructure.",
            equity: "30-35%",
            timeCommitment: "Full-time (40+ hours/week)",
            startDate: "2024-02-01",
            skills: ["AI/ML", "Python", "React", "AWS", "Educational Technology"],
            experience: "7 years",
            motivation: "Passionate about education technology and have experience building learning platforms.",
            status: "pending",
            createdAt: "2024-01-15",
            compatibility: 85
          }
        ],
        accepted: [],
        declined: []
      };
      
      setPitchBacks(mockPitchBacks);
    } catch (error) {
      console.error('Error loading pitch backs:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAcceptPitchBack = (pitchBackId) => {
    const pitchBack = pitchBacks.received.find(pb => pb.id === pitchBackId);
    if (pitchBack) {
      setPitchBacks(prev => ({
        ...prev,
        received: prev.received.filter(pb => pb.id !== pitchBackId),
        accepted: [...prev.accepted, { ...pitchBack, status: 'accepted' }]
      }));
    }
  };

  const handleDeclinePitchBack = (pitchBackId) => {
    const pitchBack = pitchBacks.received.find(pb => pb.id === pitchBackId);
    if (pitchBack) {
      setPitchBacks(prev => ({
        ...prev,
        received: prev.received.filter(pb => pb.id !== pitchBackId),
        declined: [...prev.declined, { ...pitchBack, status: 'declined' }]
      }));
    }
  };

  const handleCreatePitchBack = () => {
    // Here you would typically save to backend
    console.log('Creating pitch back:', newPitchBack);
    setShowCreateModal(false);
    setNewPitchBack({
      pitchId: '',
      role: '',
      message: '',
      equity: '',
      timeCommitment: '',
      startDate: '',
      skills: [],
      experience: '',
      motivation: ''
    });
  };

  const renderPitchBackCard = (pitchBack) => {
    const isReceived = activeTab === 'received';
    const isAccepted = activeTab === 'accepted';
    const isDeclined = activeTab === 'declined';
    
    return (
      <div key={pitchBack.id} className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300">
        <div className="flex items-start gap-4 mb-4">
          <img
            src={isReceived ? pitchBack.sender.avatar : pitchBack.pitch.author.avatar}
            alt={isReceived ? pitchBack.sender.name : pitchBack.pitch.author.name}
            className="w-12 h-12 rounded-full object-cover"
          />
          <div className="flex-1">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-bold text-gray-900">
                {isReceived ? pitchBack.sender.name : pitchBack.pitch.author.name}
              </h3>
              <div className="flex items-center gap-2">
                <span className="text-sm text-purple-600 font-semibold">
                  {pitchBack.compatibility}% match
                </span>
                {isAccepted && <CheckCircle className="w-5 h-5 text-green-500" />}
                {isDeclined && <X className="w-5 h-5 text-red-500" />}
              </div>
            </div>
            <p className="text-sm text-gray-600 mb-2">
              {isReceived ? pitchBack.sender.role : pitchBack.pitch.author.role} • 
              {isReceived ? pitchBack.sender.location : pitchBack.pitch.author.location}
            </p>
            <div className="text-sm text-gray-500">
              {isReceived ? 'Sent you a pitch-back for' : 'You sent a pitch-back for'}: 
              <span className="font-semibold text-gray-700 ml-1">{pitchBack.pitch.title}</span>
            </div>
          </div>
        </div>

        <div className="mb-4">
          <h4 className="font-semibold text-gray-700 mb-2">Proposed Role: {pitchBack.role}</h4>
          <p className="text-gray-600 text-sm mb-3">{pitchBack.message}</p>
          
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium text-gray-700">Equity:</span> {pitchBack.equity}
            </div>
            <div>
              <span className="font-medium text-gray-700">Time:</span> {pitchBack.timeCommitment}
            </div>
            <div>
              <span className="font-medium text-gray-700">Start Date:</span> {pitchBack.startDate}
            </div>
            <div>
              <span className="font-medium text-gray-700">Experience:</span> {pitchBack.experience}
            </div>
          </div>
        </div>

        <div className="mb-4">
          <h4 className="font-semibold text-gray-700 mb-2">Skills</h4>
          <div className="flex flex-wrap gap-2">
            {pitchBack.skills.map((skill, index) => (
              <span key={index} className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full">
                {skill}
              </span>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-500">
            {new Date(pitchBack.createdAt).toLocaleDateString()}
          </div>
          
          {isReceived && pitchBack.status === 'pending' && (
            <div className="flex gap-2">
              <button
                onClick={() => handleDeclinePitchBack(pitchBack.id)}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors"
              >
                Decline
              </button>
              <button
                onClick={() => handleAcceptPitchBack(pitchBack.id)}
                className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl hover:from-green-600 hover:to-emerald-600 transition-all"
              >
                Accept
              </button>
            </div>
          )}
          
          {(isAccepted || isDeclined || activeTab === 'sent') && (
            <button
              onClick={() => {
                setSelectedPitchBack(pitchBack);
                setShowPitchBackModal(true);
              }}
              className="px-4 py-2 bg-purple-100 text-purple-700 rounded-xl hover:bg-purple-200 transition-colors"
            >
              View Details
            </button>
          )}
        </div>
      </div>
    );
  };

  const renderCreatePitchBackModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Send Pitch-Back</h2>
            <button
              onClick={() => setShowCreateModal(false)}
              className="p-2 text-gray-400 hover:text-gray-600"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Proposed Role *
              </label>
              <select
                value={newPitchBack.role}
                onChange={(e) => setNewPitchBack(prev => ({ ...prev, role: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="">Select a role</option>
                {roles.map(role => (
                  <option key={role} value={role}>{role}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Message *
              </label>
              <textarea
                value={newPitchBack.message}
                onChange={(e) => setNewPitchBack(prev => ({ ...prev, message: e.target.value }))}
                placeholder="Explain why you're interested and what you can bring to the team..."
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Equity Expectation
                </label>
                <input
                  type="text"
                  value={newPitchBack.equity}
                  onChange={(e) => setNewPitchBack(prev => ({ ...prev, equity: e.target.value }))}
                  placeholder="e.g., 25-30%"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Time Commitment
                </label>
                <select
                  value={newPitchBack.timeCommitment}
                  onChange={(e) => setNewPitchBack(prev => ({ ...prev, timeCommitment: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="">Select time commitment</option>
                  {timeCommitments.map(commitment => (
                    <option key={commitment} value={commitment}>{commitment}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Start Date
                </label>
                <input
                  type="date"
                  value={newPitchBack.startDate}
                  onChange={(e) => setNewPitchBack(prev => ({ ...prev, startDate: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Years of Experience
                </label>
                <input
                  type="text"
                  value={newPitchBack.experience}
                  onChange={(e) => setNewPitchBack(prev => ({ ...prev, experience: e.target.value }))}
                  placeholder="e.g., 5 years"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Motivation
              </label>
              <textarea
                value={newPitchBack.motivation}
                onChange={(e) => setNewPitchBack(prev => ({ ...prev, motivation: e.target.value }))}
                placeholder="Why are you excited about this opportunity?"
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            <div className="flex justify-end gap-4">
              <button
                onClick={() => setShowCreateModal(false)}
                className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleCreatePitchBack}
                className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all"
              >
                Send Pitch-Back
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium text-lg">Loading pitch-backs...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Pitch-Back System</h1>
              <p className="text-gray-600">Manage your cofounder connections and proposals</p>
            </div>
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all font-semibold"
            >
              <Plus className="w-5 h-5 inline mr-2" />
              Send Pitch-Back
            </button>
          </div>

          {/* Tabs */}
          <div className="bg-white rounded-2xl p-2 shadow-lg border border-gray-100 mb-8">
            <div className="flex space-x-2">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-3 px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                      isActive
                        ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    {tab.label}
                    {tab.count > 0 && (
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        isActive ? 'bg-white bg-opacity-20' : 'bg-gray-100 text-gray-600'
                      }`}>
                        {tab.count}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Content */}
          <div className="space-y-6">
            {pitchBacks[activeTab].length === 0 ? (
              <div className="text-center py-12">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MessageCircle className="w-12 h-12 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  No {activeTab} pitch-backs
                </h3>
                <p className="text-gray-600 mb-6">
                  {activeTab === 'received' && "You haven't received any pitch-backs yet."}
                  {activeTab === 'sent' && "You haven't sent any pitch-backs yet."}
                  {activeTab === 'accepted' && "No pitch-backs have been accepted yet."}
                  {activeTab === 'declined' && "No pitch-backs have been declined yet."}
                </p>
                {activeTab === 'sent' && (
                  <button
                    onClick={() => setShowCreateModal(true)}
                    className="px-6 py-3 bg-purple-500 text-white rounded-xl hover:bg-purple-600 transition-colors"
                  >
                    Send Your First Pitch-Back
                  </button>
                )}
              </div>
            ) : (
              pitchBacks[activeTab].map(renderPitchBackCard)
            )}
          </div>
        </div>
      </div>

      {/* Create Pitch-Back Modal */}
      {showCreateModal && renderCreatePitchBackModal()}

      {/* Pitch-Back Detail Modal */}
      {showPitchBackModal && selectedPitchBack && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Pitch-Back Details</h2>
                <button
                  onClick={() => setShowPitchBackModal(false)}
                  className="p-2 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <img
                    src={selectedPitchBack.sender?.avatar || selectedPitchBack.pitch.author.avatar}
                    alt="Profile"
                    className="w-16 h-16 rounded-full object-cover"
                  />
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">
                      {selectedPitchBack.sender?.name || selectedPitchBack.pitch.author.name}
                    </h3>
                    <p className="text-gray-600">
                      {selectedPitchBack.sender?.role || selectedPitchBack.pitch.author.role}
                    </p>
                    <p className="text-sm text-gray-500">
                      {selectedPitchBack.sender?.location || selectedPitchBack.pitch.author.location}
                    </p>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-700 mb-2">Proposed Role</h4>
                  <p className="text-gray-900 text-lg">{selectedPitchBack.role}</p>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-700 mb-2">Message</h4>
                  <p className="text-gray-600">{selectedPitchBack.message}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold text-gray-700 mb-2">Equity</h4>
                    <p className="text-gray-600">{selectedPitchBack.equity}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-700 mb-2">Time Commitment</h4>
                    <p className="text-gray-600">{selectedPitchBack.timeCommitment}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-700 mb-2">Start Date</h4>
                    <p className="text-gray-600">{selectedPitchBack.startDate}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-700 mb-2">Experience</h4>
                    <p className="text-gray-600">{selectedPitchBack.experience}</p>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-700 mb-2">Skills</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedPitchBack.skills.map((skill, index) => (
                      <span key={index} className="px-3 py-1 bg-purple-100 text-purple-700 text-sm rounded-full">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-700 mb-2">Motivation</h4>
                  <p className="text-gray-600">{selectedPitchBack.motivation}</p>
                </div>

                {activeTab === 'received' && selectedPitchBack.status === 'pending' && (
                  <div className="flex gap-4">
                    <button
                      onClick={() => {
                        handleDeclinePitchBack(selectedPitchBack.id);
                        setShowPitchBackModal(false);
                      }}
                      className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors"
                    >
                      Decline
                    </button>
                    <button
                      onClick={() => {
                        handleAcceptPitchBack(selectedPitchBack.id);
                        setShowPitchBackModal(false);
                      }}
                      className="flex-1 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl hover:from-green-600 hover:to-emerald-600 transition-all"
                    >
                      Accept
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PitchBackSystem;
