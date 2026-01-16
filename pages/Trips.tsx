
import React, { useEffect, useState } from 'react';
import { mosClient } from '../services/mosClient';
import { Trip } from '../types';
import { Search, Filter, Play, Eye, MoreHorizontal, AlertCircle, CheckCircle2 } from 'lucide-react';

export const Trips: React.FC = () => {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error', message: string } | null>(null);

  useEffect(() => {
    mosClient.getTrips().then(res => {
      setTrips(res);
      setLoading(false);
    });
  }, []);

  const handleDispatch = async (tripId: string) => {
    setFeedback(null);
    try {
      const res = await mosClient.dispatch('dispatchTrip', { tripId });
      setFeedback({ type: 'success', message: res.message });
      setTrips(prev => prev.map(t => t.id === tripId ? { ...t, status: 'active' } : t));
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message });
    }
  };

  const statusMap = {
    completed: 'bg-emerald-50 text-emerald-600',
    active: 'bg-blue-50 text-blue-600',
    scheduled: 'bg-slate-50 text-slate-600',
    cancelled: 'bg-rose-50 text-rose-600',
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Operational Log</h1>
          <p className="text-slate-500 text-sm">Monitor system-authorized trips and manage operational intents.</p>
        </div>
        <div className="flex gap-2">
          <button className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-600 flex items-center gap-2 hover:bg-slate-50 transition-all">
            <Filter size={16} /> Filters
          </button>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold shadow-md hover:bg-blue-700 transition-all">
            Create Trip Intent
          </button>
        </div>
      </div>

      {feedback && (
        <div className={`p-4 rounded-2xl flex items-center gap-3 animate-in fade-in slide-in-from-top-4 ${
          feedback.type === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-rose-50 text-rose-700 border border-rose-100'
        }`}>
          {feedback.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
          <span className="text-sm font-bold">{feedback.message}</span>
        </div>
      )}

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 bg-slate-50/50">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input 
              type="text" 
              placeholder="Filter by Trip ID, Vehicle or Route..." 
              className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm outline-none focus:ring-4 focus:ring-blue-500/10 transition-all"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 text-slate-400 text-[10px] font-black uppercase tracking-widest border-b border-slate-100">
                <th className="px-6 py-4">ID</th>
                <th className="px-6 py-4">Route</th>
                <th className="px-6 py-4">Vehicle</th>
                <th className="px-6 py-4">Branch</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Revenue</th>
                <th className="px-6 py-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {loading ? (
                [...Array(3)].map((_, i) => (
                  <tr key={i} className="animate-pulse"><td colSpan={7} className="px-6 py-6"><div className="h-6 bg-slate-100 rounded"></div></td></tr>
                ))
              ) : trips.map((trip) => (
                <tr key={trip.id} className="hover:bg-slate-50 transition-colors group">
                  <td className="px-6 py-5 font-mono font-bold text-blue-600">{trip.id}</td>
                  <td className="px-6 py-5 font-semibold text-slate-700">{trip.route}</td>
                  <td className="px-6 py-5 text-slate-600">{trip.vehicle}</td>
                  <td className="px-6 py-5 text-slate-400">{trip.branch}</td>
                  <td className="px-6 py-5">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-tight ${statusMap[trip.status]}`}>
                      {trip.status}
                    </span>
                  </td>
                  <td className="px-6 py-5 font-bold text-slate-800">KES {trip.revenue.toLocaleString()}</td>
                  <td className="px-6 py-5">
                    <div className="flex justify-center gap-2">
                      <button className="p-2 text-slate-300 hover:text-blue-600 bg-white border border-slate-100 rounded-lg transition-all shadow-sm">
                        <Eye size={16} />
                      </button>
                      {trip.status === 'scheduled' && (
                        <button 
                          onClick={() => handleDispatch(trip.id)}
                          className="px-3 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-bold hover:bg-blue-700 transition-all shadow-md flex items-center gap-1.5"
                        >
                          <Play size={12} fill="currentColor" /> Dispatch
                        </button>
                      )}
                      <button className="p-2 text-slate-300 hover:text-slate-600 rounded-lg transition-all">
                        <MoreHorizontal size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
