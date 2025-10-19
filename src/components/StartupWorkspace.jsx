import React, { useState, useEffect } from 'react';
import { 
  Rocket, Target, CheckCircle, Clock, AlertCircle, 
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
  XCircle, CheckCircle2, Calculator
} from 'lucide-react';
import MVPBuilder from './MVPBuilder';
import FundingTracker from './FundingTracker';
import StartupRoadmap from './StartupRoadmap';
import MilestonesEngineFixed from './MilestonesEngineFixed';
import TeamView from './TeamView';
import InvestorRoom from './InvestorRoom';
import LaunchDashboard from './LaunchDashboard';
import StartupProfilePage from './StartupProfilePage';
import FundraisingTracker from './FundraisingTracker';
import ProjectBoardFixed from './ProjectBoardFixed';
import TeamWorkspace from './TeamWorkspace';
import VCAngelAccess from './VCAngelAccess';

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
      { id: 1, title: 'Market Research', status: 'completed', dueDate: '2024-01-15' },
      { id: 2, title: 'MVP Development', status: 'in-progress', dueDate: '2024-03-01' },
      { id: 3, title: 'Beta Testing', status: 'pending', dueDate: '2024-04-15' },
      { id: 4, title: 'Launch', status: 'pending', dueDate: '2024-06-01' }
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

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'milestones', label: 'Milestones', icon: Target },
    { id: 'team', label: 'Team', icon: Users },
    { id: 'projects', label: 'Projects', icon: CheckCircle },
    { id: 'investors', label: 'Investors', icon: DollarSign },
    { id: 'vc-angels', label: 'VC & Angels', icon: Building2 },
    { id: 'launch', label: 'Launch', icon: Rocket },
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
      <FundingTracker />
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
      <StartupRoadmap />
    </div>
  );

  const renderOverview = () => (
    <div className="space-y-8">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center">
              <Users className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-gray-900">{startupData.cofounders.length}</span>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-1">Team Members</h3>
          <p className="text-gray-600 text-sm">Active cofounders</p>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center">
              <Target className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-gray-900">{startupData.progress}%</span>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-1">Progress</h3>
          <p className="text-gray-600 text-sm">MVP completion</p>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-gray-900">${startupData.funding.raised.toLocaleString()}</span>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-1">Raised</h3>
          <p className="text-gray-600 text-sm">Total funding</p>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-white" />
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
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-white" />
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
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center">
              <Users className="w-6 h-6 text-white" />
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
            <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-white" />
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
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{startupData.name}</h1>
              <p className="text-gray-600 mt-1">{startupData.description}</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm text-gray-500">Current Stage</p>
                <p className="font-semibold text-gray-900">{startupData.stage}</p>
              </div>
              <div className="w-12 h-12 bg-black rounded-xl flex items-center justify-center">
                <Rocket className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        </div>

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
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'milestones' && <MilestonesEngineFixed />}
        {activeTab === 'team' && <TeamView />}
        {activeTab === 'projects' && <ProjectBoardFixed />}
        {activeTab === 'investors' && <InvestorRoom />}
        {activeTab === 'vc-angels' && <VCAngelAccess />}
        {activeTab === 'launch' && <LaunchDashboard />}
        {activeTab === 'profile' && <StartupProfilePage />}
      </div>
    </div>
  );
};

export default StartupWorkspace;
