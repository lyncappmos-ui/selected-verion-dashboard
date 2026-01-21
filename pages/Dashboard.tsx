
import React, { useEffect, useState } from 'react';
import { mosClient } from '../services/mosClient';
import { AdminOverview } from '../types';
import { TrendingUp, Users, Bus, ShieldCheck, AlertTriangle, Activity, Zap, Clock, Globe, CheckCircle, XCircle } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const StatCard: React.FC<{ title: string; value: string | number; icon: React.ReactNode; color: string }> = ({ title, value, icon, color }) => (
  <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm transition-all hover:shadow-md">
    <div className={`w-10 h-10 rounded-xl ${color} bg-opacity-10 text-${color.replace('bg-', '')} flex items-center justify-center mb-4`}>
      {icon}
    </div>
    <p className="text-slate-400 text-xs font-black uppercase tracking-widest">{title}</p>
    <p className="text-2xl font-bold text-slate-800 mt-1">{value}</p>
  </div>
);

export const Dashboard: React.FC = () => {
  const [data, setData] = useState<AdminOverview | null>(null);
  const [events, setEvents] = useState<{ id: string, name: string, time: string, desc: string }[]>([]);
  const [health, setHealth] = useState<{ status: 'checking' | 'connected' | 'failed', message?: string }>({ status: 'checking' });

  useEffect(() => {
    // Initial data fetch
    mosClient.getAdminOverview().then(setData);

    // Explicit Health Check to MOS Core
    const runHealthCheck = async () => {
      try {
        const healthData = await mosClient.checkCore();
        if (healthData) {
          setHealth({ status: 'connected', message: healthData.status || 'Systems Operational' });
        } else {
          setHealth({ status: 'failed', message: 'Core Unreachable (Simulation Active)' });
        }
      } catch (err) {
        setHealth({ status: 'failed', message: 'Connection Refused' });
      }
    };

    runHealthCheck();
    const healthInterval = setInterval(runHealthCheck, 10000);

    // Initial mock events
    setEvents([
      { id: '1', name: 'TICKET_ISSUED', time: '14:22', desc: 'KES 250 - Thika Hub' },
      { id: '2', name: 'ROUTE_DEVIATION', time: '14:15', desc: 'KDA 123A variance detected' },
      { id: '3', name: 'SHIFT_START', time: '14:00', desc: '4 crew onboarded - Westside' }
    ]);

    return () => clearInterval(healthInterval);
  }, []);

  if (!data) return <div className="p-12 text-center animate-pulse text-slate-400 font-bold">Synchronising with MOS Core...</div>;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">System Status</h1>
          <p className="text-slate-500 text-sm">Real-time performance metrics computed by MOS Core engine.</p>
        </div>
        
        {/* Core Diagnostics Panel */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 flex items-center gap-4 shadow-sm min-w-[280px]">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
            health.status === 'connected' ? 'bg-emerald-50 text-emerald-600' : 
            health.status === 'failed' ? 'bg-rose-50 text-rose-600' : 'bg-slate-50 text-slate-400'
          }`}>
            {health.status === 'connected' ? <CheckCircle size={20} /> : 
             health.status === 'failed' ? <XCircle size={20} /> : <Activity size={20} className="animate-spin" />}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Core Diagnostic</span>
              {health.status === 'connected' && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>}
            </div>
            <p className="text-xs font-bold text-slate-700 truncate max-w-[180px]">{health.message || 'Probing v1/health...'}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-5">
        <StatCard title="Revenue" value={`KES ${data.revenueToday.toLocaleString()}`} icon={<TrendingUp size={20} />} color="bg-blue-600" />
        <StatCard title="Trips" value={data.activeTrips} icon={<Activity size={20} />} color="bg-purple-600" />
        <StatCard title="Fleet" value={data.activeVehicles} icon={<Bus size={20} />} color="bg-amber-600" />
        <StatCard title="Trust" value={`${data.trustIndex}%`} icon={<ShieldCheck size={20} />} color="bg-emerald-600" />
        <StatCard title="Alerts" value={data.fraudAlerts} icon={<AlertTriangle size={20} />} color="bg-rose-600" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <h3 className="font-bold text-slate-800 text-sm uppercase tracking-wider">Revenue Velocity (24h)</h3>
            <div className="text-[10px] font-bold text-slate-400">Values in KES</div>
          </div>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data.hourlyRevenue}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="hour" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10}} />
                <Tooltip 
                  contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 40px rgba(0,0,0,0.1)', fontWeight: 'bold'}} 
                />
                <Line type="monotone" dataKey="amount" stroke="#2563eb" strokeWidth={4} dot={{r: 4, fill: '#2563eb', strokeWidth: 2, stroke: '#fff'}} activeDot={{r: 6}} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm flex flex-col">
          <div className="flex items-center gap-2 mb-6">
            <Zap size={18} className="text-amber-500" />
            <h3 className="font-bold text-slate-800 text-sm uppercase tracking-wider">Live Operational Feed</h3>
          </div>
          <div className="flex-1 space-y-4 overflow-y-auto max-h-[320px] pr-2">
            {events.length === 0 ? (
              <p className="text-slate-400 text-xs italic text-center py-10">Waiting for events from Core...</p>
            ) : (
              events.map((evt) => (
                <div key={evt.id} className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-start gap-3 group hover:border-blue-200 transition-colors">
                  <div className="mt-1 w-1.5 h-1.5 rounded-full bg-blue-600 group-hover:animate-ping"></div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-0.5">
                      <span className="text-[10px] font-black text-slate-700 tracking-tight uppercase">{evt.name}</span>
                      <span className="text-[10px] text-slate-400 flex items-center gap-1"><Clock size={10} /> {evt.time}</span>
                    </div>
                    <p className="text-xs text-slate-500 truncate">{evt.desc}</p>
                  </div>
                </div>
              ))
            )}
          </div>
          <button className="mt-6 w-full py-2 bg-slate-50 text-slate-500 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-100 transition-colors">
            View System Log
          </button>
        </div>
      </div>
    </div>
  );
};
