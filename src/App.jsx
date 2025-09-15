import React, { useState, useEffect, Suspense, lazy, memo } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ErrorBoundary from './components/ErrorBoundary.jsx';
import LoadingSpinner from './components/LoadingSpinner.jsx';
import { setupGlobalErrorHandlers } from './utils/errorHandler.js';
import { initializeAnalytics } from './utils/analytics.js';

// Performance optimizations
const LoadingFallback = memo(() => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-100">
    <div className="text-center animate-fade-in">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
      <p className="text-gray-600 font-medium">Loading...</p>
    </div>
  </div>
));

// Lazy load components for better performance
const Navbar = lazy(() => import('./components/Navbar.jsx'));
const Home = lazy(() => import('./components/Home.jsx'));
const Profile = lazy(() => import('./components/Profile.jsx'));
const Connections = lazy(() => import('./components/Connections.jsx'));
const Events = lazy(() => import('./components/Events.jsx'));
const Auth = lazy(() => import('./components/Auth.jsx'));
const Pitches = lazy(() => import('./components/Pitches.jsx'));
const Messages = lazy(() => import('./components/Messages'));
const AIMatchingInterface = lazy(() => import('./components/AIMatchingInterface.jsx'));
const GamificationDashboard = lazy(() => import('./components/GamificationDashboard.jsx'));
const PremiumFeatures = lazy(() => import('./components/PremiumFeatures.jsx'));
const LandingPage = lazy(() => import('./components/LandingPage.jsx'));

// Services (keep synchronous for now)
import { AIPsychologyService } from './services/aiPsychologyService.js';
import { GamificationService } from './services/gamificationService.js';

