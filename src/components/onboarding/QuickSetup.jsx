import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Heart, 
  Globe, 
  Eye, 
  ArrowRight, 
  ArrowLeft, 
  CheckCircle, 
  Star, 
  Zap, 
  Target, 
  Crown, 
  Sparkles,
  Mic,
  MicOff,
  Play,
  Pause,
  RotateCcw,
  Volume2,
  Upload,
  FileText,
  X
} from 'lucide-react';

const QuickSetup = () => {
  const [missionStatement, setMissionStatement] = useState('');
  const [selectedValues, setSelectedValues] = useState([]);
  const [selectedIntent, setSelectedIntent] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [hasVoiceNote, setHasVoiceNote] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [pitchDeckFile, setPitchDeckFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [yourIndustries, setYourIndustries] = useState([]);
  const [yourSkills, setYourSkills] = useState([]);
  const [yourExperience, setYourExperience] = useState('');
  const [yourBackground, setYourBackground] = useState('');
  const navigate = useNavigate();

  // Set default role values if not already set
  React.useEffect(() => {
    if (!localStorage.getItem('userRole')) {
      localStorage.setItem('userRole', 'founder');
    }
    if (!localStorage.getItem('userStage')) {
      localStorage.setItem('userStage', 'idea-stage');
    }
    if (!localStorage.getItem('userMask')) {
      localStorage.setItem('userMask', 'rocket');
    }
  }, []);

  const valueGroups = [
    {
      category: 'Vision & Creation',
      values: [
        { id: 'innovation', name: 'Innovation' },
        { id: 'creativity', name: 'Creativity' },
        { id: 'impact', name: 'Impact' },
        { id: 'legacy', name: 'Legacy' },
        { id: 'leadership', name: 'Leadership' },
        { id: 'curiosity', name: 'Curiosity' },
        { id: 'freedom', name: 'Freedom' }
      ]
    },
    {
      category: 'Grit & Growth',
      values: [
        { id: 'growth', name: 'Growth' },
        { id: 'resilience', name: 'Resilience' },
        { id: 'discipline', name: 'Discipline' },
        { id: 'courage', name: 'Courage' },
        { id: 'excellence', name: 'Excellence' },
        { id: 'ambition', name: 'Ambition' },
        { id: 'wisdom', name: 'Wisdom' },
        { id: 'optimism', name: 'Optimism' }
      ]
    },
    {
      category: 'Heart & Connection',
      values: [
        { id: 'connection', name: 'Connection' },
        { id: 'empathy', name: 'Empathy' },
        { id: 'compassion', name: 'Compassion' },
        { id: 'authenticity', name: 'Authenticity' },
        { id: 'passion', name: 'Passion' },
        { id: 'gratitude', name: 'Gratitude' },
        { id: 'humility', name: 'Humility' },
        { id: 'integrity', name: 'Integrity' },
        { id: 'balance', name: 'Balance' },
        { id: 'adventure', name: 'Adventure' }
      ]
    }
  ];

  const intents = [
    {
      id: 'find-cofounder',
      title: 'Find a Cofounder',
      description: 'Looking for the right co-founder to build and grow your startup',
      icon: Target,
      color: 'from-blue-500 to-cyan-500'
    },
    {
      id: 'offer-skills',
      title: 'Offer Your Skills',
      description: 'Connect with startups that need your expertise and skills',
      icon: Sparkles,
      color: 'from-green-500 to-emerald-500'
    },
    {
      id: 'idea-sprint',
      title: 'Start Idea Sprint',
      description: 'Build your idea, validate it, and find the perfect cofounder',
      icon: Zap,
      color: 'from-purple-500 to-indigo-500'
    }
  ];

  const handleValueToggle = (valueId) => {
    setIsAnimating(true);
    if (selectedValues.includes(valueId)) {
      setSelectedValues(selectedValues.filter(id => id !== valueId));
    } else if (selectedValues.length < 5) {
      setSelectedValues([...selectedValues, valueId]);
    }
    setTimeout(() => setIsAnimating(false), 200);
  };

  const handleIntentSelect = (intentId) => {
    setIsAnimating(true);
    setSelectedIntent(intentId);
    setTimeout(() => setIsAnimating(false), 200);
  };

  const handleVoiceRecord = () => {
    setIsRecording(!isRecording);
    if (!isRecording) {
      // Simulate recording
      setTimeout(() => {
        setIsRecording(false);
        setHasVoiceNote(true);
      }, 3000);
    }
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.type !== 'application/pdf') {
        alert('Please upload a PDF file only.');
        return;
      }
      
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        alert('File size must be less than 10MB.');
        return;
      }

      setIsUploading(true);
      
      // Simulate file upload
      setTimeout(() => {
        setPitchDeckFile(file);
        setIsUploading(false);
      }, 1500);
    }
  };

  const handleRemoveFile = () => {
    setPitchDeckFile(null);
  };

  const handleYourIndustryToggle = (industry) => {
    setYourIndustries(prev =>
      prev.includes(industry) ? prev.filter(i => i !== industry) : [...prev, industry]
    );
  };

  const handleYourSkillToggle = (skill) => {
    setYourSkills(prev =>
      prev.includes(skill) ? prev.filter(s => s !== skill) : [...prev, skill]
    );
  };

  const handleIndustrySelect = (e) => {
    const value = e.target.value;
    if (value && !yourIndustries.includes(value)) {
      setYourIndustries(prev => [...prev, value]);
    }
    e.target.value = '';
  };

  const handleSkillSelect = (e) => {
    const value = e.target.value;
    if (value && !yourSkills.includes(value)) {
      setYourSkills(prev => [...prev, value]);
    }
    e.target.value = '';
  };

  const removeIndustry = (industry) => {
    setYourIndustries(prev => prev.filter(i => i !== industry));
  };

  const removeSkill = (skill) => {
    setYourSkills(prev => prev.filter(s => s !== skill));
  };

  const handleContinue = () => {
    if (selectedValues.length >= 1 && selectedIntent) {
      // Save to localStorage
      localStorage.setItem('whyHere', missionStatement || 'Building the future');
      localStorage.setItem('selectedValues', JSON.stringify(selectedValues));
      localStorage.setItem('selectedIntent', selectedIntent);
      localStorage.setItem('yourIndustries', JSON.stringify(yourIndustries));
      localStorage.setItem('yourSkills', JSON.stringify(yourSkills));
      localStorage.setItem('yourExperience', yourExperience);
      localStorage.setItem('yourBackground', yourBackground);
      if (hasVoiceNote) {
        localStorage.setItem('hasVoiceNote', 'true');
      }
      if (pitchDeckFile) {
        localStorage.setItem('pitchDeckFileName', pitchDeckFile.name);
        localStorage.setItem('pitchDeckFileSize', pitchDeckFile.size.toString());
      }
      
      // Navigate based on selected intent
      if (selectedIntent === 'find-cofounder') {
        navigate('/onboarding/pitch');
      } else if (selectedIntent === 'offer-skills') {
        navigate('/onboarding/offer-skills');
      } else if (selectedIntent === 'idea-sprint') {
        navigate('/onboarding/idea-sprint');
      }
    }
  };

  const handleBack = () => {
    navigate('/home');
  };

  const isComplete = selectedValues.length >= 1 && selectedIntent;

  return (
    <>
      <style jsx>{`
        @keyframes bubbleFloat {
          0% { transform: translateY(0px) scale(1); }
          50% { transform: translateY(-10px) scale(1.05); }
          100% { transform: translateY(0px) scale(1); }
        }
        
        @keyframes bubbleGlow {
          0% { box-shadow: 0 0 5px rgba(255, 255, 255, 0.2); }
          50% { box-shadow: 0 0 20px rgba(255, 255, 255, 0.4); }
          100% { box-shadow: 0 0 5px rgba(255, 255, 255, 0.2); }
        }
        
        .bubble-glow {
          animation: bubbleGlow 3s ease-in-out infinite;
        }
      `}</style>
      <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-3 bg-gray-50 px-6 py-3 rounded-full mb-6 border border-gray-200">
            <Target className="w-6 h-6 text-gray-700" />
            <span className="text-gray-700 font-medium">Your Vision Matters</span>
          </div>
          <h1 className="text-5xl font-normal text-gray-900 mb-4">
            What's Your Startup Vision?
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Share your startup idea, values, and what drives you. Your cofounder is waiting to hear your story.
          </p>
        </div>

        {/* Mission Statement */}
        <div className="mb-12">
          <h2 className="text-2xl font-normal text-gray-900 mb-6 text-center">Share Your Vision</h2>
          <div className="bg-white rounded-3xl p-8 border border-gray-200">
            <div className="mb-6">
              <textarea
                value={missionStatement}
                onChange={(e) => setMissionStatement(e.target.value)}
                placeholder="Tell your cofounder what you're building and why it matters... Share your startup idea, the problem you're solving, your mission, and what drives you every day."
                className="w-full h-40 p-5 bg-white border border-gray-300 rounded-2xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent resize-none text-base"
              />
            </div>

            {/* Voice Note and Pitch Deck Options */}
            <div className="flex items-center gap-4 flex-wrap">
              <button
                onClick={handleVoiceRecord}
                className={`px-6 py-3 rounded-xl font-medium transition-all duration-200 flex items-center gap-2 border ${
                  isRecording
                    ? 'bg-red-50 text-red-700 border-red-700 hover:bg-red-100'
                    : hasVoiceNote
                    ? 'bg-green-50 text-green-700 border-green-700'
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                }`}
              >
                {isRecording ? (
                  <>
                    <Pause className="w-5 h-5" />
                    Recording...
                  </>
                ) : hasVoiceNote ? (
                  <>
                    <CheckCircle className="w-5 h-5" />
                    Voice Note Added
                  </>
                ) : (
                  <>
                    <Mic className="w-5 h-5" />
                    Record Your Pitch (60s)
                  </>
                )}
              </button>
              
              {hasVoiceNote && (
                <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
                  <Play className="w-5 h-5" />
                </button>
              )}

              {/* Pitch Deck Upload Button */}
              <div className="relative">
                <input
                  type="file"
                  accept=".pdf"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="pitch-deck-upload"
                  disabled={isUploading}
                />
                <label
                  htmlFor="pitch-deck-upload"
                  className={`px-6 py-3 rounded-xl font-medium transition-all duration-200 flex items-center gap-2 cursor-pointer border ${
                    pitchDeckFile
                      ? 'bg-green-50 text-green-700 border-green-700'
                      : isUploading
                      ? 'bg-gray-100 text-gray-500 border-gray-300 opacity-50 cursor-not-allowed'
                      : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {isUploading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-700"></div>
                      Uploading...
                    </>
                  ) : pitchDeckFile ? (
                    <>
                      <CheckCircle className="w-5 h-5" />
                      Pitch Deck Added
                    </>
                  ) : (
                    <>
                      <Upload className="w-5 h-5" />
                      Upload Pitch Deck
                    </>
                  )}
                </label>
              </div>

              {pitchDeckFile && (
                <button
                  onClick={handleRemoveFile}
                  className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                  title="Remove pitch deck"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>
        </div>


        {/* About You Section */}
        <div className="mb-12">
          <h2 className="text-2xl font-normal text-gray-900 mb-6 text-center">Tell Us About Yourself</h2>
          <p className="text-gray-600 text-center mb-8">Help cofounders understand your background and what you bring</p>
          
          {/* Your Industry */}
          <div className="bg-white rounded-3xl p-8 border border-gray-200 mb-8">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Your Industry & Background</h3>
            <p className="text-gray-600 text-sm mb-4">Select the industries you have experience in</p>
            
            <select
              onChange={handleIndustrySelect}
              className="w-full p-4 bg-white border border-gray-300 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent mb-4"
            >
              <option value="">+ Add Industry</option>
              {['Technology', 'Healthcare', 'Fintech', 'E-commerce', 'Education', 'SaaS', 'AI/ML', 'Blockchain', 
                'Real Estate', 'Food & Beverage', 'Transportation', 'Energy', 'Entertainment', 'Manufacturing', 
                'Retail', 'Media', 'Travel', 'Sports', 'Gaming', 'Fashion']
                .filter(ind => !yourIndustries.includes(ind))
                .map((industry) => (
                  <option key={industry} value={industry}>{industry}</option>
                ))}
            </select>

            {yourIndustries.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {yourIndustries.map((industry) => (
                  <span
                    key={industry}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-xl text-sm font-medium"
                  >
                    {industry}
                    <button
                      onClick={() => removeIndustry(industry)}
                      className="hover:bg-white/20 rounded-full p-0.5 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </span>
                ))}
              </div>
            )}

            {/* Background Description */}
            <div className="mb-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Describe Your Background</h3>
              <textarea
                value={yourBackground}
                onChange={(e) => setYourBackground(e.target.value)}
                placeholder="Tell cofounders about your professional journey, previous companies, achievements, or relevant experience..."
                className="w-full h-32 p-4 bg-white border border-gray-300 rounded-2xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent resize-none"
              />
            </div>

            {/* Skills and Experience Grid - No boxes */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Your Skills */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Your Key Skills & Expertise</h3>
                <p className="text-gray-600 text-sm mb-4">What are you great at? Select all that apply</p>
                
                <select
                  onChange={handleSkillSelect}
                  className="w-full p-4 bg-white border border-gray-300 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent mb-4"
                >
                  <option value="">+ Add Skill</option>
                  {['Technical Development', 'Product Management', 'Marketing', 'Sales', 'Operations', 'Finance', 
                    'Design', 'Business Strategy', 'Fundraising', 'Legal', 'HR', 'Data Analysis', 'AI/ML', 
                    'Blockchain', 'Mobile Development', 'Backend Development', 'Frontend Development', 'DevOps', 
                    'UX/UI Design', 'Growth Hacking', 'Content Marketing', 'SEO/SEM', 'Social Media', 'PR']
                    .filter(sk => !yourSkills.includes(sk))
                    .map((skill) => (
                      <option key={skill} value={skill}>{skill}</option>
                    ))}
                </select>

                {yourSkills.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {yourSkills.map((skill) => (
                      <span
                        key={skill}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-xl text-sm font-medium"
                      >
                        {skill}
                        <button
                          onClick={() => removeSkill(skill)}
                          className="hover:bg-white/20 rounded-full p-0.5 transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Your Experience Level */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Your Experience Level</h3>
                <p className="text-gray-600 text-sm mb-4">Years of professional experience</p>
                <select
                  value={yourExperience}
                  onChange={(e) => setYourExperience(e.target.value)}
                  className="w-full p-4 bg-white border border-gray-300 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                >
                  <option value="">Select experience level</option>
                  <option value="entry">Entry Level (0-2 years)</option>
                  <option value="mid">Mid Level (3-5 years)</option>
                  <option value="senior">Senior Level (6-10 years)</option>
                  <option value="executive">Executive (10+ years)</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Core Values */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-normal text-gray-900">What Drives You?</h2>
            <div className="flex items-center gap-3">
              <span className={`text-sm font-medium ${selectedValues.length >= 5 ? 'text-green-600' : 'text-gray-600'}`}>
                {selectedValues.length}/5 selected
              </span>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((num) => (
                  <div
                    key={num}
                    className={`w-2 h-2 rounded-full transition-colors ${
                      num <= selectedValues.length ? 'bg-gray-900' : 'bg-gray-300'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
          <p className="text-gray-600 mb-8">Choose up to 5 values across all categories that define who you are</p>
          
          <div className="space-y-6">
            {valueGroups.map((group) => (
              <div key={group.category}>
                <h3 className="text-sm font-medium text-gray-500 mb-3 uppercase tracking-wide">{group.category}</h3>
                <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                  {group.values.map((value) => {
                    const isSelected = selectedValues.includes(value.id);
                    const rank = selectedValues.indexOf(value.id) + 1;
                    const isDisabled = !isSelected && selectedValues.length >= 5;
                    
                    return (
                      <button
                        key={value.id}
                        onClick={() => handleValueToggle(value.id)}
                        disabled={isDisabled}
                        className={`relative p-4 rounded-xl border-2 transition-all duration-200 hover:scale-105 disabled:opacity-30 disabled:cursor-not-allowed ${
                          isSelected
                            ? 'bg-gray-900 border-gray-900 shadow-md'
                            : 'bg-white border-gray-300 hover:border-gray-400 hover:bg-gray-50'
                        }`}
                      >
                        <div className="flex flex-col items-center justify-center">
                          <h3 className={`font-medium text-sm text-center ${isSelected ? 'text-white' : 'text-gray-900'}`}>
                            {value.name}
                          </h3>
                          {isSelected && (
                            <div className="absolute -top-2 -right-2 w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-md border border-gray-200">
                              <span className="text-gray-900 font-bold text-xs">{rank}</span>
                            </div>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Intent Choice */}
        <div className="mb-12">
          <h2 className="text-2xl font-normal text-gray-900 mb-6 text-center">Why You're Here?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {intents.map((intent) => {
              const Icon = intent.icon;
              const isSelected = selectedIntent === intent.id;
              return (
                <button
                  key={intent.id}
                  onClick={() => handleIntentSelect(intent.id)}
                  className={`p-8 rounded-3xl border-2 transition-all duration-200 hover:scale-105 ${
                    isSelected
                      ? 'bg-gray-900 border-gray-900 shadow-md'
                      : 'bg-white border-gray-300 hover:border-gray-400 hover:bg-gray-50'
                  }`}
                >
                  <div className="text-center">
                    <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center ${
                      isSelected ? 'bg-white' : 'bg-gray-100'
                    }`}>
                      <Icon className={`w-8 h-8 ${isSelected ? 'text-gray-900' : 'text-gray-600'}`} />
                    </div>
                    <h3 className={`text-xl font-semibold mb-2 ${isSelected ? 'text-white' : 'text-gray-900'}`}>{intent.title}</h3>
                    <p className={`text-sm ${isSelected ? 'text-gray-300' : 'text-gray-600'}`}>{intent.description}</p>
                    {isSelected && (
                      <div className="mt-4 flex items-center justify-center gap-2 text-white">
                        <CheckCircle className="w-5 h-5" />
                        <span className="text-sm font-medium">Selected</span>
                      </div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <button
            onClick={handleBack}
            className="px-6 py-3 bg-white border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all duration-200 flex items-center gap-2"
          >
            <ArrowLeft className="w-5 h-5" />
            Back
          </button>

          {isComplete && (
            <button
              onClick={handleContinue}
              className="px-12 py-4 bg-gray-900 text-white rounded-2xl hover:bg-black transition-all duration-200 font-medium text-lg shadow-md hover:shadow-lg flex items-center gap-3"
            >
              <span>Find My Cofounder →</span>
              <ArrowRight className="w-6 h-6" />
            </button>
          )}
        </div>

        {/* Progress Indicator */}
        <div className="mt-12 flex justify-center">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
            <div className="w-3 h-3 bg-gray-900 rounded-full"></div>
            <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
          </div>
        </div>
      </div>
      </div>
    </>
  );
};

export default QuickSetup;