import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowRight, 
  ArrowLeft, 
  Mic, 
  Play, 
  Pause, 
  RotateCcw,
  Type,
  CheckCircle,
  Star,
  Zap,
  Target,
  Rocket,
  Briefcase,
  MapPin,
  Users,
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
    commitment: ''
  });

  const navigate = useNavigate();

  const handleContinue = () => {
    localStorage.setItem('cofounderPreferences', JSON.stringify(cofounderPreferences));
    localStorage.setItem('pitchText', pitchText);
    localStorage.setItem('pitchFormat', pitchFormat);
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

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="w-full max-w-6xl">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-3 bg-gray-50 px-6 py-3 rounded-full mb-6 border border-gray-200">
            <Target className="w-6 h-6 text-gray-700" />
            <span className="text-gray-700 font-medium">Find Your Cofounder</span>
          </div>
          <h2 className="text-4xl font-normal text-gray-900 mb-4">What Cofounder Are You Looking For?</h2>
          <p className="text-gray-600 text-xl max-w-3xl mx-auto">Help us find the perfect cofounder match for your startup</p>
        </div>

        <div className="bg-white rounded-3xl shadow-sm border border-gray-200 p-8">
          <div className="space-y-8">
            {/* Top Section - Role and Skills */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
                <label className="block text-gray-900 font-semibold mb-4 flex items-center gap-3">
                  <div className="w-8 h-8 bg-gray-200 rounded-xl flex items-center justify-center">
                    <Users className="w-5 h-5 text-gray-700" />
                  </div>
                  Preferred Cofounder Role
                </label>
                <select
                  value={cofounderPreferences.role}
                  onChange={(e) => setCofounderPreferences(prev => ({...prev, role: e.target.value}))}
                  className="w-full p-4 bg-white border border-gray-300 rounded-xl text-gray-900 focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all"
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

              <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
                <label className="block text-gray-900 font-semibold mb-4 flex items-center gap-3">
                  <div className="w-8 h-8 bg-gray-200 rounded-xl flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-gray-700" />
                  </div>
                  Experience Level
                </label>
                <select
                  value={cofounderPreferences.experience}
                  onChange={(e) => setCofounderPreferences(prev => ({...prev, experience: e.target.value}))}
                  className="w-full p-4 bg-white border border-gray-300 rounded-xl text-gray-900 focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all"
                >
                  <option value="">Select experience level</option>
                  <option value="entry">Entry Level (0-2 years)</option>
                  <option value="mid">Mid Level (3-5 years)</option>
                  <option value="senior">Senior Level (6-10 years)</option>
                  <option value="executive">Executive Level (10+ years)</option>
                </select>
              </div>

            </div>

            {/* Industry Focus - Full Width */}
            <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
              <label className="block text-gray-900 font-semibold mb-4 flex items-center gap-3">
                <div className="w-8 h-8 bg-gray-200 rounded-xl flex items-center justify-center">
                  <Briefcase className="w-5 h-5 text-gray-700" />
                </div>
                Industry Focus
              </label>
              <p className="text-gray-600 text-sm mb-4">Choose the industries your cofounder should have experience in</p>
              <div className="flex flex-wrap gap-3">
                {industryOptions.map(industry => (
                  <button
                    key={industry}
                    onClick={() => handleIndustryToggle(industry)}
                    className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                      cofounderPreferences.industry.includes(industry)
                        ? 'bg-gray-900 text-white'
                        : 'bg-white text-gray-700 border border-gray-300 hover:border-gray-400 hover:bg-gray-50'
                    }`}
                  >
                    {industry}
                  </button>
                ))}
              </div>
            </div>

            {/* Required Skills - Full Width */}
            <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
              <label className="block text-gray-900 font-semibold mb-4 flex items-center gap-3">
                <div className="w-8 h-8 bg-gray-200 rounded-xl flex items-center justify-center">
                  <Star className="w-5 h-5 text-gray-700" />
                </div>
                Required Skills
              </label>
              <p className="text-gray-600 text-sm mb-4">Select the skills your ideal cofounder should have</p>
              <div className="flex flex-wrap gap-3">
                {skillsOptions.map(skill => (
                  <button
                    key={skill}
                    onClick={() => handleSkillToggle(skill)}
                    className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                      cofounderPreferences.skills.includes(skill)
                        ? 'bg-gray-900 text-white'
                        : 'bg-white text-gray-700 border border-gray-300 hover:border-gray-400 hover:bg-gray-50'
                    }`}
                  >
                    {skill}
                  </button>
                ))}
              </div>
            </div>

            {/* Preferences Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
                <label className="block text-gray-900 font-semibold mb-4 flex items-center gap-3">
                  <div className="w-8 h-8 bg-gray-200 rounded-xl flex items-center justify-center">
                    <Clock className="w-5 h-5 text-gray-700" />
                  </div>
                  Work Style
                </label>
                <select
                  value={cofounderPreferences.workStyle}
                  onChange={(e) => setCofounderPreferences(prev => ({...prev, workStyle: e.target.value}))}
                  className="w-full p-4 bg-white border border-gray-300 rounded-xl text-gray-900 focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all"
                >
                  <option value="">Select work style</option>
                  <option value="remote-first">Remote-first</option>
                  <option value="hybrid">Hybrid</option>
                  <option value="office-based">Office-based</option>
                  <option value="flexible">Flexible hours</option>
                </select>
              </div>

              <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
                <label className="block text-gray-900 font-semibold mb-4 flex items-center gap-3">
                  <div className="w-8 h-8 bg-gray-200 rounded-xl flex items-center justify-center">
                    <Clock className="w-5 h-5 text-gray-700" />
                  </div>
                  Time Commitment
                </label>
                <select
                  value={cofounderPreferences.commitment}
                  onChange={(e) => setCofounderPreferences(prev => ({...prev, commitment: e.target.value}))}
                  className="w-full p-4 bg-white border border-gray-300 rounded-xl text-gray-900 focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all"
                >
                  <option value="">Select commitment</option>
                  <option value="full-time">Full-Time (40+ hrs/week)</option>
                  <option value="part-time">Part-Time (20-30 hrs/week)</option>
                  <option value="flexible">Flexible (10-20 hrs/week)</option>
                  <option value="weekends">Weekends Only</option>
                  <option value="evenings">Evenings Only</option>
                </select>
              </div>

              <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
                <label className="block text-gray-900 font-semibold mb-4 flex items-center gap-3">
                  <div className="w-8 h-8 bg-gray-200 rounded-xl flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-gray-700" />
                  </div>
                  Availability
                </label>
                <select
                  value={cofounderPreferences.availability}
                  onChange={(e) => setCofounderPreferences(prev => ({...prev, availability: e.target.value}))}
                  className="w-full p-4 bg-white border border-gray-300 rounded-xl text-gray-900 focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all"
                >
                  <option value="">Select availability</option>
                  <option value="immediately">Immediately</option>
                  <option value="1-month">Within 1 month</option>
                  <option value="3-months">Within 3 months</option>
                  <option value="6-months">Within 6 months</option>
                </select>
              </div>

              <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
                <label className="block text-gray-900 font-semibold mb-4 flex items-center gap-3">
                  <div className="w-8 h-8 bg-gray-200 rounded-xl flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-gray-700" />
                  </div>
                  Location
                </label>
                <select
                  value={cofounderPreferences.location}
                  onChange={(e) => setCofounderPreferences(prev => ({...prev, location: e.target.value}))}
                  className="w-full p-4 bg-white border border-gray-300 rounded-xl text-gray-900 focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all"
                >
                  <option value="">Select location</option>
                  <option value="same-city">Same City</option>
                  <option value="same-country">Same Country</option>
                  <option value="remote">Remote OK</option>
                  <option value="anywhere">Anywhere</option>
                </select>
              </div>
            </div>

            {/* Your Pitch - Full Width */}
            <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
                <label className="block text-gray-900 font-semibold mb-4 flex items-center gap-3">
                  <div className="w-8 h-8 bg-gray-200 rounded-xl flex items-center justify-center">
                    <Zap className="w-5 h-5 text-gray-700" />
                  </div>
                  Your Pitch
                </label>
                <div className="space-y-4">
                  <div className="flex gap-3">
                    <button
                      onClick={() => setPitchFormat('text')}
                      className={`px-6 py-3 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 ${
                        pitchFormat === 'text' 
                          ? 'bg-gray-900 text-white' 
                          : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      <Type className="w-5 h-5" />
                      Text
                    </button>
                    <button
                      onClick={() => setPitchFormat('voice')}
                      className={`px-6 py-3 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 ${
                        pitchFormat === 'voice' 
                          ? 'bg-gray-900 text-white' 
                          : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      <Mic className="w-5 h-5" />
                      Voice
                    </button>
                  </div>

                  {pitchFormat === 'text' ? (
                    <div>
                      <textarea
                        value={pitchText}
                        onChange={(e) => setPitchText(e.target.value)}
                        placeholder="Describe your startup vision, the problem you're solving, and what kind of cofounder would be the perfect match..."
                        rows={6}
                        className="w-full p-4 bg-white border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all resize-none"
                      />
                    </div>
                  ) : (
                    <div className="p-6 bg-white border border-gray-200 rounded-xl text-center">
                      {!hasVoiceNote ? (
                        <div className="space-y-4">
                          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
                            <Mic className="w-8 h-8 text-gray-700" />
                          </div>
                          <div>
                            <p className="text-gray-900 font-medium mb-1">Record your pitch</p>
                            <p className="text-gray-600 text-sm">Up to 60 seconds</p>
                          </div>
                          <button
                            onClick={() => {
                              setIsRecording(!isRecording);
                              if (!isRecording) {
                                setTimeout(() => {
                                  setIsRecording(false);
                                  setHasVoiceNote(true);
                                }, 3000);
                              }
                            }}
                            className={`px-6 py-3 rounded-xl font-semibold transition-all flex items-center gap-2 mx-auto ${
                              isRecording 
                                ? 'bg-red-600 text-white hover:bg-red-700' 
                                : 'bg-gray-900 text-white hover:bg-black'
                            }`}
                          >
                            {isRecording ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                            {isRecording ? 'Stop Recording' : 'Start Recording'}
                          </button>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                            <CheckCircle className="w-8 h-8 text-green-700" />
                          </div>
                          <div>
                            <p className="text-gray-900 font-medium mb-1">Voice note recorded</p>
                            <p className="text-gray-600 text-sm">Ready to submit</p>
                          </div>
                          <div className="flex gap-3 justify-center">
                            <button
                              onClick={() => setHasVoiceNote(false)}
                              className="p-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                            >
                              <RotateCcw className="w-5 h-5" />
                            </button>
                            <button className="p-2 bg-gray-900 text-white rounded-lg hover:bg-black transition-colors">
                              <Play className="w-5 h-5" />
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
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

        <div className="mt-12 flex justify-center">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
            <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
            <div className="w-3 h-3 bg-gray-900 rounded-full"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnonymousProfileFixed;
