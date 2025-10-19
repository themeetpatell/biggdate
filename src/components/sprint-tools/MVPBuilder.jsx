import React, { useState, useEffect } from 'react';
import { ArrowLeft, Rocket, CheckCircle, Circle, Target, Code, Layout, TestTube, Users, Calendar, Plus, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const MVPBuilder = () => {
  const navigate = useNavigate();
  const [mvpData, setMvpData] = useState({
    coreFeatures: [],
    niceToHave: [],
    techStack: {
      frontend: '',
      backend: '',
      database: '',
      hosting: ''
    },
    timeline: [],
    resources: '',
    risks: ''
  });

  useEffect(() => {
    const saved = localStorage.getItem('mvpBuilder');
    if (saved) {
      setMvpData(JSON.parse(saved));
    }
  }, []);

  const saveMVPData = (data) => {
    setMvpData(data);
    localStorage.setItem('mvpBuilder', JSON.stringify(data));
  };

  const addFeature = (type) => {
    const feature = { id: Date.now(), name: '', status: 'pending' };
    const updated = {
      ...mvpData,
      [type]: [...mvpData[type], feature]
    };
    saveMVPData(updated);
  };

  const updateFeature = (type, id, field, value) => {
    const updated = {
      ...mvpData,
      [type]: mvpData[type].map(f => f.id === id ? { ...f, [field]: value } : f)
    };
    saveMVPData(updated);
  };

  const removeFeature = (type, id) => {
    const updated = {
      ...mvpData,
      [type]: mvpData[type].filter(f => f.id !== id)
    };
    saveMVPData(updated);
  };

  const addMilestone = () => {
    const milestone = { id: Date.now(), title: '', deadline: '', status: 'pending' };
    const updated = {
      ...mvpData,
      timeline: [...mvpData.timeline, milestone]
    };
    saveMVPData(updated);
  };

  const updateMilestone = (id, field, value) => {
    const updated = {
      ...mvpData,
      timeline: mvpData.timeline.map(m => m.id === id ? { ...m, [field]: value } : m)
    };
    saveMVPData(updated);
  };

  const removeMilestone = (id) => {
    const updated = {
      ...mvpData,
      timeline: mvpData.timeline.filter(m => m.id !== id)
    };
    saveMVPData(updated);
  };

  const updateTechStack = (field, value) => {
    const updated = {
      ...mvpData,
      techStack: { ...mvpData.techStack, [field]: value }
    };
    saveMVPData(updated);
  };

  const coreProgress = mvpData.coreFeatures.length > 0
    ? (mvpData.coreFeatures.filter(f => f.status === 'completed').length / mvpData.coreFeatures.length) * 100
    : 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/home')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </button>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">MVP Builder</h1>
              <p className="text-gray-600">Plan and track your Minimum Viable Product development</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500 mb-1">Core Features Progress</p>
              <p className="text-2xl font-bold text-gray-900">{Math.round(coreProgress)}%</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Features */}
          <div className="lg:col-span-2 space-y-6">
            {/* Core Features */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-900 rounded-xl flex items-center justify-center">
                    <Target className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">Core Features</h2>
                    <p className="text-sm text-gray-600">Essential features for your MVP</p>
                  </div>
                </div>
                <button
                  onClick={() => addFeature('coreFeatures')}
                  className="px-4 py-2 bg-gray-900 text-white rounded-xl hover:bg-black transition-colors flex items-center gap-2 text-sm"
                >
                  <Plus className="w-4 h-4" />
                  Add
                </button>
              </div>

              <div className="space-y-3">
                {mvpData.coreFeatures.length === 0 ? (
                  <p className="text-gray-400 text-center py-8">No core features added yet</p>
                ) : (
                  mvpData.coreFeatures.map(feature => (
                    <div key={feature.id} className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                      <button
                        onClick={() => updateFeature('coreFeatures', feature.id, 'status', feature.status === 'completed' ? 'pending' : 'completed')}
                        className="flex-shrink-0"
                      >
                        {feature.status === 'completed' ? (
                          <CheckCircle className="w-5 h-5 text-green-600" />
                        ) : (
                          <Circle className="w-5 h-5 text-gray-400" />
                        )}
                      </button>
                      <input
                        type="text"
                        value={feature.name}
                        onChange={(e) => updateFeature('coreFeatures', feature.id, 'name', e.target.value)}
                        placeholder="Feature name..."
                        className="flex-1 bg-transparent border-none focus:outline-none text-gray-900 placeholder-gray-400"
                      />
                      <button
                        onClick={() => removeFeature('coreFeatures', feature.id)}
                        className="flex-shrink-0 text-gray-400 hover:text-red-600 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Nice to Have Features */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-700 rounded-xl flex items-center justify-center">
                    <Layout className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">Nice to Have</h2>
                    <p className="text-sm text-gray-600">Features for future iterations</p>
                  </div>
                </div>
                <button
                  onClick={() => addFeature('niceToHave')}
                  className="px-4 py-2 bg-gray-700 text-white rounded-xl hover:bg-gray-800 transition-colors flex items-center gap-2 text-sm"
                >
                  <Plus className="w-4 h-4" />
                  Add
                </button>
              </div>

              <div className="space-y-3">
                {mvpData.niceToHave.length === 0 ? (
                  <p className="text-gray-400 text-center py-8">No future features added yet</p>
                ) : (
                  mvpData.niceToHave.map(feature => (
                    <div key={feature.id} className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                      <Circle className="w-5 h-5 text-gray-400 flex-shrink-0" />
                      <input
                        type="text"
                        value={feature.name}
                        onChange={(e) => updateFeature('niceToHave', feature.id, 'name', e.target.value)}
                        placeholder="Feature name..."
                        className="flex-1 bg-transparent border-none focus:outline-none text-gray-900 placeholder-gray-400"
                      />
                      <button
                        onClick={() => removeFeature('niceToHave', feature.id)}
                        className="flex-shrink-0 text-gray-400 hover:text-red-600 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Development Timeline */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-900 rounded-xl flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">Development Timeline</h2>
                    <p className="text-sm text-gray-600">Key milestones and deadlines</p>
                  </div>
                </div>
                <button
                  onClick={addMilestone}
                  className="px-4 py-2 bg-gray-900 text-white rounded-xl hover:bg-black transition-colors flex items-center gap-2 text-sm"
                >
                  <Plus className="w-4 h-4" />
                  Add
                </button>
              </div>

              <div className="space-y-3">
                {mvpData.timeline.length === 0 ? (
                  <p className="text-gray-400 text-center py-8">No milestones added yet</p>
                ) : (
                  mvpData.timeline.map(milestone => (
                    <div key={milestone.id} className="p-4 bg-gray-50 rounded-xl">
                      <div className="flex items-start gap-3">
                        <button
                          onClick={() => updateMilestone(milestone.id, 'status', milestone.status === 'completed' ? 'pending' : 'completed')}
                          className="flex-shrink-0 mt-1"
                        >
                          {milestone.status === 'completed' ? (
                            <CheckCircle className="w-5 h-5 text-green-600" />
                          ) : (
                            <Circle className="w-5 h-5 text-gray-400" />
                          )}
                        </button>
                        <div className="flex-1 space-y-2">
                          <input
                            type="text"
                            value={milestone.title}
                            onChange={(e) => updateMilestone(milestone.id, 'title', e.target.value)}
                            placeholder="Milestone title..."
                            className="w-full bg-transparent border-none focus:outline-none text-gray-900 placeholder-gray-400 font-medium"
                          />
                          <input
                            type="date"
                            value={milestone.deadline}
                            onChange={(e) => updateMilestone(milestone.id, 'deadline', e.target.value)}
                            className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                          />
                        </div>
                        <button
                          onClick={() => removeMilestone(milestone.id)}
                          className="flex-shrink-0 text-gray-400 hover:text-red-600 transition-colors mt-1"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Tech Stack & Resources */}
          <div className="space-y-6">
            {/* Tech Stack */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-gray-900 rounded-xl flex items-center justify-center">
                  <Code className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Tech Stack</h2>
                  <p className="text-sm text-gray-600">Your technology choices</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Frontend</label>
                  <input
                    type="text"
                    value={mvpData.techStack.frontend}
                    onChange={(e) => updateTechStack('frontend', e.target.value)}
                    placeholder="e.g., React, Vue, Angular"
                    className="w-full p-3 bg-gray-50 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Backend</label>
                  <input
                    type="text"
                    value={mvpData.techStack.backend}
                    onChange={(e) => updateTechStack('backend', e.target.value)}
                    placeholder="e.g., Node.js, Python, Ruby"
                    className="w-full p-3 bg-gray-50 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Database</label>
                  <input
                    type="text"
                    value={mvpData.techStack.database}
                    onChange={(e) => updateTechStack('database', e.target.value)}
                    placeholder="e.g., PostgreSQL, MongoDB"
                    className="w-full p-3 bg-gray-50 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Hosting</label>
                  <input
                    type="text"
                    value={mvpData.techStack.hosting}
                    onChange={(e) => updateTechStack('hosting', e.target.value)}
                    placeholder="e.g., AWS, Vercel, Heroku"
                    className="w-full p-3 bg-gray-50 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Resources Needed */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-gray-900 rounded-xl flex items-center justify-center">
                  <Users className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Resources</h2>
                  <p className="text-sm text-gray-600">What you need</p>
                </div>
              </div>
              <textarea
                value={mvpData.resources}
                onChange={(e) => saveMVPData({ ...mvpData, resources: e.target.value })}
                placeholder="List resources you need: team members, budget, tools, etc."
                className="w-full h-32 p-4 bg-gray-50 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-gray-900 focus:border-transparent resize-none"
              />
            </div>

            {/* Risks */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-gray-900 rounded-xl flex items-center justify-center">
                  <TestTube className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Risks</h2>
                  <p className="text-sm text-gray-600">Potential challenges</p>
                </div>
              </div>
              <textarea
                value={mvpData.risks}
                onChange={(e) => saveMVPData({ ...mvpData, risks: e.target.value })}
                placeholder="Identify technical risks, resource constraints, and mitigation strategies..."
                className="w-full h-32 p-4 bg-gray-50 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-gray-900 focus:border-transparent resize-none"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MVPBuilder;

