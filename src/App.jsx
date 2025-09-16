import React, { useState, useEffect, Suspense, lazy, memo } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
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
const Connections = lazy(() => import('./components/Connections.jsx'));
const Auth = lazy(() => import('./components/Auth.jsx'));
const AIMatchingInterface = lazy(() => import('./components/AIMatchingInterface.jsx'));
const GamificationDashboard = lazy(() => import('./components/GamificationDashboard.jsx'));
const PremiumFeatures = lazy(() => import('./components/PremiumFeatures.jsx'));
const Settings = lazy(() => import('./components/Settings.jsx'));
const Landing = lazy(() => import('./components/Landing.jsx'));
const Onboarding = lazy(() => import('./components/onboarding/Onboarding.jsx'));
const PitchMode = lazy(() => import('./components/PitchMode.jsx'));
const RevealMode = lazy(() => import('./components/RevealMode.jsx'));
const JourneyMode = lazy(() => import('./components/JourneyMode.jsx'));
const EventsModule = lazy(() => import('./components/EventsModule.jsx'));
const Academy = lazy(() => import('./components/Academy.jsx'));
const ProfileRedesign = lazy(() => import('./components/ProfileRedesign.jsx'));

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useSelector((state) => state.auth);
  
  if (isLoading) {
    return <LoadingFallback />;
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }
  
  return children;
};

// Main Layout Component
const MainLayout = ({ children }) => (
  <div className="App min-h-screen bg-gray-50">
    <Suspense fallback={<LoadingFallback />}>
      <Navbar />
    </Suspense>
    <main className="main-content pt-20">
      {children}
    </main>
  </div>
);

const AppContent = () => {
  const { isAuthenticated, isLoading } = useSelector((state) => state.auth);
  const [currentUser, setCurrentUser] = useState(null);
  const [matches, setMatches] = useState([]);
  const [gamificationProfile, setGamificationProfile] = useState(null);

  // Initialize performance monitoring and analytics
  useEffect(() => {
    setupGlobalErrorHandlers();
    initializeAnalytics();
  }, []);

  // Load user data when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      // Load current user data
      setCurrentUser({
        id: '1',
        name: 'John Doe',
        age: 28,
        bio: 'Passionate about technology and innovation',
        photos: ['https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face'],
        interests: ['Technology', 'Travel', 'Fitness'],
        location: 'San Francisco, CA'
      });

      // Load matches
      setMatches([
        {
          id: '1',
          name: 'Sarah Johnson',
          age: 26,
          bio: 'Love hiking and photography',
          photos: ['https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=400&fit=crop&crop=face'],
          interests: ['Photography', 'Hiking', 'Art'],
          location: 'San Francisco, CA',
          compatibility: 95
        },
        {
          id: '2',
          name: 'Emily Chen',
          age: 29,
          bio: 'Tech entrepreneur and fitness enthusiast',
          photos: ['https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face'],
          interests: ['Technology', 'Fitness', 'Cooking'],
          location: 'San Francisco, CA',
          compatibility: 88
        }
      ]);

      // Load gamification profile
      setGamificationProfile({
        level: 5,
        xp: 1250,
        nextLevelXp: 1500,
        achievements: [
          { id: '1', name: 'First Match', description: 'Got your first match!', unlocked: true, date: '2024-01-15' },
          { id: '2', name: 'Profile Complete', description: 'Completed your profile', unlocked: true, date: '2024-01-10' },
          { id: '3', name: 'Chat Master', description: 'Sent 100 messages', unlocked: false, date: null }
        ],
        badges: [
          { id: '1', name: 'Newcomer', description: 'Welcome to the app!', icon: '🌟', unlocked: true },
          { id: '2', name: 'Social Butterfly', description: 'Active in conversations', icon: '🦋', unlocked: false }
        ],
        stats: {
          matches: 12,
          messages: 45,
          profileViews: 89,
          likes: 23
        }
      });
    }
  }, [isAuthenticated]);

  // Handle AI matching actions
  const handleLike = (matchId) => {
    console.log('Liked match:', matchId);
  };

  const handlePass = (matchId) => {
    console.log('Passed on match:', matchId);
    setMatches(prev => prev.filter(match => match.id !== matchId));
  };

  const handleSuperLike = (matchId) => {
    console.log('Super liked match:', matchId);
  };

  const handleViewProfile = (matchId) => {
    console.log('Viewing profile:', matchId);
  };

  const handleRefresh = () => {
    console.log('Refreshing matches...');
  };

  // Show loading screen
  if (isLoading) {
    return <LoadingFallback />;
  }

  return (
    <ErrorBoundary>
      <Router>
        <div className="App min-h-screen">
          <Suspense fallback={<LoadingFallback />}>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Landing />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/onboarding/*" element={<Onboarding />} />
              
              {/* Protected Routes */}
              <Route path="/home" element={
                <ProtectedRoute>
                  <MainLayout>
                    <Home />
                  </MainLayout>
                </ProtectedRoute>
              } />
              
              <Route path="/profile" element={
                <ProtectedRoute>
                  <MainLayout>
                    <ProfileRedesign />
                  </MainLayout>
                </ProtectedRoute>
              } />
              
              <Route path="/connections" element={
                <ProtectedRoute>
                  <MainLayout>
                    <Connections />
                  </MainLayout>
                </ProtectedRoute>
              } />
              
              <Route path="/events" element={
                <ProtectedRoute>
                  <MainLayout>
                    <EventsModule />
                  </MainLayout>
                </ProtectedRoute>
              } />
              
              <Route path="/pitches" element={
                <ProtectedRoute>
                  <MainLayout>
                    <PitchMode />
                  </MainLayout>
                </ProtectedRoute>
              } />
              
              <Route path="/matching" element={
                <ProtectedRoute>
                  <MainLayout>
                    {currentUser ? (
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
                      <LoadingFallback />
                    )}
                  </MainLayout>
                </ProtectedRoute>
              } />
              
              <Route path="/reveal" element={
                <ProtectedRoute>
                  <MainLayout>
                    <RevealMode />
                  </MainLayout>
                </ProtectedRoute>
              } />
              
              <Route path="/journey" element={
                <ProtectedRoute>
                  <MainLayout>
                    <JourneyMode />
                  </MainLayout>
                </ProtectedRoute>
              } />
              
              <Route path="/gamification" element={
                <ProtectedRoute>
                  <MainLayout>
                    {gamificationProfile ? (
                      <GamificationDashboard
                        profile={gamificationProfile}
                        onAchievementUnlocked={(achievement) => {
                          console.log('Achievement unlocked:', achievement);
                        }}
                        onBadgeEarned={(badge) => {
                          console.log('Badge earned:', badge);
                        }}
                      />
                    ) : (
                      <LoadingFallback />
                    )}
                  </MainLayout>
                </ProtectedRoute>
              } />
              
              <Route path="/premium" element={
                <ProtectedRoute>
                  <MainLayout>
                    <PremiumFeatures
                      onUpgrade={(plan) => {
                        console.log('Upgrading to:', plan);
                      }}
                    />
                  </MainLayout>
                </ProtectedRoute>
              } />
              
              <Route path="/settings" element={
                <ProtectedRoute>
                  <MainLayout>
                    <Settings />
                  </MainLayout>
                </ProtectedRoute>
              } />
              
              <Route path="/dating-school" element={
                <ProtectedRoute>
                  <MainLayout>
                    <Academy />
                  </MainLayout>
                </ProtectedRoute>
              } />
              
              {/* Catch all route */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Suspense>
        </div>
      </Router>
    </ErrorBoundary>
  );
};

const App = () => {
  return <AppContent />;
};

export default App;