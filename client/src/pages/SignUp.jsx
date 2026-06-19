import React, { useState } from 'react';
import { Mail, Lock, User, UserPlus, Phone, UserCircle, Shield, KeyRound } from 'lucide-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function SignUp() {
  const [role, setRole] = useState('student');
  const [section, setSection] = useState('internship');
  const [signupMethod, setSignupMethod] = useState('email');
  const [formData, setFormData] = useState({ email: '', password: '', name: '', mobile: '' });
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const navigate = useNavigate();

  const handleSendOtp = (e) => {
    e.preventDefault();
    if(formData.mobile?.length >= 10) {
      alert(`OTP sent to ${formData.mobile}`);
      setOtpSent(true);
    } else {
      alert('Please enter a valid mobile number');
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    if (signupMethod === 'mobile') {
      if (otp === '1234') {
         // Mock register with mobile
         alert("Account Created! Please Sign In.");
         navigate('/');
      } else {
         alert("Invalid OTP! Try 1234");
      }
      return;
    }
    try {
      const response = await axios.post('http://localhost:5000/api/register', { ...formData, role, section });
      if (response.data.success) {
        alert("Account Created! Please Sign In.");
        navigate('/');
      }
    } catch (error) {
      alert("Registration Failed: " + (error.response?.data?.message || error.message));
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center p-4 overflow-hidden">
      {/* Dynamic Background Glows */}
      <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-[120px] mix-blend-screen pointer-events-none"></div>
      <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-[120px] mix-blend-screen pointer-events-none"></div>

      <div className="glass-card-dark p-8 md:p-10 w-full max-w-md relative z-10 transition-transform duration-500 hover:scale-[1.01]">
        


        {/* Section Toggle */}
        <div className="flex p-1 bg-[var(--input-bg)] rounded-xl border border-[var(--glass-border)] mb-6">
          <button type="button" onClick={() => setSection('internship')} className={`flex-1 py-2 rounded-lg flex items-center justify-center gap-2 transition-all font-semibold text-sm ${section === 'internship' ? 'bg-teal-500 text-white shadow-md' : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'}`}>
            Internship
          </button>
          <button type="button" onClick={() => setSection('placement')} className={`flex-1 py-2 rounded-lg flex items-center justify-center gap-2 transition-all font-semibold text-sm ${section === 'placement' ? 'bg-orange-500 text-white shadow-md' : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'}`}>
            Placement
          </button>
        </div>

        <div className="mb-6 text-center">
          <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 tracking-tight mb-2">Create Account</h1>
          <p style={{ color: 'var(--text-muted)' }} className="text-sm">Join InplaSheild and stay protected</p>
        </div>
        
        {/* Method Toggle */}
        <div className="flex gap-4 mb-6 justify-center">
          <button type="button" onClick={() => {setSignupMethod('email'); setOtpSent(false);}} className={`text-sm font-medium pb-1 border-b-2 transition-colors ${signupMethod === 'email' ? 'border-blue-500 text-blue-500' : 'border-transparent text-[var(--text-muted)] hover:text-[var(--text-main)]'}`}>Email & Password</button>
          <button type="button" onClick={() => setSignupMethod('mobile')} className={`text-sm font-medium pb-1 border-b-2 transition-colors ${signupMethod === 'mobile' ? 'border-blue-500 text-blue-500' : 'border-transparent text-[var(--text-muted)] hover:text-[var(--text-main)]'}`}>Mobile OTP</button>
        </div>

        <form onSubmit={signupMethod === 'email' || otpSent ? handleSignUp : handleSendOtp} className="space-y-4">
          <div className="relative group">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-500 transition-colors" size={18} />
            <input type="text" placeholder="Full Name" required className="input-field pl-12" onChange={(e) => setFormData({...formData, name: e.target.value})} disabled={otpSent && signupMethod === 'mobile'} />
          </div>

          {signupMethod === 'email' ? (
            <>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-500 transition-colors" size={18} />
                <input type="email" placeholder="Email Address" required className="input-field pl-12" onChange={(e) => setFormData({...formData, email: e.target.value})} />
              </div>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-500 transition-colors" size={18} />
                <input type="password" placeholder="Password" required className="input-field pl-12" onChange={(e) => setFormData({...formData, password: e.target.value})} />
              </div>
            </>
          ) : (
            <>
              <div className="relative group">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-500 transition-colors" size={18} />
                <input type="tel" placeholder="Mobile Number" required className="input-field pl-12" onChange={(e) => setFormData({...formData, mobile: e.target.value})} disabled={otpSent} />
              </div>
              {otpSent && (
                <div className="relative group fade-in">
                  <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-500 transition-colors" size={18} />
                  <input type="text" placeholder="Enter OTP (1234)" className="input-field pl-12" value={otp} onChange={(e) => setOtp(e.target.value)} required />
                </div>
              )}
            </>
          )}

          <button type="submit" className="w-full btn-analyze justify-center mt-4">
            <UserPlus size={18} />
            {signupMethod === 'email' || otpSent ? 'SIGN UP' : 'SEND OTP'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm" style={{ color: 'var(--text-muted)' }}>
          Already have an account? <span className="text-blue-500 hover:text-blue-400 cursor-pointer font-medium" onClick={() => navigate('/')}>Sign in</span>
        </p>
      </div>
    </div>
  );
}