import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar'; // Make sure this path is correct!
import SignIn from './pages/SignIn'; 
import SignUp from './pages/SignUp'; 
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Report from './pages/Report';
import Settings from './pages/Settings';
import Alerts from './pages/Alerts';

function App() {
  return (
    <div className="min-h-screen transition-colors duration-300">
      {/* Navbar goes here so it shows on every page */}
      <Navbar /> 
      
      <Routes>
        <Route path="/" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/home" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/report" element={<Report />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/account" element={<Settings />} />
        <Route path="/notifications" element={<Alerts />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}

export default App;