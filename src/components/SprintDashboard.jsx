import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Zap, Target, CheckCircle, Clock, TrendingUp, Users,
  Lightbulb, Rocket, Calendar, ArrowRight, Plus,
  BarChart3, FileText, MessageSquare, AlertCircle
} from 'lucide-react';

const SprintDashboard = () => {
  const [sprintData, setSprintData] = useState({
    daysRemaining: 45,
    progress: 35,
    phase: 'Validation',
    tasks: {
      completed: 8,
      total: 24
    }
  });

  const [ideaSprintDetails, setIdeaSprintDetails] = useState(null);

  useEffect(() => {
    // Load sprint details from localStorage
    const savedDetails = localStorage.getItem('ideaSprintDetails');
    if (savedDetails) {
      setIdeaSprintDetails(JSON.parse(savedDetails));
    }
  }, []);

  const sprintPhases = [
    {
      id: 1,
      name: 'Validate',
      status: 'in-progress',
      progress: 60,
      tasks: ['Market Research', 'Customer Interviews', 'Problem Validation'],
      icon: Target
    },
    {
      id: 2,
      name: 'Build',
      status: 'pending',
      progress: 0,
      tasks: ['MVP Design', 'Core Features', 'Technical Setup'],
      icon: Rocket
    },
    {
      id: 3,
      name: 'Test',
      status: 'pending',
      progress: 0,
      tasks: ['Beta Testing', 'User Feedback', 'Iterations'],
      icon: CheckCircle
    },
    {
      id: 4,
      name: 'Find Cofounder',
      status: 'pending',
      progress: 0,
      tasks: ['Profile Matching', 'Pitch Meetings', 'Team Formation'],
      icon: Users
    }
  ];

  const quickActions = [
    {
      title: 'Update Your Idea',
      description: 'Refine your startup concept',
      icon: Lightbulb,
      link: '/startup-workspace',
      color: 'bg-black'
    },
    {
      title: 'Find Sprint Cofounders',
      description: 'Connect with builders ready to sprint',
      icon: Users,
      link: '/cofounders',
      color: 'bg-gray-900'
    },
    {
      title: 'Build MVP',
      description: 'Start building your product',
      icon: Rocket,
      link: '/startup-workspace',
      color: 'bg-gray-800'
    },
    {
      title: 'Track Progress',
      description: 'View your sprint milestones',
      icon: BarChart3,
      link: '/startup-workspace',
      color: 'bg-gray-700'
    }
  ];

  const upcomingTasks = [
    {
      id: 1,
      title: 'Complete Customer Interviews',
      description: 'Talk to 10 potential customers',
      dueDate: '3 days',
      priority: 'high',
      status: 'in-progress'
    },
    {
      id: 2,
      title: 'Finalize Market Analysis',
      description: 'Document market size and competitors',
      dueDate: '5 days',
      priority: 'high',
      status: 'pending'
    },
    {
      id: 3,
      title: 'Create MVP Wireframes',
      description: 'Design basic app flow',
      dueDate: '1 week',
      priority: 'medium',
      status: 'pending'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Your Idea Sprint</h1>
              <p className="text-gray-600">
                {ideaSprintDetails?.ideaDescription || 'Build, validate, and find your cofounder'}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm text-gray-500">Sprint Progress</p>
                <p className="text-2xl font-bold text-gray-900">{sprintData.progress}%</p>
              </div>
              <div className="w-12 h-12 bg-black rounded-xl flex items-center justify-center">
                <Zap className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Sprint Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 bg-gray-900 rounded-xl flex items-center justify-center">
                <Calendar className="w-5 h-5 text-white" />
              </div>
              <span className="text-2xl font-bold text-gray-900">{sprintData.daysRemaining}</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-1">Days Left</h3>
            <p className="text-gray-600 text-sm">In your sprint</p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 bg-gray-900 rounded-xl flex items-center justify-center">
                <Target className="w-5 h-5 text-white" />
              </div>
              <span className="text-2xl font-bold text-gray-900">{sprintData.phase}</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-1">Current Phase</h3>
            <p className="text-gray-600 text-sm">Validation stage</p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 bg-gray-900 rounded-xl flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-white" />
              </div>
              <span className="text-2xl font-bold text-gray-900">{sprintData.tasks.completed}/{sprintData.tasks.total}</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-1">Tasks Done</h3>
            <p className="text-gray-600 text-sm">Sprint progress</p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 bg-gray-900 rounded-xl flex items-center justify-center">
                <Users className="w-5 h-5 text-white" />
              </div>
              <span className="text-2xl font-bold text-gray-900">0</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-1">Sprint Partners</h3>
            <p className="text-gray-600 text-sm">Active cofounders</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Sprint Phases */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Sprint Phases</h2>
              <div className="space-y-4">
                {sprintPhases.map((phase, index) => {
                  const Icon = phase.icon;
                  return (
                    <div key={phase.id} className="relative">
                      {index < sprintPhases.length - 1 && (
                        <div className="absolute left-5 top-12 w-0.5 h-full bg-gray-200" />
                      )}
                      <div className="flex items-start gap-4">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                          phase.status === 'in-progress' ? 'bg-gray-900' :
                          phase.status === 'completed' ? 'bg-green-500' :
                          'bg-gray-200'
                        }`}>
                          <Icon className={`w-5 h-5 ${
                            phase.status === 'pending' ? 'text-gray-500' : 'text-white'
                          }`} />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="font-semibold text-gray-900">{phase.name}</h3>
                            <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                              phase.status === 'in-progress' ? 'bg-gray-100 text-gray-700' :
                              phase.status === 'completed' ? 'bg-green-100 text-green-700' :
                              'bg-gray-100 text-gray-500'
                            }`}>
                              {phase.status === 'in-progress' ? 'In Progress' :
                               phase.status === 'completed' ? 'Completed' : 'Pending'}
                            </span>
                          </div>
                          {phase.status !== 'pending' && (
                            <>
                              <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                                <div
                                  className="bg-gray-900 h-2 rounded-full transition-all duration-300"
                                  style={{ width: `${phase.progress}%` }}
                                />
                              </div>
                              <p className="text-sm text-gray-600 mb-2">{phase.progress}% complete</p>
                            </>
                          )}
                          <div className="flex flex-wrap gap-2">
                            {phase.tasks.map((task, idx) => (
                              <span key={idx} className="text-xs px-2 py-1 bg-gray-50 text-gray-600 rounded-full">
                                {task}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Upcoming Tasks */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Upcoming Tasks</h2>
                <button className="px-4 py-2 bg-black text-white rounded-xl hover:bg-gray-800 transition-colors text-sm font-semibold flex items-center gap-2">
                  <Plus className="w-4 h-4" />
                  Add Task
                </button>
              </div>
              <div className="space-y-3">
                {upcomingTasks.map(task => (
                  <div key={task.id} className="p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold text-gray-900">{task.title}</h3>
                      <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                        task.priority === 'high' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
                      }`}>
                        {task.priority}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{task.description}</p>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <Clock className="w-3 h-3" />
                      Due in {task.dueDate}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="space-y-6">
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

            {/* Sprint Resources */}
            <div className="bg-gray-900 rounded-2xl p-6 text-white">
              <h3 className="text-lg font-bold mb-3">Need Help?</h3>
              <p className="text-gray-300 text-sm mb-4">
                Access sprint guides, templates, and resources to accelerate your journey.
              </p>
              <button className="w-full py-2 bg-white text-gray-900 rounded-xl hover:bg-gray-100 transition-colors font-semibold">
                View Resources
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SprintDashboard;

