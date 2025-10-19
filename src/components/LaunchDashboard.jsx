import React, { useState, useEffect } from 'react';
import { 
  Rocket, Target, CheckCircle, Clock, AlertCircle, 
  BarChart3, TrendingUp, Award, Star, Zap, Users,
  Calendar, FileText, MessageSquare, Video, Plus,
  Edit3, Trash2, Save, Download, Share2, Eye,
  ChevronRight, ChevronDown, ChevronUp, ArrowRight,
  ArrowLeft, ArrowUp, ArrowDown, X, Info, HelpCircle,
  RefreshCw, Mail, Phone, MapPin, Briefcase, 
  GraduationCap, Globe, Building2, DollarSign, Bell
} from 'lucide-react';

const LaunchDashboard = () => {
  const [launchReadiness, setLaunchReadiness] = useState({
    productMVP: { progress: 75, status: 'in-progress', tasks: ['Core features', 'User authentication', 'Payment integration'] },
    legalSetup: { progress: 50, status: 'in-progress', tasks: ['Terms of service', 'Privacy policy', 'Business registration'] },
    marketing: { progress: 25, status: 'pending', tasks: ['Brand identity', 'Website', 'Social media'] }
  });

  const [nextSteps, setNextSteps] = useState([
    {
      id: 1,
      step: 'Complete MVP development',
      status: 'current',
      description: 'Finish core features and user testing',
      dueDate: '2024-02-15',
      assignee: 'Alex Chen',
      priority: 'high'
    },
    {
      id: 2,
      step: 'Beta testing with 100 users',
      status: 'upcoming',
      description: 'Launch beta program and gather feedback',
      dueDate: '2024-03-01',
      assignee: 'Sarah Martinez',
      priority: 'high'
    },
    {
      id: 3,
      step: 'Public launch announcement',
      status: 'upcoming',
      description: 'Official product launch and press release',
      dueDate: '2024-04-01',
      assignee: 'Both',
      priority: 'medium'
    }
  ]);

  const [launchMetrics, setLaunchMetrics] = useState({
    users: 0,
    revenue: 0,
    growth: 0,
    retention: 0
  });

  const [launchEvents, setLaunchEvents] = useState([
    {
      id: 1,
      name: 'Product Hunt Launch',
      date: '2024-03-15',
      status: 'planned',
      description: 'Launch on Product Hunt for maximum visibility',
      requirements: ['Product ready', 'Screenshots', 'Description', 'Maker comment']
    },
    {
      id: 2,
      name: 'TechCrunch Coverage',
      date: '2024-03-20',
      status: 'planned',
      description: 'Pitch to TechCrunch for media coverage',
      requirements: ['Press kit', 'Demo video', 'Founder story', 'Metrics']
    },
    {
      id: 3,
      name: 'Demo Day Presentation',
      date: '2024-04-01',
      status: 'planned',
      description: 'Present at startup demo day event',
      requirements: ['Pitch deck', 'Live demo', 'Q&A prep', 'Follow-up plan']
    }
  ]);

  const getProgressColor = (progress) => {
    if (progress >= 80) return 'bg-green-500';
    if (progress >= 60) return 'bg-blue-500';
    if (progress >= 40) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'current':
        return 'bg-black text-white';
      case 'upcoming':
        return 'bg-gray-200 text-gray-700';
      case 'completed':
        return 'bg-green-100 text-green-700';
      case 'in-progress':
        return 'bg-blue-100 text-blue-700';
      case 'pending':
        return 'bg-yellow-100 text-yellow-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const renderLaunchReadiness = () => (
    <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center">
          <Target className="w-5 h-5 text-white" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-gray-900">Launch Readiness</h3>
          <p className="text-gray-600">Track your progress towards launch</p>
        </div>
      </div>

      <div className="space-y-6">
        {Object.entries(launchReadiness).map(([key, data]) => (
          <div key={key} className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-semibold text-gray-900 capitalize">
                {key.replace(/([A-Z])/g, ' $1').trim()}
              </h4>
              <span className="text-2xl font-bold text-gray-900">{data.progress}%</span>
            </div>
            
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className={`h-3 rounded-full transition-all duration-300 ${getProgressColor(data.progress)}`}
                style={{ width: `${data.progress}%` }}
              ></div>
            </div>

            <div className="flex flex-wrap gap-2">
              {data.tasks.map((task, index) => (
                <span key={index} className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full">
                  {task}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderNextSteps = () => (
    <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center">
          <CheckCircle className="w-5 h-5 text-white" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-gray-900">Next Steps</h3>
          <p className="text-gray-600">Your launch roadmap</p>
        </div>
      </div>

      <div className="space-y-4">
        {nextSteps.map((step, index) => (
          <div key={step.id} className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${getStatusColor(step.status)}`}>
              {index + 1}
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-gray-900 mb-1">{step.step}</h4>
              <p className="text-sm text-gray-600 mb-2">{step.description}</p>
              <div className="flex items-center gap-4 text-xs text-gray-500">
                <span>Due: {step.dueDate}</span>
                <span>•</span>
                <span>Assignee: {step.assignee}</span>
                <span>•</span>
                <span className={`px-2 py-1 rounded-full ${getStatusColor(step.priority)}`}>
                  {step.priority}
                </span>
              </div>
            </div>
            <div className="flex gap-2">
              <button className="p-2 hover:bg-gray-200 rounded-lg transition-colors">
                <Edit3 className="w-4 h-4 text-gray-600" />
              </button>
              <button className="p-2 hover:bg-gray-200 rounded-lg transition-colors">
                <CheckCircle className="w-4 h-4 text-gray-600" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderLaunchEvents = () => (
    <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center">
          <Calendar className="w-5 h-5 text-white" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-gray-900">Launch Events</h3>
          <p className="text-gray-600">Scheduled launch activities</p>
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
                  <span className={`px-2 py-1 rounded-full ${getStatusColor(event.status)}`}>
                    {event.status}
                  </span>
                </div>
              </div>
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
                <button className="px-3 py-1 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors text-xs font-semibold">
                  Prepare
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

  const renderMetrics = () => (
    <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center">
          <BarChart3 className="w-5 h-5 text-white" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-gray-900">Launch Metrics</h3>
          <p className="text-gray-600">Track your launch performance</p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="text-center">
          <div className="text-3xl font-bold text-gray-900 mb-1">{launchMetrics.users}</div>
          <div className="text-sm text-gray-600">Users</div>
        </div>
        <div className="text-center">
          <div className="text-3xl font-bold text-gray-900 mb-1">${launchMetrics.revenue.toLocaleString()}</div>
          <div className="text-sm text-gray-600">Revenue</div>
        </div>
        <div className="text-center">
          <div className="text-3xl font-bold text-gray-900 mb-1">{launchMetrics.growth}%</div>
          <div className="text-sm text-gray-600">Growth</div>
        </div>
        <div className="text-center">
          <div className="text-3xl font-bold text-gray-900 mb-1">{launchMetrics.retention}%</div>
          <div className="text-sm text-gray-600">Retention</div>
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
              <Rocket className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Launch Dashboard</h1>
              <p className="text-gray-600">When teams graduate to public product + funding stage</p>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {renderLaunchReadiness()}
          {renderNextSteps()}
        </div>

        {/* Secondary Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {renderLaunchEvents()}
          {renderMetrics()}
        </div>
      </div>
    </div>
  );
};

export default LaunchDashboard;
