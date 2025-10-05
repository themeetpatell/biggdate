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
  Clock,
  Calendar
} from 'lucide-react';

const AnonymousProfileFixed = () => {
  const [pitchText, setPitchText] = useState('');
  const [pitchFormat, setPitchFormat] = useState('text');
  const [isRecording, setIsRecording] = useState(false);
  const [hasVoiceNote, setHasVoiceNote] = useState(false);
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
    'Technology', 'Healthcare', 'Fintech', 'E-commerce', 'Education',
    'Real Estate', 'Food & Beverage', 'Transportation', 'Energy', 'Entertainment',
    'Manufacturing', 'Retail', 'Travel', 'Sports', 'Gaming'
  ];

  const workStyleOptions = [
    'Remote-first', 'Hybrid', 'Office-based', 'Flexible hours', 'Fixed schedule',
    'Part-time', 'Full-time', 'Contract', 'Freelance'
  ];

  const availabilityOptions = [
    'Immediately', 'Within 1 month', 'Within 3 months', 'Within 6 months',
    'Part-time only', 'Evenings only', 'Weekends only'
  ];

  const fundingStageOptions = [
    'Pre-seed', 'Seed', 'Series A', 'Series B+', 'Bootstrapped', 'Any stage'
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-8">
            <div className="w-20 h-20 bg-white/10 backdrop-blur-sm rounded-3xl flex items-center justify-center mr-6 shadow-2xl border border-white/20">
              <Rocket className="w-10 h-10 text-white" />
            </div>
            <div>
              <h1 className="text-5xl font-bold text-white mb-2">Co-Builders</h1>
              <p className="text-purple-200 text-xl">Cofounder Matching</p>
            </div>
          </div>
          <h2 className="text-4xl font-bold text-white mb-4">What Cofounder Are You Looking For?</h2>
          <p className="text-purple-200 text-xl max-w-3xl mx-auto leading-relaxed">Help us find the perfect cofounder match for your startup. Tell us about your ideal cofounder and we'll connect you with the right people.</p>
        </div>

        {/* Main Content */}
        <div className="bg-white/10 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 p-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column */}
            <div className="space-y-8">
              {/* Role Preference */}
              <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
                <label className="block text-white font-semibold mb-4 flex items-center gap-3">
                  <div className="w-8 h-8 bg-white/20 rounded-xl flex items-center justify-center">
                    <Users className="w-5 h-5 text-white" />
                  </div>
                  Preferred Cofounder Role
                </label>
                <select
                  value={cofounderPreferences.role}
                  onChange={(e) => setCofounderPreferences(prev => ({...prev, role: e.target.value}))}
                  className="w-full p-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-purple-200 focus:ring-2 focus:ring-white/50 focus:border-transparent transition-all duration-200 hover:bg-white/15 backdrop-blur-sm"
                >
                  <option value="" className="bg-purple-900 text-white">Select role</option>
                  <option value="technical" className="bg-purple-900 text-white">Technical Co-founder</option>
                  <option value="business" className="bg-purple-900 text-white">Business Co-founder</option>
                  <option value="marketing" className="bg-purple-900 text-white">Marketing Co-founder</option>
                  <option value="operations" className="bg-purple-900 text-white">Operations Co-founder</option>
                  <option value="finance" className="bg-purple-900 text-white">Finance Co-founder</option>
                  <option value="design" className="bg-purple-900 text-white">Design Co-founder</option>
                </select>
              </div>

              {/* Skills Needed */}
              <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
                <label className="block text-white font-semibold mb-4 flex items-center gap-3">
                  <div className="w-8 h-8 bg-white/20 rounded-xl flex items-center justify-center">
                    <Star className="w-5 h-5 text-white" />
                  </div>
                  Required Skills
                </label>
                <div className="space-y-3">
                  <p className="text-purple-200 text-sm">Select the skills your ideal cofounder should have</p>
                  <div className="flex flex-wrap gap-3">
                    {skillsOptions.map(skill => (
                      <button
                        key={skill}
                        onClick={() => handleSkillToggle(skill)}
                        className={`px-4 py-3 rounded-2xl text-sm font-medium transition-all duration-300 transform hover:scale-105 ${
                          cofounderPreferences.skills.includes(skill)
                            ? 'bg-white text-purple-900 shadow-lg border-2 border-white/50'
                            : 'bg-white/10 text-white border border-white/20 hover:bg-white/20 hover:border-white/40'
                        }`}
                      >
                        {skill}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Industry Preference */}
              <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
                <label className="block text-white font-semibold mb-4 flex items-center gap-3">
                  <div className="w-8 h-8 bg-white/20 rounded-xl flex items-center justify-center">
                    <Briefcase className="w-5 h-5 text-white" />
                  </div>
                  Industry Focus
                </label>
                <div className="space-y-3">
                  <p className="text-purple-200 text-sm">Choose the industries your cofounder should have experience in</p>
                  <div className="flex flex-wrap gap-3">
                    {industryOptions.map(industry => (
                      <button
                        key={industry}
                        onClick={() => handleIndustryToggle(industry)}
                        className={`px-4 py-3 rounded-2xl text-sm font-medium transition-all duration-300 transform hover:scale-105 ${
                          cofounderPreferences.industry.includes(industry)
                            ? 'bg-white text-purple-900 shadow-lg border-2 border-white/50'
                            : 'bg-white/10 text-white border border-white/20 hover:bg-white/20 hover:border-white/40'
                        }`}
                      >
                        {industry}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Experience Level */}
              <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
                <label className="block text-white font-semibold mb-4 flex items-center gap-3">
                  <div className="w-8 h-8 bg-white/20 rounded-xl flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-white" />
                  </div>
                  Experience Level
                </label>
                <select
                  value={cofounderPreferences.experience}
                  onChange={(e) => setCofounderPreferences(prev => ({...prev, experience: e.target.value}))}
                  className="w-full p-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-purple-200 focus:ring-2 focus:ring-white/50 focus:border-transparent transition-all duration-200 hover:bg-white/15 backdrop-blur-sm"
                >
                  <option value="" className="bg-purple-900 text-white">Select experience level</option>
                  <option value="entry" className="bg-purple-900 text-white">Entry Level (0-2 years)</option>
                  <option value="mid" className="bg-purple-900 text-white">Mid Level (3-5 years)</option>
                  <option value="senior" className="bg-purple-900 text-white">Senior Level (6-10 years)</option>
                  <option value="executive" className="bg-purple-900 text-white">Executive Level (10+ years)</option>
                </select>
              </div>

              {/* Location Preference */}
              <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
                <label className="block text-white font-semibold mb-4 flex items-center gap-3">
                  <div className="w-8 h-8 bg-white/20 rounded-xl flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-white" />
                  </div>
                  Location Preference
                </label>
                <select
                  value={cofounderPreferences.location}
                  onChange={(e) => setCofounderPreferences(prev => ({...prev, location: e.target.value}))}
                  className="w-full p-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-purple-200 focus:ring-2 focus:ring-white/50 focus:border-transparent transition-all duration-200 hover:bg-white/15 backdrop-blur-sm"
                >
                  <option value="" className="bg-purple-900 text-white">Select location</option>
                  <option value="same-city" className="bg-purple-900 text-white">Same City</option>
                  <option value="same-country" className="bg-purple-900 text-white">Same Country</option>
                  <option value="remote" className="bg-purple-900 text-white">Remote OK</option>
                  <option value="anywhere" className="bg-purple-900 text-white">Anywhere</option>
                </select>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-8">
              {/* Work Style */}
              <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
                <label className="block text-white font-semibold mb-4 flex items-center gap-3">
                  <div className="w-8 h-8 bg-white/20 rounded-xl flex items-center justify-center">
                    <Clock className="w-5 h-5 text-white" />
                  </div>
                  Work Style
                </label>
                <select
                  value={cofounderPreferences.workStyle}
                  onChange={(e) => setCofounderPreferences(prev => ({...prev, workStyle: e.target.value}))}
                  className="w-full p-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-purple-200 focus:ring-2 focus:ring-white/50 focus:border-transparent transition-all duration-200 hover:bg-white/15 backdrop-blur-sm"
                >
                  <option value="" className="bg-purple-900 text-white">Select work style</option>
                  {workStyleOptions.map(style => (
                    <option key={style} value={style} className="bg-purple-900 text-white">{style}</option>
                  ))}
                </select>
              </div>

              {/* Availability */}
              <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
                <label className="block text-white font-semibold mb-4 flex items-center gap-3">
                  <div className="w-8 h-8 bg-white/20 rounded-xl flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-white" />
                  </div>
                  Availability
                </label>
                <select
                  value={cofounderPreferences.availability}
                  onChange={(e) => setCofounderPreferences(prev => ({...prev, availability: e.target.value}))}
                  className="w-full p-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-purple-200 focus:ring-2 focus:ring-white/50 focus:border-transparent transition-all duration-200 hover:bg-white/15 backdrop-blur-sm"
                >
                  <option value="" className="bg-purple-900 text-white">Select availability</option>
                  {availabilityOptions.map(availability => (
                    <option key={availability} value={availability} className="bg-purple-900 text-white">{availability}</option>
                  ))}
                </select>
              </div>

              {/* Funding Stage */}
              <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
                <label className="block text-white font-semibold mb-4 flex items-center gap-3">
                  <div className="w-8 h-8 bg-white/20 rounded-xl flex items-center justify-center">
                    <DollarSign className="w-5 h-5 text-white" />
                  </div>
                  Funding Stage
                </label>
                <select
                  value={cofounderPreferences.fundingStage}
                  onChange={(e) => setCofounderPreferences(prev => ({...prev, fundingStage: e.target.value}))}
                  className="w-full p-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-purple-200 focus:ring-2 focus:ring-white/50 focus:border-transparent transition-all duration-200 hover:bg-white/15 backdrop-blur-sm"
                >
                  <option value="" className="bg-purple-900 text-white">Select funding stage</option>
                  {fundingStageOptions.map(stage => (
                    <option key={stage} value={stage} className="bg-purple-900 text-white">{stage}</option>
                  ))}
                </select>
              </div>

              {/* Pitch Section */}
              <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
                <label className="block text-white font-semibold mb-4 flex items-center gap-3">
                  <div className="w-8 h-8 bg-white/20 rounded-xl flex items-center justify-center">
                    <Zap className="w-5 h-5 text-white" />
                  </div>
                  Your Pitch
                </label>
                <div className="space-y-6">
                  <div className="flex gap-3">
                    <button
                      onClick={() => setPitchFormat('text')}
                      className={`px-6 py-3 rounded-2xl text-sm font-semibold transition-all duration-300 flex items-center gap-3 transform hover:scale-105 ${
                        pitchFormat === 'text' 
                          ? 'bg-white text-purple-900 shadow-lg border-2 border-white/50' 
                          : 'bg-white/10 text-white border border-white/20 hover:bg-white/20 hover:border-white/40'
                      }`}
                    >
                      <Type className="w-5 h-5" />
                      Text
                    </button>
                    <button
                      onClick={() => setPitchFormat('voice')}
                      className={`px-6 py-3 rounded-2xl text-sm font-semibold transition-all duration-300 flex items-center gap-3 transform hover:scale-105 ${
                        pitchFormat === 'voice' 
                          ? 'bg-white text-purple-900 shadow-lg border-2 border-white/50' 
                          : 'bg-white/10 text-white border border-white/20 hover:bg-white/20 hover:border-white/40'
                      }`}
                    >
                      <Mic className="w-5 h-5" />
                      Voice
                    </button>
                  </div>

                  {pitchFormat === 'text' ? (
                    <div className="space-y-3">
                      <p className="text-purple-200 text-sm">Tell us about your startup idea and what you're looking for in a cofounder</p>
                      <textarea
                        value={pitchText}
                        onChange={(e) => setPitchText(e.target.value)}
                        placeholder="Describe your startup vision, the problem you're solving, and what kind of cofounder would be the perfect match..."
                        rows={5}
                        className="w-full p-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-purple-200 focus:ring-2 focus:ring-white/50 focus:border-transparent transition-all duration-200 hover:bg-white/15 backdrop-blur-sm resize-none"
                      />
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <p className="text-purple-200 text-sm">Record a 60-second pitch about your startup and cofounder needs</p>
                      <div className="p-8 bg-white/10 border border-white/20 rounded-2xl text-center backdrop-blur-sm">
                        {!hasVoiceNote ? (
                          <div className="space-y-6">
                            <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto">
                              <Mic className="w-10 h-10 text-white" />
                            </div>
                            <div>
                              <p className="text-white font-medium mb-2">Record your pitch</p>
                              <p className="text-purple-200 text-sm">Up to 60 seconds</p>
                            </div>
                            <button
                              onClick={() => setIsRecording(!isRecording)}
                              className={`px-8 py-4 rounded-2xl font-semibold transition-all duration-300 flex items-center gap-3 mx-auto transform hover:scale-105 ${
                                isRecording 
                                  ? 'bg-red-500 text-white hover:bg-red-600 shadow-lg' 
                                  : 'bg-white text-purple-900 hover:bg-white/90 shadow-lg'
                              }`}
                            >
                              {isRecording ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
                              {isRecording ? 'Stop Recording' : 'Start Recording'}
                            </button>
                          </div>
                        ) : (
                          <div className="space-y-6">
                            <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto">
                              <CheckCircle className="w-10 h-10 text-white" />
                            </div>
                            <div>
                              <p className="text-white font-medium mb-2">Voice note recorded</p>
                              <p className="text-purple-200 text-sm">Ready to submit</p>
                            </div>
                            <div className="flex gap-3 justify-center">
                              <button
                                onClick={() => setHasVoiceNote(false)}
                                className="px-6 py-3 bg-white/10 text-white rounded-xl hover:bg-white/20 transition-colors border border-white/20"
                              >
                                <RotateCcw className="w-5 h-5" />
                              </button>
                              <button className="px-6 py-3 bg-white text-purple-900 rounded-xl hover:bg-white/90 transition-colors shadow-lg">
                                <Play className="w-5 h-5" />
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between mt-12 pt-8 border-t border-white/20">
            <button
              onClick={handleBack}
              className="flex items-center gap-3 px-8 py-4 text-white/80 hover:text-white transition-all duration-300 hover:bg-white/10 rounded-2xl backdrop-blur-sm border border-white/20"
            >
              <ArrowLeft className="w-6 h-6" />
              <span className="font-medium">Back</span>
            </button>
            <button
              onClick={handleContinue}
              className="flex items-center gap-3 px-10 py-5 bg-white text-purple-900 rounded-2xl hover:bg-white/90 transition-all duration-300 font-semibold shadow-2xl transform hover:scale-105 border-2 border-white/50"
            >
              <span className="text-lg">Complete Setup</span>
              <ArrowRight className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnonymousProfileFixed;
