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
  Volume2
} from 'lucide-react';

const QuickSetup = () => {
  const [missionStatement, setMissionStatement] = useState('');
  const [selectedValues, setSelectedValues] = useState([]);
  const [selectedIntent, setSelectedIntent] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [hasVoiceNote, setHasVoiceNote] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const navigate = useNavigate();

  const missionPrompts = [
    "I'm creating the future of...",
    "My life's purpose is to...",
    "The impact I want to make is...",
    "What drives me every day is...",
    "I'm on a mission to...",
    "My core belief is that..."
  ];

  const values = [
    { id: 'innovation', name: 'Innovation', color: 'from-blue-500 to-cyan-500' },
    { id: 'growth', name: 'Growth', color: 'from-green-500 to-emerald-500' },
    { id: 'adventure', name: 'Adventure', color: 'from-purple-500 to-pink-500' },
    { id: 'authenticity', name: 'Authenticity', color: 'from-red-500 to-rose-500' },
    { id: 'impact', name: 'Impact', color: 'from-yellow-500 to-orange-500' },
    { id: 'freedom', name: 'Freedom', color: 'from-indigo-500 to-purple-500' },
    { id: 'legacy', name: 'Legacy', color: 'from-gray-500 to-gray-600' },
    { id: 'connection', name: 'Connection', color: 'from-pink-500 to-purple-500' },
    { id: 'creativity', name: 'Creativity', color: 'from-pink-500 to-rose-500' },
    { id: 'excellence', name: 'Excellence', color: 'from-yellow-500 to-amber-500' },
    { id: 'integrity', name: 'Integrity', color: 'from-blue-500 to-indigo-500' },
    { id: 'passion', name: 'Passion', color: 'from-red-500 to-pink-500' },
    { id: 'wisdom', name: 'Wisdom', color: 'from-purple-500 to-indigo-500' },
    { id: 'courage', name: 'Courage', color: 'from-orange-500 to-red-500' },
    { id: 'compassion', name: 'Compassion', color: 'from-green-500 to-teal-500' },
    { id: 'balance', name: 'Balance', color: 'from-cyan-500 to-blue-500' },
    { id: 'ambition', name: 'Ambition', color: 'from-purple-500 to-pink-500' },
    { id: 'humility', name: 'Humility', color: 'from-gray-500 to-slate-500' },
    { id: 'resilience', name: 'Resilience', color: 'from-orange-500 to-yellow-500' },
    { id: 'curiosity', name: 'Curiosity', color: 'from-cyan-500 to-teal-500' },
    { id: 'empathy', name: 'Empathy', color: 'from-pink-500 to-purple-500' },
    { id: 'discipline', name: 'Discipline', color: 'from-slate-500 to-gray-500' },
    { id: 'optimism', name: 'Optimism', color: 'from-yellow-500 to-orange-500' },
    { id: 'gratitude', name: 'Gratitude', color: 'from-green-500 to-emerald-500' },
    { id: 'leadership', name: 'Leadership', color: 'from-indigo-500 to-purple-500' }
  ];

  const intents = [
    {
      id: 'co-lover',
      title: 'Co-Lover',
      description: 'Focus on personal connection, romance, and life partnership',
      icon: Heart,
      color: 'from-red-500 to-pink-500'
    },
    {
      id: 'co-builder',
      title: 'Co-Builder',
      description: 'Looking for someone to build businesses and careers together',
      icon: Target,
      color: 'from-blue-500 to-cyan-500'
    },
    {
      id: 'co-lifer',
      title: 'Co-Lifer',
      description: 'A life partner who shares your vision, supports your dreams, and grows with you in both love and ambition',
      icon: Crown,
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

  const handleContinue = () => {
    if (selectedValues.length >= 1 && selectedIntent) {
      // Save to localStorage
      localStorage.setItem('whyHere', missionStatement || 'Building the future');
      localStorage.setItem('selectedValues', JSON.stringify(selectedValues));
      localStorage.setItem('selectedIntent', selectedIntent);
      if (hasVoiceNote) {
        localStorage.setItem('hasVoiceNote', 'true');
      }
      
      // Navigate to next step
      navigate('/onboarding/pitch');
    }
  };

  const handleBack = () => {
    navigate('/onboarding/role');
  };

  const isComplete = selectedValues.length >= 1 && selectedIntent;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-indigo-900 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-sm px-6 py-3 rounded-full mb-6">
            <Heart className="w-6 h-6 text-pink-400" />
            <span className="text-white font-semibold">Your Story Matters</span>
          </div>
          <h1 className="text-5xl font-bold text-white mb-4">
            What's Your Mission?
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Share your vision, values, and what drives you. Your Co-Lifer is waiting to hear your story.
          </p>
        </div>

        {/* Mission Statement */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-6 text-center">Share Your Vision</h2>
          <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 border border-white/20">
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-white mb-4">What drives you? Complete this thought:</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {missionPrompts.map((prompt, index) => (
                  <button
                    key={index}
                    onClick={() => setMissionStatement(prompt)}
                    className={`p-3 rounded-xl text-left transition-all duration-300 ${
                      missionStatement === prompt
                        ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                        : 'bg-white/10 text-gray-300 hover:bg-white/20 hover:text-white'
                    }`}
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="mb-6">
              <label className="block text-white font-semibold mb-3">Share your complete vision:</label>
              <textarea
                value={missionStatement}
                onChange={(e) => setMissionStatement(e.target.value)}
                placeholder="Tell your Co-Lifer what you're building and why it matters..."
                className="w-full h-32 p-4 bg-white/10 border border-white/20 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
              />
            </div>

            {/* Voice Note Option */}
            <div className="flex items-center gap-4">
              <button
                onClick={handleVoiceRecord}
                className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center gap-2 ${
                  isRecording
                    ? 'bg-red-500 text-white hover:bg-red-600'
                    : hasVoiceNote
                    ? 'bg-green-500 text-white hover:bg-green-600'
                    : 'bg-white/10 text-white hover:bg-white/20'
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
                    Record Your Pitch (20s)
                  </>
                )}
              </button>
              {hasVoiceNote && (
                <button className="p-2 text-gray-400 hover:text-white transition-colors">
                  <Play className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Core Values */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-6 text-center">What Drives You? (Select Up to 5)</h2>
          <p className="text-gray-300 text-center mb-8">Choose the values that define who you are and what you stand for</p>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {values.map((value) => {
              const isSelected = selectedValues.includes(value.id);
              const rank = selectedValues.indexOf(value.id) + 1;
              const isDisabled = !isSelected && selectedValues.length >= 5;
              
              return (
                <button
                  key={value.id}
                  onClick={() => handleValueToggle(value.id)}
                  disabled={isDisabled}
                  className={`relative p-4 rounded-xl border-2 transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed ${
                    isSelected
                      ? `bg-gradient-to-r ${value.color} border-white shadow-xl`
                      : 'bg-white/10 border-white/20 hover:border-white/40 hover:bg-white/20'
                  }`}
                >
                  <div className="text-center">
                    <h3 className="text-sm font-bold text-white mb-1">{value.name}</h3>
                    {isSelected && (
                      <div className="absolute -top-2 -right-2 w-6 h-6 bg-white rounded-full flex items-center justify-center">
                        <span className="text-gray-900 font-bold text-xs">{rank}</span>
                      </div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Intent Choice */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-6 text-center">Why You're Here?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {intents.map((intent) => {
              const Icon = intent.icon;
              const isSelected = selectedIntent === intent.id;
              return (
                <button
                  key={intent.id}
                  onClick={() => handleIntentSelect(intent.id)}
                  className={`p-8 rounded-3xl border-2 transition-all duration-300 hover:scale-105 ${
                    isSelected
                      ? `bg-gradient-to-r ${intent.color} border-white shadow-2xl`
                      : 'bg-white/10 border-white/20 hover:border-white/40 hover:bg-white/20'
                  }`}
                >
                  <div className="text-center">
                    <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center ${
                      isSelected ? 'bg-white/20' : `bg-gradient-to-r ${intent.color}`
                    }`}>
                      <Icon className={`w-8 h-8 ${isSelected ? 'text-white' : 'text-white'}`} />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">{intent.title}</h3>
                    <p className="text-gray-300 text-sm">{intent.description}</p>
                    {isSelected && (
                      <div className="mt-4 flex items-center justify-center gap-2 text-white">
                        <CheckCircle className="w-5 h-5" />
                        <span className="text-sm font-semibold">Selected</span>
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
            className="px-6 py-3 bg-white/10 text-white rounded-xl hover:bg-white/20 transition-all duration-300 flex items-center gap-2"
          >
            <ArrowLeft className="w-5 h-5" />
            Back
          </button>

          {isComplete && (
            <button
              onClick={handleContinue}
              className="px-12 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-2xl hover:from-purple-600 hover:to-pink-600 transition-all duration-300 font-bold text-lg shadow-2xl hover:shadow-purple-500/25 hover:scale-105 flex items-center gap-3"
            >
              <span>I am finding someone like →</span>
              <ArrowRight className="w-6 h-6" />
            </button>
          )}
        </div>

        {/* Progress Indicator */}
        <div className="mt-12 flex justify-center">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-gray-600 rounded-full"></div>
            <div className="w-3 h-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"></div>
            <div className="w-3 h-3 bg-gray-600 rounded-full"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickSetup;