import React, { useState, memo, useCallback, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  Users, 
  MessageCircle, 
  Heart, 
  MoreVertical,
  CheckCircle,
  Star,
  MapPin,
  Briefcase,
  Calendar,
  Globe,
  Phone,
  Video,
  Mail,
  UserPlus,
  UserMinus,
  Crown,
  Award,
  Target,
  Zap,
  Clock,
  TrendingUp,
  Eye,
  Edit,
  Trash2,
  Share,
  Bookmark,
  Flag,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  SortAsc,
  SortDesc,
  Grid,
  List,
  Plus,
  X,
  Sparkles,
  ThumbsUp,
  Send,
  ExternalLink,
  Activity,
  Shield,
  Coffee,
  Briefcase as BriefcaseIcon,
  GraduationCap,
  Building2,
  MapPin as LocationIcon,
  Calendar as CalendarIcon,
  Clock as ClockIcon,
  Star as StarIcon,
  Heart as HeartIcon,
  MessageCircle as MessageIcon,
  Phone as PhoneIcon,
  Video as VideoIcon,
  Mail as MailIcon,
  Globe as GlobeIcon,
  Linkedin,
  Twitter,
  Instagram,
  Github,
  ArrowRight,
  ChevronRight,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize2,
  Minimize2,
  RotateCcw,
  RefreshCw,
  Download,
  Upload,
  Copy,
  Link as LinkIcon,
  ExternalLink as ExternalLinkIcon,
  Info,
  HelpCircle,
  Settings,
  Bell,
  BellOff,
  Archive,
  ArchiveRestore,
  Trash,
  Ban,
  UserCheck,
  UserX,
  UserPlus as UserPlusIcon,
  UserMinus as UserMinusIcon,
  Crown as CrownIcon,
  Award as AwardIcon,
  Target as TargetIcon,
  Zap as ZapIcon,
  Clock as ClockIconAlt,
  TrendingUp as TrendingUpIcon,
  Eye as EyeIcon,
  Edit as EditIcon,
  Trash2 as TrashIcon,
  Share as ShareIcon,
  Bookmark as BookmarkIcon,
  Flag as FlagIcon,
  AlertCircle as AlertCircleIcon,
  ChevronDown as ChevronDownIcon,
  ChevronUp as ChevronUpIcon,
  SortAsc as SortAscIcon,
  SortDesc as SortDescIcon,
  Grid as GridIcon,
  List as ListIcon,
  Plus as PlusIcon,
  X as XIcon
} from 'lucide-react';
import ProfileModal from './ProfileModal.jsx';

