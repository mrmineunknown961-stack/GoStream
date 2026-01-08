
import React from 'react';
import { Share2, Zap, BarChart3, ChevronRight, Play } from 'lucide-react';
import { motion } from 'framer-motion';

interface Props {
  onNavigate: (view: 'landing' | 'login' | 'register' | 'pricing' | 'dashboard') => void;
}

const LandingPage: React.FC<Props> = ({ onNavigate }) => {
  return (
    <div className="bg-[#020617] text-white min-h-screen relative overflow-hidden">
      {/* Navigation */}
      <motion.nav 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="flex items-center justify-between px-8 py-6 max-w-7xl mx-auto border-b border-slate-900 relative z-10"
      >
        <div className="flex items-center gap-4 cursor-pointer" onClick={() => onNavigate('landing')}>
          <motion.div whileHover={{ scale: 1.1, rotate: 5 }} className="w-14 h-14 overflow-hidden rounded-2xl bg-indigo-600/10 backdrop-blur-md p-1.5 shadow-xl shadow-indigo-600/10">
            <img 
              src="https://i.ibb.co/TxZJ2P8t/0f31aca9-0ffc-4930-9edb-b27082c022fc-fotor-bg-remover-20260108133716.png" 
              alt="GoStream Logo" 
              className="w-full h-full object-contain"
            />
          </motion.div>
          <span className="text-3xl font-black tracking-tighter">GoStream</span>
        </div>
        <div className="hidden md:flex gap-10 text-slate-400 font-medium">
          <button onClick={() => onNavigate('pricing')} className="hover:text-indigo-400 transition-colors">Pricing</button>
          <a href="#" className="hover:text-indigo-400 transition-colors">Features</a>
          <a href="#" className="hover:text-indigo-400 transition-colors">Creators</a>
        </div>
        <div className="flex items-center gap-4">
          <button 
            onClick={() => onNavigate('login')}
            className="text-slate-400 hover:text-white font-bold transition-colors px-4"
          >
            Sign In
          </button>
          <button 
            onClick={() => onNavigate('register')}
            className="bg-white text-slate-950 px-6 py-2.5 rounded-full font-bold transition-all hover:bg-slate-200"
          >
            Get Started
          </button>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <header className="px-8 pt-24 pb-32 max-w-7xl mx-auto text-center relative z-0">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-indigo-500/10 blur-[120px] rounded-full -z-10"></div>
        
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
          <span className="inline-block px-4 py-1.5 rounded-full bg-indigo-500/10 text-indigo-400 text-sm font-bold mb-8 border border-indigo-500/20">
            Powered by Gemini AI v3.0
          </span>
          <h1 className="text-6xl md:text-8xl font-black mb-8 leading-[1.05] tracking-tight">
            One Click. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-cyan-400 to-indigo-500">
              Infinite Platforms.
            </span>
          </h1>
          <p className="text-xl text-slate-400 mb-12 max-w-2xl mx-auto leading-relaxed font-medium">
            Broadcast to Twitch, YouTube, Kick, and Facebook simultaneously. 
            No extra CPU load. Pure cloud-based restreaming for serious creators.
          </p>
          <div className="flex flex-col sm:flex-row gap-5 justify-center">
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onNavigate('register')}
              className="bg-indigo-600 px-10 py-5 rounded-2xl font-black text-xl shadow-2xl shadow-indigo-600/30 flex items-center justify-center gap-2"
            >
              Start Free Trial <ChevronRight className="w-6 h-6" />
            </motion.button>
            <motion.button 
              whileHover={{ scale: 1.05 }}
              className="bg-slate-900 px-10 py-5 rounded-2xl font-black text-xl border border-slate-800 flex items-center justify-center gap-2"
            >
              <Play className="w-5 h-5 fill-current" /> Watch Demo
            </motion.button>
          </div>
        </motion.div>
      </header>

      {/* Features Grid */}
      <section id="features" className="px-8 py-32 border-t border-slate-900 bg-slate-950/30">
        <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-8">
          <FeatureCard 
            icon={<Share2 className="text-indigo-400" />}
            title="Cloud Re-encoding"
            desc="We handle the heavy lifting. One stream in, and we deliver high-quality feeds to every destination."
            delay={0.1}
          />
          <FeatureCard 
            icon={<BarChart3 className="text-cyan-400" />}
            title="Global Analytics"
            desc="Track viewers across all networks in one combined graph. Understand your total reach instantly."
            delay={0.2}
          />
          <FeatureCard 
            icon={<Zap className="text-amber-400" />}
            title="AI Content Copilot"
            desc="Gemini-powered title suggestions and chat sentiment analysis to keep your audience engaged."
            delay={0.3}
          />
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 text-center border-t border-slate-900 bg-[#020617]">
        <div className="flex flex-col items-center gap-4 mb-8">
          <div className="w-24 h-24 overflow-hidden rounded-2xl">
            <img 
              src="https://i.ibb.co/TxZJ2P8t/0f31aca9-0ffc-4930-9edb-b27082c022fc-fotor-bg-remover-20260108133716.png" 
              alt="GoStream Logo" 
              className="w-full h-full object-contain"
            />
          </div>
          <span className="text-3xl font-black">GoStream</span>
        </div>
        <p className="text-slate-500 text-sm max-w-md mx-auto font-medium">
          Built for creators who want to own every platform. Join the multi-streaming revolution today.
        </p>
        <div className="mt-12 flex justify-center gap-8 text-slate-400 font-bold text-sm">
          <button onClick={() => onNavigate('pricing')} className="hover:text-white">Pricing</button>
          <button onClick={() => onNavigate('login')} className="hover:text-white">Sign In</button>
          <button onClick={() => onNavigate('register')} className="hover:text-white">Sign Up</button>
        </div>
      </footer>
    </div>
  );
};

const FeatureCard: React.FC<{icon: React.ReactNode, title: string, desc: string, delay: number}> = ({ icon, title, desc, delay }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ delay }}
    whileHover={{ y: -8 }}
    className="p-10 rounded-[2.5rem] bg-slate-900/30 border border-slate-800/50 backdrop-blur-md group"
  >
    <div className="p-4 bg-slate-800/50 rounded-2xl w-fit mb-8 group-hover:scale-110 transition-transform duration-500">{icon}</div>
    <h3 className="text-2xl font-black mb-4 group-hover:text-indigo-400 transition-colors">{title}</h3>
    <p className="text-slate-400 leading-relaxed text-lg font-medium">{desc}</p>
  </motion.div>
);

export default LandingPage;