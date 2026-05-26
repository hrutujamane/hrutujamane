import React from "react";
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, Legend 
} from "recharts";
import { MapPin, ShieldAlert, Link as LinkIcon, AlertTriangle } from "lucide-react";

const Dashboard = () => {
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
    <div className="p-8 bg-slate-900 min-h-screen text-white font-sans">
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-red-500">
          InternShield Command Center
        </h1>
        <div className="bg-red-500/10 border border-red-500/50 px-4 py-2 rounded-full flex items-center gap-2">
          <AlertTriangle className="text-red-500" size={18} />
          <span className="text-red-500 font-medium">Live Threat Detection Active</span>
        </div>
      </div>

      {/* Main Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* SECTION 1: Reports by Link (The Pie Chart) */}
        <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 shadow-xl">
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
                  {linkData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
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
        <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 shadow-xl">
          <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
            <MapPin className="text-blue-400" /> Regional Hotspots
          </h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={locationData}>
                <XAxis dataKey="area" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip 
                  cursor={{fill: '#334155'}}
                  contentStyle={{ backgroundColor: '#0f172a', border: 'none' }}
                />
                <Bar dataKey="count" fill="#3b82f6" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* SECTION 3: Detailed Link Table (Full Width) */}
        <div className="lg:col-span-2 bg-slate-800 p-6 rounded-2xl border border-slate-700">
          <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <LinkIcon className="text-green-400" /> High-Risk Link Ledger
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-slate-400 border-b border-slate-700">
                  <th className="pb-3 font-medium">Flagged URL</th>
                  <th className="pb-3 font-medium">Total Reports</th>
                  <th className="pb-3 font-medium">Risk Level</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700">
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
    </div>
  );
};

export default Dashboard;