
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, Mail, Lock, Eye, EyeOff, Loader2 } from 'lucide-react';

interface Props {
  onNavigate: (view: 'landing' | 'login' | 'register' | 'pricing' | 'dashboard') => void;
  onLoginSuccess: () => void;
}

const LoginPage: React.FC<Props> = ({ onNavigate, onLoginSuccess }) => {
  const [email, setEmail] = useState('creator@gostream.com');
  const [password, setPassword] = useState('password123');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Simulated login logic
    setTimeout(() => {
      const storedUser = localStorage.getItem(`user_${email}`);
      if (storedUser || (email === 'creator@gostream.com' && password === 'password123')) {
        onLoginSuccess();
      } else {
        setError('Invalid credentials. Try creator@gostream.com / password123');
        setIsLoading(false);
      }
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#020617] flex flex-col md:flex-row">
      {/* Left Branding Side */}
      <div className="hidden md:flex w-1/2 bg-indigo-600 p-20 flex-col justify-between relative overflow-hidden">
        <div className="absolute top-0 right-0 w-full h-full opacity-10 pointer-events-none">
           <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
             <path d="M0,0 L100,0 L100,100 L0,100 Z" fill="none" stroke="white" strokeWidth="0.1" />
             <path d="M0,50 L100,50 M50,0 L50,100" stroke="white" strokeWidth="0.1" />
           </svg>
        </div>
        
        <div className="flex items-center gap-5 cursor-pointer z-10" onClick={() => onNavigate('landing')}>
          <div className="w-20 h-20 overflow-hidden rounded-2xl shadow-2xl p-2 bg-white/5 backdrop-blur-md border border-white/10">
            <img 
              src="https://i.ibb.co/TxZJ2P8t/0f31aca9-0ffc-4930-9edb-b27082c022fc-fotor-bg-remover-20260108133716.png" 
              alt="GoStream Logo" 
              className="w-full h-full object-contain"
            />
          </div>
          <span className="text-4xl font-black text-white tracking-tighter">GoStream</span>
        </div>

        <div className="z-10">
          <h2 className="text-6xl font-black text-white leading-tight mb-8">
            Empowering <br /> 
            Digital <br /> 
            Presence.
          </h2>
          <p className="text-indigo-200 text-xl max-w-md font-medium">
            Join 500k+ creators who trust GoStream to deliver their signal to the world.
          </p>
        </div>

        <div className="flex gap-4 z-10">
          <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center backdrop-blur-md border border-white/10 text-white font-black">TW</div>
          <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center backdrop-blur-md border border-white/10 text-white font-black">YT</div>
          <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center backdrop-blur-md border border-white/10 text-white font-black">FB</div>
        </div>
      </div>

      {/* Right Login Side */}
      <div className="flex-1 p-8 md:p-20 flex flex-col justify-center items-center bg-[#020617]">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <button 
            onClick={() => onNavigate('landing')}
            className="flex items-center gap-2 text-slate-500 hover:text-white font-bold mb-12 transition-colors"
          >
            <ChevronLeft className="w-5 h-5" /> Back to Website
          </button>

          <h2 className="text-4xl font-black mb-4">Welcome Back</h2>
          <p className="text-slate-400 mb-10 font-medium text-lg leading-relaxed">Enter your credentials to access the command center.</p>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-1">Account Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-2xl px-12 py-5 focus:outline-none focus:border-indigo-500 font-bold transition-all text-lg"
                  placeholder="name@company.com"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center ml-1">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Secure Password</label>
                <button type="button" className="text-[10px] font-black uppercase tracking-widest text-indigo-400 hover:text-indigo-300">Forgot Password?</button>
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                <input 
                  type={showPassword ? "text" : "password"} 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-2xl px-12 py-5 focus:outline-none focus:border-indigo-500 font-bold transition-all text-lg"
                  placeholder="••••••••"
                  required
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {error && <p className="text-red-500 text-sm font-bold animate-pulse">{error}</p>}

            <button 
              type="submit"
              disabled={isLoading}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-5 rounded-2xl font-black text-xl shadow-2xl shadow-indigo-600/20 flex items-center justify-center gap-3 transition-all disabled:opacity-50"
            >
              {isLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : 'Enter Dashboard'}
            </button>
          </form>

          <div className="mt-12 pt-8 border-t border-slate-900 text-center">
            <p className="text-slate-500 font-medium text-lg">
              New to GoStream? <button onClick={() => onNavigate('register')} className="text-indigo-400 font-black">Create an account</button>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default LoginPage;