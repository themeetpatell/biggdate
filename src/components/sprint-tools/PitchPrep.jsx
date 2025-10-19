import React, { useState, useEffect } from 'react';
import { ArrowLeft, Mic, Play, Pause, RotateCcw, CheckCircle, Clock, Target, Lightbulb } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const PitchPrep = () => {
  const navigate = useNavigate();
  const [pitchType, setPitchType] = useState('elevator');
  const [timerActive, setTimerActive] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [pitchNotes, setPitchNotes] = useState({
    elevator: '',
    investor: '',
    demo: ''
  });

  useEffect(() => {
    const saved = localStorage.getItem('pitchPrep');
    if (saved) {
      setPitchNotes(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    let interval;
    if (timerActive) {
      interval = setInterval(() => {
        setElapsedTime(t => t + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timerActive]);

  const pitchTypes = [
    {
      id: 'elevator',
      title: 'Elevator Pitch',
      duration: 60,
      description: 'Quick 30-60 second pitch',
      tips: [
        'Hook them in the first 5 seconds',
        'Clearly state the problem and solution',
        'End with a clear ask or next step',
        'Practice until you can do it naturally'
      ]
    },
    {
      id: 'investor',
      title: 'Investor Pitch',
      duration: 300,
      description: 'Detailed 3-5 minute pitch',
      tips: [
        'Start with a compelling story or stat',
        'Cover problem, solution, market, traction',
        'Show your team\'s expertise',
        'Be clear about your ask and use of funds'
      ]
    },
    {
      id: 'demo',
      title: 'Demo Day',
      duration: 180,
      description: 'Competition-style 2-3 minute pitch',
      tips: [
        'Maximum energy and enthusiasm',
        'Focus on traction and momentum',
        'Make it memorable with storytelling',
        'Practice timing to perfection'
      ]
    }
  ];

  const currentPitch = pitchTypes.find(p => p.id === pitchType);
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const toggleTimer = () => {
    setTimerActive(!timerActive);
  };

  const resetTimer = () => {
    setTimerActive(false);
    setElapsedTime(0);
  };

  const handleNotesChange = (value) => {
    const updated = { ...pitchNotes, [pitchType]: value };
    setPitchNotes(updated);
    localStorage.setItem('pitchPrep', JSON.stringify(updated));
  };

  const isOverTime = elapsedTime > currentPitch.duration;
  const timePercent = Math.min((elapsedTime / currentPitch.duration) * 100, 100);

  const questions = [
    'What problem are you solving?',
    'How big is the market opportunity?',
    'What makes your solution unique?',
    'Why is now the right time for this?',
    'Who are your competitors?',
    'What is your business model?',
    'What traction do you have?',
    'What are your key metrics?',
    'Who is on your team?',
    'What are the biggest risks?',
    'What do you need the money for?',
    'What are your next milestones?'
  ];

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
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Pitch Preparation</h1>
            <p className="text-gray-600">Practice and perfect your startup pitch</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Pitch Type Selector */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {pitchTypes.map(type => (
                <button
                  key={type.id}
                  onClick={() => { setPitchType(type.id); resetTimer(); }}
                  className={`p-6 rounded-2xl text-left transition-all ${
                    pitchType === type.id
                      ? 'bg-gray-900 text-white shadow-lg'
                      : 'bg-white text-gray-900 border border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <h3 className="font-bold text-lg mb-1">{type.title}</h3>
                  <p className={`text-sm mb-2 ${pitchType === type.id ? 'text-gray-300' : 'text-gray-600'}`}>
                    {type.description}
                  </p>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span className="text-sm font-medium">{formatTime(type.duration)} target</span>
                  </div>
                </button>
              ))}
            </div>

            {/* Timer */}
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200">
              <div className="text-center mb-8">
                <div className={`text-6xl font-bold mb-4 ${isOverTime ? 'text-red-600' : 'text-gray-900'}`}>
                  {formatTime(elapsedTime)}
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
                  <div
                    className={`h-3 rounded-full transition-all duration-300 ${
                      isOverTime ? 'bg-red-600' : 'bg-gray-900'
                    }`}
                    style={{ width: `${timePercent}%` }}
                  />
                </div>
                <p className="text-gray-600">
                  Target: {formatTime(currentPitch.duration)}
                  {isOverTime && (
                    <span className="text-red-600 font-semibold ml-2">
                      (+{formatTime(elapsedTime - currentPitch.duration)} over)
                    </span>
                  )}
                </p>
              </div>

              <div className="flex items-center justify-center gap-4">
                <button
                  onClick={toggleTimer}
                  className="px-8 py-4 bg-gray-900 text-white rounded-xl hover:bg-black transition-all font-semibold shadow-md flex items-center gap-3"
                >
                  {timerActive ? (
                    <>
                      <Pause className="w-5 h-5" />
                      Pause
                    </>
                  ) : (
                    <>
                      <Play className="w-5 h-5" />
                      Start Practice
                    </>
                  )}
                </button>
                <button
                  onClick={resetTimer}
                  className="px-6 py-4 bg-white border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all flex items-center gap-2"
                >
                  <RotateCcw className="w-4 h-4" />
                  Reset
                </button>
              </div>
            </div>

            {/* Pitch Notes */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-gray-900 rounded-xl flex items-center justify-center">
                  <Target className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Your Pitch Script</h2>
                  <p className="text-sm text-gray-600">Write and refine your pitch</p>
                </div>
              </div>
              <textarea
                value={pitchNotes[pitchType] || ''}
                onChange={(e) => handleNotesChange(e.target.value)}
                placeholder={`Write your ${currentPitch.title.toLowerCase()} here... Practice reading it out loud while timing yourself.`}
                className="w-full h-96 p-4 bg-gray-50 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-gray-900 focus:border-transparent resize-none"
              />
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Tips */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-gray-900 rounded-xl flex items-center justify-center">
                  <Lightbulb className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-gray-900">Tips</h2>
                  <p className="text-xs text-gray-600">Best practices</p>
                </div>
              </div>
              <ul className="space-y-3">
                {currentPitch.tips.map((tip, index) => (
                  <li key={index} className="flex items-start gap-3 text-sm text-gray-700">
                    <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                    {tip}
                  </li>
                ))}
              </ul>
            </div>

            {/* Common Questions */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-gray-900 rounded-xl flex items-center justify-center">
                  <Mic className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-gray-900">Common Questions</h2>
                  <p className="text-xs text-gray-600">Be prepared to answer</p>
                </div>
              </div>
              <div className="space-y-2">
                {questions.map((question, index) => (
                  <div key={index} className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-700">{question}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Practice Checklist */}
            <div className="bg-gray-900 text-white rounded-2xl p-6">
              <h3 className="font-bold text-lg mb-4">Practice Checklist</h3>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  Record yourself and watch
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  Practice in front of others
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  Get feedback and iterate
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  Perfect your timing
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  Prepare for Q&A
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PitchPrep;

