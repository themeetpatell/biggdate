import React, { useState, useEffect } from 'react';
import { 
  Send,
  Heart,
  Calendar,
  GraduationCap,
  User,
  Plus,
  Zap,
  Star,
  Clock,
  Eye,
  MessageCircle,
  TrendingUp,
  Users,
  Sparkles,
  Target,
  Award,
  Globe,
  Bell,
  MapPin,
  ChevronRight,
  Info,
  ArrowRight,
  Crown,
  Rocket,
  Diamond,
  Flame,
  Shield,
  ThumbsUp,
  ThumbsDown,
  Share2,
  Bookmark,
  Filter,
  Search,
  X,
  Edit3,
  Tag,
  CheckCircle,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Camera,
  Mic,
  MicOff,
  Video,
  Phone,
  Mail,
  ExternalLink,
  Instagram,
  Twitter,
  Linkedin,
  Github,
  Coffee,
  Plane,
  Gamepad2,
  BookOpen,
  BarChart3,
  Activity,
  Compass,
  Badge,
  Gift,
  BellOff,
  EyeOff,
  SortAsc,
  SortDesc,
  RefreshCw,
  Flag,
  MoreHorizontal,
  HelpCircle,
  Lock,
  Unlock,
  Key,
  AlertTriangle,
  AlertOctagon,
  PlusCircle,
  MinusCircle,
  XCircle,
  CheckCircle2,
  Info as InfoIcon,
  HelpCircle as HelpCircleIcon,
  ChevronLeft,
  ChevronDown,
  ChevronUp,
  ArrowLeft,
  ArrowUp,
  ArrowDown,
  Maximize2,
  Minimize2,
  RotateCw,
  RotateCcw,
  ZoomIn,
  ZoomOut,
  Move,
  Copy,
  Scissors,
  Trash2,
  Save,
  Upload,
  Download,
  Link as LinkIcon,
  Link2,
  Unlink,
  KeyRound,
  ShieldCheck,
  ShieldAlert,
  Building2,
  DollarSign,
  Moon,
  Sun
} from 'lucide-react';