const Connections = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [viewMode, setViewMode] = useState('grid'); // grid or list
  const [sortBy, setSortBy] = useState('recent'); // recent, name, compatibility, mutual
  const [sortOrder, setSortOrder] = useState('desc'); // asc or desc
  const [selectedConnections, setSelectedConnections] = useState([]);
  const [showBulkActions, setShowBulkActions] = useState(false);
  const [hoveredCard, setHoveredCard] = useState(null);
  const [showQuickActions, setShowQuickActions] = useState(null);

  const connections = [
    {
      id: 1,
      name: 'Sarah Johnson',
      title: 'CTO & Co-Founder',
      company: 'HealthAI',
      location: 'Boston, MA',
      avatar: 'SJ',
      compatibility: 92,
      status: 'connected',
      lastActive: '2 hours ago',
      verified: true,
      interests: ['AI/ML', 'Healthcare', 'Music'],
      mutualConnections: 12,
      online: true,
      connectionDate: '2024-01-15',
      notes: 'Met at TechCrunch Disrupt. Great conversation about AI in healthcare.',
      tags: ['AI', 'Healthcare', 'Startup'],
      email: 'sarah@healthai.com',
      phone: '+1 (555) 123-4567',
      linkedin: 'sarah-johnson-healthai',
      twitter: '@sarahj_healthai',
      website: 'healthai.com',
      bio: 'Passionate about using AI to revolutionize healthcare. 10+ years in tech, former Google engineer.',
      skills: ['Machine Learning', 'Python', 'Healthcare Tech', 'Leadership'],
      recentActivity: 'Posted about new AI breakthrough in medical diagnosis',
      lastInteraction: '2024-01-20',
      interactionType: 'message',
      priority: 'high',
      coverImage: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=400&h=200&fit=crop',
      profileImage: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
      achievements: ['Forbes 30 Under 30', 'TechCrunch Disrupt Winner'],
      education: 'Stanford University - Computer Science',
      experience: '10+ years in tech',
      languages: ['English', 'Spanish', 'French'],
      availability: 'Available for coffee chats',
      timezone: 'EST',
      industry: 'Healthcare Technology',
      companySize: '11-50 employees',
      funding: 'Series A',
      revenue: '$1M - $10M',
      socialMedia: {
        linkedin: 'sarah-johnson-healthai',
        twitter: '@sarahj_healthai',
        instagram: '@sarahj_health',
        github: 'sarahj-healthai'
      },
      contactPreferences: {
        email: true,
        phone: false,
        linkedin: true,
        twitter: true
      },
      meetingPreferences: {
        coffee: true,
        lunch: true,
        video: true,
        phone: false
      },
      expertise: ['Machine Learning', 'Healthcare AI', 'Product Strategy', 'Team Leadership'],
      lookingFor: ['Partnerships', 'Advisors', 'Investors', 'Talent'],
      offering: ['Technical Consulting', 'Mentoring', 'Speaking', 'Advisory'],
      recentPosts: [
        'Just launched our AI-powered diagnostic tool! 🚀',
        'Excited to speak at the Healthcare AI Summit next month',
        'Looking for talented ML engineers to join our team'
      ],
      mutualInterests: ['Artificial Intelligence', 'Healthcare Innovation', 'Startup Culture'],
      connectionStrength: 'Strong',
      lastMeeting: '2024-01-15',
      nextMeeting: '2024-02-01',
      relationshipNotes: 'Great potential for collaboration on healthcare AI projects',
      referralPotential: 'High',
      collaborationHistory: ['Joint webinar on AI in healthcare', 'Mutual introductions to 3 contacts'],
      sharedConnections: ['John Smith', 'Emily Chen', 'Michael Brown'],
      commonGroups: ['Healthcare AI Network', 'Boston Tech Leaders', 'Women in Tech'],
      eventHistory: ['TechCrunch Disrupt 2023', 'Healthcare AI Summit 2023', 'Boston Tech Meetup'],
      communicationStyle: 'Direct and technical',
      responseTime: 'Within 2 hours',
      meetingFrequency: 'Monthly',
      preferredMeetingTime: 'Morning',
      meetingDuration: '30-60 minutes',
      location: 'Boston area or video',
      networkingGoals: ['Expand healthcare AI network', 'Find potential partners', 'Share knowledge'],
      personalInterests: ['Running', 'Photography', 'Cooking', 'Travel'],
      personality: ['Analytical', 'Innovative', 'Collaborative', 'Ambitious'],
      workStyle: ['Remote-friendly', 'Flexible hours', 'Results-oriented'],
      values: ['Innovation', 'Impact', 'Collaboration', 'Growth'],
      goals: ['Scale HealthAI globally', 'Improve healthcare outcomes', 'Build diverse team'],
      challenges: ['Talent acquisition', 'Regulatory compliance', 'Market education'],
      opportunities: ['International expansion', 'New product lines', 'Strategic partnerships'],
      riskTolerance: 'Medium-High',
      decisionMaking: 'Data-driven',
      communicationFrequency: 'Weekly',
      relationshipType: 'Professional',
      trustLevel: 'High',
      influence: 'High',
      networkValue: 'High',
      potentialValue: 'Very High',
      urgency: 'Medium',
      followUpRequired: true,
      followUpDate: '2024-01-25',
      followUpNotes: 'Discuss potential partnership opportunities',
      tags: ['AI', 'Healthcare', 'Startup', 'Leadership', 'Innovation'],
      customFields: {
        'Investment Interest': 'Yes',
        'Partnership Potential': 'High',
        'Speaking Opportunities': 'Yes',
        'Mentoring Interest': 'Yes'
      }
    },
    {
      id: 2,
      name: 'Mike Rodriguez',
      title: 'CEO & Founder',
      company: 'EcoTech',
      location: 'Austin, TX',
      avatar: 'MR',
      compatibility: 88,
      status: 'pending',
      lastActive: '1 day ago',
      verified: true,
      interests: ['Sustainability', 'Adventure', 'Yoga'],
      mutualConnections: 8,
      online: false,
      connectionDate: '2024-01-20',
      notes: 'Environmental entrepreneur. Passionate about sustainable tech.',
      tags: ['Sustainability', 'Tech', 'Environment'],
      email: 'mike@ecotech.com',
      phone: '+1 (555) 234-5678',
      linkedin: 'mike-rodriguez-ecotech',
      twitter: '@miker_ecotech',
      website: 'ecotech.com',
      bio: 'Building the future of sustainable technology. Former Tesla engineer, climate activist.',
      skills: ['Sustainability', 'Clean Tech', 'Leadership', 'Innovation'],
      recentActivity: 'Launched new carbon tracking platform',
      lastInteraction: '2024-01-18',
      interactionType: 'email',
      priority: 'medium'
    },
    {
      id: 3,
      name: 'Emma Wilson',
      title: 'Product Manager',
      company: 'FinTech Solutions',
      location: 'New York, NY',
      avatar: 'EW',
      compatibility: 85,
      status: 'connected',
      lastActive: '3 hours ago',
      verified: true,
      interests: ['Fintech', 'Travel', 'Photography'],
      mutualConnections: 15,
      online: true,
      connectionDate: '2024-01-10',
      notes: 'Product expert with great insights on user experience.',
      tags: ['Product', 'Fintech', 'UX'],
      email: 'emma@fintechsolutions.com',
      phone: '+1 (555) 345-6789',
      linkedin: 'emma-wilson-fintech',
      twitter: '@emmaw_fintech',
      website: 'fintechsolutions.com',
      bio: 'Product manager with 8+ years in fintech. Passionate about creating user-centered financial products.',
      skills: ['Product Management', 'UX Design', 'Fintech', 'Analytics'],
      recentActivity: 'Shared insights on mobile banking trends',
      lastInteraction: '2024-01-19',
      interactionType: 'call',
      priority: 'high'
    },
    {
      id: 4,
      name: 'David Chen',
      title: 'VP of Engineering',
      company: 'CloudScale',
      location: 'Seattle, WA',
      avatar: 'DC',
      compatibility: 90,
      status: 'connected',
      lastActive: '5 hours ago',
      verified: true,
      interests: ['Cloud Computing', 'Architecture', 'Hiking'],
      mutualConnections: 20,
      online: false,
      connectionDate: '2024-01-05',
      notes: 'Cloud infrastructure expert. Very knowledgeable about scaling.',
      tags: ['Cloud', 'Engineering', 'Scaling'],
      email: 'david@cloudscale.com',
      phone: '+1 (555) 456-7890',
      linkedin: 'david-chen-cloudscale',
      twitter: '@davidc_cloud',
      website: 'cloudscale.com',
      bio: 'VP of Engineering at CloudScale. Former AWS architect, scaling expert.',
      skills: ['Cloud Architecture', 'DevOps', 'Scalability', 'Team Leadership'],
      recentActivity: 'Published article on microservices architecture',
      lastInteraction: '2024-01-17',
      interactionType: 'message',
      priority: 'medium'
    },
    {
      id: 5,
      name: 'Lisa Park',
      title: 'Marketing Director',
      company: 'GrowthCo',
      location: 'Los Angeles, CA',
      avatar: 'LP',
      compatibility: 78,
      status: 'pending',
      lastActive: '2 days ago',
      verified: false,
      interests: ['Marketing', 'Growth', 'Design'],
      mutualConnections: 5,
      online: false,
      connectionDate: '2024-01-25',
      notes: 'Growth marketing specialist. Creative approach to user acquisition.',
      tags: ['Marketing', 'Growth', 'Creative'],
      email: 'lisa@growthco.com',
      phone: '+1 (555) 567-8901',
      linkedin: 'lisa-park-growthco',
      twitter: '@lisap_growth',
      website: 'growthco.com',
      bio: 'Marketing director with expertise in growth hacking and creative campaigns.',
      skills: ['Growth Marketing', 'Digital Marketing', 'Creative Strategy', 'Analytics'],
      recentActivity: 'Launched viral marketing campaign',
      lastInteraction: '2024-01-22',
      interactionType: 'email',
      priority: 'low'
    }
  ];

  const tabs = [
    { id: 'all', label: 'All Connections', count: connections.length },
    { id: 'connected', label: 'Connected', count: connections.filter(c => c.status === 'connected').length },
    { id: 'pending', label: 'Pending', count: connections.filter(c => c.status === 'pending').length },
    { id: 'mutual', label: 'Mutual', count: connections.filter(c => c.mutualConnections > 10).length },
    { id: 'high-priority', label: 'High Priority', count: connections.filter(c => c.priority === 'high').length }
  ];

  const sortOptions = [
    { id: 'recent', label: 'Most Recent' },
    { id: 'name', label: 'Name' },
    { id: 'compatibility', label: 'Compatibility' },
    { id: 'mutual', label: 'Mutual Connections' },
    { id: 'last-interaction', label: 'Last Interaction' }
  ];

  const filteredConnections = connections.filter(connection => {
    const matchesSearch = connection.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         connection.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         connection.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         connection.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesTab = activeTab === 'all' || 
                      (activeTab === 'connected' && connection.status === 'connected') ||
                      (activeTab === 'pending' && connection.status === 'pending') ||
                      (activeTab === 'mutual' && connection.mutualConnections > 10) ||
                      (activeTab === 'high-priority' && connection.priority === 'high');
    
    return matchesSearch && matchesTab;
  }).sort((a, b) => {
    let comparison = 0;
    switch (sortBy) {
      case 'name':
        comparison = a.name.localeCompare(b.name);
        break;
      case 'compatibility':
        comparison = a.compatibility - b.compatibility;
        break;
      case 'mutual':
        comparison = a.mutualConnections - b.mutualConnections;
        break;
      case 'last-interaction':
        comparison = new Date(a.lastInteraction) - new Date(b.lastInteraction);
        break;
      default: // recent
        comparison = new Date(b.connectionDate) - new Date(a.connectionDate);
    }
    return sortOrder === 'asc' ? comparison : -comparison;
  });

  const handleConnectionAction = (connectionId, action) => {
    console.log(`${action} connection ${connectionId}`);
    // Handle connection actions here
  };

  const handleSelectConnection = (connectionId) => {
    setSelectedConnections(prev => 
      prev.includes(connectionId) 
        ? prev.filter(id => id !== connectionId)
        : [...prev, connectionId]
    );
  };

  const handleSelectAll = () => {
    if (selectedConnections.length === filteredConnections.length) {
      setSelectedConnections([]);
    } else {
      setSelectedConnections(filteredConnections.map(c => c.id));
    }
  };

  const handleBulkAction = (action) => {
    console.log(`Bulk ${action} for connections:`, selectedConnections);
    setSelectedConnections([]);
    setShowBulkActions(false);
  };

  const handleViewProfile = (connection) => {
    setSelectedProfile(connection);
    setShowProfileModal(true);
  };

  const handleCloseProfileModal = () => {
    setShowProfileModal(false);
    setSelectedProfile(null);
  };

  const handleLikeFromModal = (profile) => {
    console.log('Liked profile:', profile.id);
    setShowProfileModal(false);
  };

  const handleMessageFromModal = (profile) => {
    console.log('Message profile:', profile.id);
    setShowProfileModal(false);
  };

  const handleSuperLikeFromModal = (profile) => {
    console.log('Super liked profile:', profile.id);
    setShowProfileModal(false);
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'text-red-500';
      case 'medium': return 'text-yellow-500';
      case 'low': return 'text-green-500';
      default: return 'text-gray-500';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'connected': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'blocked': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="main-content">
      <div className="container">
        <div className="section">
          {/* Header */}
          <div className="mb-6 sm:mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex-1">
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2 sm:mb-4">Connections</h1>
                <p className="text-base sm:text-lg text-gray-600">Manage your professional network and relationships</p>
              </div>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
                <button className="btn btn-secondary text-sm sm:text-base">
                  <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span className="hidden xs:inline">Add Connection</span>
                  <span className="xs:hidden">Add</span>
                </button>
                <button className="btn btn-primary text-sm sm:text-base">
                  <UserPlus className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span className="hidden xs:inline">Import Contacts</span>
                  <span className="xs:hidden">Import</span>
                </button>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
            <div className="card p-4 sm:p-6">
              <div className="flex items-center justify-between mb-3 sm:mb-4">
                <div className="p-2 sm:p-3 rounded-lg bg-blue-500">
                  <Users className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
                <span className="text-xl sm:text-2xl font-bold text-gray-900">{connections.length}</span>
              </div>
              <h3 className="text-xs sm:text-sm text-gray-600">Total Connections</h3>
            </div>

            <div className="card p-4 sm:p-6">
              <div className="flex items-center justify-between mb-3 sm:mb-4">
                <div className="p-2 sm:p-3 rounded-lg bg-green-500">
                  <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
                <span className="text-xl sm:text-2xl font-bold text-gray-900">
                  {connections.filter(c => c.status === 'connected').length}
                </span>
              </div>
              <h3 className="text-xs sm:text-sm text-gray-600">Connected</h3>
            </div>

            <div className="card p-4 sm:p-6">
              <div className="flex items-center justify-between mb-3 sm:mb-4">
                <div className="p-2 sm:p-3 rounded-lg bg-orange-500">
                  <Clock className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
                <span className="text-xl sm:text-2xl font-bold text-gray-900">
                  {connections.filter(c => c.status === 'pending').length}
                </span>
              </div>
              <h3 className="text-xs sm:text-sm text-gray-600">Pending</h3>
            </div>

            <div className="card p-4 sm:p-6">
              <div className="flex items-center justify-between mb-3 sm:mb-4">
                <div className="p-2 sm:p-3 rounded-lg bg-purple-500">
                  <Star className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
                <span className="text-xl sm:text-2xl font-bold text-gray-900">
                  {connections.filter(c => c.mutualConnections > 10).length}
                </span>
              </div>
              <h3 className="text-xs sm:text-sm text-gray-600">Mutual</h3>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="card mb-4 sm:mb-6">
            <div className="card-body p-4 sm:p-6">
              <div className="flex flex-col space-y-3 sm:space-y-0 sm:flex-row sm:gap-4">
                {/* Search Bar */}
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search connections, companies, or tags..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="input pl-9 sm:pl-10 text-sm sm:text-base"
                  />
                </div>
                
                {/* Controls Row */}
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-2">
                  {/* Sort Dropdown */}
                  <div className="flex items-center space-x-2">
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="input text-sm sm:text-base flex-1 sm:flex-none"
                    >
                      {sortOptions.map(option => (
                        <option key={option.id} value={option.id}>{option.label}</option>
                      ))}
                    </select>
                    <button
                      onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                      className="btn btn-ghost btn-sm"
                    >
                      {sortOrder === 'asc' ? <SortAsc className="w-4 h-4" /> : <SortDesc className="w-4 h-4" />}
                    </button>
                  </div>

                  {/* View Mode Toggle */}
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setViewMode('grid')}
                      className={`btn btn-sm ${viewMode === 'grid' ? 'btn-primary' : 'btn-ghost'}`}
                    >
                      <Grid className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setViewMode('list')}
                      className={`btn btn-sm ${viewMode === 'list' ? 'btn-primary' : 'btn-ghost'}`}
                    >
                      <List className="w-4 h-4" />
                    </button>
                  </div>
                  
                  {/* Filter Button */}
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="btn btn-secondary text-sm sm:text-base"
                  >
                    <Filter className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span className="hidden xs:inline">Filters</span>
                    <span className="xs:hidden">Filter</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Bulk Actions */}
          {selectedConnections.length > 0 && (
            <div className="card mb-4 sm:mb-6 bg-blue-50 border-blue-200">
              <div className="card-body p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
                    <span className="text-sm font-medium text-blue-900">
                      {selectedConnections.length} connection{selectedConnections.length > 1 ? 's' : ''} selected
                    </span>
                    <button
                      onClick={handleSelectAll}
                      className="text-sm text-blue-600 hover:text-blue-800 text-left sm:text-center"
                    >
                      {selectedConnections.length === filteredConnections.length ? 'Deselect All' : 'Select All'}
                    </button>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      onClick={() => handleBulkAction('message')}
                      className="btn btn-sm btn-secondary text-xs sm:text-sm"
                    >
                      <MessageCircle className="w-3 h-3 sm:w-4 sm:h-4" />
                      <span className="hidden xs:inline">Message</span>
                    </button>
                    <button
                      onClick={() => handleBulkAction('export')}
                      className="btn btn-sm btn-secondary text-xs sm:text-sm"
                    >
                      <Share className="w-3 h-3 sm:w-4 sm:h-4" />
                      <span className="hidden xs:inline">Export</span>
                    </button>
                    <button
                      onClick={() => handleBulkAction('tag')}
                      className="btn btn-sm btn-secondary text-xs sm:text-sm"
                    >
                      <Bookmark className="w-3 h-3 sm:w-4 sm:h-4" />
                      <span className="hidden xs:inline">Tag</span>
                    </button>
                    <button
                      onClick={() => setSelectedConnections([])}
                      className="btn btn-sm btn-ghost"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tabs */}
          <div className="card mb-4 sm:mb-6">
            <div className="card-header p-4 sm:p-6">
              <div className="flex items-center space-x-4 sm:space-x-6 lg:space-x-8 overflow-x-auto scrollbar-hide">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center space-x-2 pb-2 border-b-2 transition-colors whitespace-nowrap min-w-max ${
                      activeTab === tab.id
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    <span className="font-medium text-sm sm:text-base">{tab.label}</span>
                    <span className="badge badge-secondary text-xs">{tab.count}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Enhanced Connections Grid */}
          <div className={viewMode === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 lg:gap-8' : 'space-y-4 sm:space-y-6'}>
            {filteredConnections.map((connection, index) => (
              <div 
                key={connection.id} 
                className={`connection-card ${
                  selectedConnections.includes(connection.id) ? 'ring-4 ring-blue-400 ring-opacity-50' : ''
                }`}
                onMouseEnter={() => setHoveredCard(connection.id)}
                onMouseLeave={() => setHoveredCard(null)}
                style={{
                  animationDelay: `${index * 100}ms`,
                  animation: 'fadeInUp 0.6s ease-out forwards'
                }}
              >
                {/* Header with gradient background */}
                <div className="connection-card-header">
                  <div className="connection-card-status">
                    {connection.verified && (
                      <div className="w-6 h-6 bg-white bg-opacity-90 rounded-full flex items-center justify-center">
                        <CheckCircle className="w-4 h-4 text-blue-500" />
                      </div>
                    )}
                    {connection.online && (
                      <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                        <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
                      </div>
                    )}
                    <span className="card-status card-status-accepted">Connected</span>
                  </div>
                  
                  {/* Avatar */}
                  <div className="connection-card-avatar bg-gradient-to-r from-blue-500 to-purple-500">
                    {connection.avatar}
                  </div>
                </div>

                {/* Card Body */}
                <div className="connection-card-body">
                  {/* Profile Info */}
                  <div className="connection-card-info">
                    <h3 className="connection-card-name">{connection.name}</h3>
                    <p className="connection-card-title">{connection.title}</p>
                    <p className="connection-card-company">{connection.company}</p>
                  </div>

                  {/* Meta Information */}
                  <div className="connection-card-meta">
                    <div className="connection-card-location">
                      <MapPin className="w-4 h-4" />
                      <span>{connection.location}</span>
                    </div>
                    <div className="connection-card-mutual">
                      <Users className="w-4 h-4" />
                      <span>{connection.mutualConnections} mutual</span>
                    </div>
                    <div className="connection-card-score">
                      <Star className="w-4 h-4" />
                      <span>{connection.compatibility}% match</span>
                    </div>
                  </div>

                  {/* Bio */}
                  <p className="connection-card-bio">{connection.bio}</p>

                  {/* Skills */}
                  <div className="connection-card-skills">
                    {connection.skills.slice(0, 3).map((skill, skillIndex) => (
                      <span key={skillIndex} className="connection-card-skill">
                        {skill}
                      </span>
                    ))}
                    {connection.skills.length > 3 && (
                      <span className="connection-card-skill">
                        +{connection.skills.length - 3} more
                      </span>
                    )}
                  </div>

                  {/* Recent Achievement */}
                  <div className="connection-card-achievement">
                    <p className="connection-card-quote">"{connection.recentActivity}"</p>
                  </div>

                  {/* Activity Info */}
                  <div className="connection-card-activity">
                    <div>Connected: {new Date(connection.connectionDate).toLocaleDateString()}</div>
                    <div>Last active: {connection.lastActive}</div>
                    <div>Last interaction: {connection.lastInteraction}</div>
                  </div>

                  {/* Interaction Tags */}
                  <div className="connection-card-tags">
                    {connection.interactionTags?.map((tag, tagIndex) => (
                      <span key={tagIndex} className="connection-card-tag">
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Actions */}
                  <div className="connection-card-actions">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleViewProfile(connection)}
                        className="btn btn-primary btn-icon-only btn-sm"
                        title="View Profile"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      
                      <button
                        onClick={() => handleConnectionAction(connection.id, 'message')}
                        className="btn btn-info btn-icon-only btn-sm"
                        title="Message"
                      >
                        <MessageCircle className="w-4 h-4" />
                      </button>
                      
                      <button
                        onClick={() => handleConnectionAction(connection.id, 'call')}
                        className="btn btn-success btn-icon-only btn-sm"
                        title="Call"
                      >
                        <Phone className="w-4 h-4" />
                      </button>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={selectedConnections.includes(connection.id)}
                        onChange={() => handleSelectConnection(connection.id)}
                        className="connection-card-checkbox"
                      />
                      <button
                        onClick={() => setShowQuickActions(showQuickActions === connection.id ? null : connection.id)}
                        className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                      >
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Quick Actions Dropdown */}
                  {showQuickActions === connection.id && (
                    <div className="absolute top-full right-2 sm:right-4 mt-2 w-40 sm:w-48 bg-white rounded-lg sm:rounded-xl shadow-xl border border-gray-200 py-2 z-10">
                      <button className="btn btn-ghost w-full justify-start btn-sm btn-icon">
                        <Video className="w-3 h-3 sm:w-4 sm:h-4" />
                        <span>Video Call</span>
                      </button>
                      <button className="btn btn-ghost w-full justify-start btn-sm btn-icon">
                        <Mail className="w-3 h-3 sm:w-4 sm:h-4" />
                        <span>Send Email</span>
                      </button>
                      <button className="btn btn-ghost w-full justify-start btn-sm btn-icon">
                        <Share className="w-3 h-3 sm:w-4 sm:h-4" />
                        <span>Share Profile</span>
                      </button>
                      <button className="btn btn-ghost w-full justify-start btn-sm btn-icon">
                        <Bookmark className="w-3 h-3 sm:w-4 sm:h-4" />
                        <span>Save Contact</span>
                      </button>
                      <hr className="my-2" />
                      <button className="btn btn-danger w-full justify-start btn-sm btn-icon">
                        <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
                        <span>Remove Connection</span>
                      </button>
                    </div>
                  )}

                  {/* Connection Info Footer */}
                  <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-gray-100">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between text-xs text-gray-500 space-y-1 sm:space-y-0">
                      <span className="truncate">Connected {new Date(connection.connectionDate).toLocaleDateString()}</span>
                      <span className="truncate">Last active {connection.lastActive}</span>
                    </div>
                    
                    {/* Tags */}
                    <div className="flex flex-wrap gap-1 mt-2">
                      {connection.tags.slice(0, 2).map((tag, tagIndex) => (
                        <span 
                          key={tagIndex} 
                          className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                      {connection.tags.length > 2 && (
                        <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                          +{connection.tags.length - 2}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-purple-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
              </div>
            ))}
          </div>

          {/* Load More */}
          <div className="text-center mt-6 sm:mt-8">
            <button className="btn btn-primary btn-lg text-sm sm:text-base">
              <Zap className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="hidden xs:inline">Load More Connections</span>
              <span className="xs:hidden">Load More</span>
            </button>
          </div>
        </div>
      </div>

      {/* Profile Modal */}
      <ProfileModal
        profile={selectedProfile}
        isOpen={showProfileModal}
        onClose={handleCloseProfileModal}
        onLike={handleLikeFromModal}
        onMessage={handleMessageFromModal}
        onSuperLike={handleSuperLikeFromModal}
      />
    </div>
  );
};

export default memo(Connections);