import React from 'react';
import { Bell, AlertTriangle, ShieldCheck, Info } from 'lucide-react';

export default function Alerts() {
  const alerts = [
    {
      id: 1,
      type: 'warning',
      title: 'Suspicious Activity Detected',
      message: 'A link you analyzed recently (job-verify.net) has been flagged by 50+ users in the last 24 hours.',
      time: '2 hours ago',
      icon: <AlertTriangle className="text-yellow-400" size={24} />
    },
    {
      id: 2,
      type: 'success',
      title: 'Account Secured',
      message: 'Your two-factor authentication was successfully enabled.',
      time: '1 day ago',
      icon: <ShieldCheck className="text-green-400" size={24} />
    },
    {
      id: 3,
      type: 'info',
      title: 'New Feature Update',
      message: 'InplaSheild can now automatically scan PDF resumes for embedded scam links.',
      time: '3 days ago',
      icon: <Info className="text-blue-400" size={24} />
    }
  ];

  return (
    <div className="min-h-screen bg-[#020617] flex flex-col items-center pt-20 p-4">
      <div className="w-full max-w-2xl">
        <div className="flex items-center gap-3 mb-8">
          <div className="bg-yellow-500/20 p-2 rounded-lg">
            <Bell className="text-yellow-400" size={24} />
          </div>
          <h1 className="text-3xl font-bold text-white">Your Alerts</h1>
        </div>

        <div className="space-y-4">
          {alerts.map(alert => (
            <div key={alert.id} className="glass-card-dark p-5 flex items-start gap-4 transition-transform hover:-translate-y-1">
              <div className="mt-1">{alert.icon}</div>
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <h3 className="font-bold text-white text-lg">{alert.title}</h3>
                  <span className="text-xs text-slate-500">{alert.time}</span>
                </div>
                <p className="text-slate-400 text-sm mt-1 leading-relaxed">{alert.message}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
