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

  const handleContinue = () => {
    if (selectedValues.length >= 1 && selectedIntent) {
      // Save to localStorage
      localStorage.setItem('whyHere', missionStatement || 'Building the future');
      localStorage.setItem('selectedValues', JSON.stringify(selectedValues));
      localStorage.setItem('selectedIntent', selectedIntent);
      if (hasVoiceNote) {
        localStorage.setItem('hasVoiceNote', 'true');
      }
      if (pitchDeckFile) {
        localStorage.setItem('pitchDeckFileName', pitchDeckFile.name);
        localStorage.setItem('pitchDeckFileSize', pitchDeckFile.size.toString());
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

            {/* Voice Note and Pitch Deck Options */}
            <div className="flex items-center gap-4 flex-wrap">
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
                    Record Your Pitch (60s)
                  </>
                )}
              </button>
              
              {hasVoiceNote && (
                <button className="p-2 text-gray-400 hover:text-white transition-colors">
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
                  className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center gap-2 cursor-pointer ${
                    pitchDeckFile
                      ? 'bg-green-500 text-white hover:bg-green-600'
                      : isUploading
                      ? 'bg-purple-500 text-white opacity-50 cursor-not-allowed'
                      : 'bg-white/10 text-white hover:bg-white/20'
                  }`}
                >
                  {isUploading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
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
                  className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                  title="Remove pitch deck"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>
        </div>


        {/* Core Values */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-6 text-center">What Drives You? (Select Up to 5)</h2>
          <p className="text-gray-300 text-center mb-8">Choose the values that define who you are and what you stand for</p>
          <div className="relative min-h-[500px] overflow-hidden">
            {values.map((value, index) => {
              const isSelected = selectedValues.includes(value.id);
              const rank = selectedValues.indexOf(value.id) + 1;
              const isDisabled = !isSelected && selectedValues.length >= 5;
              
              // Better random positioning to avoid overlaps
              const randomX = Math.random() * 75 + 5; // 5-80% of container width
              const randomY = Math.random() * 75 + 5; // 5-80% of container height
              const randomSize = Math.random() * 50 + 50; // 50-100px diameter
              const randomDelay = Math.random() * 2; // Random animation delay 0-2s
              const shouldGlow = Math.random() > 0.7; // 30% chance for glow effect
              
              return (
                <button
                  key={value.id}
                  onClick={() => handleValueToggle(value.id)}
                  disabled={isDisabled}
                  className={`absolute rounded-full border-2 transition-all duration-500 hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed ${
                    isSelected
                      ? `bg-gradient-to-r ${value.color} border-white shadow-2xl`
                      : 'bg-white/10 border-white/20 hover:border-white/40 hover:bg-white/20'
                  } ${shouldGlow && !isSelected ? 'bubble-glow' : ''}`}
                  style={{
                    left: `${randomX}%`,
                    top: `${randomY}%`,
                    width: `${randomSize}px`,
                    height: `${randomSize}px`,
                    animationDelay: `${randomDelay}s`,
                    animation: isAnimating ? 'bubbleFloat 0.6s ease-in-out' : 'none',
                    zIndex: isSelected ? 10 : 1
                  }}
                >
                  <div className="flex items-center justify-center h-full">
                    <h3 className={`font-bold text-white text-center px-2 ${
                      randomSize < 70 ? 'text-xs' : randomSize < 85 ? 'text-sm' : 'text-base'
                    }`}>
                      {value.name}
                    </h3>
                    {isSelected && (
                      <div className="absolute -top-2 -right-2 w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-lg z-20">
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
    </>
  );
};

export default QuickSetup;