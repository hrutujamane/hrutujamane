import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  User, LayoutDashboard, Flag, LogOut, 
  ChevronDown, Settings, Shield, Bell, Hexagon, Zap
} from 'lucide-react';

const Navbar = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  return (
    <nav className="flex justify-between items-center px-8 py-4 sticky top-0 z-50 transition-all duration-300" style={{ background: 'var(--nav-bg)', borderBottom: '1px solid var(--glass-border)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)' }}>
      
{/* 1. Left Side: InplaSheild Logo */}
<Link to="/home" className="flex items-center gap-3 group">
  <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 shadow-lg shadow-purple-500/30 group-hover:shadow-purple-500/50 transition-all duration-300">
    <Hexagon className="absolute text-white/20 animate-pulse" size={32} strokeWidth={1} />
    <Zap className="text-white relative z-10" size={20} strokeWidth={2.5} />
  </div>
  <div className="flex flex-col">
    <span className="text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-300 tracking-tight leading-none group-hover:to-white transition-colors duration-300">
      INPLA
    </span>
    <span className="text-xs font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400 tracking-widest leading-none mt-0.5">
      SHEILD
    </span>
  </div>
</Link>

      {/* 2. Right Side: Interactive Dropdown Menu */}
      <div className="flex items-center gap-4 relative">
        {/* The Clickable Button (Replaces "Sign In") */}
        <button 
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl transition-all duration-300 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/50 shadow-lg"
          style={{ background: 'var(--glass-bg)', borderColor: 'var(--glass-border)', color: 'var(--text-main)', borderWidth: '1px' }}
        >
          <div className="bg-blue-500/20 p-1.5 rounded-lg border border-blue-500/30">
            <User size={16} className="text-blue-500" />
          </div>
          <span>My Account</span>
          <ChevronDown 
            className={`transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''}`} 
            style={{ color: 'var(--text-muted)' }}
            size={16} 
          />
        </button>

        {/* The Dropdown Content */}
        {isDropdownOpen && (
          <div className="absolute top-full right-0 mt-2 w-64 glass-card-dark py-2 z-50 shadow-2xl transform origin-top-right transition-all">
            
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