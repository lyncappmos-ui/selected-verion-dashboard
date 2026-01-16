
import React, { useEffect, useState } from 'react';
import { mosClient } from '../services/mosClient';
import { Branch } from '../types';
import { Building2, Users, Bus, ArrowRight, Activity } from 'lucide-react';

export const Branches: React.FC = () => {
  const [branches, setBranches] = useState<Branch[]>([]);

  useEffect(() => {
    mosClient.getBranches().then(setBranches);
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Branch Operations</h1>
          <p className="text-slate-500 text-sm">Managing resources across multi-branch environments.</p>
        </div>
        <button className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold shadow-lg shadow-slate-200">
          Register New Hub
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {branches.map(b => (
          <div key={b.id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-lg transition-all group">
            <div className="flex justify-between items-start mb-6">
              <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center transition-colors group-hover:bg-blue-600 group-hover:text-white">
                <Building2 size={24} />
              </div>
              <span className="px-2 py-1 bg-emerald-50 text-emerald-600 rounded text-[10px] font-black uppercase tracking-tight">
                {b.status}
              </span>
            </div>
            
            <h3 className="text-lg font-bold text-slate-800">{b.name}</h3>
            <p className="text-slate-400 text-xs font-medium mb-6">Managed by {b.manager}</p>

            <div className="grid grid-cols-2 gap-4 py-6 border-y border-slate-50">
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 text-slate-400 text-[10px] font-bold uppercase">
                  <Bus size={12} /> Fleet
                </div>
                <p className="text-xl font-bold text-slate-800">{b.vehicleCount}</p>
              </div>
              <div className="space-y-1 text-right">
                <div className="flex items-center justify-end gap-1.5 text-slate-400 text-[10px] font-bold uppercase">
                  <Users size={12} /> Crew
                </div>
                <p className="text-xl font-bold text-slate-800">{b.crewCount}</p>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-between">
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Revenue (Today)</p>
                <p className="text-sm font-bold text-slate-800">KES {b.revenueToday.toLocaleString()}</p>
              </div>
              <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                <ArrowRight size={20} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
