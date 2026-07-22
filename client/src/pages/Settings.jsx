import React from 'react';
import { Settings as SettingsIcon, User, Bell, Shield, Save } from 'lucide-react';
import { getUser } from '../utils/auth';
import MeshBackground from '../components/MeshBackground';

/**
 * Preferences Controls Page.
 * Manages notification toggles and security variables.
 */
export default function Settings() {
  const user = getUser();
  
  return (
    <div className="relative min-h-screen bg-[#07070a] flex flex-col items-center pt-20 p-6">
      <MeshBackground />
      
      <div className="relative z-10 w-full max-w-3xl premium-card p-6 md:p-8 border border-white/[0.05] shadow-2xl animate-fade-in">
        <div className="flex items-center gap-3 mb-8 border-b border-white/[0.05] pb-5">
          <div className="bg-slate-500/10 p-2.5 rounded-xl border border-white/[0.08] text-slate-400">
            <SettingsIcon size={22} />
          </div>
          <h1 className="text-2xl font-bold text-slate-100">App Settings</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Navigation preferences menu */}
          <div className="col-span-1 flex flex-col gap-2 border-r border-white/[0.05] pr-6">
            <button className="flex items-center gap-3 px-4 py-3 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-xl text-xs font-semibold tracking-wide transition-colors">
              <User size={15} />
              <span>Profile Settings</span>
            </button>
            <button className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:bg-white/[0.02] hover:text-slate-200 rounded-xl text-xs font-semibold tracking-wide transition-colors">
              <Bell size={15} />
              <span>Notification Rules</span>
            </button>
            <button className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:bg-white/[0.02] hover:text-slate-200 rounded-xl text-xs font-semibold tracking-wide transition-colors">
              <Shield size={15} />
              <span>Security Audits</span>
            </button>
          </div>

          {/* Form details */}
          <div className="col-span-2 space-y-6">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-300">Display Information</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-2">Display Name</label>
                <input 
                  type="text" 
                  className="w-full input-premium font-semibold text-slate-200" 
                  defaultValue={user?.name || ''} 
                  readOnly 
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-2">Client Email Address</label>
                <input 
                  type="email" 
                  className="w-full input-premium font-mono text-blue-400" 
                  defaultValue={user?.email || ''} 
                  readOnly 
                />
              </div>
            </div>

            <div className="pt-5 mt-6 border-t border-white/[0.05] flex justify-end">
              <button 
                className="btn-premium" 
                onClick={() => alert('Client settings updated locally!')}
              >
                <Save size={15} />
                <span>Save Client Preferences</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
