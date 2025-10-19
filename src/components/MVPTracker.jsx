import React, { useState, useEffect } from 'react';
import { 
  Rocket, Target, CheckCircle, Clock, AlertCircle, 
  BarChart3, TrendingUp, Award, Star, Zap, Users,
  Calendar, FileText, MessageSquare, Video, Plus,
  Edit3, Trash2, Save, Download, Share2, Eye,
  ChevronRight, ChevronDown, ChevronUp, ArrowRight,
  ArrowLeft, ArrowUp, ArrowDown, Maximize2, Minimize2,
  RotateCcw, RotateCw, ZoomIn, ZoomOut, Move, Copy,
  Scissors, Trash2 as Trash2Icon, Save as SaveIcon,
  Upload, Download as DownloadIcon, Link, Link2, Unlink,
  Lock, Key, KeyRound, Shield, ShieldCheck, ShieldAlert,
  AlertTriangle, AlertOctagon, AlertCircle as AlertCircleIcon,
  Info, HelpCircle, CheckCircle2, XCircle, PlusCircle,
  MinusCircle, X as XIcon, Check as CheckIcon,
  AlertTriangle as AlertTriangleIcon, AlertOctagon as AlertOctagonIcon,
  AlertCircle as AlertCircleIcon2, Info as InfoIcon,
  HelpCircle as HelpCircleIcon, CheckCircle as CheckCircleIcon,
  XCircle as XCircleIcon, PlusCircle as PlusCircleIcon,
  MinusCircle as MinusCircleIcon, X as XIcon2, Check as CheckIcon2,
  Globe, Phone, Mail, Instagram, Twitter, Linkedin, Github,
  ExternalLink, Coffee, Plane, Gamepad2, BookOpen,
  Users as UsersIcon, Clock as ClockIcon, BarChart3 as BarChart3Icon,
  Activity, Compass, Shield as ShieldIcon, Badge, Gift,
  Video as VideoIcon, FileText as FileTextIcon,
  Download as DownloadIcon2, Play, Pause, Volume2, ThumbsUp,
  MessageSquare as MessageSquareIcon, Send, Bookmark, Flag,
  MoreHorizontal, Search, Filter, SortAsc, SortDesc, RefreshCw,
  Bell, BellOff, Eye as EyeIcon, EyeOff as EyeOffIcon,
  ChevronUp as ChevronUpIcon, ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon, ChevronDown as ChevronDownIcon,
  ArrowRight as ArrowRightIcon, ArrowLeft as ArrowLeftIcon,
  ArrowUp as ArrowUpIcon, ArrowDown as ArrowDownIcon,
  Maximize2 as Maximize2Icon, Minimize2 as Minimize2Icon,
  RotateCcw as RotateCcwIcon, RotateCw as RotateCwIcon,
  ZoomIn as ZoomInIcon, ZoomOut as ZoomOutIcon, Move as MoveIcon,
  Copy as CopyIcon, Scissors as ScissorsIcon, Trash2 as Trash2Icon2,
  Save as SaveIcon2, Upload as UploadIcon, Download as DownloadIcon3,
  Link as LinkIcon, Link2 as Link2Icon2, Unlink as UnlinkIcon,
  Lock as LockIcon, Key as KeyIcon, KeyRound as KeyRoundIcon,
  Shield as ShieldIcon2, ShieldCheck as ShieldCheckIcon,
  ShieldAlert as ShieldAlertIcon, AlertCircle as AlertCircleIcon3,
  Info as InfoIcon2, HelpCircle as HelpCircleIcon2,
  CheckCircle as CheckCircleIcon2, XCircle as XCircleIcon2,
  PlusCircle as PlusCircleIcon2, MinusCircle as MinusCircleIcon2,
  X as XIcon3, Check as CheckIcon3, AlertTriangle as AlertTriangleIcon2,
  AlertOctagon as AlertOctagonIcon2, AlertCircle as AlertCircleIcon4,
  Info as InfoIcon3, HelpCircle as HelpCircleIcon3,
  CheckCircle as CheckCircleIcon3, XCircle as XCircleIcon3,
  PlusCircle as PlusCircleIcon3, MinusCircle as MinusCircleIcon3,
  X as XIcon4, Check as CheckIcon4, Lightbulb, Code,
  Palette, Music, Coffee as CoffeeIcon, Plane as PlaneIcon,
  Gamepad2 as Gamepad2Icon, BookOpen as BookOpenIcon,
  Users as UsersIcon2, Clock as ClockIcon2, BarChart3 as BarChart3Icon2,
  Activity as ActivityIcon, Compass as CompassIcon,
  Shield as ShieldIcon3, Badge as BadgeIcon, Gift as GiftIcon,
  Video as VideoIcon2, FileText as FileTextIcon2,
  Download as DownloadIcon4, Play as PlayIcon, Pause as PauseIcon,
  Volume2 as Volume2Icon, ThumbsUp as ThumbsUpIcon,
  MessageSquare as MessageSquareIcon2, Send as SendIcon,
  Bookmark as BookmarkIcon, Flag as FlagIcon,
  MoreHorizontal as MoreHorizontalIcon, Search as SearchIcon,
  Filter as FilterIcon, SortAsc as SortAscIcon, SortDesc as SortDescIcon,
  RefreshCw as RefreshCwIcon, Bell as BellIcon, BellOff as BellOffIcon,
  Eye as EyeIcon2, EyeOff as EyeOffIcon2, ChevronUp as ChevronUpIcon2,
  ChevronLeft as ChevronLeftIcon2, ChevronRight as ChevronRightIcon2,
  ChevronDown as ChevronDownIcon2, ArrowRight as ArrowRightIcon2,
  ArrowLeft as ArrowLeftIcon2, ArrowUp as ArrowUpIcon2,
  ArrowDown as ArrowDownIcon2, Maximize2 as Maximize2Icon2,
  Minimize2 as Minimize2Icon2, RotateCcw as RotateCcwIcon2,
  RotateCw as RotateCwIcon2, ZoomIn as ZoomInIcon2,
  ZoomOut as ZoomOutIcon2, Move as MoveIcon2, Copy as CopyIcon2,
  Scissors as ScissorsIcon2, Trash2 as Trash2Icon3,
  Save as SaveIcon3, Upload as UploadIcon2, Download as DownloadIcon5,
  Link as LinkIcon2, Link2 as Link2Icon3, Unlink as UnlinkIcon2,
  Lock as LockIcon2, Key as KeyIcon2, KeyRound as KeyRoundIcon2,
  Shield as ShieldIcon4, ShieldCheck as ShieldCheckIcon2,
  ShieldAlert as ShieldAlertIcon2, AlertCircle as AlertCircleIcon5,
  Info as InfoIcon4, HelpCircle as HelpCircleIcon4,
  CheckCircle as CheckCircleIcon4, XCircle as XCircleIcon4,
  PlusCircle as PlusCircleIcon4, MinusCircle as MinusCircleIcon4,
  X as XIcon5, Check as CheckIcon5, AlertTriangle as AlertTriangleIcon3,
  AlertOctagon as AlertOctagonIcon3, AlertCircle as AlertCircleIcon6,
  Info as InfoIcon5, HelpCircle as HelpCircleIcon5,
  CheckCircle as CheckCircleIcon5, XCircle as XCircleIcon5,
  PlusCircle as PlusCircleIcon5, MinusCircle as MinusCircleIcon5,
  X as XIcon6, Check as CheckIcon6, Building2, DollarSign,
  Phone as PhoneIcon, Mail as MailIcon, Instagram as InstagramIcon,
  Twitter as TwitterIcon, Linkedin as LinkedinIcon, Github as GithubIcon,
  ExternalLink as ExternalLinkIcon, Coffee as CoffeeIcon2,
  Plane as PlaneIcon2, Gamepad2 as Gamepad2Icon2, BookOpen as BookOpenIcon2,
  Users as UsersIcon3, Clock as ClockIcon3, BarChart3 as BarChart3Icon3,
  Activity as ActivityIcon2, Compass as CompassIcon2,
  Shield as ShieldIcon5, Badge as BadgeIcon2, Gift as GiftIcon2,
  Video as VideoIcon3, FileText as FileTextIcon3,
  Download as DownloadIcon6, Play as PlayIcon2, Pause as PauseIcon2,
  Volume2 as Volume2Icon2, ThumbsUp as ThumbsUpIcon2,
  MessageSquare as MessageSquareIcon3, Send as SendIcon2,
  Bookmark as BookmarkIcon2, Flag as FlagIcon2,
  MoreHorizontal as MoreHorizontalIcon2, Search as SearchIcon2,
  Filter as FilterIcon2, SortAsc as SortAscIcon2, SortDesc as SortDescIcon2,
  RefreshCw as RefreshCwIcon2, Bell as BellIcon2, BellOff as BellOffIcon2,
  Eye as EyeIcon3, EyeOff as EyeOffIcon3, ChevronUp as ChevronUpIcon3,
  ChevronLeft as ChevronLeftIcon3, ChevronRight as ChevronRightIcon3,
  ChevronDown as ChevronDownIcon3, ArrowRight as ArrowRightIcon3,
  ArrowLeft as ArrowLeftIcon3, ArrowUp as ArrowUpIcon3,
  ArrowDown as ArrowDownIcon3, Maximize2 as Maximize2Icon3,
  Minimize2 as Minimize2Icon3, RotateCcw as RotateCcwIcon3,
  RotateCw as RotateCwIcon3, ZoomIn as ZoomInIcon3,
  ZoomOut as ZoomOutIcon3, Move as MoveIcon3, Copy as CopyIcon3,
  Scissors as ScissorsIcon3, Trash2 as Trash2Icon4,
  Save as SaveIcon4, Upload as UploadIcon3, Download as DownloadIcon7,
  Link as LinkIcon3, Link2 as Link2Icon4, Unlink as UnlinkIcon3,
  Lock as LockIcon3, Key as KeyIcon3, KeyRound as KeyRoundIcon3,
  Shield as ShieldIcon6, ShieldCheck as ShieldCheckIcon3,
  ShieldAlert as ShieldAlertIcon3, AlertCircle as AlertCircleIcon7,
  Info as InfoIcon6, HelpCircle as HelpCircleIcon6,
  CheckCircle as CheckCircleIcon6, XCircle as XCircleIcon6,
  PlusCircle as PlusCircleIcon6, MinusCircle as MinusCircleIcon6,
  X as XIcon7, Check as CheckIcon7, AlertTriangle as AlertTriangleIcon4,
  AlertOctagon as AlertOctagonIcon4, AlertCircle as AlertCircleIcon8,
  Info as InfoIcon7, HelpCircle as HelpCircleIcon7,
  CheckCircle as CheckCircleIcon7, XCircle as XCircleIcon7,
  PlusCircle as PlusCircleIcon7, MinusCircle as MinusCircleIcon7,
  X as XIcon8, Check as CheckIcon8
} from 'lucide-react';

