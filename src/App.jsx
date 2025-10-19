import React, { useState, useEffect, Suspense, lazy, memo } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { initializeAuth } from './store/slices/authSlice.js';
import ErrorBoundary from './components/ErrorBoundary.jsx';
import LoadingSpinner from './components/LoadingSpinner.jsx';

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
const SprintDashboard = lazy(() => import('./components/SprintDashboard.jsx'));
const Auth = lazy(() => import('./components/Auth.jsx'));
const Landing = lazy(() => import('./components/Landing.jsx'));
const Onboarding = lazy(() => import('./components/onboarding/Onboarding.jsx'));
const StartupPitchCreator = lazy(() => import('./components/StartupPitchCreator.jsx'));
const PitchBackSystem = lazy(() => import('./components/PitchBackSystem.jsx'));
const CofounderMatching = lazy(() => import('./components/CofounderMatching.jsx'));
const StartupRoadmap = lazy(() => import('./components/StartupRoadmap.jsx'));
const ProjectBoard = lazy(() => import('./components/ProjectBoard.jsx'));
const TeamWorkspace = lazy(() => import('./components/TeamWorkspace.jsx'));
const MVPTracker = lazy(() => import('./components/MVPTracker.jsx'));
const EquityFramework = lazy(() => import('./components/EquityFramework.jsx'));
const CollaborationTools = lazy(() => import('./components/CollaborationTools.jsx'));
const LaunchPreparation = lazy(() => import('./components/LaunchPreparation.jsx'));
const EntrepreneurProfile = lazy(() => import('./components/EntrepreneurProfile.jsx'));
const StartupWorkspace = lazy(() => import('./components/StartupWorkspace.jsx'));
const MyPitches = lazy(() => import('./components/MyPitches.jsx'));

// Sprint Tools
const IdeaFurnishing = lazy(() => import('./components/sprint-tools/IdeaFurnishing.jsx'));
const MVPBuilder = lazy(() => import('./components/sprint-tools/MVPBuilder.jsx'));
const IdeaValidator = lazy(() => import('./components/sprint-tools/IdeaValidator.jsx'));
const MarketResearch = lazy(() => import('./components/sprint-tools/MarketResearch.jsx'));
const PitchDeckBuilder = lazy(() => import('./components/sprint-tools/PitchDeckBuilder.jsx'));
const PitchPrep = lazy(() => import('./components/sprint-tools/PitchPrep.jsx'));

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

// Home Router - Routes to correct dashboard based on user type
const HomeRouter = () => {
  const [userIntent, setUserIntent] = useState(null);

  useEffect(() => {
    const intent = localStorage.getItem('selectedIntent');
    setUserIntent(intent);
  }, []);

  if (userIntent === 'idea-sprint') {
    return <SprintDashboard />;
  }

  return <Home />;
};

