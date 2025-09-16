import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowRight, 
  ArrowLeft, 
  Mic, 
  MicOff, 
  Play, 
  Pause, 
  RotateCcw,
  Volume2,
  Type,
  Image,
  Sparkles,
  Eye,
  Send,
  CheckCircle,
  Star,
  Zap,
  Target,
  Crown,
  Rocket,
  Diamond,
  Flame,
  Shield,
  Heart,
  Globe,
  Sword,
  Trophy
} from 'lucide-react';

const AnonymousProfile = () => {
  const [pitchText, setPitchText] = useState('');
  const [pitchFormat, setPitchFormat] = useState('text');
  const [isRecording, setIsRecording] = useState(false);
  const [hasVoiceNote, setHasVoiceNote] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const navigate = useNavigate();

  // Get user data from previous steps
  const userRole = localStorage.getItem('userRole') || 'founder';
  const userStage = localStorage.getItem('userStage') || 'seed';
  const userMask = localStorage.getItem('userMask') || 'rocket';
  const selectedValues = JSON.parse(localStorage.getItem('selectedValues') || '[]');

  const pitchPrompts = [
    "I'm building the next...",
    "People say my superpower is...",
    "If love was a startup, I'd be the...",
    "I'm looking for someone who...",
    "My vision is to...",
    "I believe in...",
    "The future I see is...",
    "I'm here to..."
  ];

  const pitchFormats = [
    {
      id: 'text',
      title: 'Text Pitch',
      description: 'Write your story in words',
      icon: Type,
      color: 'from-blue-500 to-cyan-500',
      bgColor: 'from-blue-50 to-cyan-50'
    },
    {
      id: 'voice',
      title: 'Voice Pitch',
      description: 'Speak your truth (20 seconds)',
      icon: Mic,
      color: 'from-green-500 to-emerald-500',
      bgColor: 'from-green-50 to-emerald-50'
    },
    {
      id: 'visual',
      title: 'Visual Pitch',
      description: 'AI-generated symbolic image',
      icon: Image,
      color: 'from-purple-500 to-pink-500',
      bgColor: 'from-purple-50 to-pink-50'
    }
  ];

  const masks = {
    rocket: { emoji: '🚀', color: 'from-blue-500 to-cyan-500', name: 'The Innovator' },
    diamond: { emoji: '💎', color: 'from-purple-500 to-pink-500', name: 'The Rare Gem' },
    flame: { emoji: '🔥', color: 'from-orange-500 to-red-500', name: 'The Passionate' },
    crown: { emoji: '👑', color: 'from-yellow-500 to-orange-500', name: 'The Leader' },
    star: { emoji: '⭐', color: 'from-indigo-500 to-purple-500', name: 'The Shining Light' },
    shield: { emoji: '🛡️', color: 'from-green-500 to-emerald-500', name: 'The Protector' }
  };

  const stages = {
    idea: 'Idea Stage',
    seed: 'Seed Stage',
    growth: 'Growth Stage',
    exit: 'Exit Stage',
    angel: 'Angel',
    'vc-seed': 'VC Seed',
    'growth-capital': 'Growth Capital',
    'family-office': 'Family Office',
    'early-builder': 'Early Builder',
    'scaling-operator': 'Scaling Builder',
    'growth-leader': 'Growth Leader',
    'veteran-operator': 'Veteran Builder'
  };

  const handleFormatSelect = (formatId) => {
    setIsAnimating(true);
    setPitchFormat(formatId);
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
    // Save to localStorage
    localStorage.setItem('pitchSlot', pitchText || 'Ready to build something amazing');
    localStorage.setItem('pitchFormat', pitchFormat);
    if (hasVoiceNote) {
      localStorage.setItem('hasVoiceNote', 'true');
    }
    
    // Navigate to tutorial
    navigate('/onboarding/tutorial');
  };

  const handleBack = () => {
    navigate('/onboarding/mission');
  };

  const currentMask = masks[userMask] || masks.rocket;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-indigo-900 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-sm px-6 py-3 rounded-full mb-6">
            <Sword className="w-6 h-6 text-red-400" />
            <span className="text-white font-semibold">The Arena Awaits</span>
          </div>
          <h1 className="text-5xl font-bold text-white mb-4">
            Enter the Arena
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Every great story starts with a pitch. This is yours.
          </p>
        </div>

        {/* Your Identity Card */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-6 text-center">Your Identity</h2>
          <div className="max-w-md mx-auto">
            <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-6 border border-white/20">
              <div className="flex items-center gap-4 mb-4">
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center bg-gradient-to-r ${currentMask.color}`}>
                  <span className="text-2xl">{currentMask.emoji}</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white capitalize">{userRole}</h3>
                  <p className="text-gray-300 text-sm">{stages[userStage]}</p>
                  <p className="text-gray-400 text-xs">{currentMask.name}</p>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-2">
                {selectedValues.slice(0, 3).map((value, index) => (
                  <span key={index} className="px-3 py-1 bg-white/20 text-white text-xs rounded-full">
                    {value}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Pitch Format Selection */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-6 text-center">Choose Your Weapon</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {pitchFormats.map((format) => {
              const Icon = format.icon;
              const isSelected = pitchFormat === format.id;
              return (
                <button
                  key={format.id}
                  onClick={() => handleFormatSelect(format.id)}
                  className={`p-8 rounded-3xl border-2 transition-all duration-300 hover:scale-105 ${
                    isSelected
                      ? `bg-gradient-to-r ${format.color} border-white shadow-2xl`
                      : 'bg-white/10 border-white/20 hover:border-white/40 hover:bg-white/20'
                  }`}
                >
                  <div className="text-center">
                    <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center ${
                      isSelected ? 'bg-white/20' : `bg-gradient-to-r ${format.color}`
                    }`}>
                      <Icon className={`w-8 h-8 ${isSelected ? 'text-white' : 'text-white'}`} />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">{format.title}</h3>
                    <p className="text-gray-300 text-sm">{format.description}</p>
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

        {/* Pitch Creation */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-6 text-center">Craft Your Pitch</h2>
          
          {pitchFormat === 'text' && (
            <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 border border-white/20">
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-white mb-4">Complete this thought:</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {pitchPrompts.map((prompt, index) => (
                    <button
                      key={index}
                      onClick={() => setPitchText(prompt)}
                      className={`p-3 rounded-xl text-left transition-all duration-300 ${
                        pitchText === prompt
                          ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                          : 'bg-white/10 text-gray-300 hover:bg-white/20 hover:text-white'
                      }`}
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              </div>
              
              <div>
                <label className="block text-white font-semibold mb-3">Your pitch:</label>
                <textarea
                  value={pitchText}
                  onChange={(e) => setPitchText(e.target.value)}
                  placeholder="Tell your story..."
                  className="w-full h-32 p-4 bg-white/10 border border-white/20 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                />
                <div className="mt-2 text-right text-gray-400 text-sm">
                  {pitchText.length} characters
                </div>
              </div>
            </div>
          )}

          {pitchFormat === 'voice' && (
            <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 border border-white/20 text-center">
              <h3 className="text-lg font-semibold text-white mb-6">Record Your Voice Pitch</h3>
              <div className="mb-6">
                <button
                  onClick={handleVoiceRecord}
                  className={`w-24 h-24 rounded-full font-bold text-lg transition-all duration-300 flex items-center justify-center mx-auto ${
                    isRecording
                      ? 'bg-red-500 text-white hover:bg-red-600 animate-pulse'
                      : hasVoiceNote
                      ? 'bg-green-500 text-white hover:bg-green-600'
                      : 'bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:from-green-600 hover:to-emerald-600'
                  }`}
                >
                  {isRecording ? (
                    <Pause className="w-8 h-8" />
                  ) : hasVoiceNote ? (
                    <CheckCircle className="w-8 h-8" />
                  ) : (
                    <Mic className="w-8 h-8" />
                  )}
                </button>
              </div>
              <p className="text-gray-300 mb-4">
                {isRecording ? 'Recording... (20 seconds max)' : 
                 hasVoiceNote ? 'Voice note recorded successfully!' : 
                 'Tap to record your pitch (20 seconds)'}
              </p>
              {hasVoiceNote && (
                <div className="flex items-center justify-center gap-4">
                  <button className="p-2 text-gray-400 hover:text-white transition-colors">
                    <Play className="w-6 h-6" />
                  </button>
                  <button 
                    onClick={() => setHasVoiceNote(false)}
                    className="p-2 text-gray-400 hover:text-white transition-colors"
                  >
                    <RotateCcw className="w-6 h-6" />
                  </button>
                </div>
              )}
            </div>
          )}

          {pitchFormat === 'visual' && (
            <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 border border-white/20 text-center">
              <h3 className="text-lg font-semibold text-white mb-6">AI-Generated Visual Pitch</h3>
              <div className="w-48 h-48 mx-auto mb-6 bg-gradient-to-br from-purple-500 to-pink-500 rounded-3xl flex items-center justify-center">
                <Sparkles className="w-16 h-16 text-white" />
              </div>
              <p className="text-gray-300 mb-6">
                We'll generate a symbolic image based on your profile and values
              </p>
              <button className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all duration-300">
                Generate Visual Pitch
              </button>
            </div>
          )}
        </div>

        {/* Preview Card */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-6 text-center">Preview Your Pitch Card</h2>
          <div className="max-w-md mx-auto">
            <div className="bg-white rounded-3xl p-6 shadow-2xl border border-gray-200">
              <div className="flex items-center gap-4 mb-4">
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center bg-gradient-to-r ${currentMask.color}`}>
                  <span className="text-2xl">{currentMask.emoji}</span>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 capitalize">{userRole}</h3>
                  <p className="text-gray-600 text-sm">{stages[userStage]}</p>
                </div>
              </div>
              
              <div className="mb-4">
                <p className="text-gray-700 text-sm">
                  {pitchFormat === 'text' ? pitchText || 'Ready to build something amazing' : 
                   pitchFormat === 'voice' ? '🎤 Voice pitch recorded' :
                   '🎨 Visual pitch generated'}
                </p>
              </div>
              
              <div className="flex flex-wrap gap-2">
                {selectedValues.slice(0, 3).map((value, index) => (
                  <span key={index} className="px-3 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                    {value}
                  </span>
                ))}
              </div>
            </div>
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

          <button
            onClick={handleContinue}
            className="px-12 py-4 bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-2xl hover:from-red-600 hover:to-orange-600 transition-all duration-300 font-bold text-lg shadow-2xl hover:shadow-red-500/25 hover:scale-105 flex items-center gap-3"
          >
            <span>Enter the Arena →</span>
            <Sword className="w-6 h-6" />
          </button>
        </div>

        {/* Progress Indicator */}
        <div className="mt-12 flex justify-center">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-gray-600 rounded-full"></div>
            <div className="w-3 h-3 bg-gray-600 rounded-full"></div>
            <div className="w-3 h-3 bg-gradient-to-r from-red-500 to-orange-500 rounded-full"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnonymousProfile;