
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, Mail, Lock, User, Loader2, CheckCircle } from 'lucide-react';

interface Props {
  onNavigate: (view: 'landing' | 'login' | 'register' | 'pricing' | 'dashboard') => void;
  onRegisterSuccess: () => void;
}

const RegisterPage: React.FC<Props> = ({ onNavigate, onRegisterSuccess }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulated registration
    setTimeout(() => {
      localStorage.setItem(`user_${email}`, JSON.stringify({ name, email, password }));
      setIsLoading(false);
      setIsSuccess(true);
      setTimeout(() => onRegisterSuccess(), 2000);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-[#020617] flex flex-col md:flex-row">
      <div className="hidden md:flex w-1/3 bg-slate-950 p-20 flex-col justify-between border-r border-slate-900 relative">
        <div className="bg-indigo-600/5 absolute inset-0 -z-10 blur-3xl rounded-full translate-x-1/2"></div>
        
        <div className="flex items-center gap-4 cursor-pointer z-10" onClick={() => onNavigate('landing')}>
          <div className="w-16 h-16 overflow-hidden rounded-2xl bg-indigo-600/10 p-1.5 shadow-2xl shadow-indigo-600/10 border border-indigo-500/20">
            <img 
              src="https://i.ibb.co/TxZJ2P8t/0f31aca9-0ffc-4930-9edb-b27082c022fc-fotor-bg-remover-20260108133716.png" 
              alt="GoStream Logo" 
              className="w-full h-full object-contain"
            />
          </div>
          <span className="text-3xl font-black tracking-tighter">GoStream</span>
        </div>

        <div className="space-y-12">
           <Testimonial 
              quote="Switching to GoStream increased our concurrent viewership by 40% across all platforms." 
              author="Alex Rivera"
              role="Head of Production, TechLive"
           />
           <Testimonial 
              quote="The cloud-based restreaming is so clean, my PC temperature actually dropped while live." 
              author="Sami K."
              role="Variety Streamer"
           />
        </div>

        <div className="text-slate-600 text-xs font-bold uppercase tracking-widest">
          GoStream Platform v3.1.2
        </div>
      </div>

      <div className="flex-1 p-8 md:p-20 flex flex-col justify-center items-center bg-[#020617]">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md"
        >
          {isSuccess ? (
            <div className="text-center py-20 animate-in fade-in zoom-in duration-500">
               <div className="w-24 h-24 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-emerald-500/20">
                  <CheckCircle className="w-12 h-12 text-white" />
               </div>
               <h2 className="text-4xl font-black mb-4">Registration Complete!</h2>
               <p className="text-slate-400 font-medium text-lg">Redirecting you to login...</p>
            </div>
          ) : (
            <>
              <button 
                onClick={() => onNavigate('landing')}
                className="flex items-center gap-2 text-slate-500 hover:text-white font-bold mb-12 transition-colors"
              >
                <ChevronLeft className="w-5 h-5" /> Back
              </button>

              <h2 className="text-4xl font-black mb-4 leading-tight">Create Account</h2>
              <p className="text-slate-400 mb-10 font-medium text-lg leading-relaxed">Start your 14-day free trial on GoStream. No credit card required.</p>

              <form onSubmit={handleRegister} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-1">Creator Name</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                    <input 
                      type="text" 
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-2xl px-12 py-5 focus:outline-none focus:border-indigo-500 font-bold transition-all text-lg"
                      placeholder="Alex Streaming"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-1">Work Email</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                    <input 
                      type="email" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-2xl px-12 py-5 focus:outline-none focus:border-indigo-500 font-bold transition-all text-lg"
                      placeholder="name@example.com"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-1">Secure Password</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                    <input 
                      type="password" 
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-2xl px-12 py-5 focus:outline-none focus:border-indigo-500 font-bold transition-all text-lg"
                      placeholder="Minimum 8 characters"
                      required
                    />
                  </div>
                </div>

                <div className="flex items-start gap-3 px-1 py-2">
                   <input type="checkbox" required className="mt-1.5 w-4 h-4 accent-indigo-500 rounded cursor-pointer" />
                   <p className="text-sm text-slate-500 leading-relaxed font-medium">
                     I agree to the <span className="text-indigo-400 font-bold cursor-pointer hover:underline">Terms of Service</span> and <span className="text-indigo-400 font-bold cursor-pointer hover:underline">Privacy Policy</span>.
                   </p>
                </div>

                <button 
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-white text-slate-950 py-5 rounded-2xl font-black text-xl shadow-2xl hover:bg-slate-200 flex items-center justify-center gap-3 transition-all disabled:opacity-50"
                >
                  {isLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : 'Create My Account'}
                </button>
              </form>

              <div className="mt-12 pt-8 border-t border-slate-900 text-center">
                <p className="text-slate-500 font-medium text-lg">
                  Already a member? <button onClick={() => onNavigate('login')} className="text-indigo-400 font-black">Sign in here</button>
                </p>
              </div>
            </>
          )}
        </motion.div>
      </div>
    </div>
  );
};

const Testimonial: React.FC<{quote: string, author: string, role: string}> = ({ quote, author, role }) => (
  <div className="space-y-4">
    <p className="text-slate-300 text-xl italic leading-relaxed font-medium">"{quote}"</p>
    <div>
      <p className="font-black text-white text-lg">{author}</p>
      <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">{role}</p>
    </div>
  </div>
);

export default RegisterPage;