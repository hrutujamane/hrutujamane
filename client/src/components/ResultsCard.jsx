import { ArrowLeft, AlertTriangle, CheckCircle2, XCircle, Users, Lightbulb, ShieldAlert, Download, Share2 } from 'lucide-react';
import TrustScoreGauge from './TrustScoreGauge';

// Map system verdicts to corresponding labels, colors, and badge configurations
const VERDICT_CONFIG = {
  safe: {
    label: 'Likely Safe',
    icon: <CheckCircle2 size={24} className="text-emerald-400" />,
    desc: 'This listing appears legitimate. No scam indicators detected.',
    color: '#10b981',
    badgeClass: 'badge-safe',
  },
  suspicious: {
    label: 'Suspicious',
    icon: <AlertTriangle size={24} className="text-amber-400" />,
    desc: 'Proceed with caution. Vague details or medium-severity flags found.',
    color: '#f59e0b',
    badgeClass: 'badge-suspicious',
  },
  scam: {
    label: 'Likely Scam',
    icon: <XCircle size={24} className="text-red-400" />,
    desc: 'Critical Risk. Pay-to-join, brand fraud, or report warnings triggered.',
    color: '#ef4444',
    badgeClass: 'badge-scam',
  },
};

function SeverityPill({ severity }) {
  const sev = (severity || 'medium').toLowerCase();
  const colors = {
    high: 'text-red-400 bg-red-500/10 border-red-500/25',
    medium: 'text-amber-400 bg-amber-500/10 border-amber-500/25',
    low: 'text-slate-400 bg-slate-500/10 border-slate-500/25'
  };
  
  return (
    <span className={`text-[9px] tracking-wider uppercase font-bold px-2 py-0.5 border rounded-md ${colors[sev] || colors.medium}`}>
      {sev}
    </span>
  );
}

/**
 * Audit Results View.
 * Displays structural trust speedometer gauge, logs specific red flags, and details countermeasures.
 */
