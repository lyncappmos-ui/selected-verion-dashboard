
import React from 'react';
import { coreClient } from '../services/coreClient';
import { useCore } from '../hooks/useCore';
import { Vehicle } from '../types';
import { Truck, Search, ShieldCheck, RefreshCw, AlertCircle } from 'lucide-react';

export const Vehicles: React.FC = () => {
  const { data: vehicles, syncState, isBroken, reset, retry } = useCore<Vehicle[]>(coreClient.getVehicles, 60000);

  if (isBroken) {
    return (
      <div className="p-10 text-center bg-white rounded-3xl border border-rose-100 flex flex-col items-center">
        <AlertCircle className="text-rose-500 mb-4" size={40} />
        <h2 className="text-xl font-bold">Fleet Registry Unavailable</h2>
        <p className="text-slate-500 mt-2 text-sm max-w-xs">MOS Core has timed out repeatedly. State integrity is now managed via isolated local snapshots.</p>
        <button onClick={reset} className="mt-6 px-8 py-2 bg-slate-900 text-white rounded-xl font-bold text-xs">Reload Fleet State</button>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-emerald-500';
      case 'maintenance': return 'bg-amber-500';
      case 'idle': return 'bg-slate-400';
      case 'offline': return 'bg-rose-500';
      default: return 'bg-slate-300';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Fleet Control</h1>
          <p className="text-slate-500 text-sm">Real-time status tracking for authorized assets.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative hidden md:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input type="text" placeholder="Search Registration..." className="pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold outline-none w-64" />
          </div>
          <button onClick={() => retry()} className="p-2 text-slate-400 hover:text-blue-600 transition-all">
            <RefreshCw size={20} className={syncState === 'SYNCING' ? 'animate-spin' : ''} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {(vehicles || []).map(v => (
          <div key={v.registration} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex justify-between items-start mb-6">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-slate-50 text-slate-500 rounded-xl"><Truck size={24} /></div>
                <div>
                  <h3 className="text-lg font-bold text-slate-800 uppercase tracking-tight">{v.registration}</h3>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className={`w-2 h-2 rounded-full ${getStatusColor(v.status)}`}></span>
                    <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">{v.status}</span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Trust</p>
                <p className="text-sm font-bold text-emerald-600 flex items-center gap-1 justify-end">
                  <ShieldCheck size={14} /> {v.trustScore}%
                </p>
              </div>
            </div>

            <div className="space-y-3 py-4 border-y border-slate-50 text-xs font-medium">
              <div className="flex justify-between">
                <span className="text-slate-400">Route</span>
                <span className="text-slate-800 font-bold">{v.route}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Hub</span>
                <span className="text-slate-800 font-bold">{v.branch}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Driver</span>
                <span className="text-slate-800 font-bold">{v.driver}</span>
              </div>
            </div>

            <div className="mt-6 flex gap-2">
              <button className="flex-1 py-2 text-[10px] font-black uppercase bg-slate-50 text-slate-600 rounded-lg hover:bg-slate-100 transition-all">Reassign</button>
              <button className="flex-1 py-2 text-[10px] font-black uppercase bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-all">Audit Log</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
