import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import RoleSelection from './RoleSelection';
import QuickSetup from './QuickSetup';
import AnonymousProfileFixed from './AnonymousProfileFixed';
import OfferSkills from './OfferSkills';
import IdeaSprint from './IdeaSprint';

const Onboarding = () => {
  const location = useLocation();
  
  // Get the current path relative to /onboarding
  const currentPath = location.pathname.replace('/onboarding', '').replace(/^\//, '') || 'mission';

  // If we're at the root onboarding path, redirect to mission
  if (location.pathname === '/onboarding' || location.pathname === '/onboarding/') {
    return <Navigate to="/onboarding/mission" replace />;
  }

  // Render based on current path
  const renderComponent = () => {
    switch (currentPath) {
      case 'role':
        return <RoleSelection />;
      case 'mission':
        return <QuickSetup />;
      case 'pitch':
        return <AnonymousProfileFixed />;
      case 'offer-skills':
        return <OfferSkills />;
      case 'idea-sprint':
        return <IdeaSprint />;
      default:
        return <Navigate to="/onboarding/mission" replace />;
    }
  };

  return renderComponent();
};

export default Onboarding;
