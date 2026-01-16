
import React, { useEffect, useState } from 'react';
import { mosApi } from '../services/api';
import { Trip } from '../types';
import { Search, Filter, Eye, MoreVertical } from 'lucide-react';

export const Trips: React.FC = () => {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    mosApi.getTrips().then(res => {
      setTrips(res);
      setLoading(false);
    });
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-emerald-100 text-emerald-700';
      case 'active': return 'bg-blue-100 text-blue-700';
      case 'scheduled': return 'bg-slate-100 text-slate-700';
      case 'cancelled': return 'bg-rose-100 text-rose-700';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Trip Management</h1>
          <p className="text-slate-500">Monitor and audit all SACCO trip activities.</p>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors">
            <Filter size={16} /> Filter
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm">
            Export Records
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex items-center gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Search by Trip ID, Vehicle or Route..." 
              className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-xs font-bold uppercase tracking-wider">
                <th className="px-6 py-4">Trip ID</th>
                <th className="px-6 py-4">Route</th>
                <th className="px-6 py-4">Vehicle</th>
                <th className="px-6 py-4">Branch</th>
                <th className="px-6 py-4">Start Time</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Revenue</th>
                <th className="px-6 py-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {loading ? (
                [...Array(5)].map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td colSpan={8} className="px-6 py-4"><div className="h-8 bg-slate-100 rounded"></div></td>
                  </tr>
                ))
              ) : trips.map((trip) => (
                <tr key={trip.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 font-mono font-medium text-blue-600">{trip.id}</td>
                  <td className="px-6 py-4 font-medium text-slate-800">{trip.route}</td>
                  <td className="px-6 py-4 text-slate-600">{trip.vehicle}</td>
                  <td className="px-6 py-4 text-slate-600">{trip.branch}</td>
                  <td className="px-6 py-4 text-slate-500">{trip.startTime}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold capitalize ${getStatusColor(trip.status)}`}>
                      {trip.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-bold text-slate-800">KES {trip.revenue.toLocaleString()}</td>
                  <td className="px-6 py-4">
                    <div className="flex justify-center gap-2">
                      <button className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                        <Eye size={18} />
                      </button>
                      <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
                        <MoreVertical size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="p-4 border-t border-slate-100 bg-slate-50/50 flex justify-between items-center text-xs text-slate-500 font-medium">
          <div>Showing {trips.length} of 1240 entries</div>
          <div className="flex gap-1">
            <button className="px-3 py-1 border border-slate-200 rounded hover:bg-white disabled:opacity-50" disabled>Previous</button>
            <button className="px-3 py-1 bg-blue-600 text-white rounded shadow-sm">1</button>
            <button className="px-3 py-1 border border-slate-200 rounded hover:bg-white">2</button>
            <button className="px-3 py-1 border border-slate-200 rounded hover:bg-white">Next</button>
          </div>
        </div>
      </div>
    </div>
  );
};
