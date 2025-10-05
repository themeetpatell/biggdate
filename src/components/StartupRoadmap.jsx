import React, { useState, useEffect } from 'react';
import { 
  Target, CheckCircle, Clock, Calendar, Users, DollarSign, 
  Rocket, Lightbulb, BarChart3, TrendingUp, Award, Star,
  Plus, Edit3, Trash2, Save, Download, Share2, Eye,
  ChevronRight, ChevronDown, ChevronUp, ArrowRight, ArrowLeft,
  Building2, Code, Palette, MessageCircle, FileText, Video,
  Mic, Upload, Download as DownloadIcon, ExternalLink,
  Zap, Crown, Shield, Lock, Unlock, Key, KeyRound,
  AlertCircle, Info, HelpCircle, CheckCircle2, XCircle,
  PlusCircle, MinusCircle, X as XIcon, Check as CheckIcon,
  AlertTriangle, AlertOctagon, AlertCircle as AlertCircleIcon,
  Info as InfoIcon, HelpCircle as HelpCircleIcon,
  CheckCircle as CheckCircleIcon, XCircle as XCircleIcon,
  PlusCircle as PlusCircleIcon, MinusCircle as MinusCircleIcon,
  X as XIcon2, Check as CheckIcon2, Globe, Phone, Mail,
  Instagram, Twitter, Linkedin, Github, Coffee, Plane,
  Gamepad2, BookOpen, Users as UsersIcon, Clock as ClockIcon,
  BarChart3 as BarChart3Icon, Activity, Compass, Shield as ShieldIcon,
  Badge, Gift, Video as VideoIcon, FileText as FileTextIcon,
  Download as DownloadIcon2, Play, Pause, Volume2, ThumbsUp,
  MessageSquare, Send, Bookmark, Flag, MoreHorizontal,
  Search, Filter, SortAsc, SortDesc, RefreshCw, Bell,
  BellOff, Eye as EyeIcon, EyeOff as EyeOffIcon,
  ChevronUp as ChevronUpIcon, ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon, ChevronDown as ChevronDownIcon,
  ArrowRight as ArrowRightIcon, ArrowLeft as ArrowLeftIcon,
  ArrowUp as ArrowUpIcon, ArrowDown as ArrowDownIcon,
  Maximize2, Minimize2, RotateCcw, RotateCw, ZoomIn, ZoomOut,
  Move, Copy, Scissors, Trash2 as Trash2Icon, Save as SaveIcon,
  Upload as UploadIcon, Download as DownloadIcon3, Link,
  Link2, Unlink, Lock as LockIcon, Key as KeyIcon,
  KeyRound as KeyRoundIcon, Shield as ShieldIcon2,
  ShieldCheck, ShieldAlert, AlertCircle as AlertCircleIcon2,
  Info as InfoIcon2, HelpCircle as HelpCircleIcon2,
  CheckCircle as CheckCircleIcon2, XCircle as XCircleIcon2,
  PlusCircle as PlusCircleIcon2, MinusCircle as MinusCircleIcon2,
  X as XIcon3, Check as CheckIcon3, AlertTriangle as AlertTriangleIcon,
  AlertOctagon as AlertOctagonIcon, AlertCircle as AlertCircleIcon3,
  Info as InfoIcon3, HelpCircle as HelpCircleIcon3,
  CheckCircle as CheckCircleIcon3, XCircle as XCircleIcon3,
  PlusCircle as PlusCircleIcon3, MinusCircle as MinusCircleIcon3,
  X as XIcon4, Check as CheckIcon4
} from 'lucide-react';

