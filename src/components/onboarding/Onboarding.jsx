import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import RoleSelection from './RoleSelection';
import QuickSetup from './QuickSetup';
import AnonymousProfileFixed from './AnonymousProfileFixed';

const Onboarding = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/onboarding/mission" replace />} />
      <Route path="/role" element={<RoleSelection />} />
      <Route path="/mission" element={<QuickSetup />} />
      <Route path="/pitch" element={<AnonymousProfileFixed />} />
    </Routes>
  );
};

export default Onboarding;
