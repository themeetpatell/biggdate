import React, { useState, useEffect } from 'react';
import { ArrowLeft, FileText, CheckCircle, Circle, ChevronRight, Download, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const PitchDeckBuilder = () => {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [pitchDeck, setPitchDeck] = useState({});

  useEffect(() => {
    const saved = localStorage.getItem('pitchDeck');
    if (saved) {
      setPitchDeck(JSON.parse(saved));
    }
  }, []);

  const slides = [
    {
      id: 'cover',
      title: 'Cover Slide',
      description: 'Your startup name and tagline',
      fields: [
        { id: 'companyName', label: 'Company Name', type: 'text', placeholder: 'Your Startup Name' },
        { id: 'tagline', label: 'Tagline', type: 'text', placeholder: 'One-line description of what you do' },
        { id: 'founderName', label: 'Founder Name(s)', type: 'text', placeholder: 'Your name' },
        { id: 'contact', label: 'Contact', type: 'text', placeholder: 'email@startup.com' }
      ]
    },
    {
      id: 'problem',
      title: 'Problem',
      description: 'The problem you're solving',
      fields: [
        { id: 'problem', label: 'The Problem', type: 'textarea', placeholder: 'Describe the problem clearly and concisely. What pain point are you addressing?' }
      ]
    },
    {
      id: 'solution',
      title: 'Solution',
      description: 'Your solution to the problem',
      fields: [
        { id: 'solution', label: 'Your Solution', type: 'textarea', placeholder: 'How does your product/service solve the problem? What makes it unique?' }
      ]
    },
    {
      id: 'market',
      title: 'Market Opportunity',
      description: 'Market size and opportunity',
      fields: [
        { id: 'tam', label: 'TAM', type: 'text', placeholder: 'Total Addressable Market' },
        { id: 'sam', label: 'SAM', type: 'text', placeholder: 'Serviceable Available Market' },
        { id: 'som', label: 'SOM', type: 'text', placeholder: 'Serviceable Obtainable Market' },
        { id: 'marketTrends', label: 'Market Trends', type: 'textarea', placeholder: 'Key trends supporting your business' }
      ]
    },
    {
      id: 'product',
      title: 'Product/Service',
      description: 'What you're building',
      fields: [
        { id: 'productDescription', label: 'Product Description', type: 'textarea', placeholder: 'Describe your product/service and key features' },
        { id: 'coreFeatures', label: 'Core Features (3-5)', type: 'textarea', placeholder: 'List your core features, one per line' }
      ]
    },
    {
      id: 'traction',
      title: 'Traction',
      description: 'Progress and metrics',
      fields: [
        { id: 'users', label: 'Users/Customers', type: 'text', placeholder: 'Number of users or customers' },
        { id: 'revenue', label: 'Revenue', type: 'text', placeholder: 'Current MRR/ARR' },
        { id: 'growth', label: 'Growth Rate', type: 'text', placeholder: 'Month-over-month growth' },
        { id: 'milestones', label: 'Key Milestones', type: 'textarea', placeholder: 'Major achievements to date' }
      ]
    },
    {
      id: 'business',
      title: 'Business Model',
      description: 'How you make money',
      fields: [
        { id: 'revenueModel', label: 'Revenue Model', type: 'textarea', placeholder: 'How do you monetize? (subscription, transaction fees, etc.)' },
        { id: 'pricing', label: 'Pricing', type: 'text', placeholder: 'Pricing tiers or structure' },
        { id: 'ltv', label: 'LTV', type: 'text', placeholder: 'Lifetime Value per customer' },
        { id: 'cac', label: 'CAC', type: 'text', placeholder: 'Customer Acquisition Cost' }
      ]
    },
    {
      id: 'competition',
      title: 'Competition',
      description: 'Competitive landscape',
      fields: [
        { id: 'competitors', label: 'Main Competitors', type: 'textarea', placeholder: 'List your main competitors' },
        { id: 'advantages', label: 'Competitive Advantages', type: 'textarea', placeholder: 'What makes you better/different?' }
      ]
    },
    {
      id: 'team',
      title: 'Team',
      description: 'Who's building this',
      fields: [
        { id: 'teamMembers', label: 'Team Members', type: 'textarea', placeholder: 'List team members and their roles/backgrounds' },
        { id: 'advisors', label: 'Advisors', type: 'textarea', placeholder: 'Key advisors and their expertise' }
      ]
    },
    {
      id: 'financials',
      title: 'Financial Projections',
      description: '3-5 year projections',
      fields: [
        { id: 'year1', label: 'Year 1 Revenue', type: 'text', placeholder: 'Projected revenue' },
        { id: 'year2', label: 'Year 2 Revenue', type: 'text', placeholder: 'Projected revenue' },
        { id: 'year3', label: 'Year 3 Revenue', type: 'text', placeholder: 'Projected revenue' },
        { id: 'assumptions', label: 'Key Assumptions', type: 'textarea', placeholder: 'What assumptions drive your projections?' }
      ]
    },
    {
      id: 'ask',
      title: 'The Ask',
      description: 'What you're looking for',
      fields: [
        { id: 'funding', label: 'Funding Amount', type: 'text', placeholder: 'How much are you raising?' },
        { id: 'useOfFunds', label: 'Use of Funds', type: 'textarea', placeholder: 'How will you use the investment?' },
        { id: 'milestones', label: 'Milestones', type: 'textarea', placeholder: 'What will you achieve with this funding?' }
      ]
    }
  ];

  const updateSlideContent = (slideId, fieldId, value) => {
    const updated = {
      ...pitchDeck,
      [slideId]: {
        ...pitchDeck[slideId],
        [fieldId]: value
      }
    };
    setPitchDeck(updated);
    localStorage.setItem('pitchDeck', JSON.stringify(updated));
  };

  const slide = slides[currentSlide];
  const completedSlides = slides.filter(s => {
    const slideData = pitchDeck[s.id];
    return slideData && s.fields.some(f => slideData[f.id]?.trim());
  }).length;
  const progress = (completedSlides / slides.length) * 100;

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
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Pitch Deck Builder</h1>
              <p className="text-gray-600">Create a professional investor pitch deck</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500 mb-1">Progress</p>
              <p className="text-2xl font-bold text-gray-900">{completedSlides}/{slides.length}</p>
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

        {/* Slide Navigator */}
        <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-11 gap-2 mb-8">
          {slides.map((s, index) => {
            const isCompleted = pitchDeck[s.id] && s.fields.some(f => pitchDeck[s.id][f.id]?.trim());
            const isActive = index === currentSlide;
            return (
              <button
                key={s.id}
                onClick={() => setCurrentSlide(index)}
                className={`p-3 rounded-xl transition-all text-center ${
                  isActive
                    ? 'bg-gray-900 text-white shadow-lg'
                    : isCompleted
                    ? 'bg-green-50 text-green-700 border border-green-200'
                    : 'bg-white text-gray-400 border border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="text-xs font-medium">{index + 1}</div>
                {isCompleted && !isActive && (
                  <CheckCircle className="w-3 h-3 mx-auto mt-1" />
                )}
                {!isCompleted && !isActive && (
                  <Circle className="w-3 h-3 mx-auto mt-1" />
                )}
              </button>
            );
          })}
        </div>

        {/* Current Slide */}
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200">
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 bg-gray-900 text-white rounded-lg flex items-center justify-center font-bold text-sm">
                {currentSlide + 1}
              </div>
              <h2 className="text-2xl font-bold text-gray-900">{slide.title}</h2>
            </div>
            <p className="text-gray-600 ml-11">{slide.description}</p>
          </div>

          <div className="space-y-6">
            {slide.fields.map(field => (
              <div key={field.id}>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {field.label}
                </label>
                {field.type === 'textarea' ? (
                  <textarea
                    value={pitchDeck[slide.id]?.[field.id] || ''}
                    onChange={(e) => updateSlideContent(slide.id, field.id, e.target.value)}
                    placeholder={field.placeholder}
                    className="w-full h-32 p-4 bg-gray-50 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-gray-900 focus:border-transparent resize-none"
                  />
                ) : (
                  <input
                    type="text"
                    value={pitchDeck[slide.id]?.[field.id] || ''}
                    onChange={(e) => updateSlideContent(slide.id, field.id, e.target.value)}
                    placeholder={field.placeholder}
                    className="w-full p-4 bg-gray-50 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                  />
                )}
              </div>
            ))}
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200">
            <button
              onClick={() => setCurrentSlide(Math.max(0, currentSlide - 1))}
              disabled={currentSlide === 0}
              className="px-6 py-3 bg-white border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <div className="text-sm text-gray-500">
              Slide {currentSlide + 1} of {slides.length}
            </div>
            {currentSlide === slides.length - 1 ? (
              <div className="flex gap-2">
                <button
                  onClick={() => navigate('/home')}
                  className="px-6 py-3 bg-white border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all flex items-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  Export
                </button>
                <button
                  onClick={() => setCurrentSlide(0)}
                  className="px-6 py-3 bg-gray-900 text-white rounded-xl hover:bg-black transition-all flex items-center gap-2"
                >
                  <Eye className="w-4 h-4" />
                  Review
                </button>
              </div>
            ) : (
              <button
                onClick={() => setCurrentSlide(Math.min(slides.length - 1, currentSlide + 1))}
                className="px-6 py-3 bg-gray-900 text-white rounded-xl hover:bg-black transition-all flex items-center gap-2"
              >
                Next
                <ChevronRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PitchDeckBuilder;

