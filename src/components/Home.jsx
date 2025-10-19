import React, { useState, useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
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
  Sun,
  Briefcase
} from 'lucide-react';

const Home = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  
  const [pitches, setPitches] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [likedPitches, setLikedPitches] = useState(new Set());
  const [showPitchModal, setShowPitchModal] = useState(false);
  const [selectedPitch, setSelectedPitch] = useState(null);
  const [pitchMessage, setPitchMessage] = useState('');
  const [showCreatePitch, setShowCreatePitch] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedPitchDetails, setSelectedPitchDetails] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('recent');
  const [filters, setFilters] = useState({
    industry: '',
    stage: '',
    location: ''
  });

  // Mock pitch data with more comprehensive information
  const generateMockPitches = (pageNum) => {
    const basePitches = [
    {
      id: 1,
        title: "EcoTrack AI",
        shortDescription: "AI-powered carbon footprint tracking for businesses",
        description: "Revolutionary platform that helps companies track and reduce their carbon footprint using advanced AI algorithms. Our solution provides real-time monitoring, predictive analytics, and actionable insights to help businesses achieve their sustainability goals.",
        industry: "Sustainability",
        stage: "MVP Stage",
        stageColor: "green",
        lookingFor: ["Technical Co-founder", "UI/UX Designer"],
        author: {
          name: "Anonymous",
          role: "Business Co-founder",
          location: "San Francisco, CA",
          avatar: null, // Anonymous - no avatar
          experience: "5+ years in sustainability tech",
          previousStartups: ["GreenTech Solutions", "EcoVentures"],
          skills: ["Business Strategy", "Sustainability", "Operations"],
          // Anonymous profile details
          anonymousProfile: {
            experience: "5+ years in sustainability tech",
            skills: ["Business Strategy", "Sustainability", "Operations"],
            previousStartups: ["GreenTech Solutions", "EcoVentures"],
            education: "MBA from Stanford",
            achievements: ["Led 3 successful product launches", "Raised $2M+ in funding"],
            workStyle: "Data-driven, collaborative",
            availability: "Full-time, flexible hours"
          }
        },
        compatibility: 92,
        tags: ["AI", "Sustainability", "B2B"],
        metrics: {
          views: 245,
          likes: 18,
          pitches: 12,
          comments: 8
        },
        timeline: "6-12 months to market",
        market: "Carbon management software market ($12B)",
        funding: "Pre-seed, seeking $500K",
        createdAt: "2 hours ago",
        imageUrl: "https://images.unsplash.com/photo-1551434678-e076c223a692?w=400&h=300&fit=crop"
    },
    {
      id: 2,
        title: "HealthConnect",
        shortDescription: "Telemedicine platform connecting patients with specialists",
        description: "Comprehensive telemedicine solution that connects patients with specialized healthcare providers through AI-powered matching. Our platform ensures quality care delivery while reducing wait times and improving patient outcomes.",
        industry: "Healthcare",
        stage: "Early Stage",
        stageColor: "yellow",
        lookingFor: ["Technical Co-founder", "Product Manager", "Marketing Expert"],
        author: {
          name: "Dr. Michael Chen",
          role: "Medical Co-founder",
          location: "Boston, MA",
          avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
          experience: "8+ years in healthcare",
          previousStartups: ["MedTech Innovations"],
          skills: ["Medical Technology", "Healthcare", "AI"],
          // Anonymous profile details
          anonymousProfile: {
            experience: "8+ years in healthcare technology",
            skills: ["Medical Technology", "Healthcare", "AI", "Telemedicine"],
            previousStartups: ["MedTech Innovations"],
            education: "MD from Harvard Medical School",
            achievements: ["Published 15+ research papers", "Led 2 successful medical device launches"],
            workStyle: "Analytical, patient-focused",
            availability: "Full-time, flexible schedule"
          }
        },
        compatibility: 88,
        tags: ["Healthcare", "Telemedicine", "AI"],
        metrics: {
          views: 189,
          likes: 25,
          pitches: 8,
          comments: 5
        },
        timeline: "9-15 months to market",
        market: "Telemedicine market ($185B)",
        funding: "Seed stage, seeking $1M",
        createdAt: "4 hours ago",
        imageUrl: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=300&fit=crop"
        },
        {
          id: 3,
        title: "EduFlow",
        shortDescription: "Personalized learning platform for K-12 education",
        description: "Adaptive learning platform that personalizes education for each student using machine learning and gamification. Our solution helps teachers create engaging, effective learning experiences while tracking student progress in real-time.",
        industry: "Education",
        stage: "Idea Stage",
        stageColor: "blue",
        lookingFor: ["Technical Co-founder", "UI/UX Designer", "Content Creator"],
        author: {
          name: "Emily Rodriguez",
          role: "Education Co-founder",
          location: "Austin, TX",
          avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
          experience: "6+ years in EdTech",
          previousStartups: ["LearnTech", "EduVentures"],
          skills: ["Education Technology", "Curriculum Design", "Learning Analytics"],
          // Anonymous profile details
          anonymousProfile: {
            experience: "6+ years in educational technology",
            skills: ["Education Technology", "Curriculum Design", "Learning Analytics", "Gamification"],
            previousStartups: ["LearnTech", "EduVentures"],
            education: "PhD in Educational Psychology from UT Austin",
            achievements: ["Designed curriculum for 50+ schools", "Won EdTech Innovation Award 2023"],
            workStyle: "Creative, student-centered",
            availability: "Part-time, evenings and weekends"
          }
        },
        compatibility: 85,
        tags: ["Education", "AI", "Gamification"],
        metrics: {
          views: 156,
          likes: 14,
          pitches: 6,
          comments: 3
        },
        timeline: "12-18 months to market",
        market: "EdTech market ($404B)",
        funding: "Pre-seed, seeking $300K",
        createdAt: "6 hours ago",
        imageUrl: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=400&h=300&fit=crop"
        },
        {
          id: 4,
        title: "FinFlow Pro",
        shortDescription: "AI-powered financial planning for small businesses",
        description: "Comprehensive financial management platform that uses AI to provide personalized financial planning, budgeting, and investment advice for small businesses. Our solution helps entrepreneurs make informed financial decisions.",
        industry: "FinTech",
        stage: "MVP Stage",
        stageColor: "green",
        lookingFor: ["Technical Co-founder", "Financial Advisor", "Marketing Expert"],
        author: {
          name: "David Kim",
          role: "Finance Co-founder",
          location: "Seattle, WA",
          avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
          experience: "7+ years in fintech",
          previousStartups: ["PayTech", "InvestFlow"],
          skills: ["Financial Technology", "AI/ML", "Business Strategy"],
          // Anonymous profile details
          anonymousProfile: {
            experience: "7+ years in financial technology",
            skills: ["Financial Technology", "AI/ML", "Business Strategy", "Investment Analysis"],
            previousStartups: ["PayTech", "InvestFlow"],
            education: "MBA in Finance from Wharton",
            achievements: ["Built 3 successful fintech products", "Raised $5M+ in funding"],
            workStyle: "Analytical, risk-aware",
            availability: "Full-time, flexible hours"
          }
        },
        compatibility: 90,
        tags: ["FinTech", "AI", "SMB"],
        metrics: {
          views: 312,
          likes: 32,
          pitches: 15,
          comments: 12
        },
        timeline: "6-9 months to market",
        market: "SMB fintech market ($8.2B)",
        funding: "Seed stage, seeking $750K",
        createdAt: "8 hours ago",
        imageUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=300&fit=crop"
      },
      {
        id: 5,
        title: "FoodTech Connect",
        shortDescription: "B2B marketplace connecting restaurants with local suppliers",
        description: "Innovative marketplace platform that connects restaurants with local food suppliers, reducing costs and improving supply chain efficiency. Our solution includes inventory management, quality tracking, and automated ordering.",
        industry: "Food & Beverage",
        stage: "Early Stage",
        stageColor: "yellow",
        lookingFor: ["Technical Co-founder", "Operations Manager", "Sales Expert"],
        author: {
          name: "Maria Garcia",
          role: "Operations Co-founder",
          location: "Miami, FL",
          avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&crop=face",
          experience: "4+ years in food industry",
          previousStartups: ["FreshSupply"],
          skills: ["Supply Chain", "Operations", "Food Technology"],
          // Anonymous profile details
          anonymousProfile: {
            experience: "4+ years in food industry operations",
            skills: ["Supply Chain", "Operations", "Food Technology", "Logistics"],
            previousStartups: ["FreshSupply"],
            education: "BS in Supply Chain Management from FIU",
            achievements: ["Optimized supply chain for 100+ restaurants", "Reduced food waste by 30%"],
            workStyle: "Detail-oriented, efficiency-focused",
            availability: "Full-time, flexible schedule"
          }
        },
        compatibility: 87,
        tags: ["FoodTech", "B2B", "Marketplace"],
        metrics: {
          views: 198,
          likes: 21,
          pitches: 9,
          comments: 6
        },
        timeline: "9-12 months to market",
        market: "Food tech market ($220B)",
        funding: "Pre-seed, seeking $400K",
        createdAt: "12 hours ago",
        imageUrl: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop"
      },
      {
        id: 6,
        title: "PropTech Solutions",
        shortDescription: "Smart property management platform for real estate",
        description: "Comprehensive property management platform that uses IoT sensors and AI to optimize building operations, reduce energy costs, and improve tenant satisfaction. Our solution provides real-time monitoring and predictive maintenance.",
        industry: "Real Estate",
        stage: "Idea Stage",
        stageColor: "blue",
        lookingFor: ["Technical Co-founder", "Real Estate Expert", "IoT Specialist"],
        author: {
          name: "James Wilson",
          role: "Real Estate Co-founder",
          location: "Chicago, IL",
          avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face",
          experience: "10+ years in real estate",
          previousStartups: ["PropVentures"],
          skills: ["Real Estate", "Property Management", "Technology"],
          // Anonymous profile details
          anonymousProfile: {
            experience: "10+ years in real estate technology",
            skills: ["Real Estate", "Property Management", "Technology", "IoT"],
            previousStartups: ["PropVentures"],
            education: "MBA in Real Estate from Northwestern",
            achievements: ["Managed 500+ properties", "Developed 2 proptech solutions"],
            workStyle: "Strategic, technology-forward",
            availability: "Full-time, flexible hours"
          }
        },
        compatibility: 83,
        tags: ["PropTech", "IoT", "AI"],
        metrics: {
          views: 167,
          likes: 19,
          pitches: 7,
          comments: 4
        },
        timeline: "12-18 months to market",
        market: "PropTech market ($86B)",
        funding: "Pre-seed, seeking $600K",
        createdAt: "1 day ago",
        imageUrl: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400&h=300&fit=crop"
      }
    ];

    // Simulate pagination by duplicating and modifying pitches
    return basePitches.map(pitch => ({
      ...pitch,
      id: pitch.id + (pageNum - 1) * 6,
      createdAt: `${Math.floor(Math.random() * 24)} hours ago`,
      metrics: {
        ...pitch.metrics,
        views: pitch.metrics.views + Math.floor(Math.random() * 100),
        likes: pitch.metrics.likes + Math.floor(Math.random() * 20),
        pitches: pitch.metrics.pitches + Math.floor(Math.random() * 10)
      }
    }));
  };

  // Load more pitches
  const loadMorePitches = useCallback(() => {
    if (loading || !hasMore) return;
    
    setLoading(true);
    setTimeout(() => {
      const newPitches = generateMockPitches(page);
      setPitches(prev => [...prev, ...newPitches]);
      setPage(prev => prev + 1);
      setLoading(false);
      
      // Simulate end of data after 5 pages
      if (page >= 5) {
        setHasMore(false);
      }
    }, 1000);
  }, [loading, hasMore, page]);

  // Initial load
  useEffect(() => {
    loadMorePitches();
  }, []);

  // Infinite scroll
  useEffect(() => {
    const handleScroll = () => {
      if (window.innerHeight + document.documentElement.scrollTop >= document.documentElement.offsetHeight - 1000) {
        loadMorePitches();
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [loadMorePitches]);

  const handleLike = (pitchId) => {
    setLikedPitches(prev => {
      const newLiked = new Set(prev);
      if (newLiked.has(pitchId)) {
        newLiked.delete(pitchId);
        // Decrease like count
        setPitches(prevPitches => 
          prevPitches.map(pitch => 
            pitch.id === pitchId 
              ? { ...pitch, metrics: { ...pitch.metrics, likes: pitch.metrics.likes - 1 } }
              : pitch
          )
        );
      } else {
        newLiked.add(pitchId);
        // Increase like count
        setPitches(prevPitches => 
          prevPitches.map(pitch => 
            pitch.id === pitchId 
              ? { ...pitch, metrics: { ...pitch.metrics, likes: pitch.metrics.likes + 1 } }
              : pitch
          )
        );
      }
      return newLiked;
    });
  };

  const handlePitch = (pitch) => {
    setSelectedPitch(pitch);
    setShowCreatePitch(true);
  };

  const handleSendPitch = () => {
    if (selectedPitch && pitchMessage.trim()) {
      console.log('Sending pitch to:', selectedPitch.id, 'Message:', pitchMessage);
      setShowPitchModal(false);
      setPitchMessage('');
      setSelectedPitch(null);
    }
  };

  const handleCreatePitch = () => {
    setShowCreatePitch(true);
  };

  const handleViewDetails = (pitch) => {
    setSelectedPitchDetails(pitch);
    setShowDetailsModal(true);
  };

  const filteredPitches = pitches.filter(pitch => {
    const matchesSearch = pitch.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         pitch.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         pitch.author.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         pitch.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesIndustry = !filters.industry || pitch.industry === filters.industry;
    const matchesStage = !filters.stage || pitch.stage.includes(filters.stage);
    const matchesLocation = !filters.location || pitch.author.location.includes(filters.location);
    
    return matchesSearch && matchesIndustry && matchesStage && matchesLocation;
  }).sort((a, b) => {
    switch (sortBy) {
      case 'popular':
        return (b.metrics?.likes || 0) - (a.metrics?.likes || 0);
      case 'match':
        return (b.compatibility || 0) - (a.compatibility || 0);
      case 'recent':
      default:
        return new Date(b.createdAt) - new Date(a.createdAt);
    }
  });

  if (showCreatePitch) {
  return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-white rounded-3xl p-8 max-w-4xl mx-auto max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {selectedPitch ? `Pitch to ${selectedPitch.author.name}` : 'Create Your Startup Pitch'}
              </h1>
              <p className="text-gray-600 mt-1">
                {selectedPitch ? `Respond to their pitch: "${selectedPitch.title}"` : 'Share your vision and find the perfect cofounder'}
              </p>
            </div>
            <button
              onClick={() => {
                setShowCreatePitch(false);
                setSelectedPitch(null);
              }}
              className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
            >
              <X className="w-6 h-6 text-gray-500" />
            </button>
          </div>

          <div className="space-y-8">
            {/* Responding to Pitch Section */}
            {selectedPitch && (
              <div className="bg-gray-50 p-6 rounded-2xl border-l-4 border-black">
                <h2 className="text-lg font-semibold text-gray-900 mb-3">Responding to:</h2>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gray-200 rounded-xl flex items-center justify-center">
                    <User className="w-6 h-6 text-gray-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{selectedPitch.title}</h3>
                    <p className="text-gray-600 text-sm mb-2">{selectedPitch.description}</p>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span>{selectedPitch.author.role} • {selectedPitch.author.location}</span>
                      <span className="px-2 py-1 bg-gray-200 text-gray-700 rounded-full text-xs">
                        {selectedPitch.stage}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Startup Overview Section */}
            <div className="bg-gray-50 p-6 rounded-2xl">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Startup Overview</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Startup Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., TechFlow AI, EcoTrack, HealthConnect"
                    className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Industry
                  </label>
                  <select className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent">
                    <option value="">Select Industry</option>
                    <option value="Technology">Technology</option>
                    <option value="Healthcare">Healthcare</option>
                    <option value="FinTech">FinTech</option>
                    <option value="Education">Education</option>
                    <option value="Sustainability">Sustainability</option>
                    <option value="Food & Beverage">Food & Beverage</option>
                    <option value="Real Estate">Real Estate</option>
                    <option value="E-commerce">E-commerce</option>
                    <option value="SaaS">SaaS</option>
                    <option value="AI/ML">AI/ML</option>
                  </select>
                </div>
              </div>
              
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  One-Line Description
                </label>
                <input
                  type="text"
                  placeholder="e.g., AI-powered workflow automation for remote teams"
                  className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent"
                />
              </div>
            </div>

            {/* Problem & Solution Section */}
            <div className="bg-gray-50 p-6 rounded-2xl">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Problem & Solution</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    What problem are you solving?
                  </label>
                  <textarea
                    placeholder="Describe the specific problem your startup addresses. Who has this problem? How big is the market?"
                    className="w-full h-24 p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent resize-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Your solution
                  </label>
                  <textarea
                    placeholder="How does your product/service solve this problem? What makes it unique or better than existing solutions?"
                    className="w-full h-24 p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent resize-none"
                  />
                </div>
              </div>
            </div>

            {/* Market & Business Section */}
            <div className="bg-gray-50 p-6 rounded-2xl">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Market & Business</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Target Market
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., Small businesses, Enterprise, Consumers"
                    className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Business Model
                  </label>
                  <select className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent">
                    <option value="">Select Model</option>
                    <option value="SaaS Subscription">SaaS Subscription</option>
                    <option value="Marketplace">Marketplace</option>
                    <option value="Freemium">Freemium</option>
                    <option value="One-time Purchase">One-time Purchase</option>
                    <option value="Commission-based">Commission-based</option>
                    <option value="Advertising">Advertising</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Market Size
                  </label>
                  <select className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent">
                    <option value="">Select Size</option>
                    <option value="<$1M">Under $1M</option>
                    <option value="$1M-$10M">$1M - $10M</option>
                    <option value="$10M-$100M">$10M - $100M</option>
                    <option value="$100M-$1B">$100M - $1B</option>
                    <option value=">$1B">Over $1B</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Current Stage
                  </label>
                  <select className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent">
                    <option value="">Select Stage</option>
                    <option value="Idea Stage">Idea Stage</option>
                    <option value="MVP Development">MVP Development</option>
                    <option value="Early Traction">Early Traction</option>
                    <option value="Growth Stage">Growth Stage</option>
                    <option value="Scale Stage">Scale Stage</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Cofounder Requirements Section */}
            <div className="bg-gray-50 p-6 rounded-2xl">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Cofounder Requirements</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    What role are you looking for?
                  </label>
                  <select className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent">
                    <option value="">Select Role</option>
                    <option value="Technical Co-founder">Technical Co-founder</option>
                    <option value="Business Co-founder">Business Co-founder</option>
                    <option value="Marketing Co-founder">Marketing Co-founder</option>
                    <option value="Sales Co-founder">Sales Co-founder</option>
                    <option value="Operations Co-founder">Operations Co-founder</option>
                    <option value="Design Co-founder">Design Co-founder</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Required skills & experience
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., React, Node.js, 5+ years startup experience, B2B sales"
                    className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    What you bring to the table
                  </label>
                  <textarea
                    placeholder="Describe your background, skills, and what you'll contribute to the partnership..."
                    className="w-full h-20 p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent resize-none"
                  />
                </div>
              </div>
            </div>

            {/* Additional Details */}
            <div className="bg-gray-50 p-6 rounded-2xl">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Additional Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Location
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., San Francisco, CA or Remote"
                    className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Timeline
                  </label>
                  <select className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent">
                    <option value="">Select Timeline</option>
                    <option value="ASAP">ASAP</option>
                    <option value="Within 1 month">Within 1 month</option>
                    <option value="Within 3 months">Within 3 months</option>
                    <option value="Within 6 months">Within 6 months</option>
                    <option value="Flexible">Flexible</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 pt-4">
              <button
                onClick={() => {
                  setShowCreatePitch(false);
                  setSelectedPitch(null);
                }}
                className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => setShowCreatePitch(false)}
                className="flex-1 py-3 bg-black text-white rounded-xl font-semibold hover:bg-gray-800 transition-all duration-300"
              >
                {selectedPitch ? 'Send Pitch' : 'Post Pitch'}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (showPitchModal) {
  return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-white rounded-3xl p-8 max-w-md mx-auto">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Pitch to {selectedPitch?.author.name}</h2>
            <p className="text-gray-600">Share why you'd make great cofounders</p>
                </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Your Pitch
            </label>
            <textarea
              value={pitchMessage}
              onChange={(e) => setPitchMessage(e.target.value)}
              placeholder="Hi! I'm interested in your startup idea. I think we'd make great cofounders because..."
              className="w-full h-32 p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-gray-900 focus:border-transparent resize-none"
            />
            <p className="text-xs text-gray-500 mt-2">{pitchMessage.length}/500 characters</p>
                </div>

          <div className="flex gap-3">
            <button
              onClick={() => setShowPitchModal(false)}
              className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSendPitch}
              disabled={!pitchMessage.trim()}
              className="flex-1 py-3 bg-gray-900 text-white rounded-xl font-semibold hover:bg-black disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
            >
              Send Pitch
            </button>
              </div>
              </div>
            </div>
    );
  }

  if (showDetailsModal) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Pitch Details</h2>
              <button
                onClick={() => setShowDetailsModal(false)}
                className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
              >
                <X className="w-6 h-6 text-gray-500" />
              </button>
            </div>

            {selectedPitchDetails && (
              <div className="space-y-6">
                {/* Pitch Header */}
                <div className="flex items-start gap-6">
                  <div className="w-20 h-20 bg-gray-900 rounded-2xl flex items-center justify-center">
                    {selectedPitchDetails.imageUrl ? (
                      <img
                        src={selectedPitchDetails.imageUrl}
                        alt={selectedPitchDetails.title}
                        className="w-full h-full object-cover rounded-2xl"
                      />
                    ) : (
                      <Rocket className="w-10 h-10 text-white" />
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">{selectedPitchDetails.title}</h3>
                    <p className="text-gray-600 text-lg mb-4">{selectedPitchDetails.shortDescription}</p>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span className="px-3 py-1 bg-gray-100 rounded-full">{selectedPitchDetails.industry}</span>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        selectedPitchDetails.stageColor === 'green' ? 'bg-gray-100 text-gray-700' :
                        selectedPitchDetails.stageColor === 'yellow' ? 'bg-gray-100 text-gray-700' :
                        selectedPitchDetails.stageColor === 'blue' ? 'bg-gray-100 text-gray-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {selectedPitchDetails.stage}
                      </span>
                      <span className="text-gray-600 font-semibold">{selectedPitchDetails.compatibility}% match</span>
          </div>
        </div>
                </div>

                {/* Anonymous Founder Info - Simplified */}
                <div className="bg-gray-50 rounded-2xl p-6">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-16 h-16 bg-black rounded-2xl flex items-center justify-center">
                      <User className="w-8 h-8 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="text-xl font-bold text-gray-900 truncate mr-2 blur-sm select-none">
                          {selectedPitchDetails.author.name}
                        </h4>
                        <span className="text-sm text-gray-600 font-semibold bg-gray-50 px-3 py-1 rounded-full whitespace-nowrap flex-shrink-0">
                          {selectedPitchDetails.compatibility}% match
                        </span>
                      </div>
                      <p className="text-gray-600 mb-1">{selectedPitchDetails.author.role}</p>
                      <p className="text-sm text-gray-500 flex items-center gap-1">
                        <MapPin className="w-4 h-4 text-black" />
                        {selectedPitchDetails.author.location}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                <div>
                        <h5 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                          <Briefcase className="w-4 h-4 text-black" />
                          Experience
                        </h5>
                        <p className="text-gray-700 text-sm">{selectedPitchDetails.author.anonymousProfile?.experience}</p>
          </div>
                      
                      <div>
                        <h5 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                          <GraduationCap className="w-4 h-4 text-black" />
                          Education
                        </h5>
                        <p className="text-gray-700 text-sm">{selectedPitchDetails.author.anonymousProfile?.education}</p>
              </div>
                </div>
                    
                    <div className="space-y-4">
                      <div>
                        <h5 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                          <Zap className="w-4 h-4 text-black" />
                          Work Style
                        </h5>
                        <p className="text-gray-700 text-sm">{selectedPitchDetails.author.anonymousProfile?.workStyle}</p>
                      </div>
                      
                      <div>
                        <h5 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                          <Clock className="w-4 h-4 text-black" />
                          Availability
                        </h5>
                        <p className="text-gray-700 text-sm">{selectedPitchDetails.author.anonymousProfile?.availability}</p>
                      </div>
            </div>
          </div>

                  {/* Skills */}
                  <div className="mt-6">
                    <h5 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <Star className="w-4 h-4 text-black" />
                      Skills & Expertise
                    </h5>
                    <div className="flex flex-wrap gap-2">
                      {(selectedPitchDetails.author.anonymousProfile?.skills || []).map((skill, index) => (
                        <span key={index} className="px-3 py-1 bg-gray-200 text-gray-700 text-sm rounded-full">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Previous Ventures & Achievements */}
                  <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                      <h5 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                        <Rocket className="w-4 h-4 text-black" />
                        Previous Ventures
                      </h5>
                      <div className="space-y-2">
                        {(selectedPitchDetails.author.anonymousProfile?.previousStartups || []).map((startup, index) => (
                          <div key={index} className="flex items-center gap-2 text-sm text-gray-700">
                            <div className="w-1.5 h-1.5 bg-gray-400 rounded-full"></div>
                            <span>{startup}</span>
              </div>
                        ))}
              </div>
            </div>
                    
                    <div>
                      <h5 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                        <Award className="w-4 h-4 text-black" />
                        Key Achievements
                      </h5>
                      <div className="space-y-2">
                        {(selectedPitchDetails.author.anonymousProfile?.achievements || []).map((achievement, index) => (
                          <div key={index} className="flex items-center gap-2 text-sm text-gray-700">
                            <div className="w-1.5 h-1.5 bg-gray-400 rounded-full"></div>
                            <span>{achievement}</span>
                          </div>
                        ))}
                      </div>
            </div>
        </div>

                  {/* Compatibility Score */}
                  <div className="mt-6 bg-white rounded-xl p-4 text-center">
                    <div className="text-3xl font-bold text-gray-600 mb-1">{selectedPitchDetails.compatibility}%</div>
                    <div className="text-sm text-gray-600">Compatibility Match</div>
                  </div>
                </div>

                {/* Detailed Description */}
              <div>
                  <h4 className="text-lg font-bold text-gray-900 mb-3">Detailed Description</h4>
                  <p className="text-gray-700 leading-relaxed">{selectedPitchDetails.description}</p>
              </div>

                {/* Market & Funding Info */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-gray-50 rounded-xl p-4">
                    <h5 className="font-semibold text-gray-900 mb-2">Timeline</h5>
                    <p className="text-sm text-gray-600">{selectedPitchDetails.timeline}</p>
              </div>
                  <div className="bg-gray-50 rounded-xl p-4">
                    <h5 className="font-semibold text-gray-900 mb-2">Market Size</h5>
                    <p className="text-sm text-gray-600">{selectedPitchDetails.market}</p>
            </div>
                  <div className="bg-gray-50 rounded-xl p-4">
                    <h5 className="font-semibold text-gray-900 mb-2">Funding Stage</h5>
                    <p className="text-sm text-gray-600">{selectedPitchDetails.funding}</p>
                        </div>
                    </div>
                    
                {/* Looking For */}
              <div>
                  <h4 className="text-lg font-bold text-gray-900 mb-3">Looking For</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedPitchDetails.lookingFor.map((role, index) => (
                      <span key={index} className="px-4 py-2 bg-gray-100 text-gray-700 rounded-full font-medium">
                        {role}
                      </span>
                    ))}
                    </div>
                        </div>

                {/* Tags */}
              <div>
                  <h4 className="text-lg font-bold text-gray-900 mb-3">Tags</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedPitchDetails.tags.map((tag, index) => (
                      <span key={index} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                        {tag}
                      </span>
                    ))}
                      </div>
            </div>

                {/* Metrics */}
                <div className="bg-gray-50 rounded-xl p-4">
                  <h4 className="text-lg font-bold text-gray-900 mb-3">Engagement Metrics</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-900">{selectedPitchDetails.metrics.views}</div>
                      <div className="text-sm text-gray-600">Views</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-900">{selectedPitchDetails.metrics.likes}</div>
                      <div className="text-sm text-gray-600">Likes</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-900">{selectedPitchDetails.metrics.pitches}</div>
                      <div className="text-sm text-gray-600">Pitches</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-900">{selectedPitchDetails.compatibility}%</div>
                      <div className="text-sm text-gray-600">Match</div>
                    </div>
                        </div>
                      </div>

                {/* Action Buttons */}
                <div className="flex gap-4 pt-4">
                  <button
                    onClick={() => handlePitch(selectedPitchDetails)}
                    className="flex-1 py-3 bg-black text-white rounded-xl font-semibold hover:bg-gray-800 transition-all duration-300 flex items-center justify-center gap-2"
                  >
                    <Send className="w-5 h-5" />
                    Send Pitch
                  </button>
                  <button
                    onClick={() => handleLike(selectedPitchDetails.id)}
                    className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2 ${
                      likedPitches.has(selectedPitchDetails.id)
                        ? 'bg-gray-600 text-white hover:bg-gray-800'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <Heart className={`w-5 h-5 ${likedPitches.has(selectedPitchDetails.id) ? 'fill-current' : ''}`} />
                    {likedPitches.has(selectedPitchDetails.id) ? 'Liked' : 'Like'}
                  </button>
                  <button className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-all duration-300 flex items-center justify-center gap-2">
                    <Share2 className="w-5 h-5" />
                    Share
                  </button>
                      </div>
              </div>
            )}
            </div>
        </div>
      </div>
    );
  }

                  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
              <h1 className="text-2xl font-bold text-gray-900">Discover Pitches</h1>
              <p className="text-gray-600">Find your next cofounder or share your idea</p>
                      </div>
            <button
              onClick={handleCreatePitch}
              className="px-6 py-3 bg-black text-white rounded-xl font-semibold hover:bg-gray-800 transition-all duration-300 flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Create Pitch
            </button>
              </div>

          {/* Search and Filters */}
          <div className="flex items-center gap-4 mt-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search pitches, founders, or keywords..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-gray-900 focus:border-transparent"
              />
            </div>
            <select
              value={filters.industry}
              onChange={(e) => setFilters({...filters, industry: e.target.value})}
              className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent bg-white"
            >
              <option value="">All Industries</option>
              <option value="Sustainability">Sustainability</option>
              <option value="Fintech">Fintech</option>
              <option value="HealthTech">HealthTech</option>
              <option value="EdTech">EdTech</option>
              <option value="AI/ML">AI/ML</option>
            </select>
            <select
              value={filters.stage}
              onChange={(e) => setFilters({...filters, stage: e.target.value})}
              className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent bg-white"
            >
              <option value="">All Stages</option>
              <option value="Idea">Idea Stage</option>
              <option value="MVP">MVP Stage</option>
              <option value="Beta">Beta Stage</option>
              <option value="Launched">Launched</option>
            </select>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent bg-white"
            >
              <option value="recent">Most Recent</option>
              <option value="popular">Most Popular</option>
              <option value="match">Best Match</option>
            </select>
          </div>

                        </div>
                    </div>
                    
      {/* Pitches Grid */}
      <div className="max-w-7xl mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredPitches.map((pitch) => (
            <div key={pitch.id} className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300">
              {/* Pitch Header */}
              <div className="p-6 pb-4">
                <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 mb-1">{pitch.title}</h3>
                    <div className="flex items-center gap-2">
                      <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                        pitch.stageColor === 'green' ? 'bg-gray-100 text-gray-700' :
                        pitch.stageColor === 'yellow' ? 'bg-gray-100 text-gray-700' :
                        pitch.stageColor === 'blue' ? 'bg-gray-100 text-gray-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {pitch.stage}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleLike(pitch.id)}
                      className={`p-2 rounded-xl transition-colors ${
                        likedPitches.has(pitch.id) 
                          ? 'bg-gray-100 text-gray-500' 
                          : 'hover:bg-gray-100 text-gray-500'
                      }`}
                    >
                      <Heart className={`w-5 h-5 ${likedPitches.has(pitch.id) ? 'fill-current' : ''}`} />
                    </button>
                    <button className="p-2 hover:bg-gray-100 rounded-xl transition-colors text-gray-500">
                      <Bookmark className="w-5 h-5" />
                    </button>
                    <button className="p-2 hover:bg-gray-100 rounded-xl transition-colors text-gray-500">
                      <Share2 className="w-5 h-5" />
                    </button>
              </div>
            </div>
                <p className="text-gray-700 text-sm mb-4">{pitch.shortDescription}</p>
          </div>

              {/* Anonymous Founder Info - Clean */}
              <div className="px-6 pb-4">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center">
                    <User className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-semibold text-gray-900 truncate mr-2 blur-sm select-none">
                        {pitch.author.name}
                      </h4>
                      <span className="text-sm text-gray-600 font-semibold bg-gray-50 px-2 py-1 rounded-full whitespace-nowrap flex-shrink-0">
                        {pitch.compatibility}% match
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">
                      {pitch.author.role} • {pitch.author.location}
                    </p>
                  </div>
                </div>
                
                <p className="text-gray-700 text-sm mb-4">{pitch.shortDescription}</p>
                
                {/* Key Details - Inline */}
                <div className="space-y-2 text-xs text-gray-600">
                  <div className="flex items-center gap-2">
                    <Briefcase className="w-3 h-3 text-black" />
                    <span>{pitch.author.anonymousProfile?.experience}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <GraduationCap className="w-3 h-3 text-black" />
                    <span>{pitch.author.anonymousProfile?.education}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Zap className="w-3 h-3 text-black" />
                    <span>{pitch.author.anonymousProfile?.workStyle}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-3 h-3 text-black" />
                    <span>{pitch.author.anonymousProfile?.availability}</span>
                  </div>
                </div>
                
                {/* Skills */}
                <div className="mt-3">
                  <div className="flex flex-wrap gap-1">
                    {(pitch.author.anonymousProfile?.skills || []).slice(0, 4).map((skill, index) => (
                      <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                        {skill}
                      </span>
                    ))}
                    {(pitch.author.anonymousProfile?.skills || []).length > 4 && (
                      <span className="px-2 py-1 bg-gray-200 text-gray-600 text-xs rounded-full">
                        +{(pitch.author.anonymousProfile?.skills || []).length - 4}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Tags */}
              <div className="px-6 pb-4">
                <div className="flex flex-wrap gap-2">
                  {pitch.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                        </div>
                      </div>

              {/* Metrics */}
              <div className="px-6 pb-4">
                <div className="flex items-center gap-6 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <Eye className="w-4 h-4" />
                    <span>{pitch.metrics.views}</span>
                </div>
                  <div className="flex items-center gap-1">
                    <Heart className="w-4 h-4" />
                    <span>{pitch.metrics.likes}</span>
            </div>
                  <div className="flex items-center gap-1">
                    <MessageCircle className="w-4 h-4" />
                    <span>{pitch.metrics.pitches}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>{pitch.createdAt}</span>
                  </div>
          </div>
        </div>

              {/* Looking For */}
              <div className="px-6 pb-4">
                <div className="mb-2">
                  <span className="text-sm font-medium text-gray-700">Looking for:</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {pitch.lookingFor.map((role, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-gray-100 text-gray-700 text-xs rounded-full font-medium"
                    >
                      {role}
                    </span>
                  ))}
                        </div>
                      </div>

              {/* Action Buttons */}
              <div className="px-6 pb-6">
                <div className="flex gap-3">
                  <button
                    onClick={() => handleViewDetails(pitch)}
                    className="flex-1 py-3 px-4 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-all duration-300 flex items-center justify-center gap-2"
                  >
                    <Eye className="w-4 h-4" />
                    View Details
                  </button>
                  <button
                    onClick={() => handlePitch(pitch)}
                    className="flex-1 py-3 px-4 bg-black text-white rounded-xl font-semibold hover:bg-gray-800 transition-all duration-300 flex items-center justify-center gap-2"
                  >
                    <Send className="w-4 h-4" />
                    Send Pitch
                  </button>
          </div>
        </div>
          </div>
          ))}
      </div>

        {/* Loading Indicator */}
        {loading && (
          <div className="flex justify-center py-8">
            <div className="flex items-center gap-2 text-gray-600">
              <div className="w-5 h-5 border-2 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
              <span>Loading more pitches...</span>
            </div>
          </div>
        )}

        {/* End of Results */}
        {!hasMore && !loading && (
          <div className="text-center py-8">
            <p className="text-gray-500">You've reached the end of the pitch feed!</p>
        </div>
        )}
      </div>
    </div>
  );
};

export default Home;