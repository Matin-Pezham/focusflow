import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import AppLayout from '../components/layout/AppLayout';
import Dashboard from '../pages/Dashboard';
import Tasks from '../pages/Tasks';
import Pomodoro from '../pages/Pomodoro';
import Analytics from '../pages/Analytics';
import Settings from '../pages/Settings';

const AppRouter: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<AppLayout />}> 
        {/* Index route -> Dashboard */}
        <Route index element={<Dashboard />} />

        {/* Feature routes (nested within AppLayout) */}
        <Route path="tasks" element={<Tasks />} />
        <Route path="pomodoro" element={<Pomodoro />} />
        <Route path="analytics" element={<Analytics />} />
        <Route path="settings" element={<Settings />} />

        {/* Fallback to dashboard */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
};

export default AppRouter;
