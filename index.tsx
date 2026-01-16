
import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Dashboard } from './pages/Dashboard';
import { Trips } from './pages/Trips';
import { Fleet } from './pages/Fleet';
import { Revenue } from './pages/Revenue';
import { SMSDashboard } from './pages/SMS';
import { Trust } from './pages/Trust';
import { SettingsPage } from './pages/Settings';

const App = () => {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/trips" element={<Trips />} />
          <Route path="/fleet" element={<Fleet />} />
          <Route path="/revenue" element={<Revenue />} />
          <Route path="/sms" element={<SMSDashboard />} />
          <Route path="/trust" element={<Trust />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
};

const root = createRoot(document.getElementById('root')!);
root.render(<App />);
