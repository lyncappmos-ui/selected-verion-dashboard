
import React from 'react';
import { coreClient } from '../services/coreClient';
import { useCore } from '../hooks/useCore';
import { AdminOverview } from '../types';
import { 
  TrendingUp, Users, Bus, ShieldCheck, AlertTriangle, 
  Activity, Zap, AlertCircle, RefreshCw 
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { CoreStatusBanner } from '../components/CoreStatusBanner';

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
  const { data, syncState, lastSync, isBroken, reset, retry } = useCore<AdminOverview>(coreClient.getOverview, 15000);

  if (isBroken) {
    return (
      <div className="min-h-[400px] flex flex-col items-center justify-center p-8 bg-white rounded-3xl border border-rose-100 shadow-xl text-center">
        <div className="w-16 h-16 bg-rose-50 text-rose-600 rounded-full flex items-center justify-center mb-6">
          <AlertCircle size={32} />
        </div>
        <h2 className="text-xl font-bold text-slate-900">Rendering Circuit Breaker</h2>
        <p className="text-slate-500 text-sm mt-2 max-w-md">
          The dashboard encountered persistent MOS Core connection failures. Operational integrity is maintained via local snapshots.
        </p>
        <button 
          onClick={reset}
          className="mt-8 px-6 py-2.5 bg-slate-900 text-white rounded-xl text-xs font-black uppercase tracking-widest flex items-center gap-2"
        >
          <RefreshCw size={14} /> Reconnect Interface
        </button>
      </div>
    );
  }

  if (syncState === 'SYNCING' && !data) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4 animate-pulse">
        <Zap size={32} className="text-blue-600" />
        <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Bridging MOS Core...</p>
      </div>
    );
  }

  const isDegraded = syncState === 'OFFLINE' || syncState === 'DEGRADED';

  return (
    <div className="space-y-0 -m-8">
      <CoreStatusBanner state={syncState} lastSync={lastSync} />

      <div className="p-8 space-y-8 animate-in fade-in duration-500">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Executive Control</h1>
            <p className="text-slate-500 text-sm">Real-time telemetry and financial fidelity logs.</p>
          </div>
          <button 
            onClick={() => retry()}
            className="p-2 text-slate-400 hover:text-blue-600 transition-colors"
          >
            <RefreshCw size={18} className={syncState === 'SYNCING' ? 'animate-spin' : ''} />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-5">
          <StatCard title="Total Revenue" value={`KES ${(data?.revenueToday || 0).toLocaleString()}`} icon={<TrendingUp size={20} />} color="bg-blue-600" />
          <StatCard title="Live Trips" value={data?.activeTrips || 0} icon={<Activity size={20} />} color="bg-purple-600" />
          <StatCard title="Active Fleet" value={data?.activeVehicles || 0} icon={<Bus size={20} />} color="bg-amber-600" />
          <StatCard title="Trust Index" value={`${data?.trustIndex || 0}%`} icon={<ShieldCheck size={20} />} color="bg-emerald-600" />
          <StatCard title="Fraud Alerts" value={data?.fraudAlerts || 0} icon={<AlertTriangle size={20} />} color="bg-rose-600" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
            <h3 className="font-bold text-slate-800 text-sm uppercase tracking-wider mb-8">Revenue Velocity (24h)</h3>
            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data?.hourlyRevenue || []}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="hour" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10}} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10}} />
                  <Tooltip />
                  <Line type="monotone" dataKey="amount" stroke={isDegraded ? "#94a3b8" : "#2563eb"} strokeWidth={4} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
            <h3 className="font-bold text-slate-800 text-sm uppercase tracking-wider mb-6">Integrity Feed</h3>
            <div className="space-y-4">
              <div className="p-3 bg-slate-50 rounded-xl flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shadow-lg shadow-emerald-200"></div>
                <div>
                  <p className="text-[10px] font-black uppercase text-slate-400 mb-0.5">MOS Status</p>
                  <p className="text-xs text-slate-700 font-bold">State Registry Synchronized.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
