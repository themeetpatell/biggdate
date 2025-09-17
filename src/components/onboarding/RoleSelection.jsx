import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Rocket, 
  Diamond, 
  Flame, 
  Crown, 
  Star, 
  Zap, 
  Target, 
  Users, 
  TrendingUp, 
  Award, 
  ChevronRight, 
  ArrowRight,
  Sparkles,
  Shield,
  Globe,
  Heart,
  Brain,
  Lightbulb,
  CheckCircle
} from 'lucide-react';

const RoleSelection = () => {
  const [selectedStage, setSelectedStage] = useState('');
  const [selectedMask, setSelectedMask] = useState('');
  const [isAnimating, setIsAnimating] = useState(false);
  const [birthPlace, setBirthPlace] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filteredCities, setFilteredCities] = useState([]);
  const navigate = useNavigate();
  
  // Get role from localStorage (set during sign-up)
  const userRole = localStorage.getItem('userRole') || 'founder';
  
  // Popular cities list
  const popularCities = [
    'New York, USA', 'London, UK', 'San Francisco, USA', 'Tokyo, Japan', 'Paris, France',
    'Sydney, Australia', 'Toronto, Canada', 'Berlin, Germany', 'Mumbai, India', 'Dubai, UAE',
    'Ahmedabad, India', 'Bangalore, India', 'Delhi, India', 'Chennai, India', 'Pune, India',
    'Kolkata, India', 'Hyderabad, India', 'Gurgaon, India', 'Noida, India', 'Kochi, India',
    'Los Angeles, USA', 'Chicago, USA', 'Houston, USA', 'Phoenix, USA', 'Philadelphia, USA',
    'San Antonio, USA', 'San Diego, USA', 'Dallas, USA', 'San Jose, USA', 'Austin, USA',
    'Melbourne, Australia', 'Brisbane, Australia', 'Perth, Australia', 'Adelaide, Australia',
    'Vancouver, Canada', 'Montreal, Canada', 'Calgary, Canada', 'Ottawa, Canada',
    'Manchester, UK', 'Birmingham, UK', 'Liverpool, UK', 'Leeds, UK', 'Glasgow, UK',
    'Madrid, Spain', 'Barcelona, Spain', 'Rome, Italy', 'Milan, Italy', 'Amsterdam, Netherlands',
    'Zurich, Switzerland', 'Vienna, Austria', 'Brussels, Belgium', 'Copenhagen, Denmark',
    'Stockholm, Sweden', 'Oslo, Norway', 'Helsinki, Finland', 'Dublin, Ireland'
  ];

  const roles = [
    {
      id: 'founder',
      title: 'Founder',
      description: 'The visionary, the risk-taker, the dreamer who builds',
      icon: Rocket,
      color: 'from-purple-500 to-pink-500',
      bgColor: 'from-purple-50 to-pink-50',
      stages: [
        {
          id: 'idea',
          title: 'Idea Stage',
          description: 'Dreaming it, shaping it, pitching napkin sketches',
          icon: Lightbulb,
          color: 'from-yellow-500 to-orange-500'
        },
        {
          id: 'seed',
          title: 'Seed Stage',
          description: 'Built an MVP, chasing early users and funding',
          icon: Target,
          color: 'from-green-500 to-emerald-500'
        },
        {
          id: 'growth',
          title: 'Growth Stage',
          description: 'Scaling users, hiring team, sleepless nights',
          icon: TrendingUp,
          color: 'from-blue-500 to-cyan-500'
        },
        {
          id: 'scale',
          title: 'Scale Stage',
          description: 'Global expansion, market dominance, building empire',
          icon: Globe,
          color: 'from-indigo-500 to-purple-500'
        },
        {
          id: 'exit',
          title: 'Exit Stage',
          description: 'Exited, mentoring, angel investing, maybe starting again',
          icon: Crown,
          color: 'from-purple-500 to-indigo-500'
        }
      ]
    },
    {
      id: 'investor',
      title: 'Investor',
      description: 'The backer, the believer, the one who sees potential',
      icon: Diamond,
      color: 'from-green-500 to-emerald-500',
      bgColor: 'from-green-50 to-emerald-50',
      stages: [
        {
          id: 'angel',
          title: 'Angel',
          description: 'Backing bold dreamers, writing the first checks',
          icon: Heart,
          color: 'from-pink-500 to-rose-500'
        },
        {
          id: 'vc-seed',
          title: 'VC Seed',
          description: 'Hunting the next big wave, funding early believers',
          icon: Zap,
          color: 'from-blue-500 to-cyan-500'
        },
        {
          id: 'growth-capital',
          title: 'Growth Capital',
          description: 'Scaling rockets, chasing unicorns',
          icon: TrendingUp,
          color: 'from-orange-500 to-red-500'
        },
        {
          id: 'family-office',
          title: 'Family Office / LP / Exited Operator',
          description: 'Legacy building, shaping futures',
          icon: Crown,
          color: 'from-purple-500 to-indigo-500'
        }
      ]
    },
    {
      id: 'builder',
      title: 'Builder',
      description: 'The executor, the maker, the one who turns ideas into reality',
      icon: Flame,
      color: 'from-orange-500 to-red-500',
      bgColor: 'from-orange-50 to-red-50',
      stages: [
        {
          id: 'early-builder',
          title: 'Early Builder',
          description: 'First 10 hires, wearing 10 hats',
          icon: Users,
          color: 'from-blue-500 to-cyan-500'
        },
        {
          id: 'scaling-operator',
          title: 'Scaling Operator',
          description: 'Building systems, leading teams, sweating OKRs',
          icon: Target,
          color: 'from-green-500 to-emerald-500'
        },
        {
          id: 'growth-leader',
          title: 'Growth Leader',
          description: 'Managing orgs, driving culture, steering scale-ups',
          icon: TrendingUp,
          color: 'from-purple-500 to-pink-500'
        },
        {
          id: 'veteran-operator',
          title: 'Veteran Operator',
          description: 'Exited, advising, angel building, teaching the next gen',
          icon: Award,
          color: 'from-indigo-500 to-purple-500'
        }
      ]
    }
  ];

  const masks = [
    {
      id: 'rocket',
      title: 'Rocket',
      emoji: '🚀',
      description: 'The innovator, always reaching for the stars',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      id: 'diamond',
      title: 'Diamond',
      emoji: '💎',
      description: 'The rare gem, valuable and multifaceted',
      color: 'from-purple-500 to-pink-500'
    },
    {
      id: 'flame',
      title: 'Flame',
      emoji: '🔥',
      description: 'The passionate one, burning bright with purpose',
      color: 'from-orange-500 to-red-500'
    },
    {
      id: 'crown',
      title: 'Crown',
      emoji: '👑',
      description: 'The leader, born to rule and inspire',
      color: 'from-yellow-500 to-orange-500'
    },
    {
      id: 'star',
      title: 'Star',
      emoji: '⭐',
      description: 'The shining light, guiding others forward',
      color: 'from-indigo-500 to-purple-500'
    },
    {
      id: 'shield',
      title: 'Shield',
      emoji: '🛡️',
      description: 'The protector, building safe spaces for growth',
      color: 'from-green-500 to-emerald-500'
    }
  ];

  const selectedRoleData = roles.find(role => role.id === userRole);


  const handleStageSelect = (stageId) => {
    setIsAnimating(true);
    setSelectedStage(stageId);
    setTimeout(() => setIsAnimating(false), 300);
  };

  const handleMaskSelect = (maskId) => {
    setIsAnimating(true);
    setSelectedMask(maskId);
    setTimeout(() => setIsAnimating(false), 300);
  };

  const handleBirthPlaceChange = (e) => {
    const value = e.target.value;
    setBirthPlace(value);
    
    if (value.length > 0) {
      const filtered = popularCities.filter(city => 
        city.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredCities(filtered);
      setShowSuggestions(true);
    } else {
      setFilteredCities([]);
      setShowSuggestions(false);
    }
  };

  const handleCitySelect = (city) => {
    setBirthPlace(city);
    setShowSuggestions(false);
    setFilteredCities([]);
  };

  const handleBirthPlaceFocus = () => {
    if (birthPlace.length === 0) {
      setFilteredCities(popularCities.slice(0, 10));
      setShowSuggestions(true);
    }
  };

  const handleBirthPlaceBlur = () => {
    // Delay hiding suggestions to allow clicking on them
    setTimeout(() => {
      setShowSuggestions(false);
    }, 200);
  };

  const handleContinue = () => {
    if (selectedStage && selectedMask) {
      // Save to localStorage
      localStorage.setItem('userStage', selectedStage);
      localStorage.setItem('userMask', selectedMask);
      
      // Navigate to next step
      navigate('/onboarding/mission');
    }
  };

  const isComplete = selectedStage && selectedMask;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-indigo-900 flex items-center justify-center p-2 sm:p-4 lg:p-6">
      <div className="w-full max-w-7xl">
        {/* Header */}
        <div className="text-center mb-6 sm:mb-8 lg:mb-12">
          <div className="inline-flex items-center gap-2 sm:gap-3 bg-white/10 backdrop-blur-sm px-4 sm:px-6 py-2 sm:py-3 rounded-full mb-4 sm:mb-6">
            <Crown className="w-4 h-4 sm:w-6 sm:h-6 text-yellow-400" />
            <span className="text-white font-semibold text-sm sm:text-base">Welcome to the Inner Circle</span>
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-2 sm:mb-4">
            Let's get started
          </h1>
          <p className="text-xs sm:text-sm md:text-base lg:text-lg text-gray-300 max-w-4xl mx-auto px-4 whitespace-nowrap">
            Let's personalize your journey by choosing your stage, mask and birth details.
          </p>
        </div>

        {/* Role Display */}
        <div className="mb-6 sm:mb-8 lg:mb-12">
          <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-white mb-4 sm:mb-6 text-center">Your Role</h2>
          <div className="flex justify-center px-4">
            <div className="p-3 sm:p-4 rounded-xl border-2 bg-gradient-to-r from-purple-500 to-pink-500 border-white shadow-2xl w-full max-w-md">
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-white/20 flex items-center justify-center flex-shrink-0">
                  <Rocket className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-base sm:text-lg font-bold text-white mb-1">{selectedRoleData?.title || 'Founder'}</h3>
                  <p className="text-gray-200 text-xs sm:text-sm mb-2">{selectedRoleData?.description || 'The visionary, the risk-taker, the dreamer who builds'}</p>
                  <div className="flex items-center gap-2 text-white">
                    <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span className="text-xs font-semibold">Selected</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stage Selection */}
        <div className="mb-6 sm:mb-8 lg:mb-12">
          <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-white mb-4 sm:mb-6 text-center px-4">Step 1: Choose Your Stage</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 sm:gap-3 px-4">
            {selectedRoleData?.stages.map((stage) => {
              const Icon = stage.icon;
              const isSelected = selectedStage === stage.id;
              return (
                <button
                  key={stage.id}
                  onClick={() => handleStageSelect(stage.id)}
                  className={`p-2 sm:p-3 rounded-lg sm:rounded-xl border-2 transition-all duration-300 hover:scale-105 ${
                    isSelected
                      ? `bg-gradient-to-r ${stage.color} border-white shadow-xl`
                      : 'bg-white/10 border-white/20 hover:border-white/40 hover:bg-white/20'
                  }`}
                >
                  <div className="text-center">
                    <div className={`w-8 h-8 sm:w-10 sm:h-10 mx-auto mb-2 rounded-lg flex items-center justify-center ${
                      isSelected ? 'bg-white/20' : `bg-gradient-to-r ${stage.color}`
                    }`}>
                      <Icon className={`w-4 h-4 sm:w-5 sm:h-5 ${isSelected ? 'text-white' : 'text-white'}`} />
                    </div>
                    <h3 className="text-xs sm:text-sm font-bold text-white mb-1">{stage.title}</h3>
                    <p className="text-gray-300 text-xs leading-tight">{stage.description}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Mask Selection */}
        {selectedStage && (
          <div className="mb-6 sm:mb-8 lg:mb-12">
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-white mb-4 sm:mb-6 text-center px-4">Step 2: Choose Your Mask</h2>
            <p className="text-gray-300 text-center mb-6 sm:mb-8 text-sm sm:text-base px-4">
              You're masked until you pitch. Choose your symbolic identity.
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 px-4">
              {masks.map((mask) => {
                const isSelected = selectedMask === mask.id;
                return (
                  <button
                    key={mask.id}
                    onClick={() => handleMaskSelect(mask.id)}
                    className={`p-3 sm:p-6 rounded-xl sm:rounded-2xl border-2 transition-all duration-300 hover:scale-105 ${
                      isSelected
                        ? `bg-gradient-to-r ${mask.color} border-white shadow-xl`
                        : 'bg-white/10 border-white/20 hover:border-white/40 hover:bg-white/20'
                    }`}
                  >
                    <div className="text-center">
                      <div className="text-2xl sm:text-4xl mb-2 sm:mb-3">{mask.emoji}</div>
                      <h3 className="text-sm sm:text-lg font-bold text-white mb-1">{mask.title}</h3>
                      <p className="text-gray-300 text-xs">{mask.description}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Birth Details Section */}
        {selectedStage && selectedMask && (
          <div className="mb-6 sm:mb-8 lg:mb-12">
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-white mb-4 sm:mb-6 text-center px-4">Step 3: Birth Details</h2>
            <p className="text-gray-300 text-center mb-6 sm:mb-8 text-sm sm:text-base px-4">
              Share your birth information for astrological compatibility matching.
            </p>
            <div className="max-w-6xl mx-auto px-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {/* Birth Date */}
                <div className="space-y-2">
                  <label className="block text-white font-semibold mb-2 text-sm sm:text-base">Birth Date</label>
                  <div className="relative">
                    <input
                      type="date"
                      className="w-full px-3 sm:px-4 py-3 sm:py-4 bg-white/10 border border-white/20 rounded-lg sm:rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 text-sm sm:text-base"
                      style={{
                        colorScheme: 'dark',
                        background: 'rgba(255, 255, 255, 0.1)',
                        backdropFilter: 'blur(10px)'
                      }}
                    />
                    <div className="absolute inset-0 pointer-events-none rounded-lg sm:rounded-xl border border-white/20"></div>
                  </div>
                </div>

                {/* Birth Time */}
                <div className="space-y-2">
                  <label className="block text-white font-semibold mb-2 text-sm sm:text-base">Birth Time</label>
                  <div className="relative">
                    <input
                      type="time"
                      className="w-full px-3 sm:px-4 py-3 sm:py-4 bg-white/10 border border-white/20 rounded-lg sm:rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 text-sm sm:text-base"
                      style={{
                        colorScheme: 'dark',
                        background: 'rgba(255, 255, 255, 0.1)',
                        backdropFilter: 'blur(10px)'
                      }}
                    />
                    <div className="absolute inset-0 pointer-events-none rounded-lg sm:rounded-xl border border-white/20"></div>
                  </div>
                </div>

                {/* Birth Place */}
                <div className="space-y-2 sm:col-span-2 lg:col-span-1">
                  <label className="block text-white font-semibold mb-2 text-sm sm:text-base">Birth Place</label>
                  <div className="relative">
                    <input
                      type="text"
                      value={birthPlace}
                      onChange={handleBirthPlaceChange}
                      onFocus={handleBirthPlaceFocus}
                      onBlur={handleBirthPlaceBlur}
                      placeholder="Start typing city name..."
                      className="w-full px-3 sm:px-4 py-3 sm:py-4 bg-white/10 border border-white/20 rounded-lg sm:rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 text-sm sm:text-base"
                      style={{
                        background: 'rgba(255, 255, 255, 0.1)',
                        backdropFilter: 'blur(10px)'
                      }}
                    />
                    <div className="absolute inset-0 pointer-events-none rounded-lg sm:rounded-xl border border-white/20"></div>
                    
                    {/* Autocomplete Dropdown */}
                    {showSuggestions && filteredCities.length > 0 && (
                      <div className="autocomplete-dropdown absolute top-full left-0 right-0 mt-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl shadow-2xl z-10 max-h-60 overflow-y-auto">
                        <div className="p-2">
                          <div className="px-3 py-2 text-gray-300 text-sm border-b border-white/10">
                            {birthPlace.length > 0 ? 'Matching Cities' : 'Popular Cities'}
                          </div>
                          {filteredCities.slice(0, 10).map((city, index) => (
                            <button
                              key={index}
                              onClick={() => handleCitySelect(city)}
                              className="w-full text-left px-3 py-2 text-white hover:bg-white/20 rounded-lg transition-colors duration-200 text-sm"
                            >
                              {city}
                            </button>
                          ))}
                          {filteredCities.length > 10 && (
                            <div className="px-3 py-2 text-gray-400 text-xs text-center">
                              ... and {filteredCities.length - 10} more
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Continue Button */}
        {isComplete && (
          <div className="text-center px-4">
            <button
              onClick={handleContinue}
              className="px-8 sm:px-12 py-3 sm:py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl sm:rounded-2xl hover:from-purple-600 hover:to-pink-600 transition-all duration-300 font-bold text-base sm:text-lg shadow-2xl hover:shadow-purple-500/25 hover:scale-105 flex items-center gap-2 sm:gap-3 mx-auto"
            >
              <span>Define My Story →</span>
              <ArrowRight className="w-4 h-4 sm:w-6 sm:h-6" />
            </button>
          </div>
        )}

        {/* Progress Indicator */}
        <div className="mt-8 sm:mt-12 flex justify-center px-4">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 sm:w-3 sm:h-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"></div>
            <div className="w-2 h-2 sm:w-3 sm:h-3 bg-gray-600 rounded-full"></div>
            <div className="w-2 h-2 sm:w-3 sm:h-3 bg-gray-600 rounded-full"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoleSelection;