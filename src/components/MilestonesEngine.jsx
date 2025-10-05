import React, { useState, useEffect } from 'react';
import { 
  CheckCircle, Clock, Target, Users, Zap, 
  Calendar, BarChart3, TrendingUp, Award, Star,
  ChevronRight, ChevronDown, ChevronUp, ArrowRight,
  ArrowLeft, ArrowUp, ArrowDown, Plus, Edit3, 
  Trash2, Save, Download, Share2, Eye, X,
  AlertCircle, Info, HelpCircle, RefreshCw
} from 'lucide-react';

const MilestonesEngine = () => {
  const [currentSprint, setCurrentSprint] = useState(1);
  const [sprints, setSprints] = useState([
    {
      id: 1,
      title: "Sprint 1: Foundation & Alignment",
      status: "active",
      daysRemaining: 12,
      tasks: {
        alignment: [
          { id: 1, title: "Define vision & values", status: "completed", assignee: "Alex Chen" },
          { id: 2, title: "Set communication norms", status: "completed", assignee: "Sarah Martinez" },
          { id: 3, title: "Create working agreement", status: "in-progress", assignee: "Both" }
        ],
        validation: [
          { id: 4, title: "Customer interviews (5)", status: "completed", assignee: "Sarah Martinez" },
          { id: 5, title: "Market research", status: "in-progress", assignee: "Alex Chen" },
          { id: 6, title: "Competitor analysis", status: "pending", assignee: "Sarah Martinez" }
        ],
        prototype: [
          { id: 7, title: "Wireframes", status: "pending", assignee: "Alex Chen" },
          { id: 8, title: "MVP features", status: "pending", assignee: "Both" },
          { id: 9, title: "Technical architecture", status: "pending", assignee: "Alex Chen" }
        ]
      }
    },
    {
      id: 2,
      title: "Sprint 2: MVP Development",
      status: "upcoming",
      daysRemaining: 30,
      tasks: {
        development: [
          { id: 10, title: "Build core features", status: "pending", assignee: "Alex Chen" },
          { id: 11, title: "User testing", status: "pending", assignee: "Sarah Martinez" },
          { id: 12, title: "Iterate based on feedback", status: "pending", assignee: "Both" }
        ]
      }
    },
    {
      id: 3,
      title: "Sprint 3: Pitch Readiness",
      status: "upcoming",
      daysRemaining: 60,
      tasks: {
        pitch: [
          { id: 13, title: "Pitch deck creation", status: "pending", assignee: "Sarah Martinez" },
          { id: 14, title: "Financial projections", status: "pending", assignee: "Both" },
          { id: 15, title: "Investor outreach", status: "pending", assignee: "Sarah Martinez" }
        ]
      }
    }
  ]);

  const [showTaskModal, setShowTaskModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    category: 'alignment',
    assignee: '',
    dueDate: '',
    priority: 'medium'
  });

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'in-progress':
        return <Clock className="w-4 h-4 text-blue-500" />;
      case 'pending':
        return <Clock className="w-4 h-4 text-gray-400" />;
      default:
        return <Clock className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'text-green-600 bg-green-50';
      case 'in-progress':
        return 'text-blue-600 bg-blue-50';
      case 'pending':
        return 'text-gray-600 bg-gray-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  const updateTaskStatus = (sprintId, taskId, newStatus) => {
    setSprints(prev => prev.map(sprint => {
      if (sprint.id === sprintId) {
        const updatedTasks = { ...sprint.tasks };
        Object.keys(updatedTasks).forEach(category => {
          updatedTasks[category] = updatedTasks[category].map(task => 
            task.id === taskId ? { ...task, status: newStatus } : task
          );
        });
        return { ...sprint, tasks: updatedTasks };
      }
      return sprint;
    }));
  };

  const addTask = () => {
    if (newTask.title.trim()) {
      const task = {
        id: Date.now(),
        title: newTask.title,
        description: newTask.description,
        status: 'pending',
        assignee: newTask.assignee,
        dueDate: newTask.dueDate,
        priority: newTask.priority
      };

      setSprints(prev => prev.map(sprint => {
        if (sprint.id === currentSprint) {
          const updatedTasks = { ...sprint.tasks };
          if (!updatedTasks[newTask.category]) {
            updatedTasks[newTask.category] = [];
          }
          updatedTasks[newTask.category] = [...updatedTasks[newTask.category], task];
          return { ...sprint, tasks: updatedTasks };
        }
        return sprint;
      }));

      setNewTask({
        title: '',
        description: '',
        category: 'alignment',
        assignee: '',
        dueDate: '',
        priority: 'medium'
      });
      setShowTaskModal(false);
    }
  };

  const renderCurrentSprint = () => {
    const sprint = sprints.find(s => s.id === currentSprint);
    if (!sprint) return null;

    return (
      <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900">Current Sprint</h3>
              <p className="text-gray-600">{sprint.title}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500">Days Remaining</p>
            <p className="text-3xl font-bold text-gray-900">{sprint.daysRemaining}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Alignment Column */}
          <div className="space-y-4">
            <h4 className="font-semibold text-gray-900 flex items-center gap-2">
              <Target className="w-5 h-5 text-black" />
              Alignment
            </h4>
            <div className="space-y-3">
              {sprint.tasks.alignment?.map(task => (
                <div key={task.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                  {getStatusIcon(task.status)}
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{task.title}</p>
                    <p className="text-xs text-gray-500">{task.assignee}</p>
                  </div>
                  <button
                    onClick={() => updateTaskStatus(sprint.id, task.id, 
                      task.status === 'completed' ? 'pending' : 'completed'
                    )}
                    className={`px-2 py-1 text-xs rounded-full transition-colors ${getStatusColor(task.status)}`}
                  >
                    {task.status === 'completed' ? 'Completed' : 
                     task.status === 'in-progress' ? 'In Progress' : 'Pending'}
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Validation Column */}
          <div className="space-y-4">
            <h4 className="font-semibold text-gray-900 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-black" />
              Validation
            </h4>
            <div className="space-y-3">
              {sprint.tasks.validation?.map(task => (
                <div key={task.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                  {getStatusIcon(task.status)}
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{task.title}</p>
                    <p className="text-xs text-gray-500">{task.assignee}</p>
                  </div>
                  <button
                    onClick={() => updateTaskStatus(sprint.id, task.id, 
                      task.status === 'completed' ? 'pending' : 'completed'
                    )}
                    className={`px-2 py-1 text-xs rounded-full transition-colors ${getStatusColor(task.status)}`}
                  >
                    {task.status === 'completed' ? 'Completed' : 
                     task.status === 'in-progress' ? 'In Progress' : 'Pending'}
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Prototype Column */}
          <div className="space-y-4">
            <h4 className="font-semibold text-gray-900 flex items-center gap-2">
              <Code className="w-5 h-5 text-black" />
              Prototype
            </h4>
            <div className="space-y-3">
              {sprint.tasks.prototype?.map(task => (
                <div key={task.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                  {getStatusIcon(task.status)}
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{task.title}</p>
                    <p className="text-xs text-gray-500">{task.assignee}</p>
                  </div>
                  <button
                    onClick={() => updateTaskStatus(sprint.id, task.id, 
                      task.status === 'completed' ? 'pending' : 'completed'
                    )}
                    className={`px-2 py-1 text-xs rounded-full transition-colors ${getStatusColor(task.status)}`}
                  >
                    {task.status === 'completed' ? 'Completed' : 
                     task.status === 'in-progress' ? 'In Progress' : 'Pending'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-gray-200">
          <button
            onClick={() => setShowTaskModal(true)}
            className="w-full py-3 bg-black text-white rounded-xl hover:bg-gray-800 transition-colors font-semibold flex items-center justify-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Add New Task
          </button>
        </div>
      </div>
    );
  };

  const renderUpcomingSprints = () => {
    const upcomingSprints = sprints.filter(s => s.id > currentSprint);

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {upcomingSprints.map(sprint => (
          <div key={sprint.id} className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 bg-gray-100 rounded-xl flex items-center justify-center">
                <Clock className="w-4 h-4 text-gray-600" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900">{sprint.title}</h4>
                <p className="text-sm text-gray-500">{sprint.daysRemaining} days</p>
              </div>
            </div>

            <div className="space-y-3">
              {Object.entries(sprint.tasks).map(([category, tasks]) => (
                <div key={category}>
                  <h5 className="text-sm font-medium text-gray-700 mb-2 capitalize">{category}</h5>
                  <div className="space-y-2">
                    {tasks.map(task => (
                      <div key={task.id} className="flex items-center gap-2 text-sm text-gray-600">
                        <Clock className="w-3 h-3 text-gray-400" />
                        <span>{task.title}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderTaskModal = () => (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl max-w-md w-full p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-900">Add New Task</h3>
          <button
            onClick={() => setShowTaskModal(false)}
            className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Task Title</label>
            <input
              type="text"
              value={newTask.title}
              onChange={(e) => setNewTask(prev => ({ ...prev, title: e.target.value }))}
              placeholder="Enter task title..."
              className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
            <textarea
              value={newTask.description}
              onChange={(e) => setNewTask(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Enter task description..."
              rows={3}
              className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
              <select
                value={newTask.category}
                onChange={(e) => setNewTask(prev => ({ ...prev, category: e.target.value }))}
                className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent"
              >
                <option value="alignment">Alignment</option>
                <option value="validation">Validation</option>
                <option value="prototype">Prototype</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Assignee</label>
              <select
                value={newTask.assignee}
                onChange={(e) => setNewTask(prev => ({ ...prev, assignee: e.target.value }))}
                className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent"
              >
                <option value="">Select assignee</option>
                <option value="Alex Chen">Alex Chen</option>
                <option value="Sarah Martinez">Sarah Martinez</option>
                <option value="Both">Both</option>
              </select>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setShowTaskModal(false)}
              className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors font-semibold"
            >
              Cancel
            </button>
            <button
              onClick={addTask}
              className="flex-1 py-3 bg-black text-white rounded-xl hover:bg-gray-800 transition-colors font-semibold"
            >
              Add Task
            </button>
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
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-black rounded-xl flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Milestones Engine</h1>
              <p className="text-gray-600">30-day sprints: Alignment → Validation → Prototype → Pitch</p>
            </div>
          </div>
        </div>

        {/* Current Sprint */}
        {renderCurrentSprint()}

        {/* Upcoming Sprints */}
        <div className="mt-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Upcoming Sprints</h2>
          {renderUpcomingSprints()}
        </div>

        {/* Task Modal */}
        {showTaskModal && renderTaskModal()}
      </div>
    </div>
  );
};

export default MilestonesEngine;
