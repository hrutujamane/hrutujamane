import { useState } from 'react';
import { UserCircle, ShieldCheck, Search, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import MeshBackground from '../components/MeshBackground';
import AnalyzeForm from '../components/AnalyzeForm';
import AnalyzingLoader from '../components/AnalyzingLoader';
import ResultsCard from '../components/ResultsCard';
import FeatureStrip from '../components/FeatureStrip';
import { analyzeInternship } from '../api';

export default function Home() {
  const [view, setView] = useState('form');
  const [result, setResult] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (payload) => {
    setView('loading');
    try {
      const data = await analyzeInternship(payload);
      setResult(data);
      setView('results');
    } catch (err) {
      setView('form');
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col transition-colors duration-300">
      <MeshBackground />

      <div className="relative z-10 flex flex-col flex-1">
        {/* --- RESTORED NAVBAR WITH LOGO & ADMIN ICON --- */}
        <nav className="flex justify-between items-center px-8 py-6 border-b transition-colors duration-300" style={{ borderColor: 'var(--glass-border)', background: 'var(--nav-bg)' }}>
          <div className="flex items-center gap-3">
            {/* THE ORIGINAL LOGO */}
            
           
          </div>
          
          
        </nav>

        <main className="flex-1 flex flex-col items-center px-4 py-12">
          {/* HERO SECTION */}
          {view !== 'results' && (
            <div className="text-center mb-12 fade-in">
              <h1 
                className="text-5xl md:text-6xl font-black mb-6 tracking-tight"
                style={{
                  background: 'linear-gradient(135deg, #60a5fa 0%, #a78bfa 50%, #60a5fa 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                Detect Fake Internships Instantly
              </h1>
              <p style={{ color: 'var(--text-muted)' }} className="text-lg max-w-2xl mx-auto leading-relaxed">
                Paste a listing or URL and our AI will scan it for scam signals, red flags, and
                community reports in seconds.
              </p>
            </div>
          )}

          {/* ANALYZER COMPONENT */}
          <div className="w-full max-w-4xl">
            {view === 'form' && (
              <>
                <AnalyzeForm onSubmit={handleSubmit} isLoading={false} />
                <FeatureStrip />
                
                {/* HOW IT WORKS SECTION */}
                <section id="how-it-works" className="py-20 px-6 border-t border-white/5 mt-16">
                  <h2 className="text-3xl font-bold mb-10 text-center transition-colors">How InplaSheild Works</h2>
                  <div className="grid md:grid-cols-3 gap-8 text-center">
                    <div className="p-8 bg-white/5 rounded-3xl border border-white/10 hover:border-blue-500/30 transition-all">
                      <div className="text-blue-400 text-sm font-bold mb-4 uppercase">Step 01</div>
                      <h3 className="font-bold text-xl mb-3">Data Ingestion</h3>
                      <p style={{ color: 'var(--text-muted)' }} className="text-sm">Our AI scans the URL or text for common scam signatures.</p>
                    </div>
                    <div className="p-8 bg-white/5 rounded-3xl border border-white/10 hover:border-purple-500/30 transition-all">
                      <div className="text-purple-400 text-sm font-bold mb-4 uppercase">Step 02</div>
                      <h3 className="font-bold text-xl mb-3">Pattern Analysis</h3>
                      <p style={{ color: 'var(--text-muted)' }} className="text-sm">Cross-referencing known fraudulent company behaviors.</p>
                    </div>
                    <div className="p-8 bg-white/5 rounded-3xl border border-white/10 hover:border-pink-500/30 transition-all">
                      <div className="text-pink-400 text-sm font-bold mb-4 uppercase">Step 03</div>
                      <h3 className="font-bold text-xl mb-3">Trust Rating</h3>
                      <p style={{ color: 'var(--text-muted)' }} className="text-sm">Receive a risk score and identified red flags instantly.</p>
                    </div>
                  </div>
                </section>
              </>
            )}

            {view === 'loading' && <AnalyzingLoader />}
            {view === 'results' && result && <ResultsCard result={result} onReset={() => setView('form')} />}
          </div>
        </main>

        {/* TEAM NEXUS CONSOLIDATED FOOTER */}
        <footer className="mt-auto py-12 border-t border-slate-800/40 relative z-10 text-center bg-slate-950/50">
          <div className="max-w-4xl mx-auto px-4">
            <h3 className="text-lg font-semibold text-blue-400 mb-2">Team NEXUS Help Desk</h3>
            <p className="text-gray-400 text-sm mb-8">
              Spotted a false positive or need to verify your company? Reach out to our engineering team.
            </p>
            <div className="flex flex-wrap justify-center gap-10 mb-8">
              <div className="flex items-center gap-3">
                <span className="text-blue-400 font-bold">📧</span>
                <span className="text-gray-300 text-sm font-medium">nexus.support@sitrc.edu.in</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-blue-400 font-bold">📍</span>
                <span className="text-gray-300 text-sm font-medium">SITRC, Nashik</span>
              </div>
            </div>
            <p className="text-[10px] text-slate-600 uppercase tracking-widest font-bold">
              © {new Date().getFullYear()} InplaSheild — Built with 💙 by Team NEXUS
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}