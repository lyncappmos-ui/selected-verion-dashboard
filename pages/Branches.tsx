
import React from 'react';
import { coreClient } from '../services/coreClient';
import { useCore } from '../hooks/useCore';
import { Branch } from '../types';
import { Building2, Bus, Users, ArrowRight, AlertTriangle } from 'lucide-react';

export const Branches: React.FC = () => {
  const { data: branches, syncState, isBroken, reset } = useCore<Branch[]>(coreClient.getBranches);

  if (isBroken) {
    return (
      <div className="p-10 text-center bg-white rounded-3xl border border-rose-100">
        <AlertTriangle className="mx-auto text-rose-500 mb-4" size={40} />
        <h2 className="text-xl font-bold">Circuit Breaker Triggered</h2>
        <p className="text-slate-500 mt-2 text-sm">Persistent branch synchronization failure detected.</p>
        <button onClick={reset} className="mt-6 px-8 py-2 bg-slate-900 text-white rounded-xl font-bold text-xs uppercase tracking-widest">Restart Hub Sync</button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Branch Operations</h1>
          <p className="text-slate-500 text-sm">Managing distributed resource networks.</p>
        </div>
        <div className="text-[10px] font-black uppercase text-slate-400">
          Sync State: <span className={syncState === 'READY' ? 'text-emerald-500' : 'text-amber-500'}>{syncState}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {(branches || []).map(b => (
          <div key={b.id} className="bg-white p-6 rounded-2xl border border-slate-200 hover:shadow-lg transition-all">
            <div className="flex justify-between mb-6">
              <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
                <Building2 size={24} />
              </div>
              <span className="px-2 py-1 bg-emerald-50 text-emerald-600 rounded text-[10px] font-black uppercase">
                {b.status}
              </span>
            </div>
            
            <h3 className="text-lg font-bold text-slate-800">{b.name}</h3>
            <p className="text-slate-400 text-xs mb-6">Manager: {b.manager}</p>

            <div className="grid grid-cols-2 gap-4 py-4 border-y border-slate-50">
              <div>
                <div className="flex items-center gap-1.5 text-slate-400 text-[10px] font-bold uppercase mb-1">
                  <Bus size={12} /> Fleet
                </div>
                <p className="text-xl font-bold text-slate-800">{b.vehicleCount}</p>
              </div>
              <div className="text-right">
                <div className="flex items-center justify-end gap-1.5 text-slate-400 text-[10px] font-bold uppercase mb-1">
                  <Users size={12} /> Crew
                </div>
                <p className="text-xl font-bold text-slate-800">{b.crewCount}</p>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-between">
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Today's Revenue</p>
                <p className="text-sm font-bold text-slate-800">KES {b.revenueToday.toLocaleString()}</p>
              </div>
              <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"><ArrowRight size={20} /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
