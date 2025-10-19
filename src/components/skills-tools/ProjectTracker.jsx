import React, { useState, useEffect } from 'react';
import { ArrowLeft, Briefcase, Plus, Trash2, Clock, CheckCircle, Circle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ProjectTracker = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    const saved = localStorage.getItem('projectTracker');
    if (saved) setProjects(JSON.parse(saved));
  }, []);

  const saveProjects = (data) => {
    setProjects(data);
    localStorage.setItem('projectTracker', JSON.stringify(data));
  };

  const addProject = () => {
    const newProject = {
      id: Date.now(),
      name: '',
      client: '',
      status: 'active',
      progress: 0,
      budget: '',
      startDate: '',
      endDate: '',
      tasks: []
    };
    saveProjects([...projects, newProject]);
  };

  const updateProject = (id, field, value) => {
    saveProjects(projects.map(p => p.id === id ? { ...p, [field]: value } : p));
  };

  const removeProject = (id) => {
    saveProjects(projects.filter(p => p.id !== id));
  };

  const addTask = (projectId) => {
    saveProjects(projects.map(p =>
      p.id === projectId ? { ...p, tasks: [...p.tasks, { id: Date.now(), name: '', completed: false }] } : p
    ));
  };

  const toggleTask = (projectId, taskId) => {
    saveProjects(projects.map(p =>
      p.id === projectId
        ? { ...p, tasks: p.tasks.map(t => t.id === taskId ? { ...t, completed: !t.completed } : t) }
        : p
    ));
  };

  const updateTask = (projectId, taskId, value) => {
    saveProjects(projects.map(p =>
      p.id === projectId
        ? { ...p, tasks: p.tasks.map(t => t.id === taskId ? { ...t, name: value } : t) }
        : p
    ));
  };

  const removeTask = (projectId, taskId) => {
    saveProjects(projects.map(p =>
      p.id === projectId ? { ...p, tasks: p.tasks.filter(t => t.id !== taskId) } : p
    ));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto p-6">
        <button onClick={() => navigate('/home')} className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </button>

        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Project Tracker</h1>
            <p className="text-gray-600">Manage your active and completed projects</p>
          </div>
          <button onClick={addProject} className="px-6 py-3 bg-gray-900 text-white rounded-xl hover:bg-black transition-colors flex items-center gap-2">
            <Plus className="w-5 h-5" />
            New Project
          </button>
        </div>

        <div className="space-y-6">
          {projects.map(project => {
            const completedTasks = project.tasks?.filter(t => t.completed).length || 0;
            const totalTasks = project.tasks?.length || 0;
            const taskProgress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

            return (
              <div key={project.id} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <input
                      type="text"
                      value={project.name}
                      onChange={(e) => updateProject(project.id, 'name', e.target.value)}
                      placeholder="Project Name"
                      className="w-full text-2xl font-bold mb-2 bg-transparent border-none focus:outline-none text-gray-900 placeholder-gray-400"
                    />
                    <input
                      type="text"
                      value={project.client}
                      onChange={(e) => updateProject(project.id, 'client', e.target.value)}
                      placeholder="Client Name"
                      className="w-full text-gray-600 bg-transparent border-none focus:outline-none placeholder-gray-400"
                    />
                  </div>
                  <button onClick={() => removeProject(project.id)} className="text-gray-400 hover:text-red-600 transition-colors">
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Status</label>
                    <select
                      value={project.status}
                      onChange={(e) => updateProject(project.id, 'status', e.target.value)}
                      className="w-full p-2 bg-gray-50 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                    >
                      <option value="active">Active</option>
                      <option value="on-hold">On Hold</option>
                      <option value="completed">Completed</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Budget</label>
                    <input
                      type="text"
                      value={project.budget}
                      onChange={(e) => updateProject(project.id, 'budget', e.target.value)}
                      placeholder="$5,000"
                      className="w-full p-2 bg-gray-50 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Start Date</label>
                    <input
                      type="date"
                      value={project.startDate}
                      onChange={(e) => updateProject(project.id, 'startDate', e.target.value)}
                      className="w-full p-2 bg-gray-50 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">End Date</label>
                    <input
                      type="date"
                      value={project.endDate}
                      onChange={(e) => updateProject(project.id, 'endDate', e.target.value)}
                      className="w-full p-2 bg-gray-50 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">Tasks ({completedTasks}/{totalTasks})</span>
                    <span className="text-sm text-gray-600">{Math.round(taskProgress)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                    <div
                      className="bg-gray-900 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${taskProgress}%` }}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  {project.tasks?.map(task => (
                    <div key={task.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <button onClick={() => toggleTask(project.id, task.id)}>
                        {task.completed ? (
                          <CheckCircle className="w-5 h-5 text-green-600" />
                        ) : (
                          <Circle className="w-5 h-5 text-gray-400" />
                        )}
                      </button>
                      <input
                        type="text"
                        value={task.name}
                        onChange={(e) => updateTask(project.id, task.id, e.target.value)}
                        placeholder="Task description..."
                        className={`flex-1 bg-transparent border-none focus:outline-none text-gray-900 placeholder-gray-400 ${
                          task.completed ? 'line-through text-gray-500' : ''
                        }`}
                      />
                      <button onClick={() => removeTask(project.id, task.id)} className="text-gray-400 hover:text-red-600 transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={() => addTask(project.id)}
                    className="w-full p-3 bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-gray-400 hover:text-gray-900 transition-colors text-sm font-medium"
                  >
                    + Add Task
                  </button>
                </div>
              </div>
            );
          })}

          {projects.length === 0 && (
            <div className="text-center py-16 bg-white rounded-2xl border border-gray-200">
              <Briefcase className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-400 mb-4">No projects yet</p>
              <button onClick={addProject} className="px-6 py-3 bg-gray-900 text-white rounded-xl hover:bg-black transition-colors">
                Create Your First Project
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectTracker;

