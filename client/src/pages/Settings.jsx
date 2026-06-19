import React from 'react';
import { Settings as SettingsIcon, User, Bell, Shield, Save } from 'lucide-react';

export default function Settings() {
  return (
    <div className="min-h-screen bg-[#020617] flex flex-col items-center pt-20 p-4">
      <div className="w-full max-w-3xl glass-card-dark p-8">
        <div className="flex items-center gap-3 mb-8 border-b border-slate-700 pb-4">
          <SettingsIcon className="text-slate-400" size={28} />
          <h1 className="text-3xl font-bold text-white">Settings</h1>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="col-span-1 flex flex-col gap-2 border-r border-slate-700/50 pr-4">
            <button className="flex items-center gap-3 px-4 py-3 bg-blue-500/10 text-blue-400 rounded-xl font-medium transition-colors">
              <User size={18} /> Profile
            </button>
            <button className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:bg-white/5 hover:text-white rounded-xl font-medium transition-colors">
              <Bell size={18} /> Notifications
            </button>
            <button className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:bg-white/5 hover:text-white rounded-xl font-medium transition-colors">
              <Shield size={18} /> Privacy & Security
            </button>
          </div>

          <div className="col-span-2 space-y-6">
            <h2 className="text-xl font-semibold text-white mb-4">Profile Information</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2">Display Name</label>
                <input type="text" className="input-field" defaultValue="Student User" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2">Email Address</label>
                <input type="email" className="input-field" defaultValue="student@university.edu" />
              </div>
            </div>

            <div className="pt-4 mt-6 border-t border-slate-700/50 flex justify-end">
              <button className="btn-analyze" onClick={() => alert('Settings Saved!')}>
                <Save size={18} /> Save Changes
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