const AppContent = () => {
  const { isAuthenticated, isLoading } = useSelector((state) => state.auth);
  const [currentUser, setCurrentUser] = useState(null);
  const [matches, setMatches] = useState([]);
  const [gamificationProfile, setGamificationProfile] = useState(null);
  const [showPremiumFeatures, setShowPremiumFeatures] = useState(false);
  const [showGamification, setShowGamification] = useState(false);
  const [showApp, setShowApp] = useState(false);

  // Initialize performance monitoring and analytics
  useEffect(() => {
    setupGlobalErrorHandlers();
    initializeAnalytics();
  }, []);

  // Initialize services
  const aiPsychologyService = AIPsychologyService.getInstance();
  const gamificationService = GamificationService.getInstance();

  useEffect(() => {
    if (isAuthenticated) {
      setShowApp(true);
      // Initialize user data
      const mockUser = {
        id: 'user_1',
        email: 'user@example.com',
        firstName: 'Alex',
        lastName: 'Johnson',
        profileImage: '/default-avatar.jpg',
        isVerified: true,
        safetyScore: 95,
        premiumTier: 'gold',
        globalLocation: {
          country: 'United States',
          city: 'San Francisco',
          timezone: 'PST',
          coordinates: { lat: 37.7749, lng: -122.4194 },
          region: 'North America',
          language: 'English'
        },
        createdAt: new Date(),
        updatedAt: new Date()
      };

      setCurrentUser(mockUser);

      // Initialize gamification profile
      const gamification = gamificationService.createGamificationProfile(mockUser.id);
      setGamificationProfile(gamification);

      // Generate psychological profile
      aiPsychologyService.generatePsychologicalProfile(mockUser).then(psychProfile => {
        setCurrentUser(prev => prev ? { ...prev, psychologicalProfile: psychProfile } : null);
      });

      // Generate matches (mock data for now)
      generateMockMatches();
    }
  }, [isAuthenticated]);

  const generateMockMatches = async () => {
    // This would normally fetch from the backend
    const mockMatches = [
      {
        id: 'match_1',
        name: 'Emma',
        age: 28,
        location: 'San Francisco, CA',
        distance: '2 miles',
        photo: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=400&fit=crop&crop=face',
        bio: 'Adventure seeker and coffee enthusiast. Love hiking, photography, and deep conversations about life. Looking for someone who shares my passion for exploring new places and ideas.',
        occupation: 'UX Designer',
        company: 'Tech Startup',
        education: 'Stanford University',
        interests: ['Photography', 'Hiking', 'Coffee', 'Travel', 'Art'],
        skills: ['Design', 'Photography', 'Cooking'],
        verified: true,
        isOnline: true,
        lastActive: '2 minutes ago',
        aiCompatibility: {
          overall: 92,
          personality: 88,
          values: 95,
          communication: 90,
          lifestyle: 85,
          goals: 93,
          emotional: 89,
          intellectual: 91,
          physical: 87,
          spiritual: 94
        },
        psychologicalMatch: {
          attachmentCompatibility: 90,
          loveLanguageAlignment: 85,
          communicationCompatibility: 88,
          conflictResolutionMatch: 92,
          emotionalIntelligenceMatch: 89
        },
        lifestyleMatch: {
          dailyRoutine: 85,
          socialPreferences: 90,
          travelStyle: 88,
          workLifeBalance: 87,
          financialValues: 92,
          familyValues: 89
        },
        cosmicAlignment: {
          zodiacCompatibility: 88,
          lifePathNumbers: 92,
          chakraAlignment: 90,
          elementalBalance: 85,
          cosmicScore: 89
        },
        energyVibe: {
          energyLevel: 87,
          vibrationMatch: 91,
          auraCompatibility: 88,
          spiritualAlignment: 93,
          overallVibe: 90
        },
        growthPotential: {
          mutualGrowth: 89,
          challengeLevel: 85,
          supportPotential: 92,
          learningOpportunity: 88,
          evolutionScore: 89
        },
        overallScore: 92,
        uniquenessScore: 89,
        longTermPotential: 91,
        matchInsights: [
          {
            id: 'insight_1',
            category: 'Personality',
            insight: 'You both share a deep appreciation for intellectual conversations and personal growth.',
            confidence: 0.92,
            aiGenerated: true
          }
        ],
        conversationStarters: [
          {
            id: 'starter_1',
            question: 'What\'s the most meaningful experience you\'ve had recently?',
            category: 'Deep',
            difficulty: 'medium',
            aiGenerated: true
          }
        ],
        dateIdeas: [
          {
            id: 'date_1',
            title: 'Art Gallery & Philosophy Discussion',
            description: 'Visit a contemporary art gallery and discuss the deeper meanings behind the pieces.',
            category: 'Cultural',
            cost: 'medium',
            duration: '2-3 hours',
            location: 'Local art district',
            aiGenerated: true
          }
        ],
        status: 'pending',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 'match_2',
        name: 'Sophia',
        age: 26,
        location: 'New York, NY',
        distance: '5 miles',
        photo: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face',
        bio: 'Yoga instructor and wellness coach. Passionate about mindfulness, healthy living, and helping others find their inner peace. Love morning runs and meditation.',
        occupation: 'Yoga Instructor',
        company: 'Wellness Studio',
        education: 'UCLA',
        interests: ['Yoga', 'Meditation', 'Healthy Living', 'Nature', 'Books'],
        skills: ['Yoga', 'Meditation', 'Cooking', 'Writing'],
        verified: true,
        isOnline: false,
        lastActive: '1 hour ago',
        aiCompatibility: {
          overall: 88,
          personality: 92,
          values: 89,
          communication: 85,
          lifestyle: 94,
          goals: 87,
          emotional: 91,
          intellectual: 88,
          physical: 93,
          spiritual: 96
        },
        psychologicalMatch: {
          attachmentCompatibility: 88,
          loveLanguageAlignment: 92,
          communicationCompatibility: 85,
          conflictResolutionMatch: 89,
          emotionalIntelligenceMatch: 91
        },
        lifestyleMatch: {
          dailyRoutine: 94,
          socialPreferences: 87,
          travelStyle: 90,
          workLifeBalance: 92,
          financialValues: 88,
          familyValues: 91
        },
        cosmicAlignment: {
          zodiacCompatibility: 92,
          lifePathNumbers: 89,
          chakraAlignment: 95,
          elementalBalance: 88,
          cosmicScore: 91
        },
        energyVibe: {
          energyLevel: 90,
          vibrationMatch: 94,
          auraCompatibility: 92,
          spiritualAlignment: 96,
          overallVibe: 93
        },
        growthPotential: {
          mutualGrowth: 91,
          challengeLevel: 88,
          supportPotential: 94,
          learningOpportunity: 89,
          evolutionScore: 92
        },
        overallScore: 88,
        uniquenessScore: 92,
        longTermPotential: 89,
        matchInsights: [
          {
            id: 'insight_2',
            category: 'Lifestyle',
            insight: 'Both of you prioritize wellness and personal growth, creating a harmonious foundation for a healthy relationship.',
            confidence: 0.88,
            aiGenerated: true
          }
        ],
        conversationStarters: [
          {
            id: 'starter_2',
            question: 'What\'s your favorite way to start the day?',
            category: 'Lifestyle',
            difficulty: 'easy',
            aiGenerated: true
          }
        ],
        dateIdeas: [
          {
            id: 'date_2',
            title: 'Sunrise Yoga & Healthy Brunch',
            description: 'Start with a peaceful yoga session at sunrise, followed by a healthy brunch at a local organic cafe.',
            category: 'Wellness',
            cost: 'low',
            duration: '3-4 hours',
            location: 'Beach or park',
            aiGenerated: true
          }
        ],
        status: 'pending',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 'match_3',
        name: 'Alex',
        age: 30,
        location: 'Seattle, WA',
        distance: '8 miles',
        photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face',
        bio: 'Software engineer by day, musician by night. Love coding, playing guitar, and exploring the great outdoors. Always up for a good adventure or a deep conversation about technology and life.',
        occupation: 'Software Engineer',
        company: 'Tech Company',
        education: 'MIT',
        interests: ['Music', 'Coding', 'Hiking', 'Gaming', 'Technology'],
        skills: ['Programming', 'Guitar', 'Problem Solving'],
        verified: false,
        isOnline: true,
        lastActive: 'Online now',
        aiCompatibility: {
          overall: 85,
          personality: 87,
          values: 83,
          communication: 89,
          lifestyle: 81,
          goals: 86,
          emotional: 84,
          intellectual: 92,
          physical: 88,
          spiritual: 79
        },
        psychologicalMatch: {
          attachmentCompatibility: 84,
          loveLanguageAlignment: 87,
          communicationCompatibility: 89,
          conflictResolutionMatch: 85,
          emotionalIntelligenceMatch: 86
        },
        lifestyleMatch: {
          dailyRoutine: 81,
          socialPreferences: 88,
          travelStyle: 85,
          workLifeBalance: 83,
          financialValues: 86,
          familyValues: 84
        },
        cosmicAlignment: {
          zodiacCompatibility: 82,
          lifePathNumbers: 87,
          chakraAlignment: 79,
          elementalBalance: 85,
          cosmicScore: 83
        },
        energyVibe: {
          energyLevel: 88,
          vibrationMatch: 85,
          auraCompatibility: 87,
          spiritualAlignment: 79,
          overallVibe: 84
        },
        growthPotential: {
          mutualGrowth: 86,
          challengeLevel: 89,
          supportPotential: 83,
          learningOpportunity: 92,
          evolutionScore: 85
        },
        overallScore: 85,
        uniquenessScore: 87,
        longTermPotential: 86,
        matchInsights: [
          {
            id: 'insight_3',
            category: 'Intellectual',
            insight: 'Your intellectual curiosity and problem-solving approach create an engaging dynamic for stimulating conversations.',
            confidence: 0.85,
            aiGenerated: true
          }
        ],
        conversationStarters: [
          {
            id: 'starter_3',
            question: 'What\'s the most interesting project you\'ve worked on recently?',
            category: 'Professional',
            difficulty: 'medium',
            aiGenerated: true
          }
        ],
        dateIdeas: [
          {
            id: 'date_3',
            title: 'Tech Museum & Live Music',
            description: 'Explore the latest in technology at a science museum, then enjoy live music at a local venue.',
            category: 'Cultural',
            cost: 'medium',
            duration: '4-5 hours',
            location: 'Downtown',
            aiGenerated: true
          }
        ],
        status: 'pending',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    setMatches(mockMatches);
  };

  const handleLike = (match) => {
    // Update gamification
    if (gamificationProfile) {
      const updatedProfile = gamificationService.awardExperience(gamificationProfile, 'match_made', 25);
      setGamificationProfile(updatedProfile);
    }
  };

  const handlePass = (match) => {
    // Handle pass action
  };

  const handleSuperLike = (match) => {
    // Update gamification
    if (gamificationProfile) {
      const updatedProfile = gamificationService.awardExperience(gamificationProfile, 'super_like', 50);
      setGamificationProfile(updatedProfile);
    }
  };

  const handleViewProfile = (match) => {
    // Handle view profile action
  };

  const handleRefresh = () => {
    generateMockMatches();
  };

  const handleUpgrade = (tier) => {
    if (currentUser) {
      setCurrentUser({ ...currentUser, premiumTier: tier });
    }
    setShowPremiumFeatures(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--apple-gray-1)' }}>
        <div className="text-center">
          <div className="w-16 h-16 rounded-full mx-auto mb-6 flex items-center justify-center" style={{ backgroundColor: 'var(--apple-blue)' }}>
            <div className="w-8 h-8 text-white animate-spin">🧠</div>
          </div>
          <h2 className="apple-text-title-2 mb-4" style={{ color: 'var(--apple-gray-11)' }}>
            Loading BiggDate...
          </h2>
          <p className="apple-text-body" style={{ color: 'var(--apple-gray-6)' }}>
            AI is analyzing your compatibility profile
          </p>
        </div>
      </div>
    );
  }

  // Show landing page if not authenticated or not showing app
  if (!isAuthenticated || !showApp) {
    return (
      <ErrorBoundary>
        <Router>
          <div className="App min-h-screen">
            <Suspense fallback={<LoadingFallback />}>
              <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/auth" element={<Auth onAuthSuccess={() => setShowApp(true)} />} />
              </Routes>
            </Suspense>
          </div>
        </Router>
      </ErrorBoundary>
    );
  }

  // Show app platform only when authenticated and showApp is true
  return (
    <ErrorBoundary>
      <Router>
        <div className="App min-h-screen" style={{ backgroundColor: 'var(--apple-gray-1)' }}>
          <Suspense fallback={<LoadingFallback />}>
            <Navbar />
          </Suspense>
          <main className="main-content">
            <Suspense fallback={<LoadingFallback />}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/home" element={<Home />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/connections" element={<Connections />} />
                <Route path="/events" element={<Events />} />
                <Route path="/pitches" element={<Pitches />} />
                <Route path="/pitching" element={<Pitches />} />
              <Route 
                path="/matching" 
                element={
                  currentUser ? (
                    <AIMatchingInterface
                      currentUser={currentUser}
                      matches={matches}
                      onLike={handleLike}
                      onPass={handlePass}
                      onSuperLike={handleSuperLike}
                      onViewProfile={handleViewProfile}
                      onRefresh={handleRefresh}
                    />
                  ) : (
                    <div>Loading...</div>
                  )
                } 
              />
            <Route 
              path="/gamification" 
              element={
                gamificationProfile ? (
                  <GamificationDashboard
                    profile={gamificationProfile}
                    onAchievementUnlocked={(achievement) => {
                      // Handle achievement unlocked
                    }}
                    onBadgeEarned={(badge) => {
                      // Handle badge earned
                    }}
                  />
                ) : (
                  <div>Loading...</div>
                )
              } 
            />
              </Routes>
            </Suspense>
        </main>

        {/* Premium Features Modal */}
        {showPremiumFeatures && currentUser && (
          <PremiumFeatures
            currentTier={currentUser.premiumTier}
            onUpgrade={handleUpgrade}
            onClose={() => setShowPremiumFeatures(false)}
          />
        )}

        {/* Gamification Modal */}
        {showGamification && gamificationProfile && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-6 rounded-t-3xl">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                    Your Journey
                  </h2>
                  <button
                    onClick={() => setShowGamification(false)}
                    className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    <span className="text-2xl">×</span>
                  </button>
                </div>
              </div>
              <GamificationDashboard
                profile={gamificationProfile}
                onAchievementUnlocked={(achievement) => {
                  // Handle achievement unlocked
                }}
                onBadgeEarned={(badge) => {
                  // Handle badge earned
                }}
              />
            </div>
          </div>
        )}
        </div>
      </Router>
    </ErrorBoundary>
  );
};

const App = () => {
  return <AppContent />;
};

export default App;
