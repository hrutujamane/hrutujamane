import { useState, useRef } from 'react';
import {
  AlignLeft,
  Link,
  Upload,
  ShieldCheck,
  Search,
  ChevronRight,
} from 'lucide-react';

export default function AnalyzeForm({ onSubmit, isLoading }) {
  const [activeTab, setActiveTab] = useState('text'); // 'text' | 'url'
  const [companyName, setCompanyName] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [listingText, setListingText] = useState('');
  const [listingUrl, setListingUrl] = useState('');
  const [uploadedFileName, setUploadedFileName] = useState('');
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  const handleSubmit = () => {
    setError('');

    if (activeTab === 'text' && listingText.trim().length < 30) {
      setError('Please paste at least a short description of the internship (30+ characters).');
      return;
    }
    if (activeTab === 'url' && !listingUrl.trim()) {
      setError('Please enter a valid URL to the internship listing.');
      return;
    }
    if (activeTab === 'url') {
      try { new URL(listingUrl.trim()); }
      catch { setError('Please enter a valid URL including https://'); return; }
    }

    onSubmit({
      inputType: activeTab,
      companyName: companyName.trim(),
      jobTitle: jobTitle.trim(),
      listingText: activeTab === 'text' ? listingText.trim() : undefined,
      listingUrl: activeTab === 'url' ? listingUrl.trim() : undefined,
      fileName: activeTab === 'text' ? uploadedFileName : undefined,
    });
  };

  const handlePdfUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploadedFileName(file.name);
    // Read PDF as text via FileReader (basic extraction)
    const reader = new FileReader();
    reader.onload = () => {
      // Simple approach: insert filename as placeholder; real PDF parsing needs server
      setListingText(`[PDF: ${file.name}] — PDF text extraction requires server-side parsing. Please copy and paste the text manually.`);
    };
    reader.readAsText(file);
  };

  return (
    <div className="glass-card p-6 w-full max-w-3xl mx-auto shadow-2xl">
      {/* ── Tab Switcher ─────────────────────────── */}
      <div className="flex gap-2 mb-6">
        <button
          className={`tab-btn ${activeTab === 'text' ? 'active' : 'inactive'}`}
          onClick={() => { setActiveTab('text'); setError(''); }}
          disabled={isLoading}
        >
          <AlignLeft size={15} />
          Paste Text
        </button>
        <button
          className={`tab-btn ${activeTab === 'url' ? 'active' : 'inactive'}`}
          onClick={() => { setActiveTab('url'); setError(''); }}
          disabled={isLoading}
        >
          <Link size={15} />
          Paste URL
        </button>
      </div>

      {/* ── Company + Job Row ─────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
        <div>
          <label className="block text-sm font-semibold text-slate-300 mb-2">
            Company Name <span className="text-slate-500 font-normal">(Optional)</span>
          </label>
          <input
            type="text"
            className="input-field"
            placeholder="e.g. Acme Corp"
            value={companyName}
            onChange={e => setCompanyName(e.target.value)}
            disabled={isLoading}
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-slate-300 mb-2">
            Job Title <span className="text-slate-500 font-normal">(Optional)</span>
          </label>
          <input
            type="text"
            className="input-field"
            placeholder="e.g. Software Engineering Intern"
            value={jobTitle}
            onChange={e => setJobTitle(e.target.value)}
            disabled={isLoading}
          />
        </div>
      </div>

      {/* ── Main Input ────────────────────────────── */}
      {activeTab === 'text' ? (
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="flex items-center gap-2 text-sm font-semibold text-slate-300">
              <span style={{ color: '#3b82f6' }}>🔍</span>
              Internship Description / Listing Text
            </label>
            <button
              type="button"
              className="flex items-center gap-1.5 text-xs text-blue-400 hover:text-blue-300 transition-colors"
              onClick={() => fileInputRef.current?.click()}
              disabled={isLoading}
            >
              <Upload size={13} />
              Upload PDF instead
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.txt"
              className="hidden"
              onChange={handlePdfUpload}
            />
          </div>
          <textarea
            className="input-field resize-y"
            style={{ minHeight: '180px' }}
            placeholder="Paste the full job description here... or upload a PDF above to auto-fill this field."
            value={listingText}
            onChange={e => {
              const val = e.target.value;
              setListingText(val);
              if (!val.includes('[PDF:')) {
                setUploadedFileName('');
              }
            }}
            disabled={isLoading}
          />
        </div>
      ) : (
        <div>
          <label className="flex items-center gap-2 text-sm font-semibold text-slate-300 mb-2">
            <span style={{ color: '#3b82f6' }}>🔗</span>
            Internship Listing URL
          </label>
          <div className="relative">
            <Link
              size={15}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
            />
            <input
              type="url"
              className="input-field"
              style={{ paddingLeft: '36px' }}
              placeholder="https://example.com/internship-listing"
              value={listingUrl}
              onChange={e => setListingUrl(e.target.value)}
              disabled={isLoading}
            />
          </div>
          <p className="mt-2 text-xs text-slate-500">
            We'll fetch and extract the listing text automatically. Works with most job boards.
          </p>
        </div>
      )}

      {/* ── Error ─────────────────────────────────── */}
      {error && (
        <div className="mt-3 text-sm text-red-400 flex items-center gap-2">
          <span>⚠️</span> {error}
        </div>
      )}

      {/* ── Footer Bar ────────────────────────────── */}
      <div className="flex items-center justify-between mt-6">
        <div className="flex items-center gap-2 text-sm text-slate-400">
          <ShieldCheck size={16} className="text-green-400" />
          Private &amp; Secure Analysis
        </div>
        <button
          className="btn-analyze"
          onClick={handleSubmit}
          disabled={isLoading}
        >
          <Search size={18} />
          Analyze Now
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}
