import React, { useState } from 'react';
import { Mail, Lock, User, UserPlus, Phone, KeyRound } from 'lucide-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import BrandLogo from "./BrandLogo";
import MeshBackground from "./MeshBackground";

/**
 * Registration Portal.
 * Collects registration fields and stores credentials.
 */
export default function SignUp() {
  const [role, setRole] = useState('student');
  const [section, setSection] = useState('internship');
  const [signupMethod, setSignupMethod] = useState('email');
  const [formData, setFormData] = useState({ email: '', password: '', name: '', mobile: '' });
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const navigate = useNavigate();

  const getErrorMessage = (error, defaultMsg) => {
    if (error.response && error.response.data && typeof error.response.data === 'object' && error.response.data.message) {
      return error.response.data.message;
    }
    if (error.response && error.response.status === 404) {
      return "API endpoint not found. Make sure VITE_API_URL is configured correctly.";
    }
    return error.message || defaultMsg;
  };

  // Handle OTP requests calling backend api
  const handleSendOtp = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    if (!formData.mobile || formData.mobile.length < 10) {
      setErrorMsg('Please enter a valid mobile number');
      return;
    }
    try {
      const response = await axios.post('/api/auth/send-otp', { mobile: formData.mobile, checkExists: false });
      if (response.data.success) {
        alert(response.data.message);
        setOtpSent(true);
      }
    } catch (error) {
      setErrorMsg(getErrorMessage(error, 'Failed to send OTP.'));
    }
  };

  // Submit registration payload to backend endpoint
  const handleSignUp = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    if (signupMethod === 'mobile') {
      try {
        const response = await axios.post('/api/register-mobile', {
          name: formData.name,
          mobile: formData.mobile,
          otp,
          section,
        });
        if (response.data.success) {
          alert("Account Created! Please Sign In.");
          navigate('/');
        }
      } catch (error) {
        setErrorMsg(getErrorMessage(error, 'Registration failed'));
      }
      return;
    }
    try {
      const response = await axios.post('/api/register', {
        ...formData,
        email: formData.email.trim(),
        role,
        section,
      });
      if (response.data.success) {
        alert("Account Created! Please Sign In.");
        navigate('/');
      }
    } catch (error) {
      setErrorMsg(getErrorMessage(error, 'Registration failed'));
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center p-6 overflow-hidden bg-[#07070a]">
      <MeshBackground />

      <div className="relative z-10 w-full max-w-[440px] flex flex-col items-center">
        <div className="mb-8">
          <BrandLogo size="hero" />
        </div>

        <div className="w-full premium-card p-8 md:p-10 border border-white/[0.05]">
          {/* Active section selector tab */}
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
              Internship Shield
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
              Placement Verifier
            </button>
          </div>

          <div className="mb-6 text-center">
            <h1 className="text-2xl font-bold text-slate-100 tracking-tight">Create Account</h1>
            <p className="text-slate-400 text-xs mt-1.5">Join InplaSheild and start verifying offers</p>
          </div>

          {/* Email vs Mobile selector tab */}
          <div className="flex gap-6 mb-6 justify-center border-b border-white/[0.05] pb-2">
            <button
              type="button"
              onClick={() => { setSignupMethod('email'); setOtpSent(false); setErrorMsg(''); }}
              className={`text-xs font-semibold tracking-wide pb-2 border-b-2 transition-all ${
                signupMethod === 'email'
                  ? 'border-blue-500 text-blue-400'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              Use Email
            </button>
            <button
              type="button"
              onClick={() => { setSignupMethod('mobile'); setErrorMsg(''); }}
              className={`text-xs font-semibold tracking-wide pb-2 border-b-2 transition-all ${
                signupMethod === 'mobile'
                  ? 'border-blue-500 text-blue-400'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              Use Mobile
            </button>
          </div>

          <form onSubmit={signupMethod === 'email' || otpSent ? handleSignUp : handleSendOtp} className="space-y-4">
            {errorMsg && (
              <div className="p-3.5 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-xs font-medium leading-relaxed mb-4 flex items-start gap-2">
                <span>⚠️</span>
                <span>{errorMsg}</span>
              </div>
            )}

            <div className="relative group">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-500 transition-colors" size={16} />
              <input
                type="text"
                placeholder="Full display name"
                required
                className="w-full input-premium pl-11"
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                disabled={otpSent && signupMethod === 'mobile'}
              />
            </div>

            {signupMethod === 'email' ? (
              <>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-500 transition-colors" size={16} />
                  <input
                    type="email"
                    placeholder="Enter email address"
                    required
                    className="w-full input-premium pl-11"
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-500 transition-colors" size={16} />
                  <input
                    type="password"
                    placeholder="Create security password"
                    required
                    className="w-full input-premium pl-11"
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
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
                    required
                    className="w-full input-premium pl-11"
                    onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                    disabled={otpSent}
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

            <button type="submit" className="w-full btn-premium mt-6">
              <UserPlus size={15} />
              {signupMethod === 'email' || otpSent ? 'CREATE ACCOUNT' : 'SEND CODE'}
            </button>
          </form>

          <p className="mt-6 text-center text-xs text-slate-400">
            Already have an account?{' '}
            <span className="text-blue-400 hover:text-blue-300 hover:underline cursor-pointer font-semibold transition-all" onClick={() => navigate('/')}>
              Sign in
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}