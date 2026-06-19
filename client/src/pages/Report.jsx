import React, { useState } from 'react';
import { Flag, Send } from 'lucide-react';

export default function Report() {
  const [url, setUrl] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Report submitted successfully! Our team will investigate.");
    setUrl('');
    setDescription('');
  };

  return (
    <div className="min-h-screen bg-[#020617] flex flex-col items-center pt-20 p-4">
      <div className="glass-card-dark p-10 w-full max-w-2xl">
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-red-500/20 p-2 rounded-lg">
            <Flag className="text-red-400" size={24} />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white">Report a Scam</h1>
            <p className="text-slate-400 text-sm mt-1">Help the community by reporting suspicious internships.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">Scam URL</label>
            <input 
              type="url" 
              placeholder="https://example.com/fake-job" 
              className="input-field"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              required 
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">Description / Red Flags</label>
            <textarea 
              placeholder="Why do you think this is a scam?" 
              className="input-field min-h-[120px] resize-y"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required 
            />
          </div>
          <button type="submit" className="w-full btn-analyze justify-center">
            <Send size={18} />
            Submit Report
          </button>
        </form>
      </div>
    </div>
  );
}
