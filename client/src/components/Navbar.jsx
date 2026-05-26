import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  User, LayoutDashboard, Flag, LogOut, 
  ChevronDown, Settings, Shield, Bell 
} from 'lucide-react';

const Navbar = () => {
  // State to manage whether the dropdown is open or closed
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  return (
    <nav className="flex justify-between items-center px-8 py-4 bg-[#0a0f1d] border-b border-slate-800 sticky top-0 z-50">
      
      {/* 1. Left Side: InternShield Logo */}
      {/* Look for the Link tag at the start of your nav */}
{/* Look for the Link tag at the start of your nav */}
<Link to="/home" className="flex items-center gap-2 group">
  <div className="bg-purple-600 rounded-lg p-1.5 ...">
    <Shield className="text-white" size={20} />
  </div>
  <span className="text-xl font-bold text-white tracking-tight">
    Intern<span className="text-blue-400">Shield</span>
  </span>
</Link>

      {/* 2. Right Side: Interactive Dropdown Menu */}
      <div className="relative">
        {/* The Clickable Button (Replaces "Sign In") */}
        <button 
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="flex items-center gap-2 bg-slate-800/80 hover:bg-slate-700 border border-slate-600 px-4 py-2 rounded-xl transition-all text-white font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/50"
        >
          <User size={18} className="text-blue-400" />
          <span>My Account</span>
          <ChevronDown 
            className={`text-slate-400 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} 
            size={16} 
          />
        </button>

        {/* The Dropdown Content */}
        {isDropdownOpen && (
          <div className="absolute right-0 mt-3 w-64 bg-slate-800 border border-slate-700 rounded-2xl shadow-2xl py-2 z-50">
            
            {/* Added: User Info Header */}
            <div className="px-4 py-3 mb-2 border-b border-slate-700 bg-slate-800/50">
              <p className="text-sm font-bold text-white">Student User</p>
              <p className="text-xs text-slate-400">student@university.edu</p>
            </div>

            {/* Core Links */}
            <Link 
              to="/dashboard" 
              className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-300 hover:text-white hover:bg-slate-700/50 transition-colors"
              onClick={() => setIsDropdownOpen(false)}
            >
              <LayoutDashboard size={18} className="text-blue-400" /> Command Dashboard
            </Link>
            
            <Link 
              to="/report" 
              className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-300 hover:text-white hover:bg-slate-700/50 transition-colors"
              onClick={() => setIsDropdownOpen(false)}
            >
              <Flag size={18} className="text-red-400" /> Report a Scam
            </Link>
            
            <Link 
              to="/account" 
              className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-300 hover:text-white hover:bg-slate-700/50 transition-colors"
              onClick={() => setIsDropdownOpen(false)}
            >
              <User size={18} className="text-emerald-400" /> Profile Settings
            </Link>

            {/* Added: Extra Features Section */}
            <div className="border-t border-slate-700 my-2"></div>

            <Link 
              to="/notifications" 
              className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-300 hover:text-white hover:bg-slate-700/50 transition-colors justify-between"
              onClick={() => setIsDropdownOpen(false)}
            >
              <div className="flex items-center gap-3">
                <Bell size={18} className="text-yellow-400" /> Alerts
              </div>
              <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">3 New</span>
            </Link>

            <Link 
              to="/settings" 
              className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-300 hover:text-white hover:bg-slate-700/50 transition-colors"
              onClick={() => setIsDropdownOpen(false)}
            >
              <Settings size={18} className="text-slate-400" /> App Preferences
            </Link>

            {/* Logout Section */}
            <div className="border-t border-slate-700 my-2"></div>
            
            <button 
              className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors text-left"
              onClick={() => {
                setIsDropdownOpen(false);
                console.log("User signed out");
              }}
            >
              <LogOut size={18} /> Sign Out
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;