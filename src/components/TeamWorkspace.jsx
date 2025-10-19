import React, { useState, useEffect } from 'react';
import { 
  Users, Calendar, FileText, MessageSquare, Video, 
  Plus, Edit3, Trash2, Save, Download, Share2, Eye,
  CheckCircle, Clock, AlertCircle, Target, BarChart3,
  TrendingUp, Award, Star, Zap, ChevronRight, ChevronDown,
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
  Link as LinkIcon, Link2 as Link2Icon, Unlink as UnlinkIcon,
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
  X as XIcon4, Check as CheckIcon4, Rocket, Lightbulb, Code,
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
  Link as LinkIcon2, Link2 as Link2Icon2, Unlink as UnlinkIcon2,
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
  Link as LinkIcon3, Link2 as Link2Icon3, Unlink as UnlinkIcon3,
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

const TeamWorkspace = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [teams, setTeams] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showMeetingModal, setShowMeetingModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [newTeam, setNewTeam] = useState({
    name: '',
    description: '',
    members: [],
    projects: []
  });
  const [newMeeting, setNewMeeting] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    duration: '60',
    attendees: [],
    agenda: []
  });

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'teams', label: 'Teams', icon: Users },
    { id: 'meetings', label: 'Meetings', icon: Calendar },
    { id: 'documents', label: 'Documents', icon: FileText },
    { id: 'decisions', label: 'Decisions', icon: CheckCircle }
  ];

  useEffect(() => {
    loadTeams();
  }, []);

  const loadTeams = async () => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockTeams = [
        {
          id: 1,
          name: 'EcoTrack AI Team',
          description: 'Building AI-powered carbon footprint tracking platform',
          members: [
            { id: 1, name: 'Alex Chen', role: 'Tech Lead', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face', status: 'online' },
            { id: 2, name: 'Sarah Martinez', role: 'Product Manager', avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=400&fit=crop&crop=face', status: 'online' },
            { id: 3, name: 'David Kim', role: 'UI/UX Designer', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face', status: 'away' }
          ],
          projects: ['EcoTrack MVP', 'User Research'],
          meetings: [
            {
              id: 1,
              title: 'Weekly Standup',
              date: '2024-01-22',
              time: '09:00',
              duration: '30',
              attendees: [1, 2, 3],
              status: 'upcoming'
            },
            {
              id: 2,
              title: 'Product Review',
              date: '2024-01-25',
              time: '14:00',
              duration: '60',
              attendees: [1, 2],
              status: 'upcoming'
            }
          ],
          documents: [
            {
              id: 1,
              name: 'Product Requirements',
              type: 'pdf',
              size: '2.3 MB',
              uploadedBy: 'Sarah Martinez',
              uploadedAt: '2024-01-15',
              url: '#'
            },
            {
              id: 2,
              name: 'Technical Architecture',
              type: 'docx',
              size: '1.8 MB',
              uploadedBy: 'Alex Chen',
              uploadedAt: '2024-01-18',
              url: '#'
            }
          ],
          decisions: [
            {
              id: 1,
              title: 'Technology Stack Decision',
              description: 'Decided to use React for frontend and Node.js for backend',
              madeBy: 'Alex Chen',
              date: '2024-01-10',
              status: 'approved',
              votes: { for: 3, against: 0 }
            },
            {
              id: 2,
              title: 'Design System Approval',
              description: 'Approved the new design system for consistent UI',
              madeBy: 'David Kim',
              date: '2024-01-12',
              status: 'pending',
              votes: { for: 1, against: 0 }
            }
          ],
          createdAt: '2024-01-01',
          updatedAt: '2024-01-20'
        }
      ];
      
      setTeams(mockTeams);
    } catch (error) {
      console.error('Error loading teams:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const createTeam = () => {
    const team = {
      ...newTeam,
      id: Date.now(),
      meetings: [],
      documents: [],
      decisions: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    setTeams(prev => [...prev, team]);
    setShowCreateModal(false);
    setNewTeam({
      name: '',
      description: '',
      members: [],
      projects: []
    });
  };

  const scheduleMeeting = () => {
    const meeting = {
      ...newMeeting,
      id: Date.now(),
      status: 'upcoming',
      createdAt: new Date().toISOString()
    };
    
    if (selectedTeam) {
      setTeams(prev => prev.map(team => {
        if (team.id === selectedTeam.id) {
          return {
            ...team,
            meetings: [...team.meetings, meeting],
            updatedAt: new Date().toISOString()
          };
        }
        return team;
      }));
    }
    
    setShowMeetingModal(false);
    setNewMeeting({
      title: '',
      description: '',
      date: '',
      time: '',
      duration: '60',
      attendees: [],
      agenda: []
    });
  };

  const renderOverviewTab = () => (
    <div className="space-y-8">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center">
              <Users className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-gray-900">{teams.length}</span>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-1">Active Teams</h3>
          <p className="text-gray-600 text-sm">Total teams created</p>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center">
              <Calendar className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-gray-900">
              {teams.reduce((acc, team) => acc + team.meetings.length, 0)}
            </span>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-1">Meetings</h3>
          <p className="text-gray-600 text-sm">Total meetings scheduled</p>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-gray-900">
              {teams.reduce((acc, team) => acc + team.documents.length, 0)}
            </span>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-1">Documents</h3>
          <p className="text-gray-600 text-sm">Shared documents</p>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-gray-900">
              {teams.reduce((acc, team) => acc + team.decisions.length, 0)}
            </span>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-1">Decisions</h3>
          <p className="text-gray-600 text-sm">Team decisions made</p>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Recent Activity</h2>
        <div className="space-y-4">
          {teams.slice(0, 2).map(team => (
            <div key={team.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">{team.name}</h3>
                <p className="text-sm text-gray-600">{team.description}</p>
                <div className="flex items-center gap-4 mt-2">
                  <span className="text-sm text-gray-500">{team.members.length} members</span>
                  <span className="text-sm text-gray-500">{team.meetings.length} meetings</span>
                  <span className="text-sm text-gray-500">{team.documents.length} documents</span>
                </div>
              </div>
              <button
                onClick={() => setSelectedTeam(team)}
                className="px-4 py-2 bg-purple-100 text-purple-700 rounded-xl hover:bg-purple-200 transition-colors text-sm font-semibold"
              >
                View Team
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderTeamsTab = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Teams</h2>
        <button
          onClick={() => setShowCreateModal(true)}
          className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all font-semibold"
        >
          <Plus className="w-5 h-5 inline mr-2" />
          Create Team
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {teams.map(team => (
          <div key={team.id} className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="text-xl font-bold text-gray-900 mb-2">{team.name}</h3>
                <p className="text-gray-600 mb-4">{team.description}</p>
                
                <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                  <span>{team.members.length} members</span>
                  <span>{team.meetings.length} meetings</span>
                  <span>{team.documents.length} documents</span>
                </div>
              </div>
            </div>

            <div className="mb-4">
              <h4 className="font-semibold text-gray-700 mb-3">Team Members</h4>
              <div className="flex items-center gap-2">
                {team.members.map(member => (
                  <div key={member.id} className="flex items-center gap-2">
                    <div className="relative">
                      <img
                        src={member.avatar}
                        alt={member.name}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                      <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${
                        member.status === 'online' ? 'bg-green-500' : 
                        member.status === 'away' ? 'bg-yellow-500' : 'bg-gray-400'
                      }`}></div>
                    </div>
                    <span className="text-sm text-gray-600">{member.name}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setSelectedTeam(team)}
                className="flex-1 px-4 py-2 bg-purple-100 text-purple-700 rounded-xl hover:bg-purple-200 transition-colors text-sm font-semibold"
              >
                View Details
              </button>
              <button className="px-4 py-2 bg-blue-100 text-blue-700 rounded-xl hover:bg-blue-200 transition-colors text-sm font-semibold">
                <MessageSquare className="w-4 h-4 inline mr-1" />
                Chat
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderMeetingsTab = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Meetings</h2>
        <button
          onClick={() => setShowMeetingModal(true)}
          className="px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl hover:from-blue-600 hover:to-cyan-600 transition-all font-semibold"
        >
          <Plus className="w-5 h-5 inline mr-2" />
          Schedule Meeting
        </button>
      </div>

      <div className="space-y-4">
        {teams.map(team => (
          <div key={team.id} className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">{team.name}</h3>
            <div className="space-y-3">
              {team.meetings.map(meeting => (
                <div key={meeting.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
                    <Calendar className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900">{meeting.title}</h4>
                    <p className="text-sm text-gray-600">{meeting.description}</p>
                    <div className="flex items-center gap-4 mt-1 text-xs text-gray-500">
                      <span>{meeting.date} at {meeting.time}</span>
                      <span>{meeting.duration} minutes</span>
                      <span>{meeting.attendees.length} attendees</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button className="px-3 py-1 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors text-sm">
                      Join
                    </button>
                    <button className="px-3 py-1 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm">
                      Edit
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderDocumentsTab = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Documents</h2>
      
      <div className="space-y-4">
        {teams.map(team => (
          <div key={team.id} className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">{team.name}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {team.documents.map(doc => (
                <div key={doc.id} className="p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                  <div className="flex items-center gap-3 mb-2">
                    <FileText className="w-8 h-8 text-blue-500" />
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 text-sm">{doc.name}</h4>
                      <p className="text-xs text-gray-500">{doc.size}</p>
                    </div>
                  </div>
                  <div className="text-xs text-gray-500 mb-2">
                    Uploaded by {doc.uploadedBy} on {doc.uploadedAt}
                  </div>
                  <div className="flex gap-2">
                    <button className="px-3 py-1 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors text-xs">
                      <Download className="w-3 h-3 inline mr-1" />
                      Download
                    </button>
                    <button className="px-3 py-1 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-xs">
                      Share
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderDecisionsTab = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Decisions</h2>
      
      <div className="space-y-4">
        {teams.map(team => (
          <div key={team.id} className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">{team.name}</h3>
            <div className="space-y-3">
              {team.decisions.map(decision => (
                <div key={decision.id} className="p-4 bg-gray-50 rounded-xl">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-semibold text-gray-900">{decision.title}</h4>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      decision.status === 'approved' ? 'bg-green-100 text-green-700' :
                      decision.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {decision.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">{decision.description}</p>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>Made by {decision.madeBy} on {decision.date}</span>
                    <span>{decision.votes.for} for, {decision.votes.against} against</span>
                  </div>
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
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium text-lg">Loading workspace...</p>
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
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Team Workspace</h1>
            <p className="text-gray-600">Collaborate with your cofounders and team members</p>
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
            {activeTab === 'teams' && renderTeamsTab()}
            {activeTab === 'meetings' && renderMeetingsTab()}
            {activeTab === 'documents' && renderDocumentsTab()}
            {activeTab === 'decisions' && renderDecisionsTab()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeamWorkspace;