const AppContent = () => {
  const dispatch = useDispatch();
  const { isAuthenticated, isLoading } = useSelector((state) => state.auth);
  const [currentUser, setCurrentUser] = useState(null);
  const [matches, setMatches] = useState([]);

  useEffect(() => {
    dispatch(initializeAuth());
  }, [dispatch]);

  // Load user data when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      // Load current user data
      setCurrentUser({
        id: '1',
        name: 'Alex Chen',
        role: 'Technical Co-founder',
        bio: 'Full-stack developer with 8 years experience building scalable web applications. Passionate about AI and fintech.',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face',
        skills: ['React', 'Node.js', 'Python', 'AWS', 'Machine Learning'],
        experience: '8 years',
        previousStartups: ['TechCorp (Acquired)', 'DataFlow (Series A)'],
        location: 'San Francisco, CA',
        lookingFor: ['Business Co-founder', 'Marketing Expert', 'Designer'],
        industries: ['Fintech', 'AI/ML', 'SaaS']
      });

      // Load potential cofounders
      setMatches([
        {
          id: '1',
          name: 'Sarah Martinez',
          role: 'Business Co-founder',
          bio: 'Former McKinsey consultant with 6 years in strategy and operations. Led 3 successful product launches.',
          avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=400&fit=crop&crop=face',
          skills: ['Business Strategy', 'Operations', 'Fundraising', 'Product Management'],
          experience: '6 years',
          previousStartups: ['GrowthCo (Series B)', 'ScaleUp (Acquired)'],
          location: 'San Francisco, CA',
          lookingFor: ['Technical Co-founder', 'CTO'],
          industries: ['Fintech', 'SaaS', 'E-commerce'],
          compatibility: 92
        },
        {
          id: '2',
          name: 'David Kim',
          role: 'Product Designer',
          bio: 'Award-winning designer with expertise in UX/UI and brand design. Worked at Apple and Google.',
          avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face',
          skills: ['UI/UX Design', 'Brand Design', 'Figma', 'User Research', 'Prototyping'],
          experience: '7 years',
          previousStartups: ['DesignStudio (Acquired)', 'CreativeLab (Series A)'],
          location: 'San Francisco, CA',
          lookingFor: ['Technical Co-founder', 'Business Co-founder'],
          industries: ['AI/ML', 'SaaS', 'Mobile Apps'],
          compatibility: 88
        }
      ]);

    }
  }, [isAuthenticated]);

  // Handle cofounder matching actions
  const handleConnect = (matchId) => {
    console.log('Connecting with cofounder:', matchId);
  };

  const handlePass = (matchId) => {
    console.log('Passed on cofounder:', matchId);
    setMatches(prev => prev.filter(match => match.id !== matchId));
  };

  const handlePitch = (matchId, message) => {
    console.log('Sending pitch to:', matchId, 'Message:', message);
  };

  const handleViewProfile = (matchId) => {
    console.log('Viewing cofounder profile:', matchId);
  };

  const handleRefresh = () => {
    console.log('Refreshing cofounder matches...');
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
                    <HomeRouter />
                  </MainLayout>
                </ProtectedRoute>
              } />
              
              <Route path="/profile" element={
                <ProtectedRoute>
                  <MainLayout>
                    <EntrepreneurProfile />
                  </MainLayout>
                </ProtectedRoute>
              } />
              
              <Route path="/connections" element={
                <ProtectedRoute>
                  <MainLayout>
                    <PitchBackSystem />
                  </MainLayout>
                </ProtectedRoute>
              } />
              
              <Route path="/workspace" element={
                <ProtectedRoute>
                  <MainLayout>
                    <TeamWorkspace />
                  </MainLayout>
                </ProtectedRoute>
              } />
              
              <Route path="/create-pitch" element={
                <ProtectedRoute>
                  <MainLayout>
                    <StartupPitchCreator />
                  </MainLayout>
                </ProtectedRoute>
              } />
              
              <Route path="/cofounders" element={
                <ProtectedRoute>
                  <MainLayout>
                    {currentUser ? (
                      <CofounderMatching
                        currentUser={currentUser}
                        matches={matches}
                        onConnect={handleConnect}
                        onPass={handlePass}
                        onPitch={handlePitch}
                        onViewProfile={handleViewProfile}
                        onRefresh={handleRefresh}
                      />
                    ) : (
                      <LoadingFallback />
                    )}
                  </MainLayout>
                </ProtectedRoute>
              } />
              
              <Route path="/projects" element={
                <ProtectedRoute>
                  <MainLayout>
                    <ProjectBoard />
                  </MainLayout>
                </ProtectedRoute>
              } />
              
              <Route path="/mvp-tracker" element={
                <ProtectedRoute>
                  <MainLayout>
                    <MVPTracker />
                  </MainLayout>
                </ProtectedRoute>
              } />
              
              <Route path="/equity" element={
                <ProtectedRoute>
                  <MainLayout>
                    <EquityFramework />
                  </MainLayout>
                </ProtectedRoute>
              } />
              
              <Route path="/collaboration" element={
                <ProtectedRoute>
                  <MainLayout>
                    <CollaborationTools />
                  </MainLayout>
                </ProtectedRoute>
              } />
              
              <Route path="/launch-prep" element={
                <ProtectedRoute>
                  <MainLayout>
                    <LaunchPreparation />
                  </MainLayout>
                </ProtectedRoute>
              } />
              
              <Route path="/settings" element={
                <ProtectedRoute>
                  <MainLayout>
                    <div className="p-8">
                      <h1 className="text-2xl font-bold text-gray-900 mb-6">Settings</h1>
                      <div className="bg-white rounded-2xl p-6 shadow-lg">
                        <p className="text-gray-600">Settings page coming soon...</p>
                      </div>
                    </div>
                  </MainLayout>
                </ProtectedRoute>
              } />
              
              <Route path="/startup-workspace" element={
                <ProtectedRoute>
                  <MainLayout>
                    <StartupWorkspace />
                  </MainLayout>
                </ProtectedRoute>
              } />
              
              <Route path="/my-pitches" element={
                <ProtectedRoute>
                  <MainLayout>
                    <MyPitches />
                  </MainLayout>
                </ProtectedRoute>
              } />
              
              <Route path="/launch" element={
                <ProtectedRoute>
                  <MainLayout>
                    <LaunchPreparation />
                  </MainLayout>
                </ProtectedRoute>
              } />
              
              {/* Sprint Tools Routes */}
              <Route path="/sprint/idea-furnishing" element={
                <ProtectedRoute>
                  <MainLayout>
                    <IdeaFurnishing />
                  </MainLayout>
                </ProtectedRoute>
              } />
              
              <Route path="/sprint/mvp-builder" element={
                <ProtectedRoute>
                  <MainLayout>
                    <MVPBuilder />
                  </MainLayout>
                </ProtectedRoute>
              } />
              
              <Route path="/sprint/idea-validator" element={
                <ProtectedRoute>
                  <MainLayout>
                    <IdeaValidator />
                  </MainLayout>
                </ProtectedRoute>
              } />
              
              <Route path="/sprint/market-research" element={
                <ProtectedRoute>
                  <MainLayout>
                    <MarketResearch />
                  </MainLayout>
                </ProtectedRoute>
              } />
              
              <Route path="/sprint/pitch-deck" element={
                <ProtectedRoute>
                  <MainLayout>
                    <PitchDeckBuilder />
                  </MainLayout>
                </ProtectedRoute>
              } />
              
              <Route path="/sprint/pitch-prep" element={
                <ProtectedRoute>
                  <MainLayout>
                    <PitchPrep />
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