const MVPTracker = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [mvps, setMvps] = useState([]);
  const [selectedMvp, setSelectedMvp] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [newMvp, setNewMvp] = useState({
    name: '',
    description: '',
    targetLaunchDate: '',
    features: [],
    metrics: [],
    team: []
  });

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'mvps', label: 'My MVPs', icon: Rocket },
    { id: 'features', label: 'Features', icon: Target },
    { id: 'metrics', label: 'Metrics', icon: TrendingUp },
    { id: 'launch', label: 'Launch Prep', icon: Calendar }
  ];

  const featureCategories = [
    'Core Features', 'User Authentication', 'Payment Integration',
    'Admin Panel', 'Mobile App', 'API', 'Analytics', 'Notifications'
  ];

  const metrics = [
    'User Signups', 'Active Users', 'Revenue', 'Conversion Rate',
    'Retention Rate', 'Churn Rate', 'Customer Acquisition Cost',
    'Lifetime Value', 'Monthly Recurring Revenue'
  ];

  useEffect(() => {
    loadMvps();
  }, []);

  const loadMvps = async () => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockMvps = [
        {
          id: 1,
          name: 'EcoTrack AI MVP',
          description: 'AI-powered carbon footprint tracking for businesses',
          targetLaunchDate: '2024-03-31',
          status: 'development',
          progress: 65,
          features: [
            {
              id: 1,
              name: 'User Dashboard',
              description: 'Main dashboard showing carbon footprint data',
              category: 'Core Features',
              status: 'completed',
              priority: 'high',
              estimatedHours: 40,
              actualHours: 35,
              assignee: 'Alex Chen'
            },
            {
              id: 2,
              name: 'AI Calculation Engine',
              description: 'Machine learning model for carbon calculations',
              category: 'Core Features',
              status: 'in_progress',
              priority: 'high',
              estimatedHours: 80,
              actualHours: 50,
              assignee: 'Alex Chen'
            },
            {
              id: 3,
              name: 'User Authentication',
              description: 'Login and registration system',
              category: 'User Authentication',
              status: 'completed',
              priority: 'medium',
              estimatedHours: 20,
              actualHours: 18,
              assignee: 'Sarah Martinez'
            },
            {
              id: 4,
              name: 'Payment Integration',
              description: 'Stripe integration for subscriptions',
              category: 'Payment Integration',
              status: 'pending',
              priority: 'medium',
              estimatedHours: 30,
              actualHours: 0,
              assignee: 'David Kim'
            }
          ],
          metrics: [
            {
              id: 1,
              name: 'User Signups',
              target: 1000,
              current: 150,
              unit: 'users',
              trend: 'up'
            },
            {
              id: 2,
              name: 'Monthly Recurring Revenue',
              target: 5000,
              current: 1200,
              unit: 'USD',
              trend: 'up'
            },
            {
              id: 3,
              name: 'Conversion Rate',
              target: 15,
              current: 8.5,
              unit: '%',
              trend: 'up'
            }
          ],
          team: [
            { id: 1, name: 'Alex Chen', role: 'Tech Lead', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face' },
            { id: 2, name: 'Sarah Martinez', role: 'Product Manager', avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=400&fit=crop&crop=face' },
            { id: 3, name: 'David Kim', role: 'UI/UX Designer', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face' }
          ],
          createdAt: '2024-01-01',
          updatedAt: '2024-01-20'
        }
      ];
      
      setMvps(mockMvps);
    } catch (error) {
      console.error('Error loading MVPs:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const createMvp = () => {
    const mvp = {
      ...newMvp,
      id: Date.now(),
      status: 'planning',
      progress: 0,
      features: [],
      metrics: [],
      team: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    setMvps(prev => [...prev, mvp]);
    setShowCreateModal(false);
    setNewMvp({
      name: '',
      description: '',
      targetLaunchDate: '',
      features: [],
      metrics: [],
      team: []
    });
  };

  const updateFeatureStatus = (mvpId, featureId, status) => {
    setMvps(prev => prev.map(mvp => {
      if (mvp.id === mvpId) {
        const updatedFeatures = mvp.features.map(feature => {
          if (feature.id === featureId) {
            return { ...feature, status };
          }
          return feature;
        });
        
        const completedFeatures = updatedFeatures.filter(f => f.status === 'completed').length;
        const progress = Math.round((completedFeatures / updatedFeatures.length) * 100);
        
        return {
          ...mvp,
          features: updatedFeatures,
          progress: isNaN(progress) ? 0 : progress,
          updatedAt: new Date().toISOString()
        };
      }
      return mvp;
    }));
  };

  const getDaysUntilLaunch = (launchDate) => {
    const today = new Date();
    const launch = new Date(launchDate);
    const diffTime = launch - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const renderOverviewTab = () => (
    <div className="space-y-8">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center">
              <Rocket className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-gray-900">{mvps.length}</span>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-1">Active MVPs</h3>
          <p className="text-gray-600 text-sm">Total MVPs in development</p>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center">
              <Target className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-gray-900">
              {mvps.reduce((acc, mvp) => acc + mvp.features.filter(f => f.status === 'completed').length, 0)}
            </span>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-1">Features Completed</h3>
          <p className="text-gray-600 text-sm">Across all MVPs</p>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-gray-900">
              {Math.round(mvps.reduce((acc, mvp) => acc + mvp.progress, 0) / mvps.length) || 0}%
            </span>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-1">Average Progress</h3>
          <p className="text-gray-600 text-sm">Overall completion rate</p>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl flex items-center justify-center">
              <Calendar className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-gray-900">
              {mvps.length > 0 ? getDaysUntilLaunch(mvps[0].targetLaunchDate) : 0}
            </span>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-1">Days to Launch</h3>
          <p className="text-gray-600 text-sm">Next MVP launch</p>
        </div>
      </div>

      {/* Recent MVPs */}
      <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Recent MVPs</h2>
        <div className="space-y-4">
          {mvps.slice(0, 3).map(mvp => (
            <div key={mvp.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center">
                <Rocket className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">{mvp.name}</h3>
                <p className="text-sm text-gray-600">{mvp.description}</p>
                <div className="flex items-center gap-4 mt-2">
                  <span className="text-sm text-gray-500">{mvp.progress}% complete</span>
                  <span className="text-sm text-gray-500">{mvp.features.length} features</span>
                  <span className="text-sm text-gray-500">Launch: {mvp.targetLaunchDate}</span>
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
                    strokeDasharray={`${mvp.progress}, 100`}
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-xs font-semibold text-gray-700">{mvp.progress}%</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderMvpsTab = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">My MVPs</h2>
        <button
          onClick={() => setShowCreateModal(true)}
          className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all font-semibold"
        >
          <Plus className="w-5 h-5 inline mr-2" />
          Create MVP
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {mvps.map(mvp => (
          <div key={mvp.id} className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="text-xl font-bold text-gray-900 mb-2">{mvp.name}</h3>
                <p className="text-gray-600 mb-3">{mvp.description}</p>
                
                <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                  <span>Launch: {mvp.targetLaunchDate}</span>
                  <span>{mvp.features.length} features</span>
                  <span>{mvp.team.length} team members</span>
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
                    strokeDasharray={`${mvp.progress}, 100`}
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-xs font-semibold text-gray-700">{mvp.progress}%</span>
                </div>
              </div>
            </div>

            <div className="mb-4">
              <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                <span>Progress</span>
                <span>{mvp.progress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${mvp.progress}%` }}
                ></div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-500">
                {getDaysUntilLaunch(mvp.targetLaunchDate)} days to launch
              </div>
              <button
                onClick={() => setSelectedMvp(mvp)}
                className="px-4 py-2 bg-purple-100 text-purple-700 rounded-xl hover:bg-purple-200 transition-colors text-sm font-semibold"
              >
                View Details
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderFeaturesTab = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Feature Planning</h2>
      
      <div className="space-y-6">
        {mvps.map(mvp => (
          <div key={mvp.id} className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">{mvp.name}</h3>
            <div className="space-y-3">
              {mvp.features.map(feature => (
                <div key={feature.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                  <button
                    onClick={() => updateFeatureStatus(mvp.id, feature.id, 
                      feature.status === 'completed' ? 'pending' : 'completed'
                    )}
                    className={`w-6 h-6 rounded-full flex items-center justify-center ${
                      feature.status === 'completed' ? 'bg-green-500 text-white' : 'bg-gray-300 text-gray-600'
                    }`}
                  >
                    {feature.status === 'completed' && <CheckCircle className="w-4 h-4" />}
                  </button>
                  
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900">{feature.name}</h4>
                    <p className="text-sm text-gray-600">{feature.description}</p>
                    <div className="flex items-center gap-4 mt-1 text-xs text-gray-500">
                      <span>{feature.category}</span>
                      <span>{feature.estimatedHours}h estimated</span>
                      <span>{feature.actualHours}h actual</span>
                      <span>Assigned to {feature.assignee}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      feature.priority === 'high' ? 'bg-red-100 text-red-700' :
                      feature.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {feature.priority}
                    </span>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      feature.status === 'completed' ? 'bg-green-100 text-green-700' :
                      feature.status === 'in_progress' ? 'bg-blue-100 text-blue-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {feature.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderMetricsTab = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Key Metrics</h2>
      
      <div className="space-y-6">
        {mvps.map(mvp => (
          <div key={mvp.id} className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">{mvp.name}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {mvp.metrics.map(metric => (
                <div key={metric.id} className="p-4 bg-gray-50 rounded-xl">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-gray-900">{metric.name}</h4>
                    <span className={`text-sm ${
                      metric.trend === 'up' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {metric.trend === 'up' ? '↗' : '↘'}
                    </span>
                  </div>
                  <div className="text-2xl font-bold text-gray-900 mb-1">
                    {metric.current.toLocaleString()} {metric.unit}
                  </div>
                  <div className="text-sm text-gray-500">
                    Target: {metric.target.toLocaleString()} {metric.unit}
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                    <div 
                      className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full"
                      style={{ width: `${Math.min((metric.current / metric.target) * 100, 100)}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderLaunchTab = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Launch Preparation</h2>
      
      <div className="space-y-6">
        {mvps.map(mvp => {
          const daysLeft = getDaysUntilLaunch(mvp.targetLaunchDate);
          return (
            <div key={mvp.id} className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">{mvp.name}</h3>
                <div className="text-right">
                  <div className="text-2xl font-bold text-purple-600">{daysLeft}</div>
                  <div className="text-sm text-gray-500">days to launch</div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-4 bg-blue-50 rounded-xl">
                  <h4 className="font-semibold text-gray-900 mb-2">Pre-Launch Checklist</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span>Beta testing complete</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span>Performance optimization</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-yellow-500" />
                      <span>Marketing materials ready</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-yellow-500" />
                      <span>Launch announcement prepared</span>
                    </div>
                  </div>
                </div>
                
                <div className="p-4 bg-green-50 rounded-xl">
                  <h4 className="font-semibold text-gray-900 mb-2">Launch Strategy</h4>
                  <div className="space-y-2 text-sm">
                    <div>• Soft launch to beta users</div>
                    <div>• Social media campaign</div>
                    <div>• Press release distribution</div>
                    <div>• Influencer partnerships</div>
                  </div>
                </div>
                
                <div className="p-4 bg-purple-50 rounded-xl">
                  <h4 className="font-semibold text-gray-900 mb-2">Success Metrics</h4>
                  <div className="space-y-2 text-sm">
                    <div>• 1000+ signups in first week</div>
                    <div>• 15% conversion rate</div>
                    <div>• 4.5+ app store rating</div>
                    <div>• 50+ media mentions</div>
                  </div>
                </div>
                
                <div className="p-4 bg-orange-50 rounded-xl">
                  <h4 className="font-semibold text-gray-900 mb-2">Risk Mitigation</h4>
                  <div className="space-y-2 text-sm">
                    <div>• Backup servers ready</div>
                    <div>• Customer support team trained</div>
                    <div>• Rollback plan prepared</div>
                    <div>• Monitoring systems active</div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium text-lg">Loading MVPs...</p>
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
            <h1 className="text-3xl font-bold text-gray-900 mb-2">MVP Development Tracker</h1>
            <p className="text-gray-600">Track your MVP development progress and prepare for launch</p>
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
            {activeTab === 'mvps' && renderMvpsTab()}
            {activeTab === 'features' && renderFeaturesTab()}
            {activeTab === 'metrics' && renderMetricsTab()}
            {activeTab === 'launch' && renderLaunchTab()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MVPTracker;
