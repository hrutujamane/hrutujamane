import { useState, useRef } from 'react';
import {
  AlignLeft,
  Link as LinkIcon,
  Upload,
  ShieldCheck,
  Search,
  ChevronRight,
  FileText,
  X,
} from 'lucide-react';
import { getUser } from '../utils/auth';

/**
 * Scanner Form element.
 * Manages tab toggles (pasted text vs scraped link) and parses PDF/TXT attachments.
 */
export default function AnalyzeForm({ onSubmit, isLoading, isPlacement: propIsPlacement }) {
  const [activeTab, setActiveTab] = useState('text');
  const [companyName, setCompanyName] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [listingText, setListingText] = useState('');
  const [listingUrl, setListingUrl] = useState('');
  const [uploadedFileName, setUploadedFileName] = useState('');
  const [pdfBase64, setPdfBase64] = useState('');
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);
  const [dragActive, setDragActive] = useState(false);

  const user = getUser();
  const isPlacement = propIsPlacement !== undefined ? propIsPlacement : user?.section === 'placement';

  // Handle submit and perform validation checkups
  const handleSubmit = () => {
    setError('');

    if (activeTab === 'text' && listingText.trim().length < 30) {
      setError(`Please paste at least a short description of the ${isPlacement ? 'placement' : 'internship'} (30+ characters).`);
      return;
    }
    if (activeTab === 'url' && !listingUrl.trim()) {
      setError(`Please enter a valid URL to the ${isPlacement ? 'placement' : 'internship'} listing.`);
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
      pdfBase64: activeTab === 'text' && uploadedFileName ? pdfBase64 : undefined,
    });
  };

  // Convert uploaded document to base64
  const handlePdfUpload = (file) => {
    if (!file) return;
    if (!file.name.endsWith('.pdf') && !file.name.endsWith('.txt')) {
      setError('Please upload a PDF or TXT file only.');
      return;
    }
    
    setUploadedFileName(file.name);
    setError('');
    
    const reader = new FileReader();
    reader.onload = () => {
      setPdfBase64(reader.result);
      setListingText(`[PDF Uploaded: ${file.name}] — Document content loaded. Please click "Analyze Now" below to scan.`);
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    handlePdfUpload(file);
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handlePdfUpload(e.dataTransfer.files[0]);
    }
  };

  const removeFile = () => {
    setUploadedFileName('');
    setPdfBase64('');
    setListingText('');
  };

  return (
    <div className="premium-card p-6 md:p-8 w-full border border-white/[0.04] shadow-2xl relative">
      {/* Tab controls */}
      <div className="mb-6 flex justify-between items-center">
        <div className="tabs-container">
          <button
            type="button"
            className={`tab-pill ${activeTab === 'text' ? 'active' : 'inactive'}`}
            onClick={() => { setActiveTab('text'); setError(''); }}
            disabled={isLoading}
          >
            <div className="flex items-center gap-1.5">
              <AlignLeft size={13} />
              <span>Paste Details / File</span>
            </div>
          </button>
          <button
            type="button"
            className={`tab-pill ${activeTab === 'url' ? 'active' : 'inactive'}`}
            onClick={() => { setActiveTab('url'); setError(''); }}
            disabled={isLoading}
          >
            <div className="flex items-center gap-1.5">
              <LinkIcon size={13} />
              <span>Analyze URL Link</span>
            </div>
          </button>
        </div>

        <div className="text-[10px] uppercase font-bold tracking-wider text-slate-500 bg-white/[0.02] border border-white/[0.05] px-2.5 py-1 rounded-md">
          {isPlacement ? 'Module: Placement' : 'Module: Internship'}
        </div>
      </div>

      {/* Target parameters */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
        <div>
          <label className="block text-xs font-semibold text-slate-400 mb-2">
            Company Name <span className="text-slate-500 font-normal">(Optional)</span>
          </label>
          <input
            type="text"
            className="w-full input-premium"
            placeholder="e.g. Acme Corp"
            value={companyName}
            onChange={e => setCompanyName(e.target.value)}
            disabled={isLoading}
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-400 mb-2">
            Job Title <span className="text-slate-500 font-normal">(Optional)</span>
          </label>
          <input
            type="text"
            className="w-full input-premium"
            placeholder={isPlacement ? "e.g. Associate Engineer" : "e.g. Web Development Intern"}
            value={jobTitle}
            onChange={e => setJobTitle(e.target.value)}
            disabled={isLoading}
          />
        </div>
      </div>

      {/* Main text input / dragzone */}
      {activeTab === 'text' ? (
        <div className="space-y-3">
          <label className="block text-xs font-semibold text-slate-400">
            {isPlacement ? 'Placement Offer Details or Contract Text' : 'Internship Job Description / Invitation Text'}
          </label>
          
          {!uploadedFileName ? (
            <div 
              onDragEnter={handleDrag}
              onDragOver={handleDrag}
              onDragLeave={handleDrag}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-200 flex flex-col items-center gap-3 ${
                dragActive 
                  ? 'border-blue-500 bg-blue-500/5' 
                  : 'border-white/[0.06] bg-white/[0.01] hover:border-white/[0.12] hover:bg-white/[0.02]'
              }`}
            >
              <div className="bg-white/[0.03] p-3 rounded-xl border border-white/[0.06] text-slate-400">
                <Upload size={20} />
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-200">
                  Drag and drop your PDF/TXT here, or <span className="text-blue-400">browse file</span>
                </p>
                <p className="text-[10px] text-slate-500 mt-1">Supports internship letters, offers, and text lists</p>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.txt"
                className="hidden"
                onChange={handleFileChange}
              />
            </div>
          ) : (
            <div className="flex items-center justify-between p-4 bg-blue-500/5 border border-blue-500/20 rounded-xl">
              <div className="flex items-center gap-3">
                <div className="bg-blue-500/10 p-2 rounded-lg border border-blue-500/20 text-blue-400">
                  <FileText size={18} />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-200 truncate max-w-[250px] sm:max-w-md">{uploadedFileName}</p>
                  <p className="text-[10px] text-blue-400 font-medium">Ready for scan diagnostics</p>
                </div>
              </div>
              <button 
                type="button" 
                onClick={removeFile}
                className="text-slate-400 hover:text-red-400 p-1.5 rounded-lg hover:bg-red-500/10 transition-colors"
              >
                <X size={15} />
              </button>
            </div>
          )}

          <textarea
            className="w-full input-premium resize-y"
            style={{ minHeight: '140px' }}
            placeholder="Or, paste the raw text here directly to start scanning..."
            value={listingText}
            onChange={e => {
              const val = e.target.value;
              setListingText(val);
              if (!val.includes('[PDF Uploaded:')) {
                setUploadedFileName('');
              }
            }}
            disabled={isLoading}
          />
        </div>
      ) : (
        <div>
          <label className="block text-xs font-semibold text-slate-400 mb-2">
            {isPlacement ? 'Placement Listing / Domain Link' : 'Internship Posting URL'}
          </label>
          <div className="relative">
            <LinkIcon
              size={14}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
            />
            <input
              type="url"
              className="w-full input-premium pl-11"
              placeholder={isPlacement ? "https://example.com/careers/job-opportunity" : "https://internshala.com/internship/detail/example"}
              value={listingUrl}
              onChange={e => setListingUrl(e.target.value)}
              disabled={isLoading}
            />
          </div>
          <p className="mt-2 text-[10px] text-slate-500">
            We will scrape structural text and inspect company domain records. Supports major student boards.
          </p>
        </div>
      )}

      {error && (
        <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-medium rounded-xl flex items-center gap-2">
          <span>⚠️</span> {error}
        </div>
      )}

      {/* Form Submit Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mt-6 pt-5 border-t border-white/[0.05]">
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <ShieldCheck size={14} className="text-emerald-400" />
          <span>Local heuristics model & IP encrypted scan</span>
        </div>
        <button
          className="btn-premium w-full sm:w-auto"
          onClick={handleSubmit}
          disabled={isLoading}
        >
          <Search size={15} />
          <span>Start Scan Diagnostics</span>
          <ChevronRight size={14} />
        </button>
      </div>
    </div>
  );
}