const MyPitches = () => {
  const [activeTab, setActiveTab] = useState('sent');
  const [showPitchModal, setShowPitchModal] = useState(false);
  const [selectedPitch, setSelectedPitch] = useState(null);
  const [pitchResponse, setPitchResponse] = useState('');

  const formatTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);
    
    if (diffInSeconds < 60) return 'just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} days ago`;
    return date.toLocaleDateString();
  };

  const loadSentPitches = () => {
    const storedPitches = JSON.parse(localStorage.getItem('sentPitches') || '[]');
    return storedPitches.map(pitch => ({
      ...pitch,
      sentAt: formatTimeAgo(pitch.sentAt)
    }));
  };

  const [sentPitches, setSentPitches] = useState(() => {
    const stored = loadSentPitches();
    const mock = [
    {
      id: 1,
      pitchId: 101,
      title: "EcoTrack AI",
      description: "AI-powered carbon footprint tracking for businesses",
      author: "Sarah Martinez",
      status: "pending",
      sentAt: "2 hours ago",
      message: "Hi! I'm interested in your EcoTrack AI idea. I have 5+ years in AI/ML and think we'd make great cofounders. I can help with the technical implementation and scaling.",
      response: null,
      compatibility: 92
    },
    {
      id: 2,
      pitchId: 102,
      title: "HealthConnect",
      description: "Telemedicine platform connecting patients with specialists",
      author: "Dr. Michael Chen",
      status: "accepted",
      sentAt: "1 day ago",
      message: "Your HealthConnect idea is exactly what the healthcare industry needs. I have experience in healthcare tech and would love to discuss this further.",
      response: "Thank you for your interest! I'd love to connect and discuss this opportunity.",
      compatibility: 88
    },
    {
      id: 3,
      pitchId: 103,
      title: "EduFlow",
      description: "Personalized learning platform for K-12 education",
      author: "Emily Rodriguez",
      status: "rejected",
      sentAt: "2 days ago",
      message: "I'm passionate about EdTech and your EduFlow concept is innovative. I have experience in educational technology and would be excited to collaborate.",
      response: "Thanks for reaching out, but I've decided to go in a different direction.",
      compatibility: 85
    }
    ];
    return [...stored, ...mock];
  });

  useEffect(() => {
    const stored = loadSentPitches();
    const mock = [
      {
        id: 1,
        pitchId: 101,
        title: "EcoTrack AI",
        description: "AI-powered carbon footprint tracking for businesses",
        author: "Sarah Martinez",
        status: "pending",
        sentAt: "2 hours ago",
        message: "Hi! I'm interested in your EcoTrack AI idea. I have 5+ years in AI/ML and think we'd make great cofounders. I can help with the technical implementation and scaling.",
        response: null,
        compatibility: 92
      },
      {
        id: 2,
        pitchId: 102,
        title: "HealthConnect",
        description: "Telemedicine platform connecting patients with specialists",
        author: "Dr. Michael Chen",
        status: "accepted",
        sentAt: "1 day ago",
        message: "Your HealthConnect idea is exactly what the healthcare industry needs. I have experience in healthcare tech and would love to discuss this further.",
        response: "Thank you for your interest! I'd love to connect and discuss this opportunity.",
        compatibility: 88
      },
      {
        id: 3,
        pitchId: 103,
        title: "EduFlow",
        description: "Personalized learning platform for K-12 education",
        author: "Emily Rodriguez",
        status: "rejected",
        sentAt: "2 days ago",
        message: "I'm passionate about EdTech and your EduFlow concept is innovative. I have experience in educational technology and would be excited to collaborate.",
        response: "Thanks for reaching out, but I've decided to go in a different direction.",
        compatibility: 85
      }
    ];
    setSentPitches([...stored, ...mock]);
  }, []);

  const tabs = [
    { id: 'sent', label: 'Sent Pitches', icon: Send, count: sentPitches.length },
    { id: 'received', label: 'Received Pitches', icon: MessageCircle, count: 12 },
    { id: 'accepted', label: 'Accepted Matches', icon: CheckCircle, count: 3 }
  ];

  // Mock data for received pitches
  const receivedPitches = [
    {
      id: 1,
      pitchId: 201,
      title: "EcoTrack AI",
      shortDescription: "AI-powered carbon footprint tracking for businesses",
      description: "Revolutionary platform that helps companies track and reduce their carbon footprint using advanced AI algorithms. Our solution provides real-time monitoring, predictive analytics, and actionable insights to help businesses achieve their sustainability goals.",
      industry: "Sustainability",
      stage: "MVP Stage",
      stageColor: "green",
      lookingFor: ["Technical Co-founder", "UI/UX Designer"],
      author: "Anonymous",
      status: "pending",
      receivedAt: "1 hour ago",
      message: "I'm really impressed with your startup idea. I have 7+ years in sustainability tech and think we could build something amazing together. Would you like to discuss this further?",
      compatibility: 90,
      timeline: "6-12 months to market",
      market: "Carbon management software market ($12B)",
      funding: "Pre-seed, seeking $500K",
      tags: ["AI", "Sustainability", "B2B"],
      metrics: {
        views: 245,
        likes: 18,
        pitches: 12,
        comments: 8
      },
      authorDetails: {
        experience: "7+ years in sustainability tech",
        skills: ["Product Management", "Sustainability", "AI/ML"],
        previousStartups: ["GreenTech Solutions", "EcoVentures"],
        education: "MBA from Stanford",
        achievements: ["Led 3 successful product launches", "Raised $2M+ in funding"],
        workStyle: "Data-driven, collaborative",
        availability: "Full-time, flexible hours"
      }
    },
    {
      id: 2,
      pitchId: 202,
      title: "HealthConnect",
      shortDescription: "Telemedicine platform connecting patients with specialists",
      description: "Revolutionary telemedicine platform that connects patients with specialized healthcare providers through AI-powered matching and video consultations. Our solution addresses the growing need for accessible healthcare and specialist consultations.",
      industry: "Healthcare",
      stage: "Early Stage",
      stageColor: "blue",
      lookingFor: ["Technical Co-founder", "Healthcare Expert"],
      author: "Anonymous",
      status: "pending",
      receivedAt: "3 hours ago",
      message: "Your sustainable fashion concept is brilliant! I have experience in e-commerce and sustainability. I'd love to explore this opportunity with you.",
      compatibility: 87,
      timeline: "12-18 months to market",
      market: "Telemedicine market ($185B)",
      funding: "Seed stage, seeking $1M",
      tags: ["Healthcare", "AI", "Telemedicine"],
      metrics: {
        views: 189,
        likes: 15,
        pitches: 8,
        comments: 5
      },
      authorDetails: {
        experience: "5+ years in e-commerce",
        skills: ["E-commerce", "Sustainability", "Marketing"],
        previousStartups: ["GreenMarket"],
        education: "MS in Computer Science from MIT",
        achievements: ["Built 2 successful e-commerce platforms", "Raised $500K+ in funding"],
        workStyle: "Innovative, user-focused",
        availability: "Part-time, evenings and weekends"
      }
    },
    {
      id: 3,
      pitchId: 203,
      title: "EduTech Pro",
      shortDescription: "AI-powered personalized learning platform for students",
      description: "Revolutionary EdTech platform that uses AI to create personalized learning experiences for students. Our solution adapts to each student's learning style and pace, providing customized content and assessments.",
      industry: "Education",
      stage: "Growth Stage",
      stageColor: "yellow",
      lookingFor: ["Technical Co-founder", "Education Expert"],
      author: "Anonymous",
      status: "accepted",
      receivedAt: "1 day ago",
      message: "I'm excited about your EdTech platform! I have 6+ years in education technology and would be thrilled to work together on this project.",
      compatibility: 89,
      timeline: "9-15 months to market",
      market: "EdTech market ($254B)",
      funding: "Series A, seeking $5M",
      tags: ["AI", "Education", "Personalization"],
      metrics: {
        views: 312,
        likes: 24,
        pitches: 15,
        comments: 12
      },
      authorDetails: {
        experience: "6+ years in EdTech",
        skills: ["Education Technology", "Product Management", "User Experience"],
        previousStartups: ["LearnTech", "EduVentures"],
        education: "PhD in Educational Psychology from Harvard",
        achievements: ["Led 4 successful product launches", "Raised $3M+ in funding"],
        workStyle: "Research-driven, student-focused",
        availability: "Full-time, flexible hours"
      }
    }
  ];

  // Mock data for accepted matches
  const acceptedMatches = [
    {
      id: 1,
      pitchId: 301,
      title: "EcoTrack AI",
      description: "AI-powered carbon footprint tracking for businesses",
      author: "Sarah Martinez",
      authorDetails: {
        name: "Sarah Martinez",
        role: "Business Co-founder",
        location: "San Francisco, CA",
        avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face",
        experience: "5+ years in sustainability tech",
        previousStartups: ["GreenTech Solutions", "EcoVentures"],
        skills: ["Business Strategy", "Sustainability", "Operations"],
        email: "sarah@ecotrack.ai",
        phone: "+1 (555) 123-4567",
        linkedin: "linkedin.com/in/sarahmartinez"
      },
      acceptedAt: "2 days ago",
      compatibility: 92,
      nextSteps: "Schedule a video call to discuss the partnership and next steps"
    },
    {
      id: 2,
      pitchId: 302,
      title: "HealthConnect",
      description: "Telemedicine platform connecting patients with specialists",
      author: "Dr. Michael Chen",
      authorDetails: {
        name: "Dr. Michael Chen",
        role: "Medical Co-founder",
        location: "Boston, MA",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
        experience: "8+ years in healthcare",
        previousStartups: ["MedTech Innovations"],
        skills: ["Medical Technology", "Healthcare", "AI"],
        email: "michael@healthconnect.com",
        phone: "+1 (555) 987-6543",
        linkedin: "linkedin.com/in/drmichaelchen"
      },
      acceptedAt: "1 day ago",
      compatibility: 88,
      nextSteps: "Exchange detailed business plans and schedule weekly check-ins"
    }
  ];

  const handleAcceptPitch = (pitchId) => {
    console.log('Accepting pitch:', pitchId);
    // Update pitch status to accepted
  };

  const handleRejectPitch = (pitchId) => {
    console.log('Rejecting pitch:', pitchId);
    // Update pitch status to rejected
  };

  const handleRespondToPitch = (pitch) => {
    setSelectedPitch(pitch);
    setShowPitchModal(true);
  };

  const handleSendResponse = () => {
    if (selectedPitch && pitchResponse.trim()) {
      console.log('Sending response to pitch:', selectedPitch.id, 'Response:', pitchResponse);
      setShowPitchModal(false);
      setPitchResponse('');
      setSelectedPitch(null);
    }
  };

  const renderSentPitches = () => (
    <div className="space-y-4">
      {sentPitches.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl">
          <Send className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-900 mb-2">No Sent Pitches Yet</h3>
          <p className="text-gray-600 mb-6">Start sending pitches to co-founders from the marketplace</p>
          <button
            onClick={() => window.location.href = '/cofounders'}
            className="px-6 py-3 bg-black text-white rounded-xl font-semibold hover:bg-gray-800 transition-all duration-300"
          >
            Go to Marketplace
          </button>
        </div>
      ) : (
        sentPitches.map((pitch) => (
          <div key={pitch.id} className="bg-white rounded-2xl p-6 shadow-lg">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="text-lg font-bold text-gray-900 mb-1">{pitch.title || 'My Startup Pitch'}</h3>
                <p className="text-gray-600 text-sm mb-2">
                  {pitch.description || (pitch.message ? pitch.message.substring(0, 100) + '...' : 'No description')}
                </p>
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <span>To: {pitch.author}</span>
                  <span>•</span>
                  <span>{pitch.sentAt}</span>
                  {pitch.compatibility && (
                    <>
                      <span>•</span>
                      <span className="text-gray-600 font-semibold">{pitch.compatibility}% match</span>
                    </>
                  )}
                </div>
              </div>
            <div className="flex items-center gap-2">
              <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                pitch.status === 'accepted' ? 'bg-gray-100 text-gray-700' :
                pitch.status === 'rejected' ? 'bg-gray-100 text-gray-700' :
                'bg-gray-100 text-gray-700'
              }`}>
                {pitch.status}
              </span>
            </div>
          </div>

          <div className="mb-4">
            <h4 className="font-semibold text-gray-900 mb-2">Your Message:</h4>
            <p className="text-gray-700 text-sm bg-gray-50 p-3 rounded-xl">{pitch.message}</p>
          </div>

          {pitch.response && (
            <div className="mb-4">
              <h4 className="font-semibold text-gray-900 mb-2">Response:</h4>
              <p className="text-gray-700 text-sm bg-gray-50 p-3 rounded-xl">{pitch.response}</p>
            </div>
          )}

          <div className="flex items-center justify-between">
            <div className="flex gap-3">
              <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors text-sm flex items-center gap-2">
                <X className="w-4 h-4" />
                Withdraw
              </button>
              <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors text-sm flex items-center gap-2">
                <Edit3 className="w-4 h-4" />
                Modify
              </button>
            </div>
            <button className="px-4 py-2 bg-black text-white rounded-xl hover:bg-gray-800 transition-colors text-sm flex items-center gap-2">
              <Zap className="w-4 h-4" />
              Boost
            </button>
          </div>
        </div>
        ))
      )}
    </div>
  );

  const renderReceivedPitches = () => (
    <div className="space-y-6">
      {receivedPitches.map((pitch) => (
        <div key={pitch.id} className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300">
          {/* Header Section */}
          <div className="flex items-start gap-4 mb-4">
            <div className="w-16 h-16 bg-black rounded-xl flex items-center justify-center">
              <Rocket className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <h3 className="text-2xl font-bold text-gray-900">{pitch.title}</h3>
                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                  pitch.stageColor === 'green' ? 'bg-gray-100 text-gray-700' :
                  pitch.stageColor === 'yellow' ? 'bg-gray-100 text-gray-700' :
                  pitch.stageColor === 'blue' ? 'bg-gray-100 text-gray-700' :
                  'bg-gray-100 text-gray-700'
                }`}>
                  {pitch.stage || 'Not specified'}
                </span>
                <span className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full">
                  {pitch.industry || 'Not specified'}
                </span>
              </div>
              <p className="text-gray-600 text-lg mb-3">{pitch.shortDescription || pitch.description || 'No description provided'}</p>
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <span className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  {pitch.author || 'Anonymous'}
                </span>
                <span>•</span>
                <span>{pitch.receivedAt || 'Recently'}</span>
                <span>•</span>
                <span className="text-gray-600 font-semibold bg-gray-50 px-2 py-1 rounded-full">
                  {pitch.compatibility}% match
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className={`px-3 py-1 text-sm font-semibold rounded-full ${
                pitch.status === 'accepted' ? 'bg-gray-100 text-gray-700' :
                pitch.status === 'rejected' ? 'bg-gray-100 text-gray-700' :
                'bg-gray-100 text-gray-700'
              }`}>
                {pitch.status}
              </span>
            </div>
          </div>

          {/* Pitch Details - Simplified */}
          <div className="mb-4">
            <h4 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <Target className="w-4 h-4 text-black" />
              Pitch Details
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="bg-gray-50 p-3 rounded-xl">
                <p className="text-xs font-medium text-gray-600 mb-1">Timeline</p>
                <p className="text-gray-900 text-sm">{pitch.timeline || 'Not specified'}</p>
              </div>
              <div className="bg-gray-50 p-3 rounded-xl">
                <p className="text-xs font-medium text-gray-600 mb-1">Market Size</p>
                <p className="text-gray-900 text-sm">{pitch.market || 'Not specified'}</p>
              </div>
              <div className="bg-gray-50 p-3 rounded-xl">
                <p className="text-xs font-medium text-gray-600 mb-1">Funding Stage</p>
                <p className="text-gray-900 text-sm">{pitch.funding || 'Not specified'}</p>
              </div>
            </div>
          </div>

          {/* Looking For - Simplified */}
          <div className="mb-4">
            <h4 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <Users className="w-4 h-4 text-black" />
              Looking For
            </h4>
            <div className="flex flex-wrap gap-2">
              {(pitch.lookingFor || []).map((role, index) => (
                <span key={index} className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full">
                  {role}
                </span>
              ))}
            </div>
          </div>

          {/* Pitch Message - Simplified */}
          <div className="mb-4">
            <h4 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <MessageCircle className="w-4 h-4 text-black" />
              Pitch Message
            </h4>
            <div className="bg-gray-50 p-4 rounded-xl">
              <p className="text-gray-700 text-sm leading-relaxed">{pitch.message || 'No message provided'}</p>
            </div>
          </div>

          {/* Anonymous Profile - Enhanced */}
          {pitch.authorDetails && (
            <div className="mb-6">
              <h4 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <User className="w-5 h-5" />
                Anonymous Profile
              </h4>
              <div className="bg-gray-50 p-6 rounded-2xl">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-gray-600">Experience</p>
                    <p className="text-gray-900 font-semibold">{pitch.authorDetails?.experience || 'Not specified'}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-gray-600">Education</p>
                    <p className="text-gray-900 font-semibold">{pitch.authorDetails?.education || 'Not specified'}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-gray-600">Work Style</p>
                    <p className="text-gray-900 font-semibold">{pitch.authorDetails?.workStyle || 'Not specified'}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-gray-600">Availability</p>
                    <p className="text-gray-900 font-semibold">{pitch.authorDetails?.availability || 'Not specified'}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-gray-600">Previous Startups</p>
                    <p className="text-gray-900 font-semibold">{(pitch.authorDetails?.previousStartups || []).join(', ')}</p>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <p className="text-sm font-medium text-gray-600 mb-2">Skills</p>
                  <div className="flex flex-wrap gap-2">
                    {(pitch.authorDetails?.skills || []).map((skill, index) => (
                      <span key={index} className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tags - Enhanced */}
          <div className="mb-6">
            <h4 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Tag className="w-5 h-5" />
              Technology Tags
            </h4>
            <div className="flex flex-wrap gap-3">
              {(pitch.tags || []).map((tag, index) => (
                <span key={index} className="px-4 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-full">
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Metrics - Enhanced */}
          <div className="mb-8">
            <h4 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Engagement Metrics
            </h4>
            <div className="bg-gray-50 p-6 rounded-2xl">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-gray-900 mb-1">{pitch.metrics?.views || 0}</div>
                  <div className="text-sm text-gray-600">Views</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-gray-900 mb-1">{pitch.metrics?.likes || 0}</div>
                  <div className="text-sm text-gray-600">Likes</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-gray-900 mb-1">{pitch.metrics?.pitches || 0}</div>
                  <div className="text-sm text-gray-600">Pitches</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-gray-600 mb-1">{pitch.compatibility || 0}%</div>
                  <div className="text-sm text-gray-600">Match</div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons - Simplified */}
          {pitch.status === 'pending' && (
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => handleAcceptPitch(pitch.id)}
                className="flex-1 py-3 bg-black text-white rounded-xl font-semibold hover:bg-gray-800 transition-all duration-300 flex items-center justify-center gap-2"
              >
                <CheckCircle className="w-4 h-4" />
                Accept Pitch
              </button>
              <button
                onClick={() => handleRejectPitch(pitch.id)}
                className="flex-1 py-3 bg-gray-600 text-white rounded-xl font-semibold hover:bg-gray-800 transition-all duration-300 flex items-center justify-center gap-2"
              >
                <X className="w-4 h-4" />
                Reject Pitch
              </button>
              <button
                onClick={() => handleRespondToPitch(pitch)}
                className="flex-1 py-3 bg-gray-600 text-white rounded-xl font-semibold hover:bg-gray-800 transition-all duration-300 flex items-center justify-center gap-2"
              >
                <MessageCircle className="w-4 h-4" />
                Send Response
              </button>
            </div>
          )}

          {pitch.status === 'accepted' && (
            <div className="flex flex-col sm:flex-row gap-4">
              <button className="flex-1 py-4 bg-black text-white rounded-2xl font-semibold hover:bg-gray-800 transition-all duration-300 flex items-center justify-center gap-3 shadow-lg hover:shadow-xl">
                <Rocket className="w-5 h-5" />
                Go to Workspace
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );

  const renderAcceptedMatches = () => (
    <div className="space-y-6">
      {acceptedMatches.map((match) => (
        <div key={match.id} className="bg-white rounded-3xl p-8 shadow-lg border-2 border-gray-200 hover:shadow-xl transition-all duration-300">
          {/* Header Section */}
          <div className="flex items-start gap-6 mb-6">
            <div className="w-20 h-20 bg-black rounded-2xl flex items-center justify-center">
              <img
                src={match.authorDetails.avatar}
                alt={match.authorDetails.name}
                className="w-full h-full rounded-2xl object-cover"
              />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <h3 className="text-2xl font-bold text-gray-900">{match.title}</h3>
                <span className="px-3 py-1 bg-gray-100 text-gray-700 text-sm font-semibold rounded-full">
                  ✓ Matched
                </span>
              </div>
              <p className="text-gray-600 text-lg mb-3">{match.description}</p>
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <span className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  {match.authorDetails.name}
                </span>
                <span>•</span>
                <span>{match.acceptedAt}</span>
                <span>•</span>
                <span className="text-gray-600 font-semibold bg-gray-50 px-2 py-1 rounded-full">
                  {match.compatibility}% match
                </span>
              </div>
            </div>
          </div>

          {/* Cofounder Details - Enhanced */}
          <div className="mb-6">
            <h4 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <User className="w-5 h-5" />
              Cofounder Details
            </h4>
            <div className="bg-gray-50 p-6 rounded-2xl">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-600">Name</p>
                  <p className="text-gray-900 font-semibold">{match.authorDetails.name}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-600">Role</p>
                  <p className="text-gray-900 font-semibold">{match.authorDetails.role}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-600">Location</p>
                  <p className="text-gray-900 font-semibold flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    {match.authorDetails.location}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-600">Experience</p>
                  <p className="text-gray-900 font-semibold">{match.authorDetails.experience}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-600">Email</p>
                  <a href={`mailto:${match.authorDetails.email}`} className="text-gray-600 hover:text-gray-800 font-semibold flex items-center gap-1">
                    <Mail className="w-4 h-4" />
                    {match.authorDetails.email}
                  </a>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-600">Phone</p>
                  <a href={`tel:${match.authorDetails.phone}`} className="text-gray-900 font-semibold flex items-center gap-1">
                    <Phone className="w-4 h-4" />
                    {match.authorDetails.phone}
                  </a>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-600">LinkedIn</p>
                  <a href={match.authorDetails.linkedin} target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-gray-800 font-semibold flex items-center gap-1">
                    <ExternalLink className="w-4 h-4" />
                    {match.authorDetails.linkedin}
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Next Steps - Enhanced */}
          <div className="mb-8">
            <h4 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Target className="w-5 h-5" />
              Next Steps
            </h4>
            <div className="bg-gray-50 p-6 rounded-2xl">
              <p className="text-gray-700 text-lg mb-4">{match.nextSteps}</p>
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full">✓ Partnership Agreement</span>
                <span className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full">✓ Equity Discussion</span>
                <span className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full">✓ Workflow Planning</span>
              </div>
            </div>
          </div>

          {/* Action Buttons - Enhanced */}
          <div className="flex flex-col sm:flex-row gap-4">
            <button className="flex-1 py-4 bg-black text-white rounded-2xl font-semibold hover:bg-gray-800 transition-all duration-300 flex items-center justify-center gap-3 shadow-lg hover:shadow-xl">
              <Rocket className="w-5 h-5" />
              Go to Workspace
            </button>
            <button className="flex-1 py-4 bg-gray-600 text-white rounded-2xl font-semibold hover:bg-gray-800 transition-all duration-300 flex items-center justify-center gap-3 shadow-lg hover:shadow-xl">
              <Calendar className="w-5 h-5" />
              Schedule Call
            </button>
          </div>
        </div>
      ))}
    </div>
  );

  if (showPitchModal) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-white rounded-3xl p-8 max-w-md mx-auto">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Respond to Pitch</h2>
            <p className="text-gray-600">Send a response to this pitch</p>
          </div>
          
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Your Response
            </label>
            <textarea
              value={pitchResponse}
              onChange={(e) => setPitchResponse(e.target.value)}
              placeholder="Thank you for your interest! I'd love to discuss this further..."
              className="w-full h-32 p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent resize-none"
            />
            <p className="text-xs text-gray-500 mt-2">{pitchResponse.length}/500 characters</p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setShowPitchModal(false)}
              className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSendResponse}
              disabled={!pitchResponse.trim()}
              className="flex-1 py-3 bg-black text-white rounded-xl font-semibold hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
            >
              Send Response
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto p-6">
        {/* Tabs */}
        <div className="mb-8">
          <div className="flex space-x-1 bg-gray-100 p-1 rounded-xl">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl transition-all duration-300 font-semibold ${
                    activeTab === tab.id
                      ? 'bg-white text-gray-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-600 hover:bg-white/50'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${activeTab === tab.id ? 'text-gray-600' : 'text-gray-500'}`} />
                  <span className="font-semibold">{tab.label}</span>
                  <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                    activeTab === tab.id
                      ? 'bg-gray-100 text-gray-700'
                      : 'bg-gray-200 text-gray-600'
                  }`}>
                    {tab.count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'sent' && renderSentPitches()}
        {activeTab === 'received' && renderReceivedPitches()}
        {activeTab === 'accepted' && renderAcceptedMatches()}
      </div>
    </div>
  );
};

export default MyPitches;