const StartupRoadmap = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [roadmaps, setRoadmaps] = useState([]);
  const [selectedRoadmap, setSelectedRoadmap] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [newRoadmap, setNewRoadmap] = useState({
    title: '',
    description: '',
    industry: '',
    stage: 'idea',
    duration: '12',
    milestones: []
  });

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'roadmaps', label: 'My Roadmaps', icon: Target },
    { id: 'templates', label: 'Templates', icon: FileText },
    { id: 'progress', label: 'Progress', icon: TrendingUp }
  ];

  const industries = [
    'Fintech', 'AI/ML', 'SaaS', 'E-commerce', 'Healthcare', 'EdTech',
    'PropTech', 'CleanTech', 'FoodTech', 'Gaming', 'Social', 'Enterprise'
  ];

  const stages = [
    { value: 'idea', label: 'Idea Stage', color: 'bg-blue-100 text-blue-700' },
    { value: 'mvp', label: 'MVP Stage', color: 'bg-green-100 text-green-700' },
    { value: 'early', label: 'Early Stage', color: 'bg-yellow-100 text-yellow-700' },
    { value: 'growth', label: 'Growth Stage', color: 'bg-purple-100 text-purple-700' }
  ];

  const milestoneTemplates = {
    idea: [
      { id: 1, title: 'Market Research', description: 'Conduct comprehensive market analysis', duration: '2 weeks', category: 'Research' },
      { id: 2, title: 'Problem Validation', description: 'Validate the problem with potential customers', duration: '3 weeks', category: 'Validation' },
      { id: 3, title: 'Solution Design', description: 'Design the core solution and user experience', duration: '2 weeks', category: 'Design' },
      { id: 4, title: 'Business Model', description: 'Define revenue model and pricing strategy', duration: '1 week', category: 'Business' },
      { id: 5, title: 'Team Formation', description: 'Find cofounders and key team members', duration: '4 weeks', category: 'Team' }
    ],
    mvp: [
      { id: 6, title: 'Technical Architecture', description: 'Design system architecture and tech stack', duration: '2 weeks', category: 'Technical' },
      { id: 7, title: 'MVP Development', description: 'Build minimum viable product', duration: '8 weeks', category: 'Development' },
      { id: 8, title: 'User Testing', description: 'Test MVP with early users', duration: '2 weeks', category: 'Testing' },
      { id: 9, title: 'Feedback Integration', description: 'Incorporate user feedback into product', duration: '2 weeks', category: 'Development' },
      { id: 10, title: 'Launch Preparation', description: 'Prepare for public launch', duration: '1 week', category: 'Launch' }
    ],
    early: [
      { id: 11, title: 'Seed Funding', description: 'Raise seed funding round', duration: '8 weeks', category: 'Funding' },
      { id: 12, title: 'Team Expansion', description: 'Hire key team members', duration: '6 weeks', category: 'Team' },
      { id: 13, title: 'Product Iteration', description: 'Iterate based on user feedback', duration: '4 weeks', category: 'Development' },
      { id: 14, title: 'Market Entry', description: 'Enter target market with full product', duration: '2 weeks', category: 'Marketing' },
      { id: 15, title: 'Metrics Tracking', description: 'Implement analytics and KPI tracking', duration: '1 week', category: 'Analytics' }
    ],
    growth: [
      { id: 16, title: 'Series A Funding', description: 'Raise Series A funding round', duration: '12 weeks', category: 'Funding' },
      { id: 17, title: 'Scale Team', description: 'Scale team to 20+ members', duration: '16 weeks', category: 'Team' },
      { id: 18, title: 'Market Expansion', description: 'Expand to new markets', duration: '8 weeks', category: 'Marketing' },
      { id: 19, title: 'Product Suite', description: 'Develop additional products/features', duration: '12 weeks', category: 'Development' },
      { id: 20, title: 'Partnerships', description: 'Establish key partnerships', duration: '6 weeks', category: 'Business' }
    ]
  };

  useEffect(() => {
    loadRoadmaps();
  }, []);

  const loadRoadmaps = async () => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockRoadmaps = [
        {
          id: 1,
          title: 'EcoTrack AI Roadmap',
          description: 'AI-powered carbon footprint tracking platform',
          industry: 'CleanTech',
          stage: 'mvp',
          duration: '12',
          startDate: '2024-01-01',
          endDate: '2024-12-31',
          progress: 35,
          milestones: [
            {
              id: 1,
              title: 'Market Research',
              description: 'Conduct comprehensive market analysis',
              duration: '2 weeks',
              category: 'Research',
              status: 'completed',
              startDate: '2024-01-01',
              endDate: '2024-01-14',
              completedDate: '2024-01-12'
            },
            {
              id: 2,
              title: 'Problem Validation',
              description: 'Validate the problem with potential customers',
              duration: '3 weeks',
              category: 'Validation',
              status: 'completed',
              startDate: '2024-01-15',
              endDate: '2024-02-04',
              completedDate: '2024-02-01'
            },
            {
              id: 3,
              title: 'Solution Design',
              description: 'Design the core solution and user experience',
              duration: '2 weeks',
              category: 'Design',
              status: 'in_progress',
              startDate: '2024-02-05',
              endDate: '2024-02-18',
              progress: 60
            },
            {
              id: 4,
              title: 'Technical Architecture',
              description: 'Design system architecture and tech stack',
              duration: '2 weeks',
              category: 'Technical',
              status: 'pending',
              startDate: '2024-02-19',
              endDate: '2024-03-04'
            }
          ],
          createdAt: '2024-01-01',
          updatedAt: '2024-01-15'
        },
        {
          id: 2,
          title: 'HealthConnect Roadmap',
          description: 'Telemedicine platform connecting patients with specialists',
          industry: 'Healthcare',
          stage: 'early',
          duration: '18',
          startDate: '2024-02-01',
          endDate: '2024-07-31',
          progress: 20,
          milestones: [
            {
              id: 5,
              title: 'MVP Development',
              description: 'Build minimum viable product',
              duration: '8 weeks',
              category: 'Development',
              status: 'in_progress',
              startDate: '2024-02-01',
              endDate: '2024-03-28',
              progress: 25
            }
          ],
          createdAt: '2024-02-01',
          updatedAt: '2024-02-15'
        }
      ];
      
      setRoadmaps(mockRoadmaps);
    } catch (error) {
      console.error('Error loading roadmaps:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const createRoadmap = () => {
    const roadmap = {
      ...newRoadmap,
      id: Date.now(),
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date(Date.now() + parseInt(newRoadmap.duration) * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      progress: 0,
      milestones: milestoneTemplates[newRoadmap.stage] || [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    setRoadmaps(prev => [...prev, roadmap]);
    setShowCreateModal(false);
    setNewRoadmap({
      title: '',
      description: '',
      industry: '',
      stage: 'idea',
      duration: '12',
      milestones: []
    });
  };

  const updateMilestoneStatus = (roadmapId, milestoneId, status) => {
    setRoadmaps(prev => prev.map(roadmap => {
      if (roadmap.id === roadmapId) {
        const updatedMilestones = roadmap.milestones.map(milestone => {
          if (milestone.id === milestoneId) {
            return {
              ...milestone,
              status,
              completedDate: status === 'completed' ? new Date().toISOString().split('T')[0] : null
            };
          }
          return milestone;
        });
        
        const completedCount = updatedMilestones.filter(m => m.status === 'completed').length;
        const progress = Math.round((completedCount / updatedMilestones.length) * 100);
        
        return {
          ...roadmap,
          milestones: updatedMilestones,
          progress,
          updatedAt: new Date().toISOString()
        };
      }
      return roadmap;
    }));
  };

  const renderOverviewTab = () => (
    <div className="space-y-8">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center">
              <Target className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-gray-900">{roadmaps.length}</span>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-1">Active Roadmaps</h3>
          <p className="text-gray-600 text-sm">Total roadmaps created</p>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-gray-900">
              {roadmaps.reduce((acc, roadmap) => 
                acc + roadmap.milestones.filter(m => m.status === 'completed').length, 0
              )}
            </span>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-1">Completed Milestones</h3>
          <p className="text-gray-600 text-sm">Across all roadmaps</p>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-gray-900">
              {Math.round(roadmaps.reduce((acc, roadmap) => acc + roadmap.progress, 0) / roadmaps.length) || 0}%
            </span>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-1">Average Progress</h3>
          <p className="text-gray-600 text-sm">Overall completion rate</p>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl flex items-center justify-center">
              <Clock className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-gray-900">
              {roadmaps.filter(roadmap => 
                roadmap.milestones.some(m => m.status === 'in_progress')
              ).length}
            </span>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-1">In Progress</h3>
          <p className="text-gray-600 text-sm">Active roadmaps</p>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Recent Activity</h2>
        <div className="space-y-4">
          {roadmaps.slice(0, 3).map(roadmap => (
            <div key={roadmap.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center">
                <Target className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">{roadmap.title}</h3>
                <p className="text-sm text-gray-600">{roadmap.description}</p>
                <div className="flex items-center gap-4 mt-2">
                  <span className="text-sm text-gray-500">{roadmap.industry}</span>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    stages.find(s => s.value === roadmap.stage)?.color
                  }`}>
                    {stages.find(s => s.value === roadmap.stage)?.label}
                  </span>
                  <span className="text-sm text-gray-500">{roadmap.progress}% complete</span>
                </div>
              </div>
              <div className="w-16 h-16 relative">
                <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 36 36">
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="#e5e7eb"
                    strokeWidth="2"
                  />
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="#8b5cf6"
                    strokeWidth="2"
                    strokeDasharray={`${roadmap.progress}, 100`}
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-xs font-semibold text-gray-700">{roadmap.progress}%</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderRoadmapsTab = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">My Roadmaps</h2>
        <button
          onClick={() => setShowCreateModal(true)}
          className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all font-semibold"
        >
          <Plus className="w-5 h-5 inline mr-2" />
          Create Roadmap
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {roadmaps.map(roadmap => (
          <div key={roadmap.id} className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{roadmap.title}</h3>
                  <p className="text-gray-600 mb-3">{roadmap.description}</p>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span>{roadmap.industry}</span>
                    <span className={`px-2 py-1 rounded-full ${
                      stages.find(s => s.value === roadmap.stage)?.color
                    }`}>
                      {stages.find(s => s.value === roadmap.stage)?.label}
                    </span>
                    <span>{roadmap.duration} months</span>
                  </div>
                </div>
                <div className="w-16 h-16 relative">
                  <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 36 36">
                    <path
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="#e5e7eb"
                      strokeWidth="2"
                    />
                    <path
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="#8b5cf6"
                      strokeWidth="2"
                      strokeDasharray={`${roadmap.progress}, 100`}
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-xs font-semibold text-gray-700">{roadmap.progress}%</span>
                  </div>
                </div>
              </div>

              <div className="mb-4">
                <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                  <span>Progress</span>
                  <span>{roadmap.progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${roadmap.progress}%` }}
                  ></div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-500">
                  {roadmap.milestones.filter(m => m.status === 'completed').length} / {roadmap.milestones.length} milestones
                </div>
                <button
                  onClick={() => {
                    setSelectedRoadmap(roadmap);
                    setActiveTab('overview');
                  }}
                  className="px-4 py-2 bg-purple-100 text-purple-700 rounded-xl hover:bg-purple-200 transition-colors text-sm font-semibold"
                >
                  View Details
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderTemplatesTab = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Roadmap Templates</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stages.map(stage => (
          <div key={stage.value} className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${stage.color}`}>
                <Target className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">{stage.label}</h3>
            </div>
            
            <p className="text-gray-600 mb-4">
              {stage.value === 'idea' && 'Perfect for validating your startup idea and building the foundation.'}
              {stage.value === 'mvp' && 'Build and launch your minimum viable product to test the market.'}
              {stage.value === 'early' && 'Scale your validated product and grow your user base.'}
              {stage.value === 'growth' && 'Expand to new markets and scale your business operations.'}
            </p>
            
            <div className="mb-4">
              <div className="text-sm text-gray-600 mb-2">Includes {milestoneTemplates[stage.value]?.length || 0} milestones:</div>
              <div className="space-y-1">
                {milestoneTemplates[stage.value]?.slice(0, 3).map(milestone => (
                  <div key={milestone.id} className="text-sm text-gray-500 flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-purple-500 rounded-full"></div>
                    {milestone.title}
                  </div>
                ))}
                {milestoneTemplates[stage.value]?.length > 3 && (
                  <div className="text-sm text-gray-400">
                    +{milestoneTemplates[stage.value].length - 3} more milestones
                  </div>
                )}
              </div>
            </div>
            
            <button
              onClick={() => {
                setNewRoadmap(prev => ({ ...prev, stage: stage.value }));
                setShowCreateModal(true);
              }}
              className="w-full px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all font-semibold"
            >
              Use Template
            </button>
          </div>
        ))}
      </div>
    </div>
  );

  const renderProgressTab = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Progress Tracking</h2>
      
      {roadmaps.map(roadmap => (
        <div key={roadmap.id} className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-bold text-gray-900">{roadmap.title}</h3>
              <p className="text-gray-600">{roadmap.description}</p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-gray-900">{roadmap.progress}%</div>
              <div className="text-sm text-gray-500">Complete</div>
            </div>
          </div>

          <div className="space-y-4">
            {roadmap.milestones.map(milestone => (
              <div key={milestone.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  milestone.status === 'completed' ? 'bg-green-500 text-white' :
                  milestone.status === 'in_progress' ? 'bg-blue-500 text-white' :
                  'bg-gray-300 text-gray-600'
                }`}>
                  {milestone.status === 'completed' ? (
                    <CheckCircle className="w-5 h-5" />
                  ) : milestone.status === 'in_progress' ? (
                    <Clock className="w-5 h-5" />
                  ) : (
                    <div className="w-2 h-2 rounded-full bg-current"></div>
                  )}
                </div>
                
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900">{milestone.title}</h4>
                  <p className="text-sm text-gray-600">{milestone.description}</p>
                  <div className="flex items-center gap-4 mt-1 text-xs text-gray-500">
                    <span>{milestone.duration}</span>
                    <span className={`px-2 py-1 rounded-full ${
                      milestone.category === 'Research' ? 'bg-blue-100 text-blue-700' :
                      milestone.category === 'Validation' ? 'bg-green-100 text-green-700' :
                      milestone.category === 'Design' ? 'bg-purple-100 text-purple-700' :
                      milestone.category === 'Development' ? 'bg-orange-100 text-orange-700' :
                      milestone.category === 'Testing' ? 'bg-yellow-100 text-yellow-700' :
                      milestone.category === 'Launch' ? 'bg-red-100 text-red-700' :
                      milestone.category === 'Funding' ? 'bg-indigo-100 text-indigo-700' :
                      milestone.category === 'Team' ? 'bg-pink-100 text-pink-700' :
                      milestone.category === 'Marketing' ? 'bg-cyan-100 text-cyan-700' :
                      milestone.category === 'Business' ? 'bg-emerald-100 text-emerald-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {milestone.category}
                    </span>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  {milestone.status === 'pending' && (
                    <button
                      onClick={() => updateMilestoneStatus(roadmap.id, milestone.id, 'in_progress')}
                      className="px-3 py-1 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors text-sm"
                    >
                      Start
                    </button>
                  )}
                  {milestone.status === 'in_progress' && (
                    <button
                      onClick={() => updateMilestoneStatus(roadmap.id, milestone.id, 'completed')}
                      className="px-3 py-1 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors text-sm"
                    >
                      Complete
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );

  const renderCreateModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Create New Roadmap</h2>
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
                Roadmap Title *
              </label>
              <input
                type="text"
                value={newRoadmap.title}
                onChange={(e) => setNewRoadmap(prev => ({ ...prev, title: e.target.value }))}
                placeholder="e.g., My Startup Roadmap"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Description
              </label>
              <textarea
                value={newRoadmap.description}
                onChange={(e) => setNewRoadmap(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Describe your startup idea..."
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Industry
                </label>
                <select
                  value={newRoadmap.industry}
                  onChange={(e) => setNewRoadmap(prev => ({ ...prev, industry: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="">Select industry</option>
                  {industries.map(industry => (
                    <option key={industry} value={industry}>{industry}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Current Stage
                </label>
                <select
                  value={newRoadmap.stage}
                  onChange={(e) => setNewRoadmap(prev => ({ ...prev, stage: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  {stages.map(stage => (
                    <option key={stage.value} value={stage.value}>{stage.label}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Duration (months)
              </label>
              <input
                type="number"
                value={newRoadmap.duration}
                onChange={(e) => setNewRoadmap(prev => ({ ...prev, duration: e.target.value }))}
                min="1"
                max="24"
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
                onClick={createRoadmap}
                className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all"
              >
                Create Roadmap
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
          <p className="text-gray-600 font-medium text-lg">Loading roadmaps...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Startup Roadmap Generator</h1>
            <p className="text-gray-600">Create customized roadmaps for your startup journey</p>
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
                  </button>
                );
              })}
            </div>
          </div>

          {/* Content */}
          <div className="max-w-6xl mx-auto">
            {activeTab === 'overview' && renderOverviewTab()}
            {activeTab === 'roadmaps' && renderRoadmapsTab()}
            {activeTab === 'templates' && renderTemplatesTab()}
            {activeTab === 'progress' && renderProgressTab()}
          </div>
        </div>
      </div>

      {/* Create Modal */}
      {showCreateModal && renderCreateModal()}
    </div>
  );
};

export default StartupRoadmap;
