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
  ChevronDown
} from 'lucide-react';

const AnonymousProfile = () => {
  const [pitchText, setPitchText] = useState('');
  const [pitchFormat, setPitchFormat] = useState('text');
  const [isRecording, setIsRecording] = useState(false);
  const [hasVoiceNote, setHasVoiceNote] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [partnerPreferences, setPartnerPreferences] = useState({
    ageRange: [25, 35],
    careerField: [],
    education: [],
    location: [],
    lifestyle: [],
    lifePriorities: [],
    relationshipGoals: []
  });
  const [openDropdowns, setOpenDropdowns] = useState({
    careerField: false,
    education: false,
    location: false,
    lifestyle: false,
    lifePriorities: false,
    relationshipGoals: false
  });
  const navigate = useNavigate();

  // Get user data from previous steps
  const userRole = localStorage.getItem('userRole') || 'founder';
  const userStage = localStorage.getItem('userStage') || 'seed';
  const userMask = localStorage.getItem('userMask') || 'rocket';
  const selectedValues = JSON.parse(localStorage.getItem('selectedValues') || '[]');
  const missionStatement = localStorage.getItem('whyHere') || '';
  const selectedIntent = localStorage.getItem('selectedIntent') || '';

  const partnerPrompts = [
    "I'm looking for someone who...",
    "My ideal partner shares my passion for...",
    "I need someone who understands...",
    "I want a Co-Lifer who...",
    "The perfect match for me is someone who...",
    "I'm seeking a partner who believes in...",
    "My ideal Co-Lifer values...",
    "I'm looking for someone who dreams of..."
  ];

  const ageRanges = [
    '18-25', '26-30', '31-35', '36-40', '41-45', '46-50', '51+'
  ];

  const careerFields = [
    'Technology', 'Finance', 'Healthcare', 'Education', 'Marketing', 'Sales',
    'Consulting', 'Real Estate', 'Law', 'Media', 'Non-profit', 'Government',
    'Entrepreneur', 'Investor', 'Creative', 'Other'
  ];

  const educationLevels = [
    'High School', 'Associate Degree', 'Bachelor\'s Degree', 'Master\'s Degree',
    'PhD/Doctorate', 'Professional Degree', 'Trade School', 'Self-taught'
  ];

  const lifestyleOptions = [
    'Early Bird', 'Night Owl', 'Homebody', 'Social Butterfly', 'Adventure Seeker',
    'Workaholic', 'Balanced', 'Minimalist', 'Luxury Lover', 'Fitness Enthusiast'
  ];

  const lifePriorities = [
    'Family', 'Career', 'Travel', 'Health', 'Spirituality', 
    'Impact', 'Wealth', 'Creativity'
  ];

  const relationshipGoals = [
    'Exploring', 'Long-term partnership', 'Marriage-minded', 'Family-focused'
  ];

  const cities = [
    // Dubai
    { name: 'Dubai', country: 'UAE', flag: '🇦🇪' },
    // India
    { name: 'Mumbai', country: 'India', flag: '🇮🇳' },
    { name: 'Delhi', country: 'India', flag: '🇮🇳' },
    { name: 'Bangalore', country: 'India', flag: '🇮🇳' },
    { name: 'Chennai', country: 'India', flag: '🇮🇳' },
    { name: 'Kolkata', country: 'India', flag: '🇮🇳' },
    { name: 'Hyderabad', country: 'India', flag: '🇮🇳' },
    { name: 'Pune', country: 'India', flag: '🇮🇳' },
    { name: 'Ahmedabad', country: 'India', flag: '🇮🇳' },
    { name: 'Gurgaon', country: 'India', flag: '🇮🇳' },
    // Canada
    { name: 'Toronto', country: 'Canada', flag: '🇨🇦' },
    { name: 'Vancouver', country: 'Canada', flag: '🇨🇦' },
    { name: 'Montreal', country: 'Canada', flag: '🇨🇦' },
    { name: 'Calgary', country: 'Canada', flag: '🇨🇦' },
    { name: 'Ottawa', country: 'Canada', flag: '🇨🇦' },
    // Australia
    { name: 'Sydney', country: 'Australia', flag: '🇦🇺' },
    { name: 'Melbourne', country: 'Australia', flag: '🇦🇺' },
    { name: 'Brisbane', country: 'Australia', flag: '🇦🇺' },
    { name: 'Perth', country: 'Australia', flag: '🇦🇺' },
    { name: 'Adelaide', country: 'Australia', flag: '🇦🇺' },
    // USA
    { name: 'New York', country: 'USA', flag: '🇺🇸' },
    { name: 'Los Angeles', country: 'USA', flag: '🇺🇸' },
    { name: 'San Francisco', country: 'USA', flag: '🇺🇸' },
    { name: 'Chicago', country: 'USA', flag: '🇺🇸' },
    { name: 'Houston', country: 'USA', flag: '🇺🇸' },
    { name: 'Phoenix', country: 'USA', flag: '🇺🇸' },
    { name: 'Philadelphia', country: 'USA', flag: '🇺🇸' },
    { name: 'San Antonio', country: 'USA', flag: '🇺🇸' },
    { name: 'San Diego', country: 'USA', flag: '🇺🇸' },
    { name: 'Dallas', country: 'USA', flag: '🇺🇸' },
    { name: 'San Jose', country: 'USA', flag: '🇺🇸' },
    { name: 'Austin', country: 'USA', flag: '🇺🇸' },
    // UK
    { name: 'London', country: 'UK', flag: '🇬🇧' },
    { name: 'Manchester', country: 'UK', flag: '🇬🇧' },
    { name: 'Birmingham', country: 'UK', flag: '🇬🇧' },
    { name: 'Liverpool', country: 'UK', flag: '🇬🇧' },
    { name: 'Leeds', country: 'UK', flag: '🇬🇧' },
    { name: 'Glasgow', country: 'UK', flag: '🇬🇧' }
  ];

  const handlePreferenceChange = (field, value) => {
    setPartnerPreferences(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleMultiSelect = (field, value) => {
    setPartnerPreferences(prev => ({
      ...prev,
      [field]: prev[field].includes(value) 
        ? prev[field].filter(item => item !== value)
        : [...prev[field], value]
    }));
  };

  const handleSingleSelect = (field, value) => {
    setPartnerPreferences(prev => ({
      ...prev,
      [field]: [value]
    }));
  };

  const handleAgeRangeChange = (index, value) => {
    const newRange = [...partnerPreferences.ageRange];
    newRange[index] = parseInt(value);
    // Ensure min is not greater than max
    if (index === 0 && newRange[0] > newRange[1]) {
      newRange[1] = newRange[0];
    } else if (index === 1 && newRange[1] < newRange[0]) {
      newRange[0] = newRange[1];
    }
    setPartnerPreferences(prev => ({
      ...prev,
      ageRange: newRange
    }));
  };

  const toggleDropdown = (field) => {
    setOpenDropdowns(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const descriptionFormats = [
    {
      id: 'text',
      title: 'Written Description',
      description: 'Describe your ideal partner in words',
      icon: Type,
      color: 'from-blue-500 to-cyan-500',
      bgColor: 'from-blue-50 to-cyan-50'
    },
    {
      id: 'voice',
      title: 'Voice Message',
      description: 'Speak about what you seek (20 seconds)',
      icon: Mic,
      color: 'from-green-500 to-emerald-500',
      bgColor: 'from-green-50 to-emerald-50'
    },
    {
      id: 'visual',
      title: 'Visual Story',
      description: 'AI-generated image of your ideal match',
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
    localStorage.setItem('partnerPreferences', JSON.stringify(partnerPreferences));
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
            <Heart className="w-6 h-6 text-pink-400" />
            <span className="text-white font-semibold">Your Perfect Match</span>
          </div>
          <h1 className="text-5xl font-bold text-white mb-4">
            What Are You Looking For?
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Describe your ideal Co-Lifer based on your values, vision, and what drives you.
          </p>
        </div>

        {/* Your Profile Summary */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-6 text-center">Based on Your Profile</h2>
          <div className="max-w-4xl mx-auto">
            <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-6 border border-white/20">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column - Identity */}
                <div className="flex items-center gap-4">
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center bg-gradient-to-r ${currentMask.color}`}>
                  <span className="text-2xl">{currentMask.emoji}</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white capitalize">{userRole}</h3>
                  <p className="text-gray-300 text-sm">{stages[userStage]}</p>
                  <p className="text-gray-400 text-xs">{currentMask.name}</p>
                </div>
              </div>
              
                {/* Middle Column - Mission Statement */}
                {missionStatement && (
                  <div className="lg:col-span-2">
                    <p className="text-white text-sm leading-relaxed">{missionStatement}</p>
                  </div>
                )}
              </div>
              
              {/* Bottom Row - Values and Intent */}
              <div className="mt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                {/* Values */}
                {selectedValues.length > 0 && (
              <div className="flex flex-wrap gap-2">
                    {selectedValues.slice(0, 5).map((value, index) => (
                  <span key={index} className="px-3 py-1 bg-white/20 text-white text-xs rounded-full">
                    {value}
                  </span>
                ))}
                  </div>
                )}
                
                {/* Intent */}
                {selectedIntent && (
                  <div className="text-right">
                    <p className="text-white text-sm capitalize font-medium">{selectedIntent.replace('-', ' ')}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

      {/* Partner Preferences */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-white mb-6 text-center">What Are You Looking For?</h2>
        <div className="max-w-6xl mx-auto">
          <div className="bg-gradient-to-br from-white/20 to-white/15 backdrop-blur-sm rounded-3xl p-8 border border-white/30 shadow-2xl">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left Column */}
              <div className="space-y-6">
                {/* Age Range Slider */}
                <div>
                  <label className="block text-white font-semibold mb-4 text-sm">Age Range</label>
                  <div className="bg-white/15 rounded-xl p-6 border border-white/20">
                    <div className="flex items-center justify-between mb-6">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-purple-400">{partnerPreferences.ageRange[0]}</div>
                        <div className="text-xs text-gray-400">Min Age</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-400">{partnerPreferences.ageRange[1]}</div>
                        <div className="text-xs text-gray-400">Max Age</div>
                      </div>
                    </div>
                    <div className="relative h-8">
                      {/* Background track */}
                      <div className="absolute top-1/2 left-0 right-0 h-2 bg-white/20 rounded-lg transform -translate-y-1/2"></div>
                      
                      {/* Selected range track */}
                      <div 
                        className="absolute top-1/2 h-2 bg-gradient-to-r from-purple-500 to-green-500 rounded-lg transform -translate-y-1/2"
                        style={{
                          left: `${((partnerPreferences.ageRange[0] - 18) / (65 - 18)) * 100}%`,
                          width: `${((partnerPreferences.ageRange[1] - partnerPreferences.ageRange[0]) / (65 - 18)) * 100}%`
                        }}
                      ></div>
                      
                      {/* Min handle */}
                      <input
                        type="range"
                        min="18"
                        max="65"
                        value={partnerPreferences.ageRange[0]}
                        onChange={(e) => handleAgeRangeChange(0, e.target.value)}
                        className="absolute top-1/2 left-0 w-full h-8 bg-transparent appearance-none cursor-pointer transform -translate-y-1/2 slider-handle"
                        style={{ zIndex: partnerPreferences.ageRange[0] > partnerPreferences.ageRange[1] - 2 ? 5 : 3 }}
                      />
                      
                      {/* Max handle */}
                      <input
                        type="range"
                        min="18"
                        max="65"
                        value={partnerPreferences.ageRange[1]}
                        onChange={(e) => handleAgeRangeChange(1, e.target.value)}
                        className="absolute top-1/2 left-0 w-full h-8 bg-transparent appearance-none cursor-pointer transform -translate-y-1/2 slider-handle"
                        style={{ zIndex: partnerPreferences.ageRange[1] < partnerPreferences.ageRange[0] + 2 ? 5 : 3 }}
                      />
                    </div>
                    <div className="flex justify-between text-xs text-gray-400 mt-4">
                      <span>18</span>
                      <span>65</span>
                    </div>
                  </div>
                </div>

                {/* Career Field - Dropdown Multi Select */}
                <div className="relative">
                  <label className="block text-white font-semibold mb-3 text-sm">Career Fields</label>
                  <button
                    onClick={() => toggleDropdown('careerField')}
                    className="w-full p-4 bg-white/20 border border-white/30 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 hover:bg-white/25 flex items-center justify-between group"
                  >
                    <div className="flex flex-wrap gap-1">
                      {partnerPreferences.careerField.length > 0 ? (
                        partnerPreferences.careerField.slice(0, 2).map((field, index) => (
                          <span key={index} className="inline-flex items-center gap-1 px-2 py-1 bg-purple-500/30 text-purple-100 text-xs rounded-md border border-purple-400/50">
                            {field}
                          </span>
                        ))
                      ) : (
                        <span className="text-gray-400">Select career fields</span>
                      )}
                      {partnerPreferences.careerField.length > 2 && (
                        <span className="text-purple-300 text-xs">+{partnerPreferences.careerField.length - 2} more</span>
                      )}
                    </div>
                    <ChevronDown className={`w-5 h-5 transition-transform duration-300 ${openDropdowns.careerField ? 'rotate-180' : ''} group-hover:scale-110`} />
                  </button>
                  
                  {openDropdowns.careerField && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-gray-900/95 backdrop-blur-md border border-white/50 rounded-xl shadow-2xl z-20 max-h-60 overflow-y-auto ring-1 ring-white/20">
                      <div className="p-3">
                        <div className="text-xs text-gray-200 mb-2 px-2 font-medium">Select multiple options</div>
                        {careerFields.map((field) => (
                          <label key={field} className="flex items-center p-3 hover:bg-white/30 rounded-lg cursor-pointer transition-colors duration-200 group">
                            <input
                              type="checkbox"
                              checked={partnerPreferences.careerField.includes(field)}
                              onChange={() => handleMultiSelect('careerField', field)}
                              className="mr-3 w-4 h-4 text-purple-500 bg-white/20 border-white/40 rounded focus:ring-purple-500 focus:ring-2"
                            />
                            <span className="text-white text-sm group-hover:text-purple-200 transition-colors duration-200 font-medium">{field}</span>
                            {partnerPreferences.careerField.includes(field) && (
                              <CheckCircle className="w-4 h-4 text-purple-400 ml-auto" />
                            )}
                          </label>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Education Level - Dropdown Multi Select */}
                <div className="relative">
                  <label className="block text-white font-semibold mb-3 text-sm">Education Levels</label>
                  <button
                    onClick={() => toggleDropdown('education')}
                    className="w-full p-4 bg-white/20 border border-white/30 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 hover:bg-white/25 flex items-center justify-between group"
                  >
                    <div className="flex flex-wrap gap-1">
                      {partnerPreferences.education.length > 0 ? (
                        partnerPreferences.education.slice(0, 2).map((level, index) => (
                          <span key={index} className="inline-flex items-center gap-1 px-2 py-1 bg-blue-500/30 text-blue-100 text-xs rounded-md border border-blue-400/50">
                            {level}
                          </span>
                        ))
                      ) : (
                        <span className="text-gray-400">Select education levels</span>
                      )}
                      {partnerPreferences.education.length > 2 && (
                        <span className="text-blue-300 text-xs">+{partnerPreferences.education.length - 2} more</span>
                      )}
                    </div>
                    <ChevronDown className={`w-5 h-5 transition-transform duration-300 ${openDropdowns.education ? 'rotate-180' : ''} group-hover:scale-110`} />
                  </button>
                  
                  {openDropdowns.education && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-gray-900/95 backdrop-blur-md border border-white/50 rounded-xl shadow-2xl z-20 max-h-60 overflow-y-auto ring-1 ring-white/20">
                      <div className="p-3">
                        <div className="text-xs text-gray-200 mb-2 px-2 font-medium">Select multiple options</div>
                        {educationLevels.map((level) => (
                          <label key={level} className="flex items-center p-3 hover:bg-white/30 rounded-lg cursor-pointer transition-colors duration-200 group">
                            <input
                              type="checkbox"
                              checked={partnerPreferences.education.includes(level)}
                              onChange={() => handleMultiSelect('education', level)}
                              className="mr-3 w-4 h-4 text-blue-500 bg-white/20 border-white/40 rounded focus:ring-blue-500 focus:ring-2"
                            />
                            <span className="text-white text-sm group-hover:text-blue-200 transition-colors duration-200 font-medium">{level}</span>
                            {partnerPreferences.education.includes(level) && (
                              <CheckCircle className="w-4 h-4 text-blue-400 ml-auto" />
                            )}
                          </label>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-6">
                {/* Location - Dropdown Multi Select */}
                <div className="relative">
                  <label className="block text-white font-semibold mb-3 text-sm">Preferred Locations</label>
                  <button
                    onClick={() => toggleDropdown('location')}
                    className="w-full p-4 bg-white/20 border border-white/30 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300 hover:bg-white/25 flex items-center justify-between group"
                  >
                    <div className="flex flex-wrap gap-1">
                      {partnerPreferences.location.length > 0 ? (
                        partnerPreferences.location.slice(0, 2).map((location, index) => {
                          const [city, country] = location.split(', ');
                          const cityData = cities.find(c => c.name === city && c.country === country);
                          return (
                            <span key={index} className="inline-flex items-center gap-1 px-2 py-1 bg-green-500/30 text-green-100 text-xs rounded-md border border-green-400/50">
                              <span>{cityData?.flag || '🌍'}</span>
                              <span>{city}</span>
                            </span>
                          );
                        })
                      ) : (
                        <span className="text-gray-400">Select locations</span>
                      )}
                      {partnerPreferences.location.length > 2 && (
                        <span className="text-green-300 text-xs">+{partnerPreferences.location.length - 2} more</span>
                      )}
                    </div>
                    <ChevronDown className={`w-5 h-5 transition-transform duration-300 ${openDropdowns.location ? 'rotate-180' : ''} group-hover:scale-110`} />
                  </button>
                  
                  {openDropdowns.location && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-gray-900/95 backdrop-blur-md border border-white/50 rounded-xl shadow-2xl z-20 max-h-60 overflow-y-auto ring-1 ring-white/20">
                      <div className="p-3">
                        <div className="text-xs text-gray-200 mb-2 px-2 font-medium">Select multiple locations</div>
                        {cities.map((city) => (
                          <label key={`${city.name}-${city.country}`} className="flex items-center p-3 hover:bg-white/30 rounded-lg cursor-pointer transition-colors duration-200 group">
                            <input
                              type="checkbox"
                              checked={partnerPreferences.location.includes(`${city.name}, ${city.country}`)}
                              onChange={() => handleMultiSelect('location', `${city.name}, ${city.country}`)}
                              className="mr-3 w-4 h-4 text-green-500 bg-white/20 border-white/40 rounded focus:ring-green-500 focus:ring-2"
                            />
                            <span className="text-white text-sm flex items-center gap-2 group-hover:text-green-200 transition-colors duration-200 font-medium">
                              <span>{city.flag}</span>
                              <span>{city.name}, {city.country}</span>
                            </span>
                            {partnerPreferences.location.includes(`${city.name}, ${city.country}`) && (
                              <CheckCircle className="w-4 h-4 text-green-400 ml-auto" />
                            )}
                          </label>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Lifestyle Preferences - Dropdown Multi Select */}
                <div className="relative">
                  <label className="block text-white font-semibold mb-3 text-sm">Lifestyle Preferences</label>
                  <button
                    onClick={() => toggleDropdown('lifestyle')}
                    className="w-full p-4 bg-white/20 border border-white/30 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300 hover:bg-white/25 flex items-center justify-between group"
                  >
                    <div className="flex flex-wrap gap-1">
                      {partnerPreferences.lifestyle.length > 0 ? (
                        partnerPreferences.lifestyle.slice(0, 2).map((option, index) => (
                          <span key={index} className="inline-flex items-center gap-1 px-2 py-1 bg-orange-500/30 text-orange-100 text-xs rounded-md border border-orange-400/50">
                            {option}
                          </span>
                        ))
                      ) : (
                        <span className="text-gray-400">Select lifestyle preferences</span>
                      )}
                      {partnerPreferences.lifestyle.length > 2 && (
                        <span className="text-orange-300 text-xs">+{partnerPreferences.lifestyle.length - 2} more</span>
                      )}
                    </div>
                    <ChevronDown className={`w-5 h-5 transition-transform duration-300 ${openDropdowns.lifestyle ? 'rotate-180' : ''} group-hover:scale-110`} />
                  </button>
                  
                  {openDropdowns.lifestyle && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-gray-900/95 backdrop-blur-md border border-white/50 rounded-xl shadow-2xl z-20 max-h-60 overflow-y-auto ring-1 ring-white/20">
                      <div className="p-3">
                        <div className="text-xs text-gray-200 mb-2 px-2 font-medium">Select multiple options</div>
                        {lifestyleOptions.map((option) => (
                          <label key={option} className="flex items-center p-3 hover:bg-white/30 rounded-lg cursor-pointer transition-colors duration-200 group">
                            <input
                              type="checkbox"
                              checked={partnerPreferences.lifestyle.includes(option)}
                              onChange={() => handleMultiSelect('lifestyle', option)}
                              className="mr-3 w-4 h-4 text-orange-500 bg-white/20 border-white/40 rounded focus:ring-orange-500 focus:ring-2"
                            />
                            <span className="text-white text-sm group-hover:text-orange-200 transition-colors duration-200 font-medium">{option}</span>
                            {partnerPreferences.lifestyle.includes(option) && (
                              <CheckCircle className="w-4 h-4 text-orange-400 ml-auto" />
                            )}
                          </label>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Life Priorities - Dropdown Multi Select */}
                <div className="relative">
                  <label className="block text-white font-semibold mb-3 text-sm">Life Priorities / Values</label>
                  <button
                    onClick={() => toggleDropdown('lifePriorities')}
                    className="w-full p-4 bg-white/20 border border-white/30 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-300 hover:bg-white/25 flex items-center justify-between group"
                  >
                    <div className="flex flex-wrap gap-1">
                      {partnerPreferences.lifePriorities.length > 0 ? (
                        partnerPreferences.lifePriorities.slice(0, 2).map((priority, index) => (
                          <span key={index} className="inline-flex items-center gap-1 px-2 py-1 bg-pink-500/30 text-pink-100 text-xs rounded-md border border-pink-400/50">
                            {priority}
                          </span>
                        ))
                      ) : (
                        <span className="text-gray-400">Select top 2-3 priorities</span>
                      )}
                      {partnerPreferences.lifePriorities.length > 2 && (
                        <span className="text-pink-300 text-xs">+{partnerPreferences.lifePriorities.length - 2} more</span>
                      )}
                    </div>
                    <ChevronDown className={`w-5 h-5 transition-transform duration-300 ${openDropdowns.lifePriorities ? 'rotate-180' : ''} group-hover:scale-110`} />
                  </button>
                  
                  {openDropdowns.lifePriorities && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-gray-900/95 backdrop-blur-md border border-white/50 rounded-xl shadow-2xl z-20 max-h-60 overflow-y-auto ring-1 ring-white/20">
                      <div className="p-3">
                        <div className="text-xs text-gray-200 mb-2 px-2 font-medium">Select top 2-3 priorities</div>
                        {lifePriorities.map((priority) => (
                          <label key={priority} className="flex items-center p-3 hover:bg-white/30 rounded-lg cursor-pointer transition-colors duration-200 group">
                            <input
                              type="checkbox"
                              checked={partnerPreferences.lifePriorities.includes(priority)}
                              onChange={() => handleMultiSelect('lifePriorities', priority)}
                              className="mr-3 w-4 h-4 text-pink-500 bg-white/20 border-white/40 rounded focus:ring-pink-500 focus:ring-2"
                            />
                            <span className="text-white text-sm group-hover:text-pink-200 transition-colors duration-200 font-medium">{priority}</span>
                            {partnerPreferences.lifePriorities.includes(priority) && (
                              <CheckCircle className="w-4 h-4 text-pink-400 ml-auto" />
                            )}
                          </label>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Relationship Goals - Single Select */}
                <div className="relative">
                  <label className="block text-white font-semibold mb-3 text-sm">Relationship Intentions / Timeline</label>
                  <button
                    onClick={() => toggleDropdown('relationshipGoals')}
                    className="w-full p-4 bg-white/20 border border-white/30 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300 hover:bg-white/25 flex items-center justify-between group"
                  >
                    <div className="flex flex-wrap gap-1">
                      {partnerPreferences.relationshipGoals.length > 0 ? (
                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-indigo-500/30 text-indigo-100 text-xs rounded-md border border-indigo-400/50">
                          {partnerPreferences.relationshipGoals[0]}
                        </span>
                      ) : (
                        <span className="text-gray-400">Select relationship intention</span>
                      )}
                    </div>
                    <ChevronDown className={`w-5 h-5 transition-transform duration-300 ${openDropdowns.relationshipGoals ? 'rotate-180' : ''} group-hover:scale-110`} />
                  </button>
                  
                  {openDropdowns.relationshipGoals && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-gray-900/95 backdrop-blur-md border border-white/50 rounded-xl shadow-2xl z-20 max-h-60 overflow-y-auto ring-1 ring-white/20">
                      <div className="p-3">
                        <div className="text-xs text-gray-200 mb-2 px-2 font-medium">Select one option</div>
                        {relationshipGoals.map((goal) => (
                          <label key={goal} className="flex items-center p-3 hover:bg-white/30 rounded-lg cursor-pointer transition-colors duration-200 group">
                            <input
                              type="radio"
                              name="relationshipGoals"
                              checked={partnerPreferences.relationshipGoals.includes(goal)}
                              onChange={() => handleSingleSelect('relationshipGoals', goal)}
                              className="mr-3 w-4 h-4 text-indigo-500 bg-white/20 border-white/40 focus:ring-indigo-500 focus:ring-2"
                            />
                            <span className="text-white text-sm group-hover:text-indigo-200 transition-colors duration-200 font-medium">{goal}</span>
                            {partnerPreferences.relationshipGoals.includes(goal) && (
                              <CheckCircle className="w-4 h-4 text-indigo-400 ml-auto" />
                            )}
                          </label>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>


        {/* Description Format Selection */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-6 text-center">How Would You Like to Describe Your Ideal Partner?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
            {descriptionFormats.map((format) => {
              const Icon = format.icon;
              const isSelected = pitchFormat === format.id;
              return (
                <button
                  key={format.id}
                  onClick={() => handleFormatSelect(format.id)}
                  className={`p-4 rounded-2xl border-2 transition-all duration-300 hover:scale-105 ${
                    isSelected
                      ? `bg-gradient-to-r ${format.color} border-white shadow-xl`
                      : 'bg-white/10 border-white/20 hover:border-white/40 hover:bg-white/20'
                  }`}
                >
                  <div className="text-center">
                    <div className={`w-12 h-12 mx-auto mb-3 rounded-xl flex items-center justify-center ${
                      isSelected ? 'bg-white/20' : `bg-gradient-to-r ${format.color}`
                    }`}>
                      <Icon className={`w-6 h-6 ${isSelected ? 'text-white' : 'text-white'}`} />
                    </div>
                    <h3 className="text-lg font-bold text-white mb-1">{format.title}</h3>
                    <p className="text-gray-300 text-xs">{format.description}</p>
                    {isSelected && (
                      <div className="mt-3 flex items-center justify-center gap-2 text-white">
                        <CheckCircle className="w-4 h-4" />
                        <span className="text-xs font-semibold">Selected</span>
                      </div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Partner Description Creation */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-6 text-center">Describe Your Ideal Co-Lifer</h2>
          
          {pitchFormat === 'text' && (
            <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 border border-white/20">
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-white mb-4">What are you looking for? Complete this thought:</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {partnerPrompts.map((prompt, index) => (
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
                <label className="block text-white font-semibold mb-3">Describe your ideal partner:</label>
                <textarea
                  value={pitchText}
                  onChange={(e) => setPitchText(e.target.value)}
                  placeholder="Tell us about the Co-Lifer you're seeking..."
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
              <h3 className="text-lg font-semibold text-white mb-6">Record What You're Looking For</h3>
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
                 hasVoiceNote ? 'Voice message recorded successfully!' : 
                 'Tap to record what you\'re looking for (20 seconds)'}
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
              <h3 className="text-lg font-semibold text-white mb-6">AI-Generated Visual of Your Ideal Match</h3>
              <div className="w-48 h-48 mx-auto mb-6 bg-gradient-to-br from-purple-500 to-pink-500 rounded-3xl flex items-center justify-center">
                <Sparkles className="w-16 h-16 text-white" />
              </div>
              <p className="text-gray-300 mb-6">
                We'll generate a symbolic image of your ideal Co-Lifer based on your values and preferences
              </p>
              <button className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all duration-300">
                Generate Visual Match
              </button>
            </div>
          )}
        </div>

        {/* Preview Card */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-6 text-center">Preview Your Partner Preference Card</h2>
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-3xl p-6 shadow-2xl border border-gray-200">
              <div className="flex items-center gap-4 mb-6">
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center bg-gradient-to-r ${currentMask.color}`}>
                  <span className="text-2xl">{currentMask.emoji}</span>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 capitalize">{userRole}</h3>
                  <p className="text-gray-600 text-sm">{stages[userStage]}</p>
                </div>
              </div>
              
              <div className="mb-6">
                <p className="text-gray-700 text-sm mb-4">
                  {pitchFormat === 'text' ? pitchText || 'Looking for my ideal Co-Lifer...' : 
                   pitchFormat === 'voice' ? '🎤 Voice message recorded' :
                   '🎨 Visual match generated'}
                </p>
                
                {/* Partner Preferences */}
                <div className="space-y-4">
                  {/* Age Range */}
                  <div className="flex items-center gap-2">
                    <span className="text-gray-500 text-xs font-medium w-20">Age:</span>
                    <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-md font-medium">
                      {partnerPreferences.ageRange[0]}-{partnerPreferences.ageRange[1]}
                    </span>
                  </div>
                  
                  {/* Career Fields */}
                  {partnerPreferences.careerField.length > 0 && (
                    <div className="flex items-start gap-2">
                      <span className="text-gray-500 text-xs font-medium w-20 mt-1">Career:</span>
                      <div className="flex flex-wrap gap-1">
                        {partnerPreferences.careerField.slice(0, 3).map((field, index) => (
                          <span key={index} className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-md">
                            {field}
                          </span>
                        ))}
                        {partnerPreferences.careerField.length > 3 && (
                          <span className="px-2 py-1 bg-gray-100 text-gray-500 text-xs rounded-md">
                            +{partnerPreferences.careerField.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                  
                  {/* Education */}
                  {partnerPreferences.education.length > 0 && (
                    <div className="flex items-start gap-2">
                      <span className="text-gray-500 text-xs font-medium w-20 mt-1">Education:</span>
                      <div className="flex flex-wrap gap-1">
                        {partnerPreferences.education.slice(0, 2).map((level, index) => (
                          <span key={index} className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-md">
                            {level}
                          </span>
                        ))}
                        {partnerPreferences.education.length > 2 && (
                          <span className="px-2 py-1 bg-gray-100 text-gray-500 text-xs rounded-md">
                            +{partnerPreferences.education.length - 2} more
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                  
                  {/* Locations */}
                  {partnerPreferences.location.length > 0 && (
                    <div className="flex items-start gap-2">
                      <span className="text-gray-500 text-xs font-medium w-20 mt-1">Location:</span>
                      <div className="flex flex-wrap gap-1">
                        {partnerPreferences.location.slice(0, 2).map((location, index) => {
                          const [city, country] = location.split(', ');
                          const cityData = cities.find(c => c.name === city && c.country === country);
                          return (
                            <span key={index} className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-md flex items-center gap-1">
                              <span>{cityData?.flag || '🌍'}</span>
                              <span>{city}</span>
                            </span>
                          );
                        })}
                        {partnerPreferences.location.length > 2 && (
                          <span className="px-2 py-1 bg-gray-100 text-gray-500 text-xs rounded-md">
                            +{partnerPreferences.location.length - 2} more
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                  
                  {/* Lifestyle */}
                  {partnerPreferences.lifestyle.length > 0 && (
                    <div className="flex items-start gap-2">
                      <span className="text-gray-500 text-xs font-medium w-20 mt-1">Lifestyle:</span>
                      <div className="flex flex-wrap gap-1">
                        {partnerPreferences.lifestyle.slice(0, 3).map((option, index) => (
                          <span key={index} className="px-2 py-1 bg-orange-100 text-orange-700 text-xs rounded-md">
                            {option}
                          </span>
                        ))}
                        {partnerPreferences.lifestyle.length > 3 && (
                          <span className="px-2 py-1 bg-gray-100 text-gray-500 text-xs rounded-md">
                            +{partnerPreferences.lifestyle.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </div>
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
            <span>Find My Co-Lifer →</span>
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