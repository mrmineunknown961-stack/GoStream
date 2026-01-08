
import React from 'react';
import { motion } from 'framer-motion';
import { Check, ChevronLeft } from 'lucide-react';

interface Props {
  onNavigate: (view: 'landing' | 'login' | 'register' | 'pricing' | 'dashboard') => void;
}

const PricingPage: React.FC<Props> = ({ onNavigate }) => {
  return (
    <div className="bg-[#020617] text-white min-h-screen py-20 px-8">
      <nav className="fixed top-0 left-0 w-full z-50 bg-[#020617]/80 backdrop-blur-md border-b border-slate-900 py-4 px-8 flex items-center justify-between">
        <div className="flex items-center gap-4 cursor-pointer" onClick={() => onNavigate('landing')}>
          <div className="w-12 h-12 overflow-hidden rounded-xl bg-indigo-600/10 p-1 border border-indigo-500/20">
            <img 
              src="https://i.ibb.co/TxZJ2P8t/0f31aca9-0ffc-4930-9edb-b27082c022fc-fotor-bg-remover-20260108133716.png" 
              alt="GoStream Logo" 
              className="w-full h-full object-contain"
            />
          </div>
          <span className="text-2xl font-black tracking-tight">GoStream</span>
        </div>
        <button 
          onClick={() => onNavigate('landing')}
          className="text-slate-400 hover:text-white font-bold flex items-center gap-2"
        >
          <ChevronLeft className="w-4 h-4" /> Back to Home
        </button>
      </nav>

      <div className="max-w-7xl mx-auto pt-20">
        <div className="text-center mb-20">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-black mb-6"
          >
            Simple, Transparent <br />
            <span className="text-indigo-500">Pricing.</span>
          </motion.h1>
          <p className="text-slate-400 text-xl max-w-2xl mx-auto">
            Choose the plan that's right for your community. No hidden fees, cancel anytime.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <PricingCard 
            title="Free"
            price="0"
            desc="Perfect for starting your multi-streaming journey."
            features={["2 Platforms", "720p 30fps", "Basic Analytics", "Community Support"]}
            onSelect={() => onNavigate('register')}
          />
          <PricingCard 
            title="Creator"
            price="29"
            desc="For dedicated streamers building their brand."
            features={["Infinite Platforms", "1080p 60fps", "AI Optimization Tools", "Unified Chat Hub", "Priority Support"]}
            popular
            onSelect={() => onNavigate('register')}
          />
          <PricingCard 
            title="Pro"
            price="79"
            desc="The ultimate suite for professional broadcasters."
            features={["4K 60fps Ultra HD", "Advanced AI Analytics", "Multiple Encoder Profiles", "Custom RTMP Destinations", "Dedicated Manager"]}
            onSelect={() => onNavigate('register')}
          />
        </div>

        <div className="mt-20 text-center glass-card p-12 rounded-[2.5rem]">
           <h3 className="text-3xl font-black mb-4">Need a custom enterprise solution?</h3>
           <p className="text-slate-400 mb-8 max-w-xl mx-auto italic font-medium">"GoStream powers some of the largest digital events globally. Get in touch for high-bandwidth dedicated infrastructure."</p>
           <button className="bg-slate-800 px-8 py-4 rounded-2xl font-black hover:bg-slate-700 transition-all">Contact Sales</button>
        </div>
      </div>
    </div>
  );
};

const PricingCard: React.FC<{title: string, price: string, desc: string, features: string[], popular?: boolean, onSelect: () => void}> = ({ title, price, desc, features, popular, onSelect }) => (
  <motion.div 
    whileHover={{ y: -10 }}
    className={`p-10 rounded-[2.5rem] flex flex-col relative overflow-hidden ${popular ? 'bg-indigo-600/10 border-indigo-500 shadow-2xl shadow-indigo-600/10 border-2' : 'glass-card border border-slate-800'}`}
  >
    {popular && (
      <div className="absolute top-6 right-6 bg-indigo-500 text-white text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full">Most Popular</div>
    )}
    <h3 className="text-2xl font-black mb-2">{title}</h3>
    <p className="text-slate-500 text-sm mb-6 font-medium">{desc}</p>
    <div className="mb-8 flex items-baseline gap-1">
      <span className="text-5xl font-black">${price}</span>
      <span className="text-slate-500 font-bold">/mo</span>
    </div>
    <div className="space-y-4 mb-10 flex-1">
      {features.map((f, i) => (
        <div key={i} className="flex items-center gap-3">
          <Check className={`w-5 h-5 ${popular ? 'text-indigo-400' : 'text-slate-600'}`} />
          <span className="text-slate-300 font-medium">{f}</span>
        </div>
      ))}
    </div>
    <button 
      onClick={onSelect}
      className={`w-full py-4 rounded-2xl font-black text-lg transition-all ${popular ? 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-xl shadow-indigo-600/20' : 'bg-white text-slate-950 hover:bg-slate-200'}`}
    >
      Select Plan
    </button>
  </motion.div>
);

export default PricingPage;