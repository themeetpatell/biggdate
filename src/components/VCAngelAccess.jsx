import React, { useState, useEffect } from 'react';
import { 
  Users, Building2, Star, Plus, Edit3, Trash2, 
  Save, Download, Share2, Eye, CheckCircle, Clock, 
  AlertCircle, Target, BarChart3, TrendingUp, Award, 
  Zap, ChevronRight, ChevronDown, ChevronUp, ArrowRight,
  ArrowLeft, ArrowUp, ArrowDown, X, Info, HelpCircle,
  RefreshCw, Mail, Phone, MessageSquare, Video, MapPin, 
  Briefcase, GraduationCap, Globe, DollarSign, Bell,
  ExternalLink, Filter, Search, SortAsc, SortDesc
} from 'lucide-react';

const VCAngelAccess = () => {
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
      responseTime: '2-3 weeks',
      isPremium: true,
      location: 'Menlo Park, CA',
      website: 'https://sequoiacap.com',
      linkedin: 'linkedin.com/company/sequoia-capital',
      twitter: '@sequoia',
      founded: '1972',
      aum: '$85B',
      investments: '1,200+',
      exits: '200+',
      avgCheckSize: '$15M',
      minRevenue: '$1M ARR',
      industries: ['Enterprise Software', 'AI/ML', 'Fintech', 'Healthcare'],
      stages: ['Series A', 'Series B', 'Series C', 'Growth'],
      geographies: ['North America', 'Europe', 'Asia'],
      recentInvestments: [
        { company: 'OpenAI', amount: '$1B', stage: 'Series C' },
        { company: 'Stripe', amount: '$600M', stage: 'Series H' },
        { company: 'Airbnb', amount: '$1.5B', stage: 'Series F' }
      ]
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
      responseTime: '1-2 weeks',
      isPremium: true,
      location: 'Menlo Park, CA',
      website: 'https://a16z.com',
      linkedin: 'linkedin.com/company/andreessen-horowitz',
      twitter: '@a16z',
      founded: '2009',
      aum: '$35B',
      investments: '800+',
      exits: '150+',
      avgCheckSize: '$8M',
      minRevenue: '$500K ARR',
      industries: ['Software', 'Crypto', 'Fintech', 'Consumer'],
      stages: ['Seed', 'Series A', 'Series B'],
      geographies: ['North America', 'Europe'],
      recentInvestments: [
        { company: 'OpenAI', amount: '$1B', stage: 'Series C' },
        { company: 'Coinbase', amount: '$300M', stage: 'Series E' },
        { company: 'GitHub', amount: '$250M', stage: 'Series B' }
      ]
    },
    {
      id: 3,
      name: 'Y Combinator',
      type: 'Accelerator',
      stage: 'Pre-seed',
      checkSize: '$500K',
      focus: 'Early stage startups',
      status: 'available',
      contact: 'apply@ycombinator.com',
      description: 'World-renowned startup accelerator',
      portfolio: ['Airbnb', 'Dropbox', 'Stripe', 'Reddit', 'Twitch'],
      requirements: ['Application', 'Pitch deck', 'Demo video'],
      responseTime: '2-4 weeks',
      isPremium: true,
      location: 'Mountain View, CA',
      website: 'https://ycombinator.com',
      linkedin: 'linkedin.com/company/y-combinator',
      twitter: '@ycombinator',
      founded: '2005',
      aum: '$2B',
      investments: '3,000+',
      exits: '500+',
      avgCheckSize: '$500K',
      minRevenue: 'Pre-revenue OK',
      industries: ['All Industries'],
      stages: ['Pre-seed', 'Seed'],
      geographies: ['Global'],
      recentInvestments: [
        { company: 'Stripe', amount: '$500K', stage: 'Pre-seed' },
        { company: 'Airbnb', amount: '$500K', stage: 'Pre-seed' },
        { company: 'Dropbox', amount: '$500K', stage: 'Pre-seed' }
      ]
    },
    {
      id: 4,
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
      responseTime: '2-4 weeks',
      isPremium: true,
      location: 'Palo Alto, CA',
      website: 'https://accel.com',
      linkedin: 'linkedin.com/company/accel-partners',
      twitter: '@accel',
      founded: '1983',
      aum: '$50B',
      investments: '1,500+',
      exits: '300+',
      avgCheckSize: '$12M',
      minRevenue: '$2M ARR',
      industries: ['Enterprise', 'Consumer', 'Healthcare', 'Fintech'],
      stages: ['Seed', 'Series A', 'Series B', 'Growth'],
      geographies: ['North America', 'Europe', 'Asia'],
      recentInvestments: [
        { company: 'Slack', amount: '$200M', stage: 'Series F' },
        { company: 'Spotify', amount: '$100M', stage: 'Series G' },
        { company: 'Atlassian', amount: '$150M', stage: 'Series H' }
      ]
    }
  ]);

  const [angels, setAngels] = useState([
    {
      id: 1,
      name: 'Paul Graham',
      type: 'Angel',
      stage: 'Pre-seed to Seed',
      checkSize: '$25K - $100K',
      focus: 'Early stage startups',
      status: 'available',
      contact: 'pg@ycombinator.com',
      description: 'Co-founder of Y Combinator, early stage investor',
      portfolio: ['Airbnb', 'Dropbox', 'Stripe', 'Reddit'],
      requirements: ['Y Combinator application', 'Pitch deck'],
      responseTime: '1-2 weeks',
      isPremium: true,
      location: 'San Francisco, CA',
      website: 'https://paulgraham.com',
      linkedin: 'linkedin.com/in/paulgraham',
      twitter: '@paulg',
      founded: '2005',
      investments: '500+',
      exits: '100+',
      avgCheckSize: '$50K',
      minRevenue: 'Pre-revenue OK',
      industries: ['Software', 'Consumer', 'Enterprise'],
      stages: ['Pre-seed', 'Seed'],
      geographies: ['North America'],
      recentInvestments: [
        { company: 'Stripe', amount: '$50K', stage: 'Pre-seed' },
        { company: 'Airbnb', amount: '$25K', stage: 'Pre-seed' },
        { company: 'Dropbox', amount: '$50K', stage: 'Pre-seed' }
      ]
    },
    {
      id: 2,
      name: 'Naval Ravikant',
      type: 'Angel',
      stage: 'Pre-seed to Series A',
      checkSize: '$10K - $500K',
      focus: 'Software, Crypto, Consumer',
      status: 'available',
      contact: 'naval@angel.co',
      description: 'Co-founder of AngelList, prolific angel investor',
      portfolio: ['Twitter', 'Uber', 'Coinbase', 'GitHub'],
      requirements: ['AngelList profile', 'Pitch deck'],
      responseTime: '1-3 weeks',
      isPremium: true,
      location: 'San Francisco, CA',
      website: 'https://nav.al',
      linkedin: 'linkedin.com/in/naval',
      twitter: '@naval',
      founded: '2010',
      investments: '200+',
      exits: '50+',
      avgCheckSize: '$100K',
      minRevenue: 'Pre-revenue OK',
      industries: ['Software', 'Crypto', 'Consumer', 'Fintech'],
      stages: ['Pre-seed', 'Seed', 'Series A'],
      geographies: ['North America', 'Europe'],
      recentInvestments: [
        { company: 'Coinbase', amount: '$100K', stage: 'Seed' },
        { company: 'Uber', amount: '$50K', stage: 'Series A' },
        { company: 'Twitter', amount: '$25K', stage: 'Seed' }
      ]
    }
  ]);

  const [showAddInvestorModal, setShowAddInvestorModal] = useState(false);
  const [showAddAngelModal, setShowAddAngelModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [newInvestor, setNewInvestor] = useState({
    name: '',
    type: 'VC',
    stage: '',
    checkSize: '',
    focus: '',
    description: '',
    requirements: [],
    responseTime: '',
    isPremium: false
  });

  const categories = [
    { id: 'all', label: 'All', count: investors.length + angels.length },
    { id: 'vc', label: 'VCs', count: investors.length },
    { id: 'angel', label: 'Angels', count: angels.length },
    { id: 'premium', label: 'Premium', count: [...investors, ...angels].filter(item => item.isPremium).length }
  ];

  const filteredData = () => {
    let data = selectedCategory === 'vc' ? investors : 
               selectedCategory === 'angel' ? angels : 
               [...investors, ...angels];
    
    if (selectedCategory === 'premium') {
      data = data.filter(item => item.isPremium);
    }
    
    if (searchTerm) {
      data = data.filter(item => 
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.focus.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    return data.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'checkSize':
          return a.checkSize.localeCompare(b.checkSize);
        case 'responseTime':
          return a.responseTime.localeCompare(b.responseTime);
        default:
          return 0;
      }
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'available':
        return 'bg-green-100 text-green-700';
      case 'busy':
        return 'bg-yellow-100 text-yellow-700';
      case 'unavailable':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const renderInvestorCard = (item) => (
    <div key={item.id} className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="text-xl font-bold text-gray-900">{item.name}</h3>
            {item.isPremium && (
              <span className="px-2 py-1 bg-yellow-100 text-yellow-700 text-xs rounded-full">
                Premium
              </span>
            )}
            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(item.status)}`}>
              {item.status}
            </span>
          </div>
          <p className="text-gray-600 mb-2">{item.description}</p>
          <div className="flex items-center gap-4 text-sm text-gray-500">
            <span>{item.type}</span>
            <span>•</span>
            <span>{item.stage}</span>
            <span>•</span>
            <span>{item.checkSize}</span>
            <span>•</span>
            <span>{item.location}</span>
          </div>
        </div>
      </div>

      <div className="mb-4">
        <h4 className="font-semibold text-gray-900 mb-2">Focus Areas</h4>
        <p className="text-sm text-gray-600">{item.focus}</p>
      </div>

      <div className="mb-4">
        <h4 className="font-semibold text-gray-900 mb-2">Requirements</h4>
        <div className="flex flex-wrap gap-2">
          {item.requirements.map((req, index) => (
            <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
              {req}
            </span>
          ))}
        </div>
      </div>

      <div className="mb-4">
        <h4 className="font-semibold text-gray-900 mb-2">Recent Investments</h4>
        <div className="space-y-1">
          {item.recentInvestments.slice(0, 3).map((investment, index) => (
            <div key={index} className="flex items-center justify-between text-sm">
              <span className="text-gray-700">{investment.company}</span>
              <span className="text-gray-500">{investment.amount} • {investment.stage}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-gray-200">
        <div className="text-xs text-gray-500">
          Response time: {item.responseTime}
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
  );

  const renderFilters = () => (
    <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 mb-6">
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Search */}
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search investors and angels..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent"
            />
          </div>
        </div>

        {/* Category Filter */}
        <div className="flex gap-2">
          {categories.map(category => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-4 py-2 rounded-xl font-semibold transition-colors ${
                selectedCategory === category.id
                  ? 'bg-black text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {category.label} ({category.count})
            </button>
          ))}
        </div>

        {/* Sort */}
        <div className="flex items-center gap-2">
          <SortAsc className="w-4 h-4 text-gray-400" />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent"
          >
            <option value="name">Sort by Name</option>
            <option value="checkSize">Sort by Check Size</option>
            <option value="responseTime">Sort by Response Time</option>
          </select>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-black rounded-xl flex items-center justify-center">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">VC & Angel Access</h1>
                <p className="text-gray-600">Partnered investors and accelerators directory</p>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowAddAngelModal(true)}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors font-semibold flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Add Angel
              </button>
              <button
                onClick={() => setShowAddInvestorModal(true)}
                className="px-4 py-2 bg-black text-white rounded-xl hover:bg-gray-800 transition-colors font-semibold flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Add VC
              </button>
            </div>
          </div>
        </div>

        {/* Filters */}
        {renderFilters()}

        {/* Investors Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredData().map(renderInvestorCard)}
        </div>

        {/* Empty State */}
        {filteredData().length === 0 && (
          <div className="text-center py-12">
            <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No investors found</h3>
            <p className="text-gray-600 mb-6">Try adjusting your search or filter criteria</p>
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('all');
              }}
              className="px-6 py-3 bg-black text-white rounded-xl hover:bg-gray-800 transition-colors font-semibold"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default VCAngelAccess;
