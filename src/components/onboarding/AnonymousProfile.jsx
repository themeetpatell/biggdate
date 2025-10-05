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
  Trophy,
  ChevronDown,
  Briefcase,
  MapPin,
  Users,
  Lightbulb,
  TrendingUp,
  DollarSign,
  Clock
} from 'lucide-react';

const AnonymousProfile = () => {
  const [pitchText, setPitchText] = useState('');
  const [pitchFormat, setPitchFormat] = useState('text');
  const [isRecording, setIsRecording] = useState(false);
  const [hasVoiceNote, setHasVoiceNote] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [cofounderPreferences, setCofounderPreferences] = useState({
    role: '',
    skills: [],
    experience: '',
    location: '',
    industry: [],
    workStyle: '',
    availability: '',
    fundingStage: ''
  });
  const [openDropdowns, setOpenDropdowns] = useState({
    skills: false,
    industry: false,
    workStyle: false,
    availability: false,
    fundingStage: false
  });

  const navigate = useNavigate();

  const handleContinue = () => {
    // Save preferences to localStorage
    localStorage.setItem('cofounderPreferences', JSON.stringify(cofounderPreferences));
    localStorage.setItem('pitchText', pitchText);
    localStorage.setItem('pitchFormat', pitchFormat);
    
    // Navigate to home
    navigate('/home');
  };

  const handleBack = () => {
    navigate('/onboarding/mission');
  };

  const toggleDropdown = (dropdown) => {
    setOpenDropdowns(prev => ({
      ...prev,
      [dropdown]: !prev[dropdown]
    }));
  };

  const handleSkillToggle = (skill) => {
    setCofounderPreferences(prev => ({
      ...prev,
      skills: prev.skills.includes(skill) 
        ? prev.skills.filter(s => s !== skill)
        : [...prev.skills, skill]
    }));
  };

  const handleIndustryToggle = (industry) => {
    setCofounderPreferences(prev => ({
      ...prev,
      industry: prev.industry.includes(industry) 
        ? prev.industry.filter(i => i !== industry)
        : [...prev.industry, industry]
    }));
  };

  const skillsOptions = [
    'Technical Development', 'Product Management', 'Marketing', 'Sales', 
    'Operations', 'Finance', 'Design', 'Business Strategy', 'Fundraising',
    'Legal', 'HR', 'Data Analysis', 'AI/ML', 'Blockchain', 'Mobile Development'
  ];

  const industryOptions = [
    'Fintech', 'HealthTech', 'EdTech', 'E-commerce', 'SaaS', 'AI/ML',
    'Blockchain', 'Sustainability', 'Gaming', 'Media', 'Real Estate',
    'Transportation', 'Food & Beverage', 'Fashion', 'Travel'
  ];

  const workStyleOptions = [
    'Remote-first', 'Hybrid', 'Office-based', 'Flexible'
  ];

  const availabilityOptions = [
    'Full-time', 'Part-time', 'Weekends only', 'Evenings only', 'Flexible'
  ];

  const fundingStageOptions = [
    'Pre-seed', 'Seed', 'Series A', 'Series B+', 'Bootstrapped', 'Any stage'
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-5xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-6">
            <div className="w-16 h-16 bg-black rounded-2xl flex items-center justify-center mr-4 shadow-lg">
              <Rocket className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-gray-900">Co-Builders</h1>
              <p className="text-gray-600 text-lg">Cofounder Matching</p>
            </div>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-3">What Cofounder Are You Looking For?</h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">Help us find the perfect cofounder match for your startup. Tell us about your ideal cofounder and we'll connect you with the right people.</p>
        </div>

        {/* Main Form */}
        <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column */}
            <div className="space-y-6">
              {/* Role Preference */}
              <div>
                <label className="block text-gray-900 font-semibold mb-3 flex items-center gap-2">
                  <Users className="w-5 h-5 text-black" />
                  Preferred Cofounder Role
                </label>
                <select
                  value={cofounderPreferences.role}
                  onChange={(e) => setCofounderPreferences(prev => ({...prev, role: e.target.value}))}
                  className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-200 hover:bg-gray-100"
                >
                  <option value="">Select role</option>
                  <option value="technical">Technical Co-founder</option>
                  <option value="business">Business Co-founder</option>
                  <option value="marketing">Marketing Co-founder</option>
                  <option value="operations">Operations Co-founder</option>
                  <option value="finance">Finance Co-founder</option>
                  <option value="design">Design Co-founder</option>
                </select>
              </div>

              {/* Skills Needed */}
              <div>
                <label className="block text-gray-900 font-semibold mb-3 flex items-center gap-2">
                  <Star className="w-5 h-5 text-black" />
                  Required Skills
                </label>
                <div className="relative">
                  <button
                    onClick={() => toggleDropdown('skills')}
                    className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl text-left text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-black focus:border-transparent flex items-center justify-between transition-all duration-200 hover:bg-gray-100"
                  >
                    <span className={cofounderPreferences.skills.length > 0 ? 'text-gray-900' : 'text-gray-500'}>
                      {cofounderPreferences.skills.length > 0 
                        ? `${cofounderPreferences.skills.length} skills selected`
                        : 'Select required skills'
                      }
                    </span>
                    <ChevronDown className="w-5 h-5 text-gray-400" />
                  </button>
                  
                  {openDropdowns.skills && (
                    <div className="absolute z-10 w-full mt-2 bg-white rounded-xl border border-gray-200 shadow-lg max-h-48 overflow-y-auto">
                      {skillsOptions.map((skill) => (
                        <label key={skill} className="flex items-center p-3 hover:bg-gray-50 cursor-pointer transition-colors duration-150">
                          <input
                            type="checkbox"
                            checked={cofounderPreferences.skills.includes(skill)}
                            onChange={() => handleSkillToggle(skill)}
                            className="mr-3 rounded border-gray-300 text-black focus:ring-black focus:ring-2"
                          />
                          <span className="text-gray-800 text-sm font-medium">{skill}</span>
                        </label>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Experience Level */}
              <div>
                <label className="block text-gray-900 font-semibold mb-3 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-black" />
                  Experience Level
                </label>
                <select
                  value={cofounderPreferences.experience}
                  onChange={(e) => setCofounderPreferences(prev => ({...prev, experience: e.target.value}))}
                  className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-200 hover:bg-gray-100"
                >
                  <option value="">Select experience level</option>
                  <option value="0-2">0-2 years</option>
                  <option value="3-5">3-5 years</option>
                  <option value="6-10">6-10 years</option>
                  <option value="10+">10+ years</option>
                </select>
              </div>

              {/* Location Preference */}
              <div>
                <label className="block text-gray-900 font-semibold mb-3 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-black" />
                  Location Preference
                </label>
                <select
                  value={cofounderPreferences.location}
                  onChange={(e) => setCofounderPreferences(prev => ({...prev, location: e.target.value}))}
                  className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-200 hover:bg-gray-100"
                >
                  <option value="">Select location</option>
                  <option value="same-city">Same city</option>
                  <option value="same-country">Same country</option>
                  <option value="remote">Remote only</option>
                  <option value="hybrid">Hybrid</option>
                  <option value="any">Any location</option>
                </select>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Industry Focus */}
              <div>
                <label className="block text-gray-900 font-semibold mb-3 flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-black" />
                  Industry Focus
                </label>
                <div className="relative">
                  <button
                    onClick={() => toggleDropdown('industry')}
                    className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl text-left text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-black focus:border-transparent flex items-center justify-between transition-all duration-200 hover:bg-gray-100"
                  >
                    <span className={cofounderPreferences.industry.length > 0 ? 'text-gray-900' : 'text-gray-500'}>
                      {cofounderPreferences.industry.length > 0 
                        ? `${cofounderPreferences.industry.length} industries selected`
                        : 'Select industries'
                      }
                    </span>
                    <ChevronDown className="w-5 h-5 text-gray-400" />
                  </button>
                  
                  {openDropdowns.industry && (
                    <div className="absolute z-10 w-full mt-2 bg-white rounded-xl border border-gray-200 shadow-lg max-h-48 overflow-y-auto">
                      {industryOptions.map((industry) => (
                        <label key={industry} className="flex items-center p-3 hover:bg-gray-50 cursor-pointer transition-colors duration-150">
                          <input
                            type="checkbox"
                            checked={cofounderPreferences.industry.includes(industry)}
                            onChange={() => handleIndustryToggle(industry)}
                            className="mr-3 rounded border-gray-300 text-black focus:ring-black focus:ring-2"
                          />
                          <span className="text-gray-800 text-sm font-medium">{industry}</span>
                        </label>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Work Style */}
              <div>
                <label className="block text-gray-900 font-semibold mb-3 flex items-center gap-2">
                  <Zap className="w-5 h-5 text-black" />
                  Work Style
                </label>
                <select
                  value={cofounderPreferences.workStyle}
                  onChange={(e) => setCofounderPreferences(prev => ({...prev, workStyle: e.target.value}))}
                  className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-200 hover:bg-gray-100"
                >
                  <option value="">Select work style</option>
                  {workStyleOptions.map((style) => (
                    <option key={style} value={style}>{style}</option>
                  ))}
                </select>
              </div>

              {/* Availability */}
              <div>
                <label className="block text-gray-900 font-semibold mb-3 flex items-center gap-2">
                  <Clock className="w-5 h-5 text-black" />
                  Time Availability
                </label>
                <select
                  value={cofounderPreferences.availability}
                  onChange={(e) => setCofounderPreferences(prev => ({...prev, availability: e.target.value}))}
                  className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-200 hover:bg-gray-100"
                >
                  <option value="">Select availability</option>
                  {availabilityOptions.map((availability) => (
                    <option key={availability} value={availability}>{availability}</option>
                  ))}
                </select>
              </div>

              {/* Funding Stage */}
              <div>
                <label className="block text-gray-900 font-semibold mb-3 flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-black" />
                  Funding Stage
                </label>
                <select
                  value={cofounderPreferences.fundingStage}
                  onChange={(e) => setCofounderPreferences(prev => ({...prev, fundingStage: e.target.value}))}
                  className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-200 hover:bg-gray-100"
                >
                  <option value="">Select funding stage</option>
                  {fundingStageOptions.map((stage) => (
                    <option key={stage} value={stage}>{stage}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Pitch Section */}
          <div className="mt-10 pt-8 border-t border-gray-200">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center">
                <Send className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">Your Startup Pitch (Optional)</h3>
                <p className="text-gray-600">Share your vision and what you're looking for in a cofounder</p>
              </div>
            </div>
            
            <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
              <div className="flex items-center gap-3 mb-4">
                <button
                  onClick={() => setPitchFormat('text')}
                  className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 flex items-center gap-2 ${
                    pitchFormat === 'text' 
                      ? 'bg-black text-white shadow-lg' 
                      : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                  }`}
                >
                  <Type className="w-4 h-4" />
                  Text
                </button>
                <button
                  onClick={() => setPitchFormat('voice')}
                  className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 flex items-center gap-2 ${
                    pitchFormat === 'voice' 
                      ? 'bg-black text-white shadow-lg' 
                      : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                  }`}
                >
                  <Mic className="w-4 h-4" />
                  Voice
                </button>
              </div>
              
              {pitchFormat === 'text' ? (
                <textarea
                  value={pitchText}
                  onChange={(e) => setPitchText(e.target.value)}
                  placeholder="Describe your startup idea, what you're looking for in a cofounder, and why you'd make great partners..."
                  className="w-full h-32 p-4 bg-white border border-gray-200 rounded-xl text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-black focus:border-transparent resize-none transition-all duration-200"
                />
              ) : (
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setIsRecording(!isRecording)}
                    className={`px-6 py-3 rounded-xl font-semibold transition-all duration-200 flex items-center gap-2 ${
                      isRecording
                        ? 'bg-red-500 text-white hover:bg-red-600 shadow-lg' 
                        : 'bg-black text-white hover:bg-gray-800 shadow-lg'
                    }`}
                  >
                    {isRecording ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                    {isRecording ? 'Stop Recording' : 'Start Recording'}
                  </button>
                  {hasVoiceNote && (
                    <div className="flex items-center gap-3 text-gray-700">
                      <Volume2 className="w-5 h-5" />
                      <span className="font-medium">Voice note recorded</span>
                      <button 
                        onClick={() => setHasVoiceNote(false)}
                        className="text-red-500 hover:text-red-600 transition-colors duration-200"
                      >
                        <RotateCcw className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-8">
          <button
            onClick={handleBack}
            className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all duration-200 flex items-center gap-2 font-semibold"
          >
            <ArrowLeft className="w-5 h-5" />
            Back
          </button>

          <button
            onClick={handleContinue}
            className="px-8 py-3 bg-black text-white rounded-xl hover:bg-gray-800 transition-all duration-200 font-semibold flex items-center gap-2 shadow-lg hover:shadow-xl"
          >
            Complete Setup
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AnonymousProfile;