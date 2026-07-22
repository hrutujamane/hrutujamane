import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  User, LayoutDashboard, Flag, LogOut,
  ChevronDown, Settings, Bell, Shield,
} from 'lucide-react';
import BrandLogo from './BrandLogo';
import { getUser, clearUser } from '../utils/auth';
import axios from 'axios';

/**
 * Floating glass navigation header.
 * Orchestrates account profile menu routing and user module triggers.
 */
const Navbar = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const user = getUser();
  const showAccountMenu = !!user;

  // Toggle active dashboard scanning modules
  const handleSectionChange = (newSection) => {
    if (!user) return;
    const updatedUser = { ...user, section: newSection };
    localStorage.setItem('inplasheild_user', JSON.stringify(updatedUser));
    
    axios.post('/api/update-section', { section: newSection }, {
      headers: { 'x-user-email': user.email }
    })
    .then(() => {
      window.location.reload();
    })
    .catch(err => {
      console.error('Failed to adjust user profile section details:', err);
      window.location.reload();
    });
  };

  return (
    <header className="sticky top-0 z-50 w-full px-6 py-4 bg-slate-950/40 border-b border-white/[0.04] backdrop-blur-xl">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Brand Link Logo */}
        <Link to={user ? "/home" : "/"} className="hover:opacity-90 transition-opacity">
          <BrandLogo size="nav" />
        </Link>

        {/* Authenticated Controls Menu */}
        {showAccountMenu ? (
          <div className="flex items-center gap-4 relative">
            {user?.role !== 'admin' && (
              <div className="flex p-0.5 bg-white/[0.02] border border-white/[0.06] rounded-xl mr-2">
                <button
                  onClick={() => handleSectionChange('internship')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition-all ${
                    user?.section !== 'placement'
                      ? 'bg-teal-500/10 text-teal-400 border border-teal-500/25 shadow-sm'
                      : 'text-slate-400 hover:text-slate-200 border border-transparent'
                  }`}
                >
                  Internship
                </button>
                <button
                  onClick={() => handleSectionChange('placement')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition-all ${
                    user?.section === 'placement'
                      ? 'bg-orange-500/10 text-orange-400 border border-orange-500/25 shadow-sm'
                      : 'text-slate-400 hover:text-slate-200 border border-transparent'
                  }`}
                >
                  Placement
                </button>
              </div>
            )}

            {/* Profile Dropdown Toggle */}
            <button
              type="button"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-2.5 px-4 py-2 bg-white/[0.03] border border-white/[0.06] rounded-xl hover:bg-white/[0.06] transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/40 text-sm font-medium text-slate-200"
            >
              <div className="bg-blue-500/15 p-1 rounded-lg border border-blue-500/25">
                <User size={14} className="text-blue-400" />
              </div>
              <span>My Account</span>
              <ChevronDown
                className={`text-slate-400 transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''}`}
                size={14}
              />
            </button>

            {/* Premium dropdown menu */}
            {isDropdownOpen && (
              <div className="absolute top-full right-0 mt-3 w-64 premium-card border border-white/[0.06] bg-slate-950/95 py-2.5 z-50 shadow-2xl overflow-hidden animate-fade-in">
                <div className="px-4 py-3 mb-2 border-b border-white/[0.05] bg-white/[0.01]">
                  <p className="text-sm font-bold text-slate-100">{user?.name || 'User'}</p>
                  <p className="text-xs text-slate-400 truncate mt-0.5">{user?.email || ''}</p>
                </div>

                {user?.role === 'admin' ? (
                  <>
                    <Link
                      to="/dashboard"
                      className="flex items-center gap-3 px-4 py-2 text-sm text-slate-300 hover:text-white hover:bg-white/[0.04] transition-colors"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      <LayoutDashboard size={16} className="text-blue-400" /> Command Dashboard
                    </Link>
                    <Link
                      to="/home"
                      className="flex items-center gap-3 px-4 py-2 text-sm text-slate-300 hover:text-white hover:bg-white/[0.04] transition-colors"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      <Shield size={16} className="text-teal-400" /> Scam Detector
                    </Link>
                  </>
                ) : (
                  <Link
                    to="/dashboard"
                    className="flex items-center gap-3 px-4 py-2 text-sm text-slate-300 hover:text-white hover:bg-white/[0.04] transition-colors"
                    onClick={() => setIsDropdownOpen(false)}
                  >
                    <LayoutDashboard size={16} className="text-blue-400" /> Safety Dashboard
                  </Link>
                )}

                <Link
                  to="/report"
                  className="flex items-center gap-3 px-4 py-2 text-sm text-slate-300 hover:text-white hover:bg-white/[0.04] transition-colors"
                  onClick={() => setIsDropdownOpen(false)}
                >
                  <Flag size={16} className="text-red-400" /> Report a Scam
                </Link>

                <Link
                  to="/account"
                  className="flex items-center gap-3 px-4 py-2 text-sm text-slate-300 hover:text-white hover:bg-white/[0.04] transition-colors"
                  onClick={() => setIsDropdownOpen(false)}
                >
                  <User size={16} className="text-emerald-400" /> Profile Settings
                </Link>

                <div className="border-t border-white/[0.05] my-2" />

                <Link
                  to="/notifications"
                  className="flex items-center justify-between px-4 py-2 text-sm text-slate-300 hover:text-white hover:bg-white/[0.04] transition-colors"
                  onClick={() => setIsDropdownOpen(false)}
                >
                  <div className="flex items-center gap-3">
                    <Bell size={16} className="text-yellow-400" /> Alerts
                  </div>
                  <span className="bg-red-500/20 border border-red-500/30 text-red-400 text-[10px] font-bold px-2 py-0.5 rounded-full">3 New</span>
                </Link>

                <Link
                  to="/settings"
                  className="flex items-center gap-3 px-4 py-2 text-sm text-slate-300 hover:text-white hover:bg-white/[0.04] transition-colors"
                  onClick={() => setIsDropdownOpen(false)}
                >
                  <Settings size={16} className="text-slate-400" /> App Preferences
                </Link>

                <div className="border-t border-white/[0.05] my-2" />

                <button
                  type="button"
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors text-left font-medium"
                  onClick={() => {
                    setIsDropdownOpen(false);
                    clearUser();
                    navigate('/');
                  }}
                >
                  <LogOut size={16} /> Sign Out
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="flex items-center gap-4">
            <Link
              to="/"
              className="text-sm font-semibold text-slate-300 hover:text-white transition-colors"
            >
              Sign In
            </Link>
            <Link
              to="/signup"
              className="bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold px-4.5 py-2 rounded-xl transition-all shadow-md shadow-blue-600/10 hover:shadow-blue-600/25"
            >
              Sign Up
            </Link>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;