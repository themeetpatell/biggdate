import React, { useState, useEffect } from 'react';
import { 
  Plus, Edit3, Trash2, Save, CheckCircle, Clock, AlertCircle, 
  Users, Calendar, Target, BarChart3, TrendingUp, Star,
  ChevronRight, ChevronDown, ChevronUp, ArrowRight, 
  ArrowLeft, ArrowUp, ArrowDown, X, Eye, Download, Share2
} from 'lucide-react';

const ProjectBoardFixed = () => {
  const [projects, setProjects] = useState([
    {
      id: 1,
      name: 'TechFlow AI MVP',
      description: 'Building the core AI-powered workflow automation platform',
      status: 'in-progress',
      priority: 'high',
      startDate: '2024-01-15',
      dueDate: '2024-03-15',
      progress: 65,
      assignee: 'Alex Chen',
      tags: ['AI', 'MVP', 'Core Features'],
      milestones: [
        { id: 1, title: 'User Authentication', status: 'completed', progress: 100 },
        { id: 2, title: 'AI Integration', status: 'in-progress', progress: 75 },
        { id: 3, title: 'Workflow Builder', status: 'pending', progress: 0 },
        { id: 4, title: 'Analytics Dashboard', status: 'pending', progress: 0 }
      ]
    },
    {
      id: 2,
      name: 'Marketing Website',
      description: 'Creating a compelling website to showcase our platform',
      status: 'planning',
      priority: 'medium',
      startDate: '2024-02-01',
      dueDate: '2024-02-28',
      progress: 20,
      assignee: 'Sarah Martinez',
      tags: ['Marketing', 'Website', 'Branding'],
      milestones: [
        { id: 5, title: 'Design Mockups', status: 'completed', progress: 100 },
        { id: 6, title: 'Content Creation', status: 'in-progress', progress: 40 },
        { id: 7, title: 'Development', status: 'pending', progress: 0 },
        { id: 8, title: 'SEO Optimization', status: 'pending', progress: 0 }
      ]
    },
    {
      id: 3,
      name: 'Fundraising Preparation',
      description: 'Preparing materials and strategy for Series A fundraising',
      status: 'planning',
      priority: 'high',
      startDate: '2024-02-15',
      dueDate: '2024-04-15',
      progress: 10,
      assignee: 'Both',
      tags: ['Fundraising', 'Series A', 'Investor Relations'],
      milestones: [
        { id: 9, title: 'Pitch Deck', status: 'in-progress', progress: 30 },
        { id: 10, title: 'Financial Model', status: 'pending', progress: 0 },
        { id: 11, title: 'Investor List', status: 'pending', progress: 0 },
        { id: 12, title: 'Due Diligence Prep', status: 'pending', progress: 0 }
      ]
    }
  ]);

  const [showAddProject, setShowAddProject] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [newProject, setNewProject] = useState({
    name: '',
    description: '',
    status: 'planning',
    priority: 'medium',
    startDate: '',
    dueDate: '',
    assignee: '',
    tags: []
  });

  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'in-progress': return 'bg-blue-100 text-blue-800';
      case 'planning': return 'bg-yellow-100 text-yellow-800';
      case 'on-hold': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredProjects = projects.filter(project => {
    const statusMatch = filterStatus === 'all' || project.status === filterStatus;
    const priorityMatch = filterPriority === 'all' || project.priority === filterPriority;
    return statusMatch && priorityMatch;
  });

  const handleAddProject = () => {
    if (newProject.name.trim()) {
      const project = {
        id: Date.now(),
        ...newProject,
        progress: 0,
        milestones: []
      };
      setProjects([...projects, project]);
      setNewProject({
        name: '',
        description: '',
        status: 'planning',
        priority: 'medium',
        startDate: '',
        dueDate: '',
        assignee: '',
        tags: []
      });
      setShowAddProject(false);
    }
  };

  const handleEditProject = (project) => {
    setEditingProject(project);
    setNewProject(project);
    setShowAddProject(true);
  };

  const handleUpdateProject = () => {
    if (editingProject && newProject.name.trim()) {
      setProjects(projects.map(p => 
        p.id === editingProject.id ? { ...p, ...newProject } : p
      ));
      setEditingProject(null);
      setNewProject({
        name: '',
        description: '',
        status: 'planning',
        priority: 'medium',
        startDate: '',
        dueDate: '',
        assignee: '',
        tags: []
      });
      setShowAddProject(false);
    }
  };

  const handleDeleteProject = (projectId) => {
    setProjects(projects.filter(p => p.id !== projectId));
  };

  const handleMilestoneUpdate = (projectId, milestoneId, updates) => {
    setProjects(projects.map(project => {
      if (project.id === projectId) {
        return {
          ...project,
          milestones: project.milestones.map(milestone =>
            milestone.id === milestoneId ? { ...milestone, ...updates } : milestone
          )
        };
      }
      return project;
    }));
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Project Board</h1>
              <p className="text-gray-600 mt-2">Manage your startup projects and track progress</p>
            </div>
            <button
              onClick={() => setShowAddProject(true)}
              className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-xl hover:bg-gray-800 transition-colors"
            >
              <Plus className="w-5 h-5" />
              Add Project
            </button>
          </div>

          {/* Filters */}
          <div className="flex gap-4 mb-6">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="planning">Planning</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="on-hold">On Hold</option>
            </select>
            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
            >
              <option value="all">All Priority</option>
              <option value="urgent">Urgent</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <div key={project.id} className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
              {/* Project Header */}
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">{project.name}</h3>
                    <p className="text-gray-600 text-sm mb-3">{project.description}</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEditProject(project)}
                      className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteProject(project.id)}
                      className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Status and Priority */}
                <div className="flex gap-2 mb-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
                    {project.status.replace('-', ' ')}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getPriorityColor(project.priority)}`}>
                    {project.priority}
                  </span>
                </div>

                {/* Progress Bar */}
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">Progress</span>
                    <span className="text-sm text-gray-500">{project.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-black h-2 rounded-full transition-all duration-300"
                      style={{ width: `${project.progress}%` }}
                    ></div>
                  </div>
                </div>

                {/* Project Details */}
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">Assignee:</span>
                    <p className="font-medium text-gray-900">{project.assignee}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Due Date:</span>
                    <p className="font-medium text-gray-900">{project.dueDate}</p>
                  </div>
                </div>
              </div>

              {/* Milestones */}
              <div className="p-6">
                <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Target className="w-4 h-4" />
                  Milestones
                </h4>
                <div className="space-y-3">
                  {project.milestones.map((milestone) => (
                    <div key={milestone.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => handleMilestoneUpdate(project.id, milestone.id, {
                            status: milestone.status === 'completed' ? 'pending' : 'completed',
                            progress: milestone.status === 'completed' ? 0 : 100
                          })}
                          className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                            milestone.status === 'completed' 
                              ? 'bg-green-500 border-green-500 text-white' 
                              : 'border-gray-300 hover:border-green-500'
                          }`}
                        >
                          {milestone.status === 'completed' && <CheckCircle className="w-3 h-3" />}
                        </button>
                        <div>
                          <p className="font-medium text-gray-900 text-sm">{milestone.title}</p>
                          <p className="text-xs text-gray-500">{milestone.progress}% complete</p>
                        </div>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(milestone.status)}`}>
                        {milestone.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Add/Edit Project Modal */}
        {showAddProject && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  {editingProject ? 'Edit Project' : 'Add New Project'}
                </h2>
                <button
                  onClick={() => {
                    setShowAddProject(false);
                    setEditingProject(null);
                    setNewProject({
                      name: '',
                      description: '',
                      status: 'planning',
                      priority: 'medium',
                      startDate: '',
                      dueDate: '',
                      assignee: '',
                      tags: []
                    });
                  }}
                  className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Project Name</label>
                  <input
                    type="text"
                    value={newProject.name}
                    onChange={(e) => setNewProject({...newProject, name: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                    placeholder="Enter project name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <textarea
                    value={newProject.description}
                    onChange={(e) => setNewProject({...newProject, description: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                    rows="3"
                    placeholder="Enter project description"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                    <select
                      value={newProject.status}
                      onChange={(e) => setNewProject({...newProject, status: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                    >
                      <option value="planning">Planning</option>
                      <option value="in-progress">In Progress</option>
                      <option value="completed">Completed</option>
                      <option value="on-hold">On Hold</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
                    <select
                      value={newProject.priority}
                      onChange={(e) => setNewProject({...newProject, priority: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                      <option value="urgent">Urgent</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
                    <input
                      type="date"
                      value={newProject.startDate}
                      onChange={(e) => setNewProject({...newProject, startDate: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Due Date</label>
                    <input
                      type="date"
                      value={newProject.dueDate}
                      onChange={(e) => setNewProject({...newProject, dueDate: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Assignee</label>
                  <input
                    type="text"
                    value={newProject.assignee}
                    onChange={(e) => setNewProject({...newProject, assignee: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                    placeholder="Enter assignee name"
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={editingProject ? handleUpdateProject : handleAddProject}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
                >
                  <Save className="w-4 h-4" />
                  {editingProject ? 'Update Project' : 'Add Project'}
                </button>
                <button
                  onClick={() => {
                    setShowAddProject(false);
                    setEditingProject(null);
                    setNewProject({
                      name: '',
                      description: '',
                      status: 'planning',
                      priority: 'medium',
                      startDate: '',
                      dueDate: '',
                      assignee: '',
                      tags: []
                    });
                  }}
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

export default ProjectBoardFixed;
