import React, { useState, useEffect } from 'react';
import { 
  DollarSign, TrendingUp, Target, Users, Calendar, 
  FileText, Send, Phone, Mail, ExternalLink, Plus,
  Edit3, Trash2, Save, Download, Share2, Eye,
  ChevronRight, ChevronDown, ChevronUp, ArrowRight,
  ArrowLeft, ArrowUp, ArrowDown, Building2, Code,
  Palette, Globe, Bell, Settings, Search, Filter,
  SortAsc, SortDesc, RefreshCw, Heart, Bookmark,
  Flag, MoreHorizontal, Info, HelpCircle, Lock,
  Unlock, Key, Shield, Activity, Compass, Badge,
  Gift, Coffee, Plane, Gamepad2, BookOpen, Instagram,
  Twitter, Linkedin, Github, Camera, Mic, Play,
  Pause, Volume2, ThumbsUp, MessageCircle, Upload,
  Link, Copy, Scissors, Move, ZoomIn, ZoomOut,
  RotateCw, RotateCcw, Maximize2, Minimize2, X,
  Check, AlertTriangle, AlertOctagon, PlusCircle,
  MinusCircle, XCircle, CheckCircle2, Clock, AlertCircle,
  BarChart3, Award, Star, Zap, Rocket, Sparkles,
  Crown, Diamond, Flame, Moon, Sun
} from 'lucide-react';

