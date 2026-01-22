
import React, { useEffect, useState, useCallback } from 'react';
import { mosClient, unwrapCoreData } from '../services/mosClient';
import { Vehicle, CoreSyncState } from '../types';
import { Map, RefreshCw, MoreVertical, Plus, Truck, Clock } from 'lucide-react';

export const Fleet: React.FC = () => {
  const [fleet, setFleet] = useState<Vehicle[]>([]);
  const [syncState, setSyncState] = useState<CoreSyncState>('SYNCING');

  const fetchFleet = useCallback(async () => {
    const res = await mosClient.getVehicles();
    const data = unwrapCoreData(res, setSyncState);
    if (data) setFleet(data);
  }, []);

  useEffect(() => {
    fetchFleet();
  }, [fetchFleet]);

  const getStatusIndicator = (status: string) => {
    switch (status) {
      case 'active': return 'bg-emerald-500';
      case 'maintenance': return 'bg-amber-500';
      case 'idle': return 'bg-slate-400';
      case 'offline': return 'bg-rose-500';
      default: return 'bg-slate-300';
    }
  };

  if (syncState === 'SYNCING' && fleet.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-slate-400">
        <Clock className="animate-spin mb-4" size={32} />
        <p className="text-sm font-bold uppercase tracking-widest text-center">Synchronizing Fleet Registry...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Fleet Control</h1>
          <p className="text-slate-500 text-sm">Track vehicle lifecycle status and system assignments.</p>
        </div>
        <button 
          disabled={syncState === 'READ_ONLY'}
          className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-xl font-bold shadow-lg shadow-blue-200 hover:bg-blue-700 active:scale-95 transition-all text-sm disabled:opacity-30"
        >
          <Plus size={18} /> Register Vehicle
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {fleet.length === 0 ? (
          <div className="col-span-full py-20 text-center text-slate-400 font-medium border border-dashed border-slate-200 rounded-3xl">No vehicles identified in current core state.</div>
        ) : fleet.map((vehicle) => (
          <div key={vehicle.registration} className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm hover:shadow-xl transition-all group relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
              <Truck size={100} />
            </div>
            
            <div className="flex justify-between items-start mb-6">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-slate-50 text-slate-500 rounded-2xl flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-all duration-500 shadow-inner">
                  <Map size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-xl text-slate-800 uppercase tracking-tighter">{vehicle.registration}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`w-2 h-2 rounded-full ${getStatusIndicator(vehicle.status)}`}></span>
                    <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">{vehicle.status}</span>
                  </div>
                </div>
              </div>
              <button className="p-2 hover:bg-slate-50 rounded-xl text-slate-300 hover:text-slate-600 transition-colors">
                <MoreVertical size={20} />
              </button>
            </div>

            <div className="space-y-4 py-4 border-y border-slate-50">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400 font-bold uppercase tracking-widest">Route</span>
                <span className="font-bold text-slate-800 bg-slate-50 px-2 py-1 rounded-lg border border-slate-100">{vehicle.route}</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400 font-bold uppercase tracking-widest">Hub</span>
                <span className="font-bold text-slate-800">{vehicle.branch}</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400 font-bold uppercase tracking-widest">Trust</span>
                <span className={`font-bold px-2 py-0.5 rounded ${vehicle.trustScore > 90 ? 'text-emerald-600 bg-emerald-50' : 'text-amber-600 bg-amber-50'}`}>{vehicle.trustScore}%</span>
              </div>
            </div>

            <div className="mt-6 flex gap-3">
              <button 
                disabled={syncState === 'READ_ONLY'}
                className="flex-1 py-3 text-[10px] font-black uppercase bg-slate-900 text-white rounded-xl hover:bg-slate-800 transition-colors flex items-center justify-center gap-2 shadow-md active:scale-95 disabled:opacity-30"
              >
                <RefreshCw size={14} /> Reassign
              </button>
              <button className="px-4 py-3 text-[10px] font-black uppercase bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-100 transition-colors active:scale-95">
                History
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
