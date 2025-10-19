import React, { useState, useEffect } from 'react';
import { ArrowLeft, Star, Briefcase, Award, Code, Plus, Trash2, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const SkillsShowcase = () => {
  const navigate = useNavigate();
  const [showcase, setShowcase] = useState({
    bio: '',
    expertise: [],
    experience: [],
    portfolio: [],
    certifications: [],
    testimonials: []
  });

  useEffect(() => {
    const saved = localStorage.getItem('skillsShowcase');
    if (saved) {
      setShowcase(JSON.parse(saved));
    }
  }, []);

  const saveShowcase = (data) => {
    setShowcase(data);
    localStorage.setItem('skillsShowcase', JSON.stringify(data));
  };

  const addItem = (type) => {
    const newItem = {
      id: Date.now(),
      ...(type === 'expertise' && { skill: '', level: 'expert' }),
      ...(type === 'experience' && { title: '', company: '', duration: '', description: '' }),
      ...(type === 'portfolio' && { title: '', description: '', link: '', image: '' }),
      ...(type === 'certifications' && { name: '', issuer: '', date: '' }),
      ...(type === 'testimonials' && { client: '', text: '', rating: 5 })
    };
    saveShowcase({ ...showcase, [type]: [...showcase[type], newItem] });
  };

  const updateItem = (type, id, field, value) => {
    saveShowcase({
      ...showcase,
      [type]: showcase[type].map(item => item.id === id ? { ...item, [field]: value } : item)
    });
  };

  const removeItem = (type, id) => {
    saveShowcase({
      ...showcase,
      [type]: showcase[type].filter(item => item.id !== id)
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto p-6">
        <button
          onClick={() => navigate('/home')}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </button>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Skills Showcase</h1>
          <p className="text-gray-600">Build your professional portfolio to attract startups</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* Bio */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Professional Bio</h2>
              <textarea
                value={showcase.bio}
                onChange={(e) => saveShowcase({ ...showcase, bio: e.target.value })}
                placeholder="Write a compelling bio that showcases your expertise and what you can offer to startups..."
                className="w-full h-32 p-4 bg-gray-50 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-gray-900 focus:border-transparent resize-none"
              />
            </div>

            {/* Experience */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-900 rounded-xl flex items-center justify-center">
                    <Briefcase className="w-5 h-5 text-white" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-900">Experience</h2>
                </div>
                <button
                  onClick={() => addItem('experience')}
                  className="px-4 py-2 bg-gray-900 text-white rounded-xl hover:bg-black transition-colors flex items-center gap-2 text-sm"
                >
                  <Plus className="w-4 h-4" />
                  Add
                </button>
              </div>

              <div className="space-y-4">
                {showcase.experience.map(exp => (
                  <div key={exp.id} className="p-4 bg-gray-50 rounded-xl">
                    <div className="flex items-start justify-between mb-3">
                      <input
                        type="text"
                        value={exp.title}
                        onChange={(e) => updateItem('experience', exp.id, 'title', e.target.value)}
                        placeholder="Job Title"
                        className="flex-1 font-semibold bg-transparent border-none focus:outline-none text-gray-900 placeholder-gray-400"
                      />
                      <button
                        onClick={() => removeItem('experience', exp.id)}
                        className="text-gray-400 hover:text-red-600 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <input
                      type="text"
                      value={exp.company}
                      onChange={(e) => updateItem('experience', exp.id, 'company', e.target.value)}
                      placeholder="Company"
                      className="w-full mb-2 text-sm bg-white border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                    />
                    <input
                      type="text"
                      value={exp.duration}
                      onChange={(e) => updateItem('experience', exp.id, 'duration', e.target.value)}
                      placeholder="Duration (e.g., 2020-2023)"
                      className="w-full mb-2 text-sm bg-white border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                    />
                    <textarea
                      value={exp.description}
                      onChange={(e) => updateItem('experience', exp.id, 'description', e.target.value)}
                      placeholder="Description of your role and achievements..."
                      className="w-full h-20 p-3 bg-white border border-gray-300 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-gray-900 focus:border-transparent resize-none"
                    />
                  </div>
                ))}
                {showcase.experience.length === 0 && (
                  <p className="text-gray-400 text-center py-8">No experience added yet</p>
                )}
              </div>
            </div>

            {/* Portfolio */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-900 rounded-xl flex items-center justify-center">
                    <Code className="w-5 h-5 text-white" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-900">Portfolio Projects</h2>
                </div>
                <button
                  onClick={() => addItem('portfolio')}
                  className="px-4 py-2 bg-gray-900 text-white rounded-xl hover:bg-black transition-colors flex items-center gap-2 text-sm"
                >
                  <Plus className="w-4 h-4" />
                  Add
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {showcase.portfolio.map(project => (
                  <div key={project.id} className="p-4 bg-gray-50 rounded-xl">
                    <div className="flex items-start justify-between mb-3">
                      <input
                        type="text"
                        value={project.title}
                        onChange={(e) => updateItem('portfolio', project.id, 'title', e.target.value)}
                        placeholder="Project Title"
                        className="flex-1 font-semibold bg-transparent border-none focus:outline-none text-gray-900 placeholder-gray-400"
                      />
                      <button
                        onClick={() => removeItem('portfolio', project.id)}
                        className="text-gray-400 hover:text-red-600 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <textarea
                      value={project.description}
                      onChange={(e) => updateItem('portfolio', project.id, 'description', e.target.value)}
                      placeholder="Project description..."
                      className="w-full h-16 p-3 bg-white border border-gray-300 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-gray-900 focus:border-transparent resize-none mb-2"
                    />
                    <div className="flex items-center gap-2">
                      <ExternalLink className="w-4 h-4 text-gray-400" />
                      <input
                        type="url"
                        value={project.link}
                        onChange={(e) => updateItem('portfolio', project.id, 'link', e.target.value)}
                        placeholder="Project URL"
                        className="flex-1 text-sm bg-white border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                      />
                    </div>
                  </div>
                ))}
                {showcase.portfolio.length === 0 && (
                  <p className="text-gray-400 text-center py-8 col-span-2">No projects added yet</p>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Expertise */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-gray-900">Expertise</h2>
                <button
                  onClick={() => addItem('expertise')}
                  className="p-2 bg-gray-900 text-white rounded-lg hover:bg-black transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              <div className="space-y-3">
                {showcase.expertise.map(skill => (
                  <div key={skill.id} className="flex items-center gap-2">
                    <input
                      type="text"
                      value={skill.skill}
                      onChange={(e) => updateItem('expertise', skill.id, 'skill', e.target.value)}
                      placeholder="Skill name"
                      className="flex-1 text-sm bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                    />
                    <button
                      onClick={() => removeItem('expertise', skill.id)}
                      className="text-gray-400 hover:text-red-600 transition-colors"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Certifications */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-gray-900" />
                  <h2 className="text-lg font-bold text-gray-900">Certifications</h2>
                </div>
                <button
                  onClick={() => addItem('certifications')}
                  className="p-2 bg-gray-900 text-white rounded-lg hover:bg-black transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              <div className="space-y-3">
                {showcase.certifications.map(cert => (
                  <div key={cert.id} className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-start justify-between mb-2">
                      <input
                        type="text"
                        value={cert.name}
                        onChange={(e) => updateItem('certifications', cert.id, 'name', e.target.value)}
                        placeholder="Certification name"
                        className="flex-1 text-sm font-semibold bg-transparent border-none focus:outline-none text-gray-900 placeholder-gray-400"
                      />
                      <button
                        onClick={() => removeItem('certifications', cert.id)}
                        className="text-gray-400 hover:text-red-600 transition-colors"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                    <input
                      type="text"
                      value={cert.issuer}
                      onChange={(e) => updateItem('certifications', cert.id, 'issuer', e.target.value)}
                      placeholder="Issuer"
                      className="w-full mb-2 text-xs bg-white border border-gray-300 rounded px-2 py-1 focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                    />
                    <input
                      type="text"
                      value={cert.date}
                      onChange={(e) => updateItem('certifications', cert.id, 'date', e.target.value)}
                      placeholder="Date"
                      className="w-full text-xs bg-white border border-gray-300 rounded px-2 py-1 focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Testimonials */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <Star className="w-5 h-5 text-gray-900" />
                  <h2 className="text-lg font-bold text-gray-900">Testimonials</h2>
                </div>
                <button
                  onClick={() => addItem('testimonials')}
                  className="p-2 bg-gray-900 text-white rounded-lg hover:bg-black transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              <div className="space-y-3">
                {showcase.testimonials.map(test => (
                  <div key={test.id} className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-start justify-between mb-2">
                      <input
                        type="text"
                        value={test.client}
                        onChange={(e) => updateItem('testimonials', test.id, 'client', e.target.value)}
                        placeholder="Client name"
                        className="flex-1 text-sm font-semibold bg-transparent border-none focus:outline-none text-gray-900 placeholder-gray-400"
                      />
                      <button
                        onClick={() => removeItem('testimonials', test.id)}
                        className="text-gray-400 hover:text-red-600 transition-colors"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                    <textarea
                      value={test.text}
                      onChange={(e) => updateItem('testimonials', test.id, 'text', e.target.value)}
                      placeholder="Testimonial text..."
                      className="w-full h-16 p-2 bg-white border border-gray-300 rounded text-xs text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-gray-900 focus:border-transparent resize-none"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SkillsShowcase;

