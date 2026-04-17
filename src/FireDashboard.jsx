import React, { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { motion } from 'framer-motion';
import { Activity, Thermometer, Zap, ShieldAlert, ShieldCheck, AlertTriangle, Radio } from 'lucide-react';

// --- Sub-Components ---

const GlassCard = ({ children, className = "" }) => (
  <motion.div 
    whileHover={{ translateY: -5, boxShadow: "0px 0px 20px rgba(0, 255, 255, 0.2)" }}
    className={`bg-slate-900/50 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-2xl ${className}`}
  >
    {children}
  </motion.div>
);

const StatusBadge = ({ status }) => {
  const configs = {
    SAFE: { 
      color: "text-emerald-400", 
      bg: "bg-emerald-500/10", 
      border: "border-emerald-500/50", 
      icon: ShieldCheck, 
      glow: "shadow-[0_0_15px_rgba(16,185,129,0.3)]" 
    },
    WARNING: { 
      color: "text-amber-400", 
      bg: "bg-amber-500/10", 
      border: "border-amber-500/50", 
      icon: AlertTriangle, 
      glow: "shadow-[0_0_15px_rgba(245,158,11,0.3)]" 
    },
    DANGER: { 
      color: "text-rose-500", 
      bg: "bg-rose-500/20", 
      border: "border-rose-500/50", 
      icon: ShieldAlert, 
      glow: "shadow-[0_0_20px_rgba(225,29,72,0.5)] animate-pulse" 
    },
  };

  const Config = configs[status];
  const Icon = Config.icon;

  return (
    <div className={`flex items-center gap-2 px-4 py-2 rounded-full border ${Config.bg} ${Config.color} ${Config.border} ${Config.glow} transition-all duration-500`}>
      <Icon size={20} />
      <span className="font-bold tracking-wider">{status}</span>
    </div>
  );
};

// --- Main Dashboard ---

export default function FireDashboard() {
  const [loading, setLoading] = useState(true);
  const [isSimulating, setIsSimulating] = useState(true);
  const [data, setData] = useState([]);
  const [metrics, setMetrics] = useState({ temp: 24, current: 1.2, status: 'SAFE' });

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2000);
    
    const interval = setInterval(() => {
      if (!isSimulating) return;

      const newTemp = Math.floor(Math.random() * (metrics.status === 'DANGER' ? 40 : 15)) + (metrics.status === 'DANGER' ? 70 : 25);
      const newCurrent = parseFloat((Math.random() * 5 + 0.5).toFixed(2));
      
      let newStatus = 'SAFE';
      if (newTemp > 80 || newCurrent > 4.5) newStatus = 'DANGER';
      else if (newTemp > 50 || newCurrent > 3.0) newStatus = 'WARNING';

      setMetrics({ temp: newTemp, current: newCurrent, status: newStatus });
      
      setData(prev => {
        const newData = [...prev, { time: new Date().toLocaleTimeString().slice(3, 8), temp: newTemp, current: newCurrent }];
        return newData.slice(-15);
      });
    }, 2000);

    return () => {
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, [isSimulating, metrics.status]);

  if (loading) {
    return (
      <div className="h-screen w-full bg-slate-950 flex flex-col items-center justify-center text-center p-4">
        <motion.div 
          animate={{ rotate: 360 }} 
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
          className="w-16 h-16 border-4 border-cyan-500 border-t-transparent rounded-full shadow-[0_0_15px_rgba(6,182,212,0.5)]"
        />
        <p className="text-cyan-500 mt-4 font-mono tracking-widest animate-pulse">INITIALIZING AI SYSTEMS...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 md:p-8 relative overflow-x-hidden">
      
      {/* Background Decor */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-cyan-500/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[10%] right-[0%] w-[30%] h-[30%] bg-blue-600/10 blur-[120px] rounded-full" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Header Section */}
        <header className="flex flex-col md:flex-row justify-between items-center mb-10 gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-black bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400 tracking-tighter">
              SMART <span className="text-cyan-400">AI</span> FIRE PREVENTION
            </h1>
            <p className="text-slate-500 font-mono text-sm mt-1 flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
              </span>
              INDUSTRIAL MONITORING NODE // AX-72
            </p>
          </div>
          
          <div className="flex items-center gap-6 bg-slate-800/40 p-2 rounded-2xl border border-white/5 backdrop-blur-md">
            <div className="flex items-center gap-3 px-4">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Simulation</span>
              <button 
                onClick={() => setIsSimulating(!isSimulating)}
                className={`w-12 h-6 rounded-full transition-colors relative ${isSimulating ? 'bg-cyan-500' : 'bg-slate-600'}`}
              >
                <motion.div 
                  animate={{ x: isSimulating ? 26 : 4 }}
                  className="absolute top-1 w-4 h-4 bg-white rounded-full shadow-lg"
                />
              </button>
            </div>
            <StatusBadge status={metrics.status} />
          </div>
        </header>

        {/* Top Metric Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <GlassCard className="border-l-4 border-l-cyan-500">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-slate-400 text-sm font-medium uppercase tracking-wider">Internal Temperature</p>
                <h2 className="text-5xl font-bold mt-2 text-white tabular-nums">
                  {metrics.temp}<span className="text-2xl text-cyan-500">°C</span>
                </h2>
              </div>
              <div className="p-3 bg-cyan-500/10 rounded-xl text-cyan-400">
                <Thermometer size={28} />
              </div>
            </div>
            <div className="mt-4 h-1 w-full bg-slate-800 rounded-full overflow-hidden">
              <motion.div 
                animate={{ width: `${Math.min((metrics.temp / 120) * 100, 100)}%` }}
                className={`h-full ${metrics.temp > 70 ? 'bg-rose-500 shadow-[0_0_10px_#f43f5e]' : 'bg-cyan-500'}`}
              />
            </div>
          </GlassCard>

          <GlassCard className="border-l-4 border-l-blue-500">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-slate-400 text-sm font-medium uppercase tracking-wider">Load Current</p>
                <h2 className="text-5xl font-bold mt-2 text-white tabular-nums">
                  {metrics.current}<span className="text-2xl text-blue-500">A</span>
                </h2>
              </div>
              <div className="p-3 bg-blue-500/10 rounded-xl text-blue-400">
                <Zap size={28} />
              </div>
            </div>
            <div className="mt-4 h-1 w-full bg-slate-800 rounded-full overflow-hidden">
              <motion.div 
                animate={{ width: `${Math.min((metrics.current / 10) * 100, 100)}%` }}
                className="h-full bg-blue-500 shadow-[0_0_10px_#3b82f6]"
              />
            </div>
          </GlassCard>

          <GlassCard className="border-l-4 border-l-purple-500">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-slate-400 text-sm font-medium uppercase tracking-wider">AI Confidence</p>
                <h2 className="text-5xl font-bold mt-2 text-white tabular-nums">
                  99<span className="text-2xl text-purple-500">%</span>
                </h2>
              </div>
              <div className="p-3 bg-purple-500/10 rounded-xl text-purple-400">
                <Activity size={28} />
              </div>
            </div>
            <p className="mt-4 text-xs text-slate-500 font-mono italic">
              Analyzing thermal patterns... Nominal.
            </p>
          </GlassCard>
        </div>

        {/* AI Chart Section */}
        <GlassCard className="p-0 overflow-hidden border border-white/5 bg-slate-900/30">
          <div className="p-6 border-b border-white/5 flex justify-between items-center bg-white/5">
            <h3 className="text-lg font-bold flex items-center gap-2">
              <Radio size={18} className="text-cyan-400" />
              REAL-TIME NEURAL ANALYSIS
            </h3>
            <div className="flex gap-4 text-xs font-mono">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-cyan-500 shadow-[0_0_8px_#06b6d4]" />
                <span className="text-slate-400">TEMP</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-blue-500 shadow-[0_0_8px_#3b82f6]" />
                <span className="text-slate-400">CURRENT</span>
              </div>
            </div>
          </div>
          
          <div className="h-[400px] w-full p-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorTemp" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorCurr" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis dataKey="time" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                  itemStyle={{ fontSize: '12px' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="temp" 
                  stroke="#06b6d4" 
                  strokeWidth={3}
                  fillOpacity={1} 
                  fill="url(#colorTemp)" 
                  isAnimationActive={false}
                />
                <Area 
                  type="monotone" 
                  dataKey="current" 
                  stroke="#3b82f6" 
                  strokeWidth={3}
                  fillOpacity={1} 
                  fill="url(#colorCurr)" 
                  isAnimationActive={false}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        <footer className="mt-8 text-center text-slate-600 text-xs font-mono tracking-widest uppercase">
          SECURE PROTOCOL v4.0.2 // AI FIRE PREVENTION SYSTEM // ENCRYPTED NODE
        </footer>
      </div>
    </div>
  );
}