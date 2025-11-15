import React, { useState, useEffect } from 'react';
import { 
  Rocket, Target, CheckCircle, Circle, Clock, AlertCircle, 
  BarChart3, TrendingUp, Award, Star, Zap, Users,
  Calendar, FileText, MessageSquare, Video, Plus,
  Edit3, Trash2, Save, Download, Share2, Eye,
  ChevronRight, ChevronDown, ChevronUp, ArrowRight,
  ArrowLeft, ArrowUp, ArrowDown, Building2, Code,
  Palette, DollarSign, Globe, Phone, Mail, ExternalLink,
  Bell, Settings, Search, Filter, SortAsc, SortDesc,
  RefreshCw, Heart, Bookmark, Flag, MoreHorizontal,
  Info, HelpCircle, Lock, Unlock, Key, Shield,
  Activity, Compass, Badge, Gift, Coffee, Plane,
  Gamepad2, BookOpen, Instagram, Twitter, Linkedin,
  Github, Camera, Mic, Play, Pause, Volume2,
  ThumbsUp, MessageCircle, Send, Upload, Link,
  Copy, Scissors, Move, ZoomIn, ZoomOut, RotateCw,
  RotateCcw, Maximize2, Minimize2, X, Check,
  AlertTriangle, AlertOctagon, PlusCircle, MinusCircle,
  XCircle, CheckCircle2, Calculator, MapPin, Navigation,
  Sparkles, Layout, GitBranch, Briefcase, ListChecks,
  Trophy, Megaphone
} from 'lucide-react';
import TeamWorkspace from './TeamWorkspace';
import ZeroToMVPBuilder from './sprint-tools/ZeroToMVPBuilder';
import ValidationEngine from './sprint-tools/ValidationEngine';

