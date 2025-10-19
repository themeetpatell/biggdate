import React, { useState, useEffect } from 'react';
import { 
  DollarSign, Target, TrendingUp, Users, Plus, 
  Edit3, Trash2, Save, Download, Share2, Eye, 
  CheckCircle, Clock, AlertCircle, BarChart3, 
  Award, Star, Zap, ChevronRight, ChevronDown, 
  ChevronUp, ArrowRight, ArrowLeft, ArrowUp, 
  ArrowDown, X, Info, HelpCircle, RefreshCw,
  Mail, Phone, MessageSquare, Video, MapPin, 
  Briefcase, GraduationCap, Globe, Building2, Bell
} from 'lucide-react';

const FundraisingTracker = () => {
  const [roundDetails, setRoundDetails] = useState({
    roundType: 'Pre-seed',
    targetAmount: 500000,
    committedAmount: 150000,
    remainingAmount: 350000,
    startDate: '2024-01-01',
    endDate: '2024-06-30',
    status: 'active',
    leadInvestor: 'TBD',
    angelInvestors: 3,
    vcInterest: 5
  });

  const [investors, setInvestors] = useState([
    {
      id: 1,
      name: 'Y Combinator',
      type: 'Accelerator',
      status: 'available',
      checkSize: '$500K',
      focus: 'Early stage startups',
      description: 'World-renowned startup accelerator',
      portfolio: ['Airbnb', 'Dropbox', 'Stripe', 'Reddit'],
      requirements: ['Application', 'Pitch deck', 'Demo video'],
      responseTime: '2-4 weeks',
      isPremium: true
    },
    {
      id: 2,
      name: 'Sequoia Capital',
      type: 'VC',
      status: 'available',
      checkSize: '$5M - $50M',
      focus: 'Enterprise Software, AI/ML',
      description: 'Leading venture capital firm',
      portfolio: ['Apple', 'Google', 'WhatsApp', 'Airbnb'],
      requirements: ['Pitch deck', 'Financial model', 'Customer references'],
      responseTime: '2-3 weeks',
      isPremium: true
    },
    {
      id: 3,
      name: 'Andreessen Horowitz',
      type: 'VC',
      status: 'available',
      checkSize: '$1M - $25M',
      focus: 'Software, Crypto, Fintech',
      description: 'Technology-focused venture capital firm',
      portfolio: ['Facebook', 'Twitter', 'Coinbase', 'GitHub'],
      requirements: ['Pitch deck', 'Financial model', 'Product demo'],
      responseTime: '1-2 weeks',
      isPremium: true
    }
  ]);

  const [showAddInvestorModal, setShowAddInvestorModal] = useState(false);
  const [showEditRoundModal, setShowEditRoundModal] = useState(false);
  const [newInvestor, setNewInvestor] = useState({
    name: '',
    type: 'VC',
    checkSize: '',
    focus: '',
    description: '',
    requirements: [],
    responseTime: '',
    isPremium: false
  });

  const progressPercentage = Math.round((roundDetails.committedAmount / roundDetails.targetAmount) * 100);

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-700';
      case 'completed':
        return 'bg-blue-100 text-blue-700';
      case 'paused':
        return 'bg-yellow-100 text-yellow-700';
      case 'available':
        return 'bg-gray-100 text-gray-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const renderRoundDetails = () => (
    <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center">
          <Target className="w-5 h-5 text-white" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-gray-900">Round Details</h3>
          <p className="text-gray-600">Current fundraising round information</p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-600 mb-1">Round Type</p>
            <p className="font-semibold text-gray-900">{roundDetails.roundType}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-1">Target Amount</p>
            <p className="font-semibold text-gray-900">${roundDetails.targetAmount.toLocaleString()}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-600 mb-1">Committed</p>
            <p className="font-semibold text-green-600">${roundDetails.committedAmount.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-1">Remaining</p>
            <p className="font-semibold text-gray-900">${roundDetails.remainingAmount.toLocaleString()}</p>
          </div>
        </div>

        <div className="pt-4 border-t border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Lead Investor</span>
            <span className="text-sm text-gray-600">{roundDetails.leadInvestor}</span>
          </div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Angel Investors</span>
            <span className="text-sm text-gray-600">{roundDetails.angelInvestors}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">VC Interest</span>
            <span className="text-sm text-gray-600">{roundDetails.vcInterest}</span>
          </div>
        </div>
      </div>
    </div>
  );

  const renderProgress = () => (
    <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center">
          <TrendingUp className="w-5 h-5 text-white" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-gray-900">Progress</h3>
          <p className="text-gray-600">Fundraising progress tracking</p>
        </div>
      </div>

      <div className="space-y-6">
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Fundraising Progress</span>
            <span className="text-sm font-semibold text-gray-900">{progressPercentage}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className="bg-black h-3 rounded-full transition-all duration-300"
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
        </div>

        <div className="text-center">
          <div className="text-4xl font-bold text-gray-900 mb-1">
            ${roundDetails.committedAmount.toLocaleString()}
          </div>
          <div className="text-sm text-gray-600">
            of ${roundDetails.targetAmount.toLocaleString()} raised
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">{roundDetails.angelInvestors}</div>
            <div className="text-sm text-gray-600">Angel Investors</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">{roundDetails.vcInterest}</div>
            <div className="text-sm text-gray-600">VC Interest</div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderInvestors = () => (
    <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center">
            <Users className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900">Investors</h3>
            <p className="text-gray-600">Track investor engagement and responses</p>
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
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-semibold text-gray-900">{investor.name}</h4>
                  {investor.isPremium && (
                    <span className="px-2 py-1 bg-yellow-100 text-yellow-700 text-xs rounded-full">
                      Premium
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-600 mb-2">{investor.description}</p>
                <div className="flex items-center gap-4 text-xs text-gray-500">
                  <span>{investor.type}</span>
                  <span>•</span>
                  <span>{investor.checkSize}</span>
                  <span>•</span>
                  <span>Response: {investor.responseTime}</span>
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
                {investor.requirements.length} requirements
              </div>
              <div className="flex gap-2">
                <button className="px-3 py-1 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors text-xs font-semibold">
                  Apply
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

  const renderAddInvestorModal = () => (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold text-gray-900">Add Investor</h3>
            <button
              onClick={() => setShowAddInvestorModal(false)}
              className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
            >
              <X className="w-6 h-6 text-gray-500" />
            </button>
          </div>

          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Investor Name</label>
                <input
                  type="text"
                  value={newInvestor.name}
                  onChange={(e) => setNewInvestor(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="e.g., Sequoia Capital"
                  className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
                <select
                  value={newInvestor.type}
                  onChange={(e) => setNewInvestor(prev => ({ ...prev, type: e.target.value }))}
                  className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent"
                >
                  <option value="VC">VC</option>
                  <option value="Accelerator">Accelerator</option>
                  <option value="Angel">Angel</option>
                  <option value="CVC">CVC</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Check Size</label>
                <input
                  type="text"
                  value={newInvestor.checkSize}
                  onChange={(e) => setNewInvestor(prev => ({ ...prev, checkSize: e.target.value }))}
                  placeholder="e.g., $1M - $25M"
                  className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Response Time</label>
                <input
                  type="text"
                  value={newInvestor.responseTime}
                  onChange={(e) => setNewInvestor(prev => ({ ...prev, responseTime: e.target.value }))}
                  placeholder="e.g., 2-3 weeks"
                  className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Focus Areas</label>
              <input
                type="text"
                value={newInvestor.focus}
                onChange={(e) => setNewInvestor(prev => ({ ...prev, focus: e.target.value }))}
                placeholder="e.g., Enterprise Software, AI/ML"
                className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <textarea
                value={newInvestor.description}
                onChange={(e) => setNewInvestor(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Brief description of the investor"
                rows={3}
                className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent resize-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Requirements</label>
              <input
                type="text"
                value={newInvestor.requirements.join(', ')}
                onChange={(e) => setNewInvestor(prev => ({ 
                  ...prev, 
                  requirements: e.target.value.split(',').map(s => s.trim()).filter(s => s)
                }))}
                placeholder="Enter requirements separated by commas"
                className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent"
              />
            </div>

            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="isPremium"
                checked={newInvestor.isPremium}
                onChange={(e) => setNewInvestor(prev => ({ ...prev, isPremium: e.target.checked }))}
                className="w-4 h-4 text-black border-gray-300 rounded focus:ring-black"
              />
              <label htmlFor="isPremium" className="text-sm font-medium text-gray-700">
                Premium Partner
              </label>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowAddInvestorModal(false)}
                className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  const investor = {
                    ...newInvestor,
                    id: Date.now(),
                    status: 'available',
                    portfolio: []
                  };
                  setInvestors(prev => [...prev, investor]);
                  setNewInvestor({
                    name: '',
                    type: 'VC',
                    checkSize: '',
                    focus: '',
                    description: '',
                    requirements: [],
                    responseTime: '',
                    isPremium: false
                  });
                  setShowAddInvestorModal(false);
                }}
                className="flex-1 py-3 bg-black text-white rounded-xl hover:bg-gray-800 transition-colors font-semibold"
              >
                Add Investor
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
              <DollarSign className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Fundraising Tracker</h1>
              <p className="text-gray-600">Track committed $, open $ target, round type</p>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {renderRoundDetails()}
          {renderProgress()}
        </div>

        {/* Investors Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {renderInvestors()}
        </div>

        {/* Add Investor Modal */}
        {showAddInvestorModal && renderAddInvestorModal()}
      </div>
    </div>
  );
};

export default FundraisingTracker;