const FundingTracker = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [fundingData, setFundingData] = useState({
    raised: 125000,
    target: 500000,
    round: 'Seed',
    investors: [
      {
        id: 1,
        name: 'TechStars',
        type: 'Accelerator',
        amount: 100000,
        equity: 6,
        status: 'Committed',
        contact: 'john@techstars.com',
        date: '2024-01-15'
      },
      {
        id: 2,
        name: 'Angel Investor',
        type: 'Angel',
        amount: 25000,
        equity: 2,
        status: 'Committed',
        contact: 'sarah@angel.com',
        date: '2024-01-20'
      }
    ],
    pipeline: [
      {
        id: 1,
        name: 'Y Combinator',
        type: 'Accelerator',
        amount: 500000,
        equity: 7,
        status: 'Applied',
        contact: 'apply@ycombinator.com',
        date: '2024-02-01'
      },
      {
        id: 2,
        name: 'Sequoia Capital',
        type: 'VC',
        amount: 2000000,
        equity: 15,
        status: 'In Discussion',
        contact: 'partners@sequoia.com',
        date: '2024-02-15'
      }
    ],
    milestones: [
      { id: 1, title: 'Product MVP', status: 'completed', dueDate: '2024-01-01' },
      { id: 2, title: 'First 100 Users', status: 'completed', dueDate: '2024-01-15' },
      { id: 3, title: 'Revenue Milestone', status: 'in-progress', dueDate: '2024-03-01' },
      { id: 4, title: 'Series A Ready', status: 'pending', dueDate: '2024-06-01' }
    ]
  });

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'investors', label: 'Investors', icon: Users },
    { id: 'pipeline', label: 'Pipeline', icon: Target },
    { id: 'documents', label: 'Documents', icon: FileText },
    { id: 'milestones', label: 'Milestones', icon: Award }
  ];

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Funding Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Raised</p>
              <p className="text-2xl font-bold text-gray-900">
                ${(fundingData.raised / 1000).toFixed(0)}K
              </p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Target</p>
              <p className="text-2xl font-bold text-gray-900">
                ${(fundingData.target / 1000).toFixed(0)}K
              </p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
              <Target className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Progress</p>
              <p className="text-2xl font-bold text-gray-900">
                {((fundingData.raised / fundingData.target) * 100).toFixed(0)}%
              </p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Investors</p>
              <p className="text-2xl font-bold text-gray-900">{fundingData.investors.length}</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center">
              <Users className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="bg-white rounded-2xl p-6 shadow-lg">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Funding Progress</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">Current Round: {fundingData.round}</span>
            <span className="text-sm text-gray-500">
              ${(fundingData.raised / 1000).toFixed(0)}K / ${(fundingData.target / 1000).toFixed(0)}K
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className="bg-gradient-to-r from-green-500 to-emerald-500 h-3 rounded-full transition-all duration-300"
              style={{ width: `${(fundingData.raised / fundingData.target) * 100}%` }}
            ></div>
          </div>
          <div className="flex justify-between text-sm text-gray-500">
            <span>0%</span>
            <span>25%</span>
            <span>50%</span>
            <span>75%</span>
            <span>100%</span>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-2xl p-6 shadow-lg">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Recent Activity</h3>
        <div className="space-y-4">
          <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
            <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1">
              <p className="font-medium text-gray-900">Angel Investor committed $25K</p>
              <p className="text-sm text-gray-500">2 days ago</p>
            </div>
          </div>
          <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
              <FileText className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1">
              <p className="font-medium text-gray-900">Pitch deck updated</p>
              <p className="text-sm text-gray-500">1 week ago</p>
            </div>
          </div>
          <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
              <Calendar className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1">
              <p className="font-medium text-gray-900">Meeting scheduled with Sequoia</p>
              <p className="text-sm text-gray-500">Next week</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderInvestors = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-gray-900">Current Investors</h3>
        <button className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors">
          <Plus className="w-4 h-4 mr-2" />
          Add Investor
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {fundingData.investors.map((investor) => (
          <div key={investor.id} className="bg-white rounded-2xl p-6 shadow-lg">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h4 className="text-lg font-bold text-gray-900">{investor.name}</h4>
                <p className="text-sm text-gray-600">{investor.type}</p>
              </div>
              <span className={`px-3 py-1 text-xs rounded-full ${
                investor.status === 'Committed' ? 'bg-green-100 text-green-700' :
                investor.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' :
                'bg-gray-100 text-gray-700'
              }`}>
                {investor.status}
              </span>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Investment</span>
                <span className="font-semibold text-gray-900">${(investor.amount / 1000).toFixed(0)}K</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Equity</span>
                <span className="font-semibold text-gray-900">{investor.equity}%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Date</span>
                <span className="font-semibold text-gray-900">{investor.date}</span>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-gray-500" />
                <span className="text-sm text-gray-600">{investor.contact}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderPipeline = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-gray-900">Investor Pipeline</h3>
        <button className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors">
          <Plus className="w-4 h-4 mr-2" />
          Add to Pipeline
        </button>
      </div>

      <div className="space-y-4">
        {fundingData.pipeline.map((investor) => (
          <div key={investor.id} className="bg-white rounded-2xl p-6 shadow-lg">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h4 className="text-lg font-bold text-gray-900">{investor.name}</h4>
                <p className="text-sm text-gray-600">{investor.type}</p>
              </div>
              <span className={`px-3 py-1 text-xs rounded-full ${
                investor.status === 'Applied' ? 'bg-blue-100 text-blue-700' :
                investor.status === 'In Discussion' ? 'bg-yellow-100 text-yellow-700' :
                investor.status === 'Rejected' ? 'bg-red-100 text-red-700' :
                'bg-gray-100 text-gray-700'
              }`}>
                {investor.status}
              </span>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <span className="text-sm text-gray-600">Potential Investment</span>
                <p className="font-semibold text-gray-900">${(investor.amount / 1000).toFixed(0)}K</p>
              </div>
              <div>
                <span className="text-sm text-gray-600">Equity Ask</span>
                <p className="font-semibold text-gray-900">{investor.equity}%</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
                <Mail className="w-4 h-4 mr-2" />
                Contact
              </button>
              <button className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors">
                <Calendar className="w-4 h-4 mr-2" />
                Schedule
              </button>
              <button className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors">
                <FileText className="w-4 h-4 mr-2" />
                Send Deck
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderDocuments = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-gray-900">Fundraising Documents</h3>
        <button className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors">
          <Plus className="w-4 h-4 mr-2" />
          Upload Document
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <div>
              <h4 className="font-semibold text-gray-900">Pitch Deck</h4>
              <p className="text-sm text-gray-600">Updated 2 days ago</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="px-3 py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
              <Eye className="w-4 h-4 mr-1" />
              View
            </button>
            <button className="px-3 py-1 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors">
              <Download className="w-4 h-4 mr-1" />
              Download
            </button>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <div>
              <h4 className="font-semibold text-gray-900">Financial Model</h4>
              <p className="text-sm text-gray-600">Updated 1 week ago</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="px-3 py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
              <Eye className="w-4 h-4 mr-1" />
              View
            </button>
            <button className="px-3 py-1 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors">
              <Download className="w-4 h-4 mr-1" />
              Download
            </button>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <div>
              <h4 className="font-semibold text-gray-900">Term Sheet</h4>
              <p className="text-sm text-gray-600">Draft version</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="px-3 py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
              <Eye className="w-4 h-4 mr-1" />
              View
            </button>
            <button className="px-3 py-1 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors">
              <Download className="w-4 h-4 mr-1" />
              Download
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderMilestones = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-gray-900">Funding Milestones</h3>
        <button className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors">
          <Plus className="w-4 h-4 mr-2" />
          Add Milestone
        </button>
      </div>

      <div className="space-y-4">
        {fundingData.milestones.map((milestone) => (
          <div key={milestone.id} className="bg-white rounded-2xl p-6 shadow-lg">
            <div className="flex items-center gap-4">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                milestone.status === 'completed' ? 'bg-green-500' :
                milestone.status === 'in-progress' ? 'bg-blue-500' : 'bg-gray-300'
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
                <h4 className="font-semibold text-gray-900">{milestone.title}</h4>
                <p className="text-sm text-gray-600">Due: {milestone.dueDate}</p>
              </div>
              <span className={`px-3 py-1 text-xs rounded-full ${
                milestone.status === 'completed' ? 'bg-green-100 text-green-700' :
                milestone.status === 'in-progress' ? 'bg-blue-100 text-blue-700' :
                'bg-gray-100 text-gray-700'
              }`}>
                {milestone.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Funding Tracker</h2>
            <p className="text-sm text-gray-600">Manage your fundraising journey</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-sm text-gray-600">Active</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="px-4 py-2 border-b border-gray-200">
        <div className="flex space-x-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'bg-purple-100 text-purple-700'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="font-medium">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-auto p-6">
        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'investors' && renderInvestors()}
        {activeTab === 'pipeline' && renderPipeline()}
        {activeTab === 'documents' && renderDocuments()}
        {activeTab === 'milestones' && renderMilestones()}
      </div>
    </div>
  );
};

export default FundingTracker;