const StartupWorkspace = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [newTask, setNewTask] = useState({ title: '', description: '', assignee: '', priority: 'medium' });
  const [showAddTask, setShowAddTask] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [draggedTask, setDraggedTask] = useState(null);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [startupData, setStartupData] = useState({
    name: 'TechFlow AI',
    description: 'AI-powered workflow automation for remote teams',
    stage: 'MVP Development',
    progress: 65,
    cofounders: [
      {
        id: 1,
        name: 'Alex Chen',
        role: 'Technical Co-founder',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face',
        skills: ['React', 'Node.js', 'AI/ML', 'AWS'],
        status: 'active'
      },
      {
        id: 2,
        name: 'Sarah Martinez',
        role: 'Business Co-founder',
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=400&fit=crop&crop=face',
        skills: ['Business Strategy', 'Sales', 'Marketing', 'Operations'],
        status: 'active'
      }
    ],
    milestones: [
      { 
        id: 1, 
        title: 'Market Research', 
        status: 'completed', 
        dueDate: '2024-01-15',
        description: 'Complete market analysis and competitor research',
        category: 'research',
        progress: 100,
        estimatedHours: 40,
        actualHours: 38,
        assignedTo: 'Sarah',
        tasks: [
          { id: 1, title: 'Competitor analysis', status: 'completed', assignee: 'Sarah', estimatedHours: 8, actualHours: 7 },
          { id: 2, title: 'Market sizing', status: 'completed', assignee: 'Sarah', estimatedHours: 12, actualHours: 11 },
          { id: 3, title: 'User interviews', status: 'completed', assignee: 'Sarah', estimatedHours: 20, actualHours: 20 }
        ],
        dependencies: [],
        notes: []
      },
      { 
        id: 2, 
        title: 'MVP Development', 
        status: 'in-progress', 
        dueDate: '2024-03-01',
        description: 'Build core MVP features and functionality',
        category: 'development',
        progress: 65,
        estimatedHours: 320,
        actualHours: 208,
        assignedTo: 'Alex',
        tasks: [
          { id: 1, title: 'User authentication system', status: 'completed', assignee: 'Alex', estimatedHours: 16, actualHours: 14 },
          { id: 2, title: 'Core workflow engine', status: 'in-progress', assignee: 'Alex', estimatedHours: 80, actualHours: 52 },
          { id: 3, title: 'Dashboard UI', status: 'in-progress', assignee: 'Sarah', estimatedHours: 40, actualHours: 28 },
          { id: 4, title: 'API integration', status: 'pending', assignee: 'Alex', estimatedHours: 24, actualHours: 0 },
          { id: 5, title: 'Testing and QA', status: 'pending', assignee: 'Alex', estimatedHours: 40, actualHours: 0 }
        ],
        dependencies: [1],
        linkedFeatures: [1, 2, 3, 4],
        notes: ['Focus on core features first', 'Need to finalize API endpoints']
      },
      { 
        id: 3, 
        title: 'Beta Testing', 
        status: 'pending', 
        dueDate: '2024-04-15',
        description: 'Launch beta version and gather user feedback',
        category: 'testing',
        progress: 0,
        estimatedHours: 80,
        actualHours: 0,
        assignedTo: 'Sarah',
        tasks: [],
        dependencies: [2],
        notes: []
      },
      { 
        id: 4, 
        title: 'Launch', 
        status: 'pending', 
        dueDate: '2024-06-01',
        description: 'Public launch and marketing campaign',
        category: 'operations',
        progress: 0,
        estimatedHours: 120,
        actualHours: 0,
        assignedTo: 'Sarah',
        tasks: [],
        dependencies: [3],
        notes: []
      }
    ],
    tasks: [
      { id: 1, title: 'Set up development environment', assignee: 'Alex', status: 'completed', priority: 'high' },
      { id: 2, title: 'Design user interface mockups', assignee: 'Sarah', status: 'in-progress', priority: 'medium' },
      { id: 3, title: 'Implement core AI algorithms', assignee: 'Alex', status: 'pending', priority: 'high' },
      { id: 4, title: 'Create marketing strategy', assignee: 'Sarah', status: 'pending', priority: 'medium' }
    ],
    funding: {
      raised: 0,
      target: 500000,
      investors: [],
      nextRound: 'Seed'
    },
    metrics: {
      users: 0,
      revenue: 0,
      growth: 0,
      retention: 0
    }
  });

  const [showMilestoneModal, setShowMilestoneModal] = useState(false);
  const [showEventModal, setShowEventModal] = useState(false);
  const [showTeamModal, setShowTeamModal] = useState(false);
  const [newMilestone, setNewMilestone] = useState({ title: '', description: '', dueDate: '', category: 'development', estimatedHours: '', assignedTo: '' });
  const [selectedMilestone, setSelectedMilestone] = useState(null);
  const [showMilestoneDetails, setShowMilestoneDetails] = useState(false);
  const [newMilestoneTask, setNewMilestoneTask] = useState({ title: '', assignee: '', estimatedHours: '', priority: 'medium' });
  const [milestoneDependencies, setMilestoneDependencies] = useState({});
  const [selectedFeature, setSelectedFeature] = useState(null);
  const [showFeatureDetails, setShowFeatureDetails] = useState(false);
  const [newFeatureTask, setNewFeatureTask] = useState({ title: '', estimatedHours: '', priority: 'medium' });
  const [newEvent, setNewEvent] = useState({ title: '', description: '', date: '', time: '', type: 'meeting' });
  const [newTeamMember, setNewTeamMember] = useState({ name: '', role: '', email: '', skills: [] });
  const [mvpFeatures, setMvpFeatures] = useState([
    { 
      id: 1, 
      title: 'User Authentication', 
      status: 'completed', 
      assignee: 'Alex', 
      priority: 'high',
      estimatedHours: 16,
      actualHours: 14,
      tasks: [
        { id: 1, title: 'Setup auth system', status: 'completed', estimatedHours: 8, actualHours: 7 },
        { id: 2, title: 'Implement login/logout', status: 'completed', estimatedHours: 8, actualHours: 7 }
      ],
      dependencies: [],
      linkedMilestone: 2,
      notes: ['Completed ahead of schedule']
    },
    { 
      id: 2, 
      title: 'Core Workflow Engine', 
      status: 'in-progress', 
      assignee: 'Alex', 
      priority: 'high',
      estimatedHours: 80,
      actualHours: 52,
      tasks: [
        { id: 1, title: 'Design workflow structure', status: 'completed', estimatedHours: 16, actualHours: 14 },
        { id: 2, title: 'Implement core logic', status: 'in-progress', estimatedHours: 40, actualHours: 28 },
        { id: 3, title: 'Add workflow templates', status: 'pending', estimatedHours: 24, actualHours: 0 }
      ],
      dependencies: [1],
      linkedMilestone: 2,
      notes: ['Core logic taking longer than expected']
    },
    { 
      id: 3, 
      title: 'Task Management', 
      status: 'in-progress', 
      assignee: 'Alex', 
      priority: 'high',
      estimatedHours: 40,
      actualHours: 28,
      tasks: [
        { id: 1, title: 'Create task model', status: 'completed', estimatedHours: 8, actualHours: 6 },
        { id: 2, title: 'Build task UI', status: 'in-progress', estimatedHours: 24, actualHours: 18 },
        { id: 3, title: 'Add task filters', status: 'pending', estimatedHours: 8, actualHours: 0 }
      ],
      dependencies: [1],
      linkedMilestone: 2,
      notes: []
    },
    { 
      id: 4, 
      title: 'Dashboard UI', 
      status: 'pending', 
      assignee: 'Sarah', 
      priority: 'medium',
      estimatedHours: 32,
      actualHours: 0,
      tasks: [],
      dependencies: [2, 3],
      linkedMilestone: 2,
      notes: []
    },
    { 
      id: 5, 
      title: 'Analytics Integration', 
      status: 'pending', 
      assignee: 'Alex', 
      priority: 'low',
      estimatedHours: 24,
      actualHours: 0,
      tasks: [],
      dependencies: [4],
      linkedMilestone: null,
      notes: []
    }
  ]);

  const [wireframes, setWireframes] = useState([]);
  const [userFlows, setUserFlows] = useState([]);
  const [landingPage, setLandingPage] = useState({ status: 'pending', sections: [] });
  const [prototype, setPrototype] = useState({ status: 'pending', url: '', version: '1.0' });
  const [uiKit, setUiKit] = useState({ status: 'pending', components: [] });
  const [techArchitecture, setTechArchitecture] = useState({ status: 'pending', diagrams: [] });
  const [featurePRDs, setFeaturePRDs] = useState([]);
  const [sprintSchedules, setSprintSchedules] = useState([]);
  const [activeMvpTab, setActiveMvpTab] = useState('overview');
  const [events, setEvents] = useState([
    { id: 1, title: 'Team Standup', date: '2024-02-15', time: '10:00 AM', type: 'meeting', attendees: ['Alex', 'Sarah'] },
    { id: 2, title: 'Demo Day Prep', date: '2024-02-20', time: '2:00 PM', type: 'event', attendees: ['Alex', 'Sarah'] },
    { id: 3, title: 'Investor Meeting', date: '2024-02-25', time: '3:00 PM', type: 'meeting', attendees: ['Sarah'] }
  ]);

  const [nearbyEvents, setNearbyEvents] = useState([
    {
      id: 101,
      title: 'TechCrunch Startup Battlefield',
      description: 'Pitch your startup to top VCs and investors. Winners get $100K and media coverage.',
      date: '2024-03-15',
      time: '9:00 AM - 6:00 PM',
      type: 'pitch',
      category: 'Pitch Event',
      venue: 'Moscone Center',
      location: 'San Francisco, CA',
      distance: '2.3 miles',
      organizer: 'TechCrunch',
      attendees: 1250,
      registered: 847,
      price: 'Free',
      tags: ['Pitching', 'VCs', 'Investors', 'Startups'],
      image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800',
      featured: true
    },
    {
      id: 102,
      title: 'Founder & Investor Networking Mixer',
      description: 'Connect with fellow founders and angel investors over drinks and appetizers.',
      date: '2024-03-08',
      time: '6:00 PM - 9:00 PM',
      type: 'networking',
      category: 'Networking',
      venue: 'The Battery',
      location: 'San Francisco, CA',
      distance: '1.8 miles',
      organizer: 'SF Startup Network',
      attendees: 180,
      registered: 142,
      price: '$25',
      tags: ['Networking', 'Founders', 'Investors'],
      image: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=800',
      featured: false
    },
    {
      id: 103,
      title: 'Y Combinator Demo Day',
      description: 'Watch the latest YC batch present their startups. Great for inspiration and networking.',
      date: '2024-03-22',
      time: '10:00 AM - 5:00 PM',
      type: 'demo-day',
      category: 'Demo Day',
      venue: 'Computer History Museum',
      location: 'Mountain View, CA',
      distance: '18.5 miles',
      organizer: 'Y Combinator',
      attendees: 500,
      registered: 423,
      price: 'Free',
      tags: ['Demo Day', 'YC', 'Startups'],
      image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800',
      featured: true
    },
    {
      id: 104,
      title: 'AI Startup Summit 2024',
      description: 'Conference for AI startups featuring talks, workshops, and investor meetings.',
      date: '2024-03-20',
      time: '8:00 AM - 7:00 PM',
      type: 'conference',
      category: 'Conference',
      venue: 'Palace of Fine Arts',
      location: 'San Francisco, CA',
      distance: '3.1 miles',
      organizer: 'AI Startup Alliance',
      attendees: 2000,
      registered: 1650,
      price: '$199',
      tags: ['AI', 'Conference', 'Workshops', 'Investors'],
      image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800',
      featured: true
    },
    {
      id: 105,
      title: 'Pitch Practice Session',
      description: 'Practice your pitch and get feedback from experienced founders and investors.',
      date: '2024-03-12',
      time: '2:00 PM - 5:00 PM',
      type: 'workshop',
      category: 'Workshop',
      venue: 'WeWork Market Street',
      location: 'San Francisco, CA',
      distance: '0.9 miles',
      organizer: 'Pitch Perfect',
      attendees: 30,
      registered: 24,
      price: '$50',
      tags: ['Pitching', 'Workshop', 'Feedback'],
      image: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=800',
      featured: false
    },
    {
      id: 106,
      title: 'Women in Tech Networking',
      description: 'Monthly meetup for women founders and tech professionals to connect and share experiences.',
      date: '2024-03-10',
      time: '6:30 PM - 8:30 PM',
      type: 'networking',
      category: 'Networking',
      venue: 'Galvanize',
      location: 'San Francisco, CA',
      distance: '1.2 miles',
      organizer: 'Women in Tech SF',
      attendees: 120,
      registered: 98,
      price: 'Free',
      tags: ['Networking', 'Women', 'Tech'],
      image: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=800',
      featured: false
    }
  ]);

  const [eventFilters, setEventFilters] = useState({
    search: '',
    type: 'all',
    category: 'all',
    location: 'all',
    dateRange: 'upcoming',
    price: 'all'
  });

  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showEventDetails, setShowEventDetails] = useState(false);
  const [rsvpedEvents, setRsvpedEvents] = useState([]);

  const [startupJourney, setStartupJourney] = useState({
    currentStage: 'idea',
    stages: {
      idea: { name: 'Idea', progress: 100, completed: true, color: 'purple' },
      validation: { name: 'Validation', progress: 75, completed: false, color: 'blue' },
      mvp: { name: 'MVP Development', progress: 65, completed: false, color: 'green' },
      testing: { name: 'Testing & Iteration', progress: 30, completed: false, color: 'yellow' },
      launch: { name: 'Launch Preparation', progress: 20, completed: false, color: 'orange' },
      growth: { name: 'Post-Launch Growth', progress: 0, completed: false, color: 'pink' }
    }
  });

  const [launchChecklist, setLaunchChecklist] = useState([
    { id: 1, category: 'Product', title: 'All MVP features complete', completed: false, priority: 'high' },
    { id: 2, category: 'Product', title: 'Beta testing completed', completed: false, priority: 'high' },
    { id: 3, category: 'Product', title: 'Bug fixes and QA done', completed: false, priority: 'high' },
    { id: 4, category: 'Marketing', title: 'Website live and optimized', completed: false, priority: 'high' },
    { id: 5, category: 'Marketing', title: 'Social media accounts set up', completed: false, priority: 'medium' },
    { id: 6, category: 'Marketing', title: 'Press release prepared', completed: false, priority: 'medium' },
    { id: 7, category: 'Legal', title: 'Terms of Service & Privacy Policy', completed: false, priority: 'high' },
    { id: 8, category: 'Legal', title: 'Business registration complete', completed: false, priority: 'high' },
    { id: 9, category: 'Operations', title: 'Customer support system ready', completed: false, priority: 'medium' },
    { id: 10, category: 'Operations', title: 'Analytics and tracking set up', completed: false, priority: 'high' }
  ]);

  const [marketResearch, setMarketResearch] = useState({
    targetMarket: 'Remote teams (50M+ globally), SMBs with distributed workforce',
    marketSize: '$12B+ (Carbon management software market)',
    competitors: [
      { id: 1, name: 'Competitor A', strengths: 'Strong brand', weaknesses: 'High price', marketShare: '30%' },
      { id: 2, name: 'Competitor B', strengths: 'Good features', weaknesses: 'Poor UX', marketShare: '25%' },
      { id: 3, name: 'Competitor C', strengths: 'Low cost', weaknesses: 'Limited support', marketShare: '20%' }
    ],
    customerPersonas: [
      { id: 1, name: 'Tech Startup Founders', painPoints: ['Limited budget', 'Need fast results'], goals: ['Scale quickly', 'Attract investors'] },
      { id: 2, name: 'Remote Team Managers', painPoints: ['Team coordination', 'Productivity tracking'], goals: ['Improve efficiency', 'Better communication'] }
    ],
    pricingStrategy: 'Freemium with premium tiers',
    goToMarket: 'Product-led growth with content marketing'
  });

  const [customerInterviews, setCustomerInterviews] = useState([
    {
      id: 1,
      name: 'Sarah Johnson',
      role: 'CTO at TechCorp',
      date: '2024-02-15',
      status: 'completed',
      problemValidated: true,
      solutionFit: 'high',
      notes: 'Expressed strong interest in the solution. Main pain point is team coordination.',
      willingnessToPay: 'high',
      score: 9
    },
    {
      id: 2,
      name: 'Mike Chen',
      role: 'Founder at StartupXYZ',
      date: '2024-02-18',
      status: 'completed',
      problemValidated: true,
      solutionFit: 'medium',
      notes: 'Problem exists but solution needs refinement. Suggested additional features.',
      willingnessToPay: 'medium',
      score: 7
    },
    {
      id: 3,
      name: 'Emily Rodriguez',
      role: 'Product Manager',
      date: '2024-02-20',
      status: 'scheduled',
      problemValidated: false,
      solutionFit: null,
      notes: '',
      willingnessToPay: null,
      score: null
    }
  ]);

  const [validationScorecard, setValidationScorecard] = useState({
    problemValidation: 85,
    solutionFit: 75,
    marketSize: 90,
    competition: 70,
    businessModel: 80,
    teamReadiness: 85
  });

  const [problemSolutionFit, setProblemSolutionFit] = useState({
    problem: {
      description: 'Teams struggle with remote collaboration and productivity tracking',
      severity: 8,
      frequency: 'daily',
      currentSolutions: ['Email', 'Slack', 'Zoom'],
      painLevel: 9
    },
    solution: {
      description: 'AI-powered collaboration platform with real-time insights',
      uniqueness: 8,
      feasibility: 7,
      cost: 6,
      timeToMarket: 7
    },
    fit: 85
  });

  const [valueProposition, setValueProposition] = useState({
    customerJobs: ['Manage remote teams', 'Track productivity', 'Improve collaboration'],
    pains: ['Lack of visibility', 'Poor communication', 'Low engagement'],
    painRelievers: ['Real-time dashboards', 'Automated insights', 'Seamless integration'],
    gainCreators: ['Increased productivity', 'Better team alignment', 'Data-driven decisions'],
    products: ['AI dashboard', 'Analytics engine', 'Integration suite']
  });

  const [businessModel, setBusinessModel] = useState({
    valueProposition: 'AI-powered collaboration for remote teams',
    customerSegments: ['Tech startups', 'Remote teams', 'SMBs'],
    channels: ['Website', 'Content marketing', 'Partnerships'],
    customerRelationships: ['Self-service', 'Community', 'Support'],
    revenueStreams: ['Subscription', 'Enterprise licenses', 'API access'],
    keyResources: ['AI technology', 'Team expertise', 'Customer data'],
    keyActivities: ['Product development', 'Marketing', 'Customer support'],
    keyPartners: ['Cloud providers', 'Integration partners', 'Investors'],
    costStructure: ['Development', 'Infrastructure', 'Marketing', 'Support']
  });

  const [validationChecklist, setValidationChecklist] = useState([
    { id: 1, category: 'Problem', item: 'Problem is clearly defined and understood', completed: true, priority: 'high' },
    { id: 2, category: 'Problem', item: 'Target customers experience this problem frequently', completed: true, priority: 'high' },
    { id: 3, category: 'Problem', item: 'Customers are actively seeking a solution', completed: true, priority: 'high' },
    { id: 4, category: 'Solution', item: 'Solution addresses the core problem effectively', completed: true, priority: 'high' },
    { id: 5, category: 'Solution', item: 'Solution is technically feasible', completed: true, priority: 'high' },
    { id: 6, category: 'Solution', item: 'Solution is 10x better than alternatives', completed: false, priority: 'medium' },
    { id: 7, category: 'Market', item: 'Market size is large enough ($1B+)', completed: true, priority: 'high' },
    { id: 8, category: 'Market', item: 'Market is growing or stable', completed: true, priority: 'high' },
    { id: 9, category: 'Business Model', item: 'Clear path to revenue', completed: true, priority: 'high' },
    { id: 10, category: 'Business Model', item: 'Unit economics are positive', completed: false, priority: 'high' },
    { id: 11, category: 'Competition', item: 'Competitive advantage is sustainable', completed: false, priority: 'medium' },
    { id: 12, category: 'Team', item: 'Team has necessary skills to execute', completed: true, priority: 'high' }
  ]);

  const [interviewQuestions, setInterviewQuestions] = useState([
    { id: 1, category: 'Problem Discovery', question: 'What is the biggest challenge you face in your role?', asked: 8, validated: 7 },
    { id: 2, category: 'Problem Discovery', question: 'How often do you encounter this problem?', asked: 8, validated: 8 },
    { id: 3, category: 'Problem Discovery', question: 'What have you tried to solve this problem?', asked: 8, validated: 6 },
    { id: 4, category: 'Solution Validation', question: 'Would this solution solve your problem?', asked: 5, validated: 4 },
    { id: 5, category: 'Solution Validation', question: 'How much would you pay for this solution?', asked: 5, validated: 3 },
    { id: 6, category: 'Solution Validation', question: 'What features are most important to you?', asked: 5, validated: 5 }
  ]);

  const [marketSizeData, setMarketSizeData] = useState({
    tam: 50000000000, // Total Addressable Market
    sam: 5000000000,  // Serviceable Addressable Market
    som: 50000000,    // Serviceable Obtainable Market
    growthRate: 15,
    marketTrend: 'growing'
  });

  const [risks, setRisks] = useState([
    { id: 1, category: 'Market', description: 'Market may not be ready', probability: 'medium', impact: 'high', mitigation: 'Early adopter focus', status: 'monitoring' },
    { id: 2, category: 'Technology', description: 'Technical complexity', probability: 'low', impact: 'medium', mitigation: 'MVP approach', status: 'mitigated' },
    { id: 3, category: 'Competition', description: 'Strong competitors', probability: 'high', impact: 'medium', mitigation: 'Differentiation strategy' }
  ]);

  const [showInterviewModal, setShowInterviewModal] = useState(false);
  const [selectedInterview, setSelectedInterview] = useState(null);
  const [showCompetitorModal, setShowCompetitorModal] = useState(false);
  const [selectedCompetitor, setSelectedCompetitor] = useState(null);

  const [metrics, setMetrics] = useState({
    users: 0,
    revenue: 0,
    growth: 0,
    retention: 0,
    mrr: 0,
    cac: 0,
    ltv: 0
  });

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'validation', label: 'Validation', icon: Target },
    { id: 'milestones', label: 'Milestones', icon: CheckCircle },
    { id: 'team', label: 'Team', icon: Users },
    { id: 'mvp', label: 'MVP', icon: Rocket },
    { id: 'events', label: 'Events', icon: Calendar },
    { id: 'profile', label: 'Profile', icon: Globe }
  ];

  const handleAddTask = () => {
    if (newTask.title.trim()) {
      const task = {
        id: Date.now(),
        title: newTask.title,
        description: newTask.description,
        assignee: newTask.assignee,
        status: 'todo',
        priority: newTask.priority
      };
      setStartupData(prev => ({
        ...prev,
        tasks: [...prev.tasks, task]
      }));
      setNewTask({ title: '', description: '', assignee: '', priority: 'medium' });
      setShowAddTask(false);
    }
  };

  const handleTaskStatusChange = (taskId, newStatus) => {
    setStartupData(prev => ({
      ...prev,
      tasks: prev.tasks.map(task => 
        task.id === taskId ? { ...task, status: newStatus } : task
      )
    }));
  };

  const handleDeleteTask = (taskId) => {
    setStartupData(prev => ({
      ...prev,
      tasks: prev.tasks.filter(task => task.id !== taskId)
    }));
  };

  const handleEditTask = (task) => {
    setSelectedTask(task);
    setShowTaskModal(true);
  };

  const handleUpdateTask = () => {
    if (editingTask && newTask.title.trim()) {
      setStartupData(prev => ({
        ...prev,
        tasks: prev.tasks.map(task => 
          task.id === editingTask.id 
            ? { ...task, ...newTask }
            : task
        )
      }));
      setEditingTask(null);
      setNewTask({ title: '', description: '', assignee: '', priority: 'medium' });
      setShowAddTask(false);
    }
  };

  const handleUpdateTaskFromModal = (updatedTask) => {
    setStartupData(prev => ({
      ...prev,
      tasks: prev.tasks.map(task => 
        task.id === updatedTask.id ? updatedTask : task
      )
    }));
    setSelectedTask(updatedTask);
  };

  const handleDragStart = (e, task) => {
    setDraggedTask(task);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e, newStatus) => {
    e.preventDefault();
    if (draggedTask) {
      handleTaskStatusChange(draggedTask.id, newStatus);
      setDraggedTask(null);
    }
  };

  const renderBuild = () => (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Build</h2>
      </div>

      {/* Vision Board */}
      <div className="bg-white rounded-2xl p-8 shadow-lg">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 bg-black rounded-xl flex items-center justify-center">
            <Target className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-gray-900">Vision Board</h3>
            <p className="text-gray-600">Problem, Solution, Market, Roadmap</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Problem Section */}
          <div className="bg-gray-50 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
                <AlertCircle className="w-4 h-4 text-white" />
              </div>
              <h4 className="text-lg font-semibold text-gray-900">Problem</h4>
            </div>
            <textarea
              placeholder="What problem are you solving? Who has this problem? How big is the market?"
              className="w-full h-24 p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent resize-none"
              defaultValue="Remote teams struggle with inefficient workflow management, leading to 40% productivity loss and poor collaboration across time zones."
            />
          </div>

          {/* Solution Section */}
          <div className="bg-gray-50 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 bg-gray-600 rounded-lg flex items-center justify-center">
                <Zap className="w-4 h-4 text-white" />
              </div>
              <h4 className="text-lg font-semibold text-gray-900">Solution</h4>
            </div>
            <textarea
              placeholder="How does your product solve this problem? What makes it unique?"
              className="w-full h-24 p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent resize-none"
              defaultValue="AI-powered workflow automation platform that intelligently assigns tasks, optimizes schedules, and facilitates seamless collaboration across distributed teams."
            />
          </div>

          {/* Market Section */}
          <div className="bg-gray-50 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 bg-gray-700 rounded-lg flex items-center justify-center">
                <Globe className="w-4 h-4 text-white" />
              </div>
              <h4 className="text-lg font-semibold text-gray-900">Market</h4>
            </div>
            <div className="space-y-3">
              <input
                type="text"
                placeholder="Target Market (e.g., Remote teams, SMBs, Enterprise)"
                className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent"
                defaultValue="Remote teams (50M+ globally), SMBs with distributed workforce"
              />
              <input
                type="text"
                placeholder="Market Size (e.g., $50B TAM, $5B SAM)"
                className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent"
                defaultValue="$50B TAM, $5B SAM"
              />
            </div>
          </div>

          {/* Roadmap Section */}
          <div className="bg-gray-50 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 bg-gray-800 rounded-lg flex items-center justify-center">
                <Target className="w-4 h-4 text-white" />
              </div>
              <h4 className="text-lg font-semibold text-gray-900">Roadmap</h4>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2 p-2 bg-white rounded-lg">
                <CheckCircle className="w-4 h-4 text-black" />
                <span className="text-sm font-medium">Q1: MVP Development</span>
              </div>
              <div className="flex items-center gap-2 p-2 bg-white rounded-lg">
                <Clock className="w-4 h-4 text-gray-400" />
                <span className="text-sm font-medium">Q2: Beta Testing</span>
              </div>
              <div className="flex items-center gap-2 p-2 bg-white rounded-lg">
                <Clock className="w-4 h-4 text-gray-400" />
                <span className="text-sm font-medium">Q3: Launch</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Roles & Equity */}
      <div className="bg-white rounded-2xl p-8 shadow-lg">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 bg-gray-600 rounded-xl flex items-center justify-center">
            <Users className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-gray-900">Roles & Equity</h3>
            <p className="text-gray-600">Role definitions, equity calculator, founder agreement templates</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Equity Calculator */}
          <div className="bg-gray-50 rounded-xl p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
                <Calculator className="w-4 h-4 text-white" />
              </div>
              <h4 className="text-xl font-semibold text-gray-900">Equity Calculator</h4>
            </div>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Your Contribution</label>
                <select className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent bg-white text-gray-900 font-medium">
                  <option>Idea + Technical Development (40%)</option>
                  <option>Idea + Business Development (35%)</option>
                  <option>Technical Development Only (25%)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Cofounder Contribution</label>
                <select className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent bg-white text-gray-900 font-medium">
                  <option>Technical Development (30%)</option>
                  <option>Business Development (35%)</option>
                  <option>Idea + Technical (40%)</option>
                </select>
              </div>
              <div className="p-6 bg-white rounded-xl border-2 border-gray-200">
                <div className="space-y-4">
                  <div className="flex justify-between items-center py-3 border-b border-gray-100">
                    <span className="text-lg font-medium text-gray-700">Your Equity</span>
                    <span className="text-2xl font-bold text-black">40%</span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b border-gray-100">
                    <span className="text-lg font-medium text-gray-700">Cofounder Equity</span>
                    <span className="text-2xl font-bold text-gray-600">35%</span>
                  </div>
                  <div className="flex justify-between items-center py-3">
                    <span className="text-lg font-medium text-gray-700">Employee Pool</span>
                    <span className="text-2xl font-bold text-gray-500">25%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Role Definition */}
          <div className="bg-gray-50 rounded-xl p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 bg-gray-600 rounded-lg flex items-center justify-center">
                <Users className="w-4 h-4 text-white" />
              </div>
              <h4 className="text-xl font-semibold text-gray-900">Role Definition</h4>
            </div>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Your Role</label>
                <input
                  type="text"
                  placeholder="e.g., CEO, CTO, COO"
                  className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent bg-white text-gray-900 font-medium"
                  defaultValue="CEO & Technical Lead"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Cofounder Role</label>
                <input
                  type="text"
                  placeholder="e.g., CTO, COO, CMO"
                  className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent bg-white text-gray-900 font-medium"
                  defaultValue="COO & Business Lead"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Responsibilities</label>
                <textarea
                  placeholder="Define clear responsibilities for each role..."
                  className="w-full h-24 p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent resize-none bg-white text-gray-900 font-medium"
                  defaultValue="CEO: Product vision, fundraising, strategic partnerships\nCOO: Operations, sales, marketing, customer success"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Founder Agreement Templates */}
        <div className="mt-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Founder Agreement Templates</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button className="p-4 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors text-left">
              <h5 className="font-semibold text-gray-900 mb-2">Basic Agreement</h5>
              <p className="text-sm text-gray-600">Simple equity split and role definition</p>
            </button>
            <button className="p-4 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors text-left">
              <h5 className="font-semibold text-gray-900 mb-2">Vesting Schedule</h5>
              <p className="text-sm text-gray-600">4-year vesting with 1-year cliff</p>
            </button>
            <button className="p-4 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors text-left">
              <h5 className="font-semibold text-gray-900 mb-2">Full Legal</h5>
              <p className="text-sm text-gray-600">Comprehensive founder agreement</p>
            </button>
          </div>
        </div>
      </div>

      {/* Docs & Legal */}
      <div className="bg-white rounded-2xl p-8 shadow-lg">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 bg-gray-700 rounded-xl flex items-center justify-center">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-gray-900">Docs & Legal</h3>
            <p className="text-gray-600">NDA, incorporation guide, IP assignment, privacy/ToS templates</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-gray-50 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
                <Shield className="w-4 h-4 text-white" />
              </div>
              <h4 className="font-semibold text-gray-900">NDA Template</h4>
            </div>
            <p className="text-gray-600 text-sm mb-4">Mutual non-disclosure agreement</p>
            <button className="w-full px-4 py-3 bg-black text-white rounded-xl hover:bg-gray-800 transition-all duration-200 flex items-center justify-center gap-2 font-medium shadow-sm hover:shadow-md">
              <Download className="w-4 h-4" />
              Download
            </button>
          </div>

          <div className="bg-gray-50 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 bg-gray-600 rounded-lg flex items-center justify-center">
                <Building2 className="w-4 h-4 text-white" />
              </div>
              <h4 className="font-semibold text-gray-900">Incorporation Guide</h4>
            </div>
            <p className="text-gray-600 text-sm mb-4">Step-by-step incorporation process</p>
            <button className="w-full px-4 py-3 bg-black text-white rounded-xl hover:bg-gray-800 transition-all duration-200 flex items-center justify-center gap-2 font-medium shadow-sm hover:shadow-md">
              <FileText className="w-4 h-4" />
              View Guide
            </button>
          </div>

          <div className="bg-gray-50 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 bg-gray-700 rounded-lg flex items-center justify-center">
                <Key className="w-4 h-4 text-white" />
              </div>
              <h4 className="font-semibold text-gray-900">IP Assignment</h4>
            </div>
            <p className="text-gray-600 text-sm mb-4">Intellectual property assignment</p>
            <button className="w-full px-4 py-3 bg-black text-white rounded-xl hover:bg-gray-800 transition-all duration-200 flex items-center justify-center gap-2 font-medium shadow-sm hover:shadow-md">
              <Download className="w-4 h-4" />
              Download
            </button>
          </div>

          <div className="bg-gray-50 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 bg-gray-800 rounded-lg flex items-center justify-center">
                <Lock className="w-4 h-4 text-white" />
              </div>
              <h4 className="font-semibold text-gray-900">Privacy Policy</h4>
            </div>
            <p className="text-gray-600 text-sm mb-4">GDPR-compliant privacy policy</p>
            <button className="w-full px-4 py-3 bg-black text-white rounded-xl hover:bg-gray-800 transition-all duration-200 flex items-center justify-center gap-2 font-medium shadow-sm hover:shadow-md">
              <Download className="w-4 h-4" />
              Download
            </button>
          </div>

          <div className="bg-gray-50 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 bg-gray-900 rounded-lg flex items-center justify-center">
                <FileText className="w-4 h-4 text-white" />
              </div>
              <h4 className="font-semibold text-gray-900">Terms of Service</h4>
            </div>
            <p className="text-gray-600 text-sm mb-4">Standard terms of service</p>
            <button className="w-full px-4 py-3 bg-black text-white rounded-xl hover:bg-gray-800 transition-all duration-200 flex items-center justify-center gap-2 font-medium shadow-sm hover:shadow-md">
              <Download className="w-4 h-4" />
              Download
            </button>
          </div>

          <div className="bg-gray-50 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
                <Users className="w-4 h-4 text-white" />
              </div>
              <h4 className="font-semibold text-gray-900">Founder Agreement</h4>
            </div>
            <p className="text-gray-600 text-sm mb-4">Comprehensive founder agreement</p>
            <button className="w-full px-4 py-3 bg-black text-white rounded-xl hover:bg-gray-800 transition-all duration-200 flex items-center justify-center gap-2 font-medium shadow-sm hover:shadow-md">
              <Download className="w-4 h-4" />
              Download
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderExecute = () => (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Execute</h2>
      </div>

      {/* Task Manager */}
      <div className="bg-white rounded-2xl p-8 shadow-lg">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-black rounded-xl flex items-center justify-center">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900">Task Manager</h3>
              <p className="text-gray-600">Notion-lite board (To Do, In Progress, Review, Done)</p>
            </div>
          </div>
          <button 
            onClick={() => {
              setEditingTask(null);
              setNewTask({ title: '', description: '', assignee: '', priority: 'medium' });
              setShowAddTask(!showAddTask);
            }}
            className="px-6 py-3 bg-black text-white rounded-xl hover:bg-gray-800 transition-colors flex items-center gap-2 font-medium"
          >
            <Plus className="w-4 h-4" />
            Add Task
          </button>
        </div>

        {/* Add/Edit Task Form */}
        {showAddTask && (
          <div className="mb-6 p-6 bg-gray-50 rounded-xl">
            <h4 className="text-lg font-semibold text-gray-900 mb-4">
              {editingTask ? 'Edit Task' : 'Add New Task'}
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Task Title</label>
                <input
                  type="text"
                  value={newTask.title}
                  onChange={(e) => setNewTask({...newTask, title: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent"
                  placeholder="Enter task title"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Assignee</label>
                <select
                  value={newTask.assignee}
                  onChange={(e) => setNewTask({...newTask, assignee: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent"
                >
                  <option value="">Select assignee</option>
                  <option value="Alex">Alex</option>
                  <option value="Sarah">Sarah</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  value={newTask.description}
                  onChange={(e) => setNewTask({...newTask, description: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent"
                  placeholder="Enter task description"
                  rows="3"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
                <select
                  value={newTask.priority}
                  onChange={(e) => setNewTask({...newTask, priority: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
            </div>
            <div className="flex gap-3 mt-4">
              <button
                onClick={editingTask ? handleUpdateTask : handleAddTask}
                className="px-4 py-2 bg-black text-white rounded-xl hover:bg-gray-800 transition-colors"
              >
                {editingTask ? 'Update Task' : 'Add Task'}
              </button>
              <button
                onClick={() => {
                  setShowAddTask(false);
                  setEditingTask(null);
                  setNewTask({ title: '', description: '', assignee: '', priority: 'medium' });
                }}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Task Board */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {['todo', 'in-progress', 'review', 'done'].map((status) => {
            const statusTasks = startupData.tasks.filter(task => task.status === status);
            const statusLabels = {
              'todo': 'To Do',
              'in-progress': 'In Progress',
              'review': 'Review',
              'done': 'Done'
            };
            
            return (
              <div 
                key={status} 
                className="bg-gray-50 rounded-xl p-6 min-h-[400px]"
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, status)}
              >
                <h4 className="font-semibold text-gray-900 mb-4">{statusLabels[status]}</h4>
                <div className="space-y-3">
                  {statusTasks.map((task) => (
                    <div 
                      key={task.id} 
                      className="p-4 bg-white rounded-xl group cursor-pointer hover:shadow-md transition-all duration-200 border border-gray-200 hover:border-gray-300"
                      draggable
                      onDragStart={(e) => handleDragStart(e, task)}
                      onClick={() => handleEditTask(task)}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <h5 className="font-medium text-gray-900 text-sm leading-tight">{task.title}</h5>
                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteTask(task.id);
                            }}
                            className="p-1 text-gray-400 hover:text-red-500 transition-colors rounded"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                      {task.description && (
                        <p className="text-xs text-gray-600 mb-3 line-clamp-2">{task.description}</p>
                      )}
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500 font-medium">{task.assignee}</span>
                        <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                          task.priority === 'high' ? 'bg-red-100 text-red-700' :
                          task.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-green-100 text-green-700'
                        }`}>
                          {task.priority}
                        </span>
                      </div>
                    </div>
                  ))}
                  {statusTasks.length === 0 && (
                    <div className="text-center py-8 text-gray-400 text-sm">
                      Drop tasks here
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Task Popup Modal */}
      {showTaskModal && selectedTask && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-gray-900">Task Details</h3>
                <button
                  onClick={() => setShowTaskModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Task Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Task Title</label>
                <input
                  type="text"
                  value={selectedTask.title}
                  onChange={(e) => setSelectedTask({...selectedTask, title: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent"
                />
              </div>

              {/* Task Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  value={selectedTask.description}
                  onChange={(e) => setSelectedTask({...selectedTask, description: e.target.value})}
                  className="w-full h-24 p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent resize-none"
                  placeholder="Add task description..."
                />
              </div>

              {/* Assignee and Priority */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Assignee</label>
                  <input
                    type="text"
                    value={selectedTask.assignee}
                    onChange={(e) => setSelectedTask({...selectedTask, assignee: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent"
                    placeholder="Who's responsible?"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
                  <select
                    value={selectedTask.priority}
                    onChange={(e) => setSelectedTask({...selectedTask, priority: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
              </div>

              {/* Status */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                <select
                  value={selectedTask.status}
                  onChange={(e) => setSelectedTask({...selectedTask, status: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent"
                >
                  <option value="todo">To Do</option>
                  <option value="in-progress">In Progress</option>
                  <option value="review">Review</option>
                  <option value="done">Done</option>
                </select>
              </div>

              {/* Task Info */}
              <div className="bg-gray-50 rounded-xl p-4">
                <h4 className="font-medium text-gray-900 mb-3">Task Information</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Created:</span>
                    <span className="ml-2 font-medium">{new Date(selectedTask.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">ID:</span>
                    <span className="ml-2 font-medium text-gray-500">#{selectedTask.id}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="p-6 border-t border-gray-200 flex gap-3">
              <button
                onClick={() => {
                  handleUpdateTaskFromModal(selectedTask);
                  setShowTaskModal(false);
                }}
                className="px-6 py-3 bg-black text-white rounded-xl hover:bg-gray-800 transition-colors font-medium"
              >
                Save Changes
              </button>
              <button
                onClick={() => {
                  handleDeleteTask(selectedTask.id);
                  setShowTaskModal(false);
                }}
                className="px-6 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors font-medium"
              >
                Delete Task
              </button>
              <button
                onClick={() => setShowTaskModal(false)}
                className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors font-medium"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Milestones Engine */}
      <div className="bg-white rounded-2xl p-8 shadow-lg">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 bg-gray-600 rounded-xl flex items-center justify-center">
            <CheckCircle className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-gray-900">Milestones Engine</h3>
            <p className="text-gray-600">30-day sprints: Alignment → Validation → Prototype → Pitch</p>
          </div>
        </div>

        {/* Current Sprint */}
        <div className="bg-gray-50 rounded-xl p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
                <Zap className="w-4 h-4 text-white" />
              </div>
              <div>
                <h4 className="text-lg font-semibold text-gray-900">Current Sprint</h4>
                <p className="text-gray-600">Sprint 1: Foundation & Alignment</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">Days Remaining</p>
              <p className="text-2xl font-bold text-black">12</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-white rounded-xl">
              <h5 className="font-semibold text-gray-900 mb-2">Alignment</h5>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-black" />
                  <span className="text-sm">Define vision & values</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-black" />
                  <span className="text-sm">Set communication norms</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-500">Create working agreement</span>
                </div>
              </div>
            </div>
            
            <div className="p-4 bg-white rounded-xl">
              <h5 className="font-semibold text-gray-900 mb-2">Validation</h5>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-black" />
                  <span className="text-sm">Customer interviews (5)</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-500">Market research</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-500">Competitor analysis</span>
                </div>
              </div>
            </div>
            
            <div className="p-4 bg-white rounded-xl">
              <h5 className="font-semibold text-gray-900 mb-2">Prototype</h5>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-500">Wireframes</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-500">MVP features</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-500">Technical architecture</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Upcoming Sprints */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gray-50 rounded-xl p-6">
            <h4 className="text-lg font-semibold text-gray-900 mb-4">Sprint 2: MVP Development</h4>
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 bg-white rounded-xl">
                <div className="w-6 h-6 bg-gray-400 rounded-full"></div>
                <span className="text-sm">Build core features</span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-white rounded-xl">
                <div className="w-6 h-6 bg-gray-400 rounded-full"></div>
                <span className="text-sm">User testing</span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-white rounded-xl">
                <div className="w-6 h-6 bg-gray-400 rounded-full"></div>
                <span className="text-sm">Iterate based on feedback</span>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 rounded-xl p-6">
            <h4 className="text-lg font-semibold text-gray-900 mb-4">Sprint 3: Pitch Readiness</h4>
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 bg-white rounded-xl">
                <div className="w-6 h-6 bg-gray-400 rounded-full"></div>
                <span className="text-sm">Pitch deck creation</span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-white rounded-xl">
                <div className="w-6 h-6 bg-gray-400 rounded-full"></div>
                <span className="text-sm">Financial projections</span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-white rounded-xl">
                <div className="w-6 h-6 bg-gray-400 rounded-full"></div>
                <span className="text-sm">Investor outreach</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Team View */}
      <div className="bg-white rounded-2xl p-8 shadow-lg">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 bg-gray-700 rounded-xl flex items-center justify-center">
            <Users className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-gray-900">Team View</h3>
            <p className="text-gray-600">Active members, roles, skills, status</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {startupData.cofounders.map((cofounder) => (
            <div key={cofounder.id} className="bg-gray-50 rounded-xl p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-black rounded-xl flex items-center justify-center">
                  <span className="text-white font-semibold">
                    {cofounder.name.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-gray-900">{cofounder.name}</h4>
                  <p className="text-gray-600">{cofounder.role}</p>
                </div>
              </div>
              
              <div className="space-y-3">
                <div>
                  <h5 className="text-sm font-medium text-gray-700 mb-2">Skills</h5>
                  <div className="flex flex-wrap gap-2">
                    {cofounder.skills.map((skill, index) => (
                      <span key={index} className="px-2 py-1 bg-white text-gray-700 text-xs rounded-full">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${cofounder.status === 'active' ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                  <span className="text-sm text-gray-600 capitalize">{cofounder.status}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderFund = () => (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Fund</h2>
      </div>

      {/* Funding Tracker */}
      <div className="bg-white rounded-2xl p-8 shadow-lg">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 bg-black rounded-xl flex items-center justify-center">
            <DollarSign className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-gray-900">Funding Tracker</h3>
            <p className="text-gray-600">Committed $, investor pipeline, target raise</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gray-50 rounded-xl p-6">
            <h4 className="text-lg font-semibold text-gray-900 mb-2">Raised</h4>
            <p className="text-3xl font-bold text-black">${startupData.funding.raised.toLocaleString()}</p>
            <p className="text-sm text-gray-600">of ${startupData.funding.target.toLocaleString()} target</p>
          </div>
          <div className="bg-gray-50 rounded-xl p-6">
            <h4 className="text-lg font-semibold text-gray-900 mb-2">Next Round</h4>
            <p className="text-2xl font-bold text-gray-600">{startupData.funding.nextRound}</p>
            <p className="text-sm text-gray-600">Target: $500K</p>
          </div>
          <div className="bg-gray-50 rounded-xl p-6">
            <h4 className="text-lg font-semibold text-gray-900 mb-2">Investors</h4>
            <p className="text-2xl font-bold text-gray-600">{startupData.funding.investors.length}</p>
            <p className="text-sm text-gray-600">Active conversations</p>
          </div>
        </div>
      </div>

      {/* Pitch Readiness */}
      <div className="bg-white rounded-2xl p-8 shadow-lg">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 bg-gray-600 rounded-xl flex items-center justify-center">
            <Target className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-gray-900">Pitch Readiness</h3>
            <p className="text-gray-600">Deck upload, financial projections, validation checklist</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gray-50 rounded-xl p-6">
            <h4 className="text-lg font-semibold text-gray-900 mb-4">Pitch Deck</h4>
            <div className="space-y-4">
              <div className="p-4 bg-white rounded-xl border-2 border-dashed border-gray-300">
                <div className="text-center">
                  <FileText className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">Upload your pitch deck</p>
                  <button className="mt-2 px-4 py-2 bg-black text-white rounded-xl hover:bg-gray-800 transition-colors">
                    Choose File
                  </button>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-black" />
                  <span className="text-sm">Problem & Solution defined</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-black" />
                  <span className="text-sm">Market size validated</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-500">Financial projections ready</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 rounded-xl p-6">
            <h4 className="text-lg font-semibold text-gray-900 mb-4">Financial Projections</h4>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Revenue (Year 1)</label>
                <input
                  type="text"
                  placeholder="$100K"
                  className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Growth Rate</label>
                <input
                  type="text"
                  placeholder="300%"
                  className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Burn Rate</label>
                <input
                  type="text"
                  placeholder="$15K/month"
                  className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Investor Room */}
      <div className="bg-white rounded-2xl p-8 shadow-lg">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 bg-gray-700 rounded-xl flex items-center justify-center">
            <Users className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-gray-900">Investor Room</h3>
            <p className="text-gray-600">Data room, demo day access, 1-click intros</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gray-50 rounded-xl p-6">
            <h4 className="text-lg font-semibold text-gray-900 mb-4">Data Room</h4>
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 bg-white rounded-xl">
                <FileText className="w-5 h-5 text-gray-600" />
                <span className="text-sm">Financial Model</span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-white rounded-xl">
                <FileText className="w-5 h-5 text-gray-600" />
                <span className="text-sm">Market Analysis</span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-white rounded-xl">
                <FileText className="w-5 h-5 text-gray-600" />
                <span className="text-sm">Team Bios</span>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 rounded-xl p-6">
            <h4 className="text-lg font-semibold text-gray-900 mb-4">Demo Day Access</h4>
            <div className="space-y-3">
              <div className="p-3 bg-white rounded-xl">
                <h5 className="font-medium text-gray-900">TechCrunch Disrupt</h5>
                <p className="text-sm text-gray-600">March 15, 2024</p>
                <span className="inline-block mt-2 px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                  Confirmed
                </span>
              </div>
              <div className="p-3 bg-white rounded-xl">
                <h5 className="font-medium text-gray-900">Y Combinator Demo Day</h5>
                <p className="text-sm text-gray-600">April 20, 2024</p>
                <span className="inline-block mt-2 px-2 py-1 bg-yellow-100 text-yellow-700 text-xs rounded-full">
                  Pending
                </span>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 rounded-xl p-6">
            <h4 className="text-lg font-semibold text-gray-900 mb-4">1-Click Intros</h4>
            <div className="space-y-3">
              <button className="w-full p-3 bg-white rounded-xl hover:bg-gray-50 transition-colors text-left">
                <h5 className="font-medium text-gray-900">Sequoia Capital</h5>
                <p className="text-sm text-gray-600">Request introduction</p>
              </button>
              <button className="w-full p-3 bg-white rounded-xl hover:bg-gray-50 transition-colors text-left">
                <h5 className="font-medium text-gray-900">Andreessen Horowitz</h5>
                <p className="text-sm text-gray-600">Request introduction</p>
              </button>
              <button className="w-full p-3 bg-white rounded-xl hover:bg-gray-50 transition-colors text-left">
                <h5 className="font-medium text-gray-900">Accel Partners</h5>
                <p className="text-sm text-gray-600">Request introduction</p>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Launch Dashboard */}
      <div className="bg-white rounded-2xl p-8 shadow-lg">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 bg-gray-800 rounded-xl flex items-center justify-center">
            <Rocket className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-gray-900">Launch Dashboard</h3>
            <p className="text-gray-600">When teams graduate to public product + funding stage</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gray-50 rounded-xl p-6">
            <h4 className="text-lg font-semibold text-gray-900 mb-4">Launch Readiness</h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700">Product MVP</span>
                <div className="flex items-center gap-2">
                  <div className="w-16 h-2 bg-gray-200 rounded-full">
                    <div className="w-3/4 h-2 bg-black rounded-full"></div>
                  </div>
                  <span className="text-sm font-medium">75%</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700">Legal Setup</span>
                <div className="flex items-center gap-2">
                  <div className="w-16 h-2 bg-gray-200 rounded-full">
                    <div className="w-1/2 h-2 bg-gray-600 rounded-full"></div>
                  </div>
                  <span className="text-sm font-medium">50%</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700">Marketing</span>
                <div className="flex items-center gap-2">
                  <div className="w-16 h-2 bg-gray-200 rounded-full">
                    <div className="w-1/4 h-2 bg-gray-400 rounded-full"></div>
                  </div>
                  <span className="text-sm font-medium">25%</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 rounded-xl p-6">
            <h4 className="text-lg font-semibold text-gray-900 mb-4">Next Steps</h4>
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 bg-white rounded-xl">
                <div className="w-6 h-6 bg-black rounded-full flex items-center justify-center">
                  <span className="text-white text-xs">1</span>
                </div>
                <span className="text-sm">Complete MVP development</span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-white rounded-xl">
                <div className="w-6 h-6 bg-gray-400 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs">2</span>
                </div>
                <span className="text-sm text-gray-500">Beta testing with 100 users</span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-white rounded-xl">
                <div className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs">3</span>
                </div>
                <span className="text-sm text-gray-500">Public launch announcement</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderHub = () => (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Hub</h2>
      </div>

      {/* Community Feed */}
      <div className="bg-white rounded-2xl p-8 shadow-lg">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 bg-black rounded-xl flex items-center justify-center">
            <Users className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-gray-900">Community Feed</h3>
            <p className="text-gray-600">Success stories, AMAs, events, guilds (AI, fintech, etc)</p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-gray-50 rounded-xl p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-10 h-10 bg-gray-600 rounded-xl flex items-center justify-center">
                <span className="text-white font-semibold">AC</span>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900">Alex Chen</h4>
                <p className="text-sm text-gray-600">2 hours ago</p>
              </div>
            </div>
            <p className="text-gray-700 mb-4">Just closed our seed round! $500K from Sequoia. The key was having a clear vision and strong cofounder alignment. Thanks to this platform for helping us find each other! 🚀</p>
            <div className="flex items-center gap-4">
              <button className="flex items-center gap-2 text-gray-600 hover:text-black transition-colors">
                <ThumbsUp className="w-4 h-4" />
                <span className="text-sm">24</span>
              </button>
              <button className="flex items-center gap-2 text-gray-600 hover:text-black transition-colors">
                <MessageCircle className="w-4 h-4" />
                <span className="text-sm">8</span>
              </button>
            </div>
          </div>

          <div className="bg-gray-50 rounded-xl p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-10 h-10 bg-gray-700 rounded-xl flex items-center justify-center">
                <span className="text-white font-semibold">SM</span>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900">Sarah Martinez</h4>
                <p className="text-sm text-gray-600">5 hours ago</p>
              </div>
            </div>
            <p className="text-gray-700 mb-4">AMA: Ask me anything about B2B sales for early-stage startups. I've helped 3 companies reach $1M ARR. Drop your questions below!</p>
            <div className="flex items-center gap-4">
              <button className="flex items-center gap-2 text-gray-600 hover:text-black transition-colors">
                <ThumbsUp className="w-4 h-4" />
                <span className="text-sm">42</span>
              </button>
              <button className="flex items-center gap-2 text-gray-600 hover:text-black transition-colors">
                <MessageCircle className="w-4 h-4" />
                <span className="text-sm">15</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* AI Copilot */}
      <div className="bg-white rounded-2xl p-8 shadow-lg">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 bg-gray-600 rounded-xl flex items-center justify-center">
            <Zap className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-gray-900">AI Copilot</h3>
            <p className="text-gray-600">Nudges, smart matching, pitch feedback</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-gray-50 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
                <Bell className="w-4 h-4 text-white" />
              </div>
              <h4 className="text-lg font-semibold text-gray-900">Smart Nudges</h4>
            </div>
            <p className="text-gray-700 mb-4">You're 60% aligned on pace—sync with Sarah this week to discuss sprint priorities and resolve any blockers.</p>
            <button className="px-4 py-2 bg-black text-white rounded-xl hover:bg-gray-800 transition-colors">
              Schedule Sync
            </button>
          </div>

          <div className="bg-gray-50 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 bg-gray-600 rounded-lg flex items-center justify-center">
                <Target className="w-4 h-4 text-white" />
              </div>
              <h4 className="text-lg font-semibold text-gray-900">Pitch Feedback</h4>
            </div>
            <p className="text-gray-700 mb-4">Your pitch deck is 78% ready. Consider adding more specific metrics and a clearer call-to-action for investors.</p>
            <button className="px-4 py-2 bg-gray-600 text-white rounded-xl hover:bg-gray-800 transition-colors">
              Improve Pitch
            </button>
          </div>
        </div>
      </div>

      {/* Insights Dashboard */}
      <div className="bg-white rounded-2xl p-8 shadow-lg">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 bg-gray-700 rounded-xl flex items-center justify-center">
            <BarChart3 className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-gray-900">Insights Dashboard</h3>
            <p className="text-gray-600">Progress %, tasks, milestones, funding, team health</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-gray-50 rounded-xl p-6">
            <h4 className="text-lg font-semibold text-gray-900 mb-2">Overall Progress</h4>
            <p className="text-3xl font-bold text-black">{startupData.progress}%</p>
            <p className="text-sm text-gray-600">+12% this week</p>
          </div>

          <div className="bg-gray-50 rounded-xl p-6">
            <h4 className="text-lg font-semibold text-gray-900 mb-2">Task Completion</h4>
            <p className="text-3xl font-bold text-gray-600">
              {startupData.tasks.filter(t => t.status === 'completed').length}/{startupData.tasks.length}
            </p>
            <p className="text-sm text-gray-600">tasks completed</p>
          </div>

          <div className="bg-gray-50 rounded-xl p-6">
            <h4 className="text-lg font-semibold text-gray-900 mb-2">Team Health</h4>
            <p className="text-3xl font-bold text-green-600">85%</p>
            <p className="text-sm text-gray-600">collaboration score</p>
          </div>

          <div className="bg-gray-50 rounded-xl p-6">
            <h4 className="text-lg font-semibold text-gray-900 mb-2">Funding Progress</h4>
            <p className="text-3xl font-bold text-gray-600">
              {Math.round((startupData.funding.raised / startupData.funding.target) * 100)}%
            </p>
            <p className="text-sm text-gray-600">of target raised</p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderTasks = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-gray-900">Tasks & Milestones</h3>
        <button className="px-4 py-2 bg-black text-white rounded-xl hover:bg-gray-800 transition-colors">
          <Plus className="w-4 h-4 mr-2" />
          Add Task
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Tasks */}
        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <h4 className="font-semibold text-gray-900 mb-4">Current Tasks</h4>
          <div className="space-y-3">
            {startupData.tasks.map((task) => (
              <div key={task.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                <div className={`w-4 h-4 rounded-full ${
                  task.status === 'completed' ? 'bg-black' : 
                  task.status === 'in-progress' ? 'bg-gray-500' : 'bg-gray-300'
                }`}></div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{task.title}</p>
                  <p className="text-sm text-gray-500">Assigned to {task.assignee}</p>
                </div>
                <span className={`px-2 py-1 text-xs rounded-full ${
                  task.priority === 'high' ? 'bg-gray-100 text-gray-700' :
                  task.priority === 'medium' ? 'bg-gray-100 text-gray-700' :
                  'bg-gray-100 text-gray-700'
                }`}>
                  {task.priority}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Milestones */}
        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <h4 className="font-semibold text-gray-900 mb-4">Milestones</h4>
          <div className="space-y-4">
            {startupData.milestones.map((milestone) => (
              <div key={milestone.id} className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  milestone.status === 'completed' ? 'bg-black' :
                  milestone.status === 'in-progress' ? 'bg-gray-600' : 'bg-gray-300'
                }`}>
                  {milestone.status === 'completed' ? (
                    <CheckCircle className="w-4 h-4 text-white" />
                  ) : milestone.status === 'in-progress' ? (
                    <Clock className="w-4 h-4 text-white" />
                  ) : (
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  )}
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{milestone.title}</p>
                  <p className="text-sm text-gray-500">Due: {milestone.dueDate}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderFunding = () => (
    <div className="h-full">
      <div className="bg-white rounded-2xl p-8 text-center">
        <p className="text-gray-600">Funding Tracker - Coming Soon</p>
      </div>
    </div>
  );

  const renderTeam = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl p-6 shadow-lg">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Team Members</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {startupData.cofounders.map((cofounder) => (
            <div key={cofounder.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
              <img
                src={cofounder.avatar}
                alt={cofounder.name}
                className="w-12 h-12 rounded-full object-cover"
              />
              <div className="flex-1">
                <h4 className="font-semibold text-gray-900">{cofounder.name}</h4>
                <p className="text-sm text-gray-600">{cofounder.role}</p>
                <div className="flex flex-wrap gap-1 mt-2">
                  {cofounder.skills.slice(0, 3).map((skill, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${
                  cofounder.status === 'active' ? 'bg-black' : 'bg-gray-400'
                }`}></div>
                <span className="text-xs text-gray-500 capitalize">{cofounder.status}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderMilestonesFull = () => {
    const handleAddMilestone = () => {
      if (newMilestone.title.trim()) {
        const milestone = {
          id: Date.now(),
          ...newMilestone,
          status: 'pending',
          progress: 0,
          tasks: [],
          estimatedHours: parseInt(newMilestone.estimatedHours) || 0,
          actualHours: 0,
          dependencies: [],
          linkedFeatures: [],
          notes: []
        };
        setStartupData(prev => ({
          ...prev,
          milestones: [...prev.milestones, milestone]
        }));
        setNewMilestone({ title: '', description: '', dueDate: '', category: 'development', estimatedHours: '', assignedTo: '' });
        setShowMilestoneModal(false);
      }
    };

    const updateMilestoneStatus = (id, status) => {
      setStartupData(prev => ({
        ...prev,
        milestones: prev.milestones.map(m => {
          if (m.id === id) {
            const progress = status === 'completed' ? 100 : 
                           status === 'in-progress' ? calculateMilestoneProgress(m) : m.progress;
            return { ...m, status, progress };
          }
          return m;
        })
      }));
    };

    const calculateMilestoneProgress = (milestone) => {
      if (milestone.linkedFeatures && milestone.linkedFeatures.length > 0) {
        const linkedFeatures = mvpFeatures.filter(f => milestone.linkedFeatures.includes(f.id));
        if (linkedFeatures.length > 0) {
          const completedFeatures = linkedFeatures.filter(f => f.status === 'completed').length;
          const featureProgress = Math.round((completedFeatures / linkedFeatures.length) * 100);
          
          if (milestone.tasks && milestone.tasks.length > 0) {
            const completedTasks = milestone.tasks.filter(t => t.status === 'completed').length;
            const taskProgress = Math.round((completedTasks / milestone.tasks.length) * 100);
            return Math.round((featureProgress * 0.7 + taskProgress * 0.3));
          }
          return featureProgress;
        }
      }
      
      if (!milestone.tasks || milestone.tasks.length === 0) return milestone.progress || 0;
      const completedTasks = milestone.tasks.filter(t => t.status === 'completed').length;
      return Math.round((completedTasks / milestone.tasks.length) * 100);
    };

    const syncMilestoneProgressFromFeatures = (milestoneId) => {
      const milestone = startupData.milestones.find(m => m.id === milestoneId);
      if (milestone && milestone.linkedFeatures) {
        const progress = calculateMilestoneProgress(milestone);
      setStartupData(prev => ({
        ...prev,
        milestones: prev.milestones.map(m => 
            m.id === milestoneId ? { ...m, progress } : m
        )
      }));
      }
    };

    const addTaskToMilestone = (milestoneId) => {
      if (newMilestoneTask.title.trim()) {
        const task = {
          id: Date.now(),
          ...newMilestoneTask,
          status: 'pending',
          estimatedHours: parseInt(newMilestoneTask.estimatedHours) || 0,
          actualHours: 0
        };
        setStartupData(prev => ({
          ...prev,
          milestones: prev.milestones.map(m => {
            if (m.id === milestoneId) {
              const updatedTasks = [...(m.tasks || []), task];
              const progress = calculateMilestoneProgress({ ...m, tasks: updatedTasks });
              return { ...m, tasks: updatedTasks, progress };
            }
            return m;
          })
        }));
        setNewMilestoneTask({ title: '', assignee: '', estimatedHours: '', priority: 'medium' });
      }
    };

    const updateTaskStatus = (milestoneId, taskId, status) => {
      setStartupData(prev => ({
        ...prev,
        milestones: prev.milestones.map(m => {
          if (m.id === milestoneId) {
            const updatedTasks = m.tasks.map(t => 
              t.id === taskId ? { ...t, status } : t
            );
            const progress = calculateMilestoneProgress({ ...m, tasks: updatedTasks });
            return { ...m, tasks: updatedTasks, progress };
          }
          return m;
        })
      }));
    };

    const updateTaskHours = (milestoneId, taskId, hours) => {
      setStartupData(prev => ({
        ...prev,
        milestones: prev.milestones.map(m => {
          if (m.id === milestoneId) {
            const updatedTasks = m.tasks.map(t => 
              t.id === taskId ? { ...t, actualHours: parseInt(hours) || 0 } : t
            );
            const totalActualHours = updatedTasks.reduce((sum, t) => sum + (t.actualHours || 0), 0);
            return { ...m, tasks: updatedTasks, actualHours: totalActualHours };
          }
          return m;
        })
      }));
    };

    const addNoteToMilestone = (milestoneId, note) => {
      if (note.trim()) {
        setStartupData(prev => ({
          ...prev,
          milestones: prev.milestones.map(m => {
            if (m.id === milestoneId) {
              return { ...m, notes: [...(m.notes || []), note] };
            }
            return m;
          })
        }));
      }
    };

    const completedCount = startupData.milestones.filter(m => m.status === 'completed').length;
    const inProgressCount = startupData.milestones.filter(m => m.status === 'in-progress').length;
    const pendingCount = startupData.milestones.filter(m => m.status === 'pending').length;
    const totalEstimatedHours = startupData.milestones.reduce((sum, m) => sum + (m.estimatedHours || 0), 0);
    const totalActualHours = startupData.milestones.reduce((sum, m) => sum + (m.actualHours || 0), 0);

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Milestones</h2>
            <p className="text-gray-600">Track your startup's key achievements and goals</p>
          </div>
          <button
            onClick={() => setShowMilestoneModal(true)}
            className="px-6 py-3 bg-black text-white rounded-xl font-semibold hover:bg-gray-800 transition-all duration-300 flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Milestone
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-6">
          <div className="bg-white rounded-2xl p-6 shadow-sm border-2 border-gray-200">
            <div className="text-3xl font-bold text-gray-900 mb-1">{startupData.milestones.length}</div>
            <div className="text-sm text-gray-600">Total Milestones</div>
          </div>
          <div className="bg-green-50 rounded-2xl p-6 shadow-sm border-2 border-green-200">
            <div className="text-3xl font-bold text-green-700 mb-1">{completedCount}</div>
            <div className="text-sm text-green-600">Completed</div>
          </div>
          <div className="bg-yellow-50 rounded-2xl p-6 shadow-sm border-2 border-yellow-200">
            <div className="text-3xl font-bold text-yellow-700 mb-1">{inProgressCount}</div>
            <div className="text-sm text-yellow-600">In Progress</div>
          </div>
          <div className="bg-gray-50 rounded-2xl p-6 shadow-sm border-2 border-gray-200">
            <div className="text-3xl font-bold text-gray-700 mb-1">{pendingCount}</div>
            <div className="text-sm text-gray-600">Pending</div>
          </div>
          <div className="bg-blue-50 rounded-2xl p-6 shadow-sm border-2 border-blue-200">
            <div className="text-3xl font-bold text-blue-700 mb-1">{totalEstimatedHours}h</div>
            <div className="text-sm text-blue-600">Estimated</div>
          </div>
          <div className="bg-purple-50 rounded-2xl p-6 shadow-sm border-2 border-purple-200">
            <div className="text-3xl font-bold text-purple-700 mb-1">{totalActualHours}h</div>
            <div className="text-sm text-purple-600">Actual</div>
          </div>
        </div>

        <div className="space-y-4">
          {startupData.milestones.map((milestone) => {
            const milestoneTasks = milestone.tasks || [];
            const completedTasks = milestoneTasks.filter(t => t.status === 'completed').length;
            const inProgressTasks = milestoneTasks.filter(t => t.status === 'in-progress').length;
            const pendingTasks = milestoneTasks.filter(t => t.status === 'pending').length;
            const taskEstimatedHours = milestoneTasks.reduce((sum, t) => sum + (t.estimatedHours || 0), 0);
            const taskActualHours = milestoneTasks.reduce((sum, t) => sum + (t.actualHours || 0), 0);
            const isExpanded = selectedMilestone === milestone.id && showMilestoneDetails;
            
            return (
            <div key={milestone.id} className="bg-white rounded-2xl p-6 shadow-lg border-2 border-gray-200 hover:border-black transition-all duration-300">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-bold text-gray-900">{milestone.title}</h3>
                    <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                      milestone.status === 'completed' ? 'bg-green-100 text-green-700' :
                      milestone.status === 'in-progress' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {milestone.status === 'completed' ? '✓ Completed' :
                       milestone.status === 'in-progress' ? '⟳ In Progress' :
                       '○ Pending'}
                    </span>
                  </div>
                  {milestone.description && (
                    <p className="text-gray-600 mb-3">{milestone.description}</p>
                  )}
                    <div className="flex items-center gap-4 text-sm text-gray-500 flex-wrap">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>Due: {milestone.dueDate}</span>
                    </div>
                    {milestone.category && (
                      <span className="px-2 py-1 bg-gray-100 rounded-full">{milestone.category}</span>
                    )}
                      {milestone.assignedTo && (
                        <div className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          <span>{milestone.assignedTo}</span>
                        </div>
                      )}
                      {milestone.estimatedHours > 0 && (
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          <span>{milestone.estimatedHours}h est.</span>
                          {milestone.actualHours > 0 && (
                            <span className="text-gray-400">({milestone.actualHours}h actual)</span>
                          )}
                        </div>
                      )}
                    {milestone.dependencies && milestone.dependencies.length > 0 && (
                      <div className="flex items-center gap-1">
                        <Link className="w-4 h-4" />
                        <span>{milestone.dependencies.length} dependency</span>
                      </div>
                    )}
                    {milestone.linkedFeatures && milestone.linkedFeatures.length > 0 && (
                      <div className="flex items-center gap-1">
                        <Rocket className="w-4 h-4" />
                        <span>{milestone.linkedFeatures.length} MVP features</span>
                      </div>
                    )}
                    {milestoneTasks.length > 0 && (
                      <div className="flex items-center gap-1">
                        <ListChecks className="w-4 h-4" />
                        <span>{milestoneTasks.length} tasks</span>
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setSelectedMilestone(milestone.id);
                        setShowMilestoneDetails(!isExpanded);
                      }}
                      className="px-4 py-2 bg-gray-100 text-gray-700 rounded-xl text-sm font-semibold hover:bg-gray-200 transition-all flex items-center gap-2"
                    >
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      {isExpanded ? 'Hide' : 'Details'}
                    </button>
                  {milestone.status !== 'completed' && (
                    <button
                      onClick={() => updateMilestoneStatus(milestone.id, milestone.status === 'pending' ? 'in-progress' : 'completed')}
                      className="px-4 py-2 bg-black text-white rounded-xl text-sm font-semibold hover:bg-gray-800 transition-all"
                    >
                      {milestone.status === 'pending' ? 'Start' : 'Complete'}
                    </button>
                  )}
                </div>
              </div>
                
                <div className="mt-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">Progress</span>
                    <span className="text-sm font-semibold text-gray-900">{milestone.progress || 0}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-black h-2 rounded-full transition-all duration-300"
                      style={{ width: `${milestone.progress || 0}%` }}
                    ></div>
                  </div>
                </div>

                {isExpanded && (
                  <div className="mt-6 pt-6 border-t border-gray-200 space-y-6">
                    <div className="grid grid-cols-3 gap-4">
                      <div className="bg-green-50 rounded-xl p-3">
                        <div className="text-lg font-bold text-green-700">{completedTasks}</div>
                        <div className="text-xs text-green-600">Completed Tasks</div>
                      </div>
                      <div className="bg-yellow-50 rounded-xl p-3">
                        <div className="text-lg font-bold text-yellow-700">{inProgressTasks}</div>
                        <div className="text-xs text-yellow-600">In Progress</div>
                      </div>
                      <div className="bg-gray-50 rounded-xl p-3">
                        <div className="text-lg font-bold text-gray-700">{pendingTasks}</div>
                        <div className="text-xs text-gray-600">Pending</div>
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="font-semibold text-gray-900">Tasks</h4>
                        <button
                          onClick={() => {
                            const title = prompt('Enter task title:');
                            if (title && title.trim()) {
                              const assignee = prompt('Enter assignee (optional):') || '';
                              const hours = prompt('Enter estimated hours (optional):') || '0';
                              const priority = prompt('Enter priority (high/medium/low):') || 'medium';
                              setNewMilestoneTask({ title: title.trim(), assignee, estimatedHours: hours, priority });
                              addTaskToMilestone(milestone.id);
                            }
                          }}
                          className="px-3 py-1.5 bg-black text-white rounded-lg text-sm font-semibold hover:bg-gray-800 transition-all flex items-center gap-2"
                        >
                          <Plus className="w-3 h-3" />
                          Add Task
                        </button>
                      </div>
                      
                      {milestoneTasks.length === 0 ? (
                        <div className="bg-gray-50 rounded-xl p-4 text-center text-sm text-gray-500">
                          No tasks yet. Add your first task to get started.
                        </div>
                      ) : (
                        <div className="space-y-2">
                          {milestoneTasks.map((task) => (
                            <div key={task.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                              <button
                                onClick={() => updateTaskStatus(milestone.id, task.id, 
                                  task.status === 'completed' ? 'pending' : 
                                  task.status === 'pending' ? 'in-progress' : 'completed'
                                )}
                                className="flex-shrink-0"
                              >
                                {task.status === 'completed' ? (
                                  <CheckCircle className="w-5 h-5 text-green-600" />
                                ) : task.status === 'in-progress' ? (
                                  <Clock className="w-5 h-5 text-yellow-600" />
                                ) : (
                                  <Circle className="w-5 h-5 text-gray-400" />
                                )}
                              </button>
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="font-medium text-gray-900">{task.title}</span>
                                  {task.priority && (
                                    <span className={`px-2 py-0.5 text-xs rounded-full ${
                                      task.priority === 'high' ? 'bg-red-100 text-red-700' :
                                      task.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                                      'bg-gray-100 text-gray-700'
                                    }`}>
                                      {task.priority}
                                    </span>
                                  )}
                                </div>
                                <div className="flex items-center gap-4 text-xs text-gray-500">
                                  {task.assignee && <span>Assigned to: {task.assignee}</span>}
                                  {task.estimatedHours > 0 && (
                                    <span>Est: {task.estimatedHours}h</span>
                                  )}
                                  <input
                                    type="number"
                                    value={task.actualHours || 0}
                                    onChange={(e) => updateTaskHours(milestone.id, task.id, e.target.value)}
                                    placeholder="Actual hours"
                                    className="w-20 px-2 py-1 bg-white border border-gray-300 rounded text-xs"
                                  />
                                  <span>h actual</span>
                                </div>
                              </div>
            </div>
          ))}
                        </div>
                      )}
                      
                      {milestoneTasks.length > 0 && (
                        <div className="mt-4 p-3 bg-blue-50 rounded-xl">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-700">Task Hours:</span>
                            <span className="font-semibold text-gray-900">
                              {taskActualHours}h / {taskEstimatedHours}h
                            </span>
                          </div>
                        </div>
                      )}
                    </div>

                    {milestone.linkedFeatures && milestone.linkedFeatures.length > 0 && (
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">Linked MVP Features</h4>
                        <div className="space-y-2">
                          {milestone.linkedFeatures.map((featureId) => {
                            const feature = mvpFeatures.find(f => f.id === featureId);
                            return feature ? (
                              <div key={featureId} className="flex items-center justify-between p-3 bg-blue-50 rounded-xl">
                                <div className="flex items-center gap-3">
                                  <Rocket className="w-4 h-4 text-blue-600" />
                                  <span className="font-medium text-gray-900">{feature.title}</span>
                                  <span className={`px-2 py-0.5 text-xs rounded-full ${
                                    feature.status === 'completed' ? 'bg-green-100 text-green-700' :
                                    feature.status === 'in-progress' ? 'bg-yellow-100 text-yellow-700' :
                                    'bg-gray-100 text-gray-700'
                                  }`}>
                                    {feature.status}
                                  </span>
                                </div>
                                <button
                                  onClick={() => {
                                    const featureProgress = feature.tasks && feature.tasks.length > 0
                                      ? Math.round((feature.tasks.filter(t => t.status === 'completed').length / feature.tasks.length) * 100)
                                      : feature.status === 'completed' ? 100 : 0;
                                    return featureProgress;
                                  }}
                                  className="text-xs text-blue-600 hover:text-blue-800 font-semibold"
                                >
                                  {feature.tasks && feature.tasks.length > 0
                                    ? `${Math.round((feature.tasks.filter(t => t.status === 'completed').length / feature.tasks.length) * 100)}%`
                                    : feature.status === 'completed' ? '100%' : '0%'}
                                </button>
                              </div>
                            ) : null;
                          })}
                        </div>
                      </div>
                    )}

                    {milestone.dependencies && milestone.dependencies.length > 0 && (
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">Dependencies</h4>
                        <div className="flex flex-wrap gap-2">
                          {milestone.dependencies.map((depId) => {
                            const depMilestone = startupData.milestones.find(m => m.id === depId);
                            return depMilestone ? (
                              <span key={depId} className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm">
                                {depMilestone.title}
                              </span>
                            ) : null;
                          })}
                        </div>
                      </div>
                    )}

                    {milestone.notes && milestone.notes.length > 0 && (
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">Notes</h4>
                        <div className="space-y-2">
                          {milestone.notes.map((note, idx) => (
                            <div key={idx} className="p-3 bg-gray-50 rounded-xl text-sm text-gray-700">
                              {note}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Add Note</h4>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="Add a note..."
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-black focus:border-transparent"
                          onKeyPress={(e) => {
                            if (e.key === 'Enter' && e.target.value.trim()) {
                              addNoteToMilestone(milestone.id, e.target.value);
                              e.target.value = '';
                            }
                          }}
                        />
                        <button
                          onClick={(e) => {
                            const input = e.target.previousElementSibling;
                            if (input.value.trim()) {
                              addNoteToMilestone(milestone.id, input.value);
                              input.value = '';
                            }
                          }}
                          className="px-4 py-2 bg-black text-white rounded-xl text-sm font-semibold hover:bg-gray-800 transition-all"
                        >
                          Add
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {!isExpanded && milestoneTasks.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="flex items-center justify-between text-sm text-gray-600">
                      <span>{milestoneTasks.length} tasks • {completedTasks} completed</span>
                      <button
                        onClick={() => {
                          setSelectedMilestone(milestone.id);
                          setShowMilestoneDetails(true);
                        }}
                        className="text-black font-semibold hover:underline"
                      >
                        View all tasks →
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {showMilestoneModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-3xl p-8 max-w-2xl w-full">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Add New Milestone</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Title *</label>
                  <input
                    type="text"
                    value={newMilestone.title}
                    onChange={(e) => setNewMilestone({...newMilestone, title: e.target.value})}
                    placeholder="e.g., Launch MVP"
                    className="w-full p-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <textarea
                    value={newMilestone.description}
                    onChange={(e) => setNewMilestone({...newMilestone, description: e.target.value})}
                    placeholder="Describe this milestone..."
                    className="w-full h-24 p-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent resize-none"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Due Date</label>
                    <input
                      type="date"
                      value={newMilestone.dueDate}
                      onChange={(e) => setNewMilestone({...newMilestone, dueDate: e.target.value})}
                      className="w-full p-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                    <select
                      value={newMilestone.category}
                      onChange={(e) => setNewMilestone({...newMilestone, category: e.target.value})}
                      className="w-full p-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent"
                    >
                      <option value="development">Development</option>
                      <option value="marketing">Marketing</option>
                      <option value="funding">Funding</option>
                      <option value="operations">Operations</option>
                      <option value="research">Research</option>
                      <option value="testing">Testing</option>
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Estimated Hours</label>
                    <input
                      type="number"
                      value={newMilestone.estimatedHours}
                      onChange={(e) => setNewMilestone({...newMilestone, estimatedHours: e.target.value})}
                      placeholder="e.g., 40"
                      className="w-full p-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Assigned To</label>
                    <select
                      value={newMilestone.assignedTo}
                      onChange={(e) => setNewMilestone({...newMilestone, assignedTo: e.target.value})}
                      className="w-full p-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent"
                    >
                      <option value="">Select team member</option>
                      {startupData.cofounders.map((member) => (
                        <option key={member.id} value={member.name}>{member.name}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
              <div className="flex gap-3 mt-8">
                <button
                  onClick={() => setShowMilestoneModal(false)}
                  className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddMilestone}
                  className="flex-1 py-3 bg-black text-white rounded-xl font-semibold hover:bg-gray-800 transition-all"
                >
                  Add Milestone
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderTeamFull = () => {
    const handleAddTeamMember = () => {
      if (newTeamMember.name.trim() && newTeamMember.role.trim()) {
        const member = {
          id: Date.now(),
          ...newTeamMember,
          avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(newTeamMember.name)}&background=000000&color=ffffff`,
          status: 'active',
          tasksCompleted: 0,
          tasksInProgress: 0
        };
        setStartupData(prev => ({
          ...prev,
          cofounders: [...prev.cofounders, member]
        }));
        setNewTeamMember({ name: '', role: '', email: '', skills: [] });
        setShowTeamModal(false);
      }
    };

    const teamHealth = {
      communication: 85,
      alignment: 90,
      productivity: 75,
      satisfaction: 88
    };

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Team Management</h2>
            <p className="text-gray-600">Manage your team members, roles, and team health</p>
          </div>
          <button
            onClick={() => setShowTeamModal(true)}
            className="px-6 py-3 bg-black text-white rounded-xl font-semibold hover:bg-gray-800 transition-all duration-300 flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Team Member
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          {Object.entries(teamHealth).map(([key, value]) => (
            <div key={key} className="bg-white rounded-2xl p-6 shadow-sm border-2 border-gray-200">
              <div className="text-sm font-medium text-gray-600 mb-2 capitalize">{key}</div>
              <div className="text-3xl font-bold text-gray-900 mb-2">{value}%</div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all ${
                    value >= 85 ? 'bg-green-500' : value >= 70 ? 'bg-yellow-500' : 'bg-orange-500'
                  }`}
                  style={{ width: `${value}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <h3 className="text-xl font-bold text-gray-900 mb-6">Team Members</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {startupData.cofounders.map((member) => (
              <div key={member.id} className="bg-gray-50 rounded-2xl p-6 border-2 border-gray-200 hover:border-black transition-all">
                <div className="flex items-start gap-4 mb-4">
                  <img
                    src={member.avatar}
                    alt={member.name}
                    className="w-16 h-16 rounded-xl object-cover border-2 border-white shadow-lg"
                  />
                  <div className="flex-1">
                    <h4 className="font-bold text-gray-900 text-lg">{member.name}</h4>
                    <p className="text-sm text-gray-600 font-semibold">{member.role}</p>
                    {member.email && (
                      <a href={`mailto:${member.email}`} className="text-xs text-gray-500 hover:text-black flex items-center gap-1 mt-1">
                        <Mail className="w-3 h-3" />
                        {member.email}
                      </a>
                    )}
                  </div>
                  <div className={`w-3 h-3 rounded-full ${
                    member.status === 'active' ? 'bg-green-500' : 'bg-gray-400'
                  }`}></div>
                </div>
                <div className="mb-4">
                  <h5 className="text-sm font-semibold text-gray-700 mb-2">Skills</h5>
                  <div className="flex flex-wrap gap-1">
                    {member.skills?.slice(0, 4).map((skill, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-white text-gray-700 text-xs rounded-full font-medium border border-gray-200"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3 pt-4 border-t border-gray-200">
                  <div>
                    <div className="text-xs text-gray-500">Tasks Completed</div>
                    <div className="text-lg font-bold text-gray-900">{member.tasksCompleted || 0}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500">In Progress</div>
                    <div className="text-lg font-bold text-gray-900">{member.tasksInProgress || 0}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {showTeamModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-3xl p-8 max-w-2xl w-full">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Add Team Member</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Name *</label>
                  <input
                    type="text"
                    value={newTeamMember.name}
                    onChange={(e) => setNewTeamMember({...newTeamMember, name: e.target.value})}
                    placeholder="Full name"
                    className="w-full p-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Role *</label>
                  <input
                    type="text"
                    value={newTeamMember.role}
                    onChange={(e) => setNewTeamMember({...newTeamMember, role: e.target.value})}
                    placeholder="e.g., Technical Co-founder, Designer"
                    className="w-full p-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <input
                    type="email"
                    value={newTeamMember.email}
                    onChange={(e) => setNewTeamMember({...newTeamMember, email: e.target.value})}
                    placeholder="email@example.com"
                    className="w-full p-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent"
                  />
                </div>
              </div>
              <div className="flex gap-3 mt-8">
                <button
                  onClick={() => setShowTeamModal(false)}
                  className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddTeamMember}
                  className="flex-1 py-3 bg-black text-white rounded-xl font-semibold hover:bg-gray-800 transition-all"
                >
                  Add Member
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderMVPExecution = () => {
    const updateFeatureStatus = (id, status) => {
      setMvpFeatures(prev => {
        const updated = prev.map(f => f.id === id ? {...f, status} : f);
        const feature = updated.find(f => f.id === id);
        if (feature && feature.linkedMilestone) {
          setTimeout(() => {
            const milestone = startupData.milestones.find(m => m.id === feature.linkedMilestone);
            if (milestone && milestone.linkedFeatures) {
              const linkedFeatures = updated.filter(f => milestone.linkedFeatures.includes(f.id));
              const completedFeatures = linkedFeatures.filter(f => f.status === 'completed').length;
              const featureProgress = linkedFeatures.length > 0 
                ? Math.round((completedFeatures / linkedFeatures.length) * 100) 
                : 0;
              
              let finalProgress = featureProgress;
              if (milestone.tasks && milestone.tasks.length > 0) {
                const completedTasks = milestone.tasks.filter(t => t.status === 'completed').length;
                const taskProgress = Math.round((completedTasks / milestone.tasks.length) * 100);
                finalProgress = Math.round((featureProgress * 0.7 + taskProgress * 0.3));
              }
              
              setStartupData(prevData => ({
                ...prevData,
                milestones: prevData.milestones.map(m => 
                  m.id === feature.linkedMilestone ? { ...m, progress: finalProgress } : m
                )
              }));
            }
          }, 0);
        }
        return updated;
      });
    };

    const calculateFeatureProgress = (feature) => {
      if (!feature.tasks || feature.tasks.length === 0) return feature.status === 'completed' ? 100 : 0;
      const completedTasks = feature.tasks.filter(t => t.status === 'completed').length;
      return Math.round((completedTasks / feature.tasks.length) * 100);
    };

    const addTaskToFeature = (featureId) => {
      if (newFeatureTask.title.trim()) {
        const task = {
          id: Date.now(),
          ...newFeatureTask,
          status: 'pending',
          estimatedHours: parseInt(newFeatureTask.estimatedHours) || 0,
          actualHours: 0
        };
        setMvpFeatures(prev => prev.map(f => {
          if (f.id === featureId) {
            return { ...f, tasks: [...(f.tasks || []), task] };
          }
          return f;
        }));
        setNewFeatureTask({ title: '', estimatedHours: '', priority: 'medium' });
      }
    };

    const updateFeatureTaskStatus = (featureId, taskId, status) => {
      setMvpFeatures(prev => {
        const updated = prev.map(f => {
          if (f.id === featureId) {
            const updatedTasks = f.tasks.map(t => 
              t.id === taskId ? { ...t, status } : t
            );
            return { ...f, tasks: updatedTasks };
          }
          return f;
        });
        
        const feature = updated.find(f => f.id === featureId);
        if (feature && feature.linkedMilestone) {
          setTimeout(() => {
            const milestone = startupData.milestones.find(m => m.id === feature.linkedMilestone);
            if (milestone && milestone.linkedFeatures) {
              const linkedFeatures = updated.filter(f => milestone.linkedFeatures.includes(f.id));
              const completedFeatures = linkedFeatures.filter(f => f.status === 'completed').length;
              const featureProgress = linkedFeatures.length > 0 
                ? Math.round((completedFeatures / linkedFeatures.length) * 100) 
                : 0;
              
              let finalProgress = featureProgress;
              if (milestone.tasks && milestone.tasks.length > 0) {
                const completedTasks = milestone.tasks.filter(t => t.status === 'completed').length;
                const taskProgress = Math.round((completedTasks / milestone.tasks.length) * 100);
                finalProgress = Math.round((featureProgress * 0.7 + taskProgress * 0.3));
              }
              
              setStartupData(prevData => ({
                ...prevData,
                milestones: prevData.milestones.map(m => 
                  m.id === feature.linkedMilestone ? { ...m, progress: finalProgress } : m
                )
              }));
            }
          }, 0);
        }
        return updated;
      });
    };

    const updateFeatureTaskHours = (featureId, taskId, hours) => {
      setMvpFeatures(prev => prev.map(f => {
        if (f.id === featureId) {
          const updatedTasks = f.tasks.map(t => 
            t.id === taskId ? { ...t, actualHours: parseInt(hours) || 0 } : t
          );
          const totalActualHours = updatedTasks.reduce((sum, t) => sum + (t.actualHours || 0), 0);
          return { ...f, tasks: updatedTasks, actualHours: totalActualHours };
        }
        return f;
      }));
    };

    const completedCount = mvpFeatures.filter(f => f.status === 'completed').length;
    const inProgressCount = mvpFeatures.filter(f => f.status === 'in-progress').length;
    const pendingCount = mvpFeatures.filter(f => f.status === 'pending').length;
    const progress = Math.round((completedCount / mvpFeatures.length) * 100);
    const totalEstimatedHours = mvpFeatures.reduce((sum, f) => sum + (f.estimatedHours || 0), 0);
    const totalActualHours = mvpFeatures.reduce((sum, f) => sum + (f.actualHours || 0), 0);

    const mvpTabs = [
      { id: 'overview', label: 'Overview', icon: BarChart3 },
      { id: 'tasks', label: 'Tasks', icon: ListChecks },
      { id: 'wireframes', label: 'Wireframes', icon: Layout },
      { id: 'userflows', label: 'User Flows', icon: GitBranch },
      { id: 'landing', label: 'Landing Page', icon: Globe },
      { id: 'prototype', label: 'Prototype', icon: Rocket },
      { id: 'uikit', label: 'UI Kit', icon: Palette },
      { id: 'architecture', label: 'Architecture', icon: Code },
      { id: 'prds', label: 'Feature PRDs', icon: FileText },
      { id: 'sprints', label: 'Sprint Schedules', icon: Calendar }
    ];

    const renderOverview = () => (
      <div className="space-y-6">
        <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl p-8 text-white mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-2xl font-bold mb-2">MVP Progress</h3>
              <p className="text-white/80">Overall completion status</p>
            </div>
            <div className="text-right">
              <div className="text-4xl font-bold">{progress}%</div>
              <div className="text-sm text-white/80">{completedCount} of {mvpFeatures.length} features</div>
            </div>
          </div>
          <div className="w-full bg-white/20 rounded-full h-4">
            <div
              className="bg-white h-4 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
          <div className="bg-green-50 rounded-2xl p-6 border-2 border-green-200">
            <div className="text-3xl font-bold text-green-700 mb-1">{completedCount}</div>
            <div className="text-sm text-green-600 font-semibold">Completed</div>
          </div>
          <div className="bg-yellow-50 rounded-2xl p-6 border-2 border-yellow-200">
            <div className="text-3xl font-bold text-yellow-700 mb-1">{inProgressCount}</div>
            <div className="text-sm text-yellow-600 font-semibold">In Progress</div>
          </div>
          <div className="bg-gray-50 rounded-2xl p-6 border-2 border-gray-200">
            <div className="text-3xl font-bold text-gray-700 mb-1">{pendingCount}</div>
            <div className="text-sm text-gray-600 font-semibold">Pending</div>
          </div>
          <div className="bg-blue-50 rounded-2xl p-6 border-2 border-blue-200">
            <div className="text-3xl font-bold text-blue-700 mb-1">{totalEstimatedHours}h</div>
            <div className="text-sm text-blue-600 font-semibold">Estimated</div>
          </div>
          <div className="bg-purple-50 rounded-2xl p-6 border-2 border-purple-200">
            <div className="text-3xl font-bold text-purple-700 mb-1">{totalActualHours}h</div>
            <div className="text-sm text-purple-600 font-semibold">Actual</div>
          </div>
          <div className="bg-orange-50 rounded-2xl p-6 border-2 border-orange-200">
            <div className="text-3xl font-bold text-orange-700 mb-1">
              {totalEstimatedHours > 0 ? Math.round((totalActualHours / totalEstimatedHours) * 100) : 0}%
            </div>
            <div className="text-sm text-orange-600 font-semibold">Efficiency</div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200 hover:border-gray-900 transition-all">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <Layout className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900">Wireframes</h3>
                <p className="text-sm text-gray-500">{wireframes.length} created</p>
              </div>
            </div>
            <button
              onClick={() => setActiveMvpTab('wireframes')}
              className="w-full py-2 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-colors font-semibold text-sm"
            >
              View Wireframes
            </button>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200 hover:border-gray-900 transition-all">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <GitBranch className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900">User Flows</h3>
                <p className="text-sm text-gray-500">{userFlows.length} flows</p>
              </div>
            </div>
            <button
              onClick={() => setActiveMvpTab('userflows')}
              className="w-full py-2 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-colors font-semibold text-sm"
            >
              View Flows
            </button>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200 hover:border-gray-900 transition-all">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <Globe className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900">Landing Page</h3>
                <p className="text-sm text-gray-500 capitalize">{landingPage.status}</p>
              </div>
            </div>
            <button
              onClick={() => setActiveMvpTab('landing')}
              className="w-full py-2 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-colors font-semibold text-sm"
            >
              Manage Landing
            </button>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200 hover:border-gray-900 transition-all">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                <Rocket className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900">Prototype</h3>
                <p className="text-sm text-gray-500">v{prototype.version}</p>
              </div>
            </div>
            <button
              onClick={() => setActiveMvpTab('prototype')}
              className="w-full py-2 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-colors font-semibold text-sm"
            >
              View Prototype
            </button>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200 hover:border-gray-900 transition-all">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-pink-100 rounded-xl flex items-center justify-center">
                <Palette className="w-6 h-6 text-pink-600" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900">UI Kit</h3>
                <p className="text-sm text-gray-500">{uiKit.components.length} components</p>
              </div>
            </div>
            <button
              onClick={() => setActiveMvpTab('uikit')}
              className="w-full py-2 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-colors font-semibold text-sm"
            >
              View UI Kit
            </button>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200 hover:border-gray-900 transition-all">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center">
                <Code className="w-6 h-6 text-indigo-600" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900">Architecture</h3>
                <p className="text-sm text-gray-500">{techArchitecture.diagrams.length} diagrams</p>
              </div>
            </div>
            <button
              onClick={() => setActiveMvpTab('architecture')}
              className="w-full py-2 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-colors font-semibold text-sm"
            >
              View Architecture
            </button>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200 hover:border-gray-900 transition-all">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-cyan-100 rounded-xl flex items-center justify-center">
                <FileText className="w-6 h-6 text-cyan-600" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900">Feature PRDs</h3>
                <p className="text-sm text-gray-500">{featurePRDs.length} documents</p>
              </div>
            </div>
            <button
              onClick={() => setActiveMvpTab('prds')}
              className="w-full py-2 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-colors font-semibold text-sm"
            >
              View PRDs
            </button>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200 hover:border-gray-900 transition-all">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
                <Calendar className="w-6 h-6 text-yellow-600" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900">Sprint Schedules</h3>
                <p className="text-sm text-gray-500">{sprintSchedules.length} sprints</p>
              </div>
            </div>
            <button
              onClick={() => setActiveMvpTab('sprints')}
              className="w-full py-2 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-colors font-semibold text-sm"
            >
              View Sprints
            </button>
          </div>
        </div>
      </div>
    );

    const renderTasks = () => (
        <div className="space-y-4">
        <div className="flex items-center justify-between mb-6">
          <div>
          <h3 className="text-2xl font-bold text-gray-900">Feature Tasks</h3>
            <p className="text-gray-600 text-sm mt-1">Manage tasks for each MVP feature</p>
        </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-blue-50 rounded-2xl p-4 border-2 border-blue-200">
            <div className="text-2xl font-bold text-blue-700 mb-1">{totalEstimatedHours}h</div>
            <div className="text-sm text-blue-600">Total Estimated</div>
          </div>
          <div className="bg-purple-50 rounded-2xl p-4 border-2 border-purple-200">
            <div className="text-2xl font-bold text-purple-700 mb-1">{totalActualHours}h</div>
            <div className="text-sm text-purple-600">Total Actual</div>
          </div>
          <div className="bg-gray-50 rounded-2xl p-4 border-2 border-gray-200">
            <div className="text-2xl font-bold text-gray-700 mb-1">
              {totalEstimatedHours > 0 ? Math.round((totalActualHours / totalEstimatedHours) * 100) : 0}%
            </div>
            <div className="text-sm text-gray-600">Time Efficiency</div>
          </div>
        </div>

        {mvpFeatures.map((feature) => {
          const featureTasks = feature.tasks || [];
          const completedTasks = featureTasks.filter(t => t.status === 'completed').length;
          const taskProgress = featureTasks.length > 0 ? Math.round((completedTasks / featureTasks.length) * 100) : 0;
          const taskEstimatedHours = featureTasks.reduce((sum, t) => sum + (t.estimatedHours || 0), 0);
          const taskActualHours = featureTasks.reduce((sum, t) => sum + (t.actualHours || 0), 0);
          const isExpanded = selectedFeature === feature.id && showFeatureDetails;
          
          return (
          <div key={feature.id} className="bg-white rounded-2xl p-6 shadow-lg border-2 border-gray-200 hover:border-gray-900 transition-all">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-bold text-gray-900">{feature.title}</h3>
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                      feature.priority === 'high' ? 'bg-red-100 text-red-700' :
                      feature.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {feature.priority}
                    </span>
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                      feature.status === 'completed' ? 'bg-green-100 text-green-700' :
                      feature.status === 'in-progress' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {feature.status}
                  </span>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-500 flex-wrap">
                    <span className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      {feature.assignee}
                    </span>
                    {feature.estimatedHours > 0 && (
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {feature.estimatedHours}h est.
                        {feature.actualHours > 0 && (
                          <span className="text-gray-400">({feature.actualHours}h actual)</span>
                        )}
                      </span>
                    )}
                    {feature.linkedMilestone && (
                      <span className="flex items-center gap-1">
                        <Target className="w-4 h-4" />
                        <span>Milestone: {
                          startupData.milestones.find(m => m.id === feature.linkedMilestone)?.title || 'Unknown'
                        }</span>
                      </span>
                    )}
                    {feature.dependencies && feature.dependencies.length > 0 && (
                      <span className="flex items-center gap-1">
                        <Link className="w-4 h-4" />
                        {feature.dependencies.length} dependency
                      </span>
                    )}
                    {featureTasks.length > 0 && (
                      <span className="flex items-center gap-1">
                        <ListChecks className="w-4 h-4" />
                        {featureTasks.length} tasks
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setSelectedFeature(feature.id);
                      setShowFeatureDetails(!isExpanded);
                    }}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-xl text-sm font-semibold hover:bg-gray-200 transition-all flex items-center gap-2"
                  >
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    {isExpanded ? 'Hide' : 'Details'}
                  </button>
                <select
                  value={feature.status}
                  onChange={(e) => updateFeatureStatus(feature.id, e.target.value)}
                  className={`px-4 py-2 rounded-xl font-semibold text-sm border-2 ${
                    feature.status === 'completed' ? 'bg-green-100 text-green-700 border-green-200' :
                    feature.status === 'in-progress' ? 'bg-yellow-100 text-yellow-700 border-yellow-200' :
                    'bg-gray-100 text-gray-700 border-gray-200'
                  }`}
                >
                  <option value="pending">Pending</option>
                  <option value="in-progress">In Progress</option>
                  <option value="completed">Completed</option>
                </select>
                </div>
              </div>
              
              {featureTasks.length > 0 && (
                <div className="mt-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">Task Progress</span>
                    <span className="text-sm font-semibold text-gray-900">{taskProgress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-black h-2 rounded-full transition-all duration-300"
                      style={{ width: `${taskProgress}%` }}
                    ></div>
                  </div>
                </div>
              )}

              {isExpanded && (
                <div className="mt-6 pt-6 border-t border-gray-200 space-y-6">
                  {featureTasks.length > 0 && (
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="font-semibold text-gray-900">Tasks</h4>
                        <button
                          onClick={() => {
                            const title = prompt('Enter task title:');
                            if (title && title.trim()) {
                              const hours = prompt('Enter estimated hours (optional):') || '0';
                              const priority = prompt('Enter priority (high/medium/low):') || 'medium';
                              setNewFeatureTask({ title: title.trim(), estimatedHours: hours, priority });
                              addTaskToFeature(feature.id);
                            }
                          }}
                          className="px-3 py-1.5 bg-black text-white rounded-lg text-sm font-semibold hover:bg-gray-800 transition-all flex items-center gap-2"
                        >
                          <Plus className="w-3 h-3" />
                          Add Task
                        </button>
                      </div>
                      <div className="space-y-2">
                        {featureTasks.map((task) => (
                          <div key={task.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                            <button
                              onClick={() => updateFeatureTaskStatus(feature.id, task.id, 
                                task.status === 'completed' ? 'pending' : 
                                task.status === 'pending' ? 'in-progress' : 'completed'
                              )}
                              className="flex-shrink-0"
                            >
                              {task.status === 'completed' ? (
                                <CheckCircle className="w-5 h-5 text-green-600" />
                              ) : task.status === 'in-progress' ? (
                                <Clock className="w-5 h-5 text-yellow-600" />
                              ) : (
                                <Circle className="w-5 h-5 text-gray-400" />
                              )}
                            </button>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="font-medium text-gray-900">{task.title}</span>
                                {task.priority && (
                                  <span className={`px-2 py-0.5 text-xs rounded-full ${
                                    task.priority === 'high' ? 'bg-red-100 text-red-700' :
                                    task.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                                    'bg-gray-100 text-gray-700'
                                  }`}>
                                    {task.priority}
                                  </span>
                                )}
                              </div>
                              <div className="flex items-center gap-4 text-xs text-gray-500">
                                {task.estimatedHours > 0 && (
                                  <span>Est: {task.estimatedHours}h</span>
                                )}
                                <input
                                  type="number"
                                  value={task.actualHours || 0}
                                  onChange={(e) => updateFeatureTaskHours(feature.id, task.id, e.target.value)}
                                  placeholder="Actual hours"
                                  className="w-20 px-2 py-1 bg-white border border-gray-300 rounded text-xs"
                                />
                                <span>h actual</span>
                              </div>
              </div>
            </div>
          ))}
        </div>
                      <div className="mt-4 p-3 bg-blue-50 rounded-xl">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-700">Task Hours:</span>
                          <span className="font-semibold text-gray-900">
                            {taskActualHours}h / {taskEstimatedHours}h
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  {feature.linkedMilestone && (
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Linked Milestone</h4>
                      <div className="p-3 bg-blue-50 rounded-xl">
                        {(() => {
                          const milestone = startupData.milestones.find(m => m.id === feature.linkedMilestone);
                          return milestone ? (
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <Target className="w-5 h-5 text-blue-600" />
                                <div>
                                  <span className="font-medium text-gray-900">{milestone.title}</span>
                                  <div className="text-xs text-gray-600 mt-1">
                                    {milestone.status} • Due: {milestone.dueDate}
                                  </div>
                                </div>
                              </div>
                              <div className="text-right">
                                <div className="text-sm font-semibold text-gray-900">{milestone.progress}%</div>
                                <div className="text-xs text-gray-600">Progress</div>
                              </div>
                            </div>
                          ) : null;
                        })()}
                      </div>
                    </div>
                  )}

                  {feature.dependencies && feature.dependencies.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Dependencies</h4>
                      <div className="flex flex-wrap gap-2">
                        {feature.dependencies.map((depId) => {
                          const depFeature = mvpFeatures.find(f => f.id === depId);
                          return depFeature ? (
                            <span key={depId} className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm">
                              {depFeature.title}
                            </span>
                          ) : null;
                        })}
                      </div>
                    </div>
                  )}

                  {feature.notes && feature.notes.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Notes</h4>
                      <div className="space-y-2">
                        {feature.notes.map((note, idx) => (
                          <div key={idx} className="p-3 bg-gray-50 rounded-xl text-sm text-gray-700">
                            {note}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {!isExpanded && featureTasks.length > 0 && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <span>{featureTasks.length} tasks • {completedTasks} completed</span>
                    <button
                      onClick={() => {
                        setSelectedFeature(feature.id);
                        setShowFeatureDetails(true);
                      }}
                      className="text-black font-semibold hover:underline"
                    >
                      View all tasks →
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    );

    const renderWireframes = () => (
      <div className="space-y-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-2xl font-bold text-gray-900">Wireframes</h3>
            <p className="text-gray-600">Create and manage your product wireframes</p>
          </div>
          <button className="px-4 py-2 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-colors font-semibold flex items-center gap-2">
            <Plus className="w-4 h-4" />
            New Wireframe
          </button>
        </div>
        {wireframes.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border-2 border-dashed border-gray-300">
            <Layout className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h4 className="text-xl font-bold text-gray-900 mb-2">No Wireframes Yet</h4>
            <p className="text-gray-600 mb-6">Start by creating your first wireframe to visualize your product structure</p>
            <button className="px-6 py-3 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-colors font-semibold">
              Create First Wireframe
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {wireframes.map((wf) => (
              <div key={wf.id} className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200 hover:border-gray-900 transition-all">
                <div className="aspect-video bg-gray-100 rounded-xl mb-4 flex items-center justify-center">
                  <Layout className="w-12 h-12 text-gray-400" />
                </div>
                <h4 className="font-bold text-gray-900 mb-2">{wf.name}</h4>
                <p className="text-sm text-gray-600 mb-4">{wf.description}</p>
                <div className="flex gap-2">
                  <button className="flex-1 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors text-sm font-semibold">
                    View
                  </button>
                  <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                    <Edit3 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );

    const renderUserFlows = () => (
      <div className="space-y-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-2xl font-bold text-gray-900">User Flows</h3>
            <p className="text-gray-600">Map out user journeys and interactions</p>
          </div>
          <button className="px-4 py-2 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-colors font-semibold flex items-center gap-2">
            <Plus className="w-4 h-4" />
            New Flow
          </button>
        </div>
        {userFlows.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border-2 border-dashed border-gray-300">
            <GitBranch className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h4 className="text-xl font-bold text-gray-900 mb-2">No User Flows Yet</h4>
            <p className="text-gray-600 mb-6">Create user flows to visualize how users navigate through your product</p>
            <button className="px-6 py-3 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-colors font-semibold">
              Create First Flow
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {userFlows.map((flow) => (
              <div key={flow.id} className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200 hover:border-gray-900 transition-all">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                    <GitBranch className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-gray-900">{flow.name}</h4>
                    <p className="text-sm text-gray-600">{flow.steps} steps</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button className="flex-1 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors text-sm font-semibold">
                    View Flow
                  </button>
                  <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                    <Edit3 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );

    const renderLandingPage = () => (
      <div className="space-y-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-2xl font-bold text-gray-900">Landing Page</h3>
            <p className="text-gray-600">Design and manage your product landing page</p>
          </div>
          <button className="px-4 py-2 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-colors font-semibold flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Add Section
          </button>
        </div>
        <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 bg-green-100 rounded-xl flex items-center justify-center">
              <Globe className="w-8 h-8 text-green-600" />
            </div>
            <div className="flex-1">
              <h4 className="text-xl font-bold text-gray-900 mb-1">Landing Page Status</h4>
              <p className="text-gray-600 capitalize">Status: {landingPage.status}</p>
            </div>
            <select
              value={landingPage.status}
              onChange={(e) => setLandingPage({...landingPage, status: e.target.value})}
              className="px-4 py-2 rounded-xl border-2 border-gray-300 font-semibold"
            >
              <option value="pending">Pending</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
          </div>
          {landingPage.sections.length === 0 ? (
            <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-xl">
              <p className="text-gray-600 mb-4">No sections added yet</p>
              <button className="px-6 py-3 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-colors font-semibold">
                Add First Section
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {landingPage.sections.map((section, idx) => (
                <div key={idx} className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-gray-900">{section.name}</span>
                    <button className="text-gray-500 hover:text-gray-900">
                      <Edit3 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );

    const renderPrototype = () => (
      <div className="space-y-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-2xl font-bold text-gray-900">Prototype</h3>
            <p className="text-gray-600">Manage your interactive prototype</p>
          </div>
          <button className="px-4 py-2 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-colors font-semibold flex items-center gap-2">
            <Plus className="w-4 h-4" />
            New Version
          </button>
        </div>
        <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 bg-orange-100 rounded-xl flex items-center justify-center">
              <Rocket className="w-8 h-8 text-orange-600" />
            </div>
            <div className="flex-1">
              <h4 className="text-xl font-bold text-gray-900 mb-1">Prototype v{prototype.version}</h4>
              <p className="text-gray-600 capitalize">Status: {prototype.status}</p>
            </div>
            <select
              value={prototype.status}
              onChange={(e) => setPrototype({...prototype, status: e.target.value})}
              className="px-4 py-2 rounded-xl border-2 border-gray-300 font-semibold"
            >
              <option value="pending">Pending</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
          </div>
          {prototype.url ? (
            <div className="space-y-4">
              <div className="aspect-video bg-gray-100 rounded-xl flex items-center justify-center">
                <Rocket className="w-16 h-16 text-gray-400" />
              </div>
              <div className="flex gap-3">
                <input
                  type="text"
                  value={prototype.url}
                  onChange={(e) => setPrototype({...prototype, url: e.target.value})}
                  placeholder="Prototype URL (Figma, Framer, etc.)"
                  className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                />
                <button className="px-6 py-3 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-colors font-semibold">
                  Open
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-xl">
              <Rocket className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 mb-4">No prototype URL added yet</p>
              <button className="px-6 py-3 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-colors font-semibold">
                Add Prototype URL
              </button>
            </div>
          )}
        </div>
      </div>
    );

    const renderUIKit = () => (
      <div className="space-y-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-2xl font-bold text-gray-900">UI Kit</h3>
            <p className="text-gray-600">Manage your design system components</p>
          </div>
          <button className="px-4 py-2 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-colors font-semibold flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Add Component
          </button>
        </div>
        {uiKit.components.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border-2 border-dashed border-gray-300">
            <Palette className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h4 className="text-xl font-bold text-gray-900 mb-2">No UI Components Yet</h4>
            <p className="text-gray-600 mb-6">Start building your design system by adding UI components</p>
            <button className="px-6 py-3 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-colors font-semibold">
              Add First Component
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {uiKit.components.map((component) => (
              <div key={component.id} className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200 hover:border-gray-900 transition-all">
                <div className="aspect-video bg-gray-100 rounded-xl mb-4 flex items-center justify-center">
                  <Palette className="w-12 h-12 text-gray-400" />
                </div>
                <h4 className="font-bold text-gray-900 mb-2">{component.name}</h4>
                <p className="text-sm text-gray-600 mb-4">{component.category}</p>
                <div className="flex gap-2">
                  <button className="flex-1 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors text-sm font-semibold">
                    View
                  </button>
                  <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                    <Edit3 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );

    const renderArchitecture = () => (
      <div className="space-y-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-2xl font-bold text-gray-900">Technical Architecture</h3>
            <p className="text-gray-600">Document your system architecture and technical decisions</p>
          </div>
          <button className="px-4 py-2 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-colors font-semibold flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Add Diagram
          </button>
        </div>
        {techArchitecture.diagrams.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border-2 border-dashed border-gray-300">
            <Code className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h4 className="text-xl font-bold text-gray-900 mb-2">No Architecture Diagrams Yet</h4>
            <p className="text-gray-600 mb-6">Document your technical architecture with diagrams and specifications</p>
            <button className="px-6 py-3 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-colors font-semibold">
              Add First Diagram
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {techArchitecture.diagrams.map((diagram) => (
              <div key={diagram.id} className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200 hover:border-gray-900 transition-all">
                <div className="aspect-video bg-gray-100 rounded-xl mb-4 flex items-center justify-center">
                  <Code className="w-12 h-12 text-gray-400" />
                </div>
                <h4 className="font-bold text-gray-900 mb-2">{diagram.name}</h4>
                <p className="text-sm text-gray-600 mb-4">{diagram.type}</p>
                <div className="flex gap-2">
                  <button className="flex-1 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors text-sm font-semibold">
                    View
                  </button>
                  <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                    <Edit3 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );

    const renderPRDs = () => (
      <div className="space-y-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-2xl font-bold text-gray-900">Feature PRDs</h3>
            <p className="text-gray-600">Product Requirements Documents for each feature</p>
          </div>
          <button className="px-4 py-2 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-colors font-semibold flex items-center gap-2">
            <Plus className="w-4 h-4" />
            New PRD
          </button>
        </div>
        {featurePRDs.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border-2 border-dashed border-gray-300">
            <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h4 className="text-xl font-bold text-gray-900 mb-2">No PRDs Yet</h4>
            <p className="text-gray-600 mb-6">Create Product Requirements Documents to define your features</p>
            <button className="px-6 py-3 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-colors font-semibold">
              Create First PRD
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {featurePRDs.map((prd) => (
              <div key={prd.id} className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200 hover:border-gray-900 transition-all">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <FileText className="w-5 h-5 text-gray-600" />
                      <h4 className="text-lg font-bold text-gray-900">{prd.title}</h4>
                      <span className="px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-700">
                        {prd.status}
                      </span>
                    </div>
                    <p className="text-gray-600 mb-3">{prd.description}</p>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span>Version {prd.version}</span>
                      <span>•</span>
                      <span>Last updated {prd.updatedAt}</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors text-sm font-semibold">
                      View
                    </button>
                    <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                      <Edit3 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );

    const renderSprints = () => (
      <div className="space-y-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-2xl font-bold text-gray-900">Sprint Schedules</h3>
            <p className="text-gray-600">Plan and track your development sprints</p>
          </div>
          <button className="px-4 py-2 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-colors font-semibold flex items-center gap-2">
            <Plus className="w-4 h-4" />
            New Sprint
          </button>
        </div>
        {sprintSchedules.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border-2 border-dashed border-gray-300">
            <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h4 className="text-xl font-bold text-gray-900 mb-2">No Sprints Scheduled</h4>
            <p className="text-gray-600 mb-6">Create sprint schedules to organize your development timeline</p>
            <button className="px-6 py-3 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-colors font-semibold">
              Create First Sprint
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {sprintSchedules.map((sprint) => (
              <div key={sprint.id} className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200 hover:border-gray-900 transition-all">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <Calendar className="w-5 h-5 text-gray-600" />
                      <h4 className="text-lg font-bold text-gray-900">{sprint.name}</h4>
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        sprint.status === 'active' ? 'bg-green-100 text-green-700' :
                        sprint.status === 'completed' ? 'bg-gray-100 text-gray-700' :
                        'bg-yellow-100 text-yellow-700'
                      }`}>
                        {sprint.status}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                      <span>{sprint.startDate} - {sprint.endDate}</span>
                      <span>•</span>
                      <span>{sprint.tasks} tasks</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-gray-900 h-2 rounded-full transition-all"
                        style={{ width: `${sprint.progress}%` }}
                      ></div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors text-sm font-semibold">
                      View
                    </button>
                    <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                      <Edit3 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">MVP Execution</h2>
            <p className="text-gray-600">Complete MVP workspace with all tools and resources</p>
          </div>
        </div>

        {/* MVP Tabs */}
        <div className="bg-white rounded-2xl p-2 shadow-lg border border-gray-100 mb-6">
          <div className="flex flex-wrap gap-2">
            {mvpTabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeMvpTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveMvpTab(tab.id)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl font-semibold transition-all duration-300 ${
                    isActive
                      ? 'bg-gray-900 text-white shadow-lg'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab Content */}
        {activeMvpTab === 'overview' && renderOverview()}
        {activeMvpTab === 'tasks' && renderTasks()}
        {activeMvpTab === 'wireframes' && renderWireframes()}
        {activeMvpTab === 'userflows' && renderUserFlows()}
        {activeMvpTab === 'landing' && renderLandingPage()}
        {activeMvpTab === 'prototype' && renderPrototype()}
        {activeMvpTab === 'uikit' && renderUIKit()}
        {activeMvpTab === 'architecture' && renderArchitecture()}
        {activeMvpTab === 'prds' && renderPRDs()}
        {activeMvpTab === 'sprints' && renderSprints()}
      </div>
    );
  };

  const renderEvents = () => {
    const handleAddEvent = () => {
      if (newEvent.title.trim() && newEvent.date) {
        const event = {
          id: Date.now(),
          ...newEvent,
          attendees: []
        };
        setEvents([...events, event]);
        setNewEvent({ title: '', description: '', date: '', time: '', type: 'meeting' });
        setShowEventModal(false);
      }
    };

    const handleRSVP = (eventId) => {
      if (rsvpedEvents.includes(eventId)) {
        setRsvpedEvents(rsvpedEvents.filter(id => id !== eventId));
      } else {
        setRsvpedEvents([...rsvpedEvents, eventId]);
      }
    };

    const handleViewEvent = (event) => {
      setSelectedEvent(event);
      setShowEventDetails(true);
    };

    const filteredNearbyEvents = nearbyEvents.filter(event => {
      if (eventFilters.search && !event.title.toLowerCase().includes(eventFilters.search.toLowerCase()) && 
          !event.description.toLowerCase().includes(eventFilters.search.toLowerCase())) {
        return false;
      }
      if (eventFilters.type !== 'all' && event.type !== eventFilters.type) {
        return false;
      }
      if (eventFilters.category !== 'all' && event.category !== eventFilters.category) {
        return false;
      }
      if (eventFilters.price === 'free' && event.price !== 'Free') {
        return false;
      }
      if (eventFilters.price === 'paid' && event.price === 'Free') {
        return false;
      }
      if (eventFilters.dateRange === 'upcoming' && new Date(event.date) < new Date()) {
        return false;
      }
      return true;
    });

    const upcomingEvents = events.filter(e => new Date(e.date) >= new Date()).sort((a, b) => new Date(a.date) - new Date(b.date));
    const pastEvents = events.filter(e => new Date(e.date) < new Date()).sort((a, b) => new Date(b.date) - new Date(a.date));

    const getEventTypeColor = (type) => {
      switch(type) {
        case 'pitch': return 'bg-purple-100 text-purple-700 border-purple-200';
        case 'networking': return 'bg-blue-100 text-blue-700 border-blue-200';
        case 'demo-day': return 'bg-green-100 text-green-700 border-green-200';
        case 'conference': return 'bg-orange-100 text-orange-700 border-orange-200';
        case 'workshop': return 'bg-pink-100 text-pink-700 border-pink-200';
        default: return 'bg-gray-100 text-gray-700 border-gray-200';
      }
    };

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Events & Networking</h2>
            <p className="text-gray-600">Discover nearby events to pitch, network, and grow your startup</p>
          </div>
          <button
            onClick={() => setShowEventModal(true)}
            className="px-6 py-3 bg-black text-white rounded-xl font-semibold hover:bg-gray-800 transition-all duration-300 flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Your Event
          </button>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-gray-200">
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={eventFilters.search}
                onChange={(e) => setEventFilters({...eventFilters, search: e.target.value})}
                placeholder="Search events by name, description, or tags..."
                className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <select
              value={eventFilters.type}
              onChange={(e) => setEventFilters({...eventFilters, type: e.target.value})}
              className="p-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent text-sm"
            >
              <option value="all">All Types</option>
              <option value="pitch">Pitch Events</option>
              <option value="networking">Networking</option>
              <option value="demo-day">Demo Days</option>
              <option value="conference">Conferences</option>
              <option value="workshop">Workshops</option>
            </select>
            <select
              value={eventFilters.category}
              onChange={(e) => setEventFilters({...eventFilters, category: e.target.value})}
              className="p-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent text-sm"
            >
              <option value="all">All Categories</option>
              <option value="Pitch Event">Pitch Events</option>
              <option value="Networking">Networking</option>
              <option value="Demo Day">Demo Days</option>
              <option value="Conference">Conferences</option>
              <option value="Workshop">Workshops</option>
            </select>
            <select
              value={eventFilters.price}
              onChange={(e) => setEventFilters({...eventFilters, price: e.target.value})}
              className="p-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent text-sm"
            >
              <option value="all">All Prices</option>
              <option value="free">Free Events</option>
              <option value="paid">Paid Events</option>
            </select>
            <select
              value={eventFilters.dateRange}
              onChange={(e) => setEventFilters({...eventFilters, dateRange: e.target.value})}
              className="p-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent text-sm"
            >
              <option value="upcoming">Upcoming</option>
              <option value="all">All Dates</option>
            </select>
            <button
              onClick={() => setEventFilters({search: '', type: 'all', category: 'all', location: 'all', dateRange: 'upcoming', price: 'all'})}
              className="p-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all text-sm font-semibold"
            >
              Clear Filters
            </button>
          </div>
        </div>

        {/* Featured Events */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-2xl font-bold text-gray-900">Featured Events</h3>
            <span className="text-sm text-gray-600">{filteredNearbyEvents.filter(e => e.featured).length} events</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {filteredNearbyEvents.filter(e => e.featured).map((event) => (
              <div key={event.id} className="bg-white rounded-2xl shadow-lg border-2 border-gray-200 hover:border-black transition-all overflow-hidden group">
                <div className="relative h-48 bg-gradient-to-br from-purple-500 to-pink-500">
                  {event.image && (
                    <img src={event.image} alt={event.title} className="w-full h-full object-cover" />
                  )}
                  <div className="absolute top-3 right-3">
                    <span className="px-3 py-1 bg-black/80 text-white text-xs font-semibold rounded-full backdrop-blur-sm">
                      Featured
                    </span>
                  </div>
                  <div className="absolute top-3 left-3">
                    <span className={`px-3 py-1 text-xs font-semibold rounded-full border backdrop-blur-sm ${getEventTypeColor(event.type)}`}>
                      {event.category}
                    </span>
                  </div>
                </div>
                <div className="p-6">
                  <h4 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">{event.title}</h4>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">{event.description}</p>
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Calendar className="w-4 h-4" />
                      <span>{new Date(event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Clock className="w-4 h-4" />
                      <span>{event.time}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <MapPin className="w-4 h-4" />
                      <span>{event.venue} • {event.distance}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Users className="w-4 h-4" />
                      <span>{event.registered} / {event.attendees} registered</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-lg font-bold text-gray-900">{event.price}</span>
                    <span className="text-sm text-gray-500">{event.organizer}</span>
                  </div>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {event.tags.slice(0, 3).map((tag, idx) => (
                      <span key={idx} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleViewEvent(event)}
                      className="flex-1 py-2.5 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-all text-sm"
                    >
                      View Details
                    </button>
                    <button
                      onClick={() => handleRSVP(event.id)}
                      className={`flex-1 py-2.5 rounded-xl font-semibold transition-all text-sm ${
                        rsvpedEvents.includes(event.id)
                          ? 'bg-green-100 text-green-700 hover:bg-green-200'
                          : 'bg-black text-white hover:bg-gray-800'
                      }`}
                    >
                      {rsvpedEvents.includes(event.id) ? '✓ RSVPed' : 'RSVP'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* All Nearby Events */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-2xl font-bold text-gray-900">All Nearby Events</h3>
            <span className="text-sm text-gray-600">{filteredNearbyEvents.length} events found</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredNearbyEvents.map((event) => (
              <div key={event.id} className="bg-white rounded-2xl p-6 shadow-lg border-2 border-gray-200 hover:border-black transition-all">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <div className={`w-16 h-16 rounded-xl flex items-center justify-center ${getEventTypeColor(event.type)}`}>
                      {event.type === 'pitch' && <Rocket className="w-8 h-8" />}
                      {event.type === 'networking' && <Users className="w-8 h-8" />}
                      {event.type === 'demo-day' && <Zap className="w-8 h-8" />}
                      {event.type === 'conference' && <Globe className="w-8 h-8" />}
                      {event.type === 'workshop' && <BookOpen className="w-8 h-8" />}
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className="text-lg font-bold text-gray-900 mb-1">{event.title}</h4>
                        <p className="text-sm text-gray-600 line-clamp-2">{event.description}</p>
                      </div>
                    </div>
                    <div className="space-y-1 mb-3">
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <Calendar className="w-3 h-3" />
                        <span>{new Date(event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                        <span>•</span>
                        <Clock className="w-3 h-3" />
                        <span>{event.time.split(' - ')[0]}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <MapPin className="w-3 h-3" />
                        <span>{event.venue} • {event.distance}</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-semibold text-gray-900">{event.price}</span>
                        <span className="text-xs text-gray-500">{event.registered}/{event.attendees}</span>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleViewEvent(event)}
                          className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg text-xs font-semibold hover:bg-gray-200 transition-all"
                        >
                          View
                        </button>
                        <button
                          onClick={() => handleRSVP(event.id)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                            rsvpedEvents.includes(event.id)
                              ? 'bg-green-100 text-green-700'
                              : 'bg-black text-white hover:bg-gray-800'
                          }`}
                        >
                          {rsvpedEvents.includes(event.id) ? '✓' : 'RSVP'}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Your Events */}
        <div className="mt-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">Your Events</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            {upcomingEvents.map((event) => (
              <div key={event.id} className="bg-white rounded-2xl p-6 shadow-lg border-2 border-gray-200 hover:border-black transition-all">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className={`w-3 h-3 rounded-full ${
                        event.type === 'meeting' ? 'bg-blue-500' :
                        event.type === 'event' ? 'bg-purple-500' :
                        'bg-green-500'
                      }`}></div>
                      <h3 className="text-lg font-bold text-gray-900">{event.title}</h3>
                      <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full capitalize">
                        {event.type}
                      </span>
                    </div>
                    {event.description && (
                      <p className="text-gray-600 mb-3 text-sm">{event.description}</p>
                    )}
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>{new Date(event.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                      </div>
                      {event.time && (
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          <span>{event.time}</span>
                        </div>
                      )}
                      {event.attendees && event.attendees.length > 0 && (
                        <div className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          <span>{event.attendees.length} attendees</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {upcomingEvents.length === 0 && (
            <div className="bg-gray-50 rounded-2xl p-8 text-center">
              <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-600">No upcoming events</p>
            </div>
          )}
        </div>

        {/* Event Details Modal */}
        {showEventDetails && selectedEvent && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
            <div className="bg-white rounded-3xl p-8 max-w-4xl w-full my-8 shadow-2xl">
              <div className="flex items-start justify-between mb-6">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <span className={`px-3 py-1 text-sm font-semibold rounded-full border ${getEventTypeColor(selectedEvent.type)}`}>
                      {selectedEvent.category}
                    </span>
                    {selectedEvent.featured && (
                      <span className="px-3 py-1 bg-black text-white text-sm font-semibold rounded-full">
                        Featured
                      </span>
                    )}
                  </div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-3">{selectedEvent.title}</h2>
                  <p className="text-lg text-gray-600 mb-4">{selectedEvent.description}</p>
                </div>
                <button
                  onClick={() => {
                    setShowEventDetails(false);
                    setSelectedEvent(null);
                  }}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              {selectedEvent.image && (
                <div className="mb-6 rounded-2xl overflow-hidden">
                  <img src={selectedEvent.image} alt={selectedEvent.title} className="w-full h-64 object-cover" />
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="bg-gray-50 rounded-2xl p-6">
                  <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Calendar className="w-5 h-5" />
                    Date & Time
                  </h3>
                  <div className="space-y-2">
                    <p className="text-gray-700">
                      <span className="font-semibold">Date:</span> {new Date(selectedEvent.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                    </p>
                    <p className="text-gray-700">
                      <span className="font-semibold">Time:</span> {selectedEvent.time}
                    </p>
                  </div>
                </div>
                <div className="bg-gray-50 rounded-2xl p-6">
                  <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <MapPin className="w-5 h-5" />
                    Location
                  </h3>
                  <div className="space-y-2">
                    <p className="text-gray-700 font-semibold">{selectedEvent.venue}</p>
                    <p className="text-gray-600">{selectedEvent.location}</p>
                    <p className="text-sm text-gray-500 flex items-center gap-1">
                      <Navigation className="w-4 h-4" />
                      {selectedEvent.distance} away
                    </p>
                  </div>
                </div>
                <div className="bg-gray-50 rounded-2xl p-6">
                  <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    Attendance
                  </h3>
                  <div className="space-y-2">
                    <p className="text-gray-700">
                      <span className="font-semibold">{selectedEvent.registered}</span> / {selectedEvent.attendees} registered
                    </p>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-black h-2 rounded-full"
                        style={{ width: `${(selectedEvent.registered / selectedEvent.attendees) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 rounded-2xl p-6">
                  <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <DollarSign className="w-5 h-5" />
                    Pricing
                  </h3>
                  <p className="text-2xl font-bold text-gray-900">{selectedEvent.price}</p>
                  <p className="text-sm text-gray-600 mt-1">Organized by {selectedEvent.organizer}</p>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="font-semibold text-gray-900 mb-3">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedEvent.tags.map((tag, idx) => (
                    <span key={idx} className="px-3 py-1.5 bg-gray-100 text-gray-700 text-sm rounded-full font-medium">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => handleRSVP(selectedEvent.id)}
                  className={`flex-1 py-4 rounded-xl font-semibold transition-all ${
                    rsvpedEvents.includes(selectedEvent.id)
                      ? 'bg-green-100 text-green-700 hover:bg-green-200'
                      : 'bg-black text-white hover:bg-gray-800'
                  }`}
                >
                  {rsvpedEvents.includes(selectedEvent.id) ? '✓ You\'re Registered' : 'Register Now'}
                </button>
                <button className="px-6 py-4 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-all flex items-center gap-2">
                  <Share2 className="w-4 h-4" />
                  Share
                </button>
                <button className="px-6 py-4 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-all flex items-center gap-2">
                  <Bookmark className="w-4 h-4" />
                  Save
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Add Event Modal */}
        {showEventModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-3xl p-8 max-w-2xl w-full">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Add Your Event</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Title *</label>
                  <input
                    type="text"
                    value={newEvent.title}
                    onChange={(e) => setNewEvent({...newEvent, title: e.target.value})}
                    placeholder="e.g., Team Standup, Demo Day"
                    className="w-full p-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <textarea
                    value={newEvent.description}
                    onChange={(e) => setNewEvent({...newEvent, description: e.target.value})}
                    placeholder="Event description..."
                    className="w-full h-24 p-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent resize-none"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Date *</label>
                    <input
                      type="date"
                      value={newEvent.date}
                      onChange={(e) => setNewEvent({...newEvent, date: e.target.value})}
                      className="w-full p-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Time</label>
                    <input
                      type="time"
                      value={newEvent.time}
                      onChange={(e) => setNewEvent({...newEvent, time: e.target.value})}
                      className="w-full p-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
                  <select
                    value={newEvent.type}
                    onChange={(e) => setNewEvent({...newEvent, type: e.target.value})}
                    className="w-full p-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent"
                  >
                    <option value="meeting">Meeting</option>
                    <option value="event">Event</option>
                    <option value="deadline">Deadline</option>
                  </select>
                </div>
              </div>
              <div className="flex gap-3 mt-8">
                <button
                  onClick={() => setShowEventModal(false)}
                  className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddEvent}
                  className="flex-1 py-3 bg-black text-white rounded-xl font-semibold hover:bg-gray-800 transition-all"
                >
                  Add Event
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderJourney = () => {
    const stageOrder = ['idea', 'validation', 'mvp', 'testing', 'launch', 'growth'];
    const getStageColor = (color) => {
      const colors = {
        purple: 'from-purple-500 to-purple-600',
        blue: 'from-blue-500 to-blue-600',
        green: 'from-green-500 to-green-600',
        yellow: 'from-yellow-500 to-yellow-600',
        orange: 'from-orange-500 to-orange-600',
        pink: 'from-pink-500 to-pink-600'
      };
      return colors[color] || 'from-gray-500 to-gray-600';
    };

    return (
      <div className="space-y-6">
        <div className="mb-6">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Startup Journey</h2>
          <p className="text-gray-600">Track your progress from idea to launch and beyond</p>
        </div>

        <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl p-8 text-white mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-2xl font-bold mb-2">Overall Progress</h3>
              <p className="text-white/80">Your startup journey completion</p>
            </div>
            <div className="text-right">
              <div className="text-4xl font-bold">
                {Math.round(Object.values(startupJourney.stages).reduce((sum, stage) => sum + stage.progress, 0) / 6)}%
              </div>
              <div className="text-sm text-white/80">Complete</div>
            </div>
          </div>
          <div className="w-full bg-white/20 rounded-full h-4 mt-4">
            <div
              className="bg-white h-4 rounded-full transition-all duration-500"
              style={{ width: `${Math.round(Object.values(startupJourney.stages).reduce((sum, stage) => sum + stage.progress, 0) / 6)}%` }}
            ></div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {stageOrder.map((stageKey, index) => {
            const stage = startupJourney.stages[stageKey];
            const isActive = startupJourney.currentStage === stageKey;
            const isCompleted = stage.completed;
            const isUnlocked = isCompleted || isActive || index === 0 || startupJourney.stages[stageOrder[index - 1]]?.completed;

            return (
              <div
                key={stageKey}
                className={`bg-white rounded-2xl p-6 shadow-lg border-2 transition-all ${
                  isActive ? 'border-black scale-105' : isCompleted ? 'border-green-500' : isUnlocked ? 'border-gray-200' : 'border-gray-100 opacity-50'
                }`}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${getStageColor(stage.color)} flex items-center justify-center text-white font-bold text-lg`}>
                    {index + 1}
                  </div>
                  {isCompleted && <CheckCircle className="w-6 h-6 text-green-500" />}
                  {isActive && <Zap className="w-6 h-6 text-black" />}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{stage.name}</h3>
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600">Progress</span>
                    <span className="text-sm font-semibold text-gray-900">{stage.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all bg-gradient-to-r ${getStageColor(stage.color)}`}
                      style={{ width: `${stage.progress}%` }}
                    ></div>
                  </div>
                </div>
                {isUnlocked && (
                  <button
                    onClick={() => {
                      const stageMap = {
                        idea: 'overview',
                        validation: 'validation',
                        mvp: 'mvp',
                        testing: 'mvp',
                        launch: 'launch',
                        growth: 'analytics'
                      };
                      setActiveTab(stageMap[stageKey] || 'overview');
                    }}
                    className="w-full py-2 bg-black text-white rounded-xl font-semibold hover:bg-gray-800 transition-all text-sm"
                  >
                    {isActive ? 'Continue' : isCompleted ? 'Review' : 'Start'}
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderValidation = () => {
    return (
      <div className="mt-6">
        <ValidationEngine embedded={true} />
      </div>
    );
  };

  const renderValidationOld = () => {
    const completedInterviews = customerInterviews.filter(i => i.status === 'completed').length;
    const totalInterviews = customerInterviews.length;
    const avgScore = customerInterviews.filter(i => i.score).reduce((sum, i) => sum + i.score, 0) / completedInterviews || 0;
    const overallValidationScore = Math.round(
      (validationScorecard.problemValidation + 
       validationScorecard.solutionFit + 
       validationScorecard.marketSize + 
       validationScorecard.competition + 
       validationScorecard.businessModel + 
       validationScorecard.teamReadiness) / 6
    );

    return (
      <div className="space-y-6">
        <div className="mb-6">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Idea Validation</h2>
          <p className="text-gray-600">Comprehensive validation tools to validate your startup idea before building</p>
        </div>

        {/* Validation Scorecard */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl p-8 text-white mb-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-2xl font-bold mb-2">Overall Validation Score</h3>
              <p className="text-white/90">Your idea validation progress</p>
            </div>
            <div className="text-right">
              <div className="text-5xl font-bold">{overallValidationScore}%</div>
              <div className="text-sm text-white/80">
                {overallValidationScore >= 80 ? 'Strong Validation' : 
                 overallValidationScore >= 60 ? 'Moderate Validation' : 
                 'Needs More Validation'}
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {Object.entries(validationScorecard).map(([key, value]) => (
              <div key={key} className="bg-white/20 rounded-xl p-4 backdrop-blur-sm">
                <div className="text-sm text-white/80 mb-2 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</div>
                <div className="text-2xl font-bold mb-2">{value}%</div>
                <div className="w-full bg-white/20 rounded-full h-2">
                  <div className="bg-white h-2 rounded-full" style={{ width: `${value}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Customer Interviews */}
        <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <Users className="w-5 h-5" />
                Customer Interviews
              </h3>
              <p className="text-sm text-gray-600 mt-1">Track and analyze customer interviews</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="text-2xl font-bold text-gray-900">{completedInterviews} / {totalInterviews}</div>
                <div className="text-sm text-gray-600">Completed</div>
              </div>
              <button
                onClick={() => {
                  setSelectedInterview(null);
                  setShowInterviewModal(true);
                }}
                className="px-4 py-2 bg-black text-white rounded-xl font-semibold hover:bg-gray-800 transition-all flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Add Interview
              </button>
            </div>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
            <div className="bg-black h-3 rounded-full transition-all" style={{ width: `${(completedInterviews / totalInterviews) * 100}%` }}></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {customerInterviews.map((interview) => (
              <div
                key={interview.id}
                className="bg-gray-50 rounded-xl p-4 border-2 border-gray-200 hover:border-black transition-all cursor-pointer"
                onClick={() => {
                  setSelectedInterview(interview);
                  setShowInterviewModal(true);
                }}
              >
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h4 className="font-bold text-gray-900">{interview.name}</h4>
                    <p className="text-sm text-gray-600">{interview.role}</p>
                  </div>
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                    interview.status === 'completed' ? 'bg-green-100 text-green-700' :
                    interview.status === 'scheduled' ? 'bg-blue-100 text-blue-700' :
                    'bg-gray-100 text-gray-700'
                  }`}>
                    {interview.status}
                  </span>
                </div>
                {interview.score && (
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex">
                      {[...Array(10)].map((_, i) => (
                        <Star key={i} className={`w-4 h-4 ${i < interview.score ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
                      ))}
                    </div>
                    <span className="text-sm font-bold text-gray-900">{interview.score}/10</span>
                  </div>
                )}
                {interview.notes && (
                  <p className="text-sm text-gray-600 line-clamp-2">{interview.notes}</p>
                )}
                <div className="mt-3 flex items-center gap-2">
                  {interview.problemValidated && (
                    <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">Problem Validated</span>
                  )}
                  {interview.willingnessToPay && (
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      interview.willingnessToPay === 'high' ? 'bg-purple-100 text-purple-700' :
                      interview.willingnessToPay === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {interview.willingnessToPay} willingness to pay
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
          {completedInterviews > 0 && (
            <div className="mt-4 p-4 bg-blue-50 rounded-xl">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">Average Interview Score</span>
                <span className="text-2xl font-bold text-gray-900">{avgScore.toFixed(1)}/10</span>
              </div>
            </div>
          )}
        </div>

        {/* Problem-Solution Fit */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-gray-200">
            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Target className="w-5 h-5" />
              Problem Analysis
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Problem Description</label>
                <textarea
                  value={problemSolutionFit.problem.description}
                  onChange={(e) => setProblemSolutionFit({
                    ...problemSolutionFit,
                    problem: {...problemSolutionFit.problem, description: e.target.value}
                  })}
                  className="w-full h-24 p-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent resize-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Severity (1-10)</label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={problemSolutionFit.problem.severity}
                    onChange={(e) => setProblemSolutionFit({
                      ...problemSolutionFit,
                      problem: {...problemSolutionFit.problem, severity: parseInt(e.target.value)}
                    })}
                    className="w-full p-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Pain Level (1-10)</label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={problemSolutionFit.problem.painLevel}
                    onChange={(e) => setProblemSolutionFit({
                      ...problemSolutionFit,
                      problem: {...problemSolutionFit.problem, painLevel: parseInt(e.target.value)}
                    })}
                    className="w-full p-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Frequency</label>
                <select
                  value={problemSolutionFit.problem.frequency}
                  onChange={(e) => setProblemSolutionFit({
                    ...problemSolutionFit,
                    problem: {...problemSolutionFit.problem, frequency: e.target.value}
                  })}
                  className="w-full p-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent"
                >
                  <option value="hourly">Hourly</option>
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                </select>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-gray-200">
            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Rocket className="w-5 h-5" />
              Solution Analysis
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Solution Description</label>
                <textarea
                  value={problemSolutionFit.solution.description}
                  onChange={(e) => setProblemSolutionFit({
                    ...problemSolutionFit,
                    solution: {...problemSolutionFit.solution, description: e.target.value}
                  })}
                  className="w-full h-24 p-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent resize-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Uniqueness (1-10)</label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={problemSolutionFit.solution.uniqueness}
                    onChange={(e) => setProblemSolutionFit({
                      ...problemSolutionFit,
                      solution: {...problemSolutionFit.solution, uniqueness: parseInt(e.target.value)}
                    })}
                    className="w-full p-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Feasibility (1-10)</label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={problemSolutionFit.solution.feasibility}
                    onChange={(e) => setProblemSolutionFit({
                      ...problemSolutionFit,
                      solution: {...problemSolutionFit.solution, feasibility: parseInt(e.target.value)}
                    })}
                    className="w-full p-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent"
                  />
                </div>
              </div>
              <div className="bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl p-4 text-white">
                <div className="text-sm mb-1">Problem-Solution Fit Score</div>
                <div className="text-3xl font-bold">{problemSolutionFit.fit}%</div>
              </div>
            </div>
          </div>
        </div>

        {/* Value Proposition Canvas */}
        <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-gray-200">
          <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <Sparkles className="w-5 h-5" />
            Value Proposition Canvas
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="bg-purple-50 rounded-xl p-4 border-2 border-purple-200">
                <h4 className="font-bold text-gray-900 mb-3">Customer Profile</h4>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Customer Jobs</label>
                  <div className="space-y-2">
                    {valueProposition.customerJobs.map((job, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <input
                          type="text"
                          value={job}
                          onChange={(e) => {
                            const newJobs = [...valueProposition.customerJobs];
                            newJobs[idx] = e.target.value;
                            setValueProposition({...valueProposition, customerJobs: newJobs});
                          }}
                          className="flex-1 p-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent text-sm"
                        />
                      </div>
                    ))}
                    <button
                      onClick={() => setValueProposition({
                        ...valueProposition,
                        customerJobs: [...valueProposition.customerJobs, '']
                      })}
                      className="text-sm text-purple-600 hover:text-purple-800"
                    >
                      + Add Job
                    </button>
                  </div>
                </div>
              </div>
              <div className="bg-red-50 rounded-xl p-4 border-2 border-red-200">
                <label className="block text-sm font-medium text-gray-700 mb-2">Pains</label>
                <div className="space-y-2">
                  {valueProposition.pains.map((pain, idx) => (
                    <input
                      key={idx}
                      type="text"
                      value={pain}
                      onChange={(e) => {
                        const newPains = [...valueProposition.pains];
                        newPains[idx] = e.target.value;
                        setValueProposition({...valueProposition, pains: newPains});
                      }}
                      className="w-full p-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent text-sm"
                    />
                  ))}
                  <button
                    onClick={() => setValueProposition({
                      ...valueProposition,
                      pains: [...valueProposition.pains, '']
                    })}
                    className="text-sm text-red-600 hover:text-red-800"
                  >
                    + Add Pain
                  </button>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <div className="bg-green-50 rounded-xl p-4 border-2 border-green-200">
                <h4 className="font-bold text-gray-900 mb-3">Value Map</h4>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Pain Relievers</label>
                  <div className="space-y-2">
                    {valueProposition.painRelievers.map((reliever, idx) => (
                      <input
                        key={idx}
                        type="text"
                        value={reliever}
                        onChange={(e) => {
                          const newRelievers = [...valueProposition.painRelievers];
                          newRelievers[idx] = e.target.value;
                          setValueProposition({...valueProposition, painRelievers: newRelievers});
                        }}
                        className="w-full p-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent text-sm"
                      />
                    ))}
                    <button
                      onClick={() => setValueProposition({
                        ...valueProposition,
                        painRelievers: [...valueProposition.painRelievers, '']
                      })}
                      className="text-sm text-green-600 hover:text-green-800"
                    >
                      + Add Pain Reliever
                    </button>
                  </div>
                </div>
              </div>
              <div className="bg-blue-50 rounded-xl p-4 border-2 border-blue-200">
                <label className="block text-sm font-medium text-gray-700 mb-2">Gain Creators</label>
                <div className="space-y-2">
                  {valueProposition.gainCreators.map((gain, idx) => (
                    <input
                      key={idx}
                      type="text"
                      value={gain}
                      onChange={(e) => {
                        const newGains = [...valueProposition.gainCreators];
                        newGains[idx] = e.target.value;
                        setValueProposition({...valueProposition, gainCreators: newGains});
                      }}
                      className="w-full p-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent text-sm"
                    />
                  ))}
                  <button
                    onClick={() => setValueProposition({
                      ...valueProposition,
                      gainCreators: [...valueProposition.gainCreators, '']
                    })}
                    className="text-sm text-blue-600 hover:text-blue-800"
                  >
                    + Add Gain Creator
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Competitive Analysis */}
        <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              Competitive Analysis
            </h3>
            <button
              onClick={() => {
                setSelectedCompetitor(null);
                setShowCompetitorModal(true);
              }}
              className="px-4 py-2 bg-black text-white rounded-xl font-semibold hover:bg-gray-800 transition-all flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add Competitor
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {marketResearch.competitors.map((competitor) => (
              <div
                key={competitor.id}
                className="bg-gray-50 rounded-xl p-4 border-2 border-gray-200 hover:border-black transition-all cursor-pointer"
                onClick={() => {
                  setSelectedCompetitor(competitor);
                  setShowCompetitorModal(true);
                }}
              >
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-bold text-gray-900">{competitor.name}</h4>
                  <span className="text-sm text-gray-600">{competitor.marketShare}</span>
                </div>
                <div className="space-y-2">
                  <div>
                    <span className="text-xs text-gray-600">Strengths:</span>
                    <p className="text-sm text-gray-900">{competitor.strengths}</p>
                  </div>
                  <div>
                    <span className="text-xs text-gray-600">Weaknesses:</span>
                    <p className="text-sm text-gray-900">{competitor.weaknesses}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Market Research */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-gray-200">
            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Globe className="w-5 h-5" />
              Market Research
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Target Market</label>
                <textarea
                  value={marketResearch.targetMarket}
                  onChange={(e) => setMarketResearch({...marketResearch, targetMarket: e.target.value})}
                  className="w-full h-24 p-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent resize-none"
                  placeholder="Describe your target market..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Market Size</label>
                <input
                  type="text"
                  value={marketResearch.marketSize}
                  onChange={(e) => setMarketResearch({...marketResearch, marketSize: e.target.value})}
                  className="w-full p-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent"
                  placeholder="e.g., $12B+ market"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Pricing Strategy</label>
                <input
                  type="text"
                  value={marketResearch.pricingStrategy}
                  onChange={(e) => setMarketResearch({...marketResearch, pricingStrategy: e.target.value})}
                  className="w-full p-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Go-to-Market Strategy</label>
                <textarea
                  value={marketResearch.goToMarket}
                  onChange={(e) => setMarketResearch({...marketResearch, goToMarket: e.target.value})}
                  className="w-full h-20 p-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent resize-none"
                />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-gray-200">
            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" />
              Risk Assessment
            </h3>
            <div className="space-y-3">
              {risks.map((risk) => (
                <div key={risk.id} className="bg-gray-50 rounded-xl p-4 border-2 border-gray-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="px-2 py-1 bg-gray-200 text-gray-700 text-xs font-semibold rounded-full">
                      {risk.category}
                    </span>
                    <div className="flex gap-2">
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        risk.probability === 'high' ? 'bg-red-100 text-red-700' :
                        risk.probability === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-green-100 text-green-700'
                      }`}>
                        {risk.probability}
                      </span>
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        risk.impact === 'high' ? 'bg-red-100 text-red-700' :
                        risk.impact === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-green-100 text-green-700'
                      }`}>
                        {risk.impact}
                      </span>
                  </div>
                  </div>
                  <p className="text-sm text-gray-900 mb-2">{risk.description}</p>
                  <p className="text-xs text-gray-600">
                    <span className="font-semibold">Mitigation:</span> {risk.mitigation}
                  </p>
                </div>
              ))}
              </div>
                </div>
              </div>

        {/* Business Model Canvas */}
        <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-gray-200">
          <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <Building2 className="w-5 h-5" />
            Business Model Canvas
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(businessModel).map(([key, value]) => (
              <div key={key} className="bg-gray-50 rounded-xl p-4 border-2 border-gray-200">
                <h4 className="font-bold text-gray-900 mb-3 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</h4>
                {Array.isArray(value) ? (
                  <ul className="space-y-1">
                    {value.map((item, idx) => (
                      <li key={idx} className="text-sm text-gray-700">• {item}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-gray-700">{value}</p>
                )}
            </div>
            ))}
          </div>
        </div>

        {/* Validation Checklist */}
        <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <CheckCircle className="w-5 h-5" />
              Validation Checklist
            </h3>
            <div className="text-right">
              <div className="text-2xl font-bold text-gray-900">
                {validationChecklist.filter(item => item.completed).length} / {validationChecklist.length}
              </div>
              <div className="text-sm text-gray-600">Completed</div>
            </div>
          </div>
          <div className="space-y-4">
            {Object.entries(validationChecklist.reduce((acc, item) => {
              if (!acc[item.category]) acc[item.category] = [];
              acc[item.category].push(item);
              return acc;
            }, {})).map(([category, items]) => (
              <div key={category} className="border-2 border-gray-200 rounded-xl p-4">
                <h4 className="font-bold text-gray-900 mb-3">{category}</h4>
                <div className="space-y-2">
                  {items.map((item) => (
                    <div
                      key={item.id}
                      className={`flex items-center gap-3 p-3 rounded-lg ${
                        item.completed ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'
                      } border-2`}
                    >
                      <button
                        onClick={() => setValidationChecklist(prev => prev.map(i => 
                          i.id === item.id ? {...i, completed: !i.completed} : i
                        ))}
                        className={`w-6 h-6 rounded border-2 flex items-center justify-center transition-all ${
                          item.completed
                            ? 'bg-green-500 border-green-500 text-white'
                            : 'border-gray-300 hover:border-black'
                        }`}
                      >
                        {item.completed && <Check className="w-4 h-4" />}
                      </button>
                      <div className="flex-1">
                        <p className={`font-medium ${item.completed ? 'text-gray-600 line-through' : 'text-gray-900'}`}>
                          {item.item}
                        </p>
                      </div>
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        item.priority === 'high' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700'
                      }`}>
                        {item.priority}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Market Size Calculator */}
        <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-gray-200">
          <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            Market Size Calculator (TAM/SAM/SOM)
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white">
              <div className="text-sm mb-2 opacity-90">Total Addressable Market</div>
              <div className="text-3xl font-bold mb-2">${(marketSizeData.tam / 1000000000).toFixed(1)}B</div>
              <div className="text-xs opacity-75">All potential customers</div>
            </div>
            <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white">
              <div className="text-sm mb-2 opacity-90">Serviceable Addressable Market</div>
              <div className="text-3xl font-bold mb-2">${(marketSizeData.sam / 1000000000).toFixed(1)}B</div>
              <div className="text-xs opacity-75">Reachable customers</div>
            </div>
            <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white">
              <div className="text-sm mb-2 opacity-90">Serviceable Obtainable Market</div>
              <div className="text-3xl font-bold mb-2">${(marketSizeData.som / 1000000).toFixed(0)}M</div>
              <div className="text-xs opacity-75">Realistic market share</div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">TAM (Total Addressable Market)</label>
              <input
                type="number"
                value={marketSizeData.tam}
                onChange={(e) => setMarketSizeData({...marketSizeData, tam: parseInt(e.target.value) || 0})}
                className="w-full p-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Market Growth Rate (%)</label>
              <input
                type="number"
                value={marketSizeData.growthRate}
                onChange={(e) => setMarketSizeData({...marketSizeData, growthRate: parseInt(e.target.value) || 0})}
                className="w-full p-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">SAM (Serviceable Addressable Market)</label>
              <input
                type="number"
                value={marketSizeData.sam}
                onChange={(e) => setMarketSizeData({...marketSizeData, sam: parseInt(e.target.value) || 0})}
                className="w-full p-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">SOM (Serviceable Obtainable Market)</label>
              <input
                type="number"
                value={marketSizeData.som}
                onChange={(e) => setMarketSizeData({...marketSizeData, som: parseInt(e.target.value) || 0})}
                className="w-full p-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Interview Question Bank */}
        <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <MessageCircle className="w-5 h-5" />
              Interview Question Bank
            </h3>
            <button className="px-4 py-2 bg-black text-white rounded-xl font-semibold hover:bg-gray-800 transition-all flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Add Question
            </button>
          </div>
          <div className="space-y-4">
            {Object.entries(interviewQuestions.reduce((acc, q) => {
              if (!acc[q.category]) acc[q.category] = [];
              acc[q.category].push(q);
              return acc;
            }, {})).map(([category, questions]) => (
              <div key={category} className="border-2 border-gray-200 rounded-xl p-4">
                <h4 className="font-bold text-gray-900 mb-3">{category}</h4>
          <div className="space-y-3">
                  {questions.map((q) => (
                    <div key={q.id} className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-start justify-between mb-2">
                        <p className="font-medium text-gray-900 flex-1">{q.question}</p>
                        <div className="flex items-center gap-2 ml-4">
                          <span className="text-xs text-gray-600">Asked: {q.asked}</span>
                          <span className="text-xs text-green-600 font-semibold">Validated: {q.validated}</span>
                        </div>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                        <div
                          className="bg-green-500 h-2 rounded-full"
                          style={{ width: `${(q.validated / q.asked) * 100}%` }}
                        ></div>
                      </div>
              </div>
            ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Competitive Analysis Matrix */}
        <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-gray-200">
          <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            Competitive Analysis Matrix
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-gray-200">
                  <th className="text-left p-3 font-bold text-gray-900">Feature</th>
                  {marketResearch.competitors.map((comp) => (
                    <th key={comp.id} className="text-center p-3 font-bold text-gray-900">{comp.name}</th>
                  ))}
                  <th className="text-center p-3 font-bold text-gray-900">Your Solution</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-100">
                  <td className="p-3 font-medium text-gray-700">Pricing</td>
                  {marketResearch.competitors.map((comp) => (
                    <td key={comp.id} className="text-center p-3">
                      <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">$$$</span>
                    </td>
                  ))}
                  <td className="text-center p-3">
                    <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full font-semibold">$$</span>
                  </td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="p-3 font-medium text-gray-700">Features</td>
                  {marketResearch.competitors.map((comp) => (
                    <td key={comp.id} className="text-center p-3">
                      <div className="flex justify-center gap-1">
                        {[...Array(3)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        ))}
                      </div>
                    </td>
                  ))}
                  <td className="text-center p-3">
                    <div className="flex justify-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                  </td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="p-3 font-medium text-gray-700">User Experience</td>
                  {marketResearch.competitors.map((comp) => (
                    <td key={comp.id} className="text-center p-3">
                      <div className="flex justify-center gap-1">
                        {[...Array(2)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        ))}
                      </div>
                    </td>
                  ))}
                  <td className="text-center p-3">
                    <div className="flex justify-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                  </td>
                </tr>
                <tr>
                  <td className="p-3 font-medium text-gray-700">Market Share</td>
                  {marketResearch.competitors.map((comp) => (
                    <td key={comp.id} className="text-center p-3 text-sm text-gray-600">{comp.marketShare}</td>
                  ))}
                  <td className="text-center p-3">
                    <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full font-semibold">Growing</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Validation Insights */}
        <div className="bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl p-8 text-white">
          <h3 className="text-2xl font-bold mb-6">Validation Insights & Recommendations</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-6">
              <h4 className="font-bold mb-3 text-lg">✅ Strengths</h4>
              <ul className="space-y-2 text-sm">
                <li>• Strong problem validation (85% score)</li>
                <li>• Large market size ($50B TAM)</li>
                <li>• High customer interview scores (avg 8.0/10)</li>
                <li>• Clear value proposition</li>
              </ul>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-6">
              <h4 className="font-bold mb-3 text-lg">⚠️ Areas to Improve</h4>
              <ul className="space-y-2 text-sm">
                <li>• Competitive advantage needs strengthening</li>
                <li>• Unit economics validation pending</li>
                <li>• Need more customer interviews (target: 20+)</li>
                <li>• Solution uniqueness can be improved</li>
              </ul>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-6 md:col-span-2">
              <h4 className="font-bold mb-3 text-lg">🎯 Next Steps</h4>
              <ol className="space-y-2 text-sm list-decimal list-inside">
                <li>Conduct 10 more customer interviews focusing on pricing validation</li>
                <li>Complete unit economics analysis and financial projections</li>
                <li>Develop competitive differentiation strategy</li>
                <li>Create detailed go-to-market plan</li>
                <li>Build MVP prototype for user testing</li>
              </ol>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderLaunch = () => {
    const toggleChecklistItem = (id) => {
      setLaunchChecklist(prev => prev.map(item => 
        item.id === id ? {...item, completed: !item.completed} : item
      ));
    };

    const completedCount = launchChecklist.filter(item => item.completed).length;
    const totalCount = launchChecklist.length;
    const progress = Math.round((completedCount / totalCount) * 100);

    const groupedChecklist = launchChecklist.reduce((acc, item) => {
      if (!acc[item.category]) acc[item.category] = [];
      acc[item.category].push(item);
      return acc;
    }, {});

    return (
      <div className="space-y-6">
        {/* 45-Day Launch Program */}
        <div className="bg-gradient-to-br from-gray-900 to-black rounded-3xl p-8 md:p-12 border border-gray-800 mb-8">
          <div className="flex items-start justify-between mb-6">
            <div>
              <div className="inline-flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full mb-4">
                <Rocket className="w-5 h-5 text-white" />
                <span className="text-white font-medium text-sm">Automated Accelerator</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">
                THE 45-DAY LAUNCH PROGRAM
              </h2>
              <p className="text-gray-300 text-lg mb-4">
                The feature that makes BiggDate bigger than YC
              </p>
              <p className="text-gray-400">
                An automated accelerator that transforms your idea into a launch-ready startup in 45 days
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="bg-white/5 rounded-xl p-4 border border-white/10">
              <Clock className="w-6 h-6 text-white mb-3" />
              <h3 className="text-white font-semibold mb-1">Daily Tasks</h3>
              <p className="text-gray-400 text-sm">Structured daily actions to keep you on track</p>
            </div>
            <div className="bg-white/5 rounded-xl p-4 border border-white/10">
              <Calendar className="w-6 h-6 text-white mb-3" />
              <h3 className="text-white font-semibold mb-1">Weekly Sprints</h3>
              <p className="text-gray-400 text-sm">Focused weekly goals and milestones</p>
            </div>
            <div className="bg-white/5 rounded-xl p-4 border border-white/10">
              <MessageSquare className="w-6 h-6 text-white mb-3" />
              <h3 className="text-white font-semibold mb-1">Live AMAs</h3>
              <p className="text-gray-400 text-sm">Ask Me Anything sessions with experts</p>
            </div>
            <div className="bg-white/5 rounded-xl p-4 border border-white/10">
              <Users className="w-6 h-6 text-white mb-3" />
              <h3 className="text-white font-semibold mb-1">Investor Q&A</h3>
              <p className="text-gray-400 text-sm">Direct access to investor insights</p>
            </div>
            <div className="bg-white/5 rounded-xl p-4 border border-white/10">
              <Trophy className="w-6 h-6 text-white mb-3" />
              <h3 className="text-white font-semibold mb-1">Demo Day</h3>
              <p className="text-gray-400 text-sm">Showcase your startup to investors</p>
            </div>
            <div className="bg-white/5 rounded-xl p-4 border border-white/10">
              <BarChart3 className="w-6 h-6 text-white mb-3" />
              <h3 className="text-white font-semibold mb-1">Public Leaderboard</h3>
              <p className="text-gray-400 text-sm">Compete and track progress publicly</p>
            </div>
            <div className="bg-white/5 rounded-xl p-4 border border-white/10">
              <Megaphone className="w-6 h-6 text-white mb-3" />
              <h3 className="text-white font-semibold mb-1">PR & Launch Week</h3>
              <p className="text-gray-400 text-sm">Prompts and strategies for launch</p>
            </div>
            <div className="bg-white/5 rounded-xl p-4 border border-white/10">
              <ListChecks className="w-6 h-6 text-white mb-3" />
              <h3 className="text-white font-semibold mb-1">Growth Checklist</h3>
              <p className="text-gray-400 text-sm">Comprehensive growth roadmap</p>
            </div>
          </div>

          <div className="bg-white/5 rounded-xl p-6 border border-white/10">
            <h3 className="text-xl font-semibold text-white mb-4">What You'll Get</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start gap-3">
                <Target className="w-5 h-5 text-white flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-white mb-1">Structured Daily Tasks</h4>
                  <p className="text-gray-300 text-sm">Get clear, actionable tasks every day to build momentum and stay focused on what matters most.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Calendar className="w-5 h-5 text-white flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-white mb-1">Weekly Sprint Planning</h4>
                  <p className="text-gray-300 text-sm">Set weekly goals, track progress, and adjust your strategy based on real-time feedback.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MessageSquare className="w-5 h-5 text-white flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-white mb-1">Live AMA Sessions</h4>
                  <p className="text-gray-300 text-sm">Join regular Ask Me Anything sessions with successful founders, investors, and industry experts.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Users className="w-5 h-5 text-white flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-white mb-1">Investor Q&A Access</h4>
                  <p className="text-gray-300 text-sm">Get direct answers from active investors about fundraising, pitch decks, and market fit.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Trophy className="w-5 h-5 text-white flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-white mb-1">Demo Day Showcase</h4>
                  <p className="text-gray-300 text-sm">Present your startup to a curated audience of investors, mentors, and potential partners.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <BarChart3 className="w-5 h-5 text-white flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-white mb-1">Public Leaderboard</h4>
                  <p className="text-gray-300 text-sm">See how you rank against other founders. Healthy competition drives better results.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Megaphone className="w-5 h-5 text-white flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-white mb-1">PR & Launch Week Prompts</h4>
                  <p className="text-gray-300 text-sm">Get AI-powered prompts and strategies for your launch week PR campaign and media outreach.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <ListChecks className="w-5 h-5 text-white flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-white mb-1">Growth Checklist</h4>
                  <p className="text-gray-300 text-sm">A comprehensive, step-by-step checklist covering all aspects of startup growth and scaling.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Launch Preparation</h2>
          <p className="text-gray-600">Complete your launch checklist to ensure a successful launch</p>
        </div>

        <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl p-8 text-white mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-2xl font-bold mb-2">Launch Readiness</h3>
              <p className="text-white/80">Complete all checklist items to launch</p>
            </div>
            <div className="text-right">
              <div className="text-4xl font-bold">{progress}%</div>
              <div className="text-sm text-white/80">{completedCount} / {totalCount} complete</div>
            </div>
          </div>
          <div className="w-full bg-white/20 rounded-full h-4 mt-4">
            <div
              className="bg-white h-4 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        <div className="space-y-6">
          {Object.entries(groupedChecklist).map(([category, items]) => (
            <div key={category} className="bg-white rounded-2xl p-6 shadow-lg border-2 border-gray-200">
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <CheckCircle className="w-5 h-5" />
                {category}
              </h3>
              <div className="space-y-3">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-all ${
                      item.completed
                        ? 'bg-green-50 border-green-200'
                        : item.priority === 'high'
                        ? 'bg-red-50 border-red-200'
                        : 'bg-gray-50 border-gray-200'
                    }`}
                  >
                    <button
                      onClick={() => toggleChecklistItem(item.id)}
                      className={`w-6 h-6 rounded border-2 flex items-center justify-center transition-all ${
                        item.completed
                          ? 'bg-green-500 border-green-500 text-white'
                          : 'border-gray-300 hover:border-black'
                      }`}
                    >
                      {item.completed && <Check className="w-4 h-4" />}
                    </button>
                    <div className="flex-1">
                      <p className={`font-medium ${item.completed ? 'text-gray-600 line-through' : 'text-gray-900'}`}>
                        {item.title}
                      </p>
                    </div>
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                      item.priority === 'high' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700'
                    }`}>
                      {item.priority}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {progress === 100 && (
          <div className="bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl p-8 text-white text-center">
            <Rocket className="w-16 h-16 mx-auto mb-4" />
            <h3 className="text-3xl font-bold mb-2">🚀 Ready to Launch!</h3>
            <p className="text-white/90 mb-6">All launch checklist items are complete. You're ready to launch your startup!</p>
            <button className="px-8 py-4 bg-white text-green-600 rounded-xl font-bold text-lg hover:bg-gray-100 transition-all">
              Launch Now
            </button>
          </div>
        )}
      </div>
    );
  };

  const renderAnalytics = () => {
    return (
      <div className="space-y-6">
        <div className="mb-6">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Analytics & Metrics</h2>
          <p className="text-gray-600">Track your startup's key performance indicators</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Total Users</span>
              <Users className="w-5 h-5 text-gray-400" />
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">{metrics.users.toLocaleString()}</div>
            <div className="text-sm text-green-600 flex items-center gap-1">
              <TrendingUp className="w-4 h-4" />
              +12% this month
            </div>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Monthly Revenue</span>
              <DollarSign className="w-5 h-5 text-gray-400" />
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">${metrics.mrr.toLocaleString()}</div>
            <div className="text-sm text-green-600 flex items-center gap-1">
              <TrendingUp className="w-4 h-4" />
              +8% this month
            </div>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Retention Rate</span>
              <Activity className="w-5 h-5 text-gray-400" />
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">{metrics.retention}%</div>
            <div className="text-sm text-gray-600">Monthly</div>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Growth Rate</span>
              <TrendingUp className="w-5 h-5 text-gray-400" />
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">{metrics.growth}%</div>
            <div className="text-sm text-gray-600">MoM</div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-gray-200">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Key Metrics</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                <span className="text-gray-700">Customer Acquisition Cost (CAC)</span>
                <span className="font-bold text-gray-900">${metrics.cac}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                <span className="text-gray-700">Lifetime Value (LTV)</span>
                <span className="font-bold text-gray-900">${metrics.ltv}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                <span className="text-gray-700">LTV:CAC Ratio</span>
                <span className="font-bold text-gray-900">
                  {metrics.cac > 0 ? (metrics.ltv / metrics.cac).toFixed(2) : '0'}:1
                </span>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-gray-200">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Update Metrics</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Users</label>
                <input
                  type="number"
                  value={metrics.users}
                  onChange={(e) => setMetrics({...metrics, users: parseInt(e.target.value) || 0})}
                  className="w-full p-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Monthly Recurring Revenue (MRR)</label>
                <input
                  type="number"
                  value={metrics.mrr}
                  onChange={(e) => setMetrics({...metrics, mrr: parseInt(e.target.value) || 0})}
                  className="w-full p-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Retention %</label>
                  <input
                    type="number"
                    value={metrics.retention}
                    onChange={(e) => setMetrics({...metrics, retention: parseInt(e.target.value) || 0})}
                    className="w-full p-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Growth %</label>
                  <input
                    type="number"
                    value={metrics.growth}
                    onChange={(e) => setMetrics({...metrics, growth: parseInt(e.target.value) || 0})}
                    className="w-full p-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderProfile = () => {
    return (
      <div className="space-y-6">
        <div className="mb-6">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Startup Profile</h2>
          <p className="text-gray-600">Manage your startup's public profile and branding</p>
        </div>

        <div className="bg-white rounded-2xl p-8 shadow-lg">
          <div className="mb-8">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Company Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Startup Name</label>
                <input
                  type="text"
                  defaultValue={startupData.name}
                  className="w-full p-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Stage</label>
                <select
                  defaultValue={startupData.stage}
                  className="w-full p-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent"
                >
                  <option value="Idea">Idea</option>
                  <option value="MVP Development">MVP Development</option>
                  <option value="Beta Testing">Beta Testing</option>
                  <option value="Launch">Launch</option>
                  <option value="Growth">Growth</option>
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  defaultValue={startupData.description}
                  rows={4}
                  className="w-full p-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent resize-none"
                />
              </div>
            </div>
          </div>

          <div className="mb-8">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Contact & Links</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Website</label>
                <input
                  type="url"
                  placeholder="https://yourstartup.com"
                  className="w-full p-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  placeholder="hello@yourstartup.com"
                  className="w-full p-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">LinkedIn</label>
                <input
                  type="url"
                  placeholder="https://linkedin.com/company/yourstartup"
                  className="w-full p-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Twitter</label>
                <input
                  type="url"
                  placeholder="https://twitter.com/yourstartup"
                  className="w-full p-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent"
                />
              </div>
            </div>
          </div>

          <div className="mb-8">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Branding</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Logo</label>
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center">
                  <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">Upload logo image</p>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Cover Image</label>
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center">
                  <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">Upload cover image</p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <button className="px-8 py-3 bg-black text-white rounded-xl font-semibold hover:bg-gray-800 transition-all">
              Save Changes
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderVisionBoard = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Shared Startup Canvas</h2>
        <p className="text-gray-600">Collaborate on your startup vision with your cofounder</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Problem Section */}
        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center">
              <AlertCircle className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900">Problem</h3>
          </div>
          <textarea
            placeholder="What problem are you solving? Who has this problem? How big is the market?"
            className="w-full h-32 p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent resize-none"
            defaultValue="Remote teams struggle with inefficient workflow management, leading to 40% productivity loss and poor collaboration across time zones."
          />
        </div>

        {/* Solution Section */}
        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-gray-600 rounded-xl flex items-center justify-center">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900">Solution</h3>
          </div>
          <textarea
            placeholder="How does your product solve this problem? What makes it unique?"
            className="w-full h-32 p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent resize-none"
            defaultValue="AI-powered workflow automation platform that intelligently assigns tasks, optimizes schedules, and facilitates seamless collaboration across distributed teams."
          />
        </div>

        {/* Market Section */}
        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-gray-700 rounded-xl flex items-center justify-center">
              <Globe className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900">Market</h3>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Target Market</label>
              <input
                type="text"
                placeholder="e.g., Remote teams, SMBs, Enterprise"
                className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent"
                defaultValue="Remote teams (50M+ globally), SMBs with distributed workforce"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Market Size</label>
              <input
                type="text"
                placeholder="e.g., $50B TAM, $5B SAM"
                className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent"
                defaultValue="$50B TAM, $5B SAM"
              />
            </div>
          </div>
        </div>

        {/* Roadmap Section */}
        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-gray-800 rounded-xl flex items-center justify-center">
              <Target className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900">Roadmap</h3>
          </div>
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
              <div className="w-6 h-6 bg-black rounded-full flex items-center justify-center">
                <CheckCircle className="w-4 h-4 text-white" />
              </div>
              <span className="text-sm font-medium">Q1: MVP Development</span>
            </div>
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
              <div className="w-6 h-6 bg-gray-600 rounded-full flex items-center justify-center">
                <Clock className="w-4 h-4 text-white" />
              </div>
              <span className="text-sm font-medium">Q2: Beta Testing</span>
            </div>
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
              <div className="w-6 h-6 bg-gray-400 rounded-full flex items-center justify-center">
                <Clock className="w-4 h-4 text-white" />
              </div>
              <span className="text-sm font-medium">Q3: Launch</span>
            </div>
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
              <div className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center">
                <Clock className="w-4 h-4 text-white" />
              </div>
              <span className="text-sm font-medium">Q4: Scale</span>
            </div>
          </div>
        </div>
      </div>

      {/* Collaboration Tools */}
      <div className="bg-white rounded-2xl p-6 shadow-lg">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Collaboration Tools</h3>
        <div className="flex gap-4">
          <button className="px-4 py-2 bg-black text-white rounded-xl hover:bg-gray-800 transition-colors">
            <MessageSquare className="w-4 h-4 mr-2" />
            Start Discussion
          </button>
          <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors">
            <Video className="w-4 h-4 mr-2" />
            Video Call
          </button>
          <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors">
            <Share2 className="w-4 h-4 mr-2" />
            Share Updates
          </button>
        </div>
      </div>
    </div>
  );

  const renderEquityTools = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Role & Equity Tools</h2>
        <p className="text-gray-600">Define roles, calculate equity, and create founder agreements</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Equity Calculator */}
        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center">
              <Calculator className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900">Equity Calculator</h3>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Total Equity Pool</label>
              <input
                type="number"
                placeholder="100"
                className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent"
                defaultValue="100"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Your Contribution</label>
              <select className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent">
                <option>Idea + Technical Development (40%)</option>
                <option>Idea + Business Development (35%)</option>
                <option>Technical Development Only (25%)</option>
                <option>Business Development Only (20%)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Cofounder Contribution</label>
              <select className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent">
                <option>Technical Development (30%)</option>
                <option>Business Development (35%)</option>
                <option>Idea + Technical (40%)</option>
                <option>Idea + Business (35%)</option>
              </select>
            </div>
            <div className="p-4 bg-gray-50 rounded-xl">
              <div className="flex justify-between items-center">
                <span className="font-medium">Your Equity:</span>
                <span className="text-2xl font-bold text-black">40%</span>
              </div>
              <div className="flex justify-between items-center mt-2">
                <span className="font-medium">Cofounder Equity:</span>
                <span className="text-2xl font-bold text-gray-600">35%</span>
              </div>
              <div className="flex justify-between items-center mt-2">
                <span className="font-medium">Employee Pool:</span>
                <span className="text-2xl font-bold text-gray-500">25%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Role Definition */}
        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-gray-600 rounded-xl flex items-center justify-center">
              <Users className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900">Role Definition</h3>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Your Role</label>
              <input
                type="text"
                placeholder="e.g., CEO, CTO, COO"
                className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent"
                defaultValue="CEO & Technical Lead"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Cofounder Role</label>
              <input
                type="text"
                placeholder="e.g., CTO, COO, CMO"
                className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent"
                defaultValue="COO & Business Lead"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Responsibilities</label>
              <textarea
                placeholder="Define clear responsibilities for each role..."
                className="w-full h-24 p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent resize-none"
                defaultValue="CEO: Product vision, fundraising, strategic partnerships\nCOO: Operations, sales, marketing, customer success"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Founder Agreement Templates */}
      <div className="bg-white rounded-2xl p-6 shadow-lg">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-gray-700 rounded-xl flex items-center justify-center">
            <FileText className="w-5 h-5 text-white" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900">Founder Agreement Templates</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="p-4 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors text-left">
            <h4 className="font-semibold text-gray-900 mb-2">Basic Agreement</h4>
            <p className="text-sm text-gray-600">Simple equity split and role definition</p>
          </button>
          <button className="p-4 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors text-left">
            <h4 className="font-semibold text-gray-900 mb-2">Vesting Schedule</h4>
            <p className="text-sm text-gray-600">4-year vesting with 1-year cliff</p>
          </button>
          <button className="p-4 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors text-left">
            <h4 className="font-semibold text-gray-900 mb-2">Full Legal</h4>
            <p className="text-sm text-gray-600">Comprehensive founder agreement</p>
          </button>
        </div>
      </div>
    </div>
  );

  const renderMilestones = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Milestones Engine</h2>
        <p className="text-gray-600">30-day sprints to keep you aligned and moving forward</p>
      </div>

      {/* Current Sprint */}
      <div className="bg-white rounded-2xl p-6 shadow-lg">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900">Current Sprint</h3>
              <p className="text-gray-600">Sprint 1: Foundation & Alignment</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500">Days Remaining</p>
            <p className="text-2xl font-bold text-black">12</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-gray-50 rounded-xl">
            <h4 className="font-semibold text-gray-900 mb-2">Alignment</h4>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-black" />
                <span className="text-sm">Define vision & values</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-black" />
                <span className="text-sm">Set communication norms</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-500">Create working agreement</span>
              </div>
            </div>
          </div>
          
          <div className="p-4 bg-gray-50 rounded-xl">
            <h4 className="font-semibold text-gray-900 mb-2">Validation</h4>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-black" />
                <span className="text-sm">Customer interviews (5)</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-500">Market research</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-500">Competitor analysis</span>
              </div>
            </div>
          </div>
          
          <div className="p-4 bg-gray-50 rounded-xl">
            <h4 className="font-semibold text-gray-900 mb-2">Prototype</h4>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-500">Wireframes</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-500">MVP features</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-500">Technical architecture</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Upcoming Sprints */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Sprint 2: MVP Development</h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
              <div className="w-6 h-6 bg-gray-400 rounded-full"></div>
              <span className="text-sm">Build core features</span>
            </div>
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
              <div className="w-6 h-6 bg-gray-400 rounded-full"></div>
              <span className="text-sm">User testing</span>
            </div>
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
              <div className="w-6 h-6 bg-gray-400 rounded-full"></div>
              <span className="text-sm">Iterate based on feedback</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Sprint 3: Pitch Readiness</h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
              <div className="w-6 h-6 bg-gray-400 rounded-full"></div>
              <span className="text-sm">Pitch deck creation</span>
            </div>
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
              <div className="w-6 h-6 bg-gray-400 rounded-full"></div>
              <span className="text-sm">Financial projections</span>
            </div>
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
              <div className="w-6 h-6 bg-gray-400 rounded-full"></div>
              <span className="text-sm">Investor outreach</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderTaskManager = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Task Manager</h2>
          <p className="text-gray-600">Notion-lite task management for your startup</p>
        </div>
        <button className="px-4 py-2 bg-black text-white rounded-xl hover:bg-gray-800 transition-colors">
          <Plus className="w-4 h-4 mr-2" />
          Add Task
        </button>
      </div>

      {/* Task Board */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <h3 className="font-semibold text-gray-900 mb-4">To Do</h3>
          <div className="space-y-3">
            <div className="p-3 bg-gray-50 rounded-xl">
              <h4 className="font-medium text-gray-900">Design user interface</h4>
              <p className="text-sm text-gray-600">Create wireframes for main features</p>
              <div className="flex items-center justify-between mt-2">
                <span className="text-xs text-gray-500">Sarah</span>
                <span className="px-2 py-1 bg-gray-200 text-gray-700 text-xs rounded-full">High</span>
              </div>
            </div>
            <div className="p-3 bg-gray-50 rounded-xl">
              <h4 className="font-medium text-gray-900">Set up database</h4>
              <p className="text-sm text-gray-600">Configure PostgreSQL and models</p>
              <div className="flex items-center justify-between mt-2">
                <span className="text-xs text-gray-500">Alex</span>
                <span className="px-2 py-1 bg-gray-200 text-gray-700 text-xs rounded-full">Medium</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <h3 className="font-semibold text-gray-900 mb-4">In Progress</h3>
          <div className="space-y-3">
            <div className="p-3 bg-gray-50 rounded-xl">
              <h4 className="font-medium text-gray-900">API development</h4>
              <p className="text-sm text-gray-600">Build REST API endpoints</p>
              <div className="flex items-center justify-between mt-2">
                <span className="text-xs text-gray-500">Alex</span>
                <span className="px-2 py-1 bg-gray-200 text-gray-700 text-xs rounded-full">High</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <h3 className="font-semibold text-gray-900 mb-4">Review</h3>
          <div className="space-y-3">
            <div className="p-3 bg-gray-50 rounded-xl">
              <h4 className="font-medium text-gray-900">Market research</h4>
              <p className="text-sm text-gray-600">Analyze competitor landscape</p>
              <div className="flex items-center justify-between mt-2">
                <span className="text-xs text-gray-500">Sarah</span>
                <span className="px-2 py-1 bg-gray-200 text-gray-700 text-xs rounded-full">Low</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <h3 className="font-semibold text-gray-900 mb-4">Done</h3>
          <div className="space-y-3">
            <div className="p-3 bg-gray-50 rounded-xl">
              <h4 className="font-medium text-gray-900">Project setup</h4>
              <p className="text-sm text-gray-600">Initialize repository and CI/CD</p>
              <div className="flex items-center justify-between mt-2">
                <span className="text-xs text-gray-500">Alex</span>
                <span className="px-2 py-1 bg-gray-200 text-gray-700 text-xs rounded-full">High</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderDocsLegal = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Docs & Legal</h2>
        <p className="text-gray-600">Essential legal documents and templates for your startup</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* NDA Template */}
        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">NDA Template</h3>
          </div>
          <p className="text-gray-600 text-sm mb-4">Mutual non-disclosure agreement for protecting your ideas</p>
          <div className="space-y-2">
            <button className="w-full px-4 py-2 bg-black text-white rounded-xl hover:bg-gray-800 transition-colors">
              <Download className="w-4 h-4 mr-2" />
              Download Template
            </button>
            <button className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors">
              <Eye className="w-4 h-4 mr-2" />
              Preview
            </button>
          </div>
        </div>

        {/* Incorporation Guide */}
        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-gray-600 rounded-xl flex items-center justify-center">
              <Building2 className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Incorporation Guide</h3>
          </div>
          <p className="text-gray-600 text-sm mb-4">Step-by-step guide to incorporating your startup</p>
          <div className="space-y-2">
            <button className="w-full px-4 py-3 bg-black text-white rounded-xl hover:bg-gray-800 transition-all duration-200 flex items-center justify-center gap-2 font-medium shadow-sm hover:shadow-md">
              <FileText className="w-4 h-4" />
              View Guide
            </button>
            <button className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors">
              <Calendar className="w-4 h-4 mr-2" />
              Schedule Call
            </button>
          </div>
        </div>

        {/* IP Assignment */}
        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-gray-700 rounded-xl flex items-center justify-center">
              <Key className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">IP Assignment</h3>
          </div>
          <p className="text-gray-600 text-sm mb-4">Intellectual property assignment agreement</p>
          <div className="space-y-2">
            <button className="w-full px-4 py-2 bg-black text-white rounded-xl hover:bg-gray-800 transition-colors">
              <Download className="w-4 h-4 mr-2" />
              Download Template
            </button>
            <button className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors">
              <Edit3 className="w-4 h-4 mr-2" />
              Customize
            </button>
          </div>
        </div>

        {/* Founder Agreement */}
        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-gray-800 rounded-xl flex items-center justify-center">
              <Users className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Founder Agreement</h3>
          </div>
          <p className="text-gray-600 text-sm mb-4">Comprehensive founder agreement template</p>
          <div className="space-y-2">
            <button className="w-full px-4 py-2 bg-black text-white rounded-xl hover:bg-gray-800 transition-colors">
              <Download className="w-4 h-4 mr-2" />
              Download Template
            </button>
            <button className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors">
              <Calculator className="w-4 h-4 mr-2" />
              Calculate Equity
            </button>
          </div>
        </div>

        {/* Privacy Policy */}
        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-gray-900 rounded-xl flex items-center justify-center">
              <Lock className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Privacy Policy</h3>
          </div>
          <p className="text-gray-600 text-sm mb-4">GDPR-compliant privacy policy template</p>
          <div className="space-y-2">
            <button className="w-full px-4 py-2 bg-black text-white rounded-xl hover:bg-gray-800 transition-colors">
              <Download className="w-4 h-4 mr-2" />
              Download Template
            </button>
            <button className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors">
              <Edit3 className="w-4 h-4 mr-2" />
              Customize
            </button>
          </div>
        </div>

        {/* Terms of Service */}
        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center">
              <FileText className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Terms of Service</h3>
          </div>
          <p className="text-gray-600 text-sm mb-4">Standard terms of service template</p>
          <div className="space-y-2">
            <button className="w-full px-4 py-2 bg-black text-white rounded-xl hover:bg-gray-800 transition-colors">
              <Download className="w-4 h-4 mr-2" />
              Download Template
            </button>
            <button className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors">
              <Edit3 className="w-4 h-4 mr-2" />
              Customize
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderRoadmap = () => (
    <div className="h-full">
      <div className="bg-white rounded-2xl p-8 text-center">
        <p className="text-gray-600">Startup Roadmap - Coming Soon</p>
      </div>
    </div>
  );

  const renderOverview = () => {
    const overallProgress = Math.round(Object.values(startupJourney.stages).reduce((sum, stage) => sum + stage.progress, 0) / 6);
    const currentStageData = startupJourney.stages[startupJourney.currentStage];
    const stageOrder = ['idea', 'validation', 'mvp', 'testing', 'launch', 'growth'];
    const getStageColor = (color) => {
      const colors = {
        purple: 'from-purple-500 to-purple-600',
        blue: 'from-blue-500 to-blue-600',
        green: 'from-green-500 to-green-600',
        yellow: 'from-yellow-500 to-yellow-600',
        orange: 'from-orange-500 to-orange-600',
        pink: 'from-pink-500 to-pink-600'
      };
      return colors[color] || 'from-gray-500 to-gray-600';
    };

    return (
      <div className="space-y-8">
        {/* Journey Progress Overview */}
        <div className="bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 rounded-2xl p-8 text-white">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-3xl font-bold mb-2">Your Startup Journey</h2>
              <p className="text-white/90 text-lg">From idea to launch and beyond</p>
            </div>
            <div className="text-right">
              <div className="text-5xl font-bold">{overallProgress}%</div>
              <div className="text-sm text-white/80">Overall Complete</div>
            </div>
          </div>
          <div className="w-full bg-white/20 rounded-full h-6 mb-4">
            <div
              className="bg-white h-6 rounded-full transition-all duration-500"
              style={{ width: `${overallProgress}%` }}
            ></div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <p className="text-sm text-white/80 mb-1">Current Stage</p>
              <p className="text-xl font-bold">{currentStageData.name}</p>
            </div>
          </div>
        </div>

        {/* Journey Stages */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Journey Stages</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {stageOrder.map((stageKey, index) => {
              const stage = startupJourney.stages[stageKey];
              const isActive = startupJourney.currentStage === stageKey;
              const isCompleted = stage.completed;
              const isUnlocked = isCompleted || isActive || index === 0 || startupJourney.stages[stageOrder[index - 1]]?.completed;

              return (
                <div
                  key={stageKey}
                  className={`bg-white rounded-2xl p-6 shadow-lg border-2 transition-all ${
                    isActive ? 'border-black scale-105' : isCompleted ? 'border-green-500' : isUnlocked ? 'border-gray-200' : 'border-gray-100 opacity-50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${getStageColor(stage.color)} flex items-center justify-center text-white font-bold text-lg`}>
                      {index + 1}
                    </div>
                    {isCompleted && <CheckCircle className="w-6 h-6 text-green-500" />}
                    {isActive && <Zap className="w-6 h-6 text-black" />}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{stage.name}</h3>
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-600">Progress</span>
                      <span className="text-sm font-semibold text-gray-900">{stage.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all bg-gradient-to-r ${getStageColor(stage.color)}`}
                        style={{ width: `${stage.progress}%` }}
                      ></div>
                    </div>
                  </div>
                  {isUnlocked && (
            <button
                      onClick={() => {
                        const stageMap = {
                          idea: 'overview',
                          validation: 'validation',
                          mvp: 'mvp',
                          testing: 'mvp',
                          launch: 'launch',
                          growth: 'overview'
                        };
                        setActiveTab(stageMap[stageKey] || 'overview');
                      }}
                      className="w-full py-2 bg-black text-white rounded-xl font-semibold hover:bg-gray-800 transition-all text-sm"
                    >
                      {isActive ? 'Continue' : isCompleted ? 'Review' : 'Start'}
            </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 bg-gray-900 rounded-2xl flex items-center justify-center">
              <Users className="w-5 h-5 text-white" />
            </div>
            <span className="text-2xl font-bold text-gray-900">{startupData.cofounders.length}</span>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-1">Team Members</h3>
          <p className="text-gray-600 text-sm">Active cofounders</p>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 bg-gray-900 rounded-2xl flex items-center justify-center">
              <Target className="w-5 h-5 text-white" />
            </div>
            <span className="text-2xl font-bold text-gray-900">{startupData.progress}%</span>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-1">Progress</h3>
          <p className="text-gray-600 text-sm">MVP completion</p>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 bg-gray-900 rounded-2xl flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-white" />
            </div>
            <span className="text-2xl font-bold text-gray-900">${startupData.funding.raised.toLocaleString()}</span>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-1">Raised</h3>
          <p className="text-gray-600 text-sm">Total funding</p>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 bg-gray-900 rounded-2xl flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <span className="text-2xl font-bold text-gray-900">{startupData.metrics.users}</span>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-1">Users</h3>
          <p className="text-gray-600 text-sm">Active users</p>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Recent Activity</h2>
        <div className="space-y-4">
          <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl">
            <div className="w-10 h-10 bg-gray-900 rounded-2xl flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900">MVP Development</h3>
              <p className="text-sm text-gray-600">Core features completed and ready for testing</p>
              <div className="flex items-center gap-4 mt-2">
                <span className="text-sm text-gray-500">2 hours ago</span>
                <span className="text-sm text-gray-500">Alex Chen</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl">
            <div className="w-10 h-10 bg-gray-900 rounded-2xl flex items-center justify-center">
              <Users className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900">Team Meeting</h3>
              <p className="text-sm text-gray-600">Weekly standup completed with action items</p>
              <div className="flex items-center gap-4 mt-2">
                <span className="text-sm text-gray-500">1 day ago</span>
                <span className="text-sm text-gray-500">Sarah Martinez</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl">
            <div className="w-10 h-10 bg-gray-900 rounded-2xl flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900">Funding Update</h3>
              <p className="text-sm text-gray-600">Pitch deck updated for investor meetings</p>
              <div className="flex items-center gap-4 mt-2">
                <span className="text-sm text-gray-500">3 days ago</span>
                <span className="text-sm text-gray-500">Both</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center">
              <Target className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Milestones Engine</h3>
          </div>
          <p className="text-gray-600 text-sm mb-4">Track your 30-day sprints and progress</p>
          <button
            onClick={() => setActiveTab('milestones')}
            className="w-full py-2 bg-black text-white rounded-xl hover:bg-gray-800 transition-colors font-semibold"
          >
            View Milestones
          </button>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center">
              <Users className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Team View</h3>
          </div>
          <p className="text-gray-600 text-sm mb-4">Manage team members and roles</p>
          <button
            onClick={() => setActiveTab('team')}
            className="w-full py-2 bg-black text-white rounded-xl hover:bg-gray-800 transition-colors font-semibold"
          >
            View Team
          </button>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Investor Room</h3>
          </div>
          <p className="text-gray-600 text-sm mb-4">Access data room and investor tools</p>
          <button
            onClick={() => setActiveTab('investors')}
            className="w-full py-2 bg-black text-white rounded-xl hover:bg-gray-800 transition-colors font-semibold"
          >
            View Investors
          </button>
        </div>
      </div>

      {/* Analytics Section */}
      <div className="mt-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Analytics & Metrics</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Total Users</span>
              <Users className="w-5 h-5 text-gray-400" />
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">{metrics.users.toLocaleString()}</div>
            <div className="text-sm text-green-600 flex items-center gap-1">
              <TrendingUp className="w-4 h-4" />
              +12% this month
            </div>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Monthly Revenue</span>
              <DollarSign className="w-5 h-5 text-gray-400" />
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">${metrics.mrr.toLocaleString()}</div>
            <div className="text-sm text-green-600 flex items-center gap-1">
              <TrendingUp className="w-4 h-4" />
              +8% this month
            </div>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Retention Rate</span>
              <Activity className="w-5 h-5 text-gray-400" />
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">{metrics.retention}%</div>
            <div className="text-sm text-gray-600">Monthly</div>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Growth Rate</span>
              <TrendingUp className="w-5 h-5 text-gray-400" />
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">{metrics.growth}%</div>
            <div className="text-sm text-gray-600">MoM</div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-gray-200">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Key Metrics</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                <span className="text-gray-700">Customer Acquisition Cost (CAC)</span>
                <span className="font-bold text-gray-900">${metrics.cac}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                <span className="text-gray-700">Lifetime Value (LTV)</span>
                <span className="font-bold text-gray-900">${metrics.ltv}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                <span className="text-gray-700">LTV:CAC Ratio</span>
                <span className="font-bold text-gray-900">
                  {metrics.cac > 0 ? (metrics.ltv / metrics.cac).toFixed(2) : '0'}:1
                </span>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-gray-200">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Update Metrics</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Users</label>
                <input
                  type="number"
                  value={metrics.users}
                  onChange={(e) => setMetrics({...metrics, users: parseInt(e.target.value) || 0})}
                  className="w-full p-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Monthly Recurring Revenue (MRR)</label>
                <input
                  type="number"
                  value={metrics.mrr}
                  onChange={(e) => setMetrics({...metrics, mrr: parseInt(e.target.value) || 0})}
                  className="w-full p-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Retention %</label>
                  <input
                    type="number"
                    value={metrics.retention}
                    onChange={(e) => setMetrics({...metrics, retention: parseInt(e.target.value) || 0})}
                    className="w-full p-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Growth %</label>
                  <input
                    type="number"
                    value={metrics.growth}
                    onChange={(e) => setMetrics({...metrics, growth: parseInt(e.target.value) || 0})}
                    className="w-full p-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6">
        {/* Tabs */}
        <div className="mb-6">
          <div className="bg-white rounded-2xl p-2 shadow-lg border border-gray-100">
            <div className="flex flex-wrap gap-2">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl font-semibold transition-all duration-300 ${
                      isActive
                        ? 'bg-gray-900 text-white shadow-lg'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'validation' && renderValidation()}
        {activeTab === 'milestones' && renderMilestonesFull()}
        {activeTab === 'team' && renderTeamFull()}
        {activeTab === 'mvp' && renderMVPExecution()}
        {activeTab === 'events' && renderEvents()}
        {activeTab === 'profile' && renderProfile()}
      </div>
    </div>
  );
};

export default StartupWorkspace;
