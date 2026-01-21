import './style.css';
import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Dashboard } from './pages/Dashboard';
import { Trips } from './pages/Trips';
import { Branches } from './pages/Branches';
import { Vehicles } from './pages/Vehicles';
import { Crew } from './pages/Crew';
import { Revenue } from './pages/Revenue';
import { Trust } from './pages/Trust';
import { SettingsPage } from './pages/Settings';
import { Login } from './pages/Login';

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Simple session check (UI only)
  useEffect(() => {
    const session = localStorage.getItem('mos_admin_session');
    if (session) setIsAuthenticated(true);
  }, []);

  const handleLogin = () => {
    localStorage.setItem('mos_admin_session', 'active');
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('mos_admin_session');
    setIsAuthenticated(false);
  };

  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <BrowserRouter>
      <Layout onLogout={handleLogout}>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/trips" element={<Trips />} />
          <Route path="/branches" element={<Branches />} />
          <Route path="/vehicles" element={<Vehicles />} />
          <Route path="/crew" element={<Crew />} />
          <Route path="/revenue" element={<Revenue />} />
          <Route path="/trust" element={<Trust />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
};

const root = createRoot(document.getElementById('root')!);
root.render(<App />);