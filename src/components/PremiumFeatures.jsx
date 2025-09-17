import React, { useState } from 'react';
import { 
  Crown, 
  Star, 
  Shield, 
  Zap, 
  Brain, 
  Heart, 
  Sparkles, 
  Globe, 
  Target, 
  CheckCircle,
  X,
  Gift,
  Lock,
  Unlock,
  Diamond,
  Flame,
  Users,
  MessageCircle,
  Calendar,
  Eye,
  Settings,
  Award
} from 'lucide-react';

const PremiumFeatures = ({ currentTier, onUpgrade, onClose }) => {
  const [selectedTier, setSelectedTier] = useState(currentTier);
  const [billingCycle, setBillingCycle] = useState('monthly');

  const tiers = [
    {
      id: 'free',
      name: 'Free',
      price: { monthly: 0, yearly: 0 },
      color: 'from-gray-400 to-gray-600',
      icon: Users,
      features: [
        'Basic AI matching',
        '5 matches per day',
        'Standard profile',
        'Basic safety features',
        'Community access'
      ],
      limitations: [
        'Limited AI insights',
        'No premium filters',
        'Basic compatibility scores',
        'Standard support'
      ]
    },
    {
      id: 'silver',
      name: 'Silver',
      price: { monthly: 19, yearly: 190 },
      color: 'from-gray-300 to-gray-500',
      icon: Star,
      features: [
        'Advanced AI matching',
        'Unlimited matches',
        'Enhanced profile features',
        'Advanced safety features',
        'Priority support',
        'AI conversation starters',
        'Basic cosmic compatibility',
        'Profile boost weekly'
      ],
      popular: false
    },
    {
      id: 'gold',
      name: 'Gold',
      price: { monthly: 39, yearly: 390 },
      icon: Crown,
      color: 'from-yellow-400 to-orange-500',
      features: [
        'Everything in Silver',
        'Deep psychological profiling',
        'Full cosmic compatibility',
        'Soulmate finder',
        'Twin flame detection',
        'Karmic connection analysis',
        'AI-powered date ideas',
        'Premium filters',
        'Profile boost daily',
        'Advanced analytics',
        'Exclusive events access'
      ],
      popular: true
    },
    {
      id: 'platinum',
      name: 'Platinum',
      price: { monthly: 79, yearly: 790 },
      icon: Diamond,
      color: 'from-purple-500 to-pink-500',
      features: [
        'Everything in Gold',
        'VIP AI matching',
        'Personal dating coach AI',
        'Custom compatibility algorithms',
        'Exclusive premium features',
        'Priority customer support',
        'Profile boost unlimited',
        'Advanced safety verification',
        'Exclusive community access',
        'Personal concierge service'
      ],
      popular: false
    },
    {
      id: 'diamond',
      name: 'Diamond',
      price: { monthly: 149, yearly: 1490 },
      icon: Flame,
      color: 'from-cyan-400 to-blue-500',
      features: [
        'Everything in Platinum',
        'Ultimate AI experience',
        'Personal AI assistant',
        'Custom psychological profiling',
        'Exclusive matching algorithms',
        'White-glove service',
        'Personal dating consultant',
        'Exclusive events & retreats',
        'Custom features development',
        '24/7 premium support'
      ],
      popular: false
    }
  ];

  const currentTierData = tiers.find(tier => tier.id === currentTier);
  const selectedTierData = tiers.find(tier => tier.id === selectedTier);

  const getTierIcon = (tierId) => {
    const tier = tiers.find(t => t.id === tierId);
    return tier ? tier.icon : Users;
  };

  const getTierColor = (tierId) => {
    const tier = tiers.find(t => t.id === tierId);
    return tier ? tier.color : 'from-gray-400 to-gray-600';
  };

  const handleUpgrade = () => {
    if (onUpgrade) {
      onUpgrade(selectedTier);
    }
  };

  const formatPrice = (price) => {
    if (price === 0) return 'Free';
    return `$${price}`;
  };

  const getSavings = (monthlyPrice, yearlyPrice) => {
    const monthlyTotal = monthlyPrice * 12;
    const savings = monthlyTotal - yearlyPrice;
    const percentage = Math.round((savings / monthlyTotal) * 100);
    return { savings, percentage };
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-3xl max-w-6xl w-full max-h-[90vh] overflow-y-auto animate-in fade-in-0 zoom-in-95 duration-300">
        {/* Header */}
        <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-6 rounded-t-3xl">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold text-gray-800 dark:text-white flex items-center space-x-3">
                <Crown className="w-8 h-8 text-purple-600" />
                <span>Premium Features</span>
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                Unlock the full potential of AI-powered dating with our premium tiers
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <X className="w-6 h-6 text-gray-500" />
            </button>
          </div>
        </div>

        <div className="p-6">
          {/* Current Tier Status */}
          <div className="mb-8">
            <div className={`bg-gradient-to-r ${getTierColor(currentTier)} rounded-2xl p-6 text-white`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  {React.createElement(getTierIcon(currentTier), { className: "w-12 h-12" })}
                  <div>
                    <h3 className="text-2xl font-bold">Current Plan: {currentTierData.name}</h3>
                    <p className="text-white/80">
                      {currentTier === 'free' 
                        ? 'You\'re using the free plan with basic features'
                        : `You're enjoying ${currentTierData.name} benefits`
                      }
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold">
                    {formatPrice(currentTierData.price[billingCycle])}
                  </div>
                  <div className="text-white/80">
                    {billingCycle === 'monthly' ? 'per month' : 'per year'}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Billing Toggle */}
          <div className="flex justify-center mb-8">
            <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
              <button
                onClick={() => setBillingCycle('monthly')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                  billingCycle === 'monthly'
                    ? 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm'
                    : 'text-gray-500 dark:text-gray-400'
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setBillingCycle('yearly')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                  billingCycle === 'yearly'
                    ? 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm'
                    : 'text-gray-500 dark:text-gray-400'
                }`}
              >
                Yearly
                <span className="ml-1 text-xs bg-green-500 text-white px-1.5 py-0.5 rounded-full">
                  Save 20%
                </span>
              </button>
            </div>
          </div>

          {/* Tier Comparison */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 mb-8">
            {tiers.map((tier) => {
              const Icon = tier.icon;
              const isSelected = selectedTier === tier.id;
              const isCurrent = currentTier === tier.id;
              const savings = getSavings(tier.price.monthly, tier.price.yearly);
              
              return (
                <div
                  key={tier.id}
                  className={`relative bg-white dark:bg-gray-800 rounded-2xl p-6 border-2 transition-all cursor-pointer hover:scale-105 ${
                    isSelected
                      ? 'border-purple-500 shadow-xl'
                      : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                  } ${tier.popular ? 'ring-2 ring-yellow-400 ring-opacity-50' : ''}`}
                  onClick={() => setSelectedTier(tier.id)}
                >
                  {tier.popular && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <span className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                        Most Popular
                      </span>
                    </div>
                  )}
                  
                  {isCurrent && (
                    <div className="absolute -top-2 -right-2">
                      <div className="bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full flex items-center space-x-1">
                        <CheckCircle className="w-3 h-3" />
                        <span>Current</span>
                      </div>
                    </div>
                  )}

                  <div className="text-center mb-4">
                    <div className={`w-16 h-16 bg-gradient-to-r ${tier.color} rounded-full flex items-center justify-center mx-auto mb-3`}>
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 dark:text-white">{tier.name}</h3>
                    <div className="mt-2">
                      <div className="text-3xl font-bold text-gray-800 dark:text-white">
                        {formatPrice(tier.price[billingCycle])}
                      </div>
                      <div className="text-sm text-gray-500">
                        {billingCycle === 'monthly' ? 'per month' : 'per year'}
                        {billingCycle === 'yearly' && tier.price.yearly > 0 && (
                          <div className="text-green-600 font-medium">
                            Save ${savings.savings} ({savings.percentage}%)
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {tier.features.slice(0, 6).map((feature, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                        <span className="text-sm text-gray-600 dark:text-gray-400">{feature}</span>
                      </div>
                    ))}
                    {tier.features.length > 6 && (
                      <div className="text-xs text-gray-500 text-center">
                        +{tier.features.length - 6} more features
                      </div>
                    )}
                  </div>

                  {isCurrent ? (
                    <div className="mt-6 w-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 py-2 px-4 rounded-lg text-center font-medium">
                      Current Plan
                    </div>
                  ) : (
                    <button
                      className={`mt-6 w-full py-2 px-4 rounded-lg font-semibold transition-all ${
                        isSelected
                          ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                      }`}
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedTier(tier.id);
                      }}
                    >
                      {tier.price[billingCycle] === 0 ? 'Get Started' : 'Upgrade'}
                    </button>
                  )}
                </div>
              );
            })}
          </div>

          {/* Feature Comparison Table */}
          <div className="mb-8">
            <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-6 text-center">
              Feature Comparison
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-800 dark:text-white">
                      Features
                    </th>
                    {tiers.map((tier) => (
                      <th key={tier.id} className="px-6 py-4 text-center text-sm font-semibold text-gray-800 dark:text-white">
                        {tier.name}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {[
                    { feature: 'AI Matching', free: 'Basic', silver: 'Advanced', gold: 'Deep', platinum: 'VIP', diamond: 'Ultimate' },
                    { feature: 'Daily Matches', free: '5', silver: 'Unlimited', gold: 'Unlimited', platinum: 'Unlimited', diamond: 'Unlimited' },
                    { feature: 'Psychological Profiling', free: '❌', silver: 'Basic', gold: 'Full', platinum: 'Custom', diamond: 'Personal' },
                    { feature: 'Cosmic Compatibility', free: '❌', silver: 'Basic', gold: 'Full', platinum: 'Advanced', diamond: 'Ultimate' },
                    { feature: 'Soulmate Finder', free: '❌', silver: '❌', gold: '✅', platinum: '✅', diamond: '✅' },
                    { feature: 'Twin Flame Detection', free: '❌', silver: '❌', gold: '✅', platinum: '✅', diamond: '✅' },
                    { feature: 'AI Date Ideas', free: '❌', silver: 'Basic', gold: 'Advanced', platinum: 'Custom', diamond: 'Personal' },
                    { feature: 'Profile Boost', free: '❌', silver: 'Weekly', gold: 'Daily', platinum: 'Unlimited', diamond: 'Unlimited' },
                    { feature: 'Priority Support', free: '❌', silver: '✅', gold: '✅', platinum: '✅', diamond: '24/7' },
                    { feature: 'Exclusive Events', free: '❌', silver: '❌', gold: '✅', platinum: '✅', diamond: '✅' }
                  ].map((row, index) => (
                    <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="px-6 py-4 text-sm font-medium text-gray-800 dark:text-white">
                        {row.feature}
                      </td>
                      <td className="px-6 py-4 text-center text-sm text-gray-600 dark:text-gray-400">
                        {row.free}
                      </td>
                      <td className="px-6 py-4 text-center text-sm text-gray-600 dark:text-gray-400">
                        {row.silver}
                      </td>
                      <td className="px-6 py-4 text-center text-sm text-gray-600 dark:text-gray-400">
                        {row.gold}
                      </td>
                      <td className="px-6 py-4 text-center text-sm text-gray-600 dark:text-gray-400">
                        {row.platinum}
                      </td>
                      <td className="px-6 py-4 text-center text-sm text-gray-600 dark:text-gray-400">
                        {row.diamond}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={onClose}
              className="px-8 py-3 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl font-semibold hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
            >
              Maybe Later
            </button>
            <button
              onClick={handleUpgrade}
              className="px-8 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-semibold hover:from-purple-600 hover:to-pink-600 transition-all shadow-lg"
            >
              {selectedTier === currentTier ? 'Current Plan' : `Upgrade to ${selectedTierData.name}`}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export { PremiumFeatures };
