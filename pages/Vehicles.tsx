
import React, { useEffect, useState, useCallback } from 'react';
import { mosClient, unwrapCoreData } from '../services/mosClient';
import { Vehicle, CoreSyncState } from '../types';
import { Truck, Search, RefreshCw, Clock } from 'lucide-react';

export const Vehicles: React.FC = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [syncState, setSyncState] = useState<CoreSyncState>('SYNCING');

  const fetchVehicles = useCallback(async () => {
    const response = await mosClient.getVehicles();
    const data = unwrapCoreData(response, setSyncState);
    if (data) setVehicles(data);
  }, []);

  useEffect(() => {
    fetchVehicles();
  }, [fetchVehicles]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-emerald-500';
      case 'maintenance': return 'bg-amber-500';
      case 'idle': return 'bg-slate-400';
      case 'offline': return 'bg-rose-500';
      default: return 'bg-slate-300';
    }
  };

  if (syncState === 'SYNCING' && vehicles.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-slate-400">
        <Clock className="animate-spin mb-4" size={32} />
        <p className="text-sm font-bold uppercase tracking-widest text-center">Polling Fleet Telemetry...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Fleet Control</h1>
          <p className="text-slate-500 text-sm">Real-time status and assignment overview for all vehicles.</p>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <input 
            type="text" 
            placeholder="Search Registration..." 
            className="pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold outline-none focus:ring-4 focus:ring-blue-500/10 transition-all w-64"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {vehicles.length === 0 ? (
          <div className="col-span-full py-20 text-center text-slate-400 font-medium">No vehicles registered in core state.</div>
        ) : vehicles.map(v => (
          <div key={v.registration} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm transition-all hover:shadow-md">
            <div className="flex justify-between items-start mb-6">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-slate-50 text-slate-500 rounded-xl">
                  <Truck size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-800 uppercase tracking-tight">{v.registration}</h3>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className={`w-2 h-2 rounded-full ${getStatusColor(v.status)}`}></span>
                    <span className="text-[10px] font-black uppercase text-slate-400">{v.status}</span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p className="text-[10px] font-black text-slate-400 uppercase">Trust Index</p>
                <p className={`text-sm font-bold ${v.trustScore > 90 ? 'text-emerald-600' : 'text-amber-600'}`}>
                  {v.trustScore}%
                </p>
              </div>
            </div>

            <div className="space-y-4 py-4 border-y border-slate-50">
              <div className="flex justify-between text-xs">
                <span className="text-slate-400 font-bold uppercase tracking-wider">Assigned Route</span>
                <span className="font-bold text-slate-700">{v.route}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-400 font-bold uppercase tracking-wider">Branch Hub</span>
                <span className="font-bold text-slate-700">{v.branch}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-400 font-bold uppercase tracking-wider">Primary Driver</span>
                <span className="font-bold text-slate-700">{v.driver}</span>
              </div>
            </div>

            <div className="mt-6 flex gap-2">
              <button className="flex-1 py-2 text-[10px] font-black uppercase bg-slate-50 text-slate-600 rounded-lg hover:bg-slate-100 transition-colors flex items-center justify-center gap-2">
                <RefreshCw size={12} /> Reassign
              </button>
              <button className="flex-1 py-2 text-[10px] font-black uppercase bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors">
                Audit Log
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
