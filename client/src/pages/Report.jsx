import React, { useState } from 'react';
import { Flag, Send } from 'lucide-react';
import { getUser } from '../utils/auth';
import axios from 'axios';
import MeshBackground from '../components/MeshBackground';

/**
 * Incident Reporting Form.
 * Allows students to submit suspicious hiring entities to the security list.
 */
export default function Report() {
  const [url, setUrl] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [description, setDescription] = useState('');

  const user = getUser();
  const isPlacement = user?.section === 'placement';

  // Process incident filing on submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const headers = user?.email ? { 'x-user-email': user.email } : {};
      await axios.post('/api/reports', {
        url: url.trim() || undefined,
        companyName: companyName.trim() || undefined,
        description: description.trim()
      }, { headers });
      
      alert("Report submitted successfully! Our safety squad will investigate.");
      setUrl('');
      setCompanyName('');
      setDescription('');
    } catch (err) {
      alert("Failed to submit report: " + (err.response?.data?.message || err.message));
    }
  };

  return (
    <div className="relative min-h-screen bg-[#07070a] flex flex-col items-center pt-20 p-6">
      {/* Interactive Vector Canvas */}
      <MeshBackground />
      
      <div className="relative z-10 w-full max-w-2xl premium-card p-8 md:p-10 border border-white/[0.05] shadow-2xl animate-fade-in">
        <div className="flex items-center gap-3 mb-8 border-b border-white/[0.05] pb-5">
          <div className="bg-red-500/10 p-2.5 rounded-xl border border-red-500/20 text-red-400">
            <Flag size={22} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-100">Report a Scam</h1>
            <p className="text-slate-400 text-xs mt-1">
              Help keep the community safe by reporting suspicious hiring links or companies.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-2">Scam URL / Target Link <span className="text-slate-500 font-normal">(Optional if Company Name is set)</span></label>
            <input 
              type="url" 
              placeholder="https://example.com/suspicious-offer-letter" 
              className="w-full input-premium"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />
          </div>
          
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-2">Company Name <span className="text-slate-500 font-normal">(Optional if URL is set)</span></label>
            <input 
              type="text" 
              placeholder="e.g. Acme Scam Agency" 
              className="w-full input-premium"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-2">Details of Red Flags / Scam Activity</label>
            <textarea 
              placeholder="Describe what occurred. Did they charge an upfront processing fee? Did they offer direct selection with zero interview requirements?" 
              className="w-full input-premium min-h-[140px] resize-y"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required 
            />
          </div>

          <button type="submit" className="w-full btn-premium justify-center mt-6">
            <Send size={15} />
            <span>Submit Scam Threat Report</span>
          </button>
        </form>
      </div>
    </div>
  );
}
