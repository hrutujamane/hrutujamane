import{Routes,Route} from 'react-router-dom';
import Home from './pages/Home';
const AdminMock = () => (
  <div className="p-10 bg-[#0a0c10] min-h-screen text-white font-sans">
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-blue-400">NEXUS Admin Control</h1>
      <p className="text-gray-400 mt-2">Status: Authenticated | Mode: Moderation</p>
      
      <div className="mt-8 space-y-4">
        <div className="p-5 bg-slate-900 border border-blue-500/20 rounded-xl flex justify-between items-center shadow-lg">
          <div>
            <p className="font-semibold">Whitelist Request: 'Internshala'</p>
            <p className="text-xs text-gray-500">Source: Official Partner Domain</p>
          </div>
          <button className="bg-blue-600 hover:bg-blue-700 px-4 py-1.5 rounded-lg text-sm transition">Approve & Whitelist</button>
        </div>

        <div className="p-5 bg-slate-900 border border-red-500/20 rounded-xl flex justify-between items-center shadow-lg">
          <div>
            <p className="font-semibold text-red-400">Flagged: 'Data Entry - Urgent'</p>
            <p className="text-xs text-gray-500">Signals: 42 Community Reports | Asking for Fees</p>
          </div>
          <button className="bg-red-600 hover:bg-red-700 px-4 py-1.5 rounded-lg text-sm transition">Confirm Scam/Ban</button>
        </div>
      </div>

      <button onClick={() => window.location.href='/'} className="mt-10 text-gray-500 hover:text-white text-sm flex items-center gap-2">
        ← Back to Scanner Dashboard
      </button>
    </div>
  </div>
);

export default function App(){
  return(
    <Routes>
      <Route path="/" element={<Home/>} />
      {/* Future routes: /results/:id, /about, etc. */}
      <Route path="/admin" element={<AdminMock />} />
      <Route
      path="*"
      element={
        <div className="min-h-screen flex item-center justify-center text-white">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-2">404</h1>
            <p className="text-slate-400 mb-4">Page not found</p>
            <a href="/" className="btn-analyze inline-flex">Go Home</a>
            </div>
            
          </div>
    
       
      }
      />
    </Routes>
  );

}
