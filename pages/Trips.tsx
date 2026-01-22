
import React, { useState } from 'react';
import { coreClient } from '../services/coreClient';
import { useCore } from '../hooks/useCore';
import { Trip } from '../types';
import { Play, Eye, MoreHorizontal, AlertCircle, CheckCircle2, Clock, RefreshCw } from 'lucide-react';

export const Trips: React.FC = () => {
  const { data: trips, syncState, isBroken, reset, retry } = useCore<Trip[]>(coreClient.getTrips, 30000);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error', message: string } | null>(null);

  const handleDispatch = async (tripId: string) => {
    if (syncState === 'READ_ONLY') return;
    setFeedback(null);
    try {
      const res = await coreClient.dispatch('dispatchTrip', { tripId });
      if (res.data?.success) {
        setFeedback({ type: 'success', message: res.data.message });
      }
    } catch (err: any) {
      setFeedback({ type: 'error', message: 'Intent processing failure.' });
    }
  };

  if (isBroken) {
    return (
      <div className="min-h-[400px] flex flex-col items-center justify-center p-8 bg-white rounded-3xl border border-rose-100 text-center">
        <AlertCircle size={48} className="text-rose-600 mb-6" />
        <h2 className="text-xl font-bold">Operational Context Lost</h2>
        <p className="text-slate-500 mt-2">MOS Core is unreachable after multiple attempts.</p>
        <button onClick={reset} className="mt-6 px-6 py-2 bg-slate-900 text-white rounded-xl font-bold">Reset Interface</button>
      </div>
    );
  }

  const statusMap = {
    completed: 'bg-emerald-50 text-emerald-600',
    active: 'bg-blue-50 text-blue-600',
    scheduled: 'bg-slate-50 text-slate-600',
    cancelled: 'bg-rose-50 text-rose-600',
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Operational Log</h1>
          <p className="text-slate-500 text-sm">Managing current system-authorized trips.</p>
        </div>
        <button onClick={() => retry()} className="p-2 hover:bg-slate-100 rounded-lg transition-all">
          <RefreshCw size={20} className={syncState === 'SYNCING' ? 'animate-spin' : ''} />
        </button>
      </div>

      {feedback && (
        <div className={`p-4 rounded-2xl flex items-center gap-3 ${
          feedback.type === 'success' ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
        }`}>
          {feedback.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
          <span className="text-sm font-bold">{feedback.message}</span>
        </div>
      )}

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-100 text-[10px] font-black uppercase tracking-widest text-slate-400">
            <tr>
              <th className="px-6 py-4">ID</th>
              <th className="px-6 py-4">Route</th>
              <th className="px-6 py-4">Vehicle</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Revenue</th>
              <th className="px-6 py-4 text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm">
            {(trips || []).map((trip) => (
              <tr key={trip.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4 font-mono font-bold text-blue-600">{trip.id}</td>
                <td className="px-6 py-4 font-bold text-slate-800">{trip.route}</td>
                <td className="px-6 py-4 text-slate-600">{trip.vehicle}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${statusMap[trip.status]}`}>
                    {trip.status}
                  </span>
                </td>
                <td className="px-6 py-4 font-bold">KES {trip.revenue.toLocaleString()}</td>
                <td className="px-6 py-4">
                  <div className="flex justify-center gap-2">
                    <button className="p-2 text-slate-300 hover:text-blue-600 border border-slate-100 rounded-lg"><Eye size={16} /></button>
                    {trip.status === 'scheduled' && (
                      <button 
                        onClick={() => handleDispatch(trip.id)}
                        disabled={syncState === 'READ_ONLY'}
                        className="px-3 py-1 bg-blue-600 text-white rounded-lg text-[10px] font-bold"
                      >
                        Dispatch
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
