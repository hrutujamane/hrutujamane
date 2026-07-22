import React, { useState, useEffect } from 'react';
import { Bell, AlertTriangle, ShieldCheck, Info, ShieldAlert, RefreshCw } from 'lucide-react';
import MeshBackground from '../components/MeshBackground';
import { getUser } from '../utils/auth';
import axios from 'axios';

/**
 * Notifications & Security Alerts list.
 * Displays feed warnings derived from community logs and audits.
 */
export default function Alerts() {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = getUser();
  const isAdmin = user?.role === 'admin';

  useEffect(() => {
    if (!isAdmin) {
      // Mock notifications feed for students
      setAlerts([
        {
          id: 1,
          type: 'warning',
          title: 'Suspicious Activity Detected',
          message: 'A link you analyzed recently (job-verify.net) has been flagged by 50+ users in the last 24 hours.',
          time: '2 hours ago',
          icon: <AlertTriangle className="text-yellow-400" size={20} />
        },
        {
          id: 2,
          type: 'success',
          title: 'Account Secured',
          message: 'Your two-factor authentication was successfully enabled.',
          time: '1 day ago',
          icon: <ShieldCheck className="text-emerald-400" size={20} />
        },
        {
          id: 3,
          type: 'info',
          title: 'New Feature Update',
          message: 'InplaSheild can now automatically scan PDF resumes for embedded scam links.',
          time: '3 days ago',
          icon: <Info className="text-blue-400" size={20} />
        }
      ]);
      setLoading(false);
      return;
    }

    // Fetch active student-reported alerts for admins
    axios.get('/api/admin/alerts', {
      headers: { 'x-user-email': user.email }
    })
      .then(res => {
        if (res.data.success) {
          const formatted = res.data.alerts.map(a => ({
            ...a,
            icon: a.type === 'danger' 
              ? <ShieldAlert className="text-red-500" size={20} /> 
              : <AlertTriangle className="text-amber-500" size={20} />
          }));
          setAlerts(formatted);
        }
      })
      .catch(err => console.error('Failed to load admin security warnings:', err))
      .finally(() => setLoading(false));
  }, [isAdmin, user?.email]);

  return (
    <div className="relative min-h-screen bg-[#07070a] flex flex-col items-center pt-20 p-6">
      <MeshBackground />
      
      <div className="relative z-10 w-full max-w-2xl animate-fade-in">
        <div className="flex items-center justify-between mb-8 pb-5 border-b border-white/[0.05]">
          <div className="flex items-center gap-3">
            <div className="bg-yellow-500/10 p-2.5 rounded-xl border border-yellow-500/20 text-yellow-400">
              <Bell size={22} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-100">
                {isAdmin ? 'System Threat Alerts' : 'Security Alerts'}
              </h1>
              <p className="text-xs text-slate-400 mt-1">
                {isAdmin ? 'Real-time student scam detection reports feed' : 'Updates and warnings about your credentials'}
              </p>
            </div>
          </div>
          
          {isAdmin && (
            <span className="text-[10px] uppercase font-bold tracking-wider text-red-400 bg-red-500/10 border border-red-500/20 px-3 py-1 rounded-md flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
              Admin Mode
            </span>
          )}
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3">
            <RefreshCw size={24} className="text-blue-500 animate-spin" />
            <p className="text-xs text-slate-500 font-mono">Synchronizing threat logs...</p>
          </div>
        ) : alerts.length > 0 ? (
          <div className="space-y-4">
            {alerts.map(alert => (
              <div 
                key={alert.id} 
                className={`premium-card p-5 border border-white/[0.04] bg-[#0c0c12]/40 hover:-translate-y-0.5 hover:bg-[#0c0c12]/60 transition-all flex items-start gap-4 ${
                  alert.type === 'danger' ? 'border-l-4 border-l-red-500' : alert.type === 'warning' && isAdmin ? 'border-l-4 border-l-amber-500' : ''
                }`}
              >
                <div className="bg-white/[0.02] border border-white/[0.05] p-2.5 rounded-xl flex-shrink-0">
                  {alert.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start gap-2">
                    <h3 className="font-bold text-slate-200 text-sm">{alert.title}</h3>
                    <span className="text-[10px] font-mono text-slate-500 whitespace-nowrap">{alert.time}</span>
                  </div>
                  <p className="text-slate-400 text-xs mt-1.5 leading-relaxed">{alert.message}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 premium-card border border-dashed border-white/[0.06] rounded-xl flex flex-col items-center justify-center p-6 text-slate-500">
            <span className="text-3xl mb-3">🛡️</span>
            <p className="text-xs font-semibold text-slate-400">Threat feed is empty</p>
            <p className="text-[10px] text-slate-500 mt-1">Zero scam activities reported by students.</p>
          </div>
        )}
      </div>
    </div>
  );
}
