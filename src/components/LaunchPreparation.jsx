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

const LaunchPreparation = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [launches, setLaunches] = useState([]);
  const [selectedLaunch, setSelectedLaunch] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [newLaunch, setNewLaunch] = useState({
    name: '',
    description: '',
    launchDate: '',
    targetAudience: '',
    channels: [],
    metrics: []
  });

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'pitch', label: 'Pitch & Showcase', icon: Rocket },
    { id: 'funding', label: 'Funding Hub', icon: DollarSign },
    { id: 'growth', label: 'Growth & Migration', icon: TrendingUp }
  ];

  const gtmChannels = [
    {
      id: 'social-media',
      name: 'Social Media',
      description: 'Facebook, Instagram, Twitter, LinkedIn marketing',
      cost: 'Medium',
      reach: 'High',
      conversion: 'Medium'
    },
    {
      id: 'content-marketing',
      name: 'Content Marketing',
      description: 'Blog posts, SEO, thought leadership',
      cost: 'Low',
      reach: 'Medium',
      conversion: 'High'
    },
    {
      id: 'paid-advertising',
      name: 'Paid Advertising',
      description: 'Google Ads, Facebook Ads, display advertising',
      cost: 'High',
      reach: 'High',
      conversion: 'Medium'
    },
    {
      id: 'pr',
      name: 'Public Relations',
      description: 'Press releases, media outreach, influencer partnerships',
      cost: 'Medium',
      reach: 'Medium',
      conversion: 'High'
    },
    {
      id: 'partnerships',
      name: 'Partnerships',
      description: 'Strategic partnerships and collaborations',
      cost: 'Low',
      reach: 'Medium',
      conversion: 'High'
    },
    {
      id: 'events',
      name: 'Events & Conferences',
      description: 'Trade shows, conferences, networking events',
      cost: 'High',
      reach: 'Low',
      conversion: 'High'
    }
  ];

  const investorReadiness = [
    {
      id: 'pitch-deck',
      name: 'Pitch Deck',
      description: '10-15 slide presentation covering key points',
      status: 'completed',
      priority: 'high'
    },
    {
      id: 'financial-model',
      name: 'Financial Model',
      description: '3-5 year financial projections and assumptions',
      status: 'in_progress',
      priority: 'high'
    },
    {
      id: 'business-plan',
      name: 'Business Plan',
      description: 'Comprehensive business strategy document',
      status: 'pending',
      priority: 'medium'
    },
    {
      id: 'market-analysis',
      name: 'Market Analysis',
      description: 'TAM, SAM, SOM and competitive landscape',
      status: 'completed',
      priority: 'high'
    },
    {
      id: 'team-bios',
      name: 'Team Bios',
      description: 'Founder and key team member backgrounds',
      status: 'completed',
      priority: 'medium'
    },
    {
      id: 'demo',
      name: 'Product Demo',
      description: 'Working prototype or MVP demonstration',
      status: 'in_progress',
      priority: 'high'
    }
  ];

  useEffect(() => {
    loadLaunches();
  }, []);

  const loadLaunches = async () => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockLaunches = [
        {
          id: 1,
          name: 'EcoTrack AI Launch',
          description: 'AI-powered carbon footprint tracking platform launch',
          launchDate: '2024-03-31',
          status: 'preparation',
          targetAudience: 'Sustainability-focused businesses',
          channels: ['social-media', 'content-marketing', 'pr'],
          metrics: [
            { name: 'User Signups', target: 1000, current: 150 },
            { name: 'Revenue', target: 5000, current: 1200 },
            { name: 'Media Mentions', target: 50, current: 12 }
          ],
          checklist: [
            { id: 1, task: 'Finalize product features', completed: true },
            { id: 2, task: 'Complete beta testing', completed: true },
            { id: 3, task: 'Prepare marketing materials', completed: false },
            { id: 4, task: 'Set up analytics tracking', completed: true },
            { id: 5, task: 'Create press kit', completed: false },
            { id: 6, task: 'Schedule launch event', completed: false }
          ],
          team: [
            { id: 1, name: 'Alex Chen', role: 'CTO', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face' },
            { id: 2, name: 'Sarah Martinez', role: 'CEO', avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=400&fit=crop&crop=face' },
            { id: 3, name: 'David Kim', role: 'CMO', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face' }
          ],
          createdAt: '2024-01-01',
          updatedAt: '2024-01-20'
        }
      ];
      
      setLaunches(mockLaunches);
    } catch (error) {
      console.error('Error loading launches:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const createLaunch = () => {
    const launch = {
      ...newLaunch,
      id: Date.now(),
      status: 'planning',
      metrics: [],
      checklist: [],
      team: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    setLaunches(prev => [...prev, launch]);
    setShowCreateModal(false);
    setNewLaunch({
      name: '',
      description: '',
      launchDate: '',
      targetAudience: '',
      channels: [],
      metrics: []
    });
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
      {/* Startup Passport */}
      <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 bg-black rounded-2xl flex items-center justify-center">
            <FileText className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Startup Passport</h2>
            <p className="text-gray-600">Auto-generated one-pager for investors</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Vision & Mission</h3>
              <p className="text-gray-600 mb-4">AI-powered workflow automation for remote teams</p>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Industry:</span>
                  <span className="font-medium">SaaS / Productivity</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Founded:</span>
                  <span className="font-medium">2024</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Location:</span>
                  <span className="font-medium">San Francisco, CA</span>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Team</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                    <Users className="w-5 h-5 text-gray-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Alex Chen</p>
                    <p className="text-sm text-gray-600">CEO & Technical Lead</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                    <Users className="w-5 h-5 text-gray-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Sarah Martinez</p>
                    <p className="text-sm text-gray-600">COO & Business Lead</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Traction</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">1,250+</div>
                  <div className="text-sm text-gray-600">Users</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">$15K</div>
                  <div className="text-sm text-gray-600">MRR</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">95%</div>
                  <div className="text-sm text-gray-600">Retention</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">4.8</div>
                  <div className="text-sm text-gray-600">Rating</div>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Stage Badge</h3>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-black rounded-xl flex items-center justify-center">
                  <Award className="w-6 h-6 text-white" />
                </div>
                <div>
                  <div className="text-lg font-bold text-gray-900">MVP Stage</div>
                  <div className="text-sm text-gray-600">Product built, testing with users</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 flex gap-3">
          <button className="px-6 py-3 bg-black text-white rounded-xl hover:bg-gray-800 transition-colors font-semibold">
            Generate Passport
          </button>
          <button className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors font-semibold">
            Download PDF
          </button>
        </div>
      </div>

      {/* Progress Meter */}
      <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Progress Meter</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { name: 'Build', progress: 85, description: 'Vision, roles, and foundation' },
            { name: 'Execute', progress: 70, description: 'Tasks, milestones, and team' },
            { name: 'Fund', progress: 45, description: 'Finance, investors, and launch' }
          ].map((section, index) => (
            <div key={index} className="bg-gray-50 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">{section.name}</h3>
                <span className="text-2xl font-bold text-gray-900">{section.progress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3 mb-3">
                <div 
                  className="bg-black h-3 rounded-full transition-all duration-500"
                  style={{ width: `${section.progress}%` }}
                ></div>
              </div>
              <p className="text-sm text-gray-600">{section.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Graduation Status */}
      <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
        <div className="text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center">
            <CheckCircle className="w-8 h-8 text-gray-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Graduation Status</h2>
          <p className="text-gray-600 mb-6">Ready to showcase your startup to the world</p>
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-full">
            <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
            <span className="font-medium">Not Ready Yet</span>
          </div>
        </div>
      </div>
    </div>
  );

  const renderPitchTab = () => (
    <div className="space-y-8">
      {/* Pitch Deck Upload */}
      <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 bg-black rounded-2xl flex items-center justify-center">
            <FileText className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Pitch Deck Upload</h2>
            <p className="text-gray-600">Version control, AI feedback, shareable links</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-4">
            <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-gray-400 transition-colors cursor-pointer">
              <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Upload Pitch Deck</h3>
              <p className="text-gray-600 mb-4">Drag & drop your presentation or click to browse</p>
              <button className="px-6 py-3 bg-black text-white rounded-xl hover:bg-gray-800 transition-colors font-semibold">
                Choose File
              </button>
            </div>

            <div className="bg-gray-50 rounded-xl p-4">
              <h4 className="font-semibold text-gray-900 mb-2">Current Version</h4>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">pitch-deck-v2.1.pdf</span>
                <span className="text-xs text-gray-500">2 days ago</span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-gray-50 rounded-xl p-6">
              <h4 className="font-semibold text-gray-900 mb-4">AI Feedback</h4>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                  <p className="text-sm text-gray-600">Strong problem statement and solution clarity</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
                  <p className="text-sm text-gray-600">Consider adding more traction metrics</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-red-500 rounded-full mt-2"></div>
                  <p className="text-sm text-gray-600">Financial projections need more detail</p>
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors text-sm font-semibold">
                Share Link
              </button>
              <button className="px-4 py-2 bg-black text-white rounded-xl hover:bg-gray-800 transition-colors text-sm font-semibold">
                Get AI Review
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Demo Video */}
      <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 bg-gray-600 rounded-2xl flex items-center justify-center">
            <Video className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Demo Video</h2>
            <p className="text-gray-600">2-minute video pitch showcasing your product</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-4">
            <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-gray-400 transition-colors cursor-pointer">
              <Video className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Upload Demo Video</h3>
              <p className="text-gray-600 mb-4">MP4, MOV, or AVI up to 100MB</p>
              <button className="px-6 py-3 bg-black text-white rounded-xl hover:bg-gray-800 transition-colors font-semibold">
                Upload Video
              </button>
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-gray-900 rounded-xl p-4 aspect-video flex items-center justify-center">
              <Play className="w-12 h-12 text-white" />
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-600">No video uploaded yet</p>
            </div>
          </div>
        </div>
      </div>

      {/* Startup Profile Page */}
      <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 bg-gray-700 rounded-2xl flex items-center justify-center">
            <Globe className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Startup Profile Page</h2>
            <p className="text-gray-600">Public-facing page for discovery and showcase</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-4">
            <div className="bg-gray-50 rounded-xl p-6">
              <h4 className="font-semibold text-gray-900 mb-4">Profile Preview</h4>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Status:</span>
                  <span className="text-green-600 font-medium">Live</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Views:</span>
                  <span className="font-medium">1,247</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">URL:</span>
                  <span className="text-blue-600 font-medium">cobuilders.com/startup/techflow-ai</span>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-gray-50 rounded-xl p-6">
              <h4 className="font-semibold text-gray-900 mb-4">Launch Events Access</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                  <span className="text-sm font-medium">Demo Day 2024</span>
                  <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full">Applied</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                  <span className="text-sm font-medium">Pitch Night SF</span>
                  <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full">Available</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                  <span className="text-sm font-medium">AMA Session</span>
                  <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full">Available</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 flex gap-3">
          <button className="px-6 py-3 bg-black text-white rounded-xl hover:bg-gray-800 transition-colors font-semibold">
            View Profile
          </button>
          <button className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors font-semibold">
            Edit Profile
          </button>
        </div>
      </div>
    </div>
  );

  const renderLaunchesTab = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Launch Plans</h2>
        <button
          onClick={() => setShowCreateModal(true)}
          className="px-6 py-3 bg-black text-white rounded-xl hover:bg-gray-800 transition-all font-semibold"
        >
          <Plus className="w-5 h-5 inline mr-2" />
          Create Launch Plan
        </button>
      </div>

      <div className="space-y-6">
        {launches.map(launch => (
          <div key={launch.id} className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
            <div className="flex items-start justify-between mb-6">
              <div className="flex-1">
                <h3 className="text-xl font-bold text-gray-900 mb-2">{launch.name}</h3>
                <p className="text-gray-600 mb-4">{launch.description}</p>
                
                <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                  <span>Launch: {launch.launchDate}</span>
                  <span>{launch.channels.length} channels</span>
                  <span>{launch.checklist.filter(item => item.completed).length}/{launch.checklist.length} tasks</span>
                </div>
              </div>
              
              <div className="flex gap-2">
                <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors text-sm font-semibold">
                  Edit
                </button>
                <button className="px-4 py-2 bg-black text-white rounded-xl hover:bg-gray-800 transition-colors text-sm font-semibold">
                  Launch
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="p-4 bg-gray-50 rounded-xl">
                <h4 className="font-semibold text-gray-900 mb-2">Target Audience</h4>
                <p className="text-sm text-gray-600">{launch.targetAudience}</p>
              </div>
              
              <div className="p-4 bg-gray-50 rounded-xl">
                <h4 className="font-semibold text-gray-900 mb-2">Channels</h4>
                <div className="flex flex-wrap gap-1">
                  {launch.channels.map((channel, index) => (
                    <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                      {channel}
                    </span>
                  ))}
                </div>
              </div>
              
              <div className="p-4 bg-gray-50 rounded-xl">
                <h4 className="font-semibold text-gray-900 mb-2">Progress</h4>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-black h-2 rounded-full"
                    style={{ width: `${(launch.checklist.filter(item => item.completed).length / launch.checklist.length) * 100}%` }}
                  ></div>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {launch.checklist.filter(item => item.completed).length}/{launch.checklist.length} tasks completed
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderFundingTab = () => (
    <div className="space-y-8">
      {/* Investor Room */}
      <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 bg-black rounded-2xl flex items-center justify-center">
            <Building2 className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Investor Room</h2>
            <p className="text-gray-600">Secure data room with deck, traction, financials, team info</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Data Room Contents</h3>
            <div className="space-y-3">
              {[
                { name: 'Pitch Deck', status: 'completed', size: '2.4 MB' },
                { name: 'Financial Model', status: 'completed', size: '1.8 MB' },
                { name: 'Market Analysis', status: 'completed', size: '3.2 MB' },
                { name: 'Legal Documents', status: 'pending', size: '0 MB' },
                { name: 'Team Bios', status: 'completed', size: '1.1 MB' },
                { name: 'Product Demo', status: 'in_progress', size: '0 MB' }
              ].map((doc, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <FileText className="w-5 h-5 text-gray-600" />
                    <div>
                      <p className="font-medium text-gray-900">{doc.name}</p>
                      <p className="text-sm text-gray-500">{doc.size}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      doc.status === 'completed' ? 'bg-gray-100 text-gray-800' :
                      doc.status === 'in_progress' ? 'bg-gray-100 text-gray-700' :
                      'bg-gray-100 text-gray-600'
                    }`}>
                      {doc.status}
                    </span>
                    <button className="p-1 text-gray-400 hover:text-gray-600">
                      <Download className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Access Control</h3>
            <div className="bg-gray-50 rounded-xl p-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Public Access:</span>
                  <span className="text-red-600 font-medium">Disabled</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Password Protected:</span>
                  <span className="text-green-600 font-medium">Enabled</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">View Tracking:</span>
                  <span className="text-green-600 font-medium">Enabled</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Download Tracking:</span>
                  <span className="text-green-600 font-medium">Enabled</span>
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <button className="px-4 py-2 bg-black text-white rounded-xl hover:bg-gray-800 transition-colors text-sm font-semibold">
                Generate Link
              </button>
              <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors text-sm font-semibold">
                Upload Files
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Fundraising Tracker */}
      <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 bg-gray-600 rounded-2xl flex items-center justify-center">
            <DollarSign className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Fundraising Tracker</h2>
            <p className="text-gray-600">Track committed $, open $ target, round type</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-gray-50 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Round Details</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Round Type:</span>
                <span className="font-medium">Pre-seed</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Target Amount:</span>
                <span className="font-medium">$500K</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Committed:</span>
                <span className="font-medium text-green-600">$150K</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Remaining:</span>
                <span className="font-medium">$350K</span>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Progress</h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-gray-600">Fundraising Progress</span>
                  <span className="text-sm font-medium">30%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div className="bg-black h-3 rounded-full" style={{ width: '30%' }}></div>
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">$150K</div>
                <div className="text-sm text-gray-600">of $500K raised</div>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Investors</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Lead Investor:</span>
                <span className="text-sm font-medium">TBD</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Angel Investors:</span>
                <span className="text-sm font-medium">3</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">VC Interest:</span>
                <span className="text-sm font-medium">5</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* VC & Angel Access */}
      <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 bg-gray-700 rounded-2xl flex items-center justify-center">
            <Users className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">VC & Angel Access</h2>
            <p className="text-gray-600">Directory of partnered investors and accelerators</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { name: 'Y Combinator', type: 'Accelerator', status: 'Available', tier: 'Premium' },
            { name: 'Sequoia Capital', type: 'VC', status: 'Available', tier: 'Premium' },
            { name: 'Andreessen Horowitz', type: 'VC', status: 'Available', tier: 'Premium' },
            { name: 'Antler', type: 'Accelerator', status: 'Available', tier: 'Free' },
            { name: 'Entrepreneur First', type: 'Accelerator', status: 'Available', tier: 'Free' },
            { name: 'Techstars', type: 'Accelerator', status: 'Available', tier: 'Premium' }
          ].map((investor, index) => (
            <div key={index} className="bg-gray-50 rounded-xl p-6">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-gray-900">{investor.name}</h3>
                <span className={`px-2 py-1 text-xs rounded-full ${
                  investor.tier === 'Premium' ? 'bg-gray-100 text-gray-800' : 'bg-gray-100 text-gray-600'
                }`}>
                  {investor.tier}
                </span>
              </div>
              <p className="text-sm text-gray-600 mb-4">{investor.type}</p>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">{investor.status}</span>
                <button className="px-3 py-1 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors text-xs font-semibold">
                  Apply
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderGTMTab = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Go-to-Market Strategy</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {gtmChannels.map(channel => (
          <div key={channel.id} className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">{channel.name}</h3>
            <p className="text-gray-600 mb-4">{channel.description}</p>
            
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Cost:</span>
                <span className={`font-semibold ${
                  channel.cost === 'Low' ? 'text-gray-600' :
                  channel.cost === 'Medium' ? 'text-gray-700' : 'text-gray-800'
                }`}>
                  {channel.cost}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Reach:</span>
                <span className={`font-semibold ${
                  channel.reach === 'High' ? 'text-gray-600' :
                  channel.reach === 'Medium' ? 'text-gray-700' : 'text-gray-800'
                }`}>
                  {channel.reach}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Conversion:</span>
                <span className={`font-semibold ${
                  channel.conversion === 'High' ? 'text-gray-600' :
                  channel.conversion === 'Medium' ? 'text-gray-700' : 'text-gray-800'
                }`}>
                  {channel.conversion}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderInvestorsTab = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Investor Readiness</h2>
      
      <div className="space-y-4">
        {investorReadiness.map(item => (
          <div key={item.id} className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{item.name}</h3>
                <p className="text-gray-600">{item.description}</p>
              </div>
              
              <div className="flex items-center gap-3">
                <span className={`px-2 py-1 text-xs rounded-full ${
                  item.priority === 'high' ? 'bg-gray-100 text-gray-800' :
                  item.priority === 'medium' ? 'bg-gray-100 text-gray-700' :
                  'bg-gray-100 text-gray-600'
                }`}>
                  {item.priority}
                </span>
                <span className={`px-2 py-1 text-xs rounded-full ${
                  item.status === 'completed' ? 'bg-gray-100 text-gray-800' :
                  item.status === 'in_progress' ? 'bg-gray-100 text-gray-700' :
                  'bg-gray-100 text-gray-600'
                }`}>
                  {item.status}
                </span>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors text-sm font-semibold">
                View
              </button>
              <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors text-sm font-semibold">
                Edit
              </button>
              <button className="px-4 py-2 bg-black text-white rounded-xl hover:bg-gray-800 transition-colors text-sm font-semibold">
                Share
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderGrowthTab = () => (
    <div className="space-y-8">
      {/* StartupOS Integration */}
      <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 bg-black rounded-2xl flex items-center justify-center">
            <Code className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">StartupOS Integration</h2>
            <p className="text-gray-600">Export startup data into full-stack growth workspace</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Export Data</h3>
            <div className="space-y-3">
              {[
                { name: 'Vision & Mission', status: 'ready', description: 'Problem, solution, market analysis' },
                { name: 'Team Structure', status: 'ready', description: 'Roles, equity, responsibilities' },
                { name: 'Task Management', status: 'ready', description: 'Milestones, tasks, progress' },
                { name: 'Financial Data', status: 'ready', description: 'Projections, metrics, funding' },
                { name: 'Documentation', status: 'ready', description: 'Legal docs, agreements, NDAs' }
              ].map((item, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <div>
                    <p className="font-medium text-gray-900">{item.name}</p>
                    <p className="text-sm text-gray-600">{item.description}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-green-600 font-medium text-sm">{item.status}</span>
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Integration Status</h3>
            <div className="bg-gray-50 rounded-xl p-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Connection Status:</span>
                  <span className="text-green-600 font-medium">Connected</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Last Sync:</span>
                  <span className="font-medium">2 hours ago</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Data Points:</span>
                  <span className="font-medium">1,247</span>
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <button className="px-4 py-2 bg-black text-white rounded-xl hover:bg-gray-800 transition-colors text-sm font-semibold">
                Export Now
              </button>
              <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors text-sm font-semibold">
                Configure
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Zerohuman Integration */}
      <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 bg-gray-600 rounded-2xl flex items-center justify-center">
            <Zap className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Zerohuman Integration</h2>
            <p className="text-gray-600">Ops automation for finance, HR, and compliance</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gray-50 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Finance Automation</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span className="text-sm text-gray-600">Invoice generation</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span className="text-sm text-gray-600">Expense tracking</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span className="text-sm text-gray-600">Tax preparation</span>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">HR Automation</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span className="text-sm text-gray-600">Payroll processing</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span className="text-sm text-gray-600">Benefits management</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span className="text-sm text-gray-600">Compliance tracking</span>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Legal Automation</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span className="text-sm text-gray-600">Contract management</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span className="text-sm text-gray-600">IP protection</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span className="text-sm text-gray-600">Regulatory compliance</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Fractional CXOs */}
      <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 bg-gray-700 rounded-2xl flex items-center justify-center">
            <Users className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Fractional CXOs (Strategix)</h2>
            <p className="text-gray-600">Hire part-time leaders for growth</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { role: 'CTO', name: 'Sarah Chen', experience: '8 years', rate: '$200/hr', availability: '20h/week' },
            { role: 'CMO', name: 'David Kim', experience: '6 years', rate: '$180/hr', availability: '15h/week' },
            { role: 'CFO', name: 'Lisa Wang', experience: '10 years', rate: '$220/hr', availability: '10h/week' },
            { role: 'COO', name: 'Mike Johnson', experience: '7 years', rate: '$190/hr', availability: '25h/week' }
          ].map((exec, index) => (
            <div key={index} className="bg-gray-50 rounded-xl p-6">
              <div className="text-center mb-4">
                <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-3 flex items-center justify-center">
                  <Users className="w-8 h-8 text-gray-600" />
                </div>
                <h3 className="font-semibold text-gray-900">{exec.role}</h3>
                <p className="text-sm text-gray-600">{exec.name}</p>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Experience:</span>
                  <span className="font-medium">{exec.experience}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Rate:</span>
                  <span className="font-medium">{exec.rate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Available:</span>
                  <span className="font-medium">{exec.availability}</span>
                </div>
              </div>
              <button className="w-full mt-4 px-4 py-2 bg-black text-white rounded-xl hover:bg-gray-800 transition-colors text-sm font-semibold">
                Contact
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Perks & Credits Store */}
      <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 bg-gray-800 rounded-2xl flex items-center justify-center">
            <Gift className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Perks & Credits Store</h2>
            <p className="text-gray-600">Startup bundles and credits for growth tools</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { name: 'AWS Credits', value: '$5,000', description: 'Cloud infrastructure credits', status: 'Available' },
            { name: 'Notion Pro', value: '1 Year', description: 'Team workspace and docs', status: 'Available' },
            { name: 'HubSpot Starter', value: '6 Months', description: 'CRM and marketing tools', status: 'Available' },
            { name: 'Stripe Processing', value: '0.5% off', description: 'Payment processing discount', status: 'Available' },
            { name: 'Deel Credits', value: '$2,000', description: 'Global payroll and compliance', status: 'Available' },
            { name: 'Figma Pro', value: '1 Year', description: 'Design and prototyping tools', status: 'Available' },
            { name: 'Slack Pro', value: '1 Year', description: 'Team communication platform', status: 'Available' },
            { name: 'GitHub Pro', value: '1 Year', description: 'Code repository and CI/CD', status: 'Available' }
          ].map((perk, index) => (
            <div key={index} className="bg-gray-50 rounded-xl p-6">
              <div className="text-center mb-4">
                <h3 className="font-semibold text-gray-900">{perk.name}</h3>
                <p className="text-2xl font-bold text-gray-900">{perk.value}</p>
                <p className="text-sm text-gray-600">{perk.description}</p>
              </div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm text-gray-500">{perk.status}</span>
                <span className="text-green-600 font-medium text-sm">Free</span>
              </div>
              <button className="w-full px-4 py-2 bg-black text-white rounded-xl hover:bg-gray-800 transition-colors text-sm font-semibold">
                Claim
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderChecklistTab = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Launch Checklist</h2>
      
      <div className="space-y-6">
        {launches.map(launch => (
          <div key={launch.id} className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">{launch.name}</h3>
            <div className="space-y-3">
              {launch.checklist.map(item => (
                <div key={item.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                  <button
                    className={`w-6 h-6 rounded-full flex items-center justify-center ${
                      item.completed ? 'bg-black text-white' : 'bg-gray-300 text-gray-600'
                    }`}
                  >
                    {item.completed && <CheckCircle className="w-4 h-4" />}
                  </button>
                  
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900">{item.task}</h4>
                  </div>
                  
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    item.completed ? 'bg-gray-100 text-gray-800' : 'bg-gray-100 text-gray-600'
                  }`}>
                    {item.completed ? 'Completed' : 'Pending'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-black mx-auto mb-4"></div>
        <p className="text-gray-600 font-medium text-lg">Loading launch preparation...</p>
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
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Launch Preparation</h1>
            <p className="text-gray-600">Prepare for successful startup launch with go-to-market planning</p>
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
                        ? 'bg-black text-white shadow-lg'
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
            {activeTab === 'pitch' && renderPitchTab()}
            {activeTab === 'funding' && renderFundingTab()}
            {activeTab === 'growth' && renderGrowthTab()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LaunchPreparation;
