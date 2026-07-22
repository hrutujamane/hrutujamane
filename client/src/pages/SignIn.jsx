import React, { useState, useEffect } from 'react';
import { Mail, Lock, LogIn, Phone, KeyRound } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import MeshBackground from '../components/MeshBackground';
import BrandLogo from '../components/BrandLogo';
import { saveUser, getUser } from '../utils/auth';

/**
 * Authentication Entry Portal.
 * Handles credential validations and maps clients to target safety modules.
 */
export default function SignIn() {
  const [role, setRole] = useState('student');
  const [section, setSection] = useState('internship');
  const [loginMethod, setLoginMethod] = useState('email');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mobile, setMobile] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const navigate = useNavigate();

  // Redirect if session token exists
  useEffect(() => {
    const user = getUser();
    if (user) {
      navigate('/home');
    }
  }, [navigate]);

  // Mock mobile verification request
  const handleSendOtp = (e) => {
    e.preventDefault();
    setErrorMsg('');
    if (mobile.length >= 10) {
      alert(`OTP sent to ${mobile}`);
      setOtpSent(true);
    } else {
      setErrorMsg('Please enter a valid mobile number');
    }
  };

  // Process credentials via backend authentication API
  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    if (loginMethod === 'mobile') {
      if (otp === '1234') {
        setErrorMsg('Mobile sign-in is not fully set up yet. Please use email and password.');
      } else {
        setErrorMsg("Invalid OTP! Try 1234");
      }
      return;
    }

    try {
      const response = await axios.post('/api/login', {
        email: email.trim(),
        password,
        role,
        section,
      });
      if (response.data.success) {
        saveUser(response.data.user);
        if (response.data.user.role === 'admin') {
          navigate('/dashboard');
        } else {
          navigate('/home');
        }
      }
    } catch (error) {
      if (!error.response) {
        setErrorMsg('Cannot reach the server. Make sure the backend node process is running.');
        return;
      }
      const message = error.response?.data?.message || 'Invalid email or password.';
      setErrorMsg(message);
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center p-6 overflow-hidden bg-[#07070a]">
      {/* Dynamic Network Atmosphere */}
      <MeshBackground />

      <div className="relative z-10 w-full max-w-[440px] flex flex-col items-center">
        <div className="mb-8">
          <BrandLogo size="hero" />
        </div>

        {/* Security Login Card */}
        <div className="w-full premium-card p-8 md:p-10 border border-white/[0.05]">
          {/* Student vs Admin selector */}
          <div className="flex p-0.5 bg-white/[0.02] border border-white/[0.05] rounded-xl mb-6">
            <button
              type="button"
              onClick={() => { setRole('student'); setLoginMethod('email'); setErrorMsg(''); }}
              className={`flex-1 py-2 rounded-lg flex items-center justify-center gap-2 transition-all font-semibold text-xs tracking-wider uppercase ${
                role === 'student'
                  ? 'bg-blue-600/10 text-blue-400 border border-blue-500/20 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 border border-transparent'
              }`}
            >
              Student
            </button>
            <button
              type="button"
              onClick={() => { setRole('admin'); setLoginMethod('email'); setErrorMsg(''); }}
              className={`flex-1 py-2 rounded-lg flex items-center justify-center gap-2 transition-all font-semibold text-xs tracking-wider uppercase ${
                role === 'admin'
                  ? 'bg-red-500/10 text-red-400 border border-red-500/20 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 border border-transparent'
              }`}
            >
              Security Admin
            </button>
          </div>

          {/* Internship vs Placement selection tab */}
          {role === 'student' && (
            <div className="flex p-0.5 bg-white/[0.02] border border-white/[0.05] rounded-xl mb-6">
              <button
                type="button"
                onClick={() => setSection('internship')}
                className={`flex-1 py-2 rounded-lg text-xs font-semibold tracking-wide transition-all ${
                  section === 'internship'
                    ? 'bg-teal-500/10 text-teal-400 border border-teal-500/25'
                    : 'text-slate-400 hover:text-slate-200 border border-transparent'
                }`}
              >
                Internship Module
              </button>
              <button
                type="button"
                onClick={() => setSection('placement')}
                className={`flex-1 py-2 rounded-lg text-xs font-semibold tracking-wide transition-all ${
                  section === 'placement'
                    ? 'bg-orange-500/10 text-orange-400 border border-orange-500/25'
                    : 'text-slate-400 hover:text-slate-200 border border-transparent'
                }`}
              >
                Placement Module
              </button>
            </div>
          )}

          <div className="mb-6 text-center">
            <h2 className="text-2xl font-bold tracking-tight text-slate-100">
              {role === 'admin' ? 'Authorized Access Only' : 'Welcome Back'}
            </h2>
            <p className="text-slate-400 text-xs mt-1.5">
              {role === 'admin' 
                ? 'Sign in to access threat logs and statistics' 
                : 'Securely verify your internship and placement documents'}
            </p>
          </div>

          {/* Email vs Mobile method tab */}
          {role === 'student' && (
            <div className="flex gap-6 mb-6 justify-center border-b border-white/[0.05] pb-2">
              <button
                type="button"
                onClick={() => { setLoginMethod('email'); setOtpSent(false); setErrorMsg(''); }}
                className={`text-xs font-semibold tracking-wide pb-2 border-b-2 transition-all ${
                  loginMethod === 'email'
                    ? 'border-blue-500 text-blue-400'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                Email Credentials
              </button>
              <button
                type="button"
                onClick={() => { setLoginMethod('mobile'); setErrorMsg(''); }}
                className={`text-xs font-semibold tracking-wide pb-2 border-b-2 transition-all ${
                  loginMethod === 'mobile'
                    ? 'border-blue-500 text-blue-400'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                Mobile Number OTP
              </button>
            </div>
          )}

          <form onSubmit={loginMethod === 'email' || otpSent ? handleLogin : handleSendOtp} className="space-y-4">
            {errorMsg && (
              <div className="p-3.5 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-xs font-medium leading-relaxed mb-4 flex items-start gap-2">
                <span>⚠️</span>
                <span>{errorMsg}</span>
              </div>
            )}

            {loginMethod === 'email' ? (
              <>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-500 transition-colors" size={16} />
                  <input
                    type="email"
                    placeholder="Enter email address"
                    className="w-full input-premium pl-11"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-500 transition-colors" size={16} />
                  <input
                    type="password"
                    placeholder="Enter password"
                    className="w-full input-premium pl-11"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </>
            ) : (
              <>
                <div className="relative group">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-500 transition-colors" size={16} />
                  <input
                    type="tel"
                    placeholder="Mobile number"
                    className="w-full input-premium pl-11"
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value)}
                    disabled={otpSent}
                    required
                  />
                </div>
                {otpSent && (
                  <div className="relative group animate-fade-in">
                    <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-500 transition-colors" size={16} />
                    <input
                      type="text"
                      placeholder="Enter verification code (1234)"
                      className="w-full input-premium pl-11"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      required
                    />
                  </div>
                )}
              </>
            )}

            <button
              type="submit"
              className={`w-full btn-premium mt-6 ${
                role === 'admin'
                  ? 'bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500 shadow-red-500/10'
                  : ''
              }`}
            >
              <LogIn size={15} />
              {role === 'admin' ? 'AUTHORIZE ADMIN' : (loginMethod === 'email' || otpSent ? 'SIGN IN' : 'SEND CODE')}
            </button>
          </form>

          {role === 'student' && (
            <p className="mt-6 text-center text-xs text-slate-400">
              New to InplaSheild?{' '}
              <span className="text-blue-400 hover:text-blue-300 hover:underline cursor-pointer font-semibold transition-all" onClick={() => navigate('/signup')}>
                Create student account
              </span>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}