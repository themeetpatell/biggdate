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
  const [selectedRole, setSelectedRole] = useState('');
  const [selectedStage, setSelectedStage] = useState('');
  const [selectedMask, setSelectedMask] = useState('');
  const [isAnimating, setIsAnimating] = useState(false);
  const navigate = useNavigate();

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

  const selectedRoleData = roles.find(role => role.id === selectedRole);

  const handleRoleSelect = (roleId) => {
    setIsAnimating(true);
    setSelectedRole(roleId);
    setSelectedStage('');
    setSelectedMask('');
    setTimeout(() => setIsAnimating(false), 300);
  };

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

  const handleContinue = () => {
    if (selectedRole && selectedStage && selectedMask) {
      // Save to localStorage
      localStorage.setItem('userRole', selectedRole);
      localStorage.setItem('userStage', selectedStage);
      localStorage.setItem('userMask', selectedMask);
      
      // Navigate to next step
      navigate('/onboarding/mission');
    }
  };

  const isComplete = selectedRole && selectedStage && selectedMask;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-indigo-900 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-sm px-6 py-3 rounded-full mb-6">
            <Crown className="w-6 h-6 text-yellow-400" />
            <span className="text-white font-semibold">Welcome to the Inner Circle</span>
          </div>
          <h1 className="text-5xl font-bold text-white mb-4">
            Who Are You?
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Every great story starts with identity. Choose your role, stage, and mask.
          </p>
        </div>

        {/* Role Selection */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-6 text-center">Step 1: Choose Your Role</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {roles.map((role) => {
              const Icon = role.icon;
              const isSelected = selectedRole === role.id;
              return (
                <button
                  key={role.id}
                  onClick={() => handleRoleSelect(role.id)}
                  className={`p-8 rounded-3xl border-2 transition-all duration-300 hover:scale-105 ${
                    isSelected
                      ? `bg-gradient-to-r ${role.color} border-white shadow-2xl`
                      : 'bg-white/10 border-white/20 hover:border-white/40 hover:bg-white/20'
                  }`}
                >
                  <div className="text-center">
                    <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center ${
                      isSelected ? 'bg-white/20' : `bg-gradient-to-r ${role.color}`
                    }`}>
                      <Icon className={`w-8 h-8 ${isSelected ? 'text-white' : 'text-white'}`} />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">{role.title}</h3>
                    <p className="text-gray-300 text-sm">{role.description}</p>
                    {isSelected && (
                      <div className="mt-4 flex items-center justify-center gap-2 text-white">
                        <CheckCircle className="w-5 h-5" />
                        <span className="text-sm font-semibold">Selected</span>
                      </div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Stage Selection */}
        {selectedRole && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-white mb-6 text-center">Step 2: Your Stage</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {selectedRoleData?.stages.map((stage) => {
                const Icon = stage.icon;
                const isSelected = selectedStage === stage.id;
                return (
                  <button
                    key={stage.id}
                    onClick={() => handleStageSelect(stage.id)}
                    className={`p-6 rounded-2xl border-2 transition-all duration-300 hover:scale-105 ${
                      isSelected
                        ? `bg-gradient-to-r ${stage.color} border-white shadow-xl`
                        : 'bg-white/10 border-white/20 hover:border-white/40 hover:bg-white/20'
                    }`}
                  >
                    <div className="text-center">
                      <div className={`w-12 h-12 mx-auto mb-3 rounded-xl flex items-center justify-center ${
                        isSelected ? 'bg-white/20' : `bg-gradient-to-r ${stage.color}`
                      }`}>
                        <Icon className={`w-6 h-6 ${isSelected ? 'text-white' : 'text-white'}`} />
                      </div>
                      <h3 className="text-lg font-bold text-white mb-2">{stage.title}</h3>
                      <p className="text-gray-300 text-xs">{stage.description}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Mask Selection */}
        {selectedRole && selectedStage && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-white mb-6 text-center">Step 3: Pick Your Mask</h2>
            <p className="text-gray-300 text-center mb-8">
              You're masked until you pitch. Choose your symbolic identity.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {masks.map((mask) => {
                const isSelected = selectedMask === mask.id;
                return (
                  <button
                    key={mask.id}
                    onClick={() => handleMaskSelect(mask.id)}
                    className={`p-6 rounded-2xl border-2 transition-all duration-300 hover:scale-105 ${
                      isSelected
                        ? `bg-gradient-to-r ${mask.color} border-white shadow-xl`
                        : 'bg-white/10 border-white/20 hover:border-white/40 hover:bg-white/20'
                    }`}
                  >
                    <div className="text-center">
                      <div className="text-4xl mb-3">{mask.emoji}</div>
                      <h3 className="text-lg font-bold text-white mb-1">{mask.title}</h3>
                      <p className="text-gray-300 text-xs">{mask.description}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Continue Button */}
        {isComplete && (
          <div className="text-center">
            <button
              onClick={handleContinue}
              className="px-12 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-2xl hover:from-purple-600 hover:to-pink-600 transition-all duration-300 font-bold text-lg shadow-2xl hover:shadow-purple-500/25 hover:scale-105 flex items-center gap-3 mx-auto"
            >
              <span>Define My Story →</span>
              <ArrowRight className="w-6 h-6" />
            </button>
          </div>
        )}

        {/* Progress Indicator */}
        <div className="mt-12 flex justify-center">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"></div>
            <div className="w-3 h-3 bg-gray-600 rounded-full"></div>
            <div className="w-3 h-3 bg-gray-600 rounded-full"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoleSelection;