import React, { useState, useEffect } from 'react';
import { ArrowLeft, Lightbulb, Target, Users, DollarSign, Zap, CheckCircle, ChevronRight, Save } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const IdeaFurnishing = () => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState(0);
  const [ideaData, setIdeaData] = useState({
    problem: '',
    solution: '',
    targetCustomer: '',
    uniqueValue: '',
    competition: '',
    businessModel: '',
    marketSize: '',
    vision: ''
  });

  useEffect(() => {
    const saved = localStorage.getItem('ideaFurnishing');
    if (saved) {
      setIdeaData(JSON.parse(saved));
    }
  }, []);

  const sections = [
    {
      id: 'problem',
      title: 'The Problem',
      icon: Target,
      question: 'What problem are you solving?',
      placeholder: 'Describe the core problem your startup addresses. Why does this problem matter? Who experiences it?',
      tips: ['Be specific about the pain point', 'Quantify the problem if possible', 'Explain why current solutions fail']
    },
    {
      id: 'solution',
      title: 'Your Solution',
      icon: Lightbulb,
      question: 'How does your solution work?',
      placeholder: 'Describe your solution in simple terms. What makes it unique? How does it solve the problem better than alternatives?',
      tips: ['Keep it simple and clear', 'Focus on benefits, not features', 'Explain the "aha" moment']
    },
    {
      id: 'targetCustomer',
      title: 'Target Customer',
      icon: Users,
      question: 'Who is your ideal customer?',
      placeholder: 'Define your target customer segment. What are their characteristics? Where do they spend time? What do they value?',
      tips: ['Be specific - age, location, behavior', 'Describe their current situation', 'Identify early adopters']
    },
    {
      id: 'uniqueValue',
      title: 'Unique Value',
      icon: Zap,
      question: 'What makes you different?',
      placeholder: 'What is your unique value proposition? Why would customers choose you over alternatives? What is your unfair advantage?',
      tips: ['Highlight your differentiation', 'Explain your competitive edge', 'Focus on what you do better']
    },
    {
      id: 'competition',
      title: 'Competition',
      icon: Target,
      question: 'Who are your competitors?',
      placeholder: 'List direct and indirect competitors. What do they do well? What are their weaknesses? How will you compete?',
      tips: ['Include direct competitors', 'Consider indirect alternatives', 'Identify gaps in the market']
    },
    {
      id: 'businessModel',
      title: 'Business Model',
      icon: DollarSign,
      question: 'How will you make money?',
      placeholder: 'Describe your revenue model. How will you charge customers? What are your pricing tiers? What is your monetization strategy?',
      tips: ['Be realistic about pricing', 'Consider multiple revenue streams', 'Think about customer lifetime value']
    },
    {
      id: 'marketSize',
      title: 'Market Size',
      icon: Target,
      question: 'How big is the opportunity?',
      placeholder: 'Estimate your market size (TAM, SAM, SOM). What is the market growth rate? What market trends support your idea?',
      tips: ['Calculate TAM (Total Addressable Market)', 'Define SAM (Serviceable Available Market)', 'Estimate SOM (Serviceable Obtainable Market)']
    },
    {
      id: 'vision',
      title: 'Long-term Vision',
      icon: Lightbulb,
      question: 'Where do you see this going?',
      placeholder: 'What is your 5-year vision? What impact will you make? How will your startup change the world?',
      tips: ['Think big but realistic', 'Describe your impact', 'Paint a compelling future']
    }
  ];

  const handleChange = (field, value) => {
    const updated = { ...ideaData, [field]: value };
    setIdeaData(updated);
    localStorage.setItem('ideaFurnishing', JSON.stringify(updated));
  };

  const handleNext = () => {
    if (activeSection < sections.length - 1) {
      setActiveSection(activeSection + 1);
    }
  };

  const handlePrevious = () => {
    if (activeSection > 0) {
      setActiveSection(activeSection - 1);
    }
  };

  const currentSection = sections[activeSection];
  const Icon = currentSection.icon;
  const completedSections = sections.filter(s => ideaData[s.id]?.trim().length > 0).length;
  const progress = (completedSections / sections.length) * 100;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto p-6">
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
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Idea Furnishing</h1>
              <p className="text-gray-600">Refine and develop your startup idea with guided questions</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500 mb-1">Progress</p>
              <p className="text-2xl font-bold text-gray-900">{completedSections}/{sections.length}</p>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="mt-6 w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-gray-900 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Section Navigator */}
        <div className="grid grid-cols-4 md:grid-cols-8 gap-2 mb-8">
          {sections.map((section, index) => {
            const SectionIcon = section.icon;
            const isCompleted = ideaData[section.id]?.trim().length > 0;
            const isActive = index === activeSection;
            return (
              <button
                key={section.id}
                onClick={() => setActiveSection(index)}
                className={`p-3 rounded-xl transition-all ${
                  isActive
                    ? 'bg-gray-900 text-white shadow-lg'
                    : isCompleted
                    ? 'bg-green-50 text-green-700 border border-green-200'
                    : 'bg-white text-gray-400 border border-gray-200 hover:border-gray-300'
                }`}
              >
                <SectionIcon className="w-5 h-5 mx-auto" />
                {isCompleted && !isActive && (
                  <CheckCircle className="w-3 h-3 mx-auto mt-1" />
                )}
              </button>
            );
          })}
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 bg-gray-900 rounded-xl flex items-center justify-center">
              <Icon className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{currentSection.title}</h2>
              <p className="text-gray-600">{currentSection.question}</p>
            </div>
          </div>

          <textarea
            value={ideaData[currentSection.id] || ''}
            onChange={(e) => handleChange(currentSection.id, e.target.value)}
            placeholder={currentSection.placeholder}
            className="w-full h-64 p-4 bg-gray-50 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-gray-900 focus:border-transparent resize-none mb-6"
          />

          {/* Tips */}
          <div className="bg-gray-50 rounded-xl p-6 mb-6">
            <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <Lightbulb className="w-4 h-4" />
              Tips for this section
            </h3>
            <ul className="space-y-2">
              {currentSection.tips.map((tip, index) => (
                <li key={index} className="flex items-start gap-2 text-sm text-gray-600">
                  <ChevronRight className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                  {tip}
                </li>
              ))}
            </ul>
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between">
            <button
              onClick={handlePrevious}
              disabled={activeSection === 0}
              className="px-6 py-3 bg-white border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <div className="text-sm text-gray-500">
              Section {activeSection + 1} of {sections.length}
            </div>
            {activeSection === sections.length - 1 ? (
              <button
                onClick={() => navigate('/home')}
                className="px-6 py-3 bg-gray-900 text-white rounded-xl hover:bg-black transition-all flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                Save & Complete
              </button>
            ) : (
              <button
                onClick={handleNext}
                className="px-6 py-3 bg-gray-900 text-white rounded-xl hover:bg-black transition-all"
              >
                Next
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default IdeaFurnishing;

