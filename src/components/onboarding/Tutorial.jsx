import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Send, 
  Eye, 
  Heart, 
  ArrowRight, 
  ArrowLeft, 
  CheckCircle, 
  Star, 
  Zap, 
  Target, 
  Crown, 
  Rocket, 
  Diamond, 
  Flame, 
  Shield,
  Sparkles,
  Users,
  MessageCircle,
  Calendar,
  Trophy,
  Globe,
  Brain,
  Lightbulb
} from 'lucide-react';

const Tutorial = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const navigate = useNavigate();

  const steps = [
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
      stage: 'Seed',
      emotion: 'I belong here. This is my tribe. I\'m masked until I pitch.'
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
      stage: 'Series A',
      emotion: 'I\'m not filling a form, I\'m declaring my Why.'
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
      stage: 'Unicorn',
      emotion: 'Each step feels like funding rounds → Seed (meet), Series A (bond), Unicorn (commit).'
    }
  ];

  const currentStepData = steps[currentStep];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setIsAnimating(true);
      setCurrentStep(currentStep + 1);
      setTimeout(() => setIsAnimating(false), 300);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setIsAnimating(true);
      setCurrentStep(currentStep - 1);
      setTimeout(() => setIsAnimating(false), 300);
    }
  };

  const handleComplete = () => {
    // Mark onboarding as complete
    localStorage.setItem('onboardingComplete', 'true');
    
    // Navigate to home
    navigate('/home');
  };

  const handleBack = () => {
    navigate('/onboarding/pitch');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-indigo-900 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-sm px-6 py-3 rounded-full mb-6">
            <Sparkles className="w-6 h-6 text-yellow-400" />
            <span className="text-white font-semibold">Welcome to the Movement</span>
          </div>
          <h1 className="text-5xl font-bold text-white mb-4">
            How BiggDate Works
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Most apps are digital only. We built a movement that lives offline too.
          </p>
        </div>

        {/* Step Navigation */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center gap-2">
            {steps.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  setIsAnimating(true);
                  setCurrentStep(index);
                  setTimeout(() => setIsAnimating(false), 300);
                }}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentStep
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 scale-125'
                    : index < currentStep
                    ? 'bg-gradient-to-r from-green-500 to-emerald-500'
                    : 'bg-gray-600'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Current Step Card */}
        <div className={`bg-gradient-to-br ${currentStepData.bgColor} rounded-3xl p-8 border border-white/20 shadow-2xl`}>
          <div className="flex items-start gap-6 mb-6">
            <div className={`w-16 h-16 bg-gradient-to-r ${currentStepData.color} rounded-2xl flex items-center justify-center flex-shrink-0`}>
              <currentStepData.icon className="w-8 h-8 text-white" />
            </div>
            <div className="flex-1">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">{currentStepData.title}</h2>
              <p className="text-xl text-gray-600 mb-3">{currentStepData.subtitle}</p>
              <p className="text-gray-700 text-lg">{currentStepData.description}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Features */}
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-4">What you'll experience:</h3>
              <div className="space-y-3">
                {currentStepData.features.map((feature, index) => (
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
                <p className="text-gray-600 italic">"{currentStepData.example}"</p>
              </div>
            </div>
          </div>

          {/* Emotion Quote */}
          <div className="mt-8 p-6 bg-white/50 rounded-2xl">
            <p className="text-center text-gray-700 italic text-lg">
              "{currentStepData.emotion}"
            </p>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between mt-8">
          <div className="flex items-center gap-4">
            {currentStep > 0 ? (
              <button
                onClick={handlePrev}
                className="flex items-center gap-2 px-6 py-3 text-white hover:text-gray-300 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                Back
              </button>
            ) : (
              <button
                onClick={handleBack}
                className="flex items-center gap-2 px-6 py-3 text-white hover:text-gray-300 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                Back to Pitch
              </button>
            )}
          </div>

          <div className="flex items-center gap-4">
            {currentStep === steps.length - 1 ? (
              <button
                onClick={handleComplete}
                className="px-12 py-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-2xl hover:from-green-600 hover:to-emerald-600 transition-all duration-300 font-bold text-lg shadow-2xl hover:shadow-green-500/25 hover:scale-105 flex items-center gap-3"
              >
                <span>Start Dating</span>
                <ArrowRight className="w-6 h-6" />
              </button>
            ) : (
              <button
                onClick={handleNext}
                className="px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-2xl hover:from-purple-600 hover:to-pink-600 transition-all duration-300 font-bold text-lg shadow-2xl hover:shadow-purple-500/25 hover:scale-105 flex items-center gap-3"
              >
                Next Level
                <ArrowRight className="w-6 h-6" />
              </button>
            )}
          </div>
        </div>

        {/* Progress Indicator */}
        <div className="mt-12 flex justify-center">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"></div>
            <div className="w-3 h-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"></div>
            <div className="w-3 h-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Tutorial;