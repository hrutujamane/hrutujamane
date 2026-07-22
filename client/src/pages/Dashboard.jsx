import React, { useState, useEffect } from "react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from "recharts";
import {
  MapPin, ShieldAlert, Link as LinkIcon, AlertTriangle, Activity,
  Users, UserPlus, FileSearch, Globe, Flag
} from "lucide-react";
import { getUser } from "../utils/auth";

const COLORS = ["#3b82f6", "#10b981", "#f97316", "#ef4444"];

/**
 * Commands Dashboard Panel.
 * Dynamically queries statistics for Student and Security Admin views.
 */
const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const user = getUser();

  const isAdmin = user?.role === 'admin';

  // Request statistics reports from backend server
  useEffect(() => {
    if (!user?.email) {
      setLoading(false);
      return;
    }
    const endpoint = isAdmin ? "/api/admin/stats" : "/api/student/stats";
    const headers = { "x-user-email": user.email };
    
    fetch(endpoint, { headers })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setStats(data.stats);
        }
      })
      .catch((err) => console.error('Error fetching analytics database records:', err))
      .finally(() => setLoading(false));
  }, [user?.email, isAdmin]);

  const scanTypeData = stats
    ? [
        { name: "PDF / File Scans", value: stats.fileScans || 0 },
        { name: "URL Scans", value: stats.urlScans || 0 },
      ].filter((d) => d.value > 0)
    : [];

  const sectionData = stats
    ? [
        { area: "Internship", count: stats.internshipUsers || 0 },
        { area: "Placement", count: stats.placementUsers || 0 },
      ]
    : [];

  const topUrls = stats?.topUrls || [];
  const recentUsers = stats?.recentUsers || [];
  const recentScans = stats?.recentScans || [];

  if (loading) {
    return (
      <div className="p-8 min-h-screen flex items-center justify-center bg-[#07070a]">
        <div className="flex flex-col items-center gap-3">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
          <p className="text-slate-400 font-mono text-xs">Accessing safety logs...</p>
        </div>
      </div>
    );
  }

  // --- SECURITY ADMIN VIEW ---
  if (isAdmin) {
    return (
      <div className="p-6 md:p-8 min-h-screen bg-[#07070a] text-slate-100 animate-fade-in max-w-7xl mx-auto space-y-8">
        {/* Dashboard Title Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-6 border-b border-white/[0.04]">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-amber-500">
              InplaSheild Command Center
            </h1>
            <p className="text-slate-400 text-xs mt-1.5">Welcome back, {user?.name || "Admin"} (Role: Administrator)</p>
          </div>
          <div className="bg-red-500/10 border border-red-500/20 px-4 py-2 rounded-xl flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            <span className="text-red-400 text-xs font-bold uppercase tracking-wider">Live threat feed active</span>
          </div>
        </div>

        {/* Audit Metrics Panel */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
          <div className="premium-card p-5 border border-white/[0.04]">
            <div className="flex items-center gap-2.5 mb-2.5 text-slate-400">
              <Users className="text-blue-400" size={16} />
              <span className="text-xs font-bold tracking-wider uppercase">Accounts</span>
            </div>
            <p className="text-3xl font-black text-white">{stats?.totalStudents ?? 0}</p>
            <p className="text-[10px] text-slate-500 mt-1">Total registered users</p>
          </div>
          <div className="premium-card p-5 border border-white/[0.04]">
            <div className="flex items-center gap-2.5 mb-2.5 text-slate-400">
              <UserPlus className="text-emerald-400" size={16} />
              <span className="text-xs font-bold tracking-wider uppercase">Weekly New</span>
            </div>
            <p className="text-3xl font-black text-white">{stats?.newThisWeek ?? 0}</p>
            <p className="text-[10px] text-slate-500 mt-1">Created in last 7 days</p>
          </div>
          <div className="premium-card p-5 border border-white/[0.04]">
            <div className="flex items-center gap-2.5 mb-2.5 text-slate-400">
              <FileSearch className="text-purple-400" size={16} />
              <span className="text-xs font-bold tracking-wider uppercase">Total Scans</span>
            </div>
            <p className="text-3xl font-black text-white">{stats?.totalScans ?? 0}</p>
            <p className="text-[10px] text-slate-500 mt-1">Checked documents & links</p>
          </div>
          <div className="premium-card p-5 border border-white/[0.04]">
            <div className="flex items-center gap-2.5 mb-2.5 text-slate-400">
              <Globe className="text-orange-400" size={16} />
              <span className="text-xs font-bold tracking-wider uppercase">Type Distribution</span>
            </div>
            <p className="text-3xl font-black text-white">
              {stats?.urlScans ?? 0} <span className="text-sm font-normal text-slate-500">/ {stats?.fileScans ?? 0}</span>
            </p>
            <p className="text-[10px] text-slate-500 mt-1">URL vs PDF/Text scans</p>
          </div>
          <div className="premium-card p-5 border border-white/[0.04]">
            <div className="flex items-center gap-2.5 mb-2.5 text-slate-400">
              <Flag className="text-red-400" size={16} />
              <span className="text-xs font-bold tracking-wider uppercase">Threat Reports</span>
            </div>
            <p className="text-3xl font-black text-white">{stats?.totalReports ?? 0}</p>
            <p className="text-[10px] text-slate-500 mt-1">Active reported listings</p>
          </div>
        </div>

        {/* Charts & Graphical Analysis */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="premium-card p-6 border border-white/[0.04] bg-slate-950/20">
            <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider mb-6 flex items-center gap-2">
              <ShieldAlert className="text-yellow-400" size={16} /> Scans Distribution
            </h3>
            <div className="h-[280px]">
              {scanTypeData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={scanTypeData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={90}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {scanTypeData.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="#0c0c12" strokeWidth={3} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: "#0c0c12", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "10px", fontSize: '11px', fontFamily: 'monospace' }} />
                    <Legend verticalAlign="bottom" height={36} wrapperStyle={{ fontSize: '12px' }} />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-slate-500 text-xs italic">No scan records available</div>
              )}
            </div>
          </div>

          <div className="premium-card p-6 border border-white/[0.04] bg-slate-950/20">
            <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider mb-6 flex items-center gap-2">
              <MapPin className="text-blue-400" size={16} /> Users by Module
            </h3>
            <div className="h-[280px]">
              {sectionData.some((d) => d.count > 0) ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={sectionData}>
                    <defs>
                      <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.2}/>
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="area" stroke="#64748b" fontSize={11} tickLine={false} />
                    <YAxis stroke="#64748b" fontSize={11} tickLine={false} allowDecimals={false} />
                    <Tooltip
                      cursor={{ fill: "rgba(255,255,255,0.02)" }}
                      contentStyle={{ backgroundColor: "#0c0c12", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "10px", fontSize: '11px' }}
                    />
                    <Bar dataKey="count" fill="url(#barGradient)" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-slate-500 text-xs italic">No student sections mapped</div>
              )}
            </div>
          </div>
        </div>

        {/* User Directories */}
        <div className="premium-card p-6 border border-white/[0.04]">
          <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider mb-4 flex items-center gap-2">
            <Users className="text-emerald-400" size={16} /> Registered Student Directory
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/[0.05] text-[10px] text-slate-500 uppercase tracking-wider font-semibold">
                  <th className="pb-3 pl-2">Name</th>
                  <th className="pb-3">Email Address</th>
                  <th className="pb-3">Active Scanner Mode</th>
                  <th className="pb-3 text-right pr-2">Joined Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.03] text-xs">
                {recentUsers.filter((u) => u.role === "student").length > 0 ? (
                  recentUsers
                    .filter((u) => u.role === "student")
                    .map((u) => (
                      <tr key={u.id} className="hover:bg-white/[0.01] transition-colors">
                        <td className="py-3.5 pl-2 font-bold text-slate-200">{u.name || "—"}</td>
                        <td className="py-3.5 font-mono text-blue-400">{u.email}</td>
                        <td className="py-3.5">
                          <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold border ${
                            u.section === 'placement'
                              ? 'bg-orange-500/10 border-orange-500/25 text-orange-400'
                              : 'bg-teal-500/10 border-teal-500/25 text-teal-400'
                          }`}>
                            {(u.section || 'internship').toUpperCase()}
                          </span>
                        </td>
                        <td className="py-3.5 text-slate-400 text-right pr-2">
                          {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : "—"}
                        </td>
                      </tr>
                    ))
                ) : (
                  <tr>
                    <td colSpan="4" className="py-8 text-center text-slate-500 italic">
                      No registered student accounts yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {topUrls.length > 0 && (
          <div className="premium-card p-6 border border-white/[0.04]">
            <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider mb-4 flex items-center gap-2">
              <LinkIcon className="text-blue-400" size={16} /> Hot-Scan Domain Warnings
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-white/[0.05] text-[10px] text-slate-500 uppercase tracking-wider font-semibold">
                    <th className="pb-3 pl-2">Target Link / Domain</th>
                    <th className="pb-3 text-right pr-2">Times Audited</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.03] text-xs">
                  {topUrls.map((link, i) => (
                    <tr key={i} className="hover:bg-white/[0.01] transition-colors">
                      <td className="py-3.5 pl-2 font-mono text-blue-400 truncate max-w-lg">{link.url}</td>
                      <td className="py-3.5 text-right pr-2 font-bold text-slate-200">{link.count}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Global Diagnostic queue */}
        <div className="premium-card p-6 border border-white/[0.04]">
          <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider mb-4 flex items-center gap-2">
            <Activity className="text-purple-400" size={16} /> Global Live Scan Queue
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/[0.05] text-[10px] text-slate-500 uppercase tracking-wider font-semibold">
                  <th className="pb-3 pl-2">Target Object</th>
                  <th className="pb-3">Scan Date</th>
                  <th className="pb-3">Timestamp</th>
                  <th className="pb-3 text-right pr-2">Assessment Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.03] text-xs">
                {recentScans.length > 0 ? (
                  recentScans.map((item, i) => (
                    <tr key={i} className="hover:bg-white/[0.01] transition-colors">
                      <td className="py-3.5 pl-2 font-mono text-blue-400 truncate max-w-md">
                        {item.url ? (
                          <span className="flex items-center gap-1.5">
                            <span className="text-xs">🔗</span> {item.url}
                          </span>
                        ) : item.fileName ? (
                          <span className="flex items-center gap-1.5">
                            <span className="text-xs">📄</span> {item.fileName}
                          </span>
                        ) : (
                          <span className="flex items-center gap-1.5">
                            <span className="text-xs">📝</span> Plain Text Input
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 text-slate-300">{item.date}</td>
                      <td className="py-3.5 text-slate-400 font-mono">{item.time}</td>
                      <td className="py-3.5 text-right pr-2">
                        <span className="px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-bold text-[9px]">
                          VERIFIED
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="py-8 text-center text-slate-500 italic">
                      No system scans recorded yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Community scam log reports */}
        <div className="premium-card p-6 border border-white/[0.04]">
          <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider mb-4 flex items-center gap-2">
            <Flag className="text-red-400" size={16} /> Community Scam Threat Log
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/[0.05] text-[10px] text-slate-500 uppercase tracking-wider font-semibold">
                  <th className="pb-3 pl-2">Reported Entity</th>
                  <th className="pb-3">Threat Summary</th>
                  <th className="pb-3">Reporter Profile</th>
                  <th className="pb-3 text-right pr-2">Audit Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.03] text-xs">
                {stats?.recentReports && stats.recentReports.length > 0 ? (
                  stats.recentReports.map((report) => (
                    <tr key={report.id} className="hover:bg-white/[0.01] transition-colors">
                      <td className="py-3.5 pl-2 font-semibold text-slate-200">
                        {report.url ? (
                          <div className="flex flex-col gap-0.5">
                            <span className="text-blue-400 font-mono truncate max-w-xs">{report.url}</span>
                            {report.companyName && <span className="text-[10px] text-slate-500">{report.companyName}</span>}
                          </div>
                        ) : (
                          <span>{report.companyName || "Unknown Profile"}</span>
                        )}
                      </td>
                      <td className="py-3.5 text-slate-400 text-xs max-w-sm truncate" title={report.description}>
                        {report.description}
                      </td>
                      <td className="py-3.5 font-mono text-slate-500">{report.reporterEmail}</td>
                      <td className="py-3.5 text-right pr-2 text-slate-400">
                        <div className="flex flex-col text-[10px]">
                          <span>{report.date}</span>
                          <span className="text-[9px] text-slate-600 font-mono">{report.time}</span>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="py-8 text-center text-slate-500 italic">
                      Zero active community scam threats received.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  // --- STUDENT PORTAL VIEW ---
  return (
    <div className="p-6 md:p-8 min-h-screen bg-[#07070a] text-slate-100 animate-fade-in max-w-7xl mx-auto space-y-8">
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b border-white/[0.04]">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-blue-500">
            Student Safety Portal
          </h1>
          <p className="text-slate-400 text-xs mt-1.5">Welcome back, {user?.name || "Student"} (Registered Client)</p>
        </div>
        <div className="bg-teal-500/10 border border-teal-500/20 px-4 py-2 rounded-xl flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse" />
          <span className="text-teal-400 text-xs font-bold uppercase tracking-wider">
            Shield Active: {user?.section === 'placement' ? 'Placement Module' : 'Internship Module'}
          </span>
        </div>
      </div>

      {/* Grid summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="premium-card p-5 border-l-4 border-l-blue-500 border border-white/[0.04]">
          <div className="flex items-center gap-2.5 mb-2.5 text-slate-400">
            <FileSearch className="text-blue-400" size={18} />
            <span className="text-xs font-bold tracking-wider uppercase">Scans Run</span>
          </div>
          <p className="text-3xl font-black text-white">{stats?.totalScans ?? 0}</p>
          <p className="text-[10px] text-slate-500 mt-1">URLs and documents validated</p>
        </div>
        <div className="premium-card p-5 border-l-4 border-l-emerald-500 border border-white/[0.04]">
          <div className="flex items-center gap-2.5 mb-2.5 text-slate-400">
            <Activity className="text-emerald-400" size={18} />
            <span className="text-xs font-bold tracking-wider uppercase">Safe Checkpoints</span>
          </div>
          <p className="text-3xl font-black text-emerald-400">{stats?.safeScans ?? 0}</p>
          <p className="text-[10px] text-slate-500 mt-1">Verified legitimate sources</p>
        </div>
        <div className="premium-card p-5 border-l-4 border-l-yellow-500 border border-white/[0.04]">
          <div className="flex items-center gap-2.5 mb-2.5 text-slate-400">
            <AlertTriangle className="text-yellow-400" size={18} />
            <span className="text-xs font-bold tracking-wider uppercase">Warnings Logged</span>
          </div>
          <p className="text-3xl font-black text-yellow-400">{stats?.suspiciousScans ?? 0}</p>
          <p className="text-[10px] text-slate-500 mt-1">Suspicious scam indicators</p>
        </div>
        <div className="premium-card p-5 border-l-4 border-l-red-500 border border-white/[0.04]">
          <div className="flex items-center gap-2.5 mb-2.5 text-slate-400">
            <ShieldAlert className="text-red-400" size={18} />
            <span className="text-xs font-bold tracking-wider uppercase">Scams Avoided</span>
          </div>
          <p className="text-3xl font-black text-red-500">{stats?.scamScans ?? 0}</p>
          <p className="text-[10px] text-slate-500 mt-1">Confirmed fraudulent targets</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Personal histories */}
        <div className="lg:col-span-2 premium-card p-6 border border-white/[0.04]">
          <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider mb-4 flex items-center gap-2">
            <Activity className="text-blue-400" size={16} /> Personal Audit Logs
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/[0.05] text-[10px] text-slate-500 uppercase tracking-wider font-semibold">
                  <th className="pb-3 pl-2">Audit Target</th>
                  <th className="pb-3">Audit Date</th>
                  <th className="pb-3">Risk Assessment</th>
                  <th className="pb-3 text-right pr-2">Heuristic Score</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.03] text-xs">
                {stats?.recentScans && stats.recentScans.length > 0 ? (
                  stats.recentScans.map((scan) => (
                    <tr key={scan.id} className="hover:bg-white/[0.01] transition-colors">
                      <td className="py-3.5 pl-2 font-mono text-blue-400 max-w-xs truncate" title={scan.url || scan.fileName || 'Text Input'}>
                        {scan.url ? (
                          <span className="flex items-center gap-1">🔗 {scan.url}</span>
                        ) : scan.fileName ? (
                          <span className="flex items-center gap-1 text-purple-400">📄 {scan.fileName}</span>
                        ) : (
                          <span className="flex items-center gap-1 text-amber-400">📝 Plain Text Body</span>
                        )}
                      </td>
                      <td className="py-3.5 text-slate-400">{scan.date}</td>
                      <td className="py-3.5">
                        <span className={`px-2 py-0.5 rounded text-[9px] font-bold border ${
                          scan.verdict === 'safe'
                            ? 'bg-emerald-500/10 border-emerald-500/25 text-emerald-400'
                            : scan.verdict === 'suspicious'
                            ? 'bg-yellow-500/10 border-yellow-500/25 text-yellow-400'
                            : 'bg-red-500/10 border-red-500/25 text-red-400'
                        }`}>
                          {(scan.verdict || 'safe').toUpperCase()}
                        </span>
                      </td>
                      <td className="py-3.5 font-mono text-right pr-2 font-bold text-slate-200">{scan.score ?? 100}%</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="py-8 text-center text-slate-500 italic">
                      No scan histories found. Please audit an offer from the home screen first!
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Security guidelines */}
        <div className="premium-card p-6 border border-white/[0.04] space-y-6">
          <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
            <ShieldAlert className="text-teal-400" size={16} /> Campus Security Handbook
          </h3>
          <div className="space-y-4">
            <div className="flex items-start gap-3 p-3 bg-white/[0.01] border border-white/[0.04] rounded-xl hover:border-white/[0.08] transition-all">
              <span className="text-lg mt-0.5">💰</span>
              <div>
                <h4 className="font-bold text-xs text-slate-200">Zero Payment Rule</h4>
                <p className="text-[10px] text-slate-400 mt-1">Legitimate companies never request fees for certification kits or mandatory tools during hiring.</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-white/[0.01] border border-white/[0.04] rounded-xl hover:border-white/[0.08] transition-all">
              <span className="text-lg mt-0.5">📧</span>
              <div>
                <h4 className="font-bold text-xs text-slate-200">Verify Domains</h4>
                <p className="text-[10px] text-slate-400 mt-1">Cross-check the email suffix of your recruiters. Make sure it maps to official brand websites, not free services.</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-white/[0.01] border border-white/[0.04] rounded-xl hover:border-white/[0.08] transition-all">
              <span className="text-lg mt-0.5">💬</span>
              <div>
                <h4 className="font-bold text-xs text-slate-200">Insist on Interviews</h4>
                <p className="text-[10px] text-slate-400 mt-1">Scammers rely on chat-only channels and direct WhatsApp hires to avoid scrutiny. Refuse quick offers.</p>
              </div>
            </div>
          </div>
        </div>

        {/* User-contributed warnings */}
        <div className="lg:col-span-3 premium-card p-6 border border-white/[0.04]">
          <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider mb-4 flex items-center gap-2">
            <Flag className="text-red-400" size={16} /> Your Scam Threat Contributions
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/[0.05] text-[10px] text-slate-500 uppercase tracking-wider font-semibold">
                  <th className="pb-3 pl-2">Reported Entity</th>
                  <th className="pb-3">Threat Domain/URL</th>
                  <th className="pb-3">Identified Anomalies</th>
                  <th className="pb-3 text-right pr-2">Report Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.03] text-xs">
                {stats?.recentReports && stats.recentReports.length > 0 ? (
                  stats.recentReports.map((report) => (
                    <tr key={report.id} className="hover:bg-white/[0.01] transition-colors">
                      <td className="py-3.5 pl-2 font-bold text-slate-200">{report.companyName || 'Unknown Company'}</td>
                      <td className="py-3.5 font-mono text-blue-400 max-w-xs truncate" title={report.url}>
                        {report.url || '—'}
                      </td>
                      <td className="py-3.5 text-slate-400 text-xs max-w-sm truncate" title={report.description}>
                        {report.description}
                      </td>
                      <td className="py-3.5 text-right pr-2 text-slate-400 font-mono">
                        {report.date} - {report.time}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="py-8 text-center text-slate-500 italic">
                      You have not filed any threat reports. Help keep peers safe by reporting suspicious offers!
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;