import React, { useState, useEffect } from 'react';
import { 
  Plus, Edit3, Trash2, Save, Download, Share2, Eye, 
  CheckCircle, Clock, AlertCircle, Users, Calendar, 
  Target, BarChart3, TrendingUp, Award, Star, Zap,
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
  Video, FileText, Download as DownloadIcon2, Play, Pause,
  Volume2, ThumbsUp, MessageSquare, Send, Bookmark, Flag,
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
  Video as VideoIcon, FileText as FileTextIcon,
  Download as DownloadIcon4, Play as PlayIcon, Pause as PauseIcon,
  Volume2 as Volume2Icon, ThumbsUp as ThumbsUpIcon,
  MessageSquare as MessageSquareIcon, Send as SendIcon,
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
  Video as VideoIcon2, FileText as FileTextIcon2,
  Download as DownloadIcon6, Play as PlayIcon2, Pause as PauseIcon2,
  Volume2 as Volume2Icon2, ThumbsUp as ThumbsUpIcon2,
  MessageSquare as MessageSquareIcon2, Send as SendIcon2,
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

const ProjectBoard = () => {
  const [activeView, setActiveView] = useState('kanban');
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [newProject, setNewProject] = useState({
    title: '',
    description: '',
    status: 'planning',
    priority: 'medium',
    startDate: '',
    endDate: '',
    team: [],
    tags: []
  });
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    status: 'todo',
    priority: 'medium',
    assignee: '',
    dueDate: '',
    projectId: '',
    tags: []
  });

  const views = [
    { id: 'kanban', label: 'Kanban Board', icon: BarChart3 },
    { id: 'list', label: 'List View', icon: FileText },
    { id: 'calendar', label: 'Calendar', icon: Calendar },
    { id: 'timeline', label: 'Timeline', icon: Clock }
  ];

  const statuses = {
    todo: { label: 'To Do', color: 'bg-gray-100 text-gray-700', icon: Clock },
    in_progress: { label: 'In Progress', color: 'bg-blue-100 text-blue-700', icon: Play },
    review: { label: 'Review', color: 'bg-yellow-100 text-yellow-700', icon: Eye },
    done: { label: 'Done', color: 'bg-green-100 text-green-700', icon: CheckCircle }
  };

  const priorities = {
    low: { label: 'Low', color: 'bg-gray-100 text-gray-700', icon: ChevronDown },
    medium: { label: 'Medium', color: 'bg-yellow-100 text-yellow-700', icon: Minus },
    high: { label: 'High', color: 'bg-orange-100 text-orange-700', icon: ChevronUp },
    urgent: { label: 'Urgent', color: 'bg-red-100 text-red-700', icon: AlertCircle }
  };

  const projectStatuses = {
    planning: { label: 'Planning', color: 'bg-blue-100 text-blue-700' },
    active: { label: 'Active', color: 'bg-green-100 text-green-700' },
    on_hold: { label: 'On Hold', color: 'bg-yellow-100 text-yellow-700' },
    completed: { label: 'Completed', color: 'bg-purple-100 text-purple-700' }
  };

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockProjects = [
        {
          id: 1,
          title: 'EcoTrack AI MVP',
          description: 'Build the minimum viable product for carbon footprint tracking',
          status: 'active',
          priority: 'high',
          startDate: '2024-01-01',
          endDate: '2024-03-31',
          progress: 65,
          team: [
            { id: 1, name: 'Alex Chen', role: 'Tech Lead', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face' },
            { id: 2, name: 'Sarah Martinez', role: 'Product Manager', avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=400&fit=crop&crop=face' }
          ],
          tags: ['AI', 'Sustainability', 'MVP'],
          tasks: [
            {
              id: 1,
              title: 'Design user interface',
              description: 'Create wireframes and mockups for the main dashboard',
              status: 'done',
              priority: 'high',
              assignee: { id: 2, name: 'Sarah Martinez', avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=400&fit=crop&crop=face' },
              dueDate: '2024-01-15',
              createdAt: '2024-01-01',
              completedAt: '2024-01-12'
            },
            {
              id: 2,
              title: 'Set up backend API',
              description: 'Create REST API endpoints for data management',
              status: 'in_progress',
              priority: 'high',
              assignee: { id: 1, name: 'Alex Chen', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face' },
              dueDate: '2024-01-25',
              createdAt: '2024-01-05',
              progress: 75
            },
            {
              id: 3,
              title: 'Implement AI algorithms',
              description: 'Develop machine learning models for carbon calculation',
              status: 'todo',
              priority: 'medium',
              assignee: { id: 1, name: 'Alex Chen', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face' },
              dueDate: '2024-02-10',
              createdAt: '2024-01-10'
            },
            {
              id: 4,
              title: 'User testing',
              description: 'Conduct usability testing with target users',
              status: 'review',
              priority: 'medium',
              assignee: { id: 2, name: 'Sarah Martinez', avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=400&fit=crop&crop=face' },
              dueDate: '2024-02-15',
              createdAt: '2024-01-12'
            }
          ],
          createdAt: '2024-01-01',
          updatedAt: '2024-01-15'
        },
        {
          id: 2,
          title: 'HealthConnect Platform',
          description: 'Telemedicine platform connecting patients with specialists',
          status: 'planning',
          priority: 'medium',
          startDate: '2024-02-01',
          endDate: '2024-06-30',
          progress: 15,
          team: [
            { id: 3, name: 'Dr. Michael Chen', role: 'Medical Advisor', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face' },
            { id: 4, name: 'Lisa Wang', role: 'Product Manager', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face' }
          ],
          tags: ['Healthcare', 'Telemedicine', 'Platform'],
          tasks: [
            {
              id: 5,
              title: 'Market research',
              description: 'Analyze telemedicine market and competitor landscape',
              status: 'in_progress',
              priority: 'high',
              assignee: { id: 4, name: 'Lisa Wang', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face' },
              dueDate: '2024-02-15',
              createdAt: '2024-02-01',
              progress: 40
            },
            {
              id: 6,
              title: 'Regulatory compliance',
              description: 'Research healthcare regulations and compliance requirements',
              status: 'todo',
              priority: 'high',
              assignee: { id: 3, name: 'Dr. Michael Chen', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face' },
              dueDate: '2024-02-28',
              createdAt: '2024-02-01'
            }
          ],
          createdAt: '2024-02-01',
          updatedAt: '2024-02-10'
        }
      ];
      
      setProjects(mockProjects);
    } catch (error) {
      console.error('Error loading projects:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const createProject = () => {
    const project = {
      ...newProject,
      id: Date.now(),
      progress: 0,
      tasks: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    setProjects(prev => [...prev, project]);
    setShowCreateModal(false);
    setNewProject({
      title: '',
      description: '',
      status: 'planning',
      priority: 'medium',
      startDate: '',
      endDate: '',
      team: [],
      tags: []
    });
  };

  const createTask = () => {
    const task = {
      ...newTask,
      id: Date.now(),
      createdAt: new Date().toISOString(),
      progress: 0
    };
    
    setProjects(prev => prev.map(project => {
      if (project.id === parseInt(newTask.projectId)) {
        return {
          ...project,
          tasks: [...project.tasks, task],
          updatedAt: new Date().toISOString()
        };
      }
      return project;
    }));
    
    setShowTaskModal(false);
    setNewTask({
      title: '',
      description: '',
      status: 'todo',
      priority: 'medium',
      assignee: '',
      dueDate: '',
      projectId: '',
      tags: []
    });
  };

  const updateTaskStatus = (projectId, taskId, newStatus) => {
    setProjects(prev => prev.map(project => {
      if (project.id === projectId) {
        const updatedTasks = project.tasks.map(task => {
          if (task.id === taskId) {
            return {
              ...task,
              status: newStatus,
              completedAt: newStatus === 'done' ? new Date().toISOString() : null
            };
          }
          return task;
        });
        
        const completedTasks = updatedTasks.filter(task => task.status === 'done').length;
        const progress = Math.round((completedTasks / updatedTasks.length) * 100);
        
        return {
          ...project,
          tasks: updatedTasks,
          progress: isNaN(progress) ? 0 : progress,
          updatedAt: new Date().toISOString()
        };
      }
      return project;
    }));
  };

  const renderKanbanBoard = () => {
    const allTasks = projects.flatMap(project => 
      project.tasks.map(task => ({ ...task, projectTitle: project.title, projectId: project.id }))
    );

    return (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {Object.entries(statuses).map(([statusKey, status]) => {
          const statusTasks = allTasks.filter(task => task.status === statusKey);
          const Icon = status.icon;
          
          return (
            <div key={statusKey} className="bg-gray-50 rounded-2xl p-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Icon className="w-5 h-5 text-gray-600" />
                  <h3 className="font-semibold text-gray-900">{status.label}</h3>
                  <span className="px-2 py-1 bg-white text-gray-600 text-sm rounded-full">
                    {statusTasks.length}
                  </span>
                </div>
              </div>
              
              <div className="space-y-3">
                {statusTasks.map(task => (
                  <div key={task.id} className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-semibold text-gray-900 text-sm">{task.title}</h4>
                      <div className={`px-2 py-1 text-xs rounded-full ${priorities[task.priority].color}`}>
                        {priorities[task.priority].label}
                      </div>
                    </div>
                    
                    <p className="text-gray-600 text-xs mb-3 line-clamp-2">{task.description}</p>
                    
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span className="font-medium">{task.projectTitle}</span>
                      <span>{task.dueDate}</span>
                    </div>
                    
                    {task.assignee && (
                      <div className="flex items-center gap-2 mt-3">
                        <img
                          src={task.assignee.avatar}
                          alt={task.assignee.name}
                          className="w-6 h-6 rounded-full object-cover"
                        />
                        <span className="text-xs text-gray-600">{task.assignee.name}</span>
                      </div>
                    )}
                    
                    <div className="flex gap-2 mt-3">
                      {task.status !== 'done' && (
                        <button
                          onClick={() => updateTaskStatus(task.projectId, task.id, 'done')}
                          className="flex-1 px-3 py-1 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors text-xs font-semibold"
                        >
                          Complete
                        </button>
                      )}
                      <button className="px-3 py-1 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-xs">
                        Edit
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const renderListView = () => (
    <div className="space-y-4">
      {projects.map(project => (
        <div key={project.id} className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h3 className="text-xl font-bold text-gray-900">{project.title}</h3>
                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${projectStatuses[project.status].color}`}>
                  {projectStatuses[project.status].label}
                </span>
                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${priorities[project.priority].color}`}>
                  {priorities[project.priority].label}
                </span>
              </div>
              <p className="text-gray-600 mb-3">{project.description}</p>
              
              <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                <span>{project.startDate} - {project.endDate}</span>
                <span>{project.progress}% complete</span>
                <span>{project.tasks.length} tasks</span>
              </div>
              
              <div className="flex items-center gap-2 mb-4">
                {project.team.map(member => (
                  <div key={member.id} className="flex items-center gap-2">
                    <img
                      src={member.avatar}
                      alt={member.name}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                    <span className="text-sm text-gray-600">{member.name}</span>
                  </div>
                ))}
              </div>
              
              <div className="flex flex-wrap gap-2">
                {project.tags.map((tag, index) => (
                  <span key={index} className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full">
                    {tag}
                  </span>
                ))}
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
                  strokeDasharray={`${project.progress}, 100`}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-xs font-semibold text-gray-700">{project.progress}%</span>
              </div>
            </div>
          </div>
          
          <div className="space-y-3">
            <h4 className="font-semibold text-gray-900">Tasks</h4>
            {project.tasks.map(task => (
              <div key={task.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                <button
                  onClick={() => updateTaskStatus(project.id, task.id, task.status === 'done' ? 'todo' : 'done')}
                  className={`w-5 h-5 rounded-full flex items-center justify-center ${
                    task.status === 'done' ? 'bg-green-500 text-white' : 'bg-gray-300 text-gray-600'
                  }`}
                >
                  {task.status === 'done' && <CheckCircle className="w-3 h-3" />}
                </button>
                
                <div className="flex-1">
                  <h5 className="font-semibold text-gray-900 text-sm">{task.title}</h5>
                  <p className="text-gray-600 text-xs">{task.description}</p>
                </div>
                
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-1 text-xs rounded-full ${priorities[task.priority].color}`}>
                    {priorities[task.priority].label}
                  </span>
                  <span className={`px-2 py-1 text-xs rounded-full ${statuses[task.status].color}`}>
                    {statuses[task.status].label}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );

  const renderCalendarView = () => (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
      <h3 className="text-xl font-bold text-gray-900 mb-6">Calendar View</h3>
      <div className="text-center py-12 text-gray-500">
        <Calendar className="w-12 h-12 mx-auto mb-4 text-gray-400" />
        <p>Calendar view coming soon...</p>
      </div>
    </div>
  );

  const renderTimelineView = () => (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
      <h3 className="text-xl font-bold text-gray-900 mb-6">Timeline View</h3>
      <div className="text-center py-12 text-gray-500">
        <Clock className="w-12 h-12 mx-auto mb-4 text-gray-400" />
        <p>Timeline view coming soon...</p>
      </div>
    </div>
  );

  const renderCreateProjectModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Create New Project</h2>
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
                Project Title *
              </label>
              <input
                type="text"
                value={newProject.title}
                onChange={(e) => setNewProject(prev => ({ ...prev, title: e.target.value }))}
                placeholder="e.g., EcoTrack AI MVP"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Description
              </label>
              <textarea
                value={newProject.description}
                onChange={(e) => setNewProject(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Describe your project..."
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Status
                </label>
                <select
                  value={newProject.status}
                  onChange={(e) => setNewProject(prev => ({ ...prev, status: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  {Object.entries(projectStatuses).map(([key, status]) => (
                    <option key={key} value={key}>{status.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Priority
                </label>
                <select
                  value={newProject.priority}
                  onChange={(e) => setNewProject(prev => ({ ...prev, priority: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  {Object.entries(priorities).map(([key, priority]) => (
                    <option key={key} value={key}>{priority.label}</option>
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
                  value={newProject.startDate}
                  onChange={(e) => setNewProject(prev => ({ ...prev, startDate: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  End Date
                </label>
                <input
                  type="date"
                  value={newProject.endDate}
                  onChange={(e) => setNewProject(prev => ({ ...prev, endDate: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="flex justify-end gap-4">
              <button
                onClick={() => setShowCreateModal(false)}
                className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={createProject}
                className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all"
              >
                Create Project
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
          <p className="text-gray-600 font-medium text-lg">Loading projects...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Project Board</h1>
              <p className="text-gray-600">Manage your startup projects and track progress</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowTaskModal(true)}
                className="px-6 py-3 bg-blue-100 text-blue-700 rounded-xl hover:bg-blue-200 transition-colors font-semibold"
              >
                <Plus className="w-5 h-5 inline mr-2" />
                Add Task
              </button>
              <button
                onClick={() => setShowCreateModal(true)}
                className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all font-semibold"
              >
                <Plus className="w-5 h-5 inline mr-2" />
                New Project
              </button>
            </div>
          </div>

          {/* View Tabs */}
          <div className="bg-white rounded-2xl p-2 shadow-lg border border-gray-100 mb-8">
            <div className="flex space-x-2">
              {views.map((view) => {
                const Icon = view.icon;
                const isActive = activeView === view.id;
                
                return (
                  <button
                    key={view.id}
                    onClick={() => setActiveView(view.id)}
                    className={`flex items-center gap-3 px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                      isActive
                        ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    {view.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Content */}
          <div className="max-w-7xl mx-auto">
            {activeView === 'kanban' && renderKanbanBoard()}
            {activeView === 'list' && renderListView()}
            {activeView === 'calendar' && renderCalendarView()}
            {activeView === 'timeline' && renderTimelineView()}
          </div>
        </div>
      </div>

      {/* Create Project Modal */}
      {showCreateModal && renderCreateProjectModal()}
    </div>
  );
};

export default ProjectBoard;
