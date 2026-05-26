import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function SignUp() {
  const [formData, setFormData] = useState({ email: '', password: '', name: '' });
  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/register', formData);
      if (response.data.success) {
        alert("Account Created! Please Sign In.");
        navigate('/signIn');
      }
    } catch (error) {
      alert("Registration Failed");
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white/5 border border-white/10 rounded-3xl p-10 shadow-2xl">
        <h1 className="text-3xl font-bold text-white mb-6 text-center">Create Account</h1>
        <form onSubmit={handleSignUp} className="space-y-4">
          <input 
            type="text" placeholder="Full Name" required
            className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-4 text-white"
            onChange={(e) => setFormData({...formData, name: e.target.value})}
          />
          <input 
            type="email" placeholder="Email" required
            className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-4 text-white"
            onChange={(e) => setFormData({...formData, email: e.target.value})}
          />
          <input 
            type="password" placeholder="Password" required
            className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-4 text-white"
            onChange={(e) => setFormData({...formData, password: e.target.value})}
          />
          <button type="submit" className="w-full font-bold py-4 rounded-xl bg-green-600 text-white hover:bg-green-700 transition-all">
            SIGN UP
          </button>
        </form>
      </div>
    </div>
  );
}