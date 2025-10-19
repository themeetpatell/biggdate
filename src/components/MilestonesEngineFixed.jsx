import React, { useState, useEffect } from 'react';
import { 
  CheckCircle, Clock, Target, Users, Zap, 
  Calendar, BarChart3, TrendingUp, Award, Star,
  ChevronRight, ChevronDown, ChevronUp, ArrowRight,
  ArrowLeft, ArrowUp, ArrowDown, Plus, Edit3, 
  Trash2, Save, Download, Share2, Eye, X,
  AlertCircle, Info, HelpCircle, RefreshCw,
  Code, Rocket, DollarSign
} from 'lucide-react';

const MilestonesEngineFixed = () => {
  const [currentSprint, setCurrentSprint] = useState(1);
  const [sprints, setSprints] = useState([
    {
      id: 1,
      title: "Sprint 1: Foundation & Alignment",
      status: "active",
      daysRemaining: 12,
      startDate: "2024-01-15",
      endDate: "2024-02-15",
      progress: 65,
      tasks: {
        alignment: [
          { id: 1, title: "Define vision & values", status: "completed", assignee: "Alex Chen", priority: "high" },
          { id: 2, title: "Set communication norms", status: "completed", assignee: "Sarah Martinez", priority: "medium" },
          { id: 3, title: "Create working agreement", status: "in-progress", assignee: "Both", priority: "high" }
        ],
        validation: [
          { id: 4, title: "Customer interviews (5)", status: "completed", assignee: "Sarah Martinez", priority: "high" },
          { id: 5, title: "Market research", status: "in-progress", assignee: "Alex Chen", priority: "medium" },
          { id: 6, title: "Competitor analysis", status: "pending", assignee: "Sarah Martinez", priority: "medium" }
        ],
        prototype: [
          { id: 7, title: "Wireframes", status: "pending", assignee: "Alex Chen", priority: "high" },
          { id: 8, title: "MVP features", status: "pending", assignee: "Both", priority: "high" },
          { id: 9, title: "Technical architecture", status: "pending", assignee: "Alex Chen", priority: "medium" }
        ]
      }
    },
    {
      id: 2,
      title: "Sprint 2: MVP Development",
      status: "upcoming",
      daysRemaining: 30,
      startDate: "2024-02-15",
      endDate: "2024-03-15",
      progress: 0,
      tasks: {
        development: [
          { id: 10, title: "Build core features", status: "pending", assignee: "Alex Chen", priority: "high" },
          { id: 11, title: "User testing", status: "pending", assignee: "Sarah Martinez", priority: "medium" },
          { id: 12, title: "Iterate based on feedback", status: "pending", assignee: "Both", priority: "high" }
        ],
        launch: [
          { id: 13, title: "Beta launch preparation", status: "pending", assignee: "Both", priority: "high" },
          { id: 14, title: "Marketing materials", status: "pending", assignee: "Sarah Martinez", priority: "medium" },
          { id: 15, title: "User onboarding flow", status: "pending", assignee: "Alex Chen", priority: "high" }
        ]
      }
    },
    {
      id: 3,
      title: "Sprint 3: Growth & Scale",
      status: "upcoming",
      daysRemaining: 45,
      startDate: "2024-03-15",
      endDate: "2024-04-30",
      progress: 0,
      tasks: {
        growth: [
          { id: 16, title: "User acquisition strategy", status: "pending", assignee: "Sarah Martinez", priority: "high" },
          { id: 17, title: "Performance optimization", status: "pending", assignee: "Alex Chen", priority: "medium" },
          { id: 18, title: "Analytics implementation", status: "pending", assignee: "Alex Chen", priority: "medium" }
        ],
        fundraising: [
          { id: 19, title: "Pitch deck preparation", status: "pending", assignee: "Both", priority: "high" },
          { id: 20, title: "Financial projections", status: "pending", assignee: "Sarah Martinez", priority: "high" },
          { id: 21, title: "Investor outreach", status: "pending", assignee: "Both", priority: "medium" }
        ]
      }
    }
  ]);

  const [showAddTask, setShowAddTask] = useState(false);
  const [newTask, setNewTask] = useState({
    title: '',
    assignee: '',
    priority: 'medium',
    category: 'alignment'
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'in-progress': return 'bg-blue-100 text-blue-800';
      case 'pending': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getSprintStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-blue-100 text-blue-800';
      case 'upcoming': return 'bg-gray-100 text-gray-800';
      case 'completed': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleTaskStatusChange = (sprintId, category, taskId, newStatus) => {
    setSprints(sprints.map(sprint => {
      if (sprint.id === sprintId) {
        return {
          ...sprint,
          tasks: {
            ...sprint.tasks,
            [category]: sprint.tasks[category].map(task =>
              task.id === taskId ? { ...task, status: newStatus } : task
            )
          }
        };
      }
      return sprint;
    }));
  };

  const handleAddTask = () => {
    if (newTask.title.trim()) {
      const currentSprintData = sprints.find(s => s.id === currentSprint);
      if (currentSprintData && currentSprintData.tasks[newTask.category]) {
        const newTaskId = Date.now();
        const task = {
          id: newTaskId,
          title: newTask.title,
          status: 'pending',
          assignee: newTask.assignee,
          priority: newTask.priority
        };

        setSprints(sprints.map(sprint => {
          if (sprint.id === currentSprint) {
            return {
              ...sprint,
              tasks: {
                ...sprint.tasks,
                [newTask.category]: [...sprint.tasks[newTask.category], task]
              }
            };
          }
          return sprint;
        }));

        setNewTask({
          title: '',
          assignee: '',
          priority: 'medium',
          category: 'alignment'
        });
        setShowAddTask(false);
      }
    }
  };

  const getCategoryTitle = (category) => {
    switch (category) {
      case 'alignment': return 'Team Alignment';
      case 'validation': return 'Market Validation';
      case 'prototype': return 'Prototype Development';
      case 'development': return 'Product Development';
      case 'launch': return 'Launch Preparation';
      case 'growth': return 'Growth Strategy';
      case 'fundraising': return 'Fundraising';
      default: return category;
    }
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'alignment': return <Users className="w-4 h-4" />;
      case 'validation': return <Target className="w-4 h-4" />;
      case 'prototype': return <Zap className="w-4 h-4" />;
      case 'development': return <Code className="w-4 h-4" />;
      case 'launch': return <Rocket className="w-4 h-4" />;
      case 'growth': return <TrendingUp className="w-4 h-4" />;
      case 'fundraising': return <DollarSign className="w-4 h-4" />;
      default: return <Target className="w-4 h-4" />;
    }
  };

  const currentSprintData = sprints.find(s => s.id === currentSprint);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Milestones Engine</h1>
              <p className="text-gray-600 mt-2">Track your 30-day sprints and milestone progress</p>
            </div>
            <button
              onClick={() => setShowAddTask(true)}
              className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-xl hover:bg-gray-800 transition-colors"
            >
              <Plus className="w-5 h-5" />
              Add Task
            </button>
          </div>

          {/* Sprint Selector */}
          <div className="flex gap-4 mb-6">
            {sprints.map((sprint) => (
              <button
                key={sprint.id}
                onClick={() => setCurrentSprint(sprint.id)}
                className={`px-6 py-3 rounded-xl font-medium transition-colors ${
                  currentSprint === sprint.id
                    ? 'bg-black text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                <div className="text-left">
                  <div className="font-semibold">{sprint.title}</div>
                  <div className="text-sm opacity-75">
                    {sprint.daysRemaining} days remaining
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Current Sprint Overview */}
        {currentSprintData && (
          <div className="mb-8">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{currentSprintData.title}</h2>
                  <p className="text-gray-600">
                    {currentSprintData.startDate} - {currentSprintData.endDate}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getSprintStatusColor(currentSprintData.status)}`}>
                    {currentSprintData.status}
                  </span>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-gray-900">{currentSprintData.progress}%</div>
                    <div className="text-sm text-gray-500">Complete</div>
                  </div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
                <div 
                  className="bg-black h-3 rounded-full transition-all duration-300"
                  style={{ width: `${currentSprintData.progress}%` }}
                ></div>
              </div>

              <div className="flex items-center justify-between text-sm text-gray-600">
                <span>{currentSprintData.daysRemaining} days remaining</span>
                <span>Started {currentSprintData.startDate}</span>
              </div>
            </div>
          </div>
        )}

        {/* Tasks by Category */}
        {currentSprintData && (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {Object.entries(currentSprintData.tasks).map(([category, tasks]) => (
              <div key={category} className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100">
                  <div className="flex items-center gap-3 mb-4">
                    {getCategoryIcon(category)}
                    <h3 className="text-lg font-semibold text-gray-900">{getCategoryTitle(category)}</h3>
                  </div>
                  <div className="text-sm text-gray-600">
                    {tasks.filter(t => t.status === 'completed').length} of {tasks.length} completed
                  </div>
                </div>

                <div className="p-6">
                  <div className="space-y-3">
                    {tasks.map((task) => (
                      <div key={task.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3 flex-1">
                          <button
                            onClick={() => {
                              const newStatus = task.status === 'completed' ? 'pending' : 'completed';
                              handleTaskStatusChange(currentSprint, category, task.id, newStatus);
                            }}
                            className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                              task.status === 'completed' 
                                ? 'bg-green-500 border-green-500 text-white' 
                                : 'border-gray-300 hover:border-green-500'
                            }`}
                          >
                            {task.status === 'completed' && <CheckCircle className="w-3 h-3" />}
                          </button>
                          <div className="flex-1">
                            <p className="font-medium text-gray-900 text-sm">{task.title}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-xs text-gray-500">{task.assignee}</span>
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}>
                                {task.priority}
                              </span>
                            </div>
                          </div>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(task.status)}`}>
                          {task.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Add Task Modal */}
        {showAddTask && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl p-6 w-full max-w-md">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Add New Task</h2>
                <button
                  onClick={() => setShowAddTask(false)}
                  className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Task Title</label>
                  <input
                    type="text"
                    value={newTask.title}
                    onChange={(e) => setNewTask({...newTask, title: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                    placeholder="Enter task title"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Assignee</label>
                  <input
                    type="text"
                    value={newTask.assignee}
                    onChange={(e) => setNewTask({...newTask, assignee: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                    placeholder="Enter assignee name"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
                    <select
                      value={newTask.priority}
                      onChange={(e) => setNewTask({...newTask, priority: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                    <select
                      value={newTask.category}
                      onChange={(e) => setNewTask({...newTask, category: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                    >
                      <option value="alignment">Team Alignment</option>
                      <option value="validation">Market Validation</option>
                      <option value="prototype">Prototype Development</option>
                      <option value="development">Product Development</option>
                      <option value="launch">Launch Preparation</option>
                      <option value="growth">Growth Strategy</option>
                      <option value="fundraising">Fundraising</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={handleAddTask}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  Add Task
                </button>
                <button
                  onClick={() => setShowAddTask(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MilestonesEngineFixed;
