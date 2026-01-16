
import React, { useEffect, useState } from 'react';
import { mosApi } from '../services/api';
import { Vehicle } from '../types';
import { Map, RefreshCw, MoreVertical, Plus } from 'lucide-react';

export const Fleet: React.FC = () => {
  const [fleet, setFleet] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    mosApi.getFleet().then(res => {
      setFleet(res);
      setLoading(false);
    });
  }, []);

  const getStatusIndicator = (status: string) => {
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Fleet Management</h1>
          <p className="text-slate-500">Track vehicle status and manage route assignments.</p>
        </div>
        <button className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-all shadow-md">
          <Plus size={20} /> Add New Vehicle
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {loading ? (
           [...Array(3)].map((_, i) => <div key={i} className="h-48 bg-slate-200 rounded-2xl animate-pulse"></div>)
        ) : fleet.map((vehicle) => (
          <div key={vehicle.registration} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-all group">
            <div className="flex justify-between items-start mb-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center text-slate-500 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                  <Map size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-slate-800 uppercase">{vehicle.registration}</h3>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className={`w-2 h-2 rounded-full ${getStatusIndicator(vehicle.status)}`}></span>
                    <span className="text-xs font-bold text-slate-500 capitalize tracking-tight">{vehicle.status}</span>
                  </div>
                </div>
              </div>
              <button className="p-2 hover:bg-slate-100 rounded-lg text-slate-400">
                <MoreVertical size={20} />
              </button>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Assigned Route</span>
                <span className="font-semibold text-slate-700">{vehicle.route}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Hub Branch</span>
                <span className="font-semibold text-slate-700">{vehicle.branch}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Last Active</span>
                <span className="font-medium text-blue-600">{vehicle.lastActive}</span>
              </div>
            </div>

            <div className="mt-6 flex gap-2">
              <button className="flex-1 py-2 text-xs font-bold bg-slate-100 text-slate-600 rounded-lg hover:bg-slate-200 transition-colors flex items-center justify-center gap-2">
                <RefreshCw size={14} /> Reassign Route
              </button>
              <button className="px-4 py-2 text-xs font-bold bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors">
                View History
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
