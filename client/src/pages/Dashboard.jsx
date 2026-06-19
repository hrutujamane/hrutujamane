import React, { useState, useEffect } from "react";
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, Legend 
} from "recharts";
import { MapPin, ShieldAlert, Link as LinkIcon, AlertTriangle, Activity } from "lucide-react";

const Dashboard = () => {
  const [stats, setStats] = useState({ usageCount: 0, pastedLinks: [] });

  useEffect(() => {
    fetch('http://localhost:5000/api/user-stats')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setStats(data.stats);
        }
      })
      .catch(err => console.error("Error fetching stats:", err));
  }, []);
  // Data for the Pie Chart (Top 4 reported links)
  const linkData = [
    { name: "bit.ly/scam-offer", value: 450 },
    { name: "intern-apply.top", value: 300 },
    { name: "job-verify.net", value: 200 },
    { name: "t.co/fake-hr", value: 150 },
  ];

  // Data for the Bar Chart (Reports by Area)
  const locationData = [
    { area: "Mumbai", count: 120 },
    { area: "Pune", count: 85 },
    { area: "Delhi", count: 140 },
    { area: "Bangalore", count: 95 },
  ];

  // Colors for the Pie Chart slices
  const COLORS = ["#ef4444", "#f97316", "#facc15", "#3b82f6"];

  return (
    <div className="p-8 min-h-screen font-sans transition-colors duration-300">
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-red-500">
          InplaSheild Command Center
        </h1>
        <div className="bg-red-500/10 border border-red-500/50 px-4 py-2 rounded-full flex items-center gap-2">
          <AlertTriangle className="text-red-500" size={18} />
          <span className="text-red-500 font-medium">Live Threat Detection Active</span>
        </div>
      </div>

      {/* Main Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* SECTION 1: Reports by Link (The Pie Chart) */}
        <div className="glass-card-dark p-6">
          <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
            <ShieldAlert className="text-yellow-400" /> Threat Distribution (by Link)
          </h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={linkData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  <defs>
                    <linearGradient id="colorRed" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor="#ef4444" stopOpacity={1}/>
                      <stop offset="100%" stopColor="#b91c1c" stopOpacity={1}/>
                    </linearGradient>
                    <linearGradient id="colorOrange" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor="#f97316" stopOpacity={1}/>
                      <stop offset="100%" stopColor="#c2410c" stopOpacity={1}/>
                    </linearGradient>
                    <linearGradient id="colorYellow" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor="#facc15" stopOpacity={1}/>
                      <stop offset="100%" stopColor="#a16207" stopOpacity={1}/>
                    </linearGradient>
                    <linearGradient id="colorBlue" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor="#60a5fa" stopOpacity={1}/>
                      <stop offset="100%" stopColor="#2563eb" stopOpacity={1}/>
                    </linearGradient>
                  </defs>
                  {linkData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={[`url(#colorRed)`, `url(#colorOrange)`, `url(#colorYellow)`, `url(#colorBlue)`][index % 4]} 
                      stroke="rgba(255,255,255,0.1)"
                      strokeWidth={2}
                    />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', border: 'none', borderRadius: '8px' }}
                />
                <Legend verticalAlign="bottom" height={36}/>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* SECTION 2: Reports by Area (The Bar Chart) */}
        <div className="glass-card-dark p-6">
          <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
            <MapPin className="text-blue-400" /> Regional Hotspots
          </h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={locationData}>
                <defs>
                  <linearGradient id="colorBar" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#60a5fa" stopOpacity={1}/>
                    <stop offset="100%" stopColor="#312e81" stopOpacity={1}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="area" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip 
                  cursor={{fill: '#1e293b'}}
                  contentStyle={{ backgroundColor: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                />
                <Bar dataKey="count" fill="url(#colorBar)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* SECTION 3: Detailed Link Table (Full Width) */}
        <div className="lg:col-span-2 glass-card-dark p-6">
          <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <LinkIcon className="text-green-400" /> High-Risk Link Ledger
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b" style={{ borderColor: 'var(--glass-border)', color: 'var(--text-muted)' }}>
                  <th className="pb-3 font-medium">Flagged URL</th>
                  <th className="pb-3 font-medium">Total Reports</th>
                  <th className="pb-3 font-medium">Risk Level</th>
                </tr>
              </thead>
              <tbody className="divide-y" style={{ borderColor: 'var(--glass-border)' }}>
                {linkData.map((link, i) => (
                  <tr key={i} className="hover:bg-slate-700/30 transition-colors">
                    <td className="py-4 font-mono text-sm text-blue-300">{link.name}</td>
                    <td className="py-4">{link.value}</td>
                    <td className="py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                        link.value > 300 ? "bg-red-500/20 text-red-500" : "bg-yellow-500/20 text-yellow-500"
                      }`}>
                        {link.value > 300 ? "CRITICAL" : "HIGH"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>

      {/* SECTION 4: Live Scan Queue */}
      <div className="glass-card-dark p-6 mt-8">
        <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <Activity className="text-purple-400" /> Recent Scans Queue (Live)
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b" style={{ borderColor: 'var(--glass-border)', color: 'var(--text-muted)' }}>
                <th className="pb-3 font-medium">Link / File Name</th>
                <th className="pb-3 font-medium">Date</th>
                <th className="pb-3 font-medium">Time</th>
                <th className="pb-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y" style={{ borderColor: 'var(--glass-border)' }}>
              {stats.pastedLinks.length > 0 ? stats.pastedLinks.map((item, i) => (
                <tr key={i} className="hover:bg-slate-700/30 transition-colors">
                  <td className="py-4 font-mono text-sm text-blue-300 truncate max-w-md">
                    {item.url ? (
                      <span className="flex items-center gap-1.5">
                        <span className="text-blue-400">🔗</span> {item.url}
                      </span>
                    ) : item.fileName ? (
                      <span className="flex items-center gap-1.5">
                        <span className="text-purple-400">📄</span> {item.fileName}
                      </span>
                    ) : (
                      <span className="flex items-center gap-1.5">
                        <span className="text-amber-400">📝</span> Text Scan
                      </span>
                    )}
                  </td>
                  <td className="py-4 text-slate-300">{item.date}</td>
                  <td className="py-4 text-slate-300">{item.time}</td>
                  <td className="py-4">
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-400">
                      ANALYZED
                    </span>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="4" className="py-8 text-center text-slate-500">No scans in the queue yet. Go to the Home page and analyze a link or upload a PDF!</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;