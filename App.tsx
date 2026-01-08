
import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import LandingPage from './components/LandingPage';
import Dashboard from './components/Dashboard';
import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegisterPage';
import PricingPage from './components/PricingPage';

type View = 'landing' | 'login' | 'register' | 'pricing' | 'dashboard';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>('landing');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const handleLoginSuccess = () => {
    setIsLoggingIn(true);
    setTimeout(() => {
      setCurrentView('dashboard');
      setIsLoggingIn(false);
    }, 1200);
  };

  const handleLogout = () => {
    setCurrentView('landing');
  };

  const navigateTo = (view: View) => {
    setCurrentView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#020617] selection:bg-indigo-500/30">
      <AnimatePresence mode="wait">
        {isLoggingIn ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#020617]"
          >
            <div className="relative w-48 h-48 mb-8">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 border-2 border-indigo-500/10 border-t-indigo-500 rounded-full"
              />
              <motion.div
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute inset-4 overflow-hidden rounded-3xl flex items-center justify-center"
              >
                <img 
                  src="https://i.ibb.co/TxZJ2P8t/0f31aca9-0ffc-4930-9edb-b27082c022fc-fotor-bg-remover-20260108133716.png" 
                  alt="GoStream Logo" 
                  className="w-full h-full object-contain"
                />
              </motion.div>
            </div>
            <p className="text-slate-400 font-bold tracking-[0.3em] uppercase text-sm animate-pulse">Initializing GoStream...</p>
          </motion.div>
        ) : (
          <motion.div
            key={currentView}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="min-h-screen"
          >
            {currentView === 'landing' && <LandingPage onNavigate={navigateTo} />}
            {currentView === 'pricing' && <PricingPage onNavigate={navigateTo} />}
            {currentView === 'login' && <LoginPage onNavigate={navigateTo} onLoginSuccess={handleLoginSuccess} />}
            {currentView === 'register' && <RegisterPage onNavigate={navigateTo} onRegisterSuccess={() => navigateTo('login')} />}
            {currentView === 'dashboard' && <Dashboard onLogout={handleLogout} />}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default App;