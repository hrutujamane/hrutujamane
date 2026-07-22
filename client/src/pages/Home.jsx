import { useState } from 'react';
import axios from 'axios';
import MeshBackground from '../components/MeshBackground';
import AnalyzeForm from '../components/AnalyzeForm';
import AnalyzingLoader from '../components/AnalyzingLoader';
import ResultsCard from '../components/ResultsCard';
import FeatureStrip from '../components/FeatureStrip';
import { analyzeInternship } from '../api';
import { getUser } from '../utils/auth';

/**
 * Main Portal orchestrator page.
 * Distributes users to Internship Shield and Placement Verifier scanners.
 */
export default function Home() {
  const user = getUser();
  const [view, setView] = useState('form');
  const [result, setResult] = useState(null);
  const [activeSection, setActiveSection] = useState(user?.section || 'internship');
  
  const isPlacement = activeSection === 'placement';

  // Persist active verification section selection
  const handleModeChange = (newSection) => {
    setActiveSection(newSection);
    if (user) {
      const updatedUser = { ...user, section: newSection };
      localStorage.setItem('inplasheild_user', JSON.stringify(updatedUser));
      
      axios.post('/api/update-section', { section: newSection }, {
        headers: { 'x-user-email': user.email }
      })
      .catch(err => {
        console.error('Error synchronizing active module section:', err);
      });
    }
  };

  // Submit listing to target server analytics controllers
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
    <div className="relative min-h-screen flex flex-col bg-[#07070a] text-slate-100 overflow-x-hidden">
      {/* Dynamic Hybrid Connecting Particles and Dot Grid Backdrop */}
      <MeshBackground />

      <div className="relative z-10 flex flex-col flex-1">
        <main className="flex-1 flex flex-col items-center px-6 py-16">
          {/* Header titles */}
          {view !== 'results' && (
            <div className="text-center max-w-3xl mb-12 animate-fade-in">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.03] border border-white/[0.06] text-xs font-semibold text-slate-400 mb-6">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-ping" />
                <span>AI Risk Assessment Engine v2.4</span>
              </div>
              <h1 
                className="text-4xl md:text-5xl font-extrabold mb-5 tracking-tight leading-tight"
                style={{
                  background: isPlacement 
                    ? 'linear-gradient(135deg, #f97316 0%, #fdba74 100%)'
                    : 'linear-gradient(135deg, #2dd4bf 0%, #60a5fa 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                {isPlacement ? 'Detect Fake Placement Offers Instantly' : 'Detect Fake Internships Instantly'}
              </h1>
              <p className="text-sm md:text-base text-slate-400 max-w-xl mx-auto leading-relaxed">
                Analyze job descriptions, contract details, or listing links for scam signals, upfront fee requirements, and community threat reports.
              </p>
            </div>
          )}

          {/* Internship vs Placement selection switcher */}
          {view === 'form' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 w-full max-w-3xl mb-10">
              <div
                onClick={() => handleModeChange('internship')}
                className={`cursor-pointer p-6 rounded-2xl border transition-all duration-300 flex flex-col justify-between hover:scale-[1.01] hover:-translate-y-1 ${
                  !isPlacement
                    ? 'bg-teal-950/20 border-teal-500/40 shadow-lg shadow-teal-500/[0.02]'
                    : 'bg-white/[0.01] border-white/[0.05] hover:border-teal-500/20'
                }`}
              >
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <div className="bg-teal-500/10 p-2.5 rounded-xl border border-teal-500/20">
                      <span className="text-xl text-teal-400 block leading-none">🎓</span>
                    </div>
                    <span className={`text-[9px] tracking-wider uppercase font-bold px-2.5 py-1 rounded-full ${
                      !isPlacement ? 'bg-teal-500/10 border border-teal-500/35 text-teal-400' : 'bg-white/[0.04] text-slate-500'
                    }`}>
                      {!isPlacement ? 'Active Scanner' : 'Select'}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-slate-100 mb-1.5">Internship Scam Shield</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Verify virtual internships, student offers, or training programs. Checks for upfront certificate fees, course-buying scams, and suspicious domains.
                  </p>
                </div>
                <div className={`mt-5 flex items-center gap-1 text-[10px] font-bold tracking-wider ${!isPlacement ? 'text-teal-400' : 'text-slate-500'}`}>
                  {!isPlacement ? '🛡️ SCANNER SELECTED' : 'ACTIVATE SCANNER →'}
                </div>
              </div>

              <div
                onClick={() => handleModeChange('placement')}
                className={`cursor-pointer p-6 rounded-2xl border transition-all duration-300 flex flex-col justify-between hover:scale-[1.01] hover:-translate-y-1 ${
                  isPlacement
                    ? 'bg-orange-500/10 border-orange-500/40 shadow-lg shadow-orange-500/[0.02]'
                    : 'bg-white/[0.01] border-white/[0.05] hover:border-orange-500/20'
                }`}
              >
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <div className="bg-orange-500/10 p-2.5 rounded-xl border border-orange-500/20">
                      <span className="text-xl text-orange-400 block leading-none">💼</span>
                    </div>
                    <span className={`text-[9px] tracking-wider uppercase font-bold px-2.5 py-1 rounded-full ${
                      isPlacement ? 'bg-orange-500/10 border border-orange-500/35 text-orange-400' : 'bg-white/[0.04] text-slate-500'
                    }`}>
                      {isPlacement ? 'Active Scanner' : 'Select'}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-slate-100 mb-1.5">Placement Offer Verifier</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Validate full-time contract offers and recruitment links. Identifies fake HR domains, contract processing fees, and unrealistic salary packages.
                  </p>
                </div>
                <div className={`mt-5 flex items-center gap-1 text-[10px] font-bold tracking-wider ${isPlacement ? 'text-orange-400' : 'text-slate-500'}`}>
                  {isPlacement ? '🛡️ SCANNER SELECTED' : 'ACTIVATE SCANNER →'}
                </div>
              </div>
            </div>
          )}

          {/* Form and loader switcher */}
          <div className="w-full max-w-3xl">
            {view === 'form' && (
              <>
                <AnalyzeForm onSubmit={handleSubmit} isLoading={false} isPlacement={isPlacement} />
                <FeatureStrip />
                
                <section id="how-it-works" className="py-16 border-t border-white/[0.05] mt-8">
                  <h2 className="text-2xl font-bold mb-8 text-center text-slate-100">Verification Steps</h2>
                  <div className="grid md:grid-cols-3 gap-6">
                    <div className="p-6 bg-white/[0.01] border border-white/[0.05] rounded-2xl hover:border-white/[0.1] transition-all">
                      <div className="text-blue-400 text-xs font-bold mb-3 tracking-wider uppercase">Phase 01</div>
                      <h3 className="font-bold text-base text-slate-200 mb-2">Ingestion</h3>
                      <p className="text-xs text-slate-400 leading-relaxed">Scrapes the specified job listing URL or parses plain text/PDF descriptions.</p>
                    </div>
                    <div className="p-6 bg-white/[0.01] border border-white/[0.05] rounded-2xl hover:border-white/[0.1] transition-all">
                      <div className="text-purple-400 text-xs font-bold mb-3 tracking-wider uppercase">Phase 02</div>
                      <h3 className="font-bold text-base text-slate-200 mb-2">Analysis</h3>
                      <p className="text-xs text-slate-400 leading-relaxed">Runs algorithmic validation check-ups, keyword tests, and domain authenticity lookups.</p>
                    </div>
                    <div className="p-6 bg-white/[0.01] border border-white/[0.05] rounded-2xl hover:border-white/[0.1] transition-all">
                      <div className="text-pink-400 text-xs font-bold mb-3 tracking-wider uppercase">Phase 03</div>
                      <h3 className="font-bold text-base text-slate-200 mb-2">Threat score</h3>
                      <p className="text-xs text-slate-400 leading-relaxed">Outputs a detailed trust rating, lists flagged concerns, and suggests secure countermeasures.</p>
                    </div>
                  </div>
                </section>
              </>
            )}

            {view === 'loading' && <AnalyzingLoader />}
            {view === 'results' && result && <ResultsCard result={result} onReset={() => setView('form')} />}
          </div>
        </main>

        {/* Support Helpdesk footer */}
        <footer className="mt-auto py-10 border-t border-white/[0.04] bg-slate-950/20 text-center relative z-10">
          <div className="max-w-3xl mx-auto px-6">
            <h3 className="text-sm font-semibold text-slate-300 mb-1.5">Team NEXUS Support Desk</h3>
            <p className="text-slate-400 text-xs mb-6 max-w-md mx-auto leading-relaxed">
              Have doubts about an evaluation or spotted an issue? Reach our technical engineering team.
            </p>
            <div className="flex flex-wrap justify-center gap-x-8 gap-y-3 mb-6">
              <div className="flex items-center gap-2 text-xs text-slate-300">
                <span className="text-blue-400">📧</span>
                <span>nexus.support@sitrc.edu.in</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-300">
                <span className="text-blue-400">📍</span>
                <span>SITRC, Nashik</span>
              </div>
            </div>
            <p className="text-[10px] text-slate-600 uppercase tracking-widest font-bold">
              © {new Date().getFullYear()} InplaSheild — Made by Team NEXUS
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}