import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles, Target, CheckCircle, Clock, TrendingUp, Users,
  Briefcase, DollarSign, Calendar, ArrowRight, Plus,
  BarChart3, FileText, MessageSquare, Star, Package
} from 'lucide-react';

const SkillsDashboard = () => {
  const [skillsData, setSkillsData] = useState({
    activeProjects: 2,
    totalEarnings: '$12,400',
    hoursThisMonth: 64,
    clientSatisfaction: 4.8
  });

  const [offerDetails, setOfferDetails] = useState(null);

  useEffect(() => {
    const saved = localStorage.getItem('offerSkillsDetails');
    if (saved) {
      setOfferDetails(JSON.parse(saved));
    }
  }, []);

  const quickActions = [
    {
      title: 'Skills Showcase',
      description: 'Build your portfolio',
      icon: Star,
      link: '/skills/showcase',
      color: 'bg-black'
    },
    {
      title: 'Service Packages',
      description: 'Define your offerings',
      icon: Package,
      link: '/skills/packages',
      color: 'bg-gray-900'
    },
    {
      title: 'Project Tracker',
      description: 'Manage your work',
      icon: Briefcase,
      link: '/skills/projects',
      color: 'bg-gray-800'
    },
    {
      title: 'Client Management',
      description: 'Track your clients',
      icon: Users,
      link: '/skills/clients',
      color: 'bg-gray-700'
    },
    {
      title: 'Availability & Rates',
      description: 'Set your schedule',
      icon: Calendar,
      link: '/skills/availability',
      color: 'bg-gray-600'
    },
    {
      title: 'Find Startups',
      description: 'Browse opportunities',
      icon: Target,
      link: '/cofounders',
      color: 'bg-gray-900'
    }
  ];

  const activeProjects = [
    {
      id: 1,
      client: 'TechStartup AI',
      project: 'MVP Development',
      status: 'in-progress',
      progress: 65,
      dueDate: '5 days',
      value: '$4,500'
    },
    {
      id: 2,
      client: 'FinanceApp Co',
      project: 'UI/UX Design',
      status: 'in-progress',
      progress: 40,
      dueDate: '12 days',
      value: '$3,200'
    }
  ];

  const upcomingOpportunities = [
    {
      id: 1,
      startup: 'HealthTech Startup',
      need: 'Backend Developer',
      budget: '$5,000',
      timeline: '2 months',
      match: 92
    },
    {
      id: 2,
      startup: 'E-commerce Platform',
      need: 'Marketing Strategy',
      budget: '$3,500',
      timeline: '1 month',
      match: 88
    },
    {
      id: 3,
      startup: 'SaaS Startup',
      need: 'Product Manager',
      budget: '$6,000',
      timeline: '3 months',
      match: 85
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Skills Dashboard</h1>
              <p className="text-gray-600">
                {offerDetails?.workType?.join(', ') || 'Manage your services and connect with startups'}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm text-gray-500">This Month</p>
                <p className="text-2xl font-bold text-gray-900">{skillsData.totalEarnings}</p>
              </div>
              <div className="w-12 h-12 bg-black rounded-xl flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 bg-gray-900 rounded-xl flex items-center justify-center">
                <Briefcase className="w-5 h-5 text-white" />
              </div>
              <span className="text-2xl font-bold text-gray-900">{skillsData.activeProjects}</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-1">Active Projects</h3>
            <p className="text-gray-600 text-sm">Currently working on</p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 bg-gray-900 rounded-xl flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-white" />
              </div>
              <span className="text-2xl font-bold text-gray-900">{skillsData.totalEarnings}</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-1">Total Earnings</h3>
            <p className="text-gray-600 text-sm">This month</p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 bg-gray-900 rounded-xl flex items-center justify-center">
                <Clock className="w-5 h-5 text-white" />
              </div>
              <span className="text-2xl font-bold text-gray-900">{skillsData.hoursThisMonth}</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-1">Hours Worked</h3>
            <p className="text-gray-600 text-sm">This month</p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 bg-gray-900 rounded-xl flex items-center justify-center">
                <Star className="w-5 h-5 text-white" />
              </div>
              <span className="text-2xl font-bold text-gray-900">{skillsData.clientSatisfaction}</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-1">Satisfaction</h3>
            <p className="text-gray-600 text-sm">Client rating</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Active Projects */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-900 rounded-xl flex items-center justify-center">
                    <Briefcase className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">Active Projects</h2>
                    <p className="text-sm text-gray-600">Current work in progress</p>
                  </div>
                </div>
                <button className="px-4 py-2 bg-black text-white rounded-xl hover:bg-gray-800 transition-colors text-sm font-semibold flex items-center gap-2">
                  <Plus className="w-4 h-4" />
                  New
                </button>
              </div>

              <div className="space-y-4">
                {activeProjects.map(project => (
                  <div key={project.id} className="p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-semibold text-gray-900">{project.project}</h3>
                        <p className="text-sm text-gray-600">{project.client}</p>
                      </div>
                      <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full">
                        {project.status}
                      </span>
                    </div>
                    
                    <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
                      <div
                        className="bg-gray-900 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${project.progress}%` }}
                      />
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-4">
                        <span className="text-gray-600 flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          Due in {project.dueDate}
                        </span>
                        <span className="text-gray-900 font-semibold">{project.progress}% complete</span>
                      </div>
                      <span className="text-gray-900 font-bold">{project.value}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Opportunities */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-900 rounded-xl flex items-center justify-center">
                    <Target className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">Opportunities for You</h2>
                    <p className="text-sm text-gray-600">Startups looking for your skills</p>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                {upcomingOpportunities.map(opp => (
                  <div key={opp.id} className="p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-semibold text-gray-900">{opp.startup}</h3>
                        <p className="text-sm text-gray-600">{opp.need}</p>
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                        <span className="text-sm font-semibold text-gray-900">{opp.match}%</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <span className="flex items-center gap-1">
                        <DollarSign className="w-4 h-4" />
                        {opp.budget}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {opp.timeline}
                      </span>
                    </div>
                    <button className="mt-3 w-full py-2 bg-gray-900 text-white rounded-lg hover:bg-black transition-colors text-sm font-semibold">
                      View Details
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Quick Actions</h2>
              <div className="space-y-3">
                {quickActions.map((action, index) => {
                  const Icon = action.icon;
                  return (
                    <Link
                      key={index}
                      to={action.link}
                      className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-all group"
                    >
                      <div className={`w-10 h-10 ${action.color} rounded-xl flex items-center justify-center`}>
                        <Icon className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 group-hover:text-black transition-colors">
                          {action.title}
                        </h3>
                        <p className="text-xs text-gray-600">{action.description}</p>
                      </div>
                      <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-gray-900 transition-colors" />
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Profile Completion */}
            <div className="bg-gray-900 rounded-2xl p-6 text-white">
              <h3 className="text-lg font-bold mb-3">Complete Your Profile</h3>
              <div className="w-full bg-gray-700 rounded-full h-2 mb-4">
                <div className="bg-white h-2 rounded-full" style={{ width: '70%' }} />
              </div>
              <p className="text-gray-300 text-sm mb-4">
                70% complete. Add more details to attract better clients.
              </p>
              <button className="w-full py-2 bg-white text-gray-900 rounded-xl hover:bg-gray-100 transition-colors font-semibold">
                Update Profile
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SkillsDashboard;

