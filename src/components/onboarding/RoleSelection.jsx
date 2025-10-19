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
          id: 'idea-stage',
          title: 'Idea Stage',
          description: 'Have a startup idea and looking for cofounders',
          icon: Lightbulb,
          color: 'from-yellow-500 to-orange-500'
        },
        {
          id: 'mvp-stage',
          title: 'MVP Stage',
          description: 'Building MVP and need technical/business cofounders',
          icon: Target,
          color: 'from-green-500 to-emerald-500'
        },
        {
          id: 'growth-stage',
          title: 'Growth Stage',
          description: 'Have traction and scaling, need operational expertise',
          icon: TrendingUp,
          color: 'from-blue-500 to-cyan-500'
        },
        {
          id: 'scale-stage',
          title: 'Scale Stage',
          description: 'Expanding globally, need leadership and strategic partners',
          icon: Globe,
          color: 'from-indigo-500 to-purple-500'
        },
        {
          id: 'exit-stage',
          title: 'Exit Stage',
          description: 'Preparing for IPO, acquisition, or next big venture',
          icon: Crown,
          color: 'from-purple-500 to-indigo-500'
        }
      ]
    },
    {
      id: 'cofounder',
      title: 'Cofounder',
      description: 'The partner, the collaborator, the one who joins the journey',
      icon: Users,
      color: 'from-green-500 to-emerald-500',
      bgColor: 'from-green-50 to-emerald-50',
      stages: [
        {
          id: 'technical-cofounder',
          title: 'Technical Cofounder',
          description: 'Full-stack developer, CTO, or technical lead',
          icon: Code,
          color: 'from-blue-500 to-cyan-500'
        },
        {
          id: 'business-cofounder',
          title: 'Business Cofounder',
          description: 'CEO, business development, or operations expert',
          icon: Target,
          color: 'from-green-500 to-emerald-500'
        },
        {
          id: 'marketing-cofounder',
          title: 'Marketing Cofounder',
          description: 'CMO, growth hacker, or marketing specialist',
          icon: TrendingUp,
          color: 'from-purple-500 to-pink-500'
        },
        {
          id: 'design-cofounder',
          title: 'Design Cofounder',
          description: 'UI/UX designer, product designer, or creative director',
          icon: Palette,
          color: 'from-pink-500 to-rose-500'
        },
        {
          id: 'finance-cofounder',
          title: 'Finance Cofounder',
          description: 'CFO, financial strategist, or fundraising expert',
          icon: DollarSign,
          color: 'from-yellow-500 to-orange-500'
        }
      ]
    },
    {
      id: 'advisor',
      title: 'Advisor',
      description: 'The mentor, the guide, the one who provides wisdom',
      icon: Award,
      color: 'from-orange-500 to-red-500',
      bgColor: 'from-orange-50 to-red-50',
      stages: [
        {
          id: 'industry-expert',
          title: 'Industry Expert',
          description: 'Deep domain knowledge in specific industry',
          icon: Brain,
          color: 'from-blue-500 to-cyan-500'
        },
        {
          id: 'serial-entrepreneur',
          title: 'Serial Entrepreneur',
          description: 'Multiple successful exits and startup experience',
          icon: Rocket,
          color: 'from-green-500 to-emerald-500'
        },
        {
          id: 'investor-advisor',
          title: 'Investor Advisor',
          description: 'VC, angel investor, or funding expert',
          icon: Diamond,
          color: 'from-purple-500 to-pink-500'
        },
        {
          id: 'executive-coach',
          title: 'Executive Coach',
          description: 'Leadership development and team building expert',
          icon: Users,
          color: 'from-indigo-500 to-purple-500'
        },
        {
          id: 'board-member',
          title: 'Board Member',
          description: 'Strategic advisor and governance expert',
          icon: Shield,
          color: 'from-purple-500 to-indigo-500'
        }
      ]
    }
  ];

  const masks = [
    {
      id: 'rocket',
      title: 'Rocket',
      subtitle: 'The Visionary',
      emoji: '🚀',
      description: 'Always dreaming of what\'s next, chasing horizons with fearless energy.',
      symbolism: 'Adventure, ambition, limitless possibility.',
      cofounderVibe: 'Wants a cofounder to build galaxies with, not just grab coffee.',
      motto: 'Let\'s shoot for the stars, together.',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      id: 'diamond',
      title: 'Diamond',
      subtitle: 'The Grounded Treasure',
      emoji: '💎',
      description: 'Rare, self-aware, and built through resilience.',
      symbolism: 'Depth, clarity, inner value.',
      cofounderVibe: 'Chooses quality over quantity, looking for someone who truly sees the vision.',
      motto: 'I shine brighter with the right cofounder.',
      color: 'from-purple-500 to-pink-500'
    },
    {
      id: 'flame',
      title: 'Flame',
      subtitle: 'The Spark',
      emoji: '🔥',
      description: 'Passionate, magnetic, impossible to ignore.',
      symbolism: 'Energy, intensity, drive.',
      cofounderVibe: 'Sets teams racing, lives for partnerships that burn real.',
      motto: 'If it\'s not fire, it\'s not worth building.',
      color: 'from-orange-500 to-red-500'
    },
    {
      id: 'crown',
      title: 'Crown',
      subtitle: 'The Builder of Empires',
      emoji: '👑',
      description: 'Ambitious, driven, knows where they\'re headed.',
      symbolism: 'Purpose, leadership, legacy.',
      cofounderVibe: 'Wants a co-creator to build startup empires with.',
      motto: 'I don\'t just work. I build dynasties.',
      color: 'from-yellow-500 to-orange-500'
    },
    {
      id: 'star',
      title: 'Star',
      subtitle: 'The Dreamer Guide',
      emoji: '⭐',
      description: 'Hopeful, radiant, inspiring others with light.',
      symbolism: 'Destiny, faith, optimism.',
      cofounderVibe: 'Believes in soul partnerships and guiding startups forward.',
      motto: 'Every success story is written in the stars.',
      color: 'from-indigo-500 to-purple-500'
    },
    {
      id: 'shield',
      title: 'Shield',
      subtitle: 'The Protector',
      emoji: '🛡️',
      description: 'Loyal, steady, and safe — the rock in the storm.',
      symbolism: 'Trust, stability, reliability.',
      cofounderVibe: 'Wants to create a safe haven for startups to grow.',
      motto: 'With me, you\'ll always feel secure.',
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
    <div className="min-h-screen bg-white flex items-center justify-center p-2 sm:p-4 lg:p-6">
      <div className="w-full max-w-7xl">
        {/* Header */}
        <div className="text-center mb-6 sm:mb-8 lg:mb-12">
          <div className="inline-flex items-center gap-2 sm:gap-3 bg-gray-50 px-4 sm:px-6 py-2 sm:py-3 rounded-full mb-4 sm:mb-6 border border-gray-200">
            <Crown className="w-4 h-4 sm:w-6 sm:h-6 text-gray-700" />
            <span className="text-gray-700 font-medium text-sm sm:text-base">Welcome to Co-Builders</span>
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-normal text-gray-900 mb-2 sm:mb-4">
            Let's find your cofounder
          </h1>
          <p className="text-xs sm:text-sm md:text-base lg:text-lg text-gray-600 max-w-4xl mx-auto px-4">
            Let's personalize your journey by choosing your role, stage, and personality.
          </p>
        </div>

        {/* Role Display */}
        <div className="mb-6 sm:mb-8 lg:mb-12">
          <h2 className="text-lg sm:text-xl md:text-2xl font-normal text-gray-900 mb-4 sm:mb-6 text-center">Your Role</h2>
          <div className="flex justify-center px-4">
            <div className="p-3 sm:p-4 rounded-xl border-2 bg-gray-900 border-gray-900 shadow-md w-full max-w-md">
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-white flex items-center justify-center flex-shrink-0">
                  <Rocket className="w-5 h-5 sm:w-6 sm:h-6 text-gray-900" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-base sm:text-lg font-semibold text-white mb-1">{selectedRoleData?.title || 'Founder'}</h3>
                  <p className="text-gray-300 text-xs sm:text-sm mb-2">{selectedRoleData?.description || 'The visionary, the risk-taker, the dreamer who builds'}</p>
                  <div className="flex items-center gap-2 text-white">
                    <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span className="text-xs font-medium">Selected</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stage Selection */}
        <div className="mb-6 sm:mb-8 lg:mb-12">
          <h2 className="text-lg sm:text-xl md:text-2xl font-normal text-gray-900 mb-4 sm:mb-6 text-center px-4">Step 1: Choose Your Stage</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 sm:gap-3 px-4">
            {selectedRoleData?.stages.map((stage) => {
              const Icon = stage.icon;
              const isSelected = selectedStage === stage.id;
              return (
                <button
                  key={stage.id}
                  onClick={() => handleStageSelect(stage.id)}
                  className={`p-2 sm:p-3 rounded-lg sm:rounded-xl border-2 transition-all duration-200 hover:scale-105 ${
                    isSelected
                      ? 'bg-gray-900 border-gray-900 shadow-md'
                      : 'bg-white border-gray-300 hover:border-gray-400 hover:bg-gray-50'
                  }`}
                >
                  <div className="text-center">
                    <div className={`w-8 h-8 sm:w-10 sm:h-10 mx-auto mb-2 rounded-lg flex items-center justify-center ${
                      isSelected ? 'bg-white' : 'bg-gray-100'
                    }`}>
                      <Icon className={`w-4 h-4 sm:w-5 sm:h-5 ${isSelected ? 'text-gray-900' : 'text-gray-600'}`} />
                    </div>
                    <h3 className={`text-xs sm:text-sm font-semibold mb-1 ${isSelected ? 'text-white' : 'text-gray-900'}`}>{stage.title}</h3>
                    <p className={`text-xs leading-tight ${isSelected ? 'text-gray-300' : 'text-gray-600'}`}>{stage.description}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Mask Selection */}
        {selectedStage && (
          <div className="mb-6 sm:mb-8 lg:mb-12">
            <h2 className="text-lg sm:text-xl md:text-2xl font-normal text-gray-900 mb-4 sm:mb-6 text-center px-4">Step 2: Choose Your Mask</h2>
            <p className="text-gray-600 text-center mb-6 sm:mb-8 text-sm sm:text-base px-4">
              You're masked until you pitch. Choose your symbolic identity that represents your cofounder personality.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 px-4">
              {masks.map((mask) => {
                const isSelected = selectedMask === mask.id;
                return (
                  <button
                    key={mask.id}
                    onClick={() => handleMaskSelect(mask.id)}
                    className={`p-4 sm:p-6 rounded-xl sm:rounded-2xl border-2 transition-all duration-200 hover:scale-105 text-left ${
                      isSelected
                        ? 'bg-gray-900 border-gray-900 shadow-md'
                        : 'bg-white border-gray-300 hover:border-gray-400 hover:bg-gray-50'
                    }`}
                  >
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="text-3xl sm:text-4xl">{mask.emoji}</div>
                        <div>
                          <h3 className={`text-lg sm:text-xl font-semibold ${isSelected ? 'text-white' : 'text-gray-900'}`}>{mask.title}</h3>
                          <p className={`text-sm font-medium italic ${isSelected ? 'text-gray-300' : 'text-gray-600'}`}>"{mask.motto}"</p>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <p className={`text-sm leading-relaxed ${isSelected ? 'text-gray-300' : 'text-gray-700'}`}>{mask.description}</p>
                        
                        <div className={`rounded-lg p-3 ${isSelected ? 'bg-white/10' : 'bg-gray-50'}`}>
                          <div className="space-y-1">
                            <div className="flex items-start gap-2">
                              <span className={`text-xs font-semibold min-w-[60px] ${isSelected ? 'text-gray-400' : 'text-gray-600'}`}>Symbolism:</span>
                              <span className={`text-xs ${isSelected ? 'text-gray-300' : 'text-gray-700'}`}>{mask.symbolism}</span>
                            </div>
                            <div className="flex items-start gap-2">
                              <span className={`text-xs font-semibold min-w-[60px] ${isSelected ? 'text-gray-400' : 'text-gray-600'}`}>Cofounder Vibe:</span>
                              <span className={`text-xs ${isSelected ? 'text-gray-300' : 'text-gray-700'}`}>{mask.cofounderVibe}</span>
                            </div>
                          </div>
                        </div>
                        
                      </div>
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
            <h2 className="text-lg sm:text-xl md:text-2xl font-normal text-gray-900 mb-4 sm:mb-6 text-center px-4">Step 3: Birth Details</h2>
            <p className="text-gray-600 text-center mb-6 sm:mb-8 text-sm sm:text-base px-4">
              Share your birth information for personality compatibility matching.
            </p>
            <div className="max-w-6xl mx-auto px-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {/* Birth Date */}
                <div className="space-y-2">
                  <label className="block text-gray-900 font-medium mb-2 text-sm sm:text-base">Birth Date</label>
                  <div className="relative">
                    <input
                      type="date"
                      className="w-full px-3 sm:px-4 py-3 sm:py-4 bg-white border border-gray-300 rounded-lg sm:rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all duration-200 text-sm sm:text-base"
                      style={{
                        colorScheme: 'light'
                      }}
                    />
                  </div>
                </div>

                {/* Birth Time */}
                <div className="space-y-2">
                  <label className="block text-gray-900 font-medium mb-2 text-sm sm:text-base">Birth Time</label>
                  <div className="relative">
                    <input
                      type="time"
                      className="w-full px-3 sm:px-4 py-3 sm:py-4 bg-white border border-gray-300 rounded-lg sm:rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all duration-200 text-sm sm:text-base"
                      style={{
                        colorScheme: 'light'
                      }}
                    />
                  </div>
                </div>

                {/* Birth Place */}
                <div className="space-y-2 sm:col-span-2 lg:col-span-1">
                  <label className="block text-gray-900 font-medium mb-2 text-sm sm:text-base">Birth Place</label>
                  <div className="relative">
                    <input
                      type="text"
                      value={birthPlace}
                      onChange={handleBirthPlaceChange}
                      onFocus={handleBirthPlaceFocus}
                      onBlur={handleBirthPlaceBlur}
                      placeholder="Start typing city name..."
                      className="w-full px-3 sm:px-4 py-3 sm:py-4 bg-white border border-gray-300 rounded-lg sm:rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all duration-200 text-sm sm:text-base"
                    />
                    
                    {/* Autocomplete Dropdown */}
                    {showSuggestions && filteredCities.length > 0 && (
                      <div className="autocomplete-dropdown absolute top-full left-0 right-0 mt-2 bg-white border border-gray-300 rounded-xl shadow-lg z-10 max-h-60 overflow-y-auto">
                        <div className="p-2">
                          <div className="px-3 py-2 text-gray-600 text-sm border-b border-gray-200">
                            {birthPlace.length > 0 ? 'Matching Cities' : 'Popular Cities'}
                          </div>
                          {filteredCities.slice(0, 10).map((city, index) => (
                            <button
                              key={index}
                              onClick={() => handleCitySelect(city)}
                              className="w-full text-left px-3 py-2 text-gray-900 hover:bg-gray-100 rounded-lg transition-colors duration-200 text-sm"
                            >
                              {city}
                            </button>
                          ))}
                          {filteredCities.length > 10 && (
                            <div className="px-3 py-2 text-gray-600 text-xs text-center">
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
              className="px-8 sm:px-12 py-3 sm:py-4 bg-gray-900 text-white rounded-xl sm:rounded-2xl hover:bg-black transition-all duration-200 font-medium text-base sm:text-lg shadow-md hover:shadow-lg flex items-center gap-2 sm:gap-3 mx-auto"
            >
              <span>Create My Profile →</span>
              <ArrowRight className="w-4 h-4 sm:w-6 sm:h-6" />
            </button>
          </div>
        )}

        {/* Progress Indicator */}
        <div className="mt-8 sm:mt-12 flex justify-center px-4">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 sm:w-3 sm:h-3 bg-gray-900 rounded-full"></div>
            <div className="w-2 h-2 sm:w-3 sm:h-3 bg-gray-300 rounded-full"></div>
            <div className="w-2 h-2 sm:w-3 sm:h-3 bg-gray-300 rounded-full"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoleSelection;