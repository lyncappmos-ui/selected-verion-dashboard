
import React, { useEffect, useState, useCallback } from 'react';
import { mosClient, unwrapCoreData, safeCurrency } from '../services/mosClient';
import { Trip, CoreSyncState } from '../types';
import { Search, Filter, Play, Eye, MoreHorizontal, AlertCircle, CheckCircle2, Clock } from 'lucide-react';

export const Trips: React.FC = () => {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [syncState, setSyncState] = useState<CoreSyncState>('SYNCING');
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error', message: string } | null>(null);

  const fetchTrips = useCallback(async () => {
    const res = await mosClient.getTrips();
    const data = unwrapCoreData(res, setSyncState);
    if (data) setTrips(data);
  }, []);

  useEffect(() => {
    fetchTrips();
  }, [fetchTrips]);

  const handleDispatch = async (tripId: string) => {
    if (syncState === 'READ_ONLY') return;
    setFeedback(null);
    try {
      const res = await mosClient.dispatch('dispatchTrip', { tripId });
      const data = unwrapCoreData(res);
      if (data?.success) {
        setFeedback({ type: 'success', message: data.message });
        setTrips(prev => prev.map(t => t.id === tripId ? { ...t, status: 'active' } : t));
      }
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

  if (syncState === 'SYNCING' && trips.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-slate-400">
        <Clock className="animate-spin mb-4" size={32} />
        <p className="text-sm font-bold uppercase tracking-widest text-center">Synchronizing Operational Log...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Operational Log</h1>
          <p className="text-slate-500 text-sm">Monitor system-authorized trips and manage operational intents.</p>
        </div>
        <div className="flex gap-2">
          {syncState === 'READ_ONLY' && (
            <div className="bg-slate-800 text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
              Read Only Mode
            </div>
          )}
          <button className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-600 flex items-center gap-2 hover:bg-slate-50 transition-all shadow-sm">
            <Filter size={16} /> Filters
          </button>
          <button 
            disabled={syncState === 'READ_ONLY'}
            className="px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold shadow-md hover:bg-blue-700 transition-all disabled:opacity-30"
          >
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
              {trips.length === 0 ? (
                <tr><td colSpan={7} className="px-6 py-20 text-center text-slate-400">No active operational logs.</td></tr>
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
                  <td className="px-6 py-5 font-bold text-slate-800">{safeCurrency(trip.revenue)}</td>
                  <td className="px-6 py-5">
                    <div className="flex justify-center gap-2">
                      <button className="p-2 text-slate-300 hover:text-blue-600 bg-white border border-slate-100 rounded-lg transition-all shadow-sm">
                        <Eye size={16} />
                      </button>
                      {trip.status === 'scheduled' && (
                        <button 
                          onClick={() => handleDispatch(trip.id)}
                          disabled={syncState === 'READ_ONLY'}
                          className="px-3 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-bold hover:bg-blue-700 transition-all shadow-md flex items-center gap-1.5 disabled:opacity-30"
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
