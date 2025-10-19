import React, { useState, useEffect } from 'react';
import { 
  Users, FileText, Calendar, ExternalLink, Plus, 
  Edit3, Trash2, Save, Download, Share2, Eye, 
  CheckCircle, Clock, AlertCircle, Target, BarChart3, 
  TrendingUp, Award, Star, Zap, ChevronRight, ChevronDown, 
  ChevronUp, ArrowRight, ArrowLeft, ArrowUp, ArrowDown, 
  X, Info, HelpCircle, RefreshCw, Mail, Phone, 
  MessageSquare, Video, MapPin, Briefcase, GraduationCap, 
  Globe, Building2, DollarSign, Bell, Settings
} from 'lucide-react';

const InvestorRoom = () => {
  const [dataRoom, setDataRoom] = useState({
    documents: [
      {
        id: 1,
        name: 'Financial Model',
        type: 'xlsx',
        size: '2.3 MB',
        lastUpdated: '2024-01-15',
        status: 'ready',
        description: 'Comprehensive financial projections and unit economics'
      },
      {
        id: 2,
        name: 'Market Analysis',
        type: 'pdf',
        size: '1.8 MB',
        lastUpdated: '2024-01-12',
        status: 'ready',
        description: 'Market size, TAM, SAM, SOM analysis'
      },
      {
        id: 3,
        name: 'Team Bios',
        type: 'pdf',
        size: '0.9 MB',
        lastUpdated: '2024-01-10',
        status: 'ready',
        description: 'Detailed team member profiles and backgrounds'
      },
      {
        id: 4,
        name: 'Product Demo',
        type: 'mp4',
        size: '45.2 MB',
        lastUpdated: '2024-01-18',
        status: 'ready',
        description: '5-minute product demonstration video'
      },
      {
        id: 5,
        name: 'Legal Documents',
        type: 'pdf',
        size: '3.1 MB',
        lastUpdated: '2024-01-20',
        status: 'draft',
        description: 'Incorporation papers, IP assignments, contracts'
      }
    ]
  });

  const [demoDays, setDemoDays] = useState([
    {
      id: 1,
      name: 'TechCrunch Disrupt',
      date: 'March 15, 2024',
      status: 'confirmed',
      location: 'San Francisco, CA',
      description: 'Premier startup conference with 10,000+ attendees',
      requirements: ['Pitch deck', 'Demo video', 'Financial model'],
      deadline: '2024-02-15',
      contact: 'disrupt@techcrunch.com'
    },
    {
      id: 2,
      name: 'Y Combinator Demo Day',
      date: 'April 20, 2024',
      status: 'pending',
      location: 'Mountain View, CA',
      description: 'YC alumni demo day for investors and partners',
      requirements: ['YC application', 'Pitch deck', 'Financial model'],
      deadline: '2024-03-01',
      contact: 'demoday@ycombinator.com'
    },
    {
      id: 3,
      name: 'Startup Grind Global',
      date: 'May 10, 2024',
      status: 'available',
      location: 'Redwood City, CA',
      description: 'Global startup community conference',
      requirements: ['Application', 'Pitch deck'],
      deadline: '2024-04-01',
      contact: 'global@startupgrind.com'
    }
  ]);

  const [investors, setInvestors] = useState([
    {
      id: 1,
      name: 'Sequoia Capital',
      type: 'VC',
      stage: 'Series A+',
      checkSize: '$5M - $50M',
      focus: 'Enterprise Software, AI/ML',
      status: 'available',
      contact: 'partners@sequoiacap.com',
      description: 'Leading venture capital firm with investments in Apple, Google, WhatsApp',
      portfolio: ['Apple', 'Google', 'WhatsApp', 'Airbnb', 'Stripe'],
      requirements: ['Pitch deck', 'Financial model', 'Customer references'],
      responseTime: '2-3 weeks'
    },
    {
      id: 2,
      name: 'Andreessen Horowitz',
      type: 'VC',
      stage: 'Seed to Series B',
      checkSize: '$1M - $25M',
      focus: 'Software, Crypto, Fintech',
      status: 'available',
      contact: 'partners@a16z.com',
      description: 'Technology-focused venture capital firm',
      portfolio: ['Facebook', 'Twitter', 'Coinbase', 'GitHub', 'Stripe'],
      requirements: ['Pitch deck', 'Financial model', 'Product demo'],
      responseTime: '1-2 weeks'
    },
    {
      id: 3,
      name: 'Accel Partners',
      type: 'VC',
      stage: 'Seed to Growth',
      checkSize: '$500K - $100M',
      focus: 'Enterprise, Consumer, Healthcare',
      status: 'available',
      contact: 'partners@accel.com',
      description: 'Global venture capital firm with offices worldwide',
      portfolio: ['Slack', 'Dropbox', 'Spotify', 'Atlassian', 'CrowdStrike'],
      requirements: ['Pitch deck', 'Financial model', 'Market analysis'],
      responseTime: '2-4 weeks'
    }
  ]);

  const [showAddDocumentModal, setShowAddDocumentModal] = useState(false);
  const [showAddDemoDayModal, setShowAddDemoDayModal] = useState(false);
  const [showAddInvestorModal, setShowAddInvestorModal] = useState(false);
  const [newDocument, setNewDocument] = useState({
    name: '',
    type: 'pdf',
    description: '',
    file: null
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-700';
      case 'pending':
        return 'bg-yellow-100 text-yellow-700';
      case 'available':
        return 'bg-blue-100 text-blue-700';
      case 'ready':
        return 'bg-green-100 text-green-700';
      case 'draft':
        return 'bg-gray-100 text-gray-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getFileIcon = (type) => {
    switch (type) {
      case 'pdf':
        return <FileText className="w-6 h-6 text-red-500" />;
      case 'xlsx':
        return <BarChart3 className="w-6 h-6 text-green-500" />;
      case 'mp4':
        return <Video className="w-6 h-6 text-blue-500" />;
      default:
        return <FileText className="w-6 h-6 text-gray-500" />;
    }
  };

  const renderDataRoom = () => (
    <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center">
            <FileText className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900">Data Room</h3>
            <p className="text-gray-600">Essential documents for investors</p>
          </div>
        </div>
        <button
          onClick={() => setShowAddDocumentModal(true)}
          className="px-4 py-2 bg-black text-white rounded-xl hover:bg-gray-800 transition-colors font-semibold flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Document
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {dataRoom.documents.map(doc => (
          <div key={doc.id} className="p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
            <div className="flex items-start gap-3 mb-3">
              {getFileIcon(doc.type)}
              <div className="flex-1">
                <h4 className="font-semibold text-gray-900 text-sm">{doc.name}</h4>
                <p className="text-xs text-gray-500">{doc.size} • {doc.type.toUpperCase()}</p>
              </div>
            </div>
            <p className="text-xs text-gray-600 mb-3">{doc.description}</p>
            <div className="flex items-center justify-between">
              <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(doc.status)}`}>
                {doc.status}
              </span>
              <div className="flex gap-1">
                <button className="p-1 hover:bg-gray-200 rounded-lg transition-colors">
                  <Download className="w-4 h-4 text-gray-600" />
                </button>
                <button className="p-1 hover:bg-gray-200 rounded-lg transition-colors">
                  <Share2 className="w-4 h-4 text-gray-600" />
                </button>
                <button className="p-1 hover:bg-gray-200 rounded-lg transition-colors">
                  <Edit3 className="w-4 h-4 text-gray-600" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderDemoDayAccess = () => (
    <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center">
            <Calendar className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900">Demo Day Access</h3>
            <p className="text-gray-600">Upcoming demo days and pitch events</p>
          </div>
        </div>
        <button
          onClick={() => setShowAddDemoDayModal(true)}
          className="px-4 py-2 bg-black text-white rounded-xl hover:bg-gray-800 transition-colors font-semibold flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Event
        </button>
      </div>

      <div className="space-y-4">
        {demoDays.map(event => (
          <div key={event.id} className="p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <h4 className="font-semibold text-gray-900">{event.name}</h4>
                <p className="text-sm text-gray-600">{event.description}</p>
                <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {event.date}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {event.location}
                  </span>
                </div>
              </div>
              <span className={`px-3 py-1 text-xs font-semibold rounded-full ${getStatusColor(event.status)}`}>
                {event.status}
              </span>
            </div>
            
            <div className="mb-3">
              <h5 className="text-sm font-medium text-gray-700 mb-2">Requirements:</h5>
              <div className="flex flex-wrap gap-2">
                {event.requirements.map((req, index) => (
                  <span key={index} className="px-2 py-1 bg-white text-gray-700 text-xs rounded-full">
                    {req}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="text-xs text-gray-500">
                Deadline: {event.deadline}
              </div>
              <div className="flex gap-2">
                <button className="px-3 py-1 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors text-xs font-semibold">
                  Apply
                </button>
                <button className="px-3 py-1 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-xs">
                  Details
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderOneClickIntros = () => (
    <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center">
            <Users className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900">1-Click Intros</h3>
            <p className="text-gray-600">Partnered investors and accelerators</p>
          </div>
        </div>
        <button
          onClick={() => setShowAddInvestorModal(true)}
          className="px-4 py-2 bg-black text-white rounded-xl hover:bg-gray-800 transition-colors font-semibold flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Investor
        </button>
      </div>

      <div className="space-y-4">
        {investors.map(investor => (
          <div key={investor.id} className="p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <h4 className="font-semibold text-gray-900">{investor.name}</h4>
                <p className="text-sm text-gray-600">{investor.description}</p>
                <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                  <span>{investor.type}</span>
                  <span>•</span>
                  <span>{investor.stage}</span>
                  <span>•</span>
                  <span>{investor.checkSize}</span>
                </div>
              </div>
              <span className={`px-3 py-1 text-xs font-semibold rounded-full ${getStatusColor(investor.status)}`}>
                {investor.status}
              </span>
            </div>

            <div className="mb-3">
              <h5 className="text-sm font-medium text-gray-700 mb-2">Focus Areas:</h5>
              <p className="text-xs text-gray-600">{investor.focus}</p>
            </div>

            <div className="mb-3">
              <h5 className="text-sm font-medium text-gray-700 mb-2">Requirements:</h5>
              <div className="flex flex-wrap gap-2">
                {investor.requirements.map((req, index) => (
                  <span key={index} className="px-2 py-1 bg-white text-gray-700 text-xs rounded-full">
                    {req}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="text-xs text-gray-500">
                Response time: {investor.responseTime}
              </div>
              <div className="flex gap-2">
                <button className="px-3 py-1 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors text-xs font-semibold">
                  Request Intro
                </button>
                <button className="px-3 py-1 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-xs">
                  View Profile
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-black rounded-xl flex items-center justify-center">
              <Users className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Investor Room</h1>
              <p className="text-gray-600">Data room, demo day access, 1-click intros</p>
            </div>
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            {renderDataRoom()}
          </div>
          <div className="lg:col-span-2 space-y-6">
            {renderDemoDayAccess()}
            {renderOneClickIntros()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvestorRoom;
