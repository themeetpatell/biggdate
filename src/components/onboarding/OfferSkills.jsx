import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  ArrowLeft,
  Briefcase,
  Star,
  DollarSign,
  Clock,
  MapPin,
  Sparkles
} from 'lucide-react';

const OfferSkills = () => {
  const [preferences, setPreferences] = useState({
    availability: '',
    hourlyRate: '',
    workType: [],
    industries: [],
    location: '',
    projectDuration: ''
  });

  const navigate = useNavigate();

  const handleContinue = () => {
    localStorage.setItem('offerSkillsPreferences', JSON.stringify(preferences));
    navigate('/home');
  };

  const handleBack = () => {
    navigate('/onboarding/mission');
  };

  const handleWorkTypeToggle = (type) => {
    setPreferences(prev => ({
      ...prev,
      workType: prev.workType.includes(type)
        ? prev.workType.filter(t => t !== type)
        : [...prev.workType, type]
    }));
  };

  const handleIndustryToggle = (industry) => {
    setPreferences(prev => ({
      ...prev,
      industries: prev.industries.includes(industry)
        ? prev.industries.filter(i => i !== industry)
        : [...prev.industries, industry]
    }));
  };

  const workTypes = [
    'Product Development', 'Consulting', 'Design Work', 'Marketing Campaign',
    'Technical Architecture', 'MVP Building', 'Growth Strategy', 'Fundraising Support'
  ];

  const industries = [
    'Technology', 'Healthcare', 'Fintech', 'E-commerce', 'Education', 'SaaS',
    'AI/ML', 'Blockchain', 'Real Estate', 'Food & Beverage'
  ];

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="w-full max-w-5xl">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-3 bg-gray-50 px-6 py-3 rounded-full mb-6 border border-gray-200">
            <Sparkles className="w-6 h-6 text-gray-700" />
            <span className="text-gray-700 font-medium">Offer Your Skills</span>
          </div>
          <h2 className="text-4xl font-normal text-gray-900 mb-4">Your Service Preferences</h2>
          <p className="text-gray-600 text-xl max-w-3xl mx-auto">Help startups find you for the right projects</p>
        </div>

        <div className="bg-white rounded-3xl shadow-sm border border-gray-200 p-8">
          <div className="space-y-8">
            {/* Work Type */}
            <div>
              <label className="block text-gray-900 font-semibold mb-4 flex items-center gap-3">
                <div className="w-8 h-8 bg-gray-50 rounded-xl flex items-center justify-center border border-gray-200">
                  <Briefcase className="w-5 h-5 text-gray-700" />
                </div>
                Type of Work You Offer
              </label>
              <p className="text-gray-600 text-sm mb-4">Select all services you can provide</p>
              <div className="flex flex-wrap gap-3">
                {workTypes.map(type => (
                  <button
                    key={type}
                    onClick={() => handleWorkTypeToggle(type)}
                    className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                      preferences.workType.includes(type)
                        ? 'bg-gray-900 text-white'
                        : 'bg-white text-gray-700 border border-gray-300 hover:border-gray-400 hover:bg-gray-50'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            {/* Industries */}
            <div>
              <label className="block text-gray-900 font-semibold mb-4 flex items-center gap-3">
                <div className="w-8 h-8 bg-gray-50 rounded-xl flex items-center justify-center border border-gray-200">
                  <Star className="w-5 h-5 text-gray-700" />
                </div>
                Preferred Industries
              </label>
              <p className="text-gray-600 text-sm mb-4">Which industries do you want to work with?</p>
              <div className="flex flex-wrap gap-3">
                {industries.map(industry => (
                  <button
                    key={industry}
                    onClick={() => handleIndustryToggle(industry)}
                    className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                      preferences.industries.includes(industry)
                        ? 'bg-gray-900 text-white'
                        : 'bg-white text-gray-700 border border-gray-300 hover:border-gray-400 hover:bg-gray-50'
                    }`}
                  >
                    {industry}
                  </button>
                ))}
              </div>
            </div>

            {/* Grid Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div>
                <label className="block text-gray-900 font-semibold mb-3 flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-gray-700" />
                  Hourly Rate
                </label>
                <select
                  value={preferences.hourlyRate}
                  onChange={(e) => setPreferences(prev => ({...prev, hourlyRate: e.target.value}))}
                  className="w-full p-4 bg-white border border-gray-300 rounded-xl text-gray-900 focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                >
                  <option value="">Select rate</option>
                  <option value="25-50">$25-50/hr</option>
                  <option value="50-100">$50-100/hr</option>
                  <option value="100-150">$100-150/hr</option>
                  <option value="150-200">$150-200/hr</option>
                  <option value="200+">$200+/hr</option>
                  <option value="equity">Equity only</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-900 font-semibold mb-3 flex items-center gap-2">
                  <Clock className="w-5 h-5 text-gray-700" />
                  Availability
                </label>
                <select
                  value={preferences.availability}
                  onChange={(e) => setPreferences(prev => ({...prev, availability: e.target.value}))}
                  className="w-full p-4 bg-white border border-gray-300 rounded-xl text-gray-900 focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                >
                  <option value="">Select availability</option>
                  <option value="full-time">Full-Time (40+ hrs/week)</option>
                  <option value="part-time">Part-Time (20-30 hrs/week)</option>
                  <option value="flexible">Flexible (10-20 hrs/week)</option>
                  <option value="weekends">Weekends Only</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-900 font-semibold mb-3 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-gray-700" />
                  Location
                </label>
                <select
                  value={preferences.location}
                  onChange={(e) => setPreferences(prev => ({...prev, location: e.target.value}))}
                  className="w-full p-4 bg-white border border-gray-300 rounded-xl text-gray-900 focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                >
                  <option value="">Select location</option>
                  <option value="remote">Remote Only</option>
                  <option value="hybrid">Hybrid</option>
                  <option value="onsite">On-site</option>
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

export default OfferSkills;

