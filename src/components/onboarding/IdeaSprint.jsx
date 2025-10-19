import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  ArrowLeft,
  Zap,
  Target,
  Users,
  Lightbulb,
  TrendingUp,
  Calendar
} from 'lucide-react';

const IdeaSprint = () => {
  const [sprintDetails, setSprintDetails] = useState({
    ideaStage: '',
    validationStatus: '',
    targetMarket: '',
    cofounderNeeds: [],
    timeline: '',
    commitment: ''
  });

  const navigate = useNavigate();

  const handleContinue = () => {
    localStorage.setItem('ideaSprintDetails', JSON.stringify(sprintDetails));
    navigate('/home');
  };

  const handleBack = () => {
    navigate('/onboarding/mission');
  };

  const handleCofounderNeedToggle = (need) => {
    setSprintDetails(prev => ({
      ...prev,
      cofounderNeeds: prev.cofounderNeeds.includes(need)
        ? prev.cofounderNeeds.filter(n => n !== need)
        : [...prev.cofounderNeeds, need]
    }));
  };

  const cofounderNeeds = [
    'Technical Co-founder', 'Business Co-founder', 'Marketing Expert',
    'Product Designer', 'Sales Lead', 'Operations Manager', 'Finance Expert'
  ];

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="w-full max-w-5xl">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-3 bg-gray-50 px-6 py-3 rounded-full mb-6 border border-gray-200">
            <Zap className="w-6 h-6 text-gray-700" />
            <span className="text-gray-700 font-medium">Start Idea Sprint</span>
          </div>
          <h2 className="text-4xl font-normal text-gray-900 mb-4">Your Idea Sprint Journey</h2>
          <p className="text-gray-600 text-xl max-w-3xl mx-auto">
            Build, validate, and find your cofounder - all in one sprint
          </p>
        </div>

        <div className="bg-white rounded-3xl shadow-sm border border-gray-200 p-8">
          <div className="space-y-8">
            {/* Idea Stage & Validation */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-900 font-semibold mb-4 flex items-center gap-3">
                  <div className="w-8 h-8 bg-gray-50 rounded-xl flex items-center justify-center border border-gray-200">
                    <Lightbulb className="w-5 h-5 text-gray-700" />
                  </div>
                  Current Idea Stage
                </label>
                <select
                  value={sprintDetails.ideaStage}
                  onChange={(e) => setSprintDetails(prev => ({...prev, ideaStage: e.target.value}))}
                  className="w-full p-4 bg-white border border-gray-300 rounded-xl text-gray-900 focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                >
                  <option value="">Select stage</option>
                  <option value="just-idea">Just an Idea</option>
                  <option value="research">Research Phase</option>
                  <option value="prototype">Building Prototype</option>
                  <option value="mvp">MVP Ready</option>
                  <option value="early-traction">Early Traction</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-900 font-semibold mb-4 flex items-center gap-3">
                  <div className="w-8 h-8 bg-gray-50 rounded-xl flex items-center justify-center border border-gray-200">
                    <TrendingUp className="w-5 h-5 text-gray-700" />
                  </div>
                  Validation Status
                </label>
                <select
                  value={sprintDetails.validationStatus}
                  onChange={(e) => setSprintDetails(prev => ({...prev, validationStatus: e.target.value}))}
                  className="w-full p-4 bg-white border border-gray-300 rounded-xl text-gray-900 focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                >
                  <option value="">Select status</option>
                  <option value="not-started">Haven't Started</option>
                  <option value="research">Doing Research</option>
                  <option value="interviews">Customer Interviews</option>
                  <option value="testing">Testing MVP</option>
                  <option value="validated">Validated with Users</option>
                </select>
              </div>
            </div>

            {/* Target Market */}
            <div>
              <label className="block text-gray-900 font-semibold mb-4 flex items-center gap-3">
                <div className="w-8 h-8 bg-gray-50 rounded-xl flex items-center justify-center border border-gray-200">
                  <Target className="w-5 h-5 text-gray-700" />
                </div>
                Target Market
              </label>
              <textarea
                value={sprintDetails.targetMarket}
                onChange={(e) => setSprintDetails(prev => ({...prev, targetMarket: e.target.value}))}
                placeholder="Describe your target market, customer segment, and who you're solving this problem for..."
                className="w-full h-24 p-4 bg-white border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-gray-900 focus:border-transparent resize-none"
              />
            </div>

            {/* Co-founder Needs */}
            <div>
              <label className="block text-gray-900 font-semibold mb-4 flex items-center gap-3">
                <div className="w-8 h-8 bg-gray-50 rounded-xl flex items-center justify-center border border-gray-200">
                  <Users className="w-5 h-5 text-gray-700" />
                </div>
                What Co-founder Help Do You Need?
              </label>
              <p className="text-gray-600 text-sm mb-4">Select all roles you're looking for</p>
              <div className="flex flex-wrap gap-3">
                {cofounderNeeds.map(need => (
                  <button
                    key={need}
                    onClick={() => handleCofounderNeedToggle(need)}
                    className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                      sprintDetails.cofounderNeeds.includes(need)
                        ? 'bg-gray-900 text-white'
                        : 'bg-white text-gray-700 border border-gray-300 hover:border-gray-400 hover:bg-gray-50'
                    }`}
                  >
                    {need}
                  </button>
                ))}
              </div>
            </div>

            {/* Timeline & Commitment */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-900 font-semibold mb-4 flex items-center gap-3">
                  <div className="w-8 h-8 bg-gray-50 rounded-xl flex items-center justify-center border border-gray-200">
                    <Calendar className="w-5 h-5 text-gray-700" />
                  </div>
                  Sprint Timeline
                </label>
                <select
                  value={sprintDetails.timeline}
                  onChange={(e) => setSprintDetails(prev => ({...prev, timeline: e.target.value}))}
                  className="w-full p-4 bg-white border border-gray-300 rounded-xl text-gray-900 focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                >
                  <option value="">Select timeline</option>
                  <option value="2-weeks">2 Weeks Sprint</option>
                  <option value="1-month">1 Month Sprint</option>
                  <option value="3-months">3 Months Sprint</option>
                  <option value="flexible">Flexible Timeline</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-900 font-semibold mb-4 flex items-center gap-3">
                  <div className="w-8 h-8 bg-gray-50 rounded-xl flex items-center justify-center border border-gray-200">
                    <Zap className="w-5 h-5 text-gray-700" />
                  </div>
                  Your Commitment
                </label>
                <select
                  value={sprintDetails.commitment}
                  onChange={(e) => setSprintDetails(prev => ({...prev, commitment: e.target.value}))}
                  className="w-full p-4 bg-white border border-gray-300 rounded-xl text-gray-900 focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                >
                  <option value="">Select commitment</option>
                  <option value="full-time">Full-Time Focus</option>
                  <option value="part-time">Part-Time (20-30 hrs/week)</option>
                  <option value="side-project">Side Project (10-15 hrs/week)</option>
                  <option value="weekends">Weekends Only</option>
                </select>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between mt-8 pt-8 border-t border-gray-200">
            <button
              onClick={handleBack}
              className="px-6 py-3 bg-white border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all flex items-center gap-2"
            >
              <ArrowLeft className="w-5 h-5" />
              Back
            </button>
            <button
              onClick={handleContinue}
              className="px-10 py-4 bg-gray-900 text-white rounded-xl hover:bg-black transition-all font-semibold shadow-md hover:shadow-lg flex items-center gap-3"
            >
              <span>Complete Setup →</span>
              <ArrowRight className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IdeaSprint;

