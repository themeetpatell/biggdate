import React, { useState, useEffect } from 'react';
import { 
  DollarSign, Users, FileText, Calculator, Award, 
  Target, CheckCircle, Clock, AlertCircle, BarChart3,
  TrendingUp, Star, Zap, ChevronRight, ChevronDown,
  ChevronUp, ArrowRight, ArrowLeft, ArrowUp, ArrowDown,
  Maximize2, Minimize2, RotateCcw, RotateCw, ZoomIn, ZoomOut,
  Move, Copy, Scissors, Trash2 as Trash2Icon, Save as SaveIcon,
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
  X as XIcon6, Check as CheckIcon6, Building2, Rocket,
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

const EquityFramework = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [agreements, setAgreements] = useState([]);
  const [selectedAgreement, setSelectedAgreement] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [newAgreement, setNewAgreement] = useState({
    name: '',
    description: '',
    cofounders: [],
    equitySplit: {},
    vestingSchedule: {},
    roles: {},
    terms: {}
  });

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'agreements', label: 'Agreements', icon: FileText },
    { id: 'calculator', label: 'Equity Calculator', icon: Calculator },
    { id: 'templates', label: 'Templates', icon: Award },
    { id: 'guidance', label: 'Guidance', icon: HelpCircle }
  ];

  const roleTemplates = [
    {
      id: 'ceo',
      name: 'CEO',
      description: 'Chief Executive Officer - Overall company strategy and vision',
      typicalEquity: '20-30%',
      responsibilities: ['Company strategy', 'Fundraising', 'Team building', 'External relations'],
      skills: ['Leadership', 'Strategy', 'Communication', 'Fundraising']
    },
    {
      id: 'cto',
      name: 'CTO',
      description: 'Chief Technology Officer - Technical strategy and product development',
      typicalEquity: '15-25%',
      responsibilities: ['Technical architecture', 'Product development', 'Engineering team', 'Technology decisions'],
      skills: ['Software development', 'System architecture', 'Team management', 'Product strategy']
    },
    {
      id: 'cmo',
      name: 'CMO',
      description: 'Chief Marketing Officer - Marketing strategy and customer acquisition',
      typicalEquity: '10-20%',
      responsibilities: ['Marketing strategy', 'Brand building', 'Customer acquisition', 'Growth'],
      skills: ['Marketing', 'Branding', 'Growth hacking', 'Analytics']
    },
    {
      id: 'cfo',
      name: 'CFO',
      description: 'Chief Financial Officer - Financial management and operations',
      typicalEquity: '8-15%',
      responsibilities: ['Financial planning', 'Fundraising', 'Operations', 'Legal compliance'],
      skills: ['Finance', 'Accounting', 'Operations', 'Legal']
    }
  ];

  const vestingSchedules = [
    {
      id: 'standard',
      name: 'Standard 4-Year',
      description: '4-year vesting with 1-year cliff',
      details: '25% vests after 1 year, then monthly for 3 years'
    },
    {
      id: 'accelerated',
      name: 'Accelerated',
      description: 'Faster vesting for early employees',
      details: '50% vests after 6 months, then monthly for 2 years'
    },
    {
      id: 'milestone',
      name: 'Milestone-Based',
      description: 'Vesting tied to company milestones',
      details: 'Vests based on revenue, user, or funding milestones'
    }
  ];

  useEffect(() => {
    loadAgreements();
  }, []);

  const loadAgreements = async () => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockAgreements = [
        {
          id: 1,
          name: 'EcoTrack AI Cofounder Agreement',
          description: 'Equity and role agreement for EcoTrack AI startup',
          cofounders: [
            {
              id: 1,
              name: 'Alex Chen',
              role: 'CTO',
              equity: 35,
              vesting: '4-year standard',
              responsibilities: ['Technical architecture', 'Product development', 'Engineering team'],
              avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face'
            },
            {
              id: 2,
              name: 'Sarah Martinez',
              role: 'CEO',
              equity: 40,
              vesting: '4-year standard',
              responsibilities: ['Company strategy', 'Fundraising', 'Team building'],
              avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=400&fit=crop&crop=face'
            },
            {
              id: 3,
              name: 'David Kim',
              role: 'CMO',
              equity: 25,
              vesting: '4-year standard',
              responsibilities: ['Marketing strategy', 'Brand building', 'Customer acquisition'],
              avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face'
            }
          ],
          terms: {
            vestingSchedule: '4-year standard',
            cliffPeriod: '12 months',
            acceleration: 'Single trigger',
            antiDilution: 'Weighted average',
            dragAlong: true,
            tagAlong: true
          },
          status: 'draft',
          createdAt: '2024-01-15',
          updatedAt: '2024-01-20'
        }
      ];
      
      setAgreements(mockAgreements);
    } catch (error) {
      console.error('Error loading agreements:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const createAgreement = () => {
    const agreement = {
      ...newAgreement,
      id: Date.now(),
      status: 'draft',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    setAgreements(prev => [...prev, agreement]);
    setShowCreateModal(false);
    setNewAgreement({
      name: '',
      description: '',
      cofounders: [],
      equitySplit: {},
      vestingSchedule: {},
      roles: {},
      terms: {}
    });
  };

  const calculateEquity = (contributions, totalValue) => {
    const totalContribution = Object.values(contributions).reduce((sum, value) => sum + value, 0);
    const equitySplit = {};
    
    Object.entries(contributions).forEach(([cofounder, contribution]) => {
      equitySplit[cofounder] = Math.round((contribution / totalContribution) * 100);
    });
    
    return equitySplit;
  };

  const renderOverviewTab = () => (
    <div className="space-y-8">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-gray-900">{agreements.length}</span>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-1">Agreements</h3>
          <p className="text-gray-600 text-sm">Total cofounder agreements</p>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center">
              <Users className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-gray-900">
              {agreements.reduce((acc, agreement) => acc + agreement.cofounders.length, 0)}
            </span>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-1">Cofounders</h3>
          <p className="text-gray-600 text-sm">Total cofounders across agreements</p>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-gray-900">100%</span>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-1">Equity Allocated</h3>
          <p className="text-gray-600 text-sm">Total equity distributed</p>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-gray-900">
              {agreements.filter(a => a.status === 'signed').length}
            </span>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-1">Signed</h3>
          <p className="text-gray-600 text-sm">Agreements finalized</p>
        </div>
      </div>

      {/* Recent Agreements */}
      <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Recent Agreements</h2>
        <div className="space-y-4">
          {agreements.slice(0, 2).map(agreement => (
            <div key={agreement.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">{agreement.name}</h3>
                <p className="text-sm text-gray-600">{agreement.description}</p>
                <div className="flex items-center gap-4 mt-2">
                  <span className="text-sm text-gray-500">{agreement.cofounders.length} cofounders</span>
                  <span className="text-sm text-gray-500">Status: {agreement.status}</span>
                  <span className="text-sm text-gray-500">Created: {agreement.createdAt}</span>
                </div>
              </div>
              <button
                onClick={() => setSelectedAgreement(agreement)}
                className="px-4 py-2 bg-purple-100 text-purple-700 rounded-xl hover:bg-purple-200 transition-colors text-sm font-semibold"
              >
                View Details
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderAgreementsTab = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Cofounder Agreements</h2>
        <button
          onClick={() => setShowCreateModal(true)}
          className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all font-semibold"
        >
          <FileText className="w-5 h-5 inline mr-2" />
          Create Agreement
        </button>
      </div>

      <div className="space-y-6">
        {agreements.map(agreement => (
          <div key={agreement.id} className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
            <div className="flex items-start justify-between mb-6">
              <div className="flex-1">
                <h3 className="text-xl font-bold text-gray-900 mb-2">{agreement.name}</h3>
                <p className="text-gray-600 mb-4">{agreement.description}</p>
                
                <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                  <span>Status: {agreement.status}</span>
                  <span>{agreement.cofounders.length} cofounders</span>
                  <span>Created: {agreement.createdAt}</span>
                </div>
              </div>
              
              <div className="flex gap-2">
                <button className="px-4 py-2 bg-blue-100 text-blue-700 rounded-xl hover:bg-blue-200 transition-colors text-sm font-semibold">
                  Edit
                </button>
                <button className="px-4 py-2 bg-green-100 text-green-700 rounded-xl hover:bg-green-200 transition-colors text-sm font-semibold">
                  Sign
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {agreement.cofounders.map(cofounder => (
                <div key={cofounder.id} className="p-4 bg-gray-50 rounded-xl">
                  <div className="flex items-center gap-3 mb-3">
                    <img
                      src={cofounder.avatar}
                      alt={cofounder.name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div>
                      <h4 className="font-semibold text-gray-900">{cofounder.name}</h4>
                      <p className="text-sm text-gray-600">{cofounder.role}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Equity:</span>
                      <span className="font-semibold text-gray-900">{cofounder.equity}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Vesting:</span>
                      <span className="font-semibold text-gray-900">{cofounder.vesting}</span>
                    </div>
                  </div>
                  
                  <div className="mt-3">
                    <h5 className="text-xs font-semibold text-gray-700 mb-1">Responsibilities:</h5>
                    <ul className="text-xs text-gray-600 space-y-1">
                      {cofounder.responsibilities.map((resp, index) => (
                        <li key={index}>• {resp}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderCalculatorTab = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Equity Calculator</h2>
      
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Calculate Fair Equity Split</h3>
        
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Cofounder 1 Contribution Value
              </label>
              <input
                type="number"
                placeholder="e.g., 50000"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Cofounder 2 Contribution Value
              </label>
              <input
                type="number"
                placeholder="e.g., 30000"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Cofounder 3 Contribution Value
              </label>
              <input
                type="number"
                placeholder="e.g., 20000"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Total Company Value
              </label>
              <input
                type="number"
                placeholder="e.g., 100000"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
          </div>
          
          <button className="w-full px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all font-semibold">
            Calculate Equity Split
          </button>
        </div>
      </div>
    </div>
  );

  const renderTemplatesTab = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Role Templates</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {roleTemplates.map(role => (
          <div key={role.id} className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-xl font-bold text-gray-900">{role.name}</h3>
                <p className="text-gray-600">{role.description}</p>
              </div>
              <span className="px-3 py-1 bg-purple-100 text-purple-700 text-sm font-semibold rounded-full">
                {role.typicalEquity}
              </span>
            </div>
            
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Responsibilities:</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  {role.responsibilities.map((resp, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      {resp}
                    </li>
                  ))}
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Required Skills:</h4>
                <div className="flex flex-wrap gap-2">
                  {role.skills.map((skill, index) => (
                    <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderGuidanceTab = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Equity & Role Guidance</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Equity Split Guidelines</h3>
          <div className="space-y-3 text-sm">
            <div className="p-3 bg-blue-50 rounded-xl">
              <h4 className="font-semibold text-blue-900 mb-1">Equal Split (50/50)</h4>
              <p className="text-blue-700">Best for cofounders with similar contributions and commitment</p>
            </div>
            <div className="p-3 bg-green-50 rounded-xl">
              <h4 className="font-semibold text-green-900 mb-1">Contribution-Based</h4>
              <p className="text-green-700">Based on financial investment, time commitment, and expertise</p>
            </div>
            <div className="p-3 bg-purple-50 rounded-xl">
              <h4 className="font-semibold text-purple-900 mb-1">Role-Based</h4>
              <p className="text-purple-700">CEO typically gets 5-10% more than other cofounders</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Vesting Schedules</h3>
          <div className="space-y-3 text-sm">
            {vestingSchedules.map(schedule => (
              <div key={schedule.id} className="p-3 bg-gray-50 rounded-xl">
                <h4 className="font-semibold text-gray-900 mb-1">{schedule.name}</h4>
                <p className="text-gray-600 mb-1">{schedule.description}</p>
                <p className="text-xs text-gray-500">{schedule.details}</p>
              </div>
            ))}
          </div>
        </div>
        
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Key Terms to Include</h3>
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span>Vesting schedule and cliff period</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span>Acceleration clauses (single/double trigger)</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span>Anti-dilution protection</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span>Drag-along and tag-along rights</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span>Role definitions and responsibilities</span>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Common Mistakes to Avoid</h3>
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-500" />
              <span>Not documenting agreements in writing</span>
            </div>
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-500" />
              <span>Giving too much equity to early employees</span>
            </div>
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-500" />
              <span>Not considering future funding rounds</span>
            </div>
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-500" />
              <span>Ignoring vesting schedules</span>
            </div>
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-500" />
              <span>Not planning for cofounder departures</span>
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
          <p className="text-gray-600 font-medium text-lg">Loading equity framework...</p>
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
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Equity & Role Framework</h1>
            <p className="text-gray-600">Create fair cofounder agreements and equity splits</p>
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
            {activeTab === 'agreements' && renderAgreementsTab()}
            {activeTab === 'calculator' && renderCalculatorTab()}
            {activeTab === 'templates' && renderTemplatesTab()}
            {activeTab === 'guidance' && renderGuidanceTab()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EquityFramework;
