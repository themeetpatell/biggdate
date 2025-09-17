import React, { useState } from 'react';
import { 
  Trophy, 
  Star, 
  Target, 
  Zap, 
  Crown, 
  Shield, 
  Users, 
  MessageCircle, 
  Calendar,
  Heart,
  Award,
  TrendingUp,
  Clock,
  CheckCircle,
  Sparkles,
  Gift,
  Flame
} from 'lucide-react';

const GamificationDashboard = ({ 
  profile, 
  onAchievementUnlocked, 
  onBadgeEarned 
}) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [showAchievementModal, setShowAchievementModal] = useState(false);
  const [selectedAchievement, setSelectedAchievement] = useState(null);

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Target },
    { id: 'achievements', label: 'Achievements', icon: Trophy },
    { id: 'badges', label: 'Badges', icon: Award },
    { id: 'activity', label: 'Activity', icon: TrendingUp },
    { id: 'challenges', label: 'Challenges', icon: Zap }
  ];

  const getLevelColor = (level) => {
    if (level >= 20) return 'from-purple-500 to-pink-500';
    if (level >= 15) return 'from-blue-500 to-purple-500';
    if (level >= 10) return 'from-green-500 to-blue-500';
    if (level >= 5) return 'from-yellow-500 to-orange-500';
    return 'from-gray-500 to-gray-600';
  };

  const getLevelTitle = (level) => {
    if (level >= 20) return 'Dating Legend';
    if (level >= 15) return 'Dating Master';
    if (level >= 10) return 'Dating Expert';
    if (level >= 5) return 'Dating Pro';
    return 'Dating Newcomer';
  };

  const getRarityColor = (rarity) => {
    switch (rarity) {
      case 'legendary': return 'from-yellow-400 to-orange-500';
      case 'epic': return 'from-purple-500 to-pink-500';
      case 'rare': return 'from-blue-500 to-cyan-500';
      case 'uncommon': return 'from-green-500 to-teal-500';
      default: return 'from-gray-400 to-gray-500';
    }
  };

  const getBadgeRarityColor = (rarity) => {
    switch (rarity) {
      case 'diamond': return 'from-cyan-400 to-blue-500';
      case 'platinum': return 'from-gray-300 to-gray-500';
      case 'gold': return 'from-yellow-400 to-yellow-600';
      case 'silver': return 'from-gray-400 to-gray-600';
      default: return 'from-orange-400 to-orange-600';
    }
  };

  const experiencePercentage = (profile.experience / profile.experienceToNext) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-100 dark:from-gray-900 dark:via-purple-900 dark:to-indigo-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="relative inline-block">
            <div className={`w-24 h-24 bg-gradient-to-r ${getLevelColor(profile.level)} rounded-full flex items-center justify-center mx-auto mb-4 shadow-2xl`}>
              <Crown className="w-12 h-12 text-white" />
            </div>
            <div className="absolute -top-2 -right-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-bold px-2 py-1 rounded-full">
              Level {profile.level}
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
            {getLevelTitle(profile.level)}
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Keep building your dating journey and unlock amazing rewards!
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg">
                <Trophy className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-gray-800 dark:text-white">{profile.level}</span>
            </div>
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Level</h3>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-1000"
                style={{ width: `${experiencePercentage}%` }}
              ></div>
            </div>
            <p className="text-xs text-gray-500 mt-2">{profile.experience} / {profile.experienceToNext} XP</p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg">
                <Target className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-gray-800 dark:text-white">{profile.achievements.length}</span>
            </div>
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Achievements</h3>
            <p className="text-xs text-gray-500 mt-1">Unlocked</p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-lg">
                <Award className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-gray-800 dark:text-white">{profile.badges.length}</span>
            </div>
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Badges</h3>
            <p className="text-xs text-gray-500 mt-1">Earned</p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-gradient-to-r from-green-500 to-teal-500 rounded-lg">
                <Flame className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-gray-800 dark:text-white">{profile.streakDays}</span>
            </div>
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Streak</h3>
            <p className="text-xs text-gray-500 mt-1">Days</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg mb-8">
          <div className="border-b border-gray-200 dark:border-gray-700">
            <nav className="flex space-x-8 px-6">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center space-x-2 py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                      activeTab === tab.id
                        ? 'border-purple-500 text-purple-600 dark:text-purple-400'
                        : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          <div className="p-6">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Progress Overview</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg p-4">
                      <h4 className="font-semibold text-gray-800 dark:text-white mb-2">Experience Progress</h4>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-600 dark:text-gray-400">Level {profile.level}</span>
                        <span className="text-sm font-medium text-purple-600">{profile.experience} / {profile.experienceToNext} XP</span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                        <div 
                          className="bg-gradient-to-r from-purple-500 to-pink-500 h-3 rounded-full transition-all duration-1000"
                          style={{ width: `${experiencePercentage}%` }}
                        ></div>
                      </div>
                    </div>

                    <div className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-lg p-4">
                      <h4 className="font-semibold text-gray-800 dark:text-white mb-2">Social Score</h4>
                      <div className="flex items-center justify-between">
                        <span className="text-2xl font-bold text-blue-600">{profile.socialScore}</span>
                        <TrendingUp className="w-6 h-6 text-blue-500" />
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Community Rank #{profile.communityRank}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Dating Activity</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <Heart className="w-8 h-8 text-pink-500 mx-auto mb-2" />
                      <div className="text-2xl font-bold text-gray-800 dark:text-white">{profile.datingActivity.totalMatches}</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Total Matches</div>
                    </div>
                    <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <MessageCircle className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                      <div className="text-2xl font-bold text-gray-800 dark:text-white">{profile.datingActivity.conversationsStarted}</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Conversations</div>
                    </div>
                    <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <Calendar className="w-8 h-8 text-green-500 mx-auto mb-2" />
                      <div className="text-2xl font-bold text-gray-800 dark:text-white">{profile.datingActivity.datesCompleted}</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Dates</div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Unlocked Features</h3>
                  <div className="flex flex-wrap gap-2">
                    {profile.unlockedFeatures.map((feature, index) => (
                      <span key={index} className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                        {feature.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Achievements Tab */}
            {activeTab === 'achievements' && (
              <div>
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Your Achievements</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {profile.achievements.map((achievement, index) => (
                    <div
                      key={achievement.id}
                      className={`bg-gradient-to-r ${getRarityColor(achievement.rarity)} rounded-lg p-4 text-white cursor-pointer hover:shadow-lg transition-all duration-200 animate-in fade-in-0 slide-in-from-bottom-4`}
                      style={{ animationDelay: `${index * 100}ms` }}
                      onClick={() => {
                        setSelectedAchievement(achievement);
                        setShowAchievementModal(true);
                      }}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <Trophy className="w-6 h-6" />
                        <span className="text-xs font-bold uppercase">{achievement.rarity}</span>
                      </div>
                      <h4 className="font-semibold mb-1">{achievement.name}</h4>
                      <p className="text-sm opacity-90 mb-2">{achievement.description}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs">+{achievement.points} XP</span>
                        <span className="text-xs">{new Date(achievement.unlockedAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Badges Tab */}
            {activeTab === 'badges' && (
              <div>
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Your Badges</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  {profile.badges.map((badge, index) => (
                    <div
                      key={badge.id}
                      className={`bg-gradient-to-r ${getBadgeRarityColor(badge.rarity)} rounded-lg p-4 text-white text-center hover:shadow-lg transition-all duration-200 animate-in fade-in-0 zoom-in-95`}
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <div className="text-3xl mb-2">{badge.icon}</div>
                      <h4 className="text-sm font-semibold mb-1">{badge.name}</h4>
                      <p className="text-xs opacity-90">{badge.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Activity Tab */}
            {activeTab === 'activity' && (
              <div>
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Recent Activity</h3>
                <div className="space-y-4">
                  <div className="flex items-center space-x-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-teal-500 rounded-full flex items-center justify-center">
                      <Trophy className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-800 dark:text-white">Achievement Unlocked</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">You earned the "First Match" achievement!</p>
                    </div>
                    <span className="text-xs text-gray-500">2 hours ago</span>
                  </div>
                  
                  <div className="flex items-center space-x-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                      <Heart className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-800 dark:text-white">New Match</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">You matched with someone special!</p>
                    </div>
                    <span className="text-xs text-gray-500">1 day ago</span>
                  </div>
                  
                  <div className="flex items-center space-x-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="w-10 h-10 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full flex items-center justify-center">
                      <Award className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-800 dark:text-white">Badge Earned</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">You earned the "Conversationalist" badge!</p>
                    </div>
                    <span className="text-xs text-gray-500">3 days ago</span>
                  </div>
                </div>
              </div>
            )}

            {/* Challenges Tab */}
            {activeTab === 'challenges' && (
              <div>
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Daily Challenges</h3>
                <div className="space-y-4">
                  <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-gray-800 dark:text-white">Send a Message</h4>
                      <span className="text-sm font-medium text-purple-600">+15 XP</span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">Send a message to one of your matches</p>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full" style={{ width: '0%' }}></div>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">0 / 1 completed</p>
                  </div>
                  
                  <div className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-gray-800 dark:text-white">Update Profile</h4>
                      <span className="text-sm font-medium text-blue-600">+20 XP</span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">Add new photos or update your bio</p>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div className="bg-gradient-to-r from-blue-500 to-cyan-500 h-2 rounded-full" style={{ width: '0%' }}></div>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">0 / 1 completed</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Achievement Modal */}
      {showAchievementModal && selectedAchievement && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div
            className="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-md w-full text-center animate-in fade-in-0 zoom-in-95 duration-300"
          >
            <div className={`w-20 h-20 bg-gradient-to-r ${getRarityColor(selectedAchievement.rarity)} rounded-full flex items-center justify-center mx-auto mb-4`}>
              <Trophy className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">{selectedAchievement.name}</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">{selectedAchievement.description}</p>
            <div className="flex items-center justify-center space-x-4 mb-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">+{selectedAchievement.points}</div>
                <div className="text-xs text-gray-500">Experience</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-600">{selectedAchievement.rarity}</div>
                <div className="text-xs text-gray-500">Rarity</div>
              </div>
            </div>
            <button
              onClick={() => setShowAchievementModal(false)}
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 px-6 rounded-xl font-semibold hover:from-purple-600 hover:to-pink-600 transition-all"
            >
              Awesome!
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export { GamificationDashboard };
