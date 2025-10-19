import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import RoleSelection from './RoleSelection';
import QuickSetup from './QuickSetup';
import AnonymousProfileFixed from './AnonymousProfileFixed';
import OfferSkills from './OfferSkills';
import IdeaSprint from './IdeaSprint';

const Onboarding = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/onboarding/mission" replace />} />
      <Route path="/role" element={<RoleSelection />} />
      <Route path="/mission" element={<QuickSetup />} />
      <Route path="/pitch" element={<AnonymousProfileFixed />} />
      <Route path="/offer-skills" element={<OfferSkills />} />
      <Route path="/idea-sprint" element={<IdeaSprint />} />
    </Routes>
  );
};

export default Onboarding;
