import React, { useState, useEffect } from 'react';
import { 
  Globe, Eye, Edit3, Share2, ExternalLink, Plus, 
  CheckCircle, Clock, AlertCircle, Target, BarChart3, 
  TrendingUp, Award, Star, Zap, Users, Calendar, 
  FileText, MessageSquare, Video, Download, Bell,
  ChevronRight, ChevronDown, ChevronUp, ArrowRight,
  ArrowLeft, ArrowUp, ArrowDown, X, Info, HelpCircle,
  RefreshCw, Mail, Phone, MapPin, Briefcase, 
  GraduationCap, Building2, DollarSign, Settings
} from 'lucide-react';

const StartupProfilePage = () => {
  const [profileData, setProfileData] = useState({
    name: 'TechFlow AI',
    tagline: 'AI-powered workflow automation for remote teams',
    description: 'Revolutionary platform that helps remote teams automate their workflows using advanced AI algorithms. Our solution provides intelligent task management, automated reporting, and seamless collaboration tools.',
    status: 'live',
    views: 1247,
    url: 'cobuilders.com/startup/techflow-ai',
    industry: 'SaaS',
    stage: 'MVP Development',
    founded: '2024',
    location: 'San Francisco, CA',
    teamSize: '2-10',
    website: 'https://techflow.ai',
    socialMedia: {
      twitter: '@techflowai',
      linkedin: 'linkedin.com/company/techflow-ai'
    },
    metrics: {
      users: 0,
      revenue: 0,
      growth: 0,
      retention: 0
    },
    tags: ['AI', 'SaaS', 'Remote Work', 'Automation', 'Productivity'],
    founders: [
      {
        name: 'Alex Chen',
        role: 'Technical Co-founder',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face',
        bio: '5+ years in full-stack development, previously at Google'
      },
      {
        name: 'Sarah Martinez',
        role: 'Business Co-founder',
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=400&fit=crop&crop=face',
        bio: '7+ years in business development, MBA from Harvard'
      }
    ],
    gallery: [
      'https://images.unsplash.com/photo-1551434678-e076c223a692?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop'
    ]
  });

  const [launchEvents, setLaunchEvents] = useState([
    {
      id: 1,
      name: 'Demo Day 2024',
      date: '2024-03-15',
      status: 'applied',
      description: 'TechCrunch Disrupt Demo Day',
      requirements: ['Pitch deck', 'Demo video', 'Financial model']
    },
    {
      id: 2,
      name: 'Pitch Night SF',
      date: '2024-04-01',
      status: 'available',
      description: 'San Francisco startup pitch event',
      requirements: ['Pitch deck', 'Demo video']
    },
    {
      id: 3,
      name: 'AMA Session',
      date: '2024-04-15',
      status: 'available',
      description: 'Ask Me Anything with successful founders',
      requirements: ['Registration', 'Questions prepared']
    }
  ]);

  const [showEditModal, setShowEditModal] = useState(false);
  const [editingData, setEditingData] = useState({});

  const getStatusColor = (status) => {
    switch (status) {
      case 'live':
        return 'bg-green-100 text-green-700';
      case 'draft':
        return 'bg-yellow-100 text-yellow-700';
      case 'applied':
        return 'bg-blue-100 text-blue-700';
      case 'available':
        return 'bg-gray-100 text-gray-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const renderProfilePreview = () => (
    <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center">
          <Globe className="w-5 h-5 text-white" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-gray-900">Profile Preview</h3>
          <p className="text-gray-600">Your public-facing startup profile</p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className={`px-3 py-1 text-sm font-semibold rounded-full ${getStatusColor(profileData.status)}`}>
              {profileData.status.toUpperCase()}
            </span>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Eye className="w-4 h-4" />
              <span>{profileData.views.toLocaleString()} views</span>
            </div>
          </div>
        </div>

        <div className="p-4 bg-gray-50 rounded-xl">
          <div className="flex items-start gap-4 mb-4">
            <div className="w-16 h-16 bg-black rounded-2xl flex items-center justify-center">
              <Zap className="w-8 h-8 text-white" />
            </div>
            <div className="flex-1">
              <h4 className="text-xl font-bold text-gray-900">{profileData.name}</h4>
              <p className="text-gray-600 mb-2">{profileData.tagline}</p>
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <span>{profileData.industry}</span>
                <span>•</span>
                <span>{profileData.stage}</span>
                <span>•</span>
                <span>{profileData.location}</span>
              </div>
            </div>
          </div>

          <p className="text-gray-700 text-sm mb-4">{profileData.description}</p>

          <div className="flex flex-wrap gap-2 mb-4">
            {profileData.tags.map((tag, index) => (
              <span key={index} className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full">
                {tag}
              </span>
            ))}
          </div>

          <div className="text-sm text-gray-500">
            <p>URL: <span className="text-blue-600 font-medium">{profileData.url}</span></p>
          </div>
        </div>

        <div className="flex gap-3">
          <button className="flex-1 py-3 bg-black text-white rounded-xl hover:bg-gray-800 transition-colors font-semibold flex items-center justify-center gap-2">
            <ExternalLink className="w-4 h-4" />
            View Profile
          </button>
          <button 
            onClick={() => setShowEditModal(true)}
            className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors font-semibold flex items-center justify-center gap-2"
          >
            <Edit3 className="w-4 h-4" />
            Edit Profile
          </button>
        </div>
      </div>
    </div>
  );

  const renderLaunchEventsAccess = () => (
    <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center">
          <Calendar className="w-5 h-5 text-white" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-gray-900">Launch Events Access</h3>
          <p className="text-gray-600">Apply to startup events and pitch competitions</p>
        </div>
      </div>

      <div className="space-y-4">
        {launchEvents.map(event => (
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
                {event.requirements.length} requirements
              </div>
              <div className="flex gap-2">
                {event.status === 'available' ? (
                  <button className="px-3 py-1 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors text-xs font-semibold">
                    Apply
                  </button>
                ) : (
                  <button className="px-3 py-1 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-xs">
                    View Details
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderEditModal = () => (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold text-gray-900">Edit Profile</h3>
            <button
              onClick={() => setShowEditModal(false)}
              className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
            >
              <X className="w-6 h-6 text-gray-500" />
            </button>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Startup Name</label>
              <input
                type="text"
                value={editingData.name || profileData.name}
                onChange={(e) => setEditingData(prev => ({ ...prev, name: e.target.value }))}
                className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Tagline</label>
              <input
                type="text"
                value={editingData.tagline || profileData.tagline}
                onChange={(e) => setEditingData(prev => ({ ...prev, tagline: e.target.value }))}
                className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <textarea
                value={editingData.description || profileData.description}
                onChange={(e) => setEditingData(prev => ({ ...prev, description: e.target.value }))}
                rows={4}
                className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent resize-none"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Industry</label>
                <select
                  value={editingData.industry || profileData.industry}
                  onChange={(e) => setEditingData(prev => ({ ...prev, industry: e.target.value }))}
                  className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent"
                >
                  <option value="SaaS">SaaS</option>
                  <option value="FinTech">FinTech</option>
                  <option value="HealthTech">HealthTech</option>
                  <option value="EdTech">EdTech</option>
                  <option value="AI/ML">AI/ML</option>
                  <option value="E-commerce">E-commerce</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Stage</label>
                <select
                  value={editingData.stage || profileData.stage}
                  onChange={(e) => setEditingData(prev => ({ ...prev, stage: e.target.value }))}
                  className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent"
                >
                  <option value="Idea Stage">Idea Stage</option>
                  <option value="MVP Development">MVP Development</option>
                  <option value="Beta Testing">Beta Testing</option>
                  <option value="Launched">Launched</option>
                  <option value="Growth Stage">Growth Stage</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                <input
                  type="text"
                  value={editingData.location || profileData.location}
                  onChange={(e) => setEditingData(prev => ({ ...prev, location: e.target.value }))}
                  className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Website</label>
                <input
                  type="url"
                  value={editingData.website || profileData.website}
                  onChange={(e) => setEditingData(prev => ({ ...prev, website: e.target.value }))}
                  className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent"
                />
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowEditModal(false)}
                className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setProfileData(prev => ({ ...prev, ...editingData }));
                  setShowEditModal(false);
                }}
                className="flex-1 py-3 bg-black text-white rounded-xl hover:bg-gray-800 transition-colors font-semibold"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
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
              <Globe className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Startup Profile Page</h1>
              <p className="text-gray-600">Public-facing page for discovery and showcase</p>
            </div>
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {renderProfilePreview()}
          {renderLaunchEventsAccess()}
        </div>

        {/* Edit Modal */}
        {showEditModal && renderEditModal()}
      </div>
    </div>
  );
};

export default StartupProfilePage;
