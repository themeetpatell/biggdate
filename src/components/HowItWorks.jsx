import React, { useState } from 'react';
import { X, ChevronLeft, ChevronRight, Send, Eye, Heart, CheckCircle, Zap, Star, Target, Users, MessageCircle, Calendar, Trophy, ArrowRight, ArrowLeft } from 'lucide-react';

const HowItWorks = ({ isOpen, onClose }) => {
  const [currentLevel, setCurrentLevel] = useState(0);

  const levels = [
    {
      id: 'pitch',
      title: 'Level 1: Pitch Mode',
      subtitle: 'Seed Stage - The First Impression',
      description: 'Send and receive 140-character pitches. No names, no photos - just pure potential.',
      icon: Send,
      color: 'from-blue-500 to-cyan-500',
      bgColor: 'from-blue-50 to-cyan-50',
      features: [
        'Anonymous pitch cards',
        'Daily pitch limits (gamified)',
        'Accept, Pass, or Save for later',
        'Tokens for pitch boosters'
      ],
      example: '"Looking for a technical co-founder who shares my vision of democratizing AI..."',
      stage: 'Seed'
    },
    {
      id: 'reveal',
      title: 'Level 2: Reveal Mode',
      subtitle: 'Series A Stage - The Vision Unfolds',
      description: 'Unlocked only on mutual pitch acceptance. See their vision, values, and startup stage.',
      icon: Eye,
      color: 'from-purple-500 to-pink-500',
      bgColor: 'from-purple-50 to-pink-50',
      features: [
        'Vision cards with role & startup stage',
        'Shared values & interests overlap',
        'Optional voice notes & creative reveals',
        'Decision: Move forward or end connection'
      ],
      example: '"Founder • Seed Stage • Building the future of sustainable energy..."',
      stage: 'Series A'
    },
    {
      id: 'journey',
      title: 'Level 3: Journey Mode',
      subtitle: 'Unicorn Stage - The Full Connection',
      description: 'Identity reveal, guided conversations, and collaborative features.',
      icon: Heart,
      color: 'from-green-500 to-emerald-500',
      bgColor: 'from-green-50 to-emerald-50',
      features: [
        'Real name, photo, detailed profile',
        'Guided conversation prompts',
        'Milestone tracking & gamification',
        'Collaborative features & shared goals'
      ],
      example: '"Sarah Chen • CTO at EcoTech • Let\'s build something amazing together..."',
      stage: 'Unicorn'
    }
  ];

  const currentLevelData = levels[currentLevel];

  const handleNext = () => {
    if (currentLevel < levels.length - 1) {
      setCurrentLevel(currentLevel + 1);
    }
  };

  const handlePrev = () => {
    if (currentLevel > 0) {
      setCurrentLevel(currentLevel - 1);
    }
  };

  const handleLevelClick = (index) => {
    setCurrentLevel(index);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
      <div className="relative w-full max-w-4xl mx-4 bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden">
        {/* Header */}
        <div className="relative h-32 bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 flex items-center justify-center">
          <div className="text-center text-white">
            <div className="flex items-center justify-center gap-3 mb-2">
              <div className="w-8 h-8 bg-white bg-opacity-20 rounded-xl flex items-center justify-center">
                <Star className="w-5 h-5" />
              </div>
              <h1 className="text-3xl font-bold">How BiggDate Works</h1>
            </div>
            <p className="text-lg opacity-90">Most apps are digital only. We built a movement that lives offline too.</p>
          </div>
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-10 h-10 bg-white bg-opacity-20 backdrop-blur-sm text-white rounded-xl hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-8">
          {/* Level Navigation */}
          <div className="flex items-center justify-center mb-8">
            <div className="flex items-center gap-2">
              {levels.map((_, index) => (
                <button
                  key={index}
                  onClick={() => handleLevelClick(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentLevel
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500 scale-125'
                      : index < currentLevel
                      ? 'bg-gradient-to-r from-green-500 to-emerald-500'
                      : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Current Level Card */}
          <div className={`bg-gradient-to-br ${currentLevelData.bgColor} rounded-3xl p-8 border border-gray-100`}>
            <div className="flex items-start gap-6 mb-6">
              <div className={`w-16 h-16 bg-gradient-to-r ${currentLevelData.color} rounded-2xl flex items-center justify-center flex-shrink-0`}>
                <currentLevelData.icon className="w-8 h-8 text-white" />
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">{currentLevelData.title}</h2>
                <p className="text-lg text-gray-600 mb-3">{currentLevelData.subtitle}</p>
                <p className="text-gray-700">{currentLevelData.description}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Features */}
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-4">What you'll experience:</h3>
                <div className="space-y-3">
                  {currentLevelData.features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                      <span className="text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Example */}
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-4">Example:</h3>
                <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm">
                  <p className="text-gray-600 italic">"{currentLevelData.example}"</p>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between mt-8">
            <div className="flex items-center gap-4">
              <button
                onClick={handlePrev}
                disabled={currentLevel === 0}
                className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </button>
            </div>

            <div className="flex items-center gap-4">
              {currentLevel === levels.length - 1 ? (
                <button
                  onClick={onClose}
                  className="px-8 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-2xl hover:from-green-600 hover:to-emerald-600 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl"
                >
                  <Zap className="w-5 h-5 inline mr-2" />
                  Start Your Journey
                </button>
              ) : (
                <button
                  onClick={handleNext}
                  className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-2xl hover:from-purple-600 hover:to-pink-600 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl"
                >
                  Next Level
                  <ArrowRight className="w-4 h-4 inline ml-2" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Footer Quote */}
        <div className="px-8 pb-6">
          <p className="text-center text-gray-500 italic">
            "Each step feels like funding rounds → Seed (meet), Series A (bond), Unicorn (commit)."
          </p>
        </div>
      </div>
    </div>
  );
};

export default HowItWorks;
