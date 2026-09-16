/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './hooks/useAuth';
import { TopBar } from './components/TopBar';
import { BottomNav } from './components/BottomNav';
import { AddToHomePopup } from './components/AddToHomePopup';

import { Home } from './pages/Home';
import { Tasks } from './pages/Tasks';
import { Referral } from './pages/Referral';
import { Profile } from './pages/Profile';
import { Admin } from './pages/Admin';

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="w-full max-w-xl mx-auto relative min-h-screen flex flex-col bg-[#1c1c1e] text-white font-sans selection:bg-blue-500/30 md:shadow-2xl md:border-x md:border-white/5">
          <TopBar />
          <AddToHomePopup />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/tasks" element={<Tasks />} />
            <Route path="/referral" element={<Referral />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/admin" element={<Admin />} />
          </Routes>
          <BottomNav />
        </div>
      </AuthProvider>
    </Router>
  );
}
