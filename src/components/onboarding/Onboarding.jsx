import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import RoleSelection from './RoleSelection';
import QuickSetup from './QuickSetup';
import AnonymousProfile from './AnonymousProfile';
import Tutorial from './Tutorial';

const Onboarding = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/onboarding/role" replace />} />
      <Route path="/role" element={<RoleSelection />} />
      <Route path="/mission" element={<QuickSetup />} />
      <Route path="/pitch" element={<AnonymousProfile />} />
      <Route path="/tutorial" element={<Tutorial />} />
    </Routes>
  );
};

export default Onboarding;
