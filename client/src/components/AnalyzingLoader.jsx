import { useEffect, useState, useRef } from 'react';
import { Terminal, Shield, RefreshCw } from 'lucide-react';
import { getUser } from '../utils/auth';

// Simulated step-by-step diagnostic audit log messages
const LOG_MESSAGES = [
  { text: 'Initializing scanner subsystem...', type: 'info', delay: 200 },
  { text: 'Establishing secure request tunnel...', type: 'info', delay: 600 },
  { text: 'API Gateway status: CONNECTED', type: 'success', delay: 1000 },
  { text: 'Extracting listing text buffer...', type: 'info', delay: 1500 },
  { text: 'Detecting document language & encoding: UTF-8', type: 'info', delay: 1800 },
  { text: 'Running heuristic scanning rules...', type: 'info', delay: 2200 },
  { text: 'RULE_01 [Upfront Fees]: Scanning description keywords...', type: 'info', delay: 2600 },
  { text: 'RULE_02 [Impersonation]: Checking domain records...', type: 'info', delay: 3000 },
  { text: 'RULE_03 [Urgency]: Checking direct selection indicators...', type: 'info', delay: 3400 },
  { text: 'Scanning complete. Found potential red flags...', type: 'warn', delay: 4200 },
  { text: 'Querying local database reports for matches...', type: 'info', delay: 4800 },
  { text: 'Comparing target with reported scam profiles...', type: 'info', delay: 5300 },
  { text: 'Found 0 direct domain blacklist matches', type: 'success', delay: 5800 },
  { text: 'Evaluating community warning thresholds...', type: 'info', delay: 6400 },
  { text: 'Computing final risk coefficients...', type: 'info', delay: 7000 },
  { text: 'Applying trust score weight matrix...', type: 'info', delay: 7600 },
  { text: 'Rendering safety assessment report card...', type: 'success', delay: 8200 },
  { text: 'Redirection to audit reports...', type: 'success', delay: 8800 }
];

export default function AnalyzingLoader() {
  const [logs, setLogs] = useState([]);
  const [progress, setProgress] = useState(0);
  const consoleEndRef = useRef(null);
  
  const user = getUser();
  const isPlacement = user?.section === 'placement';

  // Output logs step-by-step
  useEffect(() => {
    const timers = [];
    
    LOG_MESSAGES.forEach((msg) => {
      const t = setTimeout(() => {
        const timeStr = new Date().toLocaleTimeString().split(' ')[0];
        setLogs((prev) => [...prev, { ...msg, timestamp: timeStr }]);
      }, msg.delay);
      timers.push(t);
    });

    return () => timers.forEach(clearTimeout);
  }, []);

  // Update progress bar percentage
  useEffect(() => {
    let start = null;
    const totalDuration = 9000;

    const animate = (ts) => {
      if (!start) start = ts;
      const elapsed = ts - start;
      const pct = Math.min((elapsed / totalDuration) * 100, 100);
      setProgress(Math.round(pct));
      if (pct < 100) requestAnimationFrame(animate);
    };

    const raf = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(raf);
  }, []);

  // Autoscroll terminal shell
  useEffect(() => {
    consoleEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6 animate-fade-in">
      <div className="text-center">
        <div className="inline-flex items-center justify-center p-3.5 bg-blue-500/10 border border-blue-500/20 rounded-full text-blue-400 mb-4 animate-spin" style={{ animationDuration: '3s' }}>
          <RefreshCw size={24} />
        </div>
        <h2 className="text-xl font-bold text-slate-100">
          {isPlacement ? 'Auditing Placement Contract' : 'Auditing Internship Listing'}
        </h2>
        <p className="text-xs text-slate-400 mt-1">Please stand by. Evaluating risk parameters...</p>
      </div>

      {/* Progress Card */}
      <div className="premium-card p-5 border border-white/[0.04] bg-[#0c0c12]/40">
        <div className="flex justify-between items-center text-xs text-slate-400 mb-2.5">
          <span className="font-semibold">Analysis Progress</span>
          <span className="font-mono text-blue-400 font-bold">{progress}%</span>
        </div>
        <div className="h-2 bg-slate-900 border border-white/[0.05] rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Monospace Console Stream */}
      <div className="console-container border border-white/[0.06]">
        <div className="console-header bg-slate-950/60 px-4 py-2 text-xs flex justify-between items-center text-slate-400">
          <div className="flex items-center gap-2">
            <Terminal size={12} className="text-blue-500" />
            <span className="font-mono font-bold uppercase tracking-wider text-slate-300">security_logs_stream.sh</span>
          </div>
          <div className="flex items-center gap-1.5 font-mono text-[10px]">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>HEURISTIC ENGINE ACTIVE</span>
          </div>
        </div>
        
        <div className="console-body h-64 font-mono text-xs overflow-y-auto bg-slate-950/80 p-4 space-y-2">
          {logs.map((log, idx) => (
            <div key={idx} className="flex gap-2.5 items-start">
              <span className="text-slate-600 select-none">[{log.timestamp}]</span>
              <span className={`font-bold ${
                log.type === 'success' ? 'text-emerald-400' :
                log.type === 'warn' ? 'text-amber-400' :
                log.type === 'error' ? 'text-red-400' : 'text-blue-400'
              }`}>
                [{log.type.toUpperCase()}]
              </span>
              <span className="text-slate-300">{log.text}</span>
            </div>
          ))}
          {logs.length < LOG_MESSAGES.length && (
            <div className="flex gap-2.5 items-center text-blue-400/80 animate-pulse">
              <span className="text-slate-600 select-none">[..:..:..]</span>
              <span className="font-bold">[RUNNING]</span>
              <span className="cursor-blink">Evaluating rules</span>
            </div>
          )}
          <div ref={consoleEndRef} />
        </div>
      </div>
    </div>
  );
}
