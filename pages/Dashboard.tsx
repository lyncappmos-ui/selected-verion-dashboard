
import React, { useEffect, useState, useCallback } from 'react';
import { mosClient, parseCoreResponse } from '../services/mosClient';
import { AdminOverview, CoreSyncState } from '../types';
import { 
  TrendingUp, Users, Bus, ShieldCheck, AlertTriangle, 
  Activity, Zap, Clock, AlertCircle, RefreshCw 
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { CoreStatusBanner } from '../components/CoreStatusBanner';

/**
 * Defensive Formatters
 * Guaranteed never to crash on undefined/null.
 */
const safeCurrency = (val: number | undefined | null, locale = 'en-KE') => {
  const value = val ?? 0;
  return `KES ${value.toLocaleString(locale, { minimumFractionDigits: 0 })}`;
};

const safeNumber = (val: number | undefined | null) => {
  const value = val ?? 0;
  return value.toLocaleString();
};

const StatCard: React.FC<{ title: string; value: string | number; icon: React.ReactNode; color: string; disabled?: boolean }> = ({ title, value, icon, color, disabled }) => (
  <div className={`bg-white p-6 rounded-2xl border border-slate-200 shadow-sm transition-all ${disabled ? 'opacity-40 grayscale' : 'hover:shadow-md'}`}>
    <div className={`w-10 h-10 rounded-xl ${color} bg-opacity-10 text-${color.replace('bg-', '')} flex items-center justify-center mb-4`}>
      {icon}
    </div>
    <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">{title}</p>
    <p className="text-2xl font-bold text-slate-800 mt-1 truncate">{disabled ? '---' : value}</p>
  </div>
);

export const Dashboard: React.FC = () => {
  const [data, setData] = useState<AdminOverview | null>(null);
  const [syncState, setSyncState] = useState<CoreSyncState>('SYNCING');
  const [lastSync, setLastSync] = useState<string>('');

  const performSync = useCallback(async () => {
    // Phase 4: Snapshot-First. Keep current data if syncing fails.
    const res = await mosClient.getAdminOverview();
    const parsed = parseCoreResponse(res);
    
    if (parsed.data) setData(parsed.data);
    setSyncState(parsed.syncState);
    setLastSync(new Date().toISOString());
  }, []);

  useEffect(() => {
    performSync();
    const interval = setInterval(performSync, 10000);
    return () => clearInterval(interval);
  }, [performSync]);

  // Phase 3: Block unsafe rendering if still initial syncing
  if (syncState === 'SYNCING' && !data) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4 animate-pulse">
        <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center shadow-xl shadow-blue-200">
          <Zap size={32} className="text-white" fill="white" />
        </div>
        <div className="text-center">
          <p className="text-slate-800 font-black uppercase tracking-widest text-[10px]">LyncApp MOS Core Bridge</p>
          <p className="text-slate-400 text-xs mt-1">Acquiring Authoritative State Registry...</p>
        </div>
      </div>
    );
  }

  const isDegraded = syncState === 'OFFLINE' || syncState === 'DEGRADED';
  const isBlocked = syncState === 'SYNCING' && !data;

  return (
    <div className="space-y-0 -m-8">
      {/* Explicit Status Banner */}
      <CoreStatusBanner state={syncState} lastSync={lastSync} />

      <div className="p-8 space-y-8 animate-in fade-in duration-500">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Executive Control</h1>
            <p className="text-slate-500 text-sm font-medium">Real-time telemetry and financial fidelity logs.</p>
          </div>
          
          <button 
            onClick={performSync}
            disabled={syncState === 'SYNCING'}
            className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-600 hover:bg-slate-50 flex items-center gap-2 transition-all shadow-sm"
          >
            <RefreshCw size={12} className={syncState === 'SYNCING' ? 'animate-spin' : ''} /> Force Sync
          </button>
        </div>

        {/* Resilience Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-5">
          <StatCard 
            title="Total Revenue" 
            value={safeCurrency(data?.revenueToday)} 
            icon={<TrendingUp size={20} />} 
            color="bg-blue-600" 
            disabled={isBlocked}
          />
          <StatCard 
            title="Live Trips" 
            value={safeNumber(data?.activeTrips)} 
            icon={<Activity size={20} />} 
            color="bg-purple-600" 
            disabled={isBlocked}
          />
          <StatCard 
            title="Active Fleet" 
            value={safeNumber(data?.activeVehicles)} 
            icon={<Bus size={20} />} 
            color="bg-amber-600" 
            disabled={isBlocked}
          />
          <StatCard 
            title="Trust Index" 
            value={`${safeNumber(data?.trustIndex)}%`} 
            icon={<ShieldCheck size={20} />} 
            color="bg-emerald-600" 
            disabled={isBlocked}
          />
          <StatCard 
            title="Fraud Alerts" 
            value={safeNumber(data?.fraudAlerts)} 
            icon={<AlertTriangle size={20} />} 
            color="bg-rose-600" 
            disabled={isBlocked}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-8">
              <h3 className="font-bold text-slate-800 text-sm uppercase tracking-wider">Revenue Velocity (24h)</h3>
              <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                {isDegraded ? 'Delayed Telemetry' : 'Real-time Units in KES'}
              </div>
            </div>
            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data?.hourlyRevenue || []}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis 
                    dataKey="hour" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 700}} 
                    dy={10} 
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 700}} 
                  />
                  <Tooltip 
                    contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 40px rgba(0,0,0,0.1)', fontWeight: 'bold'}} 
                  />
                  <Line 
                    type="monotone" 
                    dataKey="amount" 
                    stroke={isDegraded ? "#94a3b8" : "#2563eb"} 
                    strokeWidth={4} 
                    dot={{r: 4, fill: isDegraded ? "#cbd5e1" : "#2563eb", strokeWidth: 2, stroke: '#fff'}} 
                    activeDot={{r: 6}} 
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm flex flex-col">
            <div className="flex items-center gap-2 mb-6">
              <Zap size={18} className="text-amber-500" fill="currentColor" />
              <h3 className="font-bold text-slate-800 text-sm uppercase tracking-wider">Operational Integrity Feed</h3>
            </div>
            <div className="flex-1 space-y-4">
              {isDegraded && (
                <div className="p-4 bg-amber-50 border border-amber-100 rounded-2xl flex gap-3 text-amber-800">
                  <AlertCircle size={16} className="shrink-0" />
                  <p className="text-[10px] font-bold uppercase tracking-wide">Live Feed Paused. Core connectivity unstable.</p>
                </div>
              )}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-start gap-3">
                <div className="mt-1 w-1.5 h-1.5 rounded-full bg-blue-600"></div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-0.5">
                    <span className="text-[10px] font-black text-slate-700 uppercase tracking-widest">System Boot</span>
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Recent</span>
                  </div>
                  <p className="text-xs text-slate-500 font-medium truncate">State Registry Synchronized.</p>
                </div>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-start gap-3 opacity-60">
                <div className="mt-1 w-1.5 h-1.5 rounded-full bg-slate-400"></div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-0.5">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Audit Event</span>
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">2m ago</span>
                  </div>
                  <p className="text-xs text-slate-500 font-medium truncate">Fidelity check completed.</p>
                </div>
              </div>
            </div>
            <button 
              disabled={syncState === 'READ_ONLY'}
              className="mt-6 w-full py-3 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-800 transition-colors disabled:opacity-30 disabled:cursor-not-allowed shadow-xl shadow-slate-200"
            >
              System Command Console
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