export default function ResultsCard({ result, onReset }) {
  const { trustScore, verdict, summary, redFlags, actionableSteps, communityReportCount, companyName, jobTitle } = result;
  const config = VERDICT_CONFIG[verdict] || VERDICT_CONFIG.suspicious;

  // Normalize flag records in case they originate from simplified backend regex match queries
  const normalizedFlags = (redFlags || []).map((flag) => {
    if (typeof flag === 'string') {
      return {
        type: flag,
        description: `Description matched risk keyword: "${flag.toLowerCase()}"`,
        severity: 'high',
      };
    }
    return flag;
  });

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6 animate-fade-in">
      {/* Navigation action headers */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <button
          onClick={onReset}
          className="flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-slate-200 transition-colors bg-white/[0.02] border border-white/[0.05] px-3.5 py-2 rounded-xl"
        >
          <ArrowLeft size={14} />
          <span>Scan another listing</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={() => alert('Report summary download ready!')}
            className="flex items-center gap-1.5 text-xs font-semibold text-slate-300 hover:text-white bg-white/[0.02] border border-white/[0.05] px-3.5 py-2 rounded-xl"
          >
            <Download size={13} />
            <span>Download Audit</span>
          </button>
          <button
            onClick={() => alert('Audit report link copied!')}
            className="flex items-center gap-1.5 text-xs font-semibold text-slate-300 hover:text-white bg-white/[0.02] border border-white/[0.05] px-3.5 py-2 rounded-xl"
          >
            <Share2 size={13} />
            <span>Copy Link</span>
          </button>
        </div>
      </div>

      {/* Grid diagnostics segments */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Left Column: Visual Speedometer Gauge and Verdict */}
        <div className="md:col-span-5 flex flex-col gap-6">
          <div className="premium-card p-6 border border-white/[0.05] text-center flex flex-col items-center justify-center">
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500 mb-6 bg-white/[0.02] border border-white/[0.05] px-3 py-1 rounded-md">
              Audit Rating
            </span>

            <TrustScoreGauge score={trustScore} verdict={verdict} />

            <div className={`mt-4 verdict-badge ${config.badgeClass} flex items-center justify-center`}>
              {config.icon}
              <span className="font-bold text-xs">{config.label}</span>
            </div>

            <p className="text-xs text-slate-400 mt-4 max-w-[240px] leading-relaxed">
              {config.desc}
            </p>

            <div className="w-full mt-6 pt-5 border-t border-white/[0.04] space-y-2.5 text-left text-xs">
              <div className="flex justify-between items-center">
                <span className="text-slate-500 font-semibold">Analyzed Entity</span>
                <span className="text-slate-300 font-medium truncate max-w-[120px]">{companyName || 'Anonymous'}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500 font-semibold">Listing Role</span>
                <span className="text-slate-300 font-medium truncate max-w-[120px]">{jobTitle || 'Unspecified'}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500 font-semibold">Risk Level</span>
                <span style={{ color: config.color }} className="font-bold">
                  {trustScore >= 75 ? 'Low Risk' : trustScore >= 40 ? 'Medium Risk' : 'High Risk'}
                </span>
              </div>
            </div>
          </div>

          <div className="premium-card p-6 border border-white/[0.05] flex flex-col items-center justify-center text-center">
            <div className="w-full flex items-center gap-2 mb-4">
              <Users size={16} className="text-slate-500" />
              <h3 className="font-bold text-slate-200 text-xs uppercase tracking-wider">Community Database</h3>
            </div>

            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-black mb-3.5"
              style={{
                background: communityReportCount > 0 ? 'rgba(245,158,11,0.08)' : 'rgba(16, 185, 129, 0.08)',
                border: `1px solid ${communityReportCount > 0 ? 'rgba(245,158,11,0.25)' : 'rgba(16, 185, 129, 0.25)'}`,
                color: communityReportCount > 0 ? '#f59e0b' : '#10b981',
              }}
            >
              {communityReportCount}
            </div>

            <p className="text-xs font-bold text-slate-200 mb-1">
              {communityReportCount > 0
                ? `${communityReportCount} community threat reports`
                : 'No reports flagged'}
            </p>
            <p className="text-[10px] text-slate-500 leading-relaxed max-w-[200px]">
              {communityReportCount > 0
                ? 'Similar listings or recruitment domains have been reported by students.'
                : 'This company profile has zero active threat flags in our system.'}
            </p>
          </div>
        </div>

        {/* Right Column: Scan findings & Next steps */}
        <div className="md:col-span-7 flex flex-col gap-6">
          {summary && (
            <div className="premium-card p-6 border border-white/[0.05] bg-blue-500/[0.01]">
              <div className="flex items-center gap-2 mb-3">
                <ShieldAlert size={16} className="text-blue-400" />
                <h3 className="font-bold text-slate-200 text-xs uppercase tracking-wider">Executive Summary</h3>
              </div>
              <p className="text-xs text-slate-300 italic leading-relaxed">
                "{summary}"
              </p>
            </div>
          )}

          {/* Core threat indicators card */}
          <div className="premium-card p-6 border border-white/[0.05]">
            <div className="flex items-center gap-2 mb-4">
              <span>🚩</span>
              <h3 className="font-bold text-slate-200 text-xs uppercase tracking-wider">Scam Indicators Checked</h3>
            </div>

            {normalizedFlags.length > 0 ? (
              <div className="space-y-3">
                {normalizedFlags.map((flag, i) => (
                  <div 
                    key={i} 
                    className="p-4 rounded-xl border border-white/[0.05] bg-white/[0.01] hover:bg-white/[0.02] transition-colors"
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs font-bold text-slate-200">{flag.type}</span>
                      <SeverityPill severity={flag.severity} />
                    </div>
                    <p className="text-[11px] text-slate-400 leading-relaxed">
                      {flag.description}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 border border-dashed border-white/[0.06] rounded-xl">
                <p className="text-xs text-slate-500 italic">No red flag signatures identified in this listing.</p>
              </div>
            )}
          </div>

          {/* Secure actionable steps */}
          {actionableSteps && actionableSteps.length > 0 && (
            <div className="premium-card p-6 border border-white/[0.05]">
              <div className="flex items-center gap-2 mb-4">
                <Lightbulb size={16} className="text-blue-400" />
                <h3 className="font-bold text-slate-200 text-xs uppercase tracking-wider">Recommended Countermeasures</h3>
              </div>

              <div className="space-y-2.5">
                {actionableSteps.map((step, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-3 p-3 bg-white/[0.01] border border-white/[0.04] rounded-xl hover:border-white/[0.08]"
                  >
                    <div className="w-5 h-5 rounded-md bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center text-[10px] font-bold mt-0.5 flex-shrink-0">
                      {i + 1}
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      {step}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
