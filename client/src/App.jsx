import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Navbar from "./components/Navbar";
import SignIn from "./pages/SignIn";
import SignUp from "./components/SignUp";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Report from "./pages/Report";
import Settings from "./pages/Settings";
import Alerts from "./pages/Alerts";

const AUTH_ROUTES = ['/', '/signup'];

function App() {
  return (
    <div className="min-h-screen transition-colors duration-300">
      <Navbar />

      <Routes>
        <Route path="/" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/home" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/report" element={<Report />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/account" element={<Settings />} />
        <Route path="/notifications" element={<Alerts />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}

export default App;