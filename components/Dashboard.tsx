
import React, { useState, useEffect, useRef } from 'react';
import { 
  LayoutDashboard, MessageSquare, BarChart3, Settings, 
  Power, Plus, Youtube, Twitch, Facebook, Tv, Wand2, Send,
  Activity, Users, Zap, Clock, ChevronRight, Share2, Shield, Eye,
  ChevronLeft, Copy, CheckCircle, RefreshCcw, AlertCircle
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';
import { generateStreamAids, analyzeChatSentiment } from '../services/geminiService';
import { Platform, ChatMessage, StreamStats } from '../types';

const INITIAL_PLATFORMS: Platform[] = [
  { id: 'twitch', name: 'Twitch', icon: 'Twitch', color: '#9146FF', connected: true, active: true },
  { id: 'youtube', name: 'YouTube', icon: 'Youtube', color: '#FF0000', connected: true, active: true },
  { id: 'kick', name: 'Kick', icon: 'Tv', color: '#53FC18', connected: false, active: false },
  { id: 'facebook', name: 'Facebook', icon: 'Facebook', color: '#1877F2', connected: false, active: false },
];

const Dashboard: React.FC<{ onLogout: () => void }> = ({ onLogout }) => {
  // --- STATE ---
  const [isLive, setIsLive] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [platforms, setPlatforms] = useState<Platform[]>(() => {
    const saved = localStorage.getItem('gostream_platforms');
    return saved ? JSON.parse(saved) : INITIAL_PLATFORMS;
  });
  const [streamTitle, setStreamTitle] = useState(() => localStorage.getItem('gostream_title') || 'Chill Sunday Coding & Gaming 🚀');
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [aiSuggestions, setAiSuggestions] = useState<{ titles: string[], tags: string[], description: string } | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [sentiment, setSentiment] = useState<{ mood: string, summary: string } | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  
  // Simulated Connection State
  const [connectingPlatform, setConnectingPlatform] = useState<Platform | null>(null);
  const [connectionStep, setConnectionStep] = useState(0);

  // Dynamic Stats
  const [stats, setStats] = useState<StreamStats[]>([]);
  const [liveMetrics, setLiveMetrics] = useState({ viewers: 0, bitrate: 0, cpu: 2, uptime: 0 });

  const chatEndRef = useRef<HTMLDivElement>(null);

  // --- PERSISTENCE ---
  useEffect(() => {
    localStorage.setItem('gostream_platforms', JSON.stringify(platforms));
    localStorage.setItem('gostream_title', streamTitle);
  }, [platforms, streamTitle]);

  // --- SIMULATED BROADCAST ENGINE ---
  useEffect(() => {
    let interval: number;
    if (isLive) {
      interval = window.setInterval(() => {
        const activeCount = platforms.filter(p => p.active && p.connected).length;
        if (activeCount === 0) return;

        setLiveMetrics(prev => ({
          viewers: Math.max(10, prev.viewers + (Math.random() > 0.5 ? 5 : -3) * activeCount),
          bitrate: 5500 + Math.floor(Math.random() * 500),
          cpu: 5 + (activeCount * 4) + Math.floor(Math.random() * 3),
          uptime: prev.uptime + 1
        }));

        // Generate Chat
        const platform = platforms.filter(p => p.active && p.connected)[Math.floor(Math.random() * activeCount)].id;
        const messages = ['LFG!', 'POGGERS', 'Nice play!', 'What game is this?', 'Hello from ' + platform + '!', 'This multi-stream is clean', 'How is the latency?'];
        const newMessage: ChatMessage = {
          id: Math.random().toString(),
          user: ['ShadowNinja', 'GamerGuy88', 'StreamFan', 'ProClicker', 'LogicMaster', 'ByteSize'][Math.floor(Math.random() * 6)],
          platform,
          text: messages[Math.floor(Math.random() * messages.length)],
          timestamp: new Date(),
        };
        setChatMessages(prev => [...prev.slice(-100), newMessage]);
      }, 3000);
    } else {
      setLiveMetrics({ viewers: 0, bitrate: 0, cpu: 2, uptime: 0 });
    }
    return () => clearInterval(interval);
  }, [isLive, platforms]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  // --- HANDLERS ---
  const handleTogglePlatform = (id: string) => {
    const platform = platforms.find(p => p.id === id);
    if (!platform) return;

    if (!platform.connected) {
      startConnectionFlow(platform);
    } else {
      setPlatforms(prev => prev.map(p => 
        p.id === id ? { ...p, active: !p.active } : p
      ));
    }
  };

  const startConnectionFlow = (platform: Platform) => {
    setConnectingPlatform(platform);
    setConnectionStep(1);
    
    // Simulate multi-step OAuth handshaking
    setTimeout(() => setConnectionStep(2), 1500);
    setTimeout(() => setConnectionStep(3), 3000);
    setTimeout(() => {
      setPlatforms(prev => prev.map(p => 
        p.id === platform.id ? { ...p, connected: true, active: true } : p
      ));
      setConnectingPlatform(null);
      setConnectionStep(0);
    }, 4500);
  };

  const handleGoLive = () => {
    const activeCount = platforms.filter(p => p.active && p.connected).length;
    if (!isLive && activeCount === 0) {
      alert("Please connect and activate at least one platform first!");
      return;
    }
    setIsLive(!isLive);
    if (!isLive) setChatMessages([]);
  };

  const formatUptime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600).toString().padStart(2, '0');
    const mins = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
    const secs = (seconds % 60).toString().padStart(2, '0');
    return `${hrs}:${mins}:${secs}`;
  };

  const handleCopy = (val: string) => {
    navigator.clipboard.writeText(val);
    setCopiedKey(val);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleGenerateAI = async () => {
    setIsGenerating(true);
    try {
      const result = await generateStreamAids(streamTitle);
      setAiSuggestions(result);
    } catch (e) { console.error(e); } finally { setIsGenerating(false); }
  };

  const handleAnalyzeChat = async () => {
    if (chatMessages.length < 5) return;
    try {
      const result = await analyzeChatSentiment(chatMessages.slice(-10).map(m => m.text));
      setSentiment(result);
    } catch (e) { console.error(e); }
  };

  return (
    <div className="flex h-screen bg-[#020617] text-white overflow-hidden">
      {/* Sidebar */}
      <motion.aside 
        animate={{ width: sidebarCollapsed ? '100px' : '300px' }}
        className="border-r border-slate-900 flex flex-col bg-slate-950/50 backdrop-blur-xl z-50 relative"
      >
        <button 
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          className="absolute -right-3 top-24 bg-indigo-600 p-1.5 rounded-full z-[60] shadow-lg border border-indigo-400/50 hover:scale-110 transition-transform"
        >
          <ChevronLeft className={`w-4 h-4 transition-transform ${sidebarCollapsed ? 'rotate-180' : ''}`} />
        </button>

        <div className={`p-6 flex items-center ${sidebarCollapsed ? 'justify-center' : 'gap-5'} overflow-hidden`}>
          <motion.div 
            animate={{ width: sidebarCollapsed ? 48 : 72, height: sidebarCollapsed ? 48 : 72 }}
            whileHover={{ scale: 1.05, rotate: 5 }} 
            className="overflow-hidden rounded-2xl bg-indigo-600/10 shrink-0 p-1.5 shadow-xl shadow-indigo-600/10 border border-indigo-500/20"
          >
            <img 
              src="https://i.ibb.co/TxZJ2P8t/0f31aca9-0ffc-4930-9edb-b27082c022fc-fotor-bg-remover-20260108133716.png" 
              alt="GoStream Logo" 
              className="w-full h-full object-contain"
            />
          </motion.div>
          {!sidebarCollapsed && <span className="text-3xl font-black tracking-tight whitespace-nowrap">GoStream</span>}
        </div>

        <nav className="flex-1 px-4 py-10 space-y-4">
          <SidebarItem icon={<LayoutDashboard />} label="Dashboard" active={activeTab === 'dashboard'} collapsed={sidebarCollapsed} onClick={() => setActiveTab('dashboard')} />
          <SidebarItem icon={<BarChart3 />} label="Analytics" active={activeTab === 'analytics'} collapsed={sidebarCollapsed} onClick={() => setActiveTab('analytics')} />
          <SidebarItem icon={<MessageSquare />} label="Chat Feed" active={activeTab === 'chat'} collapsed={sidebarCollapsed} onClick={() => setActiveTab('chat')} />
          <SidebarItem icon={<Settings />} label="Control Panel" active={activeTab === 'settings'} collapsed={sidebarCollapsed} onClick={() => setActiveTab('settings')} />
        </nav>

        <div className="p-4 border-t border-slate-900">
          <button onClick={onLogout} className={`w-full flex items-center ${sidebarCollapsed ? 'justify-center' : 'justify-start gap-3'} p-3.5 rounded-2xl text-slate-500 hover:text-red-400 transition-all`}>
            <Power className="w-5 h-5" />
            {!sidebarCollapsed && <span className="font-bold">Sign Out</span>}
          </button>
        </div>
      </motion.aside>

      {/* Main Container */}
      <main className="flex-1 flex flex-col min-w-0 bg-[#020617] relative">
        <header className="h-24 border-b border-slate-900 flex items-center justify-between px-10 bg-slate-950/20 backdrop-blur-md">
          <h2 className="text-2xl font-black flex items-center gap-3">
            {activeTab === 'dashboard' ? 'Command Center' : activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
            {isLive && <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping"></span>}
          </h2>
          
          <div className="flex items-center gap-6">
            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleGoLive}
              className={`px-8 py-3.5 rounded-2xl font-black transition-all shadow-2xl flex items-center gap-3 ${isLive ? 'bg-red-600 hover:bg-red-700 shadow-red-600/20' : 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-600/20'}`}
            >
              {isLive ? <Zap className="w-5 h-5 fill-current" /> : <Power className="w-5 h-5" />}
              {isLive ? 'End Stream' : 'Go Live Everywhere'}
            </motion.button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-10 custom-scrollbar relative">
          <AnimatePresence mode="wait">
            {activeTab === 'dashboard' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="grid grid-cols-1 xl:grid-cols-12 gap-10">
                <div className="xl:col-span-8 space-y-10">
                  {/* Virtual Feed */}
                  <div className="relative aspect-video bg-black rounded-[2.5rem] overflow-hidden shadow-2xl border border-slate-800">
                    {isLive ? (
                      <div className="relative w-full h-full">
                        <img src={`https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1200&q=80`} className="w-full h-full object-cover opacity-70" alt="Live Feed" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                        <div className="absolute top-8 left-8 flex items-center gap-4">
                          <span className="bg-red-600 px-4 py-1.5 rounded-xl text-xs font-black uppercase tracking-tighter shadow-lg">On Air</span>
                        </div>
                        <div className="absolute bottom-10 left-10">
                           <h3 className="text-3xl font-black text-white drop-shadow-2xl">{streamTitle}</h3>
                           <p className="text-slate-300 font-medium">Restreaming to {platforms.filter(p => p.active && p.connected).length} platforms via GoStream</p>
                        </div>
                      </div>
                    ) : (
                      <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-950">
                        <div className="w-20 h-20 rounded-full bg-slate-900 flex items-center justify-center mb-6">
                          <Eye className="w-10 h-10 opacity-20" />
                        </div>
                        <p className="font-black text-xl tracking-tight text-slate-700">Encoder Ready</p>
                      </div>
                    )}
                  </div>

                  {/* Platforms Section */}
                  <div className="glass-card rounded-[2.5rem] p-10">
                    <h3 className="text-xl font-black mb-8">Active Destinations</h3>
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                      {platforms.map(platform => (
                        <motion.button 
                          key={platform.id}
                          whileHover={{ y: -4 }}
                          onClick={() => handleTogglePlatform(platform.id)}
                          className={`flex flex-col items-center gap-3 p-6 rounded-3xl border transition-all ${platform.active ? 'border-indigo-500 bg-indigo-500/10' : 'border-slate-800 bg-slate-900/40 opacity-50'}`}
                        >
                          <div className={`p-4 rounded-2xl bg-slate-950 shadow-xl`}>
                            {platform.id === 'twitch' && <Twitch className="w-6 h-6" />}
                            {platform.id === 'youtube' && <Youtube className="w-6 h-6" />}
                            {platform.id === 'kick' && <Tv className="w-6 h-6" />}
                            {platform.id === 'facebook' && <Facebook className="w-6 h-6" />}
                          </div>
                          <div className="text-center">
                            <p className="font-black text-sm">{platform.name}</p>
                            <p className={`text-[9px] font-black uppercase tracking-widest mt-1 ${platform.connected ? 'text-emerald-500' : 'text-slate-500'}`}>
                              {platform.connected ? (platform.active ? 'Streaming' : 'Standby') : 'Connect'}
                            </p>
                          </div>
                        </motion.button>
                      ))}
                    </div>
                  </div>

                  {/* AI Section */}
                  <div className="glass-card rounded-[2.5rem] p-10">
                    <div className="flex items-center justify-between mb-8">
                       <h3 className="text-xl font-black">AI Signal Optimizer</h3>
                       <button onClick={handleGenerateAI} disabled={isGenerating} className="bg-indigo-600 px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest disabled:opacity-50">
                         {isGenerating ? 'Analyzing...' : 'Run Analysis'}
                       </button>
                    </div>
                    <input 
                      type="text" 
                      value={streamTitle}
                      onChange={(e) => setStreamTitle(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-2xl px-6 py-4 focus:outline-none focus:border-indigo-500 font-bold mb-6"
                      placeholder="Stream Title"
                    />
                    <AnimatePresence>
                      {aiSuggestions && (
                        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} className="grid grid-cols-2 gap-6 pt-4 border-t border-slate-800">
                          <div className="bg-slate-900/50 p-6 rounded-2xl">
                             <p className="text-[10px] font-black text-indigo-400 uppercase mb-4">Optimized Titles</p>
                             <div className="space-y-2">
                               {aiSuggestions.titles.map((t, i) => (
                                 <button key={i} onClick={() => setStreamTitle(t)} className="w-full text-left p-3 rounded-lg hover:bg-indigo-500/10 text-sm font-bold transition-all truncate">
                                   {t}
                                 </button>
                               ))}
                             </div>
                          </div>
                          <div className="bg-slate-900/50 p-6 rounded-2xl">
                             <p className="text-[10px] font-black text-cyan-400 uppercase mb-4">Reach Tags</p>
                             <div className="flex flex-wrap gap-2">
                               {aiSuggestions.tags.map((tag, i) => (
                                 <span key={i} className="bg-slate-800 px-3 py-1 rounded-lg text-xs font-bold text-slate-400 border border-slate-700">#{tag}</span>
                               ))}
                             </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                <div className="xl:col-span-4 space-y-10">
                  <div className="grid grid-cols-2 gap-6">
                    <StatCard icon={<Users className="text-cyan-400" />} label="Concurrent" value={liveMetrics.viewers.toString()} />
                    <StatCard icon={<Activity className="text-emerald-400" />} label="Bandwidth" value={(liveMetrics.bitrate/1000).toFixed(1)} sub="Mbps" />
                    <StatCard icon={<Zap className="text-amber-400" />} label="CPU Usage" value={liveMetrics.cpu.toString()} sub="%" />
                    <StatCard icon={<Clock className="text-indigo-400" />} label="Uptime" value={formatUptime(liveMetrics.uptime)} />
                  </div>

                  {/* Unified Chat */}
                  <div className="glass-card rounded-[2.5rem] flex flex-col h-[600px] shadow-2xl">
                    <div className="p-8 border-b border-slate-900 flex justify-between items-center">
                      <h3 className="font-black text-sm uppercase tracking-widest">Unified Chat</h3>
                      {isLive && <button onClick={handleAnalyzeChat} className="text-[9px] font-black bg-indigo-500/20 text-indigo-400 px-3 py-1 rounded-full border border-indigo-500/20">Analyze Sentiment</button>}
                    </div>
                    {sentiment && (
                       <div className="p-4 bg-indigo-600/10 border-b border-indigo-500/20 flex gap-4 items-center">
                          <div className="bg-indigo-600 px-2 py-1 rounded text-[9px] font-black">{sentiment.mood}</div>
                          <p className="text-[11px] text-slate-400 italic leading-snug">"{sentiment.summary}"</p>
                       </div>
                    )}
                    <div className="flex-1 overflow-y-auto p-8 space-y-4 custom-scrollbar">
                      {chatMessages.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center opacity-20">
                          <MessageSquare className="w-12 h-12 mb-2" />
                          <p className="text-xs font-black">Waiting for signal...</p>
                        </div>
                      ) : (
                        chatMessages.map(msg => (
                          <div key={msg.id} className="animate-in fade-in slide-in-from-bottom-2">
                             <div className="flex items-center gap-2 mb-1">
                                <span className={`text-[8px] font-black px-1.5 py-0.5 rounded shadow-sm text-white ${msg.platform === 'twitch' ? 'bg-[#9146FF]' : msg.platform === 'youtube' ? 'bg-red-600' : 'bg-slate-700'}`}>{msg.platform}</span>
                                <span className="text-xs font-black text-slate-300">{msg.user}</span>
                             </div>
                             <p className="text-xs text-slate-400 font-medium leading-relaxed">{msg.text}</p>
                          </div>
                        ))
                      )}
                      <div ref={chatEndRef} />
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'settings' && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="max-w-4xl mx-auto space-y-10 pb-20">
                <div className="glass-card rounded-[3rem] p-12 space-y-12">
                   <h3 className="text-3xl font-black">Encoder Settings</h3>
                   <div className="space-y-6">
                      <h4 className="text-lg font-black text-slate-400">Restream Credentials</h4>
                      <KeyItem label="Encoder Stream Key" value="gs_live_0x9218_A10xZ" onCopy={() => handleCopy('gs_live_0x9218_A10xZ')} isCopied={copiedKey === 'gs_live_0x9218_A10xZ'} />
                      <KeyItem label="RTMP Ingest Server" value="rtmp://ingest.gostream.io/live" onCopy={() => handleCopy('rtmp://ingest.gostream.io/live')} isCopied={copiedKey === 'rtmp://ingest.gostream.io/live'} />
                   </div>
                   <div className="space-y-6 pt-6 border-t border-slate-900">
                      <h4 className="text-lg font-black text-slate-400">Platform Integrations</h4>
                      <div className="grid grid-cols-2 gap-4">
                        {platforms.map(p => (
                          <div key={p.id} className="flex items-center justify-between p-4 bg-slate-900/50 rounded-2xl border border-slate-800">
                             <div className="flex items-center gap-3">
                                <div className="p-2 bg-slate-950 rounded-xl">{p.id === 'twitch' ? <Twitch className="w-4 h-4" /> : p.id === 'youtube' ? <Youtube className="w-4 h-4" /> : <Tv className="w-4 h-4" />}</div>
                                <div>
                                   <p className="text-sm font-black">{p.name}</p>
                                   <p className={`text-[9px] font-black uppercase tracking-widest ${p.connected ? 'text-emerald-500' : 'text-slate-500'}`}>{p.connected ? 'Linked' : 'Not Linked'}</p>
                                </div>
                             </div>
                             <button 
                               onClick={() => p.connected ? setPlatforms(prev => prev.map(pl => pl.id === p.id ? {...pl, connected: false, active: false} : pl)) : startConnectionFlow(p)} 
                               className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase transition-all ${p.connected ? 'bg-red-500/10 text-red-500 hover:bg-red-500/20' : 'bg-indigo-600 text-white hover:bg-indigo-700'}`}
                             >
                               {p.connected ? 'Unlink' : 'Link'}
                             </button>
                          </div>
                        ))}
                      </div>
                   </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      {/* Simulated OAuth Modal */}
      <AnimatePresence>
        {connectingPlatform && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/80 backdrop-blur-md z-[200]" />
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-sm px-6 py-12 glass-card rounded-[3rem] z-[201] text-center border-white/10 shadow-3xl">
               <div className="w-32 h-32 overflow-hidden rounded-3xl bg-indigo-600/10 mx-auto mb-10 shadow-2xl shadow-indigo-600/10 p-3">
                  <img 
                    src="https://i.ibb.co/TxZJ2P8t/0f31aca9-0ffc-4930-9edb-b27082c022fc-fotor-bg-remover-20260108133716.png" 
                    alt="GoStream Logo" 
                    className="w-full h-full object-contain animate-pulse"
                  />
               </div>
               <h2 className="text-3xl font-black mb-3 leading-tight">Connecting to {connectingPlatform.name}</h2>
               <p className="text-slate-400 text-base mb-10 font-medium px-8">Establishing encrypted handshake with platform servers...</p>
               
               <div className="space-y-6 px-4">
                  <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                     <motion.div initial={{ width: 0 }} animate={{ width: `${(connectionStep/3)*100}%` }} className="h-full bg-indigo-500 shadow-[0_0_20px_rgba(99,102,241,0.5)]" />
                  </div>
                  <div className="flex justify-between text-[11px] font-black uppercase tracking-widest text-slate-500">
                     <span className={connectionStep >= 1 ? 'text-indigo-400' : ''}>Handshake</span>
                     <span className={connectionStep >= 2 ? 'text-indigo-400' : ''}>Token Swap</span>
                     <span className={connectionStep >= 3 ? 'text-indigo-400' : ''}>Finalizing</span>
                  </div>
               </div>
               
               <div className="mt-12 flex items-center justify-center gap-3 text-xs text-amber-500 font-bold bg-amber-500/10 p-5 rounded-2xl border border-amber-500/20">
                  <AlertCircle className="w-5 h-5" />
                  Do not interrupt the connection process
               </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

const SidebarItem: React.FC<{icon: React.ReactNode, label: string, active: boolean, collapsed: boolean, onClick: () => void}> = ({ icon, label, active, collapsed, onClick }) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center ${collapsed ? 'justify-center' : 'justify-start gap-4'} p-4 rounded-2xl transition-all relative ${active ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-600/20 font-black' : 'text-slate-500 hover:bg-slate-900/50 hover:text-slate-300 font-bold'}`}
  >
    <div className="w-5 h-5">{icon}</div>
    {!collapsed && <span className="text-sm tracking-tight">{label}</span>}
  </button>
);

const StatCard: React.FC<{icon: React.ReactNode, label: string, value: string, sub?: string}> = ({ icon, label, value, sub }) => (
  <div className="glass-card p-6 rounded-3xl border border-white/5 relative group transition-all hover:border-white/10">
    <div className="flex items-center gap-3 mb-4">
      <div className="p-2 rounded-xl bg-slate-900">{icon}</div>
      <span className="text-[9px] uppercase tracking-[0.2em] font-black text-slate-500">{label}</span>
    </div>
    <div className="flex items-baseline gap-1">
      <p className="text-2xl font-black">{value}</p>
      {sub && <span className="text-[10px] font-bold text-slate-600 uppercase">{sub}</span>}
    </div>
  </div>
);

const KeyItem: React.FC<{label: string, value: string, onCopy: () => void, isCopied: boolean}> = ({ label, value, onCopy, isCopied }) => (
  <div className="flex items-center justify-between p-5 bg-slate-900/60 rounded-2xl border border-white/5 shadow-inner">
    <div className="space-y-1">
      <span className="text-slate-600 font-black uppercase text-[9px] tracking-widest">{label}</span>
      <p className="text-indigo-400 text-xs font-mono font-bold">{isCopied ? '********' : value}</p>
    </div>
    <button onClick={onCopy} className={`p-2.5 rounded-xl transition-all ${isCopied ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-800 text-slate-400'}`}>
      {isCopied ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
    </button>
  </div>
);

export default Dashboard